const express=require('express');
const router=express.Router();
const adminController=require('../controller/adminController')
const upload=require('../middleware/multer');
const Category = require('../model/Category');
const verifyAdmin=require('../middleware/session')





router.get('/admin_Login',adminController.getLogin);
router.post('/admin_Login',adminController.postLogin);
router.get('/admin_panel/user',verifyAdmin.verifyAdmin,adminController.getUser);
router.get('/admin_panel/add_products',verifyAdmin.verifyAdmin,adminController.getAddProducts);
router.post('/admin_panel/add_products',upload.single('myFiles'),adminController.postAddProducts);
router.get('/admin_panel/user/block/:id',verifyAdmin.verifyAdmin,adminController.blockUser);
router.get('/admin_panel/user/unblock/:id',verifyAdmin.verifyAdmin,adminController.unBlockUser);

/* ------------------------------Admin-Panel--------------------------------- */
router.get('/admin_panel',verifyAdmin.verifyAdmin,adminController.getDashboard)

/* ----------------------------Edit Product----------------------------------------------- */
router.get('/admin_panel/edit-products',verifyAdmin.verifyAdmin,adminController.getEditProducts);
router.get('/admin_panel/update_products/:id',verifyAdmin.verifyAdmin,adminController.getUpdateProducts);
router.post('/admin_panel/update_products/:id',upload.single('myFiles'),adminController.postUpdateProducts);
router.put('/admin_panel/delete_products/:id',adminController.deleteProducts);
router.put('/admin_panel/retrieve_products/:id',adminController.retrieveProducts);
/* -------------------------------Category-------------------------------------------------- */
router.get('/admin_panel/categoryList',adminController.getCategory);
router.post('/admin_panel/category',adminController.postCategory);
router.get('/edit-category/:id',verifyAdmin.verifyAdmin,adminController.getEditCategory)
router.post('/edit-category/:id',adminController.postEditCategory)
router.delete('/delete-category/:id',adminController.deleteCategory)
router.get('/add-category',verifyAdmin.verifyAdmin,adminController.getAddCategory)

/* ----------------------------Banner----------------------------------- */
router.get('/admin_panel/banner',verifyAdmin.verifyAdmin,adminController.getBanner);
router.get('/admin_panel/add-banner',verifyAdmin.verifyAdmin,adminController.getAddBanner)
router.post('/admin_panel/banner',upload.single('myFiles'),adminController.postBanner)
router.get('/update-banner/:id',verifyAdmin.verifyAdmin,adminController.getUpdateBanner)
router.post('/admin_panel/update-banner/:id',upload.single('myFiles'),adminController.postUpdateBanner);
router.delete('/admin_panel/delete-banner/:id',adminController.deleteBanner)


/* ---------------------------Coupon------------------------------------------ */
router.get('/admin_panel/coupon',verifyAdmin.verifyAdmin,adminController.getCoupon)
router.get('/add-coupon',verifyAdmin.verifyAdmin,adminController.getAddCoupon)
router.post('/add-coupon',adminController.postAddCoupon)
router.get('/edit-coupon/:id',verifyAdmin.verifyAdmin,adminController.getEditCoupon)
router.post('/update-coupon/:id',adminController.postEditCoupon)
router.get('/delete-coupon/:id',adminController.deleteCoupon)
/* ---------------------------Order-Management---------------------------- */
router.get('/admin_panel/orderList',verifyAdmin.verifyAdmin,adminController.getOrderList)
router.get('/admin_panel/orderPrds/:id',verifyAdmin.verifyAdmin,adminController.getOrderPrds)
router.post('/status-update/:id',adminController.statusUpdate)

/* ----------------------------Sales-Report----------------------------------------- */
router.get('/admin_panel/sales-report/',verifyAdmin.verifyAdmin,adminController.getSalesReport)
router.post('/admin_panel/download',adminController.downloadSales )



 module.exports=router;