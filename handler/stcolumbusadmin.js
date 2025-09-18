const UserAdmin = require("../models/userAdmin.js");
const bcrypt = require("bcrypt");
const validUser = require("../utils/validate.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Admins = require("../models/admins.js");
const Gallery = require("../models/gallery.js");
const Notice = require("../models/notice.js");
const moment = require("moment");
const Feestuct = require("../models/feeStructure.js");

async function handleStAdmin(req, res) {
  const Admin = await UserAdmin.find({});
  const jwtData = await jwt.decode(req.cookies.stadminis, process.env.JWTKEYIS);
  //
  const admins = await Admins.find({});
  const admiJsonData = admins.map((admin) => admin.toJSON());

  const gallery = await Gallery.find().sort({ EventDate: 1 });

  let gallArr = [];
  let date = null;

  gallery.forEach((gall) => {
    if (!date) {
      // first time initialization
      date = gall.EventDate;
      gallArr.push([gall]);
    } else {
      if (date.toString() === gall.EventDate.toString()) {
        // same event date → push into last subarray
        gallArr[gallArr.length - 1].push(gall);
      } else {
        // new event date → create a new subarray
        date = gall.EventDate;
        gallArr.push([gall]);
      }
    }
  });

  let titArray = [];

  gallArr.forEach((eventGroup) => {
    let titleGroups = []; // holds groups of same titles for this event date
    let currentTitle = null;

    eventGroup.forEach((item) => {
      if (!currentTitle) {
        // initialize first title group
        currentTitle = item.title;
        titleGroups.push([item]);
      } else {
        if (currentTitle.toString() === item.title.toString()) {
          // same title → push into current group
          titleGroups[titleGroups.length - 1].push(item);
        } else {
          // new title → start new group
          currentTitle = item.title;
          titleGroups.push([item]);
        }
      }
    });

    titArray.push(titleGroups); // add the grouped titles for this event date
  });

  const notices = await Notice.find({});
  const noteJsonData = notices.map((notice) => notice.toJSON());

  const fees = await Feestuct.findOne({ getBy: process.env.GETFEE });
  const superAdminCount = Admin.filter(
    (user) => user.role === "superadmin"
  ).length;

  if (jwtData.role === "superadmin") {
    return res.render("AllAdmins.ejs", {
      data: Admin,
      supAd: true,
      admins: admiJsonData,
      images: titArray,
      notices: noteJsonData,
      supId: jwtData.uniqId,
      superAdminCount,
      fees,
      admsc: Admin.length,
    });
  } else {
    Admin.forEach((member) => {
      if (member._id == jwtData.id) {
        return res.render("AllAdmins.ejs", {
          data: [member],
          supAd: false,
          admins: admiJsonData,
          images: titArray,
          notices: noteJsonData,
          supId: undefined,
          fees,
        });
      }
    });
  }
}

async function hadnleLoginForm(req, res) {
  if (req.cookies.stadminis) {
    console.log("Allready Login");
    return res.redirect("/stcolumbus/jaj/ekdara/admin");
  }
  const data = await UserAdmin.findOneAndUpdate(
    {
      $or: [{ email: req.body.idOrEmail }, { uniqId: req.body.idOrEmail }],
    },
    { lastLogin: moment().format("YYYY-MM-DD") },
    { new: true }
  );
  let passMatch = "";
  if (data) {
    passMatch = await bcrypt.compare(req.body.password, data.password);
  }
  if (passMatch && !data.blocked) {
    const token = await jwt.sign(
      {
        name: data.name,
        img: data.img,
        email: data.email,
        uniqId: data.uniqId,
        blocked: data.blocked,
        role: data.role,
        id: data._id,
      },
      process.env.JWTKEYIS,
      { expiresIn: "2h" }
    );
    res.cookie("stadminis", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 60 * 30 * 1000),
    });
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } else {
    console.log("Admin is either Blocked or not signedup");
    res.redirect("/stcolumbus/admin/manage/login");
  }
}

async function hadnleSignupForm(req, res) {
  try {
    const isValid = validUser(req.body);
    if (!isValid) {
      // Invalid input
      return res.status(400).send("Invalid user input.");
    }

    // Check if email or uniqId already exists
    const existingUser = await UserAdmin.findOne({
      $or: [{ email: req.body.email }, { uniqId: req.body.uniqId }],
    });

    if (existingUser) {
      return res.status(409).send("Email or Unique ID already in use.");
    }

    // Hash the password

    req.body.password = await bcrypt.hash(req.body.password, 10);
    try {
      await UserAdmin.create({
        name: req.body.firstName + " " + req.body.lastName,
        uniqId: req.body.uniqId,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
    } catch (err) {
      throw new Error("User Creating Fail");
      res.redirect("/stcolumbus/admin/manage/login");
    }

    res.redirect("/stcolumbus/admin/manage/login");
  } catch (err) {
    console.error("Signup error:", err);
    res.redirect("/stcolumbus/admin/manage/login");
  }
}

async function handleForgotForm(req, res) {
  const { idOrEmail, password, copyPassword } = req.body;

  try {
    // Phase 1: Check if user exists
    if (!password && !copyPassword) {
      const existingUser = await UserAdmin.findOne({
        $or: [{ email: idOrEmail }, { uniqId: idOrEmail }],
      });

      if (existingUser) {
        return res.render("forgotAdminPass.ejs", {
          user: true,
          idOrEmail,
        });
      } else {
        return res.render("forgotAdminPass.ejs", {
          user: false,
          idOrEmail,
        });
      }
    }

    // Phase 2: Reset password
    if (password !== copyPassword) {
      return res.redirect("/stcolumbus/admin/manage/forgot/pass");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserAdmin.findOneAndUpdate(
      {
        $or: [{ email: idOrEmail }, { uniqId: idOrEmail }],
      },
      { password: hashedPassword }
    );

    if (!updatedUser) {
      return res.redirect(
        "/stcolumbus/admin/manage/forgot/pass?error=usernotfound"
      );
    }

    res.redirect("/stcolumbus/jaj/ekdara/admin?reset=success");
  } catch (error) {
    console.error("Error in handleForgotForm:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function handleUpdateAdminImg(req, res) {
  if (req.body.uploaded) {
    const userAdmins = await UserAdmin.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    }).then((AdminIs) => {
      if (AdminIs.img && AdminIs.img !== "/adminAvt/defaultAvt.png") {
        try {
          const imagePath = path.join(__dirname, "../assets", AdminIs.img); // Adjust based on your storage setup
          // Delete the image file
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/adminAccountAvt",
        req.body.filename
      ); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
      res.redirect("/stcolumbus/jaj/ekdara/admin/update/img/" + req.params.id);
    } catch (err) {
      res.redirect("/stcolumbus/jaj/ekdara/admin/update/img/" + req.params.id);
    }
  }
}

async function handleUpdateAdminDet(req, res) {
  try {
    const data = await UserAdmin.findById(req.params.id);
    let name = data.name;
    if (req.body.FirstName) {
      name =
        req.body.FirstName.trim() + " " + req.body.LastName.trim() || data.name;
    }
    const email = req.body.email.trim() || data.email;
    const newData = { name, email };
    const newUpdateData = await UserAdmin.findByIdAndUpdate(
      req.params.id,
      { ...newData },
      { new: true, runValidators: true }
    );
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } catch (err) {
    res.redirect("/stcolumbus/jaj/ekdara/admin/update/det/" + req.params.id);
  }
}

async function handleDeleteAdmin(req, res) {
  try {
    // Find the user admin document by ID
    const admin = await UserAdmin.findById(req.params.id);

    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    // Check if the image is not the default image
    if (admin.img && admin.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", admin.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }

    // Delete the admin record
    await UserAdmin.findByIdAndDelete(req.params.id);
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } catch (err) {
    console.log(err);
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  }
}

async function hadnleUpdateBySuperAdmin(req, res) {
  const oldData = await UserAdmin.findById(req.params.id);
  const newData = {
    uniqId: req.body.uniqId || oldData.uniqId,
    role: req.body.role || oldData.role,
    blocked: req.body.blocked || oldData.blocked,
  };
  if (oldData) {
    const data = await UserAdmin.findByIdAndUpdate(
      req.params.id,
      {
        ...newData,
      },
      { new: true, runValidators: true }
    )
      .then((ress) => {
        console.log("Admin Update performed");
      })
      .catch((err) => {
        console.log("Admin Update performed");
      });
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } else
    res.redirect(
      `/stcolumbus/jaj/ekdara/admin/update/det/superadmin/${req.params.id}`
    );
}
module.exports = {
  handleStAdmin,
  hadnleLoginForm,
  hadnleSignupForm,
  handleForgotForm,
  handleUpdateAdminImg,
  handleUpdateAdminDet,
  handleDeleteAdmin,
  hadnleUpdateBySuperAdmin,
};

