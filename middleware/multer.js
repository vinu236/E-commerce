
const multer = require("multer");
const path = require("path");

// set disk-storage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+'--'+Date.now() + path.extname(file.originalname))
} 

}
) 
module.exports=multer({storage:storage})/* middle ware to run multer and here we storage the storage */