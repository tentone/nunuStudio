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

function Editor(){}

//Editor state
Editor.STATE_IDLE = 8; //Editing scripts
Editor.STATE_EDITING = 9; //Editing a scene
Editor.STATE_TESTING = 11; //Testing a scene

//Editor editing modes
Editor.MODE_SELECT = 0;
Editor.MODE_MOVE = 1;
Editor.MODE_RESIZE = 2;
Editor.MODE_ROTATE = 3;

//Initialize Main
Editor.initialize = function(canvas)
{
	//Editor initial state
	Editor.tool_mode = Editor.MODE_SELECT;
	Editor.state = Editor.STATE_EDITING;

	//Editor Selected object
	Editor.selected_object = null;

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

	//Editor Camera
	Editor.camera = new THREE.PerspectiveCamera(60, Editor.canvas.width/Editor.canvas.height, 0.1, 100000);
	Editor.camera.position.set(0, 5, -5);
	Editor.camera_rotation = new THREE.Vector2(0,0);
	Editor.setCameraRotation(Editor.camera_rotation, Editor.camera);

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

	//Light
	var light = new THREE.AmbientLight(0xffffff);
	Editor.scene.scene.add(light);

	//Grid and axis helpers
	Editor.grid_helper = new THREE.GridHelper(500, 20);
	Editor.debug_scene.add(Editor.grid_helper);
	Editor.axis_helper = new THREE.AxisHelper(500);
	Editor.debug_scene.add(Editor.axis_helper);

	//Box helpers
	Editor.box_helper = new THREE.BoxHelper();
	Editor.debug_scene.add(Editor.box_helper);
}

//Update Editor
Editor.update = function()
{
	//Update editor interface
	Interface.update();

	//Editing a scene
	if(Editor.state == Editor.STATE_EDITING)
	{
		//Check if object is selected
		if(Editor.selected_object != null)
		{
			Editor.box_helper.visible = true;
			Editor.box_helper.update(Editor.selected_object);
		}
		else
		{
			Editor.box_helper.visible = false;
		}

		//Check if mouse inside canvas
		if(Mouse.insideCanvas())
		{
			//Rotate camera
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

				Editor.setCameraRotation(Editor.camera_rotation, Editor.camera);
			}
			//Move Camera on X and Z
			else if(Mouse.buttonPressed(Mouse.RIGHT))
			{
				//Move Camera Front and Back
				var speed = 0.1;
				var angle_cos = Math.cos(Editor.camera_rotation.x);
				var angle_sin = Math.sin(Editor.camera_rotation.x);
				Editor.camera.position.z += Mouse.pos_diff.y * speed * angle_cos;
				Editor.camera.position.x += Mouse.pos_diff.y * speed * angle_sin;

				//Move Camera Lateral
				var angle_cos = Math.cos(Editor.camera_rotation.x + Math.PI/2.0);
				var angle_sin = Math.sin(Editor.camera_rotation.x + Math.PI/2.0);
				Editor.camera.position.z += Mouse.pos_diff.x * speed * angle_cos;
				Editor.camera.position.x += Mouse.pos_diff.x * speed * angle_sin;
			}
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

		//Select objects
		if(Editor.tool_mode == Editor.MODE_SELECT)
		{
			if(Mouse.buttonJustReleased(Mouse.LEFT))
			{
				var mouse = new THREE.Vector2((Mouse.pos.x/Editor.canvas.width )*2 - 1, -(Mouse.pos.y/Editor.canvas.height)*2 + 1);
				
				//Update the picking ray with the Editor.camera and mouse position	
				Editor.raycaster.setFromCamera(mouse, Editor.camera);	

				var intersects =  Editor.raycaster.intersectObjects(Editor.scene.scene.children, true);
				if(intersects.length > 0)
				{
					Editor.selected_object = intersects[0].object;
				}
			}
		}
		//Move objects
		else if(Editor.tool_mode == Editor.MODE_MOVE)
		{
			//TODO <ADD CODE HERE>
		}
		//Resize Objects
		else if(Editor.tool_mode == Editor.MODE_RESIZE)
		{
			//TODO <ADD CODE HERE>
		}
		//Rotate Objects
		else if(Editor.tool_mode == Editor.MODE_ROTATE)
		{
			//TODO <ADD CODE HERE>
		}
	}
	//Update Scene if on test mode
	else if(Editor.state == Editor.STATE_TESTING)
	{
		Editor.scene.update();
	}
}

//Draw stuff into screen
Editor.draw = function()
{
	//Render debug scene
	if(Editor.state == Editor.STATE_EDITING)
	{
		Editor.cannon_renderer.update();
		Editor.cannon_renderer.visible = false;
		Editor.renderer.render(Editor.debug_scene, Editor.camera);
	}

	//Render scene
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

//Set camera rotation
Editor.setCameraRotation = function(camera_rotation, camera)
{
	//Calculate direction vector
	var cos_angle_y = Math.cos(camera_rotation.y);
	var direction = new THREE.Vector3(Math.sin(camera_rotation.x)*cos_angle_y, Math.sin(camera_rotation.y), Math.cos(camera_rotation.x)*cos_angle_y);

	//Add position offset and set camera direction
	direction.x += camera.position.x;
	direction.y += camera.position.y;
	direction.z += camera.position.z;
	camera.lookAt(direction);
}