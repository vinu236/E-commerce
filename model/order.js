
const mongoose=require('mongoose')
const schema=mongoose.Schema
const ObjectId = schema.ObjectId

const orderSchema=new schema({

    user_Id:{
        type:ObjectId,
        required:true
    },
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
    paymentMethod:{
        type:String,
        required:true
    },
    orderItem:[
      {
        product_Id:{
            type:ObjectId,
            
        },
        price:{
          type:Number
        },
        quantity:{
            type:Number,
            
        }
      }  
    ],
    totalAmount:{
        type:Number,
        
    },
    orderStatus: {
        type: String,
        default: "Pending",
      },
     
      paymentStatus: {
        type: String,
        default: "Not Paid",
      },
      orderOn: {
        type: String,
      },
      deliveryDate: {
        type: String,
      },
    },
  {
    timestamps:true
  }

)
module.exports=mongoose.model('order',orderSchema)