const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const ObjectID = Schema.ObjectId


    const wishlistSchema=new Schema({

    user_Id:{
        type:ObjectID,
        required:true
    },
    products:[
        {
          product_Id:{
            type:ObjectID,
            required:true
           
          }
         
            

}]



})


module.exports=mongoose.model('wishlist',wishlistSchema)
