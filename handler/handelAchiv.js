const Achivs = require("../models/achivments.js");

async function getAchiv(req, res) {
  const achivs = await Achivs.find({});
  const jsonData = achivs.map((achiv) => achiv.toJSON());
  res.json(jsonData);
}

async function setAchivForm(req, res) {
  if (req.body.uploaded == true) {
    const achivIS = await Achivs.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    });
    res.redirect("/home/achiv");
  } else {
    res.redirect(`/home/achivUpdate/${req.params.id}`);
  }
}

async function setAchivFormDet(req, res) {
const achivIS=await Achivs.findById(req.params.id)
// console.log(achivIS)
const title=req.body.title||achivIS.title
const desc=req.body.desc||achivIS.desc
const prizeType=req.body.prizeType||achivIS.prizeType
const compDate=req.body.compDate||achivIS.comDate


const newData={
  title,prizeType,desc,compDate
}
// console.log(newData)

const data =await Achivs.findByIdAndUpdate(req.params.id,{...newData},{new:true})
// console.log(data)
res.redirect('/home/achiv')
}

module.exports = {
  getAchiv,
  setAchivForm,
  setAchivFormDet,
};
