// console.log("Hello, World!");

const express = require("express");

const app = express();

app.use("/user",
    (req,res, next)=>{
        console.log("Handling route 1");
        next();
        // res.send("Res1");
    },
    (req,res, next)=>{
        console.log("Handling route 2");
        next();
        // res.send("Res2");
    },
    (req,res, next)=>{
        console.log("Handling route 3");
        next();
        // res.send("Res3");
    },
    (req,res)=>{
        console.log("Handling route 4");
        // res.send("Res4");
    }
);


app.listen(7777,()=>{
    console.log("Server running on port:7777");
});