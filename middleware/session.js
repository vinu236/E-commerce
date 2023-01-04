exports.verifyUser=((req,res,next)=>{
   if(req.session.userId && req.session.isLoggedIn){
    next();
   }else{
      res.redirect('/login')
   }
})

exports.verifyAdmin=(req,res,next)=>{
   if(req.session.adminEmail){
      next();
   }else{
      res.redirect('/admin_Login');
   }
}