function KinectDevice(){}

KinectDevice.DEPTH = 0;
KinectDevice.COLOR = 1;

KinectDevice.JOINTS_NAME = [["head","shouldercenter"],["shouldercenter","shoulderright"],["shouldercenter","shoulderleft"],["shoulderright","elbowright"],
							["shoulderleft","elbowleft"],["elbowright","wristright"],["elbowleft","wristleft"],["wristright","handright"],["wristleft","handleft"],
							["shouldercenter","spine"],["spine","hipcenter"],["hipcenter","hipright"],["hipcenter","hipleft"],["hipright","kneeright"],
							["hipleft","kneeleft"],["kneeright","ankleright"],["kneeleft","ankleleft"],["ankleright","footright"],["ankleleft","footleft"]];


KinectDevice.initialize = function()
{
	//Initialize a new web socket
	KinectDevice.socket = new WebSocket("ws://127.0.0.1:8181");
	KinectDevice.connected = false;

	//Kinect Skeleton
	KinectDevice.skeletons = [];

	//Received Data
	KinectDevice.data = [];
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
			KinectDevice.data = jsonObject.skeletons;

			KinectDevice.updateSkeletons();
		}
		else if(event.data instanceof Blob)
		{
			var blob = event.data;
			//TOTO <STORE CAMERA FEED>
		}
	};

	KinectDevice.debug_scene = new THREE.Scene();
	var point = new THREE.Vector3(0,0,0);
	for(var i = 0; i < 19; i++)
	{
		KinectDevice.debug_scene.add(KinectDevice.createCylinderBetweenPoints(point, point));
	}
}

KinectDevice.isConnected = function()
{
	return KinectDevice.connected;
}

KinectDevice.updateSkeletons = function()
{
	for(var k = 0; k < KinectDevice.data.length; k++)
	{

		if(KinectDevice.skeletons[k] === undefined)
		{
			KinectDevice.skeletons[k] = new Skeleton();
			KinectDevice.skeletons[k].createJoints(KinectDevice.JOINTS_NAME);
		}

		KinectDevice.skeletons[k].updateJoints(KinectDevice.data[k].joints);
	}
}

//Update Debug skeleton
KinectDevice.updateDebugSkeleton = function(joints)
{
	/*hipcenter
	spine 
	shouldercenter 
	head 
	shoulderleft 
	elbowleft 
	wristleft 
	handleft 
	shoulderright
	elbowright 
	wristright 
	handright 
	hipleft 
	kneeleft 
	ankleleft 
	footleft
	hipright 
	kneeright
	ankleright
	footright*/

	//KinectDevice.debug_scene[0] = KinectDevice.createCylinderBetweenPoints(

}

//Create a cylinder between points a and b
KinectDevice.createCylinderBetweenPoints = function(a, b)
{
	var dist = Math.sqrt(Math.pow((a.x - b.x),2) + Math.pow((a.y - b.y),2) + Math.pow((a.z - b.z),2));

	var geometry = new THREE.CylinderGeometry(0.1, 0.1, dist, 16, 32, false);
	var material = new THREE.MeshPhongMaterial({color: 0xff0000});
	var cylinder = new THREE.Mesh(geometry, material);
	cylinder.position.set(0, dist/2, 0)

	var obj = new THREE.Object3D();
	obj.position.set(a.x, a.y, a.z);
	obj.add(cylinder);
	obj.lookAt(b);

	return obj;
}

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
