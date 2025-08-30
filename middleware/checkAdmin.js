

function checkAdmin(req,res,next){
 try{
   if (req.cookies.stadminis) {
     next();
   } else {
     res.redirect("/stcolumbus/admin/manage/login");
   }
 }
 catch(err){
  console.log(err)
 }
}

module.exports=checkAdmin