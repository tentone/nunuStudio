include("lib/codemirror/codemirror.js");
include("lib/codemirror/mode/javascript/javascript.js");
include("lib/codemirror/codemirror.css");
include("lib/codemirror/theme/monokai.css");

include("lib/jscolor.min.js");

include("editor/ui/Button.js");
include("editor/ui/DropdownMenu.js");
include("editor/ui/Text.js");
include("editor/ui/Division.js");
include("editor/ui/Image.js");
include("editor/ui/DivisionResizable.js");
include("editor/ui/ButtonImage.js");
include("editor/ui/ButtonDrawer.js");
include("editor/ui/Style.js");
include("editor/ui/Canvas.js");
include("editor/ui/TabGroup.js");
include("editor/ui/TabElement.js");
include("editor/ui/DualDivisionResizable.js");
include("editor/ui/ButtonImageToggle.js");
include("editor/ui/TreeView.js");
include("editor/ui/TreeElement.js");
include("editor/ui/ContextMenu.js");
include("editor/ui/Form.js");
include("editor/ui/DragBuffer.js");
include("editor/ui/FileExplorer.js");
include("editor/ui/File.js");

include("editor/ui/tab/CodeEditor.js");
include("editor/ui/tab/SceneEditor.js");
include("editor/ui/tab/SettingsTab.js");
include("editor/ui/tab/MaterialEditor.js");
include("editor/ui/tab/AboutTab.js");

include("editor/ui/input/Checkbox.js");
include("editor/ui/input/Textbox.js");
include("editor/ui/input/ColorChooser.js");
include("editor/ui/input/Slider.js");
include("editor/ui/input/DropdownList.js");
include("editor/ui/input/Numberbox.js");
include("editor/ui/input/Positionbox.js");
include("editor/ui/input/Imagebox.js");

include("editor/ui/panels/Panel.js");
include("editor/ui/panels/ObjectPanel.js");
include("editor/ui/panels/SkyPanel.js");
include("editor/ui/panels/LeapPanel.js");
include("editor/ui/panels/ScriptPanel.js");
include("editor/ui/panels/KinectPanel.js");
include("editor/ui/panels/ScenePanel.js");
include("editor/ui/panels/ProgramPanel.js");
include("editor/ui/panels/TextPanel.js");
include("editor/ui/panels/cameras/PerspectiveCameraPanel.js");
include("editor/ui/panels/cameras/OrthographicCameraPanel.js");
include("editor/ui/panels/lights/AmbientLightPanel.js");
include("editor/ui/panels/lights/PointLightPanel.js");
include("editor/ui/panels/lights/SpotLightPanel.js");

include("editor/tools/MoveTool.js");
include("editor/tools/ResizeTool.js");
include("editor/tools/RotateTool.js");

include("editor/Interface.js");

function Editor(){}

//Editor state
Editor.STATE_IDLE = 8; //Non scene window open
Editor.STATE_EDITING = 9; //Editing a scene
Editor.STATE_TESTING = 11; //Testing a scene

//Editor editing modes
Editor.MODE_SELECT = 0;
Editor.MODE_MOVE = 1;
Editor.MODE_RESIZE = 2;
Editor.MODE_ROTATE = 3;

//Editor version
Editor.NAME = "nunu Studio";
Editor.VERSION = "V0.7.0";
Editor.TIMESTAMP = "201605141405";

//Initialize Main
Editor.initialize = function(canvas)
{
	//Set windows close event
	if(App.gui !== undefined)
	{
		//Close event
		App.gui.Window.get().on("close", function()
		{
			if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		});
	}

	//Set window title
	document.title = Editor.NAME + " " + Editor.VERSION + " (" + Editor.TIMESTAMP + ")";

	//Set mouse lock false
	App.setMouseLock(false);

	//Show stats
	App.showStats(false);
	App.stats.domElement.style.left = "40px";
	App.stats.domElement.style.top = "55px";

	//Editor initial state
	Editor.tool_mode = Editor.MODE_SELECT;
	Editor.state = Editor.STATE_EDITING;
	
	//Auxiliar values
	Editor.pid2 = Math.PI/2;

	//Editor Selected object
	Editor.selected_object = null;
	Editor.block_camera_move = false;
	Editor.is_editing_object = false;
	Editor.editing_object_args = null;

	//Editor program and scene
	Editor.program = null;
	Editor.program_running = null;
	Editor.createNewProgram();

	//Renderer and canvas
	Editor.renderer = null;
	Editor.canvas = null;

	//Default material to be used when creating objects
	Editor.default_material = new THREE.MeshPhongMaterial({color:0xffffff, specular:0x333333, shininess:30});
	Editor.default_material.name = "default";
	Editor.default_sprite_material = new THREE.SpriteMaterial({map: new Texture("data/sample.png"), color: 0xffffff});
	Editor.default_sprite_material.name = "sprite";

	//Initialize User Interface
	Interface.initialize();

	//Debug Elements
	Editor.tool_scene = new THREE.Scene();
	Editor.tool_scene_top = new THREE.Scene();
	Editor.cannon_renderer = new THREE.CannonDebugRenderer(Editor.tool_scene, Editor.program.scene.world);

	//Raycaster
	Editor.raycaster = new THREE.Raycaster(); 

	//Editor Camera
	Editor.default_camera = new PerspectiveCamera(60, Editor.canvas.width/Editor.canvas.height, 0.1, 1000000);
	Editor.default_camera.position.set(0, 5, -5);
	Editor.camera = Editor.default_camera;
	Editor.camera_rotation = new THREE.Vector2(0,0);
	Editor.setCameraRotation(Editor.camera_rotation, Editor.camera);

	//Update interface
	Interface.updateInterface();

	//Grid and axis helpers
	Editor.grid_helper = new THREE.GridHelper(200, 5);
	Editor.tool_scene.add(Editor.grid_helper);
	Editor.axis_helper = new THREE.AxisHelper(100);
	Editor.tool_scene.add(Editor.axis_helper);

	//Box helper
	Editor.box_helper = new THREE.BoxHelper();
	Editor.box_helper.visible = false;
	Editor.tool_scene.add(Editor.box_helper);

	//Camera helper
	Editor.camera_helper = new THREE.CameraHelper(Editor.camera);
	Editor.activateHelper(Editor.camera_helper, false);
	Editor.tool_scene.add(Editor.camera_helper);

	//DirectionalLight Helper
	Editor.directional_light_helper = new THREE.DirectionalLightHelper(new THREE.DirectionalLight(), 1);
	Editor.activateHelper(Editor.directional_light_helper, false);
	Editor.tool_scene.add(Editor.directional_light_helper);

	//PointLight helper
	Editor.point_light_helper = new THREE.PointLightHelper(new THREE.PointLight(), 1);
	Editor.activateHelper(Editor.point_light_helper, false);
	Editor.tool_scene.add(Editor.point_light_helper);
	
	//SpotLight helper
	Editor.spot_light_helper = new THREE.SpotLightHelper(new THREE.SpotLight(), 1);
	Editor.activateHelper(Editor.spot_light_helper, false);
	Editor.tool_scene.add(Editor.spot_light_helper);

	//HemisphereLight helper
	Editor.hemisphere_light_helper = new THREE.HemisphereLightHelper(new THREE.HemisphereLight(), 1);
	Editor.activateHelper(Editor.hemisphere_light_helper, false);
	Editor.tool_scene.add(Editor.hemisphere_light_helper);

	//Move tool
	Editor.move_tool = new MoveTool();
	Editor.move_tool.visible = false;
	Editor.tool_scene_top.add(Editor.move_tool);

	//Resize tool
	Editor.resize_tool = new ResizeTool();
	Editor.resize_tool.visible = false;
	Editor.tool_scene_top.add(Editor.resize_tool);

	//Rotate tool
	Editor.rotate_tool = new RotateTool();
	Editor.rotate_tool.visible = false;
	Editor.tool_scene_top.add(Editor.rotate_tool);

	//Update interface explorer tree view
	Editor.updateObjectViews();
}

//Update Editor
Editor.update = function()
{
	//Update editor interface
	Interface.update();
	Editor.block_camera_move = false;

	//Editing a scene
	if(Editor.state === Editor.STATE_EDITING)
	{
		//Close tab, Save and load project
		if(Keyboard.isKeyPressed(Keyboard.CTRL))
		{
			if(Keyboard.isKeyJustPressed(Keyboard.S))
			{
				Interface.saveProgram();
			}
			else if(Keyboard.isKeyJustPressed(Keyboard.L))
			{
				Interface.loadProgram();
			}
			else if(Keyboard.isKeyJustPressed(Keyboard.W))
			{
				Interface.tab.closeActual();
			}
		}

		//If object select display tools
		if(Editor.selected_object !== null)
		{
			Editor.updateObjectHelper();

			if(Editor.tool_mode === Editor.MODE_MOVE)
			{
				Editor.move_tool.visible = true;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.visible = false;

				var position = ObjectUtils.objectAbsolutePosition(Editor.selected_object);
				var distance = Editor.camera.position.distanceTo(position)/5;
				Editor.move_tool.scale.set(distance, distance, distance);
				Editor.move_tool.position.copy(position);
			}
			else if(Editor.tool_mode === Editor.MODE_RESIZE)
			{
				Editor.resize_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.rotate_tool.visible = false;

				var position = ObjectUtils.objectAbsolutePosition(Editor.selected_object);
				var distance = Editor.camera.position.distanceTo(position)/5;
				Editor.resize_tool.scale.set(distance, distance, distance);
				Editor.resize_tool.rotation.copy(Editor.selected_object.rotation);
				Editor.resize_tool.position.copy(position);
			}
			else if(Editor.tool_mode === Editor.MODE_ROTATE)
			{
				Editor.rotate_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.resize_tool.visible = false;

				var position = ObjectUtils.objectAbsolutePosition(Editor.selected_object);
				var distance = Editor.camera.position.distanceTo(position)/5;
				Editor.rotate_tool.scale.set(distance, distance, distance);
				Editor.rotate_tool.position.copy(position);
			}
			else
			{
				Editor.move_tool.visible = false;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.visible = false;
			}

			//Delete Selected Object
			if(Keyboard.isKeyJustPressed(Keyboard.DEL))
			{
				Editor.deleteSelectedObject();
			}
			else if(Keyboard.isKeyPressed(Keyboard.CTRL))
			{
				if(Keyboard.isKeyJustPressed(Keyboard.C))
				{
					Editor.copySelectedObject();
				}
				else if(Keyboard.isKeyJustPressed(Keyboard.V))
				{
					Editor.pasteIntoSelectedObject();
				}
				else if(Keyboard.isKeyJustPressed(Keyboard.X))
				{
					Editor.cutSelectedObject();
				}
				else if(Keyboard.isKeyJustPressed(Keyboard.Y))
				{
					//TODO <ADD CODE HERE>
				}
				else if(Keyboard.isKeyJustPressed(Keyboard.Z))
				{
					//TODO <ADD CODE HERE>
				}
			}
		}
		else
		{
			Editor.move_tool.visible = false;
			Editor.rotate_tool.visible = false;
			Editor.resize_tool.visible = false;
		}

		//Check if editing object
		if(Editor.is_editing_object)
		{	
			//If mouse button released exit edit mode
			if(Mouse.buttonJustReleased(Mouse.LEFT))
			{
				Editor.is_editing_object = false;
			}
			else
			{
				Editor.block_camera_move = true;

				//Moving object
				if(Editor.tool_mode === Editor.MODE_MOVE)
				{
					var speed = Editor.camera.position.distanceTo(ObjectUtils.objectAbsolutePosition(Editor.selected_object))/500;
					if(Editor.editing_object_args.x)
					{
						Editor.selected_object.position.x -= Mouse.pos_diff.y * speed * Math.sin(Editor.camera_rotation.x);
						Editor.selected_object.position.x -= Mouse.pos_diff.x * speed * Math.cos(Editor.camera_rotation.x);
					}
					else if(Editor.editing_object_args.y)
					{
						Editor.selected_object.position.y -= Mouse.pos_diff.y * speed;
					}
					else if(Editor.editing_object_args.z)
					{
						Editor.selected_object.position.z -= Mouse.pos_diff.y * speed * Math.sin(Editor.camera_rotation.x + Editor.pid2);
						Editor.selected_object.position.z -= Mouse.pos_diff.x * speed * Math.cos(Editor.camera_rotation.x + Editor.pid2);
					}
					Editor.updateObjectPanel();
				}
				//Resize mode
				else if(Editor.tool_mode === Editor.MODE_RESIZE)
				{
					var speed = Editor.camera.position.distanceTo(ObjectUtils.objectAbsolutePosition(Editor.selected_object))/1000;
					if(Editor.editing_object_args.center)
					{
						var size = (Mouse.pos_diff.x - Mouse.pos_diff.y) * speed/3;

						Editor.selected_object.scale.x += size;
						Editor.selected_object.scale.y += size;
						Editor.selected_object.scale.z += size;
					}
					else if(Editor.editing_object_args.x)
					{
						Editor.selected_object.scale.x -= Mouse.pos_diff.y * speed * Math.sin(Editor.camera_rotation.x);
						Editor.selected_object.scale.x -= Mouse.pos_diff.x * speed * Math.cos(Editor.camera_rotation.x);
					}
					else if(Editor.editing_object_args.y)
					{
						Editor.selected_object.scale.y -= Mouse.pos_diff.y * speed;
					}
					else if(Editor.editing_object_args.z)
					{
						Editor.selected_object.scale.z -= Mouse.pos_diff.y * speed * Math.sin(Editor.camera_rotation.x + Editor.pid2);
						Editor.selected_object.scale.z -= Mouse.pos_diff.x * speed * Math.cos(Editor.camera_rotation.x + Editor.pid2);
					}
					Editor.updateObjectPanel();
				}
				//Rotate Mode
				else if(Editor.tool_mode === Editor.MODE_ROTATE)
				{
					var speed = 1/300;

					if(Editor.editing_object_args.x)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(-(Mouse.pos_diff.y + Mouse.pos_diff.x) * speed, 0, 0, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}
					else if(Editor.editing_object_args.y)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(0, -(Mouse.pos_diff.y + Mouse.pos_diff.x) * speed, 0, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}
					else if(Editor.editing_object_args.z)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(0, 0, (Mouse.pos_diff.y + Mouse.pos_diff.x) * speed, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}
					Editor.updateObjectPanel();
				}
			}
		}

		//Check if mouse inside canvas
		if(Mouse.insideCanvas())
		{
			//Select objects
			if(Editor.tool_mode === Editor.MODE_SELECT)
			{
				if(Mouse.buttonJustPressed(Mouse.LEFT))
				{
					Editor.updateRaycasterFromMouse();
					var intersects =  Editor.raycaster.intersectObjects(Editor.program.scene.children, true);
					if(intersects.length > 0)
					{
						Editor.selectObject(intersects[0].object);
					}
				}
			}

			//Move objects
			else if(Editor.tool_mode === Editor.MODE_MOVE)
			{
				Editor.updateRaycasterFromMouse();
				var move = Editor.move_tool.highlightSelectedComponents(Editor.raycaster);
				if(move.selected && Mouse.buttonJustPressed(Mouse.LEFT))
				{	
					Editor.editing_object_args = move;
					Editor.is_editing_object = true;
					Editor.block_camera_move = true;
				}
			}

			//Resize
			else if(Editor.tool_mode === Editor.MODE_RESIZE)
			{
				Editor.updateRaycasterFromMouse();
				var resize = Editor.resize_tool.highlightSelectedComponents(Editor.raycaster);
				if(resize.selected && Mouse.buttonJustPressed(Mouse.LEFT))
				{	
					Editor.editing_object_args = resize;
					Editor.is_editing_object = true;
					Editor.block_camera_move = true;
				}
			}

			//Rotate
			else if(Editor.tool_mode === Editor.MODE_ROTATE)
			{
				Editor.updateRaycasterFromMouse();
				var rotate = Editor.rotate_tool.highlightSelectedComponents(Editor.raycaster);
				if(rotate.selected && Mouse.buttonJustPressed(Mouse.LEFT))
				{	
					Editor.editing_object_args = rotate;
					Editor.is_editing_object = true;
					Editor.block_camera_move = true;
				}
			}

			//Rotate camera
			if(Mouse.buttonPressed(Mouse.LEFT) && !Editor.block_camera_move)
			{
				Editor.camera_rotation.x -= 0.002 * Mouse.pos_diff.x;
				Editor.camera_rotation.y -= 0.002 * Mouse.pos_diff.y;

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
				var angle_cos = Math.cos(Editor.camera_rotation.x + Editor.pid2);
				var angle_sin = Math.sin(Editor.camera_rotation.x + Editor.pid2);
				Editor.camera.position.z += Mouse.pos_diff.x * speed * angle_cos;
				Editor.camera.position.x += Mouse.pos_diff.x * speed * angle_sin;
			}
			
			//Move Camera on Y
			else if(Mouse.buttonPressed(Mouse.MIDDLE))
			{
				Editor.camera.position.y += Mouse.pos_diff.y * 0.1;
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
		Editor.program_running.scene.update();
	}
}

//Draw stuff into screen
Editor.draw = function()
{
	Editor.renderer.clear();

	if(Editor.state === Editor.STATE_EDITING)
	{
		//Render scene
		Editor.renderer.render(Editor.program.scene, Editor.camera);

		//Render debug scene
		Editor.cannon_renderer.update();
		Editor.renderer.render(Editor.tool_scene, Editor.camera);
		Editor.renderer.clearDepth();
		Editor.renderer.render(Editor.tool_scene_top, Editor.camera);
	}
	else if(Editor.state === Editor.STATE_TESTING)
	{
		Editor.renderer.render(Editor.program_running.scene, Editor.program_running.scene.camera);
	}
}

//Resize to fit window
Editor.resize = function()
{
	Interface.updateInterface();
}

//Select a object
Editor.selectObject = function(obj)
{
	Editor.selected_object = obj;
	Editor.updateSelectedObjectUI();
}

//Check if object is selected
Editor.isObjectSelected = function(obj)
{
	if(Editor.selected_object !== null)
	{
		return Editor.selected_object.uuid === obj.uuid;
	}
	return false;
}

//Delete Selected Object
Editor.deleteSelectedObject = function()
{
	if(Editor.selected_object.parent !== null)
	{
		Editor.selected_object.parent.remove(Editor.selected_object);
		Editor.updateObjectViews();
		Editor.resetEditingFlags();
	}
}

//Copy selected object
Editor.copySelectedObject = function()
{
	if(Editor.selected_object !== null)
	{
		try
		{
			App.clipboard.set(JSON.stringify(Editor.selected_object.toJSON()), "text");
		}
		catch(e){}
	}
}

//Cut selected object
Editor.cutSelectedObject = function()
{
	if(Editor.selected_object !== null)
	{
		try
		{
			App.clipboard.set(JSON.stringify(Editor.selected_object.toJSON()), "text");
			if(Editor.selected_object.parent !== null)
			{
				Editor.selected_object.parent.remove(Editor.selected_object);
				Editor.updateObjectViews();
				Editor.resetEditingFlags();
			}
		}
		catch(e){}
	}
}

//Paste as children of selected object
Editor.pasteIntoSelectedObject = function()
{
	try
	{
		var content = App.clipboard.get("text");
		var loader = new ObjectLoader();
		var data = JSON.parse(content);

		//Create object
		var obj = loader.parse(data);
		obj.uuid = THREE.Math.generateUUID();
		obj.position.set(0, 0, 0);

		//Add object
		if(Editor.selected_object !== null)
		{
			Editor.selected_object.add(obj);
		}
		else
		{
			Editor.program.scene.add(obj);
		}
		Editor.updateObjectViews();
	}
	catch(e){}
}

//Delete selected object
Editor.deleteSelectedObject = function()
{
	if(Editor.selected_object.parent !== null)
	{
		Editor.selected_object.parent.remove(Editor.selected_object);
		Editor.updateObjectViews();
		Editor.resetEditingFlags();
	}
}

//Update UI panel to match selected object
Editor.updateSelectedObjectUI = function()
{
	Interface.tree_view.updateSelectedObject(Editor.selected_object);

	//Destroy old panel
	Interface.panel.destroy();

	//Select correct panel
	if(Editor.selected_object instanceof Text3D)
	{
		Interface.panel = new TextPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof PointLight)
	{
		Interface.panel = new PointLightPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof SpotLight)
	{
		Interface.panel = new SpotLightPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof THREE.Light)
	{
		Interface.panel = new AmbientLightPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof Sky)
	{
		Interface.panel = new SkyPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof LeapHand)
	{
		Interface.panel = new LeapPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof KinectDevice)
	{
		Interface.panel = new KinectPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof Script)
	{
		Interface.panel = new ScriptPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof PerspectiveCamera)
	{
		Interface.panel = new PerspectiveCameraPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof OrthographicCamera)
	{
		Interface.panel = new OrthographicCameraPanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof Scene)
	{
		Interface.panel = new ScenePanel(Interface.explorer_resizable.div_b);
	}
	else if(Editor.selected_object instanceof Program)
	{
		Interface.panel = new ProgramPanel(Interface.explorer_resizable.div_b);
	}
	else
	{
		Interface.panel = new ObjectPanel(Interface.explorer_resizable.div_b);
	}
	
	Interface.panel.attachObject(Editor.selected_object);
	Interface.panel.updateInterface();
}

//Update all object views
Editor.updateObjectViews = function()
{
	Editor.updateTreeView();
	Editor.updateAssetExplorer();
	Editor.updateObjectPanel();
}

//Update tree view to match actual scene
Editor.updateTreeView = function()
{
	//Update tree view from program
	Interface.tree_view.fromObject(Editor.program);
}

//Update assets explorer
Editor.updateAssetExplorer = function()
{
	//Clean asset explorer
	Interface.asset_explorer.clear();
	
	//Get material list
	var materials = ObjectUtils.getMaterials(Editor.program);

	//Add materials to asset explorer
	for(var i = 0; i < materials.length; i++)
	{
		var file = Interface.asset_explorer.add(materials[i].name, "editor/files/icons/misc/material.png");
		file.setObject(materials[i]);
	}

	Interface.asset_explorer.updateInterface();
}

//Updates object panel values
Editor.updateObjectPanel = function()
{
	if(Interface.panel !== null)
	{
		Interface.panel.updatePanel();
	}
}

//Add object to actual scene
Editor.addToActualScene = function(obj)
{
	Editor.program.scene.add(obj);
	Editor.updateObjectViews();
}

//Show apropiate helper to selected object
Editor.updateObjectHelper = function()
{
	Editor.activateHelper(Editor.box_helper, false);
	Editor.activateHelper(Editor.camera_helper, false);
	Editor.activateHelper(Editor.point_light_helper, false);
	Editor.activateHelper(Editor.spot_light_helper, false);
	Editor.activateHelper(Editor.directional_light_helper, false);

	if(Editor.selected_object !== null)
	{
		var position = ObjectUtils.objectAbsolutePosition(Editor.selected_object);

		if(Editor.selected_object instanceof THREE.Camera)
		{
			Editor.activateHelper(Editor.camera_helper, true);
			Editor.camera_helper.camera = Editor.selected_object;
			Editor.camera_helper.position.copy(position);
			Editor.camera_helper.rotation.copy(Editor.selected_object.rotation);
			Editor.camera_helper.update();
		}
		else if(Editor.selected_object instanceof THREE.DirectionalLight)
		{
			Editor.activateHelper(Editor.directional_light_helper, true);
			Editor.directional_light_helper.light = Editor.selected_object;
			Editor.directional_light_helper.position.copy(position);
			Editor.directional_light_helper.update();
		}
		else if(Editor.selected_object instanceof THREE.PointLight)
		{
			Editor.activateHelper(Editor.point_light_helper, true);
			Editor.point_light_helper.light = Editor.selected_object;
			Editor.point_light_helper.position.copy(position);
			Editor.point_light_helper.update();
		}
		else if(Editor.selected_object instanceof THREE.SpotLight)
		{
			Editor.activateHelper(Editor.spot_light_helper, true);
			Editor.spot_light_helper.light = Editor.selected_object;
			Editor.spot_light_helper.position.copy(position);
			Editor.spot_light_helper.update();
		}
		else if(Editor.selected_object instanceof THREE.HemisphereLight)
		{
			Editor.activateHelper(Editor.hemisphere_light_helper, true);
			Editor.hemisphere_light_helper.light = Editor.selected_object;
			Editor.hemisphere_light_helper.position.copy(position);
			Editor.hemisphere_light_helper.update();
		}
		else
		{
			Editor.activateHelper(Editor.box_helper, true);
			Editor.box_helper.update(Editor.selected_object);
		}
	}
}

//Activate helper
Editor.activateHelper = function(helper, value)
{
	helper.visible = value;
	helper.matrixAutoUpdate = value;
}

//Resize Camera
Editor.resizeCamera = function()
{
	if(Editor.canvas !== null && Editor.renderer != null)
	{
		Editor.renderer.setSize(Editor.canvas.width, Editor.canvas.height);
		Editor.camera.aspect = Editor.canvas.width/Editor.canvas.height;
		Editor.camera.updateProjectionMatrix();

		if(Editor.state === Editor.STATE_TESTING)
		{
			Editor.program_running.resize(Editor.canvas.width, Editor.canvas.height);
		}
	}
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

//Update raycaster position from editor mouse position
Editor.updateRaycasterFromMouse = function()
{
	var mouse = new THREE.Vector2((Mouse.pos.x/Editor.canvas.width)*2 - 1, -(Mouse.pos.y/Editor.canvas.height)*2 + 1);
	Editor.raycaster.setFromCamera(mouse, Editor.camera);
}

//Update editor raycaster with new x and y positions (normalized -1 to 1)
Editor.updateRaycaster = function(x, y)
{
	Editor.raycaster.setFromCamera(new THREE.Vector2(x, y), Editor.camera);
}

//Reset editing flags
Editor.resetEditingFlags = function()
{
	Editor.selected_object = null;
	Editor.block_camera_move = false;
	Editor.is_editing_object = false;
	Editor.editing_object_args = null;
	try
	{
		Editor.updateObjectHelper();
	}
	catch(e){}
}

//Save program to file
Editor.saveProgram = function(fname)
{
	var output = Editor.program.toJSON();
	var json = null;
	
	try
	{
		json = JSON.stringify(output, null, "\t");
		json = json.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1");
	}
	catch(e)
	{
		json = JSON.stringify(output);
	}

	App.writeFile(fname, json);
}

//Load program from file
Editor.loadProgram = function(fname)
{
	var loader = new ObjectLoader();
	var data = JSON.parse(App.readFile(fname));
	var program = loader.parse(data);
	
	Editor.program = program;
	Editor.resetEditingFlags();
	Editor.updateObjectViews();
	
	//Remove old tabs from interface
	Interface.tab.clear();
	var scene = Interface.tab.addOption("scene", Interface.file_dir + "icons/tab/scene.png", true);
	var canvas = new SceneEditor();
	canvas.setScene(Editor.program.scene);
	scene.attachComponent(canvas);
	Interface.tab.selectOption(0);
}

//Export web project to file
Editor.exportWebProject = function(fname)
{
	var zip = new JSZip();
	var output = Editor.program.toJSON();
	var json = JSON.stringify(output);

	zip.file("app.isp", json);
	zip.file("index.html", App.readFile("runtime/index.html"));
	zip.file("Main.js", App.readFile("runtime/Main.js"));

	var zfile = zip.generate({type:"blob"});
	console.log(zFile);

	//TODO <ADD CODE HERE>

	//App.writeFile(fname, zfile);
}

//New Program
Editor.createNewProgram = function()
{
	//Create new program
	Editor.program = new Program();
	Editor.program.addDefaultScene();
	Editor.resetEditingFlags();

	//Remove old tabs from interface
	if(Interface.tab !== undefined)
	{
		Interface.tab.clear();
		var scene = Interface.tab.addOption("scene", Interface.file_dir + "icons/tab/scene.png", true);
		var canvas = new SceneEditor();
		canvas.setScene(Editor.program.scene);
		scene.attachComponent(canvas);
		Interface.tab.selectOption(0);
	}
}

//Set editor state
Editor.setState = function(state)
{
	if(state === Editor.STATE_EDITING)
	{
		//Dispose running program if there is one
		if(Editor.program_running !== null)
		{
			Editor.program_running.dispose();
			Editor.program_running = null;
		}

	}
	else if(state === Editor.STATE_TESTING)
	{
		//Copy program
		Editor.program_running = Editor.program.clone();

		//Use editor camera as default camera for program
		Editor.program_running.default_camera = Editor.camera;

		//Initialize scene
		Editor.program_running.initialize();
		Editor.program_running.resize(Editor.canvas.width, Editor.canvas.height);
	}
	
	Editor.state = state;
}

//Set render canvas
Editor.setRenderCanvas = function(canvas)
{
	Mouse.canvas = canvas;
	Editor.canvas = canvas;
	Editor.initializeRenderer(canvas);
}

//Initialize renderer
Editor.initializeRenderer = function(canvas)
{
	Editor.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: false});
	Editor.renderer.autoClear = false;
	Editor.renderer.shadowMap.enabled = true;
	Editor.renderer.shadowMap.type = THREE.PCFShadowMap; //(THREE.PCFShadowMap or THREE.PCFSoftShadowMap)
	Editor.renderer.setSize(canvas.width, canvas.height);
}

//Exit editor
Editor.exit = function()
{
	if(App.gui !== undefined)
	{
		App.gui.App.closeAllWindows();
		App.gui.App.quit();
	}
}
