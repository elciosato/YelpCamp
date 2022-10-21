const mongoose = require('mongoose')
const {Schema} = mongoose 

const reviewSchema = Schema({
  body: String,
  ratting: Number,
})

module.exports = mongoose.model("Review", reviewSchema)