const express=require('express')
const Router=express.Router()


//rendering home page
Router.route('/').get((req,res)=>{
    console.log(req.ip)
    res.render('home.ejs')
})


//rendring about page
Router.route('/about').get((req,res)=>{
    res.render("about.ejs")
})

module.exports= Router