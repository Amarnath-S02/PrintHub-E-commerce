const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productController');
const manageuserController=require('../controller/manageuserController');


const isAdminLoggedIn = (req, res, next) => {
  if (req.session.isAdminLoggedIn) {
    return next();
  } else {
    return res.redirect('/adminlogin');
  }
};
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Set your desired destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage:storage });

router.get('/addcategory', isAdminLoggedIn, categoryController.getAddCategory);
router.post('/addcategory',isAdminLoggedIn , categoryController.postAddCategory);

router.get('/deletecategory', isAdminLoggedIn, categoryController.getcategory);
router.post('/deletecategory/:categoryId', isAdminLoggedIn, categoryController.deletecategory);

router.get('/addproduct', isAdminLoggedIn, productController.getAddProduct);
router.post('/addproduct', upload.single('productImage'), productController.postAddProduct);

router.get('/modifyproduct', isAdminLoggedIn, productController.getModifyProduct);
router.put('/updateproduct/:productId', productController.updateProduct);
router.delete('/deleteproduct/:productId', productController.deleteproduct);

router.get('/manageuser', isAdminLoggedIn, manageuserController.getmanageuser);
router.delete('/deleteuser/:userId', manageuserController.deleteUser);



module.exports = router;
