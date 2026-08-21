// console.log("Hello, World!");

const express = require("express");
const {adminAuth, userAuth} = require("./src/middlewares/auth")
const {connectDB} = require("./src/config/database");
const { UserModel } = require("./src/models/user");
const {AppError} = require("./src/utils/AppError");
const req = require("express/lib/request");

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
            const { firstName, lastName, emailId, password, age } = req.body;
            
            // CASE 1: Basic Validation Error
            if (!firstName || !emailId || !password || !age) {
                // const err = new Error("Please provide all required fields");
                // err.statusCode = 400;
                // throw err;

                throw new AppError("Please provide all required fields", 400);
            }

            // CASE 2: Business Logic Error (Password length)
            if (password.length < 8) {
                throw new AppError("Password must be at least 8 characters long", 400);
            }

            // CASE 3: Duplicacy Check (Kya email pehle se database mein hai?)
            const existingUser = await UserModel.findOne({ emailId: emailId });
            if (existingUser) {
                throw new AppError("This email is already registered. Please signup via different email.", 400);
            }

            // Agar upar ki saari conditions paas ho gayi, matlab data ekdum sahi hai
            // Ab hum user ko save karenge
            const user = new UserModel({
                firstName, lastName, emailId, password, age
            })
            await user.save(); // save in database collection

            const userDocument = await UserModel.findOne({emailId: emailId}); //returns document/json object
            const userId = userDocument._id.toString(); //need to convert _id into string using .toString();
            console.log(userId);
            // 201 status ka matlab hota hai "Created Successfully"
            res.status(201).send({
                message: "User signed up successfully",
                data: { firstName, lastName, emailId, age, userId }
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
            console.log("user login api called");
            throw new Error("DB Server Down")
            res.send({
                message: "user logged in successfully",
                token: "userBearerToken"
            })
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
        const userId = req.body.userId;
        const emailId = req.body.emailId;
        const data = req.body;
        try{
            if(userId){
                // const user = await UserModel.findByIdAndUpdate({_id: userId}, data);
                const user = await UserModel.findByIdAndUpdate(userId, data);
                if(!user) throw new AppError("Enter valid userId",400)
                
                res.send("User updated successfully");
            } else {
                const user = await UserModel.findOneAndUpdate({emailId: emailId}, data);
                if(!user) throw new AppError("Enter valid emailId",400)
                
                res.send("User updated successfully via email");
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

        // err.statusCode and err.message from coming from the AppError.js
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

