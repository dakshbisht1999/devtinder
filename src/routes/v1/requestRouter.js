const express = require("express");
const requestRouter = express.Router();

const { UserModel } = require("./../../models/user");
const {AppError} = require("./../../utils/AppError");
const { connectionRequestModel } = require("../../models/connectionRequest");


requestRouter.post("/send/:status/:toUserId", async (req, res, next)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status; // status: interested, ignored

        // check if fromUserId is same as toUserId in the mongoose.Schema using pre middleware

        const toUser = await UserModel.findById(toUserId);
        if(!toUser) throw new AppError("User doesn't exists",404);

        const allowedStatuses = ["interested", "ignored"];
        if(!allowedStatuses.includes(status)) throw new AppError("Invalid Status", 400);

        const existingConnectionRequest = await connectionRequestModel.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest) throw new AppError("Connection request already exists", 400)

        const connectionRequest = new connectionRequestModel({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        res.send({
            message: status == 'interested' ? "Connection Request sent successfully to "+toUser.firstname : "You have "+status+" "+toUser.firstName,
            success: true,
            data
        })

    } catch (error){
        next(error);
    }
});

requestRouter.post("/review/:status/:requestId", async (req, res, next)=>{

})



module.exports = {requestRouter};