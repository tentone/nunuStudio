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

include("editor/ui/file/File.js");
include("editor/ui/file/MaterialFile.js");

include("editor/ui/tab/CodeEditor.js");
include("editor/ui/tab/SceneEditor.js");
include("editor/ui/tab/SettingsTab.js");
include("editor/ui/tab/MaterialEditor.js");
include("editor/ui/tab/ParticleEditor.js");
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
include("editor/ui/panels/lights/DirectionalLightPanel.js");
include("editor/ui/panels/lights/SpotLightPanel.js");

include("editor/tools/MoveTool.js");
include("editor/tools/ResizeTool.js");
include("editor/tools/RotateTool.js");

include("editor/utils/MaterialRenderer.js");
include("editor/utils/ObjectIcons.js");

include("editor/Interface.js");
include("editor/Settings.js");

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
Editor.NAME = "nunuStudio";
Editor.VERSION = "V0.8.4 Pre-Alpha";
Editor.TIMESTAMP = "201606190211";

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

	//VR effect and controls
	Editor.vr_controls = new VRControls();
	Editor.vr_effect = null;

	//Renderer and canvas
	Editor.renderer = null;
	Editor.canvas = null;

	//Material renderer for material previews
	Editor.material_renderer = new MaterialRenderer();

	//Default material to be used when creating objects
	Editor.default_material = new THREE.MeshPhongMaterial({color:0xffffff, specular:0x333333, shininess:10});
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
	Editor.default_camera = new PerspectiveCamera(60, Editor.canvas.width/Editor.canvas.height, 0.01, 10000000);
	Editor.default_camera.position.set(0, 5, 5);
	Editor.camera = Editor.default_camera;
	Editor.camera_rotation = new THREE.Vector2(3.14, 0);
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

	//If not on test mode
	if(Editor.state !== Editor.STATE_TESTING)
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
	}

	//Editing a scene
	if(Editor.state === Editor.STATE_EDITING)
	{
		//If object select display tools
		if(Editor.selected_object !== null)
		{
			Editor.updateObjectHelper();

			if(Editor.tool_mode === Editor.MODE_MOVE)
			{
				Editor.move_tool.visible = true;
				Editor.rotate_tool.visible = false;
				Editor.resize_tool.visible = false;

				var distance = Editor.camera.position.distanceTo(Editor.selected_object.getWorldPosition())/5;
				Editor.move_tool.scale.set(distance, distance, distance);

				Editor.selected_object.getWorldPosition(Editor.move_tool.position);
				if(Editor.selected_object.parent !== null)
				{
					Editor.selected_object.parent.getWorldQuaternion(Editor.move_tool.quaternion);
				}
			}
			else if(Editor.tool_mode === Editor.MODE_RESIZE)
			{
				Editor.resize_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.rotate_tool.visible = false;

				var distance = Editor.camera.position.distanceTo(Editor.selected_object.getWorldPosition())/5;
				Editor.resize_tool.scale.set(distance, distance, distance);

				Editor.selected_object.getWorldPosition(Editor.resize_tool.position);
				Editor.selected_object.getWorldQuaternion(Editor.resize_tool.quaternion);
			}
			else if(Editor.tool_mode === Editor.MODE_ROTATE)
			{
				Editor.rotate_tool.visible = true;
				Editor.move_tool.visible = false;
				Editor.resize_tool.visible = false;

				var position = Editor.selected_object.getWorldPosition();
				var distance = Editor.camera.position.distanceTo(Editor.selected_object.getWorldPosition())/5;
				Editor.rotate_tool.scale.set(distance, distance, distance);
				Editor.selected_object.getWorldPosition(Editor.rotate_tool.position);
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
					var scale = Editor.selected_object.parent.getWorldScale();
					var speed = Editor.camera.position.distanceTo(Editor.selected_object.getWorldPosition())/500;

					if(Editor.editing_object_args.x)
					{
						Editor.selected_object.position.x -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x) / scale.x;
						Editor.selected_object.position.x -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x) / scale.x;
					}
					else if(Editor.editing_object_args.y)
					{
						Editor.selected_object.position.y -= Mouse.delta.y * speed / scale.y;
					}
					else if(Editor.editing_object_args.z)
					{
						Editor.selected_object.position.z -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x + Editor.pid2) / scale.z;
						Editor.selected_object.position.z -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x + Editor.pid2) / scale.z;
					}

					//Update object panel
					Editor.updateObjectPanel();
				}
				//Resize mode
				else if(Editor.tool_mode === Editor.MODE_RESIZE)
				{
					var speed = Editor.camera.position.distanceTo(Editor.selected_object.getWorldPosition())/1500;
					var scale = Editor.selected_object.scale;

					if(Editor.editing_object_args.center)
					{
						var size = (Mouse.delta.x - Mouse.delta.y) * speed/2;

						Editor.selected_object.scale.x += size * scale.x;
						Editor.selected_object.scale.y += size * scale.y;
						Editor.selected_object.scale.z += size * scale.z;
					}
					else if(Editor.editing_object_args.x)
					{
						Editor.selected_object.scale.x -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x) * scale.x;
						Editor.selected_object.scale.x -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x) * scale.x;
					}
					else if(Editor.editing_object_args.y)
					{
						Editor.selected_object.scale.y -= Mouse.delta.y * speed * scale.y;
					}
					else if(Editor.editing_object_args.z)
					{
						Editor.selected_object.scale.z -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x + Editor.pid2) * scale.z;
						Editor.selected_object.scale.z -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x + Editor.pid2) * scale.z;
					}

					//Update object panel
					Editor.updateObjectPanel();
				}
				//Rotate Mode
				else if(Editor.tool_mode === Editor.MODE_ROTATE)
				{
					var speed = 1/300;

					if(Editor.editing_object_args.x)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(-(Mouse.delta.y + Mouse.delta.x) * speed, 0, 0, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}
					else if(Editor.editing_object_args.y)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(0, -(Mouse.delta.y + Mouse.delta.x) * speed, 0, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}
					else if(Editor.editing_object_args.z)
					{
						var delta = new THREE.Quaternion();
						delta.setFromEuler(new THREE.Euler(0, 0, (Mouse.delta.y + Mouse.delta.x) * speed, 'XYZ'));
						Editor.selected_object.quaternion.multiplyQuaternions(delta, Editor.selected_object.quaternion);
					}

					//Update object panel
					Editor.updateObjectPanel();
				}

				//Update object tranformation matrix
				if(!Editor.selected_object.matrixAutoUpdate)
				{
					Editor.selected_object.updateMatrix();
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
				Editor.camera_rotation.x -= 0.002 * Mouse.delta.x;
				Editor.camera_rotation.y -= 0.002 * Mouse.delta.y;

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
				//Move speed
				var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0))/1000;
				if(speed < 0.02)
				{
					speed = 0.02;
				}

				//Move Camera Front and Back
				var angle_cos = Math.cos(Editor.camera_rotation.x);
				var angle_sin = Math.sin(Editor.camera_rotation.x);
				Editor.camera.position.z += Mouse.delta.y * speed * angle_cos;
				Editor.camera.position.x += Mouse.delta.y * speed * angle_sin;

				//Move Camera Lateral
				var angle_cos = Math.cos(Editor.camera_rotation.x + Editor.pid2);
				var angle_sin = Math.sin(Editor.camera_rotation.x + Editor.pid2);
				Editor.camera.position.z += Mouse.delta.x * speed * angle_cos;
				Editor.camera.position.x += Mouse.delta.x * speed * angle_sin;
			}
			
			//Move Camera on Y
			else if(Mouse.buttonPressed(Mouse.MIDDLE))
			{
				Editor.camera.position.y += Mouse.delta.y * 0.1;
			}

			//Move in camera direction using mouse scroll
			if(Mouse.wheel != 0)
			{
				//Move speed
				var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0))/2000;
				speed *= Mouse.wheel;

				//Limit zoom speed
				if(speed < 0)
				{
					if(speed > -0.03)
					{
						speed = -0.03;
					}
					else if(speed < -5)
					{
						speed = -5;
					}
				}
				else if(speed > 0)
				{
					if(speed < 0.03)
					{
						speed = 0.03;
					}
					else if(speed > 5)
					{
						speed = 5;
					}
				}

				//Move camera
				var direction = Editor.camera.getWorldDirection();
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
		//If VR is enabled
		if(Editor.vr_effect !== null)
		{
			//Update VR controls
			Editor.vr_controls.scale = Editor.program_running.vr_scale;
			Editor.vr_controls.update();

			//Backup camera atributes
			var camera = Editor.program_running.scene.camera;
			var position = camera.position.clone();
			var quaternion = camera.quaternion.clone();

			//Apply VR controller offsets to actual camera
			camera.position.add(Editor.vr_controls.position);
			camera.quaternion.multiply(Editor.vr_controls.quaternion);

			//Render scene
			Editor.vr_effect.render(Editor.program_running.scene, camera);

			//Backup camera atributes
			camera.position.copy(position);
			camera.quaternion.copy(quaternion);
		}
		else
		{
			Editor.renderer.render(Editor.program_running.scene, Editor.program_running.scene.camera);
		}
	}
}

//Resize to fit window
Editor.resize = function()
{
	if(!App.fullscreen)
	{
		Interface.updateInterface();
	}
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
		obj.traverse(function(child)
		{
			child.uuid = THREE.Math.generateUUID();
		});

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
	else if(Editor.selected_object instanceof DirectionalLight)
	{
		Interface.panel = new DirectionalLightPanel(Interface.explorer_resizable.div_b);
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
	setTimeout(Editor.updateAssetExplorer, 0);
	Editor.updateObjectPanel();
	Editor.updateTabsData();
}

//Update tab names to match objects actual info
Editor.updateTabsData = function()
{
	Interface.tab.updateObjectData();
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
		var file = new MaterialFile(Interface.asset_explorer.element);
		file.setMaterial(materials[i]);
		Interface.asset_explorer.add(file);
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
		var position = Editor.selected_object.getWorldPosition();

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
		else if(Editor.selected_object instanceof THREE.Object3D)
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
	
	//Remove old tabs from interface
	Interface.tab.clear();

	//Add new scene tab to interface
	if(Editor.program.scene !== null)
	{
		var scene = Interface.tab.addOption("scene", Interface.file_dir + "icons/tab/scene.png", true);
		var canvas = new SceneEditor();
		canvas.setScene(Editor.program.scene);
		scene.attachComponent(canvas);
		Interface.tab.selectOption(0);
	}

	//Update object views
	Editor.resetEditingFlags();
	Editor.updateObjectViews();
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
		//Dispose running program
		Editor.disposeRunningProgram();

		//Set run button text
		Interface.run.setText("Run");
		Interface.run.visible = true;
		Interface.run.updateInterface();

		//Hide fullscreen and VR buttons
		var tab = Interface.tab.getActual();
		if(tab instanceof SceneEditor)
		{
			tab.show_buttons_fullscreen = false;
			tab.show_buttons_vr = false;
			tab.updateInterface();
		}
	}
	else if(state === Editor.STATE_TESTING)
	{
		//Copy program
		Editor.program_running = Editor.program.clone();

		//Use editor camera as default camera for program
		Editor.program_running.default_camera = Editor.camera;
		Editor.program_running.renderer = Editor.renderer;

		//Initialize scene
		Editor.program_running.initialize();
		Editor.program_running.resize(Editor.canvas.width, Editor.canvas.height);

		//Show full screen and VR buttons
		var tab = Interface.tab.getActual();
		tab.show_buttons_fullscreen = true;

		//If program uses VR set button
		if(Editor.program_running.vr && App.webvrAvailable())
		{
			//Create VREffect instance
			Editor.vr_effect = new THREE.VREffect(Editor.renderer);
			
			//Show VR button
			tab.show_buttons_vr = true;

			//Create VR switch callback
			var vr_state = true;
			tab.vr_button.setCallback(function()
			{
				if(Editor.vr_effect !== null)
				{
					Editor.vr_effect.setFullScreen(vr_state);
					vr_state = !vr_state;
				}
			});
		}

		//Update tab to show buttons
		tab.updateInterface();

		//Set run button text
		Interface.run.setText("Stop");
		Interface.run.visible = true;
		Interface.run.updateInterface();
	}
	else if(state === Editor.STATE_IDLE)
	{
		//Dispose running program
		Editor.disposeRunningProgram();

		//Hide run button
		Interface.run.visible = false;
		Interface.run.updateInterface();
	}

	//Set editor state
	Editor.state = state;
}

//Dispose running program if there is one
Editor.disposeRunningProgram = function()
{
	//Dispose running program if there is one
	if(Editor.program_running !== null)
	{
		Editor.program_running.dispose();
		Editor.program_running = null;
		Editor.vr_effect = null;
	}
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
	Editor.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: Settings.renderer_antialiasing});
	Editor.renderer.autoClear = false;
	Editor.renderer.shadowMap.enabled = Settings.renderer_shadows;
	Editor.renderer.shadowMap.type = Settings.renderer_shadows_type;
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
