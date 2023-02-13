require("dotenv").config();
const express = require('express');
const cors = require("cors");
const User = require("./models/user.model");
const { json } = require("body-parser");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/user.route");
const contactRouter = require("./routes/contact.route");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("db connected");
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })

app.get("/", (req, res) => {
    res.send("Welcome to the server");
})

app.use(userRouter);
app.use(contactRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: "resource not found"
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})