const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurriculumSchema = new Schema({
    
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

   
   fileuploadname: {
      type: String,

   },
   fileuploadpath: {
      type: String,

   },

   comments: {
      type: String,
   },
   status: {
      type: String,
      default: "notapproved"

   }

   
})


let curriculumdata = mongoose.model('curriculum', CurriculumSchema )

module.exports = curriculumdata
