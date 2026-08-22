// console.log("Hello, World!");

const express = require("express");
const {adminAuth, userAuth} = require("./src/middlewares/auth")
const {connectDB} = require("./src/config/database");
const { UserModel } = require("./src/models/user");
const {AppError} = require("./src/utils/AppError");
const {validateSignupData, validateLoginData} = require("./src/utils/validation");
const bcrypt = require("bcrypt");

const app = express();

//To connect single db only
connectDB()

//To connect multiple dbs
// Promise.all([mainDB.asPromise(), adminDB.asPromise()])

.then(()=>{
    console.log("Database connection established.")
    // Ye line add karni hai routes se upar!
    // Ye Postman se aane wale JSON data ko read karke req.body mein daal deti hai
    // Raw JSON ko parse karega
    app.use(express.json()); 

    // x-www-form-urlencoded ko parse karega
    app.use(express.urlencoded({ extended: true }));


    // SignUp API
    app.post("/signup",async(req,res,next)=>{
        try{
            // Validation of Data
            await validateSignupData(req);
            // console.log("hi")

            const { firstName, lastName, emailId, password, age,
                    gender, photoUrl, about, skills } = req.body;
            
            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10);

            // Agar upar ki saari conditions paas ho gayi, matlab data ekdum sahi hai
            // Ab hum user ko save karenge
            const user = new UserModel({
                firstName, 
                lastName, 
                emailId, 
                password : passwordHash, 
                gender,
                age,
                photoUrl,
                about,
                skills
            })
            await user.save(); // save in database collection
            
            // console.log("saved the data");
            // const userDocument = await UserModel.findOne({emailId: req.body.emailId}); //returns document/json object
            // const userId = userDocument._id.toString(); //need to convert _id into string using .toString();
            // console.log(userId);
            // 201 status ka matlab hota hai "Created Successfully"
            res.status(201).send({
                message: "User signed up successfully",
                success: true
                // data: { ...req.body, userId }
            });
        } catch(error){
            // res.status(400).send("Error saving the user: ", error);
            
            // Agar upar wale throw chalenge, ya database crash hoga, 
            // toh wo sab yahan aayenge aur Global Handler ke paas chale jayenge
            next(error);
        }
    })

    // Feed API - Get /feed - get all users from the database
    app.get("/feed", async(req,res,next)=>{
        try{
            const users = await UserModel.find({})
            if(users.length === 0){
                throw new AppError("No users found",404);
            }

            // we can add multiple business logics like
            // logged in user cannot see his/her user details in the feed
            // also use pagination/scroll feature in the api
            // in case of more than 100 records/documents in the db
            res.send(users);
        } catch (error) {
            next(error);
        }
    })
    
    app.use("/admin", adminAuth);

    app.get("/admin/getAllAdmins",(req,res)=>{
        console.log("getAllAdmins function called");
        res.send("list of all the admins")
    });

    app.delete("/admin/deleteAdmin",(req,res)=>{
        console.log("deleteAdmin function called");
        res.send("deleted the admin successfully")
    });


    app.post("/user/login", async (req,res,next)=>{
        try{
            // console.log("user login api called");
            // throw new Error("DB Server Down")

            const user = await validateLoginData(req);
            // console.log("user in api", user);

            // compare hashPassword with plainPassword
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
            // console.log("isPasswordMatch", isPasswordMatch)

            if(isPasswordMatch){
                const userData = user.toObject();
                delete userData.password;
                // console.log("after delete", userData)
                res.send({
                    message: "user logged in successfully",
                    token: "userBearerToken",
                    success: true,
                    data: userData
                })
            }else{
                throw new AppError("Invalid Credentials!!", 400)
            }
        } catch(error){
            next(error);
        }
        
    })

    app.use("/user", userAuth);

    // Get user by email
    app.get("/user", async(req,res,next)=>{
        try{
            const user = await UserModel.findOne({emailId: req.query.emailId})
            if(!user){
                throw new AppError("User not found",404);
            }

            // we can add multiple business logics like
            // logged in user cannot see his/her user details in the feed
            res.send(user);
        } catch (error) {
            next(error);
        }
    });

    // Delete User API
    app.delete("/user", async(req,res,next)=>{
        const userId = req.body.userId;
        try{
            const user = await UserModel.findByIdAndDelete(userId);
            if(!user) throw new AppError("Enter valid userId",400)
            
            res.send("User deleted successfully");
        } catch (error){
            next(error);
        }
    });

    // PUT (Total Replacement) vs PATCH (Partial Update)
    // Patch User API - update data of the user
    app.patch("/user", async(req,res,next)=>{
        const userId = req.query?.userId;
        const emailId = req.query?.emailId;
        const data = req.body;
        if(data.password || data.firstName || data.lastName || data.emailId){
            // delete data.password || data['password']
            // console.log('deleted password')
            throw new AppError("Update not allowed!",400)
        }
        try{
            if(userId){
                // const user = await UserModel.findByIdAndUpdate({_id: userId}, data);
                const user = await UserModel.findByIdAndUpdate(userId, data, {runValidators:true, returnDocument:'after'});
                if(!user) throw new AppError("Enter valid userId",400);
                
                res.send("User updated successfully via userId");
            } else if (!userId && emailId) {
                const user = await UserModel.findOneAndUpdate({emailId: emailId}, data, {runValidators:true, returnDocument:'after'});
                if(!user) throw new AppError("Enter valid emailId",400);
                
                res.send("User updated successfully via email");
            } else {
                throw new AppError("Enter either userId or emailId to update the user.", 400);
            }
        } catch (error){
            next(error);
        }
    });

    app.get("/user/profile", (req,res)=>{
        console.log("user profile api called")
        res.send("fetch user profile data")
    });

    app.get("/user/settings", (req,res)=>{
        console.log("user settings api called")
        res.send("fetch user settings")
    });

    app.delete("/user/delete", (req,res)=>{
        console.log("user delete api called")
        res.send("deleted the user successfully")
    });


    //Global Error Handler
    app.use((err,req,res,next)=>{
        // if(err){
        //     res.status(500).send("Something Went Wrong");
        // }

        // 1. Agar ye Mongoose ka Validation Error hai
        if (err.name === "ValidationError") {
            err.statusCode = 400; // Hum khud yahan 400 set kar denge
            
            // Bonus: Mongoose ke lambe message ("user validation failed...") ko clean karna
            const messages = Object.values(err.errors).map(val => val.message);
            err.message = messages.join(", "); 
        }

        // // 2. Agar ye duplicate key (email already exists) ka error hai
        // if (err.code === 11000) {
        //     err.statusCode = 400;
        //     err.message = "This email is already registered!";
        // }

        // err.statusCode and err.message from coming from the AppError.js
        // console.log("custom errorStatusCode", err.statusCode);
        // console.log("custom errorMessage", err.message);
        const statusCode = err.statusCode || 500;
        const errorMessage = err.message || "Internal Server Error";

        res.status(statusCode).send({
            message: errorMessage,
            success: false
        })
    });

    app.listen(7777,()=>{
        console.log("Server running on port:7777");
    });
}).catch((err)=>{
    console.error("Database cannot be connected!!")
})

