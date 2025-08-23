module.exports= function handelGet(req,res){
res.render('404.ejs',{path:req.path})
}