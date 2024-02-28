const express = require('express');
const {createCategory, getCategory, updateCategory, reomveCategory, getOneCategory, getCategoryList} = require('../../controllers/category/category.controller');
const router = express.Router();

router.post('/create',createCategory);
router.get('/getAllCategory',getCategory);
router.put('/updateCategory/:id',updateCategory);
router.get('/removeCategory/:id',reomveCategory);
router.get('/getCategory/:id',getOneCategory);
router.get('/getCategoryList',getCategoryList)
module.exports = router;