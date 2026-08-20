// console.log("Hello, World!");

const express = require("express");
const {adminAuth, userAuth} = require("./src/middlewares/auth")
const {connectDB} = require("./src/config/database");

const app = express();

connectDB().then(()=>{
    console.log("Database connection established.")
    
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
        if(err){
            res.status(500).send("Something Went Wrong");
        }
    });

    app.listen(7777,()=>{
        console.log("Server running on port:7777");
    });
}).catch((err)=>{
    console.error("Database cannot be connected!!")
})

