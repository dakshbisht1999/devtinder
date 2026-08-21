const mongoose = require("mongoose");
// const {Schema} = mongoose;

const userSchema = mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String
    },
    password:{
        type: String
    },
    gender:{
        type: String
    },
    age:{
        type: Number
    }
});

// here we attach userSchema to the Collection of Database
// 's' as postfix in db automatically, user -> users
const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel}