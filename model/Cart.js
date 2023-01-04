
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectID = schema.ObjectId

const cartSchema = new schema({
  /* The owner field contains the id of the user who created the item. It is of type ObjectID since we only want this user’s id and ref is ‘User’. The ref is pointing to which of the models we want the id from. */
  user_Id: {
    type: ObjectID,
    required: true,
  
  },
  // products: [
  //   {
  //     title: String,
  //     price: Number,
  //     description: String,
  //     quantity: Number,
  //     category: String,
  //   },
  // ],
 products:[
  {
    product_Id:{
      type:ObjectID,
      required:true
     
    },
    quantity:{
      type:Number,
      default:1,
      required:true,
    },
  },
 ],
});

module.exports = mongoose.model("Cart", cartSchema);
