var express = require('express')
var validUrl = require('valid-url')
var mongoose = require('mongoose')
var crypto = require('crypto')

var app = express()

var urlshortener = require('./models/urlShort')
var db = 'mongodb://localhost/urlShorts'

mongoose.connect(db,{
  useMongoClient: true,
})

//the * means everything after shorten is taken, otherwise the http:// will block
app.get('/shorten/:url(*)',(req,res) => {

  var urlOrig = req.params.url

  var re = new RegExp('^(http|https)://','i')

  //test method returns true if it finds a match in the string
  if(!re.test(urlOrig)){
    urlOrig = 'http://'+urlOrig
  }

  if (validUrl.isUri(urlOrig)){

    //create a random alpha-numeric string of length 6
    var urlEncode = crypto.randomBytes(3).toString('hex')

    var urlObj = new urlshortener({
      originalUrl : urlOrig,
      shortenedUrl : urlEncode
    })

    urlObj.save((err)=>{
      if(err) res.send('Database down')
    })

    res.json({
      originalUrl : urlOrig,
      shortenedUrl : 'http://localhost:3000/'+urlEncode
    })

  }else{
      res.send('Not a valid url')
  }

//query the database to find the http address of the shortened url
app.get('/:short',(req, res)=>{

  var short = req.params.short

  urlshortener.findOne({shortenedUrl : urlEncode},(err,doc)=>{
    if(err) res.send('Not a valid short url')

    res.redirect(doc.originalUrl)

  })
})
})

app.listen(3000, ()=>{
  console.log("serv's up");
})
