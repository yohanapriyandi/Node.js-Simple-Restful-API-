const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controller/productsController');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductController.get_product_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.create_product);

router.get('/:productId', ProductController.get_product_byId );

router.patch('/:productId', checkAuth, ProductController.update_product );

router.delete('/:productId', checkAuth, ProductController.delete_product );

module.exports = router;
