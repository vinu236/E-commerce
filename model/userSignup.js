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
          
        },
        address:{
            type:String,
         
        },
        pinCode:{
            type:Number,
           
        },
        mobileNumber:{
            type:Number,
          
        }
        
    }],
    Active:{
        type:String,
        required:true
    },
    
    imageUrl: {
        type: String,
      
      }
})

module.exports=mongoose.model('User',userSignupSchema)