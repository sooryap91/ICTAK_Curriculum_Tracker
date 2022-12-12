const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FacultySchema = new Schema({
    name: {
       type: String,
    //    required: true
   },
   email: {
       type: String,
    //    required: true
   },
   password: {
    type: String,
    // required: true
   },
     place:{
      type:String,

   },
          phonenumber:    {
            type:Number,

   }
   
})


let userDATA = mongoose.model('user', FacultySchema)

module.exports = userDATA
