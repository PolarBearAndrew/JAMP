var path = require('path'),
    http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    server = app.listen(3000, function() {
        console.log('listen on *:3000');
    }),
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

app.get('/', function(req, res) {
    if (req.cookies.user == null) {
        res.redirect('/signin');
    } else {
        res.render('chatroom');
    }
});

// 登入頁
app.get('/signin', function(req, res) {
    res.render('login');
});

// 登入
app.post('/formLogin', function(req, res) {
    if (users[req.body.myName]) {
        // 會員名稱重複則重新登入
        res.redirect('/signin'); //
    } else {
        // 登入成功將會員資料setToCookie
        var userObj = {
            myName: req.body.myName,
            password: req.body.password,
            pos: req.body.pos,
            pro: req.body.pro
        };
        res.cookie("user", JSON.stringify(userObj), {
            maxAge: 1000 * 60 * 30
        });
        res.redirect('/');
    }
});

// 登出
app.post('/formLogout', function(req, res) {
    res.clearCookie('user'); // 清除cookie
    res.redirect("/");
});

// 連線
io.sockets.on('connection', function(socket) {
    // server notice that somebody does login with all
    socket.on('online', function(data) {
        socket.myName = data.myName;
        if (!users[data.myName]) {
            users[data.myName] = data;
        };
        var tmp = users;
        console.log(tmp);
        io.sockets.emit('online', { user: data, users: tmp });
    });

    // server notice that somebody does loginout with all
    socket.on('disconnect', function() {

        if (users[socket.myName]) {

            delete users[socket.myName];

            socket.broadcast.emit('offline', {
                users: users,
                user: socket.myName
            });
        }
    });

    socket.on('msg', function(data) { //掛載msg事件-->代表有人說話
        // socket.broadcast.emit('say', data);
        // console.log(data);
        io.sockets.emit('say', data);
    });

});
