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
	request = require('request'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	moment = require('moment')

//
// mongoose.connect(process.env.MONGO_URL, function(err){
// 	if (err) return console.log(err)
// 	console.log('Connected to MongoDB online radio')
// })
mongoose.connect('mongodb://localhost/online-radio-app', function(){
	console.log('Connected to MongoDB RADIO')
})
// var nsp = io.of('/main');
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
	// io.on('connection', function(socket){
	//   socket.join('some room');
	// });
	// io.to('some room').emit('some event'):
	socket.on('send-chat', function(msg){
		console.log(msg);
    io.emit('r-chat', msg)
  })

	socket.on('create-room', function(room) {
		console.log("Socket trying to join room: ", room)
		socket.join(room)
		console.log(socket);
		io.emit('room-homepage', room)
		io.sockets.in(room).emit('room-created', 'What uuup, in the building!', socket.id)
	})

	socket.on('join-room', function(room) {
		socket.join(room)
		// console.log(socket)
		io.sockets.in(room).emit('room-joined', 'WELCOME TO THE ROOM BRO', socket.id)

	})
	socket.on('playsong', function(msg, room){
		console.log(room);
		console.log(msg);
		io.sockets.in(room).emit('song-playing', msg, socket.id)
	})
})
// socket.on('station-name', function(msg, room){
// 	console.log(room);
// 	console.log(msg);
// 	io.sockets.in(room).emit('song-playing', msg, socket.id)
// })


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
	cookie: {maxTime: 60000000},
	secret: "boomchakalaka",
	resave: true,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
	app.locals.currentUser = req.user || null
	app.locals.isLoggedIn = !!req.user
	// !!req.user
	next()
})



//root route
app.get('/', function(req,res){
	res.render('index')
})



app.use('/', userRoutes)
app.use('/', trackRoutes)

http.listen(port, function(){
	console.log("Server running on port", port)
})
