const Admins = require("../models/admins.js");

async function getAdmin(req, res) {
  const admins = await Admins.find({});
  const jsonData = admins.map((admin) => admin.toJSON());
  res.json(jsonData);
}

async function setAdminForm(req, res) {
  if (req.body.uploaded == true) {
    const useris = await Admins.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    });
    res.redirect("/home/admin");
  } else {
    res.redirect(`/home/adminUpdate/${req.params.id}`);
  }
}

async function setAdminFormDet(req, res) {
const userIs=await Admins.findById(req.params.id)
const name=req.body.name||userIs.name
const uniqId=req.body.uniqId||userIs.unqId
const email=req.body.email||userIs.email
const position=req.body.position||userIs.position
const age=req.body.age||userIs.age
const gender=req.body.gender||userIs.gender
const quli=req.body.quli||userIs.quli
const joingDate=req.body.joingDate||userIs.joingDate
const newData={
    uniqId,name,email,position,age,gender,quli,joingDate
}

const data =await Admins.findByIdAndUpdate(req.params.id,{...newData},{new:true})
res.redirect('/home/admin')
}

module.exports = {
  getAdmin,
  setAdminForm,
  setAdminFormDet,
};
