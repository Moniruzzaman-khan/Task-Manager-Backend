// Basic Libraries
const express = require('express');
const router = require('./src/routes/api');
const app = new express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')


dotenv.config()

// Body Parser Implement
app.use(bodyParser.json())

// Security Middleware Lib Import
const rateLimit =require('express-rate-limit');
const helmet =require('helmet');
const mongoSanitize =require('express-mongo-sanitize');
const xss =require('xss-clean');
const hpp =require('hpp');
const cors =require('cors');

// Security Middleware Implement
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


// Request Rate Limit
const limiter= rateLimit({windowMs:15*60*1000,max:3000})
app.use(limiter)



// Database Lib Import
const mongoose =require('mongoose');

// Mongo DB Database Connection
const port = process.env.PORT || 8000
mongoose.connect(process.env.DB_URI).then(()=>{
    console.log(`DB Connected in ${mongoose.connection.host}`);
}).catch((err)=>console.log(err)).finally(()=>{
    app.listen(port,()=>console.log(`server running in ${port}`))
})


// Routing Implement
app.use("/api/v1",router)

// Undefined Route Implement
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"Not Found"})
})