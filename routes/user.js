const express=require('express');
const router=express.Router();
var multer = require('multer');
const userController=require('../controller/userController');
const verifyUser=require('../middleware/session')


/* ------------------------------Login----------------------------------------------- */
router.get('/login',userController.getLogin);
router.post('/login',userController.postLogin);

/* --------------------------------Otp-------------------------------------------------- */
router.get('/otp',userController.getOtp)
router.post('/otp',userController.postOtp)

/* -----------------------------SignUp---------------------------------------------- ---*/
router.get('/signup',userController.getSignup);
router.post('/signup',userController.postSignup)

/* ------------------------------HOME------------------------------------------------ */
router.get('/home',verifyUser.verifyUser,userController.getUserHome);
router.get('/',userController.getHome);


/* ------------------------------User-Profile----------------------------------------- */
router.get('/user/profile',verifyUser.verifyUser,userController.getUserProfile)
router.get('/user/edit-profile',verifyUser.verifyUser,userController.getEditProfile)
router.post('/user/update-profile',verifyUser.verifyUser,userController.postProfile)
router.get('/user/order',verifyUser.verifyUser,userController.getUserOrderDetails)
// router.get('/user/order-details-view/:id',verifyUser.verifyUser,userController.getOrder)



/* ------------------------------Shop------------------------------------------------- */
router.get('/shop',verifyUser.verifyUser,userController.getShopPage)
    
/* --------------------------------Add-Cart--------------------------------------------- */
router.get('/add-cart/:id',userController.getAddCart)
// router.post('/add-cart',userController.postCart)
router.get('/cart',verifyUser.verifyUser,userController.getCart)
router.post('/remove-cart/:id',userController.removeCart)


/* -----------------------------------Wishlist--------------------------------------------- */
router.post('/add-wishlist/:id',verifyUser.verifyUser,userController.getAddWishlist)
router.get('/wishlist',verifyUser.verifyUser,userController.getWishlist);
router.delete('/delete-wishlist/:id',verifyUser.verifyUser,userController.deleteWishlist)



/* ---------------------------------Change qty of product--------------------------------- */
router.post('/change-quantity',userController.postChangeQty)

/* -------------------------------------ProductSingleView----------------------------------- */
router.get('/product-details',verifyUser.verifyUser,userController.getProductDetails)

/* ---------------------------------------Category------------------------------------------- */

/* --------------------------------checkOutPage--------------------------------------------- */
router.get('/check-out',verifyUser.verifyUser,userController.getCheckOutPage)
router.post('/check-out',verifyUser.verifyUser,userController.postCheckOutPage)
router.get('/order-confirmed',verifyUser.verifyUser,userController.getOrderConfirmed)
router.get('/checkout/:id',verifyUser.verifyUser,userController.getCheckOutPage)



/* -------------------------------VerifyPayment------------------------------------------------- */
router.post('/verify-payment',userController.postVerifyPayment)

/* --------------------------------Order-Page------------------------------------------------- */

router.get('/user-order-view/:id',verifyUser.verifyUser,userController.getUserProductView)



/* ------------------------------------Address-Push-------------------------------------------- */
router.post('/addAddress',userController.postAddress);
router.delete('/delete-address/:id',userController.deleteAddress)

/* -------------------------------------Coupon-------------------------------------------------- */
router.post('/coupon-check',userController.checkCoupon)


/* ---------------------------------------Logout------------------------------------------------- */
router.get('/logout',userController.logout)


module.exports=router;