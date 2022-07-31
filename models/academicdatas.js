let mongoose = require('mongoose') 


let schema = mongoose.Schema({
    email:{
        type:String,
        unique:true 
    },
    college:String,
    company:String,
    country:String,
    phone:String,
    portfolio:String,
    
})

module.exports = mongoose.model('academicdatas',schema)