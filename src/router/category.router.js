
const express = require('express');
const router = express.Router();

const categoryController = require('../controller/category.controller');

// GET ALL CATEGORIES
router.get('/', categoryController.getCategories);

// SHOW CREATE CATEGORY PAGE
router.get('/create', categoryController.createCategory);

// STORE CATEGORY
router.post('/store', categoryController.storeCategory);

// VIEW SINGLE CATEGORY
router.get('/view/:id', categoryController.viewCategory);

// SHOW EDIT CATEGORY PAGE
router.get('/edit/:id', categoryController.editCategory);

// UPDATE CATEGORY
router.post('/update/:id', categoryController.updateCategory);

// SOFT DELETE CATEGORY
router.get('/delete/:id', categoryController.deleteCategory);

// RECYCLE BIN
router.get('/recycle-bin', categoryController.recycleBin);

// RESTORE CATEGORY
router.get('/restore/:id', categoryController.restoreCategory);

// PERMANENT DELETE CATEGORY
router.get('/permanent-delete/:id', categoryController.permanentDeleteCategory);

module.exports = router;
