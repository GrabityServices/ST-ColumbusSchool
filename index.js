const express=require('express')
const dotenv=require('dotenv')
const connectDB=require('./connectdb')
const Home =require('./routes/home.js')
const stcolumbus=require('./routes/routes.js')
const Path=require('path')
const logging=require('./middleware/logging.js')
const errorHandler=require('./middleware/errorHandler.js')
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views',Path.join(__dirname,'views'))

// app middelwares---------------------------------------
app.use(logging)

// app apis --------------------------------------------

app.use('/',Home)
app.use('/home',stcolumbus)




// error handling ----------------
app.use(errorHandler)
// undefine address

app.use((req,res)=>{
  res.render('404.ejs',{path:req.path})
})


// ---------------------------- Listening--------------------------

const PORT = process.env.PORT;
async function main() {
  await connectDB()
    .then(() => console.log("DB connected"))
    .catch((err) => {
      console.log("Error ", err);
    });
    app.listen(PORT, () => console.log(PORT));
}

main()
