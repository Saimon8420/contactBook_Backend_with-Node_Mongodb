require("dotenv").config();
const express = require('express');
const { User, validateUser } = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const auth = require("../middlewares/auth");
const userRouter = express.Router();
const saltRounds = 10;

// Login user and generate json web token via(jwt)
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Please enter all the require field" });

    // email validation
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailReg.test(email)) return res.status(400).json({ error: "Please enter a valid email address" });

    try {
        // checking user exist or not
        const matchedUser = await User.findOne({ email: email });
        if (!matchedUser) return res.status(400).json({ error: "Invalid user or password" });

        // if there were any user
        const passMatched = await bcrypt.compare(password, matchedUser.password);
        if (!passMatched) return res.status(400).json({ error: "Invalid user or password" });

        // generating json web token (jwt)
        const payload = { _id: matchedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });

        const user = { ...matchedUser._doc, password: undefined };
        return res.status(200).json({ token, user, message: "User successfully loggedIn" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Register new user
userRouter.post('/register', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password } = req.body;
    try {
        // finding is email which came from req unique/exist or not
        const findEmail = await User.findOne({ email: email });
        if (!findEmail) {
            const hashedPass = await bcrypt.hash(password, saltRounds);

            const user = new User({ name: name, email: email, password: hashedPass });

            await user.save();
            if (!user) {
                res.status(400).json({
                    message: "authentication failed!"
                });
            }
            else {
                res.status(200).json({
                    data: user,
                    message: "User registered successfully"
                })
            };
        }
        else {
            res.status(505).json({
                message: "Email already exist!!"
            })
        }

    } catch (error) {
        console.log(error);
        res.send(500).json({
            message: "There was a server side Error!"
        })
    }
});

// Update Password
userRouter.post("/update/pass", async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            const hashedPass = await bcrypt.hash(password, saltRounds);
            const updateUser = await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPass } });
            res.status(200).json({
                message: "update successful"
            })
        }
        else {
            res.status(404).json({
                message: "Can't find User",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error"
        })
    }
})

// Get user
userRouter.get("/auth", auth, async (req, res) => {
    return res.status(200).json({ ...req.user._doc });
})

module.exports = userRouter;