var path = require('path'),
	http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	app = express(),
	server = app.listen(3000, function(){ console.log('listen on *:3000'); });
	io = require('socket.io')(server);
	
app.set('views', path.join(__dirname, 'views'));
app.set('view engine' ,'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));

var users = {};

app.get('/', function(req, res){
	if(req.cookies.user == null){
		res.redirect('/signin');
	} else {
		res.render('chat.ejs');
	}
});

app.get('/signin', function(req, res){
	res.render('login.ejs');
});

app.post('/formLogin', function(req, res){
	if (users[req.body.name]) {
		//���ڣ������S����
		res.redirect('/signin');
	} else {
		//�����ڣ������Ñ� cookie �K���D���
		res.cookie("user", req.body.name, {maxAge: 1000*60});
		res.redirect('/');
	}
});

app.post('/formLogout' , function(req, res){
	res.render('login.ejs');
});


io.sockets.on('connection', function (socket) {
	// server notice that somebody does login with all
	socket.on('online', function (data) {
		socket.name = data.user;
		if(!users[data.user]){
			users[data.user] = data.user;
		}
  		io.sockets.emit('online', {users: users, user: data.user});
  	});

  	// server notice that somebody does loginout with all
  	socket.on('disconnect', function() {
  		//�� users �����б����˸��û���
  		if (users[socket.name]) {
    		//�� users ������ɾ�����û���
   			delete users[socket.name];
    		//�����������û��㲥���û�������Ϣ
    		socket.broadcast.emit('offline', {users: users, user: socket.name});
  		}
	});
	
});
