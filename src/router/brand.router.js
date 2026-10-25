
const express = require('express');
const router = express.Router();

const brandController = require('../controller/brand.controller');

// GET ALL BRANDS
router.get('/brands', brandController.getBrands);

// SHOW CREATE BRAND PAGE
router.get('/brands/create', brandController.createBrand);

// STORE BRAND
router.post(
    '/brands/store', 
    brandController.storeBrand
);

// VIEW SINGLE BRAND
router.get(
    '/brands/view/:id', 
    brandController.viewBrand
);

// SHOW EDIT BRAND PAGE
router.get(
    '/brands/edit/:id', 
    brandController.editBrand
);

// UPDATE BRAND
router.post(
    '/brands/update/:id', 
    brandController.updateBrand
);

// SOFT DELETE BRAND
router.get(
    '/brands/delete/:id', 
    brandController.deleteBrand
);

// RECYCLE BIN
router.get(
    '/brands/recycle-bin', 
    brandController.recycleBin
);

// RESTORE BRAND
router.get(
    '/brands/restore/:id', 
    brandController.restoreBrand
);

// PERMANENT DELETE BRAND
router.get(
    '/brands/permanent-delete/:id', 
    brandController.permanentDeleteBrand
);

module.exports = router;
