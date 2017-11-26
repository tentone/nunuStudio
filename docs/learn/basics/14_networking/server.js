var WebSocketServer = require("websocket").server;
var http = require("http");
var port = 1111;
var server = http.createServer();
server.listen(port);

console.log("Server running at port " + port);

var players = [];

var wsServer = new WebSocketServer({httpServer: server});

wsServer.on("request", function(request)
{
	var connection = request.accept(null, request.origin);

	connection.on("message", function(message)
	{
		var data = JSON.parse(message.utf8Data);
	
		if(data.type === "connected")
		{
			players[data.uuid] = 
			{
				color: data.color,
				position:{x:0, y:0, z:0}
			};

			console.log("Player " + data.uuid + " connected");
		}
		else if(data.type === "position")
		{
			var position = players[data.uuid].position;
			position.x = data.position.x;
			position.y = data.position.y;
			position.z = data.position.z;

			console.log("Player " + data.uuid + " position updated", data.position);
		}
		else
		{
			console.log("Unknown message received", data);
		}
	});
});