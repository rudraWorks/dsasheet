const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const users = require('./models/users')
const router = require('./routes/authRoutes')
const {checkUser} = require('./middlewares/userAuth')
const contentRouter = require('./routes/contentRoutes')

// const DB = 'mongodb+srv://srudra754:test123@cluster0.zey6y.mongodb.net/smartstudy?retryWrites=true&w=majority'
const DB = 'mongodb://localhost:27017/dsasheets'
mongoose.connect(DB,()=>{
    console.log('connected to db')
}) 
  
const app = express()

app.set('view engine','ejs')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended:true
}))
app.use(express.static(__dirname+"/public"))

app.use(checkUser)
app.use(router) 
app.use(contentRouter)

app.get('/',(req,res)=>{

    // if(!res.locals.isAuthenticated)
    // return res.send('please authorize yourself!')
    
    res.render('home')
})



const port = process.env.PORT || 3000
app.listen(port,()=>{ 
    console.log("listening to port "+port)
})