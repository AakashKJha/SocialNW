const express = require("express");
const app  = express()
const mongoose = require("mongoose");
const PORT  = 5000
const {MONGOURI}= require("./valuesKeys.js")


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log("we are connected to server i.e MongoDB");
})
mongoose.connection.on('error',()=>{
    console.log("we are not connected to server i.e MongoDB");
})
require("./models/user")
require("./models/post")

app.use(express.json())
app.use(require('./routes/authen'))
app.use(require('./routes/post'))
const customMiddleWare = (req,res,next)=>{
    console.log("This is a middleware");
    next()
}
//L1HmfwnxH8Nnmruk =  password for DB

app.get('/',(req,res)=>{
    res.send("Hello World");
})
app.get('/home',customMiddleWare,(req,res)=>{
    res.send("Hello World from Home");
})
app.listen(PORT,()=>{
    console.log("Server Is running at",PORT)
})
