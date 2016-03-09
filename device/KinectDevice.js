function KinectDevice(){}

KinectDevice.DEPTH = 0;
KinectDevice.COLOR = 1;

KinectDevice.initialize = function()
{
	//Initialize a new web socket
	KinectDevice.socket = new WebSocket("ws://127.0.0.1:8181");    
	KinectDevice.connected = false;
	KinectDevice.skeletons = [];
	KinectDevice.camera_data = null;
	
	//Connection established
	KinectDevice.socket.onopen = function ()
	{
		KinectDevice.connected = true;
	};

	//Connection closed
	KinectDevice.socket.onclose = function ()
	{
		KinectDevice.connected = false;
	}

	//Receive data from the server
	KinectDevice.socket.onmessage = function (event)
	{
		if(typeof event.data === "string")
		{
			var jsonObject = JSON.parse(event.data);
			KinectDevice.skeletons = jsonObject.skeletons;
		}
		else if (event.data instanceof Blob)
		{
			var blob = event.data;
			//TOTO <CREATE THREEJS TEXTURE WITH DATA>
		}
	};
}

KinectDevice.isConnected = function()
{
	return KinectDevice.connected;
}

KinectDevice.update = function(frame){}

KinectDevice.setCameraMode = function(mode)
{
	if(mode === KinectDevice.COLOR)
	{
		socket.send("Color");
	}
	else if(mode === KinectDevice.COLOR)
	{
		socket.send("Depth");
	}
}
