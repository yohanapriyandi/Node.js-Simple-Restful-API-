const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Email exists on my system'
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User succesfully created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    })    
}

exports.user_signin = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });            
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                console.log(result);
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"     
                    }
                );
                return res.status(200).json({
                    message: 'Auth successfully',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.user_delete = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({ _id: id })
    .exec()
    .then(results => {
        console.log(results);
        res.status(200).json({
            message: 'User succesfully deleted'
        });
    })
    .catch(
        err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}