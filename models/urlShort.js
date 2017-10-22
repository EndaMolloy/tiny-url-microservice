var mongoose = require('mongoose')
var schema = mongoose.Schema

var urlHandler = new schema({
  "originalUrl" : String,
  "shortenedUrl" : String
})

module.exports = mongoose.model('urlShort', urlHandler)
