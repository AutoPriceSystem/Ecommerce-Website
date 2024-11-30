const express = require('express');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  getProductsByIds,
  increaseQuantity,
  decreaseQuantity 
} = require('../controller/productCtrl');
const router = express.Router();

router.post('/add', createProduct);
router.post('/getallproducts', getAllProducts);
router.post('/getsingleproduct', getSingleProduct);
router.post('/getproductsbyids', getProductsByIds);
router.post('/delete', deleteProduct);
router.post('/increase-quantity', increaseQuantity); // Endpoint to increase quantity
router.post('/decrease-quantity', decreaseQuantity); // Endpoint to decrease quantity

module.exports = router;
