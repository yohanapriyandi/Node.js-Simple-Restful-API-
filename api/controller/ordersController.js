const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');


exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select("_id product quantity")
    .populate('product', 'name')
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            product: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
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
        };
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product yang anda pilih tidak ditemukan, silahkan pilih product kembali'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then( result => {
            console.log(result)
            res.status(201).json({
                message: 'Selamat orderan anda berhasil di input',
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Produk tidak ditemukan',
                error: err
            })
        });    
}

exports.get_order_byId = (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product', 'name price')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: "Data  not found"
            })
        }
        res.status(200). json({
            message: 'Get detail order by Id',
            data: order,
            request: {
                type: 'GET',
                description: 'Get all order',
                url: 'http://localhost:3000/orders/'
            }
        })        
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });       
}

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order dengan ' + id + ' berhasil dihapus',
            request: {
                type: 'POST',
                url: 'https://localhost:3000/orders/',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
}