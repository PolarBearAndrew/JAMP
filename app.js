<<<<<<< HEAD
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function () {
	console.log('listening on *:3000');
});
=======
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = {};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));

app.get('/login', function(req, res){
	res.sendfile('login.html');
});

//登入表單資訊
app.post('/formLogin', function(req, res){
    console.log(req.body);
	if (users[req.body.name]) {
	//存在，不允許登入
	res.redirect('/signin');
	} else {
	//不存在，儲存用戶 cookie 並跳轉主頁
	res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
	res.redirect('/');
	}
});

//用戶登入
io.sockets.on('connection', function(socket){
	
	//用戶上線，確認名稱是否重複，沒有則廣播
	sockets.on('online', function(data){
		
		//方便刪除使用
		socket.name = data.name;
		
		//比對是否有重複名稱，沒有則註冊為新用戶
		if(!users[data.name])
		{
			user[name] = {
				name: data.name,
				password: data.password,
				pos: data.pos,
				pro: data.pro
			};
		}
		//向全員廣播
		io.sockets.emit('online', {users: users, user: data.name});
	});
	
	socket.on('disconnect', function() {
		//若 users 对象中保存了该用户名
		if (users[socket.name]) {
		//从 users 对象中删除该用户名
		delete users[socket.name];
		//向其他所有用户广播该用户下线信息
		socket.broadcast.emit('offline', {users: users, user: socket.name});
		}
	});
	
});

app.listen(3000); // Port
>>>>>>> 30de924aea8986b19173468ecfb1ba825425472f
