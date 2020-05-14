require('dotenv').config()
const express = require('express')
const app = express()
const mongoose= require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true})
mongoose.set('useCreateIndex', true);

const db= mongoose.connection;

db.on('error', (error)=>console.log(error))
db.once('open', ()=>console.log("connected to database"))
app.use(express.json())//a. express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
const userRouter=require('./routes/users')
const pageRouter= require('./routes/journalpages')

app.use('/users', userRouter)
app.use('/users',pageRouter)

app.listen(5000, ()=>{
    console.log("server has started")
})