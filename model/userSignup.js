const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSignupSchema=new Schema({

    Username:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    addressDetails:[{
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true,
        },
        pinCode:{
            type:Number,
            required:true
        },
        mobileNumber:{
            type:Number,
            required:true
        }, 
        email:{
            type:String,
            required:true,
            unique:true
        } 
        
        
    }],
    Active:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('User',userSignupSchema)