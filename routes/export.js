const express = require("express");
const mongoose = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const { ZipArchive } = require("archiver");

const { marksheetDB } = require("../connectdb");

const router = express.Router();


// ============================================================
// CONFIGURATION
// ============================================================

const CLASS_GROUPS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class1",
  "Class2",
  "Class3",
  "Class4",
  "Class5",
  "Class6",
  "Class7",
  "Class8"
];

const MODELS_ROOT = path.resolve(__dirname, "../models");
const ASSETS_PATH = path.resolve(__dirname, "../assets");
const BACKUP_STATUS_FILE = path.resolve(
  __dirname,
  "../logs/export-status.json"
);

const DAY_MS = 24 * 60 * 60 * 1000;


// ============================================================
// AUTHENTICATION
// Every export endpoint is restricted to SUPERADMIN.
// Requires the existing stadminis JWT cookie and JWTKEYIS.
// ============================================================

function readCookie(req, cookieName) {
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }

  const cookieHeader = req.headers.cookie || "";
  const item = cookieHeader
    .split(";")
    .map(value => value.trim())
    .find(value => value.startsWith(`${cookieName}=`));

  return item ? decodeURIComponent(item.slice(cookieName.length + 1)) : null;
}

function requireSuperAdmin(req, res, next) {
  try {
    const token = readCookie(req, "stadminis");

    if (!token) {
      return res.status(401).send("Admin login required.");
    }

    if (!process.env.JWTKEYIS) {
      console.error("JWTKEYIS is missing from environment variables.");
      return res.status(500).send("Authentication configuration error.");
    }

    const payload = jwt.verify(token, process.env.JWTKEYIS);
    const role = String(payload.role || "").toLowerCase();

    if (role !== "superadmin" && payload.supAd !== true) {
      return res.status(403).send("Superadmin access required.");
    }

    req.exportAdmin = payload;
    next();
  } catch (error) {
    console.error("Export authentication failed:", error.message);
    return res.status(401).send("Your admin session is invalid or expired.");
  }
}

router.use(requireSuperAdmin);


// ============================================================
// MODEL REGISTRY
// Recursively reads JavaScript model files inside each class
// directory. Actual MongoDB collections remain the source of
// truth for export options.
// ============================================================

const classwiseGroups = {};
const classwiseModels = {};
const collectionModelMap = {};

function getModelExport(moduleValue) {
  if (moduleValue && moduleValue.default) return moduleValue.default;
  return moduleValue;
}

function collectJavaScriptFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const result = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...collectJavaScriptFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".js") &&
      !entry.name.endsWith(".test.js")
    ) {
      result.push(fullPath);
    }
  }

  return result;
}

function registerModel(Model, group, sourceFile) {
  if (
    !Model ||
    typeof Model !== "function" ||
    !Model.modelName ||
    !Model.collection ||
    !Model.collection.collectionName
  ) {
    return;
  }

  // Do not accidentally export models connected to the main DB.
  if (Model.db !== marksheetDB) {
    console.warn(
      `[EXPORT] Skipping ${Model.modelName}: model is not connected to marksheetDB (${sourceFile})`
    );
    return;
  }

  const info = {
    name: Model.modelName,
    collection: Model.collection.collectionName,
    group,
    sourceFile
  };

  classwiseGroups[group] ||= [];

  // Avoid registering the same collection more than once.
  if (!classwiseGroups[group].some(item => item.collection === info.collection)) {
    classwiseGroups[group].push(info);
  }

  classwiseModels[info.name] = info;
  collectionModelMap[info.collection] = info;
}

function registerExportedModels(exportedValue, group, sourceFile, seen = new Set(), depth = 0) {
  if (!exportedValue || depth > 4) return;

  if (
    typeof exportedValue === "function" &&
    exportedValue.modelName &&
    exportedValue.collection
  ) {
    registerModel(exportedValue, group, sourceFile);
    return;
  }

  if (typeof exportedValue !== "object" || seen.has(exportedValue)) return;
  seen.add(exportedValue);

  for (const value of Object.values(exportedValue)) {
    registerExportedModels(value, group, sourceFile, seen, depth + 1);
  }
}

function loadClasswiseModels() {
  for (const group of CLASS_GROUPS) {
    const groupDirectory = path.join(MODELS_ROOT, group);
    const files = collectJavaScriptFiles(groupDirectory);

    for (const filePath of files) {
      try {
        const exported = getModelExport(require(filePath));
        registerExportedModels(exported, group, filePath);
      } catch (error) {
        console.error(
          `[EXPORT] Could not load model ${filePath}:`,
          error.message
        );
      }
    }
  }

  // Optional standalone student list model.
  const studentModelPath = path.join(MODELS_ROOT, "studentlist.js");

  if (fs.existsSync(studentModelPath)) {
    try {
      const StudentModel = getModelExport(require(studentModelPath));
      registerExportedModels(StudentModel, "Other Marksheet Models", studentModelPath);
    } catch (error) {
      console.error(
        "[EXPORT] Could not load studentlist model:",
        error.message
      );
    }
  }

  for (const group of Object.keys(classwiseGroups)) {
    classwiseGroups[group].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  console.log(
    `[EXPORT] Registered ${Object.keys(classwiseModels).length} marksheet models.`
  );
}

loadClasswiseModels();


// ============================================================
// DATABASE HELPERS
// ============================================================

function getMainDB() {
  return mongoose.connection && mongoose.connection.readyState === 1
    ? mongoose.connection.db
    : null;
}

function getMarksheetDB() {
  return marksheetDB && marksheetDB.readyState === 1
    ? marksheetDB.db
    : null;
}

async function listCollections(db) {
  if (!db) throw new Error("Database connection is not ready.");

  return db
    .listCollections({ type: "collection" }, { nameOnly: true })
    .toArray();
}

async function collectionExists(db, collectionName) {
  const names = await listCollections(db);
  return names.some(item => item.name === collectionName);
}

function safeFilename(value) {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\.\./g, "_")
    .trim() || "export";
}

function csvValue(value) {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    value = value.toISOString();
  } else if (value && typeof value === "object") {
    value = JSON.stringify(value);
  }

  value = String(value);

  // Excel formula-injection protection.
  if (/^[\s]*[=+@]/.test(value) || /^[\s]*-[^0-9.]/.test(value)) {
    value = "'" + value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

function toCSV(documents) {
  if (!documents.length) return "";

  const fields = [
    ...new Set(documents.flatMap(document => Object.keys(document)))
  ];

  const header = fields.map(csvValue).join(",");

  const rows = documents.map(document =>
    fields.map(field => csvValue(document[field])).join(",")
  );

  return [header, ...rows].join("\r\n");
}

async function sendCollectionExport(req, res, db, collectionName) {
  const format = String(req.query.format || "csv").toLowerCase();

  if (!["csv", "json"].includes(format)) {
    return res.status(400).send("Format must be csv or json.");
  }

  if (!(await collectionExists(db, collectionName))) {
    return res.status(404).send("Collection not found.");
  }

  const documents = await db
    .collection(collectionName)
    .find({})
    .toArray();

  const filename = safeFilename(collectionName);

  res.setHeader("Cache-Control", "no-store");

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.csv"`
    );

    return res.send("\uFEFF" + toCSV(documents));
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}.json"`
  );

  return res.send(JSON.stringify(documents, null, 2));
}


// ============================================================
// BACKUP STATUS
// The timer is updated only after the complete ZIP response
// finishes successfully. Assets and single-collection exports
// do not reset the full-database backup timer.
// ============================================================

function readLastFullBackup() {
  try {
    if (!fs.existsSync(BACKUP_STATUS_FILE)) return null;

    const parsed = JSON.parse(
      fs.readFileSync(BACKUP_STATUS_FILE, "utf8")
    );

    if (!parsed.lastFullExportAt) return null;

    const date = new Date(parsed.lastFullExportAt);

    return Number.isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("[EXPORT] Backup status read error:", error.message);
    return null;
  }
}

function saveFullBackupStatus() {
  fs.mkdirSync(path.dirname(BACKUP_STATUS_FILE), {
    recursive: true
  });

  const tempFile = `${BACKUP_STATUS_FILE}.tmp`;
  const payload = {
    lastFullExportAt: new Date().toISOString()
  };

  fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2), "utf8");
  fs.renameSync(tempFile, BACKUP_STATUS_FILE);
}

function getBackupIndicator() {
  const lastExport = readLastFullBackup();

  if (!lastExport) {
    return {
      level: "danger",
      title: "Backup Required",
      message: "No successful complete database backup has been recorded. Export the complete database now.",
      days: null,
      lastExport: null
    };
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - lastExport.getTime()) / DAY_MS)
  );

  if (days >= 15) {
    return {
      level: "danger",
      title: "Critical Backup Warning",
      message: "Your last complete database backup is 15 or more days old. Export immediately.",
      days,
      lastExport: lastExport.toISOString()
    };
  }

  if (days >= 7) {
    return {
      level: "warning",
      title: "Weekly Backup Due",
      message: "Your last complete database backup is 7 or more days old. Export your data this week.",
      days,
      lastExport: lastExport.toISOString()
    };
  }

  return {
    level: "success",
    title: "Backup Up To Date",
    message: "Your last complete database backup is less than 7 days old.",
    days,
    lastExport: lastExport.toISOString()
  };
}


// ============================================================
// ZIP HELPERS (Archiver 8.x)
// ============================================================

function createZipResponse(res, filename) {
  const archive = new ZipArchive({
    zlib: { level: 6 }
  });

  archive.on("warning", error => {
    console.warn("[EXPORT] ZIP warning:", error.message);
  });

  archive.on("error", error => {
    console.error("[EXPORT] ZIP error:", error);

    if (!res.headersSent) {
      res.status(500).end("ZIP generation failed.");
    } else if (!res.destroyed) {
      res.destroy(error);
    }
  });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeFilename(filename)}"`
  );
  res.setHeader("Cache-Control", "no-store");

  archive.pipe(res);
  return archive;
}

function recordBackupOnlyAfterSuccessfulResponse(archive, res) {
  let archiveEnded = false;
  let responseFinished = false;
  let saved = false;

  const saveIfSuccessful = () => {
    if (saved || !archiveEnded || !responseFinished) return;
    saved = true;

    try {
      saveFullBackupStatus();
      console.log("[EXPORT] Full backup timestamp updated.");
    } catch (error) {
      console.error("[EXPORT] Could not save backup timestamp:", error);
    }
  };

  archive.once("end", () => {
    archiveEnded = true;
    saveIfSuccessful();
  });

  res.once("finish", () => {
    responseFinished = true;
    saveIfSuccessful();
  });
}

async function appendCollectionAsCSV(archive, db, collectionName, archivePath) {
  const documents = await db
    .collection(collectionName)
    .find({})
    .toArray();

  const csv = "\uFEFF" + toCSV(documents);

  archive.append(Buffer.from(csv, "utf8"), {
    name: archivePath
  });

  console.log(
    `[EXPORT] Added ${archivePath} (${documents.length} records)`
  );
}


// ============================================================
// EXPORT DASHBOARD
// Renders views/admin/export.ejs
// ============================================================

router.get("/admin/export", async (req, res) => {
  try {
    const mainDB = getMainDB();
    const markDB = getMarksheetDB();

    if (!mainDB || !markDB) {
      return res.status(503).send("Both MongoDB databases must be connected.");
    }

    const [mainItems, markItems] = await Promise.all([
      listCollections(mainDB),
      listCollections(markDB)
    ]);

    const mainCollections = mainItems
      .map(item => item.name)
      .sort();

    const markCollections = markItems
      .map(item => item.name)
      .sort();

    const groups = Object.entries(classwiseGroups)
      .map(([name, models]) => ({
        name,
        count: models.filter(model => markCollections.includes(model.collection)).length
      }))
      .filter(group => group.count > 0);

    const modelDetails = markCollections.map(collection => {
      const model = collectionModelMap[collection];

      return {
        collection,
        modelName: model ? model.name : collection,
        group: model ? model.group : "Other Marksheet Collections"
      };
    });

    return res.render("admin/export", {
      mainCollections,
      markCollections,
      groups,
      modelDetails,
      mainCount: mainCollections.length,
      markCount: markCollections.length,
      backupStatus: getBackupIndicator()
    });
  } catch (error) {
    console.error("[EXPORT] Dashboard error:", error);
    return res.status(500).send("Unable to load export dashboard.");
  }
});


// ============================================================
// BACKUP STATUS API
// ============================================================

router.get("/admin/export/status", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  return res.json(getBackupIndicator());
});


// ============================================================
// 1. INDIVIDUAL MAIN DATABASE COLLECTION - CSV / JSON
// ============================================================

router.get("/admin/export/main/:collection", async (req, res) => {
  try {
    const db = getMainDB();
    if (!db) return res.status(503).send("Main database unavailable.");

    return await sendCollectionExport(
      req,
      res,
      db,
      req.params.collection
    );
  } catch (error) {
    console.error("[EXPORT] Main collection error:", error);
    if (!res.headersSent) return res.status(500).send("Collection export failed.");
    return res.destroy(error);
  }
});


// ============================================================
// 2 & 4. INDIVIDUAL MARKSHEET COLLECTION / MODEL - CSV / JSON
// Every actual collection is exported separately.
// ============================================================

router.get("/admin/export/marksheet/:collection", async (req, res) => {
  try {
    const db = getMarksheetDB();
    if (!db) return res.status(503).send("Marksheet database unavailable.");

    return await sendCollectionExport(
      req,
      res,
      db,
      req.params.collection
    );
  } catch (error) {
    console.error("[EXPORT] Marksheet collection error:", error);
    if (!res.headersSent) return res.status(500).send("Marksheet export failed.");
    return res.destroy(error);
  }
});


// ============================================================
// 3. ONE CLASS GROUP - ZIP
// Each model collection becomes its own CSV inside the ZIP.
// ============================================================

router.get("/admin/export/classwise/group/:group", async (req, res) => {
  let archive;

  try {
    const db = getMarksheetDB();
    if (!db) return res.status(503).send("Marksheet database unavailable.");

    const group = req.params.group;
    const models = classwiseGroups[group];

    if (!models || !models.length) {
      return res.status(404).send("No models registered for this class.");
    }

    const existing = new Set(
      (await listCollections(db)).map(item => item.name)
    );

    const selectedModels = models.filter(model =>
      existing.has(model.collection)
    );

    if (!selectedModels.length) {
      return res.status(404).send("No collections found for this class.");
    }

    archive = createZipResponse(
      res,
      `${safeFilename(group)}-backup.zip`
    );

    res.once("close", () => {
      if (!res.writableFinished && archive) archive.abort();
    });

    for (const model of selectedModels) {
      await appendCollectionAsCSV(
        archive,
        db,
        model.collection,
        `${safeFilename(group)}/${safeFilename(model.name)}.csv`
      );
    }

    await archive.finalize();
  } catch (error) {
    console.error("[EXPORT] Classwise ZIP error:", error);
    if (archive) archive.abort();

    if (!res.headersSent) return res.status(500).send("Classwise ZIP export failed.");
    if (!res.destroyed) res.destroy(error);
  }
});


// ============================================================
// 4. ALL CLASS GROUPS - ZIP
// One CSV file per real collection. No collection merging.
// ============================================================

router.get("/admin/export/classwise/all", async (req, res) => {
  let archive;

  try {
    const db = getMarksheetDB();
    if (!db) return res.status(503).send("Marksheet database unavailable.");

    const existing = new Set(
      (await listCollections(db)).map(item => item.name)
    );

    const allModels = Object.values(classwiseModels)
      .filter(model => existing.has(model.collection));

    if (!allModels.length) {
      return res.status(404).send("No classwise model collections found.");
    }

    archive = createZipResponse(res, "all-classwise-backup.zip");

    res.once("close", () => {
      if (!res.writableFinished && archive) archive.abort();
    });

    for (const model of allModels) {
      await appendCollectionAsCSV(
        archive,
        db,
        model.collection,
        `${safeFilename(model.group)}/${safeFilename(model.name)}.csv`
      );
    }

    await archive.finalize();
  } catch (error) {
    console.error("[EXPORT] All classwise ZIP error:", error);
    if (archive) archive.abort();

    if (!res.headersSent) return res.status(500).send("All classwise ZIP export failed.");
    if (!res.destroyed) res.destroy(error);
  }
});


// ============================================================
// 5. COMPLETE DATABASE BACKUP - BOTH DATABASES
// Every MongoDB collection is a separate CSV file.
// Successful delivery updates the 7/15-day backup indicator.
// ============================================================

router.get("/admin/export/complete", async (req, res) => {
  let archive;

  try {
    const mainDB = getMainDB();
    const markDB = getMarksheetDB();

    if (!mainDB || !markDB) {
      return res.status(503).send("Both databases must be connected.");
    }

    const [mainItems, markItems] = await Promise.all([
      listCollections(mainDB),
      listCollections(markDB)
    ]);

    const totalCollections = mainItems.length + markItems.length;

    if (!totalCollections) {
      return res.status(404).send("No database collections found.");
    }

    archive = createZipResponse(res, "complete-mongodb-backup.zip");

    res.once("close", () => {
      if (!res.writableFinished && archive) archive.abort();
    });

    recordBackupOnlyAfterSuccessfulResponse(archive, res);

    for (const item of mainItems) {
      await appendCollectionAsCSV(
        archive,
        mainDB,
        item.name,
        `MainDB/${safeFilename(item.name)}.csv`
      );
    }

    for (const item of markItems) {
      const collection = item.name;
      const model = collectionModelMap[collection];

      const group = model ? model.group : "Other";
      const displayName = model ? model.name : collection;

      await appendCollectionAsCSV(
        archive,
        markDB,
        collection,
        `MarksheetDB/${safeFilename(group)}/${safeFilename(displayName)}.csv`
      );
    }

    await archive.finalize();

    console.log(
      `[EXPORT] Complete backup archive finalized: ${totalCollections} separate collection files.`
    );
  } catch (error) {
    console.error("[EXPORT] Complete backup error:", error);
    if (archive) archive.abort();

    if (!res.headersSent) return res.status(500).send("Complete database backup failed.");
    if (!res.destroyed) res.destroy(error);
  }
});


// ============================================================
// 6. WEBSITE ASSETS - ZIP
// Includes the complete project assets/ directory only.
// Does not reset the database backup timer.
// ============================================================

router.get("/admin/export/assets", async (req, res) => {
  let archive;

  try {
    const stats = await fs.promises.stat(ASSETS_PATH).catch(() => null);

    if (!stats || !stats.isDirectory()) {
      return res.status(404).send("The assets directory was not found.");
    }

    await fs.promises.access(ASSETS_PATH, fs.constants.R_OK);

    archive = createZipResponse(
      res,
      `st-columbus-assets-${new Date().toISOString().slice(0, 10)}.zip`
    );

    res.once("close", () => {
      if (!res.writableFinished && archive) archive.abort();
    });

    archive.directory(ASSETS_PATH, "assets");

    await archive.finalize();

    console.log("[EXPORT] Assets ZIP finalized.");
  } catch (error) {
    console.error("[EXPORT] Assets ZIP error:", error);
    if (archive) archive.abort();

    if (!res.headersSent) return res.status(500).send("Assets ZIP export failed.");
    if (!res.destroyed) res.destroy(error);
  }
});


module.exports = router;
