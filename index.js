const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connectdb");
const stcolumbus = require("./routes/routes.js");
const Path = require("path");
const logging = require("./middleware/logging.js");
const errorHandler = require("./middleware/errorHandler.js");
const uniqueUser = require("./middleware/countVisiter.js");
const cookieParser = require("cookie-parser");
const { adminroute } = require("./routes/adminRoutes.js");
const Admin = require("./models/admins.js");
const Gallery = require("./models/gallery.js");
const Notice = require("./models/notice.js");
const { checkAdmin } = require("./middleware/checkAdmin.js");
const { adminManagment } = require("./routes/adminRoutes.js");
const handleAdmissionForm = require("./handler/handelAdmissionForm.js");
const Admission = require("./models/admission.js");
const Feestuct = require("./models/feeStructure.js");
const Contact = require("./models/contact.js");
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const cors = require('cors');
const allowedOrigin = process.env.ALLOWED_ORIGNI;
const {logUnauthorizedOrigin} = require("./middleware/logUnauthorizedOrigin");
app.set("view engine", "ejs");

app.set("views", Path.join(__dirname, "views"));
app.use(express.static(Path.join(__dirname, "public")));
app.use(express.static(Path.join(__dirname, "assets")));
// app.use(express.static('public'))

app.use(cookieParser());
// app middelwares---------------------------------------
app.use(logging);
app.use(uniqueUser);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin) {
      callback(null, true); // Allow your site
    } else {
      callback(new Error('Not allowed by Grabity Services')); // Block all others
      logUnauthorizedOrigin(origin);
    }
  },
  methods: ['GET', 'POST'], // Add other methods if needed (PUT, DELETE, etc.)
  credentials: true, // Optional: if you send cookies/auth headers
}));
// app apis for manage data --------------------------------------------

app.use("/home", checkAdmin, stcolumbus);
app.use("/stcolumbus/jaj/ekdara/admin", checkAdmin, adminroute);
app.use("/stcolumbus/admin/manage", adminManagment);
app.get("/ft", (req, res) => res.render(""));
// webpage routes
app.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({});
    const titles = await Gallery.distinct("title");
    let gallery = await Promise.all(
      titles.map(async (tit) => {
        const data = await Gallery.findOne({ title: tit });
        return data;
      })
    );
    res.render("home.ejs", { admins, gallery });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred");
  }
});

app.get("/academics", async (req, res) => {
  res.render("academics.ejs");
});

app.get("/about", async (req, res) => {
  const admins = await Admin.find({});

  res.render("about.ejs", { admins });
});

app.get("/notice", async (req, res) => {
  const notices = await Notice.find({}).sort({ messDate: -1 });
  res.render("notices.ejs", { notices });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, mess, location } = req.body;

    // Basic validation
    if (!name || !email || !mess) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email already submitted
    const existingContact = await Contact.findOne({ email: email.trim() });
    if (existingContact) {
      return res.status(400).json({ message: "This email has already submitted a form." });
    }

    // Save to DB
    await Contact.create({ name, email, mess, location });

    // Send success response
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

app.get("/gallery", async (req, res) => {
  let images = await Gallery.find({});
  res.render("gallery.ejs", { images });
});

app.get("/admission", async (req, res) => {
  const fee = await Feestuct.find({});
  res.render("admission.ejs", { fees: fee[0] });
});

app.get("/admission/form", (req, res) => {
  res.render("addFrom.ejs");
});
app.post("/admission/form", handleAdmissionForm);

app.get("/admission/getEnroll", (req, res) => {
  res.render("getAdmissionInfo.ejs");
});

app.post("/admission/getEnroll", async (req, res) => {
  const newAdmission = await Admission.findOne({
    $or: [{ email: req.body.emailorID }, { processId: req.body.emailorID }],
  });

  if (newAdmission) {
    return res.render("processid.ejs", { data: newAdmission, editor: false });
  }
  res.send("No admission filled with email : " + req.body.emailorID);
});

// error handling ----------------
app.use(errorHandler);
// undefine address

app.use((req, res) => {
  res.render("404.ejs", { path: req.path });
});

// ---------------------------- Listening--------------------------

const PORT = process.env.PORT || 8000;
async function main() {
  await connectDB()
    .then(() => console.log("DB connected"))
    .catch((err) => {
      console.log("Error ", err);
    });
  app.listen(PORT, () => console.log(PORT));
}

main().catch((err) => console.log(err));
