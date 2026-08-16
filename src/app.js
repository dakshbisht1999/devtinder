// console.log("Hello, World!");

const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Welcome to the DevTinder BE")
})

app.use("/test",(res,req)=>{
    res.send("Welcome to the response of test api")
})

app.use("/home",(res,req)=>{
    res.send("Welcome to the response of home api")
})

app.listen(7777,()=>{
    console.log("Server running on port:7777")
})