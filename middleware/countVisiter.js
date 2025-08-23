const TotalVisits = require("../models/usercount");

async function uniqueUser(req, res, next) {
  if (!req.cookies?.visited) {
    console.log("not visited");
    req.user = req.user || {};
    req.user.visited = false;
    try {
      const count = await TotalVisits.findOne({ fetchBy: "STCOLUMBUS", _id: "68a9b266b945c3d996eb2e01" });
      await TotalVisits.findByIdAndUpdate({fetchBy: "STCOLUMBUS", _id: "68a9b266b945c3d996eb2e01" }, { $inc: { totalvisits: 1 } });
      const oneDay = 24 * 60 * 60 * 1000;
      res.cookie("visited", true, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + oneDay),
      });
    } catch (err) {
      console.log(err);
    }
    req.user.totalvisits=count.totalvisits+1
  } else {
    req.user = req.user || {};
    req.user.visited = true;
  }
  next();
}

module.exports = uniqueUser;