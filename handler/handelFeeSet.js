const Feestuct = require("../models/feeStructure.js");

async function handelFeeSet(req, res) {
  try {
    const pre = await Feestuct.findOne({ getBy: process.env.GETFEE });
    if (!pre) {
      return res.status(404).send("Fee configuration not found.");
    }

    const newFees = {
      tutionfee: {
        nurUkg: {
          addfee: req.body.tutionfee00 || pre.tutionfee.nurUkg.addfee,
          monthly: req.body.tutionfee01 || pre.tutionfee.nurUkg.monthly,
        },
        oneFive: {
          addfee: req.body.tutionfee10 || pre.tutionfee.oneFive.addfee,
          monthly: req.body.tutionfee11 || pre.tutionfee.oneFive.monthly,
        },
        sixEight: {
          addfee: req.body.tutionfee20 || pre.tutionfee.sixEight.addfee,
          monthly: req.body.tutionfee21 || pre.tutionfee.sixEight.monthly,
        },
        nineTen: {
          addfee: req.body.tutionfee30 || pre.tutionfee.nineTen.addfee,
          monthly: req.body.tutionfee31 || pre.tutionfee.nineTen.monthly,
        },
      },
      transport: {
        oneKm: req.body.transport0 || pre.transport.oneKm,
        fiveKm: req.body.transport1 || pre.transport.fiveKm,
        elevenKm: req.body.transport2 || pre.transport.elevenKm,
        sixteenKm: req.body.transport3 || pre.transport.sixteenKm,
        twentyPlush: req.body.transport4 || pre.transport.twentyPlush,
      },
      schoolUniform: {
        regular: req.body.schoolUniform0 || pre.schoolUniform.regular,
        gameUniform: req.body.schoolUniform1 || pre.schoolUniform.gameUniform,
        tie: req.body.schoolUniform2 || pre.schoolUniform.tie,
        belt: req.body.schoolUniform3 || pre.schoolUniform.belt,
        IDcard: req.body.schoolUniform4 || pre.schoolUniform.IDcard,
        shoesSocks: req.body.schoolUniform5 || pre.schoolUniform.shoesSocks,
      },
    };

    // Save the updated structure
    try {
      await Feestuct.updateOne(
        { _id: pre._id },
        { $set: newFees },
        { runValidators: true }
      );
      return res.redirect("/stcolumbus/jaj/ekdara/admin#feestruct");
    } catch (err) {
      return res.redirect("/home/feeUpdate");
    }
  } catch (error) {
    console.error("Error updating fee structure:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handelFeeSet,
};
