const express = require('express')
const dotenv = require("dotenv").config()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const userRoute = require('./routes/userRoute')
const app = express()
// Middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))
app.use(bodyParser.json())
// routes Middleware
app.use('/api/users', userRoute)
// Routes
app.get('/',(req,res)=>{
    res.send("home Page")
})

const PORT = process.env.PORT || 5000;

// connect t mongoDb
mongoose
       .connect(process.env.MONGO_URI)
       .then(()=>{
        app.listen(PORT, ()=>{
            console.log(`server running on port ${PORT}`)
        })
       })
       .catch((err)=>{
         console.log(err)
       })
mongoose.set('strictQuery', true)