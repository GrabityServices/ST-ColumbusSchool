const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connectdb");
const Home = require("./routes/home.js");
const stcolumbus = require("./routes/routes.js");
const Path = require("path");
const logging = require("./middleware/logging.js");
const errorHandler = require("./middleware/errorHandler.js");
const uniqueUser = require("./middleware/countVisiter.js");
const cookieParser = require("cookie-parser");
const { adminroute } = require("./routes/adminRoutes.js");
const Admin = require("./models/admins.js");
const Gallery = require("./models/gallery.js");
const {
  checkAdmin,
  checkAdminAsSuperadmin,
} = require("./middleware/checkAdmin.js");
const { adminManagment } = require("./routes/adminRoutes.js");
const { title } = require("process");
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.set("views", Path.join(__dirname, "views"));
app.use(express.static(Path.join(__dirname, "public")));
app.use(express.static(Path.join(__dirname, "assets")));
// app.use(express.static('public'))

app.use(cookieParser());
// app middelwares---------------------------------------
app.use(logging);
app.use(uniqueUser);

// app apis --------------------------------------------

app.use("/", Home);

app.use("/home", checkAdmin, stcolumbus);
app.use("/stcolumbus/jaj/ekdara/admin", checkAdmin, adminroute);
app.use("/stcolumbus/admin/manage", adminManagment);
// app.post('/home/adminUpdate/:id',update.single('img'),(req,res)=>{
//    console.log(req.body)
//     console.log(req.file)

//     res.send('HRllo')
// })

app.get("/ft", (req, res) => {
  console.log(req.user);
  res.render("about.ejs");
});

app.get("/academics", async (req, res) => {
  res.render("academics.ejs");
});
app.get("/about", async (req, res) => {
  const admins = await Admin.find({});

  res.render("about.ejs", { admins });
});
app.get("/notice", (req, res) => {
  res.send("Working Notice");
});
app.get("/contact", (req, res) => {
  res.send("Working contact");
});
app.get("/gallery", async (req, res) => {
  let images = await Gallery.find({});
  // if (req.query.s == "date") {
  //   let imgArr = [];
  //   let prv = "";
  //   images.forEach((img, idx) => {
  //     // =====================================
  //     if (prv) {
  //       if (prv == img.EventDate) {
  //         imgArr[imgArr.length - 1].push(img);
  //       } else {
  //         prv = img.EventDate;
  //         imgArr.push([img]);
  //       }
  //     } else {
  //       prv = img.EventDate;
  //       imgArr.push([img]);
  //     }
  //     // =====================================
  //   });
  //   res.render("gall.ejs", { imgArr, s: "date" });
  // } else {
  //   const images = await Gallery.find({}).sort({ title: 1 });
  //   let imgArr = [];
  //   let prv = "";
  //   images.forEach((img, idx) => {
  //     if (prv) {
  //       if (prv == img.title.trim()) {
  //         imgArr[imgArr.length - 1].push(img);
  //       } else {
  //         prv = img.title;
  //         imgArr.push([img]);
  //       }
  //     } else {
  //       prv = img.title;
  //       imgArr.push([img]);
  //     }
  //   });
  //   res.render("gall.ejs", { imgArr, s: "title" });
  // }
  res.render("gall.ejs", { images });
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

// [
//   {
//     _id: new ObjectId('68b2cd6025d27093aa55819b'),
//     title: 'Hii',
//     desc: 'ppppppppppppp',
//     img: '/galleryAvt/1756705903350-Bishundev.PNG',
//     EventDate: '2002-01-01',
//     createdAt: 2025-08-30T10:07:28.829Z,
//     updatedAt: 2025-09-03T15:41:59.402Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68b520a97b06e189de3d0d94'),
//     title: 'Dev',
//     desc: "Dev's Birthday",
//     img: '/galleryAvt/1756705923450-Bishundev.PNG',
//     EventDate: '2002-01-01',
//     createdAt: 2025-09-01T04:27:21.418Z,
//     updatedAt: 2025-09-03T12:27:38.673Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68b853150ba58add9f7d0e3b'),
//     title: 'Hello',
//     desc: 'ppppppppppppp',
//     img: '/galleryAvt/1756910357828-dev.jpg',
//     EventDate: '2002-01-01',
//     createdAt: 2025-09-03T14:39:17.854Z,
//     updatedAt: 2025-09-03T15:39:02.801Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68b85a5c4c8b0302bd026300'),
//     title: 'Hello',
//     desc: "Dev's Birthday",
//     img: '/galleryAvt/1756912220176-download (1).png',
//     EventDate: '2025-09-03',
//     createdAt: 2025-09-03T15:10:20.287Z,
//     updatedAt: 2025-09-03T15:10:20.287Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68b85a954c8b0302bd026304'),
//     title: 'Hii',
//     desc: "Dev's Birthday",
//     img: '/galleryAvt/1756912277164-IMG-20241011-WA0015.jpg',
//     EventDate: '2025-09-20',
//     createdAt: 2025-09-03T15:11:17.173Z,
//     updatedAt: 2025-09-03T15:42:42.645Z,
//     __v: 0
//   }
// ]
