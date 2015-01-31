var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/chatroom.html', function (req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});


io.on('connection', function (socket) { //連線成功時
	socket.on('msg', function (msg) { //掛載msg事件-->代表有人說話
		
		console.log('msg:');
		console.log(msg);
		
//		if (data.to == 'all') { //給所有人
//			socket.broadcast.emit('say', data);
//		} else { //指定某群人
//			var clients = io.sockets.clients(); //client名單
//			var nameList = data.to.splice(','); //取得要送給誰的名單
//			//逐一檢查是否對該client訊息
//			clients.forEach(function (client) {
//				for (var i = nameList.length - 1; i >= 0; i--) { //逐一檢查
//					if (client.name == nameList[i]) {
//						client.emit('say', data); //發訊息給他
//					}
//				}
//			});
//		}
	});
});


http.listen(3000, function () {
	console.log('listening on *:3000');
});