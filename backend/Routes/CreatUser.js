const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");           // hashing algorithm for safe access and avoid unauthorized access
const jwt = require("jsonwebtoken");          // using json web token
const jwtSecret = "MyNameisEndtoEndYouTubeChannel$#"

router.post('/creatUser', [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'password must be of minimum 5 length').isLength({ min: 5 })],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        try {
            await User.create({
                name: req.body.name,
                password: secPassword,                        // password is encrypted now
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });

        } catch (error) {
            console.log(error);
            res.json({ success: false });


        }
    })

router.post('/loginuser', [
    body('email').isEmail(),
    body('password', 'password must be of minimum 5 length').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        let email = req.body.email;

        try {
            let userData = await User.findOne({ email });

            if (!userData) {
                return res.status(400).json({ errors: "Try logging in with correct Credentials" });
            }
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Try logging in with correct Credentials" });
            }

            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken })

        } catch (error) {
            console.log(error);
            res.json({ success: false });


        }
    })

module.exports = router;