const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes= require("./routes/admin")
require('dotenv').config()
const DB=require('./config/connections')

/* -----------------------------------session--------------------------------- */
app.use(session({
  secret: "cookie_secret",
  resave: true,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
 next();
});
app.use(flash());

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// console.log(__dirname)
const staticPath = path.join(__dirname, "/public");

app.use(express.static(staticPath));


app.set("view engine", "ejs");
app.use(userRoutes);
app.use(adminRoutes)
app.use((req,res)=>{
res.status(404).render('user/404')
})









DB.CONNECT();



// mongoose
//   .connect("mongodb://localhost:27017/E-commerce")
//   .then(() => {
//     console.log("DB Connected");
   
//   })
//   .catch((err) => {
//     console.log(err);
//   });

  app.listen(8080,() => {
    console.log("server connected on port 8080");
  });