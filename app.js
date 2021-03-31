const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require("dotenv").config();

// definisikan route yang sudah di buat
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const serverUrl = 'mongodb://127.0.0.1:27017/restful-api'
//const db = mongoose.connection;
// koneksi ke mmongoDB menggunakan mongoose
mongoose.connect(serverUrl, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

// Mendefenisikan library yang sudah dipanggil
app.use(morgan('dev'));
app.use('/images/uploads', express.static('images/uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS MIDLLEWARE
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Acess-Control-Allow-Header',
            'Origin,X-Requested-With, Content-Type, Accept, Authorization' 
    )
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next();
})


// panggil route sesuai dengan konstanta yang dibuat
// http://localhost:3000/products
app.use('/products', productRoutes);
// http://localhost:3000/orders
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }        
    });
});

module.exports = app;