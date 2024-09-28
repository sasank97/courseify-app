const { Router } = require("express");
const {userModel, purchaseModel, courseModel} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
    const {email, password, firstName, lastName} = req.body; //TODO: adding zod validation
    //TODO: hash the password so plaintext is not in DB.
    //TODO: put in try catch
    await  userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
      message: "signup endpoint succeeded"
    })
})
  
userRouter.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email: email,
        password: password
    })

    if(user){
       const token = jwt.sign({
            id:user._id
        }, JWT_USER_PASSWORD)
        // Do cookie logic
        res.json({
            message: "signin endpoint succeeded",
            token: token
            })
    } else{
        res.status(403).json({
            message: "incorrect credentials"
        })
    }
})
  
userRouter.get('/purchases', userMiddleware, async(req, res) => {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter    
}