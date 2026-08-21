const mongoose = require("mongoose");
// const {Schema} = mongoose;

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String
    },
    age:{
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    // roles: {
    //     type: [String],
    //     enum: ['user', 'editor', 'admin'],
    //     default: ['user']
    // }
});

// here we attach userSchema to the Collection of Database
// 's' as postfix in db automatically, user -> users
const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel}