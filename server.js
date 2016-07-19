var
	express = require('express'),
	app = express(),
	ejs = require('ejs'),
	ejsLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	passport = require('passport'),
	passportConfig = require('./config/passport.js'),
	userRoutes = require('./routes/users.js'),
	trackRoutes = require('./routes/tracks.js'),
	dotenv = require('dotenv').load({silent: true}),
	request = require('request')

// widget1 === widget2
	// AWS = require('aws-sdk'),
	// awsKey = process.env.AWS_ACCESS_KEY_ID,
	// awsSkey = process.env.AWS_SECRET_ACCESS_KEY,
	// awsBucket = process.env.AWS_BUCKET,
	// awsRegion = process.env.AWS_REGION,
	// multer = require('multer')




mongoose.connect('mongodb://localhost/playlistr', function(){
	console.log('Connected to MongoDB playlistr')
})

// application-wide middleware:
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
// environment port
var port = process.env.PORT || 3000

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// session + passport
app.use(session({
	cookie: {maxAge: 60000000},
	secret: "boomchakalaka",
	resave: true,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
	app.locals.currentUser = req.user || null
	app.locals.loggedIn = !!req.user
	next()
})



//root route
app.get('/', function(req,res){
	res.render('index')
})



app.use('/', userRoutes)
app.use('/', trackRoutes)

app.listen(port, function(){
	console.log("Server running on port", port)
})
