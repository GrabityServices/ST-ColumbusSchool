/* New standalone Scholastic Area + Attendance bulk-entry routes. */
const express = require("express");
const router = express.Router();

const studentlist = require("../models/studentlist");
const SchoolistAssessment = require("../models/schoolist");
const Attendance = require("../models/attendance");

const CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];
const TERMS = ["I", "II"];

const SCHOLASTIC_FIELDS = [
  ["listeningSkill", "LISTENING SKILL"],
  ["speakingSkill", "SPEAKING SKILL"],
  ["readingSkill", "READING SKILL"],
  ["writingSkill", "WRITING SKILL"],
  ["collaborationCooperation", "COLLABORATION & COOPERATION"],
  ["relationsWithPeers", "RELATIONS WITH PEERS"],
  ["relationsWithTeachers", "RELATIONS WITH TEACHERS"],
  ["disciplinePunctualityRegularity", "DISCIPLINE, PUNCTUALITY & REGULARITY"],
  [
    "cleanlinessHairHandsNailsShoesUniform",
    "CLEANLINESS (HAIR, HANDS, NAILS, SHOES & UNIFORM)",
  ],
  ["artAndCraft", "ART AND CRAFT"],
  ["drawing", "DRAWING"],
  ["musicDanceDrama", "MUSIC, DANCE, DRAMA"],
].map(([key, label]) => ({ key, label }));

const clean = (v) => String(v ?? "").trim();
const normalizeClass = (v) =>
  clean(v)
    .toUpperCase()
    .replace(/^STD[-\s]*/, "")
    .replace(/^CLASS[-\s]*/, "");
const classLabel = (c) =>
  ["Nursery", "LKG", "UKG"].includes(c) ? c : `Class ${c}`;
const academicYear = () => {
  const d = new Date();
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${String(y + 1).slice(-2)}`;
};

function studentIdentity(row) {
  const admissionNumber = clean(
    row?.admissionNumber ?? row?.admissionNo ?? row?.admission_no,
  );
  if (!admissionNumber) return null;
  return {
    admissionNumber,
    name: clean(row?.name ?? row?.studentName ?? row?.student_name),
    rollNumber: row?.rollNumber ?? row?.rollNo ?? row?.roll ?? "",
    section: clean(row?.section).toUpperCase(),
    className: clean(
      row?.className ?? row?.class ?? row?.standard ?? row?.classNo,
    ),
  };
}

async function getStudents(className) {
  const target = normalizeClass(className);
  const rows = await studentlist.find({}).lean();
  const map = new Map();

  for (const row of rows) {
    const s = studentIdentity(row);
    if (!s || normalizeClass(s.className) !== target) continue;
    if (!map.has(s.admissionNumber))
      map.set(s.admissionNumber, { ...s, className });
  }

  return [...map.values()].sort((a, b) => {
    const sa = a.section || "",
      sb = b.section || "";
    if (!sa && sb) return 1;
    if (sa && !sb) return -1;
    const sc = sa.localeCompare(sb, undefined, {
      numeric: true,
      sensitivity: "base",
    });
    if (sc) return sc;
    const ra = Number(a.rollNumber),
      rb = Number(b.rollNumber);
    if (Number.isFinite(ra) && Number.isFinite(rb) && ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function valid(className, term, type) {
  return (
    CLASSES.includes(className) &&
    TERMS.includes(term) &&
    ["scholastic", "attendance"].includes(type)
  );
}

router.get("/schoolist-attendance", (req, res) => {
  res.render("schoolistAttendance.ejs", {
    classes: CLASSES,
    classLabel,
    success: req.query.success
      ? `Saved ${req.query.success} student record(s).`
      : null,
    error: null,
  });
});

router.post("/schoolist-attendance/load", async (req, res) => {
  try {
    const className = clean(req.body.className);
    const term = clean(req.body.term);
    const assessmentType = clean(req.body.assessmentType).toLowerCase();
    const year = clean(req.body.academicYear) || academicYear();

    if (!valid(className, term, assessmentType))
      return res.status(400).send("Invalid class, term or assessment type.");

    const students = await getStudents(className);
    const ids = students.map((s) => s.admissionNumber);
    const termKey = term === "I" ? "termI" : "termII";
    const existing = new Map();

    if (ids.length) {
      const Model =
        assessmentType === "scholastic" ? SchoolistAssessment : Attendance;
      const docs = await Model.find({
        academicYear: year,
        className,
        admissionNumber: { $in: ids },
      }).lean();
      docs.forEach((d) => existing.set(String(d.admissionNumber), d));
    }

    const finalStudents = students.map((s) => {
      const data = existing.get(s.admissionNumber)?.[termKey] || {};
      const values =
        assessmentType === "scholastic"
          ? Object.fromEntries(
              SCHOLASTIC_FIELDS.map((f) => [f.key, clean(data[f.key])]),
            )
          : {
              workingDays: data.workingDays ?? "",
              present: data.present ?? "",
              absent: data.absent ?? "",
            };
      return { ...s, values };
    });

    res.render("schoolistAttendanceStudents.ejs", {
      className,
      classLabel: classLabel(className),
      term,
      termLabel: term === "I" ? "Term I" : "Term II",
      assessmentType,
      academicYear: year,
      fields: SCHOLASTIC_FIELDS,
      students: finalStudents,
      totalStudents: finalStudents.length,
    });
  } catch (e) {
    console.error("SCHOOLIST/ATTENDANCE LOAD ERROR:", e);
    res.status(500).send("Unable to load students.");
  }
});

router.post("/schoolist-attendance/save", async (req, res) => {
  try {
    const className = clean(req.body.className);
    const term = clean(req.body.term);
    const assessmentType = clean(req.body.assessmentType).toLowerCase();
    const year = clean(req.body.academicYear) || academicYear();
    if (!valid(className, term, assessmentType))
      return res.status(400).send("Invalid class, term or assessment type.");

    const rows = Array.isArray(req.body.rows)
      ? req.body.rows
      : Object.values(req.body.rows || {});
    const students = await getStudents(className);
    const byAdmission = new Map(students.map((s) => [s.admissionNumber, s]));
    const termKey = term === "I" ? "termI" : "termII";
    const operations = [];

    for (const row of rows) {
      const admissionNumber = clean(row?.admissionNumber);
      const student = byAdmission.get(admissionNumber);
      if (!student) continue;

      const set = {
        studentName: student.name,
        rollNumber: student.rollNumber,
        section: student.section,
      };

      if (assessmentType === "scholastic") {
        for (const field of SCHOLASTIC_FIELDS) {
          const raw = row[field.key];
          if (raw !== undefined && raw !== null && clean(raw) !== "")
            set[`${termKey}.${field.key}`] = clean(raw);
        }
      } else {
        for (const key of ["workingDays", "present", "absent"]) {
          const raw = row[key];
          if (raw === undefined || raw === null || clean(raw) === "") continue;
          const value = Number(raw);
          if (!Number.isInteger(value) || value < 0)
            return res
              .status(400)
              .send(`Invalid ${key} value for ${student.name}.`);
          set[`${termKey}.${key}`] = value;
        }
      }

      if (Object.keys(set).length === 3) continue;
      const Model =
        assessmentType === "scholastic" ? SchoolistAssessment : Attendance;
      operations.push({
        updateOne: {
          filter: { academicYear: year, className, admissionNumber },
          update: {
            $set: set,
            $setOnInsert: { academicYear: year, className, admissionNumber },
          },
          upsert: true,
        },
      });
    }

    if (!operations.length)
      return res.redirect("/marksheet/schoolist-attendance?success=0");
    const Model =
      assessmentType === "scholastic" ? SchoolistAssessment : Attendance;
    const result = await Model.bulkWrite(operations, { ordered: false });
    const saved = (result.modifiedCount || 0) + (result.upsertedCount || 0);
    res.redirect(`/marksheet/schoolist-attendance?success=${saved}`);
  } catch (e) {
    console.error("SCHOOLIST/ATTENDANCE SAVE ERROR:", e);
    res.status(500).send("Unable to save Scholastic/Attendance data.");
  }
});

module.exports = router;
