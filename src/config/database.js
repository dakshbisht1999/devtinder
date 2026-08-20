const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    // console.log("mongo_uri_devtinder", process.env.MONGO_URI_DEVTINDER)
    await mongoose.connect(
        process.env.MONGO_URI_DEVTINDER
    );
}

// 1. Create Connection A
const mainDB = mongoose.createConnection(process.env.MONGO_URI_DEVTINDER);

mainDB.on("connected", () => {
    console.log("Main App Database connected successfully.");
});

// 2. Create Connection B
const adminDB = mongoose.createConnection(process.env.MONGO_URI_ADMIN);

adminDB.on("connected", () => {
    console.log("Admin Database connected successfully.");
});

module.exports = {connectDB, mainDB, adminDB}