const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_product_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return{
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,     
                        productImage: doc.productImage,
                        request: {
                            type: "GET",
                            url:"http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            }
            if (docs.length >= 0) {
                res.status(200).json(response);    
            }else{
                res.status(404).json({
                    message: 'No entries found'
                });
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        })
}

exports.create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message:'Created Product Succcesfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,           
                request: {
                    type: "GET",
                    url:"http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });    
}

exports.get_product_byId = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price productImage _id')
        .exec()
        .then(doc=>{
            console.log(doc)
                if (!doc) {
                    res.status(404).json({
                        message: 'No valid entry found for provided ID'
                    });
                    
                }else{
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            description: 'Get All Products',
                            url: 'http://localhost:3000/products'
                        }
                    });
                }            
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error: err
            });
        })
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    // const updateOps = {}
    // for (const ops of req.body) {
    //      updateOps[ops.propName] = ops.value;
    // }
     //Product.update({_id: id}, {$set:{name: req.body.newName, price: req.body.newPrice}}) 
    Product.updateMany({ _id: id }, { $set:req.body }) 
    .exec()
    .then( result => {
        console.log(result)
        res.status(200).json(result
        // {
        //  message: 'Product Updated',
        //  request: {
        //      type: 'GET',
        //      url: 'http://localhost:3000/products/' + id
        //  }
        // }
        );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
 }

 exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request:{
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
}