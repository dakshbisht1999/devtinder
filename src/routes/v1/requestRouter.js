const express = require("express");
const requestRouter = express.Router();

const {adminAuth, userAuth} = require("./../../middlewares/auth");
const { UserModel } = require("./../../models/user");
const {AppError} = require("./../../utils/AppError");
const {validateSignupData, validateLoginData} = require("./../../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");




module.exports = {requestRouter};