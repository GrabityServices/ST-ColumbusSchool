const express = require("express");
const path = require("path");
const app = express();
const Home = require("./routes/routes.js");
const { send } = require("process");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));



app.use("/", Home);

app.use((req, res) => {
  setTimeout(() => {
    res.redirect("/");
  }, 1000);
});

app.listen(8000, () => console.log("http://localhost:8000/"));
