const jwt = require("jsonwebtoken");
const logging = require("./logging");

function checkAdmin(req, res, next) {
  try {
    if (req.cookies.stadminis) {
      next();
    } else {
      res.redirect("/stcolumbus/admin/manage/login");
    }
  } catch (err) {
    console.log(err);
  }
}

function checkAdminAsEditor(req, res, next) {
  try {
    if (req.cookies.stadminis) {
      const logindUser = jwt.decode(
        req.cookies.stadminis,
        process.env.JWTKEYIS
      );
      if (logindUser.role === "editor" && !logindUser.blocked) {
        return next();
      }
      res.redirect("/home/");
    } else {
      res.redirect("/stcolumbus/admin/manage/login");
    }
  } catch (err) {
    console.log(err);
  }
}

function checkAdminAsSuperadmin(req, res, next) {
  try {
    if (req.cookies.stadminis) {
      const logindUser = jwt.decode(
        req.cookies.stadminis,
        process.env.JWTKEYIS
      );
      if (logindUser.role === "superadmin" && !logindUser.blocked) {
        return next();
      }
      res.redirect("/stcolumbus/admin/manage/login");
    } else {
      res.redirect("/stcolumbus/admin/manage/login");
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { checkAdmin, checkAdminAsEditor, checkAdminAsSuperadmin };
