const mongoose = require('mongoose')
const {Schema} = mongoose 

const ReviewSchema = Schema({
  body: String,
  rating: Number,
})

module.exports = mongoose.model("Review", ReviewSchema)