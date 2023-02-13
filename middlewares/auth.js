require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
                if (err) {
                    return res.status(401).json({
                        error: "Unauthorized"
                    })
                }
                const user = await User.User.findOne({ _id: payload._id }).select("-password");
                req.user = user;
                // console.log(user);
                next();
            })
        }
        else {
            return res.status(403).json({
                error: "Forbidden"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = auth;