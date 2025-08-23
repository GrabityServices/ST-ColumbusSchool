const express = require('express')
const HomeRouter=express.Router()

HomeRouter.route('/').get((req,res)=>{
    res.redirect('/home')
})

module.exports=HomeRouter