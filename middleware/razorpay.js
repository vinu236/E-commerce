const Razorpay=require('razorpay');
require('fs')
require('dotenv').config()

var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env. RAZORPAY_KEY_SECERT })


module.exports=instance