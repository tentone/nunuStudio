var WebSocketServer = require("websocket").server;
var http = require("http");
var port = 1111;
var server = http.createServer();
server.listen(port);

console.log("Server running at port " + port);

function Vector3(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.set = function(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
};

function Player(uuid, color)
{
	this.uuid = uuid;
	this.color = color;
	this.bullet = new Bullet(uuid);
	this.position = new Vector3(0, 0, 0);
}

function Bullet(uuid)
{
	this.uuid = uuid;
	this.active = false;
	this.position = new Vector3(0, 0, 0);
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
var wsServer = new WebSocketServer({httpServer: server});

wsServer.on("request", function(request)
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
		else if(data.type === "position")
		{
			getPlayer(data.uuid).position.set(data.position.x, data.position.y, data.position.z);

			console.log("Player " + data.uuid + " position updated", data.position);
		}
		else if(data.type === "tick")
		{
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