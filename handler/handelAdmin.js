const Admins =require('../models/admins.js')
module.exports = async function getAdmin(req, res) {
    const admins=await Admins.find({})
    const jsonData=  admins.map(admin => admin.toJSON());
    res.json(jsonData)
};


