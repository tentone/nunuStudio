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
include("editor/ui/ThreeView.js");

include("editor/tools/MoveTool.js");
include("editor/tools/ResizeTool.js");
include("editor/tools/RotateTool.js");

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
	Editor.tool_scene = new THREE.Scene();
	Editor.tool_scene_top = new THREE.Scene();

	Editor.cannon_renderer = new THREE.CannonDebugRenderer(Editor.tool_scene, Editor.scene.world);

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
	var light = new THREE.AmbientLight(0x888888);
	Editor.scene.scene.add(light);

	light = new THREE.PointLight(0xaaaaaa);
	light.position.set(0, 5, -5);
	Editor.scene.scene.add(light);

	//Grid and axis helpers
	Editor.grid_helper = new THREE.GridHelper(200, 5);
	Editor.tool_scene.add(Editor.grid_helper);
	
	Editor.axis_helper = new THREE.AxisHelper(100);
	Editor.tool_scene.add(Editor.axis_helper);

	//Box helpers
	Editor.box_helper = new THREE.BoxHelper();
	Editor.tool_scene.add(Editor.box_helper);

	//Tools
	Editor.move_tool = new MoveTool();
	Editor.move_tool.visible = false;
	Editor.tool_scene_top.add(Editor.move_tool);

	Editor.resize_tool = new ResizeTool();
	Editor.resize_tool.visible = false;
	Editor.tool_scene_top.add(Editor.resize_tool);

	Editor.rotate_tool = new RotateTool();
	Editor.rotate_tool.visible = false;
	Editor.tool_scene_top.add(Editor.rotate_tool);
}

//Update Editor
Editor.update = function()
{
	//Update editor interface
	Interface.update();

	//Editing a scene
	if(Editor.state == Editor.STATE_EDITING)
	{
		//If object select display tools
		if(Editor.selected_object != null)
		{
			Editor.box_helper.visible = true;
			Editor.box_helper.update(Editor.selected_object);

			if(Editor.tool_mode == Editor.MODE_MOVE)
			{
				Editor.move_tool.visible = true;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.visible = false;
				Editor.move_tool.position.copy(Editor.selected_object.position);
			}
			else if(Editor.tool_mode == Editor.MODE_RESIZE)
			{
				Editor.resize_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.position.copy(Editor.selected_object.position);
				
			}
			else if(Editor.tool_mode == Editor.MODE_ROTATE)
			{
				Editor.rotate_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.resize_tool.visible = false;
				Editor.rotate_tool.position.copy(Editor.selected_object.position);
			}
			else
			{
				Editor.move_tool.visible = false;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.visible = false;
			}
		}
		else
		{
			Editor.move_tool.visible = false;
			Editor.rotate_tool.visible = false;
			Editor.resize_tool.visible = false;
			Editor.box_helper.visible = false;
		}

		//Check if mouse inside canvas
		if(Mouse.insideCanvas())
		{
			//Select objects
			if(Editor.tool_mode === Editor.MODE_SELECT)
			{
				if(Mouse.buttonJustPressed(Mouse.LEFT))
				{
					Editor.updateRaycaster();
					var intersects =  Editor.raycaster.intersectObjects(Editor.scene.scene.children, true);
					if(intersects.length > 0)
					{
						Editor.selected_object = intersects[0].object;
					}
				}
			}
			//Move objects
			else if(Editor.tool_mode === Editor.MODE_MOVE)
			{
				Editor.updateRaycaster();
				Editor.move_tool.highlightSelectedComponents(Editor.raycaster);
			}
			//Resize
			else if(Editor.tool_mode === Editor.MODE_RESIZE)
			{
				Editor.updateRaycaster();
				Editor.resize_tool.highlightSelectedComponents(Editor.raycaster);
			}

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
			
			//Move in camera direction using mouse scroll
			if(Mouse.wheel != 0)
			{
				var direction = Editor.camera.getWorldDirection();
				var speed = 0.01 * Mouse.wheel;
				Editor.camera.position.x -= speed * direction.x;
				Editor.camera.position.y -= speed * direction.y;
				Editor.camera.position.z -= speed * direction.z;
			}
		}
	}
	//Update Scene if on test mode
	else if(Editor.state === Editor.STATE_TESTING)
	{
		Editor.scene.update();
	}
}

//Draw stuff into screen
Editor.draw = function()
{
	Editor.renderer.clear();

	//Render scene
	Editor.renderer.render(Editor.scene.scene, Editor.camera);

	//Render debug scene
	if(Editor.state == Editor.STATE_EDITING)
	{
		Editor.cannon_renderer.update();
		Editor.renderer.render(Editor.tool_scene, Editor.camera);

		Editor.renderer.clearDepth();
		Editor.renderer.render(Editor.tool_scene_top, Editor.camera);
	}
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

//Update editor raycaster
Editor.updateRaycaster = function()
{
	var mouse = new THREE.Vector2((Mouse.pos.x/Editor.canvas.width )*2 - 1, -(Mouse.pos.y/Editor.canvas.height)*2 + 1);
	Editor.raycaster.setFromCamera(mouse, Editor.camera);
}