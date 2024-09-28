const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
//bcrypt, zod, jsonwebtoken
const  { JWT_ADMIN_PASSWORD } = require("../config");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post('/signup', async(req, res) => {
    const {email, password, firstName, lastName} = req.body; //TODO: adding zod validation
    //TODO: hash the password so plaintext is not in DB.
    //TODO: put in try catch
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })
    res.json({
      message: "signup endpoint succeeded"
    })
})
  
adminRouter.post('/signin', async(req, res) => {
    const {email, password} = req.body;

    const admin = await adminModel.findOne({
        email: email,
        password: password
    })

    if(admin){
       const token = jwt.sign({
            id:user._id
        }, JWT_ADMIN_PASSWORD)
        // Do cookie logic
        res.json({
            message: "signin endpoint"
            })
    } else{
        res.status(403).json({
            message: "incorrect credentials"
        })
    }
    res.json({
    message: "signin endpoint",
    token: token
    })
})

adminRouter.post('/course', adminMiddleware, async(req, res) => {
    const adminId = req.adminId;

    const { title, description, imageUrl, price } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put('/course',adminMiddleware, async(req, res) => {
    const adminId = req.adminId;

    const { title, description, imageUrl, price, courseId } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

adminRouter.get('/course/bulk', adminMiddleware, async(req, res) => {
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter    
}