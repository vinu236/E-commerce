const mongoose=require('mongoose')
const schema=mongoose.Schema;

const couponModel=new schema({

    couponCode:{
        type:String,
        
    },
    minimumAmount:{
        type:Number,
        
    },
    maximumAmount:{
        type:Number,
        
    },
    expiryDate:{
        type:Date,
        
    },
    discount:{
        type:Number,
        
    },
    user:[{
        user_id:String
}]
})

module.exports=mongoose.model('coupon',couponModel)