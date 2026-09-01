const mongoose = require("mongoose");
const { AppError } = require("../utils/AppError");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is incorrect status type."
        }
    }
},
{timestamps: true} // automatically adds createdAt and updatedAt fields to every new connectionRequest.
);

// Pre-save Hook: Stop a user from sending a request to themselves!
connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new AppError("Cannot send connection request to yourself", 400)
    }
    // next();
})

// Compound Index: Prevents user A from sending multiple requests to user B
connectionRequestSchema.index({fromUserId:1, toUserId:1}, {unique: true});

const connectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);
module.exports = {connectionRequestModel}