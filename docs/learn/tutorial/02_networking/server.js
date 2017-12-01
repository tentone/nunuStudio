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

function Client(uuid, connection)
{
	this.uuid = uuid;
	this.connection = connection;
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

var players = [], clients = [];
var server = new WebSocketServer({httpServer: httpServer});

server.on("request", function(request)
{
	var connection = request.accept(null, request.origin);

	//Message
	connection.on("message", function(message)
	{
		var data = JSON.parse(message.utf8Data);
		
		//Connected
		if(data.type === "connected")
		{
			players.push(new Player(data.uuid, data.color));
			clients.push(new Client(data.uuid, connection));

			console.log("Player " + data.uuid + " connected");
		}
		//Bullet fired
		else if(data.type === "bullet")
		{
			for(var i = 0; i < clients.length; i++)
			{
				clients[i].connection.sendUTF(message.utf8Data);
			}

			console.log("Player " + data.uuid + " fired bullet!");
		}
		//Update
		else if(data.type === "update")
		{
			var player = getPlayer(data.uuid);

			if(player !== null)
			{
				player.position = data.position;
				player.rotation = data.rotation;
			}

			for(var i = 0; i < clients.length; i++)
			{
				clients[i].connection.sendUTF(message.utf8Data);
			}				
		}
		//Disconnected
		else if(data.type === "disconnect")
		{
			removePlayer(data.uuid);

			for(var i = 0; i < clients.length; i++)
			{
				clients[i].connection.sendUTF(message.utf8Data);
			}

			console.log("Player " + data.uuid + " disconnected");
		}
		else
		{
			console.log("Unknown message received", data);
		}
	});

	//Lost connection
	connection.on("close", function()
	{

		var uuid = null;

		for(var i = 0; i < clients.length; i++)
		{
			if(clients[i].connection === connection)
			{
				uuid = clients[i].uuid;
				clients.splice(i, 1);
				break;
			}
		}

		if(uuid !== null)
		{
			removePlayer(uuid);

			for(var i = 0; i < clients.length; i++)
			{
				clients[i].connection.sendUTF(JSON.stringify(
				{
					type: "disconnect",
					uuid: uuid
				}));
			}

			console.log("Player " + uuid + " lost connection!");
		}
	});
});