var
  express = require('express'),
  passport = require('passport'),
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

userRouter.post('/add/:id', function (req, res){
  console.log('userId', req.params.id);
  console.log(req.body.data);
  // var newSong = req.body.data
  res.json({message: 'success'})
})


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
