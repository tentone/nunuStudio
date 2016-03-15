include("editor/ui/Button.js");
include("editor/ui/DropdownMenu.js");
include("editor/ui/Text.js");
include("editor/ui/Division.js");
include("editor/ui/Image.js");
include("editor/ui/DivisionResizable.js");
include("editor/ui/ButtonImage.js");
include("editor/ui/ButtonDrawer.js");
include("editor/ui/Style.js");
include("editor/ui/TextBox.js");
include("editor/ui/Canvas.js");
include("editor/ui/TabContainer.js");
include("editor/ui/TabOption.js");
include("editor/ui/DualDivisionResizable.js");
include("editor/ui/ButtonImageToggle.js");

include("editor/Interface.js");

//Editor declaration
function Editor(){}

Editor.MODE_SELECT = 0;
Editor.MODE_MOVE = 1;
Editor.MODE_RESIZE = 2;
Editor.MODE_ROTATE = 3;

Editor.STATE_IDLE = 8;
Editor.STATE_EDITING = 9;
Editor.STATE_TESTING = 11;

Editor.tool_mode = Editor.MODE_SELECT;
Editor.state = Editor.STATE_EDITING;

Editor.selected_object = null;

//Initialize Main
Editor.initialize = function(canvas)
{
	//Initialize User Interface
	Interface.initialize();

	//Set mouse lock true
	App.setMouseLock(false);
	App.showStats(false);

	//Set render canvas
	Editor.canvas = Interface.canvas.element;
	Mouse.canvas = Editor.canvas;

	//Editor program and scene
	Editor.program = new Program();
	Editor.scene = new Scene();

	//Debug Elements
	Editor.debug_scene = new THREE.Scene();
	Editor.cannon_renderer = new THREE.CannonDebugRenderer(Editor.debug_scene, Editor.scene.world);

	Editor.camera = new THREE.PerspectiveCamera(75, Editor.canvas.width/Editor.canvas.height, 0.1, 100000);
	Editor.camera.position.set(0, 5, -5);
	Editor.camera_rotation = new THREE.Vector2(0,0);

	//Initialize Leap Hand
	//LeapDevice.initialize();
	//Editor.scene.scene.add(LeapDevice.scene);

	//Raycaster
	Editor.raycaster = new THREE.Raycaster();

	//Renderer
	Editor.renderer = new THREE.WebGLRenderer({canvas: Editor.canvas});
	Editor.renderer.autoClear = false;
	Editor.renderer.setSize(Editor.canvas.width, Editor.canvas.height);
	Editor.renderer.shadowMap.enabled = true;
	Editor.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//Update interface
	Interface.updateInterface();

	//Floor plane physics
	/*var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0});
	body.addShape(plane);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	Editor.scene.world.addBody(body);*/

	//Light
	var light = new THREE.AmbientLight(0xffffff);
	Editor.scene.scene.add(light);

	//Editor helpers
	Editor.grid_helper = new THREE.GridHelper(500, 20);
	Editor.debug_scene.add(Editor.grid_helper);

	Editor.axis_helper = new THREE.AxisHelper(500);
	Editor.debug_scene.add(Editor.axis_helper);
}

Editor.update = function()
{
	Interface.update();
	
	//Update Scene if on test mode
	if(Editor.state == Editor.STATE_TESTING)
	{
		Editor.scene.update();
	}

	//Rotate Camera
	if(Mouse.buttonPressed(Mouse.LEFT))
	{
		Editor.camera_rotation.x -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.x;
		Editor.camera_rotation.y -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.y;

		//Limit Vertical Rotation to 90 degrees
		var pid2 = 1.57;
		if(Editor.camera_rotation.y < -pid2)
		{
			Editor.camera_rotation.y = -pid2;
		}
		else if(Editor.camera_rotation.y > pid2)
		{
			Editor.camera_rotation.y = pid2;
		}

		//Calculate direction vector
		var cos_angle_y = Math.cos(Editor.camera_rotation.y);
		var direction = new THREE.Vector3(Math.sin(Editor.camera_rotation.x)*cos_angle_y, Math.sin(Editor.camera_rotation.y), Math.cos(Editor.camera_rotation.x)*cos_angle_y);

		//Add position offset and set Editor.camera direction
		direction.x += Editor.camera.position.x;
		direction.y += Editor.camera.position.y;
		direction.z += Editor.camera.position.z;
		Editor.camera.lookAt(direction);
	}


	/*
	//Move Camera Front and Back
	var speed_walk = 0.2;
	if(Keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.6;
	}
	var angle_cos = Math.cos(Editor.camera_rotation.x);
	var angle_sin = Math.sin(Editor.camera_rotation.x);
	if(Keyboard.isKeyPressed(Keyboard.S))
	{
		Editor.camera.position.z -= speed_walk * angle_cos;
		Editor.camera.position.x -= speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.W))
	{
		Editor.camera.position.z += speed_walk * angle_cos;
		Editor.camera.position.x += speed_walk * angle_sin;
	}

	//Hand Leap Follow Camera
	LeapDevice.scene.rotation.y = Math.PI + Editor.camera_rotation.x;
	LeapDevice.scene.position.set(Editor.camera.position.x, Editor.camera.position.y-2, Editor.camera.position.z);
	LeapDevice.scene.position.z += 2 * angle_cos;
	LeapDevice.scene.position.x += 2 * angle_sin;
	
	//Move Camera Lateral
	var angle_cos = Math.cos(Editor.camera_rotation.x + Math.PI/2.0);
	var angle_sin = Math.sin(Editor.camera_rotation.x + Math.PI/2.0);
	if(Keyboard.isKeyPressed(Keyboard.A))
	{
		Editor.camera.position.z += speed_walk * angle_cos;
		Editor.camera.position.x += speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.D))
	{
		Editor.camera.position.z -= speed_walk * angle_cos;
		Editor.camera.position.x -= speed_walk * angle_sin;
	}

	//Move Camera UP and DOWN
	if(Keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		Editor.camera.position.y += 0.1;
	}
	if(Keyboard.isKeyPressed(Keyboard.CTRL))
	{
		Editor.camera.position.y -= 0.1;
	}

	//Enable leap hand shadowing
	setShadowReceiving(LeapDevice.scene, true);
	setShadowCasting(LeapDevice.scene, true);
	*/

	//Select objects
	if(Editor.tool_mode == Editor.MODE_SELECT)
	{
		if(Mouse.buttonJustPressed(Mouse.LEFT))
		{
			var mouse = new THREE.Vector2((Mouse.pos.x/Editor.canvas.width )*2 - 1, -(Mouse.pos.y/Editor.canvas.height)*2 + 1);
			
			//Update the picking ray with the Editor.camera and mouse position	
			Editor.raycaster.setFromCamera(mouse, Editor.camera);	

			var intersects =  Editor.raycaster.intersectObjects(Editor.scene.scene.children, true);
			if(intersects.length > 0)
			{
				intersects[0].object.material = new THREE.MeshNormalMaterial();
			}
		}
	}

}

//Draw stuff into screen
Editor.draw = function()
{
	Editor.cannon_renderer.update();
	Editor.renderer.render(Editor.debug_scene, Editor.camera);
	Editor.renderer.render(Editor.scene.scene, Editor.camera);
}

//Resize to fit window
Editor.resize = function()
{
	Interface.updateInterface();
}

//Resize Camera
Editor.resizeCamera = function()
{
	Editor.renderer.setSize(Editor.canvas.width, Editor.canvas.height);
	Editor.camera.aspect = Editor.canvas.width/Editor.canvas.height;
	Editor.camera.updateProjectionMatrix();
}

//Add physics bounding box from objet to physics world
function addPhysicsBoundingBox(object, world)
{
	for(var j = 0; j < object.children.length; j++)
	{
		var box = new THREE.BoundingBoxHelper(object.children[j]);
		box.update();

		var hs = new THREE.Vector3(box.box.max.x - box.box.min.x, box.box.max.y - box.box.min.y, box.box.max.y - box.box.min.z);
		hs.x *= object.scale.x;
		hs.y *= object.scale.y;
		hs.z *= object.scale.z;
		hs.divideScalar(2);

		var pos = box.box.center();
		pos.x *= object.scale.x;
		pos.y *= object.scale.y;
		pos.z *= object.scale.z;
		pos.add(object.position);

		var shape = new CANNON.Box(new CANNON.Vec3(hs.x, hs.y, hs.z));
		var body = new CANNON.Body({mass:0});
		body.addShape(shape);
		body.quaternion.setFromEuler(0,Math.PI/2,0,"XYZ");
		body.position.set(pos.x, pos.y, pos.z);
		body.updateMassProperties();

		world.addBody(body);
	}
}

//Set shadow receiving
function setShadowReceiving(object, state)
{
	object.receiveShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowReceiving(object.children[i], state);
	}
}

//Enable shadow casting
function setShadowCasting(object, state)
{
	object.castShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowCasting(object.children[i], state);
	}
}
