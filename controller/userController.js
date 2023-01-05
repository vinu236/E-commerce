const User=require('../model/userSignup')
const products=require('../model/Add-products');
const Cart=require('../model/Cart');
const mongoose=require('mongoose');
const order=require('../model/order');
const ObjectId = mongoose.Types.ObjectId;
const categories=require('../model/Category');
const moment=require('moment')
const nodemailer=require('nodemailer')
const instance=require('../middleware/razorpay')
const crypto=require('crypto');
const banner=require('../model/banner')
const coupon=require('../model/Coupon');
const wishlist = require('../model/wishlist');
require('fs')
require('dotenv').config()



let username,
email,password,confirmPassword

let mailTransporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_PASS
    }
})

const OTP=`${Math.floor(1000+Math.random()*9000)}`


exports.getSignup=((req,res)=>{
    console.log("signup")
   res.render('user/sign-up')
})
exports.postSignup=async(req,res)=>{
    console.log("hello")
    console.log("shobin")
         username=req.body.username;
         email=req.body.email;
         password=req.body.password;;
          confirmPassword=req.body.cPassword;


    try {

       



        let mailDetails={
            from:"hardyed221@gmail.com",
            to:email,
            subject:"account submission",
            html: `<p>YOUR OTP FOR REGISTERING IN EdHardy IS <br><h1>${OTP}</h1></p>`
            
            
        }
        const user = await User.findOne({ email: email });
    if (user) {
      res.redirect("user/signup");
    } else {
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email Sent Successfully");
          res.redirect("/otp");
        }
    });
    }
        
    
    } catch (err) {
        console.log(err)
        res.status(500).render('user/500');
        
    } 
}


/* -------------------------Otp------------------------------------------ */
exports.getOtp=(req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/otp");
    }
  }

  exports.postOtp= async (req, res) => {
    console.log("otp i")
    let otp  = req.body;
    console.log(otp)
    console.log(OTP)
    if (OTP === otp.otp) {
        
      try {
        const userData=await  User.create({
            Username:username,
            email:email,
            password:password,
            confirmPassword:confirmPassword,
            Active:true
        })
        
      } catch (error) {
        res.status(500).render('user/500')
      }
      console.log("its here post otp");
      res.redirect('/login')
    } 
    else {
      res.redirect("/otp");
}
},

/* ----------------------------login------------------------------------------------- */
exports.getLogin=(req,res)=>{
    console.log("login")
  console.log(req.session)
  if(req.session.userId){
    res.redirect('/home')
  }else{
    res.render('user/login',{ message: req.flash('message') });
  }
  
}


exports.postLogin=async(req,res)=>{
    
try {
    console.log('posted')
    const email=req.body.email;
    const password=req.body.password
   
    
    console.log("home")
    const userCheck=await User.findOne({email,password})
    
    if(!userCheck){
        res.send("failed");
    }else if(userCheck.Active==='true'){
        req.session.isLoggedIn=true;
        req.session.userId=userCheck._id;
        req.session.email=userCheck.email
        console.log("you can access")
        res.redirect('/home')
        
    }else if(userCheck.Active==='false'){
       
        console.log("you are blocked");
        req.flash('message', ['You are blocked']);
        res.redirect('/login');
    }
  
} catch (error) {
    console.log(error)
    res.status(500).render('user/500')
}
}

    /* --------------------logout--------------------------------------------------------- */
    exports.logout=(async(req,res)=>{
        try {
            req.session.destroy();
            res.redirect('/home')
        } catch (error) {
            res.status(500).render('user/500')
        }
    })


/* --------------------------HomePage----------------------------------------------------- */
exports.getHome=async(req,res)=>{
    // axios.get('http://localhost:7000/admin_panel/add_products').then(result=>{
    //     JSON.stringify(result)
    // }).catch(err=>{
    //     console.log(err)
    // })
     const session=req.session;
     const getBanner=await banner.find()
    
    try {
        const getProducts=await products.find({isDeleted:false})
        res.render('user/homePage',{getProducts,session,getBanner})
      

        
        
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
}

/* -------------------------------UserHome--------------------------------------------------- */


exports. getUserHome=async(req,res)=>{
 
    const session=req.session;
    try {

        const getBanner=await banner.find()
        let cartCount=0;
        // check does user have cart or not....
        let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
        console.log("user has cart"+cart)
        
        if(cart){
       
        cartCount=cart.products.length;
        console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        
        }

        const getProducts=await products.find({isDeleted:false})
        res.render('user/homePage',{getProducts,session,cartCount,getBanner})
        

        
        
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
}

/* ----------------------------------Wishlist------------------------------------------------------ */
exports.getAddWishlist=(async(req,res)=>{
    try {

        const user_Id=req.session.userId ;
        const product_Id=req.params.id;
         console.log(product_Id)
         console.log(user_Id)
        let userWishlist= await wishlist.findOne({user_Id:user_Id})
             
             console.log(userWishlist)
        if(userWishlist){
            console.log(userWishlist)
            const product_Exist=await wishlist.findOne({products:{$elemMatch:{product_Id:product_Id}}})
             console.log(product_Exist)
            if(product_Exist){
                console.log("product Exist")
                const removeWishlist=await wishlist.updateOne({user_Id:user_Id},
                    {$pull:{products:{product_Id:product_Id}}}).then(()=>{
                        res.json(
                            {
                                wishlistRemoved:true
                            }
                        )
                    })
            }else{
                console.log("hello world")
                console.log(product_Id)
                console.log(user_Id)
                let createNewProduct=await wishlist.updateOne({user_Id:user_Id},
                    {$push:{products:{product_Id:product_Id}}}
                    ).then(()=>{
                        res.json({
                            createNewProduct:true
                        })
                    })
                   
            }
        }else{
            console.log("createWhislist")
            let createWishlist=await wishlist.create({
                user_Id:user_Id,
                products:[{
                    product_Id:product_Id
                }
                ]
            }).then(()=>{
                res.json({
                    createdWishlist:true
                })
            })
        }


        // res.render('user/wishlist')
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})


exports.getWishlist=(async(req,res)=>{
    try {
        
        const userId=req.session.userId
        console.log(userId)
        const userWishlistCheck=await wishlist.aggregate([
            {$match:{user_Id:ObjectId(userId)}},
            {$unwind:"$products"},
            {$project:{products:"$products.product_Id"}},
            {$lookup:{
                from:"products",
                localField:"products",
                foreignField:"_id",
                as:"productData"
            }
        },
        {
            $project:{
                products:1,productData:{$arrayElemAt:["$productData",0]}
            }
        }
        ])

        console.log(userWishlistCheck)
        let cartCount=0;
        // check does user have cart or not....
        let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
        // console.log("user has cart"+cart)
        
        if(cart){
       
        cartCount=cart.products.length;
        // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        
        }
        const session=req.session

        res.render('user/wishlist',{userWishlistCheck,session,cartCount})
    } catch (error) {
        console.log(error)
    }
})

exports.deleteWishlist=(async(req,res)=>{
    try {
        const product_Id=req.params.id;
        const user_Id=req.session.userId
        console.log(product_Id)
        console.log(user_Id)
        const deleteWishlist=await wishlist.updateOne({user_Id:user_Id},{$pull:{products:{product_Id:product_Id}}}).then(()=>{
            res.json({
                removed:true
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')        
    }
})

/* ----------------------------------User-Profile------------------------------------------------- */
exports.getUserProfile=(async(req,res)=>{
  try {
    const session=req.session
    console.log("userProfile")
    console.log(session)
    const Category=await categories.find({})



    let cartCount=0;
    // check does user have cart or not....
    let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
    // console.log("user has cart"+cart)
    
    if(cart){
   
    cartCount=cart.products.length;
    // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
    
    }
    res.render('user/userProfile',{session,cartCount})
  } catch (error) {
    console.error(error)
    res.status(500).render('user/500')
  }
})

/* -------------------------------------User-Edit-Profile------------------------------------------- */
exports.getEditProfile=(async(req,res)=>{
    try {
    const session=req.session
    
   



    let cartCount=0;
    // check does user have cart or not....
    let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
    // console.log("user has cart"+cart)
    
    if(cart){
   
    cartCount=cart.products.length;
    // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
    
    }

    /* --------Getting user Details from mongodb users collection---- */
    let getUser=await User.find({email:req.session.email})
   
   
    
    

    res.render('user/edit-Profile',{session,cartCount,getUser})

        
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})









/* ---------------------------------Post-User-Profile------------------------------------ */
exports.postProfile=(async(req,res)=>{
    
    try {
        console.log('WELCOMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEENPM S')
        /* get req.body data */
        const currentPassword=req.body.currentPassword;
        const newPassword=req.body.newPassword;
        const confirmPassword=req.body.cPassword;
        console.log(currentPassword)
        console.log(newPassword)
        console.log(confirmPassword)

        /* ---------checking current password is true or not --------*/
            /* 1) first we need  user id to find the user */
                const user_id=req.session.userId;
                let userCheck=await User.find({_id:user_id})
                console.log("userCheck")
                console.log(userCheck)
            /* 2) if userCheck found then update the current Password with new Password and confirm the new Password  */
                if(userCheck.length){
                    /* i)check the newPassword and confirm password true or not */
                    /* if it is true update or if it is not show alert message*/
                        if(newPassword===confirmPassword){
                            console.log("true")
                            let updatePassword=await User.findByIdAndUpdate({_id:user_id},{password:newPassword,confirmPassword:confirmPassword}).then(()=>{
                                req.session.destroy(function (err) {
                                    //Inside a callback… bulletproof!
                                   });
                            }).then(()=>{
                                res.json({status:true})
                            })
                            console.log("updatePassword")
                            console.log(updatePassword)
                            
                           
                        }else{
                            res.json({password:"password is not match"})
                        }
                }else{
                    res.json({invalid:"invalid entry"})
                }

    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
    
    }
)

/* ----------------------------------------userOrderDetails--------------------------------------- */
exports.getUserOrderDetails=(async(req,res)=>{
    try {
        console.log("herethe id=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(req.body)
        let user_Id=req.session.userId
        const session=req.session;

        /* -------------------getting all order details--------------------------------- */
        const getOrderDetails=await order.aggregate([
            {$match:{user_Id:ObjectId(user_Id)}},
            
        ])
        console.log("orderIdssssssss")
        console.log(getOrderDetails)
        console.log(getOrderDetails[0]._id)        
        /* -------------------getting ordered items-------------------------------------- */
        const getOrderedItems=await order.aggregate([
            {$match:{user_Id:ObjectId(user_Id)}},
            {$unwind:"$orderItem"},
            {$project:
                {
                    orderItem:"$orderItem.product_Id",
                    quantity:"$orderItem.quantity"
                }
        },
            {$lookup:{
                from:"products",
                localField:"orderItem",
                foreignField:"_id",
                as:"orderedItem"
            }},
            {$project:{quantity:1,orderedProduct:{$arrayElemAt:["$orderedItem",0]}}},
            

        ])
        
        let cartCount=0;
        // check does user have cart or not....
        let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
        // console.log("user has cart"+cart)
        
        if(cart){
       
        cartCount=cart.products.length;
        // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        
        }
        res.render('user/userOrderDetails',{getOrderDetails,getOrderedItems,session,cartCount})
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})



/* ----------------------------------------orderSpecificPrd-view---------------------------------- */
exports.getUserProductView=(async(req,res)=>{
    try { 
        console.log(req.params.id);
        const session=req.session.userId
        const order_id=req.params.id;
        const userPrdView=await order.aggregate([
            {$match:{_id:ObjectId(order_id)}},
            {$unwind:"$orderItem"},
            {$project:{
                products:"$orderItem.product_Id",

        
        }},
        {$lookup:{
            from:"products",
            localField:"products",
            foreignField:"_id",
            as:"products"
        }},
            {$unwind:"$products"}

        ])

        console.log("logitech")
        console.log(userPrdView);


        let cartCount=0;
        // check does user have cart or not.... 
        let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
        // console.log("user has cart"+cart)
        
        if(cart){
       
        cartCount=cart.products.length;
        // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        res.render('user/orderProductView',{userPrdView,cartCount,session,})
        }else{
            res.render('user/orderProductView',{userPrdView,cartCount,session,})
        }



        
        
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})








/* -----------------------------------Shop-------------------------------------------------------- */
exports.getShopPage=(async(req,res)=>{
  
    const session=req.session;
    const category=req.query.category  ;
    console.log("shop page")
    console.log(category)
    console.log(session)
    try {

        const shopProducts= await products.find({})
        const Category=await categories.find({})



        let cartCount=0;
        // check does user have cart or not....
        let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
        // console.log("user has cart"+cart)
        
        if(cart){
       
        cartCount=cart.products.length;
        // console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        
        }
        if(category){
           
            const shopProducts= await products.find({category:category})
            console.log(shopProducts.length)
            res.render('user/shop',{session,cartCount,Category,shopProducts})

            
        }else{
            const shopProducts=await products.find({})
            console.log(shopProducts.length)
            res.render('user/shop',{session,cartCount,shopProducts,Category})
        }

        
        
        

    } catch (error) {
        console.error(error)
        res.status(500).render('user/500')
    }
  
})
/* -------------------------------------ProductDetails--------------------------------------------- */
exports.getProductDetails=(async(req,res)=>{
try {
    const session=req.session;
      const prdDetail=req.query.id   
      console.log(prdDetail)
      const prd=await products.findOne({_id:prdDetail})
      let cartCount=0;
      // check does user have cart or not....
      let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
      console.log("user has cart"+cart)
      
      if(cart){
     
      cartCount=cart.products.length;
      console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
      
      }
      console.log(prd)
    res.render('user/productDetails',{session,prd,cartCount})
   
} catch (error) {
    console.log(error)
    res.status(500).render('user/500')
    
}

})


/* -----------------------------------Add-Cart---------------------------------------------------- */


exports.getAddCart=(async(req,res)=>{
try {
    console.log("user cart get page")

        const productId=req.params.id;
        const userId=req.session.userId;
        
        console.log(productId)
       
        // initially user doesn't have cart .we have to check whether the user has cart or not
       let userCart= await Cart.findOne({user_Id:ObjectId(userId)})
         

    //    check whether user has cart or not
        if(userCart){

            const product_Exist=await Cart.findOne({
                products:{$elemMatch:{product_Id:productId}},
            })
            
            if(product_Exist){
                
                addOneProduct(userId,productId)
                console.log(addOneProduct);
            }
            // if there is no products in cart=>create new product in cart(by updating cart)
            else{
                let createNewProduct=await Cart.updateOne(
                    {user_Id:userId},
                    {$push:{products:{product_Id:productId}}}
                    ).then(()=>{
                        res.json({status:true})
                    })
            }


        }
        // user has not cart, create new Cart
        // console.log("user has not cart")
        else{
             let createCart=await Cart.create({
                user_Id:userId,
                products:[
                   {
                    product_Id:productId,
                    quantity:1
                   },

                ],

             }).then(()=>{
                res.json({status:true})
             })
             
        } 

    async function addOneProduct(userId,productId){
        let updateCart=await Cart.updateOne(
            {user_Id:userId,products:{$elemMatch:{product_Id:productId}}},
            {$inc:{"products.$.quantity":1}}

        
        )   
        console.log("updated")
       
    }

    
  
} catch (error) {
    console.log(error)
    res.status(500).render('user/500')
}})








/* ----------------------------------------Cart--------------------------------------------------- */
exports.getCart=(async (req,res)=>{
   
    const userId=req.session.userId 
    const session=req.session;
   
    try {
        let getProducts=await Cart.aggregate([
            {$match:{user_Id:ObjectId(userId)}},

                {
                    $unwind:"$products"
                }
                ,{
                    $project:{
                        products:"$products.product_Id",
                        quantity:"$products.quantity"
                    }
                 },
                {
                    $lookup:{
                        from:"products",
                        localField:"products",
                        foreignField:"_id",
                        as:"productData"
                    },
                },
                {
                    $project:{
                        products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                    }
                }
           
                   
    ])

   
 

   

            
            if(getProducts.length>=1){
                console.log("my mind and me ")
                    let singleProductPrice=await Cart.aggregate ([
                        {$match:{user_Id:ObjectId(userId)}},
                        {$unwind:"$products"},
                        {$project:{
                            products:"$products.product_Id",
                            quantity:"$products.quantity"
                    }},
                        {$lookup:{
                            from:"products",
                            localField:"products",
                            foreignField:"_id",
                            as:"ProductData"
                        }
                        },
                    {$unwind:"$ProductData"},
                    
                    {$project:{total:{$multiply:["$quantity","$ProductData.price"]}}},
                    {$project:{_id:0,total:1}}
                    ])
                let totalPrice=await Cart.aggregate([
                    {$match:{user_Id:ObjectId(userId)}},
            
                        {
                            $unwind:"$products"
                        }
                        ,{
                            $project:{
                                products:"$products.product_Id",
                                quantity:"$products.quantity"
                            }
                         },
                        {
                            $lookup:{
                                from:"products",
                                localField:"products",
                                foreignField:"_id",
                                as:"productData"
                            },
                        },
                        {
                            $project:{
                                products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                            }
                        },
                        {
                            $group:{
                                _id:null,
                                totalAmount:{$sum:{$multiply:["$quantity","$productData.price"]}}
                            }
                        },
                        {$project:{_id:0,totalAmount:1}}
            
                   
                           
            
            
            ])
            let cartCount=0;
            // check does user have cart or not....
            let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
            console.log("user has cart"+cart)
            
            if(cart){
           
            cartCount=cart.products.length;
            console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
            
            }
           
            console.log( totalPrice[0].totalAmount)
            res.render('user/addCart',{getProducts,userId,totalPrice,singleProductPrice,session,cartCount})
            }else{
                cartCount=0;
                
                res.render('user/addCart',{getProducts,cartCount,session})
            }
        
     
        
        console.log(getProducts.length)  
            
              
        
    } 
     catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})



/* ----------------------------change-product-qty------------------------------------- */
exports.postChangeQty=(async(req,res)=>{
  
    console.log(req.body)
    const userId=req.session.userId
    
    try {
        const cartId=req.body.cart;
        const productId=req.body.product;
        const quantity=parseInt(req.body.quantity)
        const count=parseInt (req.body.count);
            if(count==-1&&quantity==1){
               
                let productPull=await Cart.updateOne({_id:cartId},
                {$pull:{products:{product_Id:productId}}}
                ).then(()=>{
                    res.json(
                        {
                            statusRemove:true,
                           
                        }
                        )
                })


            }else{
                let userProdExist=await Cart.findOne({_id:cartId,products:{$elemMatch:{product_Id:productId}}})
                console.log(userProdExist)
                 if(userProdExist){
                     let changePrdQty=await Cart.updateOne({_id:cartId,products:{$elemMatch:{product_Id:productId}}},
                         {$inc:{"products.$.quantity":count}})

                        
                         let singleProductPrice=await Cart.aggregate ([
                            {$match:{user_Id:ObjectId(userId)}},
                            {$unwind:"$products"},
                            {$project:{
                                products:"$products.product_Id",
                                quantity:"$products.quantity"
                        }},
                            {$lookup:{
                                from:"products",
                                localField:"products",
                                foreignField:"_id",
                                as:"ProductData"
                            }
                            },
                        {$unwind:"$ProductData"},
                        
                        {$project:{total:{$multiply:["$quantity","$ProductData.price"]}}},
                        {$project:{_id:0,total:1}}
                        ]).then(data=>{
                            res.json({
                                status:true,
                                data:data
                                
                            })
                            
                        })
                
                         
            }
            let totalPrice=await Cart.aggregate([
                {$match:{user_Id:ObjectId(userId)}},
        
                    {
                        $unwind:"$products"
                    }
                    ,{
                        $project:{
                            products:"$products.product_Id",
                            quantity:"$products.quantity"
                        }
                     },
                    {
                        $lookup:{
                            from:"products",
                            localField:"products",
                            foreignField:"_id",
                            as:"productData"
                        },
                    },
                    {
                        $project:{
                            products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                        }
                    },
                    {
                        $group:{
                            _id:null,
                            totalAmount:{$sum:{$multiply:["$quantity","$productData.price"]}}
                        }
                    },
                    {$project:{_id:0,totalAmount:1}}
        
               
                       
        
        
        ]).then(data=>{
            res.json(
                {statusTotalAmount:true,
                    data:data
                }
            )
        })
            


      
                
        }
        
        
    } catch (error) {
        console.error(error)
        res.status(500).render('user/500')
    }

})
/* -------------------------------------Remove-Cart--------------------------------------------- */
exports.removeCart=(async(req,res)=>{

    const product_Id=req.params.id
    const user_Id=req.session.userId


        let userExist=await Cart .findOne({user_Id:ObjectId(user_Id)})
        if(userExist){
            let removeCart=await Cart.updateOne({user_Id:ObjectId(user_Id)},
            {$pull:{products:{product_Id:product_Id}}}            
            ).then((data)=>{
                res.json(
                    {
                        response:true,
                       
                    }
                    )
            })
           
        }
       
})


/* -------------------------------------CheckOutPage------------------------------------------ */

exports.getCheckOutPage=(async(req,res)=>{
    try {
        
        const userId=req.session.userId 
        const session=req.session
        
        
        let totalPrice=await Cart.aggregate([
            {$match:{user_Id:ObjectId(userId)}},

                {
                    $unwind:"$products"
                }
                ,{
                    $project:{
                        products:"$products.product_Id",
                        quantity:"$products.quantity"
                    }
                 },
                {
                    $lookup:{
                        from:"products",
                        localField:"products",
                        foreignField:"_id",
                        as:"productData"
                    },
                },
                {
                    $project:{
                        products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                    }
                },
                {
                    $group:{
                        _id:null,
                        totalAmount:{$sum:{$multiply:["$quantity","$productData.price"]}}
                    }
                },
                {$project:{_id:0,totalAmount:1}}

           
    ])
        





    
    let cartCount=0;
    // check does user have cart or not....
    let cart=await Cart.findOne({user_Id: ObjectId(req.session.userId)})
    console.log("user has cart"+cart)

    if(cart){
           
        cartCount=cart.products.length;
        console.table("count=?>>>>>>>>>>>>>>>>"+cartCount);
        
        let getUserAddress=await User.findOne({email:req.session.email})
 
   

        const addressDetails=getUserAddress.addressDetails
        let totalAmount=totalPrice[0].totalAmount;
         let total=totalPrice[0].totalAmount;
    
        let discount=0;
        res.render('user/checkOut',{totalAmount,addressDetails,discount,getUserAddress,total,session,cartCount})
       
        }else{
            cartCount=0;
            
           
                    let discount=0;
                    res.render('user/checkOut',{totalAmount,addressDetails,getUserAddress,discount,session,cartCount})
                 
        }

 
   

         
        
       
    } catch (error) {
        console.error(error)
        res.status(500).render('user/500')
    }
})



exports.postCheckOutPage=(async(req,res)=>{

    // console.log(req.body);
    // console.log(req.query)
    try {
        
        console.log(req.body)
        const user_Id=req.session.userId
        const userAddressId=req.body.address
        console.log(typeof(req.body.totalAmount))
        const discountPrice=Number(req.body.discountPrice)
        
        const total=Number(req.body.totalAmount)
         const totalPrice=total-discountPrice;
         
         console.log(totalPrice)
            
            

        

        /* -----------------------Finding User  specific Address---------------------------- */
        const UserAddressGet=await User.findOne({_id:user_Id},{addressDetails:{$elemMatch:{_id:userAddressId}}})
     

        const userAddress=UserAddressGet.addressDetails;
      

       



        
       
        
           

            /* ----------------------Getting product------------------------------------ */
            
            let productData=await Cart.aggregate([
                {$match:{user_Id:ObjectId(user_Id)}},
                {$unwind:"$products"},
                {$project:{products:"$products.product_Id",quantity:"$products.quantity"}},
                {$lookup:{
                    from:"products",
                    localField:"products",
                    foreignField:"_id",
                    as:"productsPurchased"
                }},
                {
                    $unwind:"$productsPurchased"
                },
                {$project:{price:"$productsPurchased.price",quantity:1,product_Id:"$products"}}
                

              
                
            ])
          
            console.log(productData)
            
        /* -----------Creating-Order-------------- */
        const name=userAddress[0].name;
        const address=userAddress[0].address;
        const mobileNumber=userAddress[0].mobileNumber;
        const paymentMethod=req.body["payment-method"];
        const pinCode=userAddress[0].pinCode;
        const orderItem=productData
        const totalAmount=totalPrice;
        const orderStatus=paymentMethod=='COD'?"placed":"pending";
    
        const createOrder=await order.create({
            user_Id:ObjectId(user_Id),
            name:name,
            address:address,
            mobileNumber:mobileNumber,
            paymentMethod:paymentMethod,
            pinCode:pinCode,
            orderStatus:orderStatus,
            orderOn:new Date(),
            totalAmount:totalAmount,
            orderItem:orderItem,
            deliveryDate:moment().add(4, 'days').format('MMM Do YY')
            
        }).then((data)=>{


            if(paymentMethod=='COD'){
                res.json({
                    orderPlaced:true,
                    data:data
                })
            }else if(paymentMethod=='ONLINE'){
                console.log(totalAmount)
                console.log(data._id)
                var options = {
                    amount:totalAmount*100 ,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: `${data._id}`
                  };
                  instance.orders.create(options, (err, orders)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("success");
                        res.json([{
                            success:false,
                            orders
                        }])
                    }
                    console.log(orders);
                  });
            }

                  }          )
        
        
   

    } catch (error) {
        console.error(error)
        res.status(500).render('user/500')
    }


})

/* -------------------------------verifyPayment--------------------------- */

exports.postVerifyPayment=(async(req,res)=>{
   
    console.log("payment")
    console.log(req.body.payment)
    console.log(req.body.order)
    const payment=req.body.payment;
    const Order=req.body.order;

    let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECERT)

    hmac.update(
       
        payment.razorpay_order_id +
        
        '|' +
        
        payment.razorpay_payment_id
    );
    hmac = hmac.digest('hex');
         if (hmac ==payment.razorpay_signature) {
        const objId = mongoose.Types.ObjectId(Order.receipt);
        // console.log(objId);
     const orders= await order.updateOne({ _id: objId }, { $set: { paymentStatus: 'Paid' } })
            .then(() => {
                res.json({ success: true, order_id:Order.receipt });
            })
            .catch((err) => {
                console.log(err);
                res.json({ status: false, err_message: 'payment failed' });
            });
    } else {
        res.json({ status: false, err_message: 'payment failed'});
}



})

/* -------------------------------Orderfinished------------------------- */

exports.getOrderConfirmed=(async(req,res)=>{
    try {
        console.log(req.query)
        const order_id=req.query.order_id
        const user_Id=req.session.userId

        const createOrder=await order.findOne({_id:order_id})

        console.log("new thing")
        console.log(createOrder)
        const orderId=createOrder._id;

        const orderOn=createOrder.orderOn;
        const orderDate=orderOn.slice(0,16);
        console.log(orderDate)


        let getProductDetails=await order.aggregate([
            {$match:{_id:orderId}},
            {$unwind:"$orderItem"},
            {$project:{
                products:"$orderItem.product_Id",
                quantity:"$orderItem.quantity",
                price:"$orderItem.price"
            }},
            {$lookup:{
                from:"products",
                localField:"products",
                foreignField:"_id",
                as:"orderedProduct"
            }},
            {$project:{quantity:1,price:1,orderedProduct:{$arrayElemAt:["$orderedProduct",0]}}},


            

        ])
            console.log(getProductDetails)

       
        
       let totalAmount= createOrder.totalAmount;

      
let deleteCart=await Cart.deleteOne({user_Id:ObjectId(user_Id)})

       
       res.render('user/finalOrderPage',{createOrder,orderDate,getProductDetails,totalAmount})
       }
       
            // if(totalAmount<1000){
            //     let shippingRate=5/100;
            //     let shippingPrice=totalAmount*shippingRate;
            //     let ShippingFees=totalAmount-shippingPrice;
            // }else{
            //     let ShippingFees=0;
            // }

      

        // res.render('user/finalOrderPage',{createOrder,orderDate,getProductDetails,totalAmount})
     catch (error) {
        console.log(error)
        res.status(500).render('user/500')
        
    }

})




/* --------------------------------------Address Push------------------------------------------ */
exports.postAddress=(async(req,res)=>{
    try {
        const userEmail=req.session.email
        const name=req.body.name;
        const address=req.body.address;
        const mobileNumber=req.body.mobile;
        const pinCode=req.body.pincode;
        const email=req.body.email
        console.log(name,mobileNumber,pinCode,)
        console.log(address)

        const addressDetails={
            name:name,
            address:address,
            mobileNumber:mobileNumber,
            pinCode:pinCode,
            email:email
        }

        let pushAddress=await User.updateOne({email:userEmail},{$push:{addressDetails:addressDetails}})
        res.redirect('/check-out')


    } catch (error) {
     console.err(error)   
    }
})

exports.deleteAddress=(async(req,res)=>{
    console.log("hello=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

    try {
        const deleteAddressId=req.params.id;
        const user_Id=req.session.userId
        console.log(deleteAddressId)
        let deleteAddress=await User.updateOne({_id:user_Id},{$pull:{addressDetails:{_id:deleteAddressId}}}).then(res)
    res.json({
            delete:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }

})

/* ----------------------------------Coupon-Check-------------------------------------------------- */
exports.checkCoupon=(async(req,res)=>{
    try {
        const totalAmount=req.body.totalAmount;
        console.log(totalAmount)
        const getCoupon=await coupon.findOne({couponCode:req.body.code})


   
    
        
        const user_Id=req.session.userId
        if(getCoupon){
            const minAmount=getCoupon.minimumAmount
            const maxAmount=getCoupon.maximumAmount
            const discountPercentage=getCoupon.discount
            const couponId=getCoupon._id;
            console.log("the coupon is exist ")
            const userExist=await coupon. findOne({_id:couponId},{user:{$elemMatch:{user_id:user_Id}}})
           
            console.log(userExist.user)
        
                    if( userExist.user.length==0 ){
                        // const pushUser=await coupon.findByIdAndUpdate({_id:couponId},{$push:{user:[{user_id:user_Id}]}})
                         if(totalAmount>=minAmount && totalAmount<=maxAmount){

                    const pushUser=await coupon.findByIdAndUpdate({_id:couponId},{$push:{user:[{user_id:user_Id}]}})
                    // we can provide discount
                    // calculate discount price.and also substract from the total price
                    let discountPrice=totalAmount*(discountPercentage/100)
                    let finalAmount=totalAmount-discountPrice;
                    res.json({
                        discountedAmount:true,
                        discountPrice:discountPrice,
                        discountPercentage:discountPercentage,
                        finalAmount:finalAmount
                    })
                }else{
                    res.json({
                        limitExceed:true,
                        minAmount:minAmount,
                        maxAmount:maxAmount
                    })
                }
                
           }else if(userExist.user){
            res.json({
                couponUsed:true
            })
           }
                  
        }else{
         res.json({
             couponNotFound:true
             })
                    }   
        //     for(let i=0;i<userExist.user.length;i++){
        //         console.log("hajfdasdjhfgb")
        //         let flag=1;
        //         const userExists=userExist.user[i]
        //         console.log(userExists.user_id)
        //         console.log(user_Id)
        //         if(user_Id==userExists.user_id){
        //             flag=0;
        //             console.log("user exist")
                   
        //         }else{
        //             console.log("user not found")
        //         }
        // //         else{
               
        // }
    
    
    } catch (error) {
        console.log(error)
        res.status(500).render('user/500')
    }
})
