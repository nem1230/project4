var
  express = require('express'),
  passport = require('passport'),
  User = require('../models/User.js')
  userRouter = express.Router()

userRouter.route('/login')
  .get(function(req, res){
    res.render('login', {flash: req.flash('loginMessage')})
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

userRouter.route('/signup')
  .get(function(req, res){
    res.render('signup', {flash: req.flash('signupMessage')})
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
  }))

userRouter.get('/profile', isLoggedIn, function(req,res) {
  res.render('profile', {user: req.user})
})

userRouter.get('/logout', function(req, res) {
  // destroy the session, and redirect the user back to the home page...
  req.logout()
  res.redirect('/')
})


userRouter.get('/user/:id', function (req, res){
  res.render('show.ejs', {roomToJoin: req.params.id})
})

userRouter.post('/add/:id', function (req, res){
  console.log('userId', req.params.id);
  console.log(req.body.data);
  User.findById(req.params.id, function(err, user){
    user.local.tracks.push({title: req.body.data.trackTitle, sc_id: req.body.data.trackId, url: req.body.data.trackUrl})
    user.save()
    res.json(user)
  })
})

userRouter.get('/track/:id', function (req, res){
  // console.log(req.params.id);
  User.findById(req.params.id, function(err, user){
    // console.log(user.local.tracks.id(req.query.track));
    var delTrack = user.local.tracks.indexOf(user.local.tracks.id(req.query.track))
    user.local.tracks.splice(delTrack, 1)
    console.log(user.local.tracks);
      user.save(function(err, user) {
        res.json(user)
      })
    })
  })


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
