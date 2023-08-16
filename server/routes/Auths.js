const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/Users");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "abbas";

const router = express.Router();
router.use(cors());
router.use(express.json());
 
 
router.post("/register",
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 12 })
    , async (req, res) => {
console.log(req.body)
        try {
            console.log(req.body)
            const errors = validationResult(req);
            console.log(errors)
            if (!errors.isEmpty()) {
                const error = errors.array()[0];
                if (error.param == "email") {
                    return res.status(400).json({
                        message : "Invalid email"
                    });
                }
                else if(password != confirmPassword){
                    return res.json.status(400).json({
                        message:"Password and Confirm Password should be same"
                    })
                    }
                
                 else {
                    return res.status(400).json({
                      message: "Invalid Password"
                    });
                }
            }
         
            const { firstName,lastName,username, email, password,confirmPassword } = req.body;
            console.log(req.body)
            const user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({
                    status: "Failed",
                    message: "User already exists"
                });
            }
        
            bcrypt.hash(password, 10 , async function (err, hash) {
           
                if (err) {
                    return res.status(500).json({ 
                        status: "Failed",
                        message: err.message
                    })
                }
                await User.create({
                    firstName,
                    lastName,
                    username,
                    email,
                    password: hash,
                    confirmPassword: hash,
                });
                return res.status(200).json({
                    status: "Success",
                    message : "User registered successfully"
                })
            });
        } catch (e) {
          
            return res.status(500).json({
                status: "Failed",
                message:e.message
            })
        }
    });


router.post("/login", 
    body('email').isEmail(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                  errors: errors.array(),
                  message: "Invalid Email",
                });
            }
            console.log(req.body)
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: "Failed",
                    message: "User not registered, please register"
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id,
                    }, secret);

                    return res.status(200).json({
                        status: "Succces",
                        message : "Login successfully",
                        token
                    })
                }
                 else {
                    return res.status(400).json({
                        status: "Failed",
                        message: "Wrong Password"
                    })
                }
            });


        } catch (e) {
            return res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    });
module.exports = router;