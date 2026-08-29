const express = require("express");
const userRouter = express.Router();

const { UserModel } = require("./../../models/user");
const {AppError} = require("./../../utils/AppError");



// GET - Feed API
userRouter.get("/feed", async(req,res,next)=>{
    try{
        const users = await UserModel.find({})
        if(users.length === 0){
            throw new AppError("No users found",404);
        }

        // load all profiles except logged in
        // pagination/scroll feature in the api {page:1, pageSize: 30, noOfPages:.., }
        res.send(users);
    } catch (error) {
        next(error);
    }
});

// GET - /user/requests/received (with pagination)
// GET - /user/connections (with pagination)



module.exports = {userRouter};