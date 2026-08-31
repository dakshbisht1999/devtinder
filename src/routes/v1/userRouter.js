const express = require("express");
const userRouter = express.Router();

const { UserModel } = require("./../../models/user");
const {AppError} = require("./../../utils/AppError");



// GET - Feed API
userRouter.get("/feed", async(req,res,next)=>{
    try{
        const loggedInUser = req.user.toObject();
        const users = await UserModel.find({
            _id: { $ne: loggedInUser._id } // load all profiles except logged in
        }, {password:0, __v:0});
        if(users.length === 0){
            throw new AppError("No users found",404);
        }

        // pagination/scroll feature in the api {page:1, pageSize: 30, noOfPages:.., }
        res.send({
            data: users,
            totalCount: users.length,
            success: true
        });
    } catch (error) {
        next(error);
    }
});

// GET - /user/requests/received (with pagination)
// GET - /user/connections (with pagination)



module.exports = {userRouter};