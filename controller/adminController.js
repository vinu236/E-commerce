const User = require("../model/userSignup");  
const category=require('../model/Category')
const products=require('../model/Add-products');
const order=require('../model/order');
const banner=require('../model/banner')
const coupon=require('../model/Coupon');
const mongoose=require('mongoose');
const excelJs=require('exceljs')
require('fs')
require('dotenv').config()
const path = require("path");


const ObjectId = mongoose.Types.ObjectId;


exports.getLogin = async (req, res) => {
  
  res.render("admin/adminLogin.ejs");
};
exports.postLogin = async (req, res) => {
  
  try {
  const email = req.body.email;
  const password = req.body.password;
      if(process.env.ADMIN_EMAIL==email && process.env.ADMIN_PASSWORD==password){
         req.session.adminEmail=req.body.email
        res.redirect("/admin_panel/user");
      }else{
        res.send("password is missing");
      }


    
  } catch (error) {
    console.log(error);
  }
};


exports.getUser = async (req, res) => {
  
  try {
    const userDetails = await User.find({});
    res.render("admin/adminDashboard", { userDetails });
  } catch (error) {
    console.log(error);
  }
};


exports.blockUser=async(req,res)=>{
 console.log(req.params.id)
 const id=req.params.id;
  
 
  try {
    const blockUser=await User. findByIdAndUpdate(id,{Active:'false'})
    res.redirect('/admin_panel/user')
    console.log("blocked")
  } catch (error) {
    console.log(error)
  }
  
}
exports.unBlockUser=async(req,res)=>{
  console.log(req.params.id)
  const id=req.params.id;
  
  
   try {
     const blockUser=await User. findByIdAndUpdate(id,{Active:'true'})
     res.redirect('/admin_panel/user')
     console.log("unblocked")
   } catch (error) {
     console.log(error)
   }
   
 }
 /* --------------------------------DashBoard-------------------------------------------- */
 exports.getDashboard=(async(req,res)=>{
  try {
    const usercount=await User.find().count()
    const productcount=await order.find().count()
    const ordercount=await products.find().count()
    const completed = await order.find({ orderStatus: 'Placed' }).count()
    const shipped=await order.find({orderStatus:'Shipped'}).count()
    const pending=await order.find({orderStatus:'Pending'}).count()
    const delivered=await order.find({orderStatus:'Delivered'}).count()
    const cod=await order.find({paymentMethod:'COD'}).count()
    const online=await order.find({paymentMethod:'Online'}).count()
    
    console.log(completed)

    res.render('admin/chart',{usercount,productcount,ordercount,completed,shipped,pending,delivered,cod,online})
  } catch (error) {
    
  }
 })



 /*------------------------------- categories---------------------------------------- */

 exports.getCategory=(async(req,res)=>{
  console.log("entered")
  const getCategoryList=await category.find();
  console.log(getCategoryList)
  res.render('admin/categoryList',{getCategoryList})
})




exports.getEditCategory=(async(req,res)=>{
  console.log("welcome")
  try {
    const id= req.params.id;
    

    const getEditCategory=await category.findById({_id:id})
    console.log(getEditCategory)
    console.log('hello')
    res.render('admin/editCategory',{getEditCategory})
    
  } catch (error) {
    res.status(404).send({error})
  }
})



exports.postEditCategory=(async(req,res)=>{
 
  try {
    
    const id=req.params.id;
    const name=req.body.name
    const updateCategory=await category.findByIdAndUpdate({_id:id},{
      Name:name
    })
    res.redirect('/admin_panel/categoryList')
  } catch (error) {
    console.log(error)
  }
})

exports.deleteCategory=(async(req,res)=>{
  try {
    const id= req.params.id

    const deleteCategory=await category.findOneAndDelete({_id:id}).then(()=>{
      res.json({
        deleteStatus:true

      })
    })
  } catch (error) {
    console.log(error)
  }
})

exports.getAddCategory=((req,res)=>{
  try {
    res.render('admin/Add-category')
  } catch (error) {
    console.log(error)
  }
})


/* -----------------------------cuurent------------------ */
exports.postCategory=async(req,res)=>{
  console.log("im category")
 
 
  try {
    const nameField=req.body.name;
    const name=nameField.toUpperCase();
   
    console.log(name)
    console.log("**********************")
    const checkCategory=await category.findOne({Name:name})
    console.log(checkCategory)
    if(checkCategory==null || checkCategory.Name!=name){
      console.log("not exist then create")
      const postCategory=await category.create({
        Name:name
    }).then(()=>{
      res.json({
        postedCategory:true
      })
    })
      
    }else{
      
     
      res.json({
        alreadyExist:true
      })
      
      
    // res.redirect('/admin_panel/categoryList')
    }
      
  } catch (error) {
      console.log(error)
  }
}




exports.postAddProducts=async(req,res)=>{
  console.log("HELLO WORLD")
  console.log("post product")
    console.log(req.file)
  const title = req.body.title;
  const image = req.file.filename;
  const price = req.body.price;
  const description = req.body.description;
  const size=req.body.size;
  const category=req.body.category
  const stock=req.body.stock
  
 try {
  const addedProducts=await products.create({
    title:title,
    imageUrl:image,
    price:price,
    description:description,
    size:size,
    category:category,
    Stock:stock

  })

  res.redirect('/admin_panel/edit-Products')
 } catch (error) {
  console.log(error)
 }

 
    // console.log("hello")
    // console.log(req.files);
    
   

      // const product = new Product({
       
      //   title: title,
      //   price: price,
      //   description: description,
      //   imageUrl: imageUrl,
        
      // });



      // convert image into bas64 encoding-converting data into asci characters-size of base64 the actual size of original data
      /* 1,converting all images into base64 encoding and store it on DB */
      // let ImgArray=files.map((file)=>{
      //   let img=fs.readFileSync(file.path)
      //   return encode_image=img.toString('base64')
      // })
      // ImgArray.map((src,index)=>{
      //   // create object

      // })
      // res.json(ImgArray)
  
   }

   /* ----------------AddProducts---------------------------------- */
   exports.getAddProducts = async (req, res) => {
    console.log("getAddProducts");
    try {
      const getCategory=await category.find();
      console.log(getCategory.Name)
      
    res.render("admin/Add-product",{getCategory});
    } catch (error) {
      console.log(error)
    }
    
  };





  /* ----------------EditProducts--------------------- */

  exports.getEditProducts = async (req, res) => {
    console.log('getProduct')
    try {
 
     const editProducts= await products.find();
    res.render('admin/edit-Product',{editProducts})
     
    } catch (error) {
     console.log(error)
    }
 
 
   };
   exports.getUpdateProducts=async(req,res)=>{
  
    try {
      console.log('update')
      const id=req.params.id;
      const getProduct=await products.findById(id);
      console.log(getProduct);
       res.render('admin/updateProduct',{getProduct}) /* here */
    } catch (error) {
       console.log(error)
    }
   };
   exports.postUpdateProducts=async(req,res)=>{
    console.log("image")
    console.log(req.file)
    const id=req.params.id
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const size=req.body.size;
    const category=req.body.category
    const stock=req.body.stock
    const image = req.file.filename;
    console.log(id)
  try {
    const updateProduct=await products.findByIdAndUpdate(id,{
       title:title,
       price:price,
       description:description,
       size:size,
       category:category,
       Stock:stock,
       imageUrl:image
    })
    res.redirect('/admin_panel/edit-products')
    
  } catch (error) {
    console.log(error)
  }
 
   }
 exports.deleteProducts=async(req,res)=>{
  console.log("deleteProducts")
    const id =req.params.id
    console.log(id)
  try {
    const deleteProducts=await products.findByIdAndUpdate({_id:id},{isDeleted:true}).then(()=>{
      res.json({
        deletedProducts:true
      })
    });
   
  } catch (error) {
    console.log(error)
    
  }
 
 }

 exports.retrieveProducts=(async(req,res)=>{
  console.log("retriveProducts")
  
  try {
    const id=req.params.id;
      const retrieveProducts=await products.findByIdAndUpdate({_id:id},{isDeleted:false}).then(()=>{
        res.json({
          retrieveProducts:true
        })
      })
  } catch (error) {
    console.log(error)
    
  }
 })

 exports.getBanner=(async(req,res)=>{
  console.log("BANNER")
  try {

    const getBannerImg=await banner.find()    
    res.render('admin/banner',{getBannerImg})
  } catch (error) {
    
  }
 })
 exports.getAddBanner=(async(req,res)=>{
  console.log("post banner")
  try {
    res.render('admin/Add-Banner')
  } catch (error) {
    console.log(error)
  }
 })
exports.postBanner=(async(req,res)=>{
  try {
   const img= req.file.filename;
   const head=req.body.head;
   const description=req.body.description;
   const url=req.body.url;
   const btnName=req.body.btnName̥
   

   const postBanner=await banner.create({
    bannerImage:img,
    url:url,
    head:head,
    description:description,
    btnName:btnName
   })  
   res.redirect('/admin_panel/banner');
  } catch (error) {
    console.log(error)
  }
})

exports.getUpdateBanner=(async(req,res)=>{
  try {
    const id= req.params.id
    const getBannerImg=await banner.findOne({_id:id})
    console.log(getBannerImg)
    res.render('admin/updateBanner',{getBannerImg})
  } catch (error) {
    
  }
})

exports.postUpdateBanner=(async(req,res)=>{
  try {
    const id=req.params.id;
    const image=req.file.filename
    
    const updateBanner=await banner.findByIdAndUpdate({_id:id},{
      bannerImage:image
    })
    res.redirect('/admin_panel/banner')
  } catch (error) {
    
  }
})
exports.deleteBanner=(async(req,res)=>{
  try {
    const id=req.params.id;
    console.log(id)
    const deleteBanner=await banner.findByIdAndDelete({_id:id}).then(()=>{
      res.json({
        deleted:true
      })
    })
  } catch (error) {
    
  }
})
/* ------------------------Coupon--------------------------------------------------------------- */
exports.getCoupon=(async(req,res)=>{
  try {

    const getCoupon=await coupon.find()
    res.render('admin/Coupon',{getCoupon}) 
  } catch (error) {
    
  }
})
exports.getAddCoupon=(async(req,res)=>{
  try {
    res.render('admin/Add-Coupon')
  } catch (error) {
    console.log(error)
  }
})
exports.postAddCoupon=(async(req,res)=>{
  try { 
    const couponCode=req.body.code;
    const minAmount=req.body.minAmount;
    const maxAmount=req.body.maxAmount;
    const ExpDate=req.body.ExpDate;
    const discount=req.body.discount;

    const AddCoupons=await coupon.create({
      couponCode:couponCode,
      minimumAmount:minAmount,
      maximumAmount:maxAmount,
      expiryDate:ExpDate,
      discount:discount
    })
    res.redirect('/admin_panel/coupon')
  } catch (error) {
    console.log(error)
  }
})


exports.getEditCoupon=(async(req,res)=>{
  try {
    
    const id=req.params.id
    const getCoupon=await coupon.findById({_id:id})
    res.render('admin/edit-coupon',{getCoupon})
  } catch (error) {
    
  }
})
exports.postEditCoupon=(async(req,res)=>{
  try {
    const couponCode=req.body.code;
    const minAmount=req.body.minAmount;
    const maxAmount=req.body.maxAmount;
    const ExpDate=req.body.ExpDate;
    const discount=req.body.discount;
    const id=req.params.id

    const updateCoupon=await coupon.findByIdAndUpdate({_id:id},{
      couponCode:couponCode,
      minimumAmount:minAmount,
      maximumAmount:maxAmount,
      expiryDate:ExpDate,
      discount:discount
    })
    res.redirect('/admin_panel/coupon')
  } catch (error) {
    
  }
})



exports.deleteCoupon=(async(req,res)=>{
  try {
    const id=req.params.id;
     console.log(id)
    const deleteCoupon=await coupon.findByIdAndDelete({_id:id}).then(()=>{
      res.json({
        deleted:true
      })
    })
  } catch (error) {
    console.log(error)
  }
})
 /* -----------------------Order-Management----------------------------------------------------- */
 exports.getOrderList=(async (req,res)=>{
  try {

    let getOrderList=await order.find()
    res.render('admin/ordersList',{getOrderList})
  } catch (error) {
    
  }
 })

 exports.getOrderPrds=(async(req,res)=>{
  try {
    const id= req.params.id;
    const getOrderPrds=await order.findById({_id:id})
    console.log(getOrderPrds)
    

    const getOrderedItems=await order.aggregate([
      {$match:{_id:ObjectId(id)}},
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
      
      {$project:{orderedItem:1,quantity:1,totalAmount:1}},
      {$unwind:"$orderedItem"}
      

  ])
  console.log("*******************************************")
    console.log(getOrderedItems)
    res.render('admin/orderListView',{getOrderedItems})
  } catch (error) {
    console.log(error)
  }
 })
 exports.statusUpdate=(async(req,res)=>{
  try {
    const id=req.params.id;
    const orderStatus=req.body.orderStatus;

    const statusUpdate=await order.findByIdAndUpdate({_id:id},{
      orderStatus:orderStatus
    }, {new: true}).then((data)=>{
      res.json({
        updated:true,
        data:data
      })
    })
  } catch (error) {
    console.log(error)
  }
 })


 /* -------------------------------------------Sales-Report---------------------------------------------------- */

 exports.getSalesReport=(async(req,res)=>{
  try {

    const sales= await order.find({$and:[{paymentStatus:"Paid"},{orderStatus:"Delivered"}]})
    console.log(sales)
    res.render('admin/sales-Report',{sales})

  } catch (error) {
    console.log(error)
  }
 })

 exports.downloadSales=(async(req,res)=>{

    try {
      let date = req.body;
      let orderData = await order.find({
        orderStatus: "Delivered",
        createdAt: { $gte: date.from, $lte: date.to },
      });

      const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
          { header: "Customer", key: "Customer", width: 15 },
          { header: "Payment Status", key: "PaymentStatus", width: 15 },
          { header: "Order Status", key: "OrderStatus", width: 15 },
          { header: "Amount", key: "Amount", width: 15 },
        ];

        orderData.forEach((orderData) => {
          worksheet.addRow({
            Customer: orderData.name,
            PaymentStatus: orderData.paymentStatus,
            OrderStatus: orderData.orderStatus,
            Amount: orderData.totalAmount,
          });
        });
        await workbook.xlsx.writeFile("order.xlsx").then((data) => {
          const location = path.join(__dirname + "../../order.xlsx");
          console.log(location)
          res.download(location);
        });


    } catch (error) {
      console.log(error);
}

 })