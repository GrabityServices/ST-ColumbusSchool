const UserAdmin = require("../models/userAdmin.js");
const bcrypt = require("bcrypt");
const validUser = require("../utils/validate.js");
const jwt = require("jsonwebtoken");

async function handleStAdmin(req, res) {
  const Admin = await UserAdmin.find({});
  res.render("AllAdmins.ejs", { data: Admin });
}

async function hadnleLoginForm(req, res) {
  if (req.cookies.stadminis) {
    return res.redirect("/stcolumbus/jaj/ekdara/admin");
  }
  const data = await UserAdmin.findOne({
    $or: [{ email: req.body.idOrEmail }, { uniqId: req.body.idOrEmail }],
  });
  const passMatch = await bcrypt.compare(req.body.password, data.password);
  if (passMatch) {
    const token = await jwt.sign(
      {
        name: data.name,
        img: data.img,
        email: data.email,
        uniqId: data.uniqId,
        blocked: data.blocked,
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
      });
    } catch (err) {
      throw new Error("User Creating Fail");
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
    });
    res.redirect("/stcolumbus/jaj/ekdara/admin");
  } else {
    res.redirect("/stcolumbus/jaj/ekdara/admin/update/img/" + req.params.id);
  }
}

async function handleUpdateAdminDet(req, res) {
 try{
   const data = await UserAdmin.findById(req.params.id);
  let name = data.name;
  if (req.body.FirstName) {
    name =
      req.body.FirstName.trim() + " " + req.body.LastName.trim() || data.name;
  }
  const uniqId = req.body.uniqId.trim() || data.uniqId;
  const email = req.body.email.trim() || data.email;
  const newData = { name, uniqId, email };
  const newUpdateData=await UserAdmin.findByIdAndUpdate(req.params.id,{...newData},{new:true})
  res.redirect("/stcolumbus/jaj/ekdara/admin");
 }catch(err){
  res.redirect("/stcolumbus/jaj/ekdara/admin/update/det/" + req.params.id)
 }
}
module.exports = {
  handleStAdmin,
  hadnleLoginForm,
  hadnleSignupForm,
  handleForgotForm,
  handleUpdateAdminImg,
  handleUpdateAdminDet,
};
