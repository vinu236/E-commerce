const express=require('express')
const app=express()
const mongoose = require("mongoose");
require('dotenv').config()




 
  module.exports={
    CONNECT:async()=>{
        try {
          mongoose
          .connect(process.env.DB_URL)
          .then(() => {
            console.log("DB Connected");
           
          })
          .catch((err) => {
            console.log(err);
          });
        } catch (error) {
         
            
            console.log(error)
        }
    }
  }