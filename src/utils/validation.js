const {UserModel} = require("./../models/user");
const {AppError} = require("./AppError");
const validator = require("validator");

const validateSignupData = async (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;
    
    if (!firstName || !lastName || !password || !age) {
        // const err = new Error("Please provide all required fields");
        // err.statusCode = 400;
        // throw err;

        throw new AppError("Name is not valid!", 400);
    } else if (!emailId || !validator.isEmail(emailId)){
        throw new AppError("Email is not valid!", 400);
    } else if (!password || !validator.isStrongPassword(password)){
        throw new AppError("Please enter a strong password!", 400);
    } else if (await UserModel.findOne({ emailId: emailId })){
        // CASE: Duplicacy Check (Kya email pehle se database mein hai?)
        throw new AppError("This email is already registered. Please signup via different email.", 400);
    }
}

module.exports = {validateSignupData}