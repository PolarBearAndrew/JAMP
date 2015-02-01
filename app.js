var path = require('path'),
	http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	app = express(),
	server = app.listen(3000, function () {
		console.log('listen on *:3000');
	});
io = require('socket.io')(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));




var users = {};

app.get('/', function (req, res) {
	if (req.cookies.user == null) {
		res.redirect('/signin');
	} else {
		res.render('chat.ejs');
	}
});

app.get('/signin', function (req, res) {
	res.render('login.ejs');
});

app.post('/formLogin', function (req, res) {
	if (users[req.body.name]) {
		res.redirect('/signin'); //
	} else {
		//≤ª¥Ê‘⁄£¨É¶¥Ê”√ëÙ cookie ÅKÃ¯ﬁD÷˜Ìì
		res.cookie("user", req.body.name, {
			maxAge: 1000 * 60
		});


		users[req.body.name] = {
			name: req.body.name,
			password: req.body.password,
			pos: req.body.pos,
			pro: req.body.pro
		};

		res.sendFile(__dirname + '/chatroom.html');
	}
});

app.post('/formLogout', function (req, res) {
	res.render('login.ejs');
});


io.sockets.on('connection', function (socket) {
	// server notice that somebody does login with all
	socket.on('online', function (data) {

		//		socket.name = data.user;
		//		if (!users[data.user]) {
		//			users[data.user] = data.user;
		//		}

		//		console.log("user" + data.user + "\n----------");
		//console.log("users" + users + "\n----------");
		io.sockets.emit('online', {
			users: users,
			user: data.user
		});
	});

	// server notice that somebody does loginout with all
	socket.on('disconnect', function () {
		//»Ù users ∂‘œÛ÷–±£¥Ê¡À∏√”√ªß√˚
		if (users[socket.name]) {
			//¥” users ∂‘œÛ÷–…æ≥˝∏√”√ªß√˚
			delete users[socket.name];
			//œÚ∆‰À˚À˘”–”√ªßπ„≤•∏√”√ªßœ¬œﬂ–≈œ¢
			socket.broadcast.emit('offline', {
				users: users,
				user: socket.name
			});
		}
	});

	socket.on('msg', function (data) { //掛載msg事件-->代表有人說話
		socket.emit('say', data);
	});

});