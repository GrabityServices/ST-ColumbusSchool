const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));


app.get("/", (req, res) => res.render("index.ejs"));

app.get('/about',(req,res)=>res.render('about.ejs'))

app.post('/',(req,res)=>{


    console.log(req.body)
    res.redirect('/')
})

app.use((req,res)=>{
    res.send('Page not found code by dev')
})
app.listen(8000);
