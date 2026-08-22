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

const validateLoginData = async (req) => {
    const {emailId, password} = req.body;
    if(!emailId || !password){
        throw new AppError("Please enter valid email or password!",400)
    } else if(!validator.isEmail(emailId)){
        throw new AppError("Email is not valid!", 400);
    } else{
        // check email exists in our record, if not then send error
        const user = await UserModel.findOne({emailId:emailId});
        console.log(user)
        if(!user){
            throw new AppError("Invalid Credentials!",404);
        }else{
            return user;
        }

        // if email exists, then in the api level -
        // fetch the password hash and compare with plainPassword
    }
}

module.exports = {validateSignupData, validateLoginData}