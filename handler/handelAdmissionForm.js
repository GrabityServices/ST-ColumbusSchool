const Admission=require("../models/admission.js")
async function handleAdmissionForm (req, res) {

  try {
    // Force constant values to prevent tampering
    req.body.addd = "JAMUI";
    req.body.adds = "BIHAR";
    req.body.addp = "811308";
    const data = {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      fname: req.body.fname,
      mname: req.body.mname,
      mobNumber: req.body.mobNumber,
      add: {
        vill: req.body.addv,
        town: req.body.addt,
        dist: req.body.addd,
        state: req.body.adds,
        pincode: req.body.addp,
      },
      forClass: req.body.forClass,
    };

    // Save to DB
    const newData = await Admission.create(data);
    res.render("processid.ejs", { pid: newData.processId });
  } catch (err) {
    console.error("Error saving admission:", err);
    res.render("processid.ejs", { pid: undefined });
  }
}

module.exports=handleAdmissionForm