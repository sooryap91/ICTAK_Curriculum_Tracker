const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RequirementSchema = new Schema({
    namereq: {
       type: String,
    //    required: true
   },
   institution: {
       type: String,
    //    required: true
   },
   category: {
    type: String,
    // required: true
   },
   area: {
    type: String,
    // required: true
   },
   hours: {
    type: Number,
    // required: true
   },
   fileupload:{
    type:String,
   //  required : true

   },
   status: {
      type: String,
      default: "notrespond"

   }
   
})


let userrequirement = mongoose.model('requirementform', RequirementSchema)

module.exports = userrequirement
