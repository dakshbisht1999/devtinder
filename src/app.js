// console.log("Hello, World!");

const express = require("express");

const app = express();

app.use("/test",(req,res)=>{
    res.send("Welcome to the response of test api");
});

app.use("/home",(req,res)=>{
    res.send("Welcome to the response of home api");
});


app.get("/user",(req, res)=>{

    // To read the queryParams in the api like /user?role=admin&isActivated=true
    console.log(req.query)

    res.send({
        firstName: "Dishant",
        lastName: "Bisht"
    });
});

app.post("/user",(req,res)=>{
    //saving data to DB
    res.send("User created successfully");
});

app.delete("/user",(req,res)=>{
    res.send("Deleted the user successfully");
});

app.get("/user/:userId/:name/:password",(req,res)=>{
    res.send({
        message:"Fetched User Data and read url params",
        urlParams: req.params
    })
});



// // abc, ac - means b is optional
// app.get("/ab?c",(req,res)=>{
//     res.send("Success");
// });

// // def, deeeef - means only multiple "e" allowed in between e+f will work
// app.get("/de+f",(req,res)=>{
//     res.send("Success");
// });

// // ghi, ghkaoi - means anything in between h*i will work
// app.get("/gh*i",(req,res)=>{
//     res.send("Success");
// });

// // wxyz, wz - means xy is optional
// app.get("/w(xy)?z",(req,res)=>{
//     res.send("Success");
// });


// =================
// Express 5 doesn't support ? + * as pattern operators
// Express 5 only support Regular Expressions now (regex)
// So, below is the revised code from Express 4 to 5 using codex.

// abc, ac - means b is optional
app.get("/a{b}c",(req,res)=>{
    res.send("Success");
});

// /def, /deef, /deeeef, ...
app.get(/^\/de+f$/, (req, res) => {
  res.send("Success");
});

// /ghi, /ghkaoi, /ghanythingi, ...
app.get(/^\/gh.*i$/, (req, res) => {
  res.send("Success");
});

// /wz and /wxyz
app.get("/w{xy}z", (req, res) => {
  res.send("Success");
});

// any word containing 'm' will work
app.get(/m/,(req,res)=>{
    res.send("Success");
});

// word should end with 'fly' will work
app.get(/.*fly$/,(req,res)=>{
    res.send("Success");
});


// app.use("/",(req,res)=>{
//     res.send("Welcome to the DevTinder BE");
// });


app.listen(7777,()=>{
    console.log("Server running on port:7777");
});