const mongoose = require("mongoose");
const { AppError } = require("../utils/AppError");
// const {Schema} = mongoose;

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        immutable: true
    },
    lastName:{
        type: String,
        required: true,
        immutable: true
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        immutable: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        // Custom validators
        // validate(value){
        //     if(!['male','female','others'].includes(value)){
        //         throw new AppError("Gender data is not valid!",400)
        //     }
        // },

        // Built-in validators
        enum: {
            values: ['male','female','others'],
            message: "{VALUE} is not a valid gender!"
        }
    },
    age:{
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    photoUrl:{
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png"
    },
    about:{
        type: String,
        default: "This is the default about of the user!"
    },
    skills:{
        type: [String]
    },
    // roles: {
    //     type: [String],
    //     enum: ['user', 'editor', 'admin'],
    //     default: ['user']
    // }
}, {
    timestamps: true // automatically adds createdAt and updatedAt fields to every new User.
});

// here we attach userSchema to the Collection of Database
// 's' as postfix in db automatically, user -> users
const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel}