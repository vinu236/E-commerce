const mongoose=require('mongoose')
const schema=mongoose.Schema;

const bannerSchema=new schema({

    head:{
        type:String
    },
    sub:{
        type:String,

    },
    btnName:{
        type:String
    },
    url:{
        type:String
    },
    description:{
        type:String
    },
    bannerImage:{
        type:String,
        
    },
    isOffer:{
        type:Boolean,
        default:true
        
    }
})

module.exports=mongoose.model('Banner',bannerSchema)