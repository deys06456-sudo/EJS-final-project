const express = require('express');

const productController = require('../controller/product.controller');
const upload = require('../utils/multer');

const Router = express.Router();

// PRODUCT LIST
Router.get(
    '/',
    productController.getProducts
);

// CREATE PRODUCT PAGE
Router.get(
    '/create',
    productController.createProduct
);

// STORE PRODUCT
Router.post(
    '/store',
    upload.array('images', 10),
    productController.storeProduct
);

// VIEW PRODUCT
Router.get(
    '/view/:id',
    productController.viewProduct
);

// EDIT PRODUCT PAGE
Router.get(
    '/edit/:id',
    productController.editProduct
);

// UPDATE PRODUCT
Router.post(
    '/update/:id',
    upload.array('images', 10),
    productController.updateProduct
);

// SOFT DELETE PRODUCT
Router.post(
    '/delete/:id',
    productController.deleteProduct
);

// RECYCLE BIN
Router.get(
    '/recycle-bin',
    productController.recycleBin
);

// RESTORE PRODUCT
Router.get(
    '/restore/:id',
    productController.restoreProduct
);

// PERMANENT DELETE PRODUCT
Router.get(
    '/permanent-delete/:id',
    productController.permanentDeleteProduct
);

module.exports = Router;
