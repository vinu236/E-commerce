const mongoose=require('mongoose');
const schema=mongoose.Schema

const addProductSchema=new schema({
    title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      category:{
        type:String,
        required:true
      },
      size:{
        type:String,
        required:true
      },
// img:[{
//     filename:{
//         type:String,
//         required:true
//     },
//     contentType:{
//         type:String,
//         required:true
//     },
//     imageBase64:{
//         type:String,
//         required:true
//     }
// }]
imageUrl: {
    type: String,
    required: true
  },
  Stock:{
    type:Number,
    required:true
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
})

module.exports=mongoose.model('products',addProductSchema)