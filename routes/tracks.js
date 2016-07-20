var
  express = require('express'),
  passport = require('passport'),
  request = require('request'),
  trackRouter = express.Router()


trackRouter.get('/search', function(req, res){
  console.log(req.query);
  console.log(req.query.data);
  var apiUrl = 'http://api.soundcloud.com/tracks/?client_id=30d69e786e7919bdcb3a72f8ba55862d&limit=50&q=' + req.query.data
  request(apiUrl, function(err, response){
    if (err) return console.log(err)
    // console.log(Object.keys(response.body));
    var tracks = JSON.parse(response.body)
    // console.log(tracks);
    res.json(tracks)
  })
})


module.exports = trackRouter
