const jwt = require("jsonwebtoken");
const logging = require("./logging");

function checkAdmin(req, res, next) {
      console.log(
        "CHECK ADMIN:",
        req.originalUrl
    );
    console.log(req.body)
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
      res.redirect("/stcolumbus/jaj/ekdara/admin");
    } else {
      res.redirect("/stcolumbus/admin/manage/login");
    }
  } catch (err) {
    console.log(err);
  }
}

function checkAdminAsSuperadmin(req, res, next) {

  try {

    console.log(
      "COOKIE:",
      req.cookies.stadminis
    );

    const logindUser = jwt.decode(
      req.cookies.stadminis,
      process.env.JWTKEYIS
    );

    console.log(
      "DECODED USER:",
      logindUser
    );

    console.log(
      "ROLE:",
      logindUser?.role
    );

    console.log(
      "BLOCKED:",
      logindUser?.blocked
    );

    if (
      logindUser?.role === "superadmin" &&
      !logindUser?.blocked
    ) {

      console.log("SUPERADMIN ACCESS GRANTED");

      return next();

    }

    console.log("SUPERADMIN ACCESS DENIED");

    return res.redirect(
      "/stcolumbus/jaj/ekdara/admin"
    );

  } catch (err) {

    console.log(
      "SUPERADMIN ERROR:",
      err
    );

    return res.redirect(
      "/stcolumbus/admin/manage/login"
    );

  }

}
module.exports = { checkAdmin, checkAdminAsEditor, checkAdminAsSuperadmin };
