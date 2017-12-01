var WebSocketServer = require("websocket").server;
var http = require("http");
var port = 1111;

var httpServer = http.createServer();
httpServer.listen(port);

console.log("Server running at port " + port);

function Player(uuid, color)
{
	this.uuid = uuid;
	this.color = color;
	this.position = null;
	this.rotation = null;
}

function Bullet(uuid)
{
	this.uuid = uuid;
	this.position = null;
	this.velocity = null;
}

function getPlayer(uuid)
{
	for(var i = 0; i < players.length; i++)
	{
		if(players[i].uuid === uuid)
		{
			return players[i];
		}
	}

	return null;
}

function removePlayer(uuid)
{
	for(var i = 0; i < players.length; i++)
	{
		if(players[i].uuid === uuid)
		{
			players.splice(i, 1);
			break;
		}
	}
}

var players = [];

var server = new WebSocketServer({httpServer: httpServer});

server.on("request", function(request)
{
	var connection = request.accept(null, request.origin);

	connection.on("message", function(message)
	{
		var data = JSON.parse(message.utf8Data);
	
		if(data.type === "connected")
		{
			players.push(new Player(data.uuid, data.color));

			console.log("Player " + data.uuid + " connected");
		}
		else if(data.type === "bullet")
		{

		}
		else if(data.type === "update")
		{
			var player = getPlayer(data.uuid);
			player.position = data.position;
			player.rotation = data.rotation;

			connection.sendUTF(JSON.stringify(
			{
				type: "players",
				players: players
			}));
		}
		else if(data.type === "disconnect")
		{
			removePlayer(data.uuid);
			console.log("Player " + data.uuid + " disconnected");
		}
		else
		{
			console.log("Unknown message received", data);
		}
	});
});