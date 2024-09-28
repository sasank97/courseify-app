require ('dotenv').config();
// console.log(process.env.JWT_USER_PASSWORD);
// console.log(process.env.MONGO_URL);

const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = 3000

const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main(){
    // await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect("mongodb+srv://sasank:tBpn82BVB6DKFN1p@cluster0.dbbxdvw.mongodb.net/coursera-app");
    app.listen(port);
        console.log(`listening on port ${port}`)
}

main()