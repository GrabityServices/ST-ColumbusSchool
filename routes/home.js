const express = require('express')
const HomeRouter=express.Router()
const Admin=require('../models/admins.js')

HomeRouter.route('/').get(async(req,res)=>{
    const admins=await Admin.find({})
    res.render('home.ejs',{admins})
})

module.exports=HomeRouter