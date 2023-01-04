const mongoose=require('mongoose');
const schema=mongoose.Schema;

const categorySchema=new schema({
    Name:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('categories',categorySchema)