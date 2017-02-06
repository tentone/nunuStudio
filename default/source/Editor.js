"use strict";

function Editor(){}

//Node modules
try
{
	Editor.fs = require("fs");
	Editor.gui = require("nw.gui");
	Editor.clipboard = Editor.gui.Clipboard.get();
	Editor.args = Editor.gui.App.argv;
}
catch(e)
{
	Editor.args = [];
}

//WebVR polyfill
/*if(navigator.getVRDisplays === undefined)
{
	include("lib/webvr-polyfill.js", function()
	{
		window.WebVRConfig =
		{
			FORCE_ENABLE_VR: true, //Forces availability of VR mode in desktop
			CARDBOARD_UI_DISABLED: true,
			ROTATE_INSTRUCTIONS_DISABLED: true,
			TOUCH_PANNER_DISABLED: true,
			MOUSE_KEYBOARD_CONTROLS_DISABLED: false,
			K_FILTER: 1.0, //0 for accelerometer, 1 for gyro
			PREDICTION_TIME_S: 0.04, //Time predict during fast motion
			YAW_ONLY: false,
			DEFER_INITIALIZATION: false,
			ENABLE_DEPRECATED_API: false,
			BUFFER_SCALE: 0.5,
			DIRTY_SUBMIT_FRAME_BINDINGS: false
		}
	});
}*/

//Editor state
Editor.STATE_IDLE = 8;
Editor.STATE_EDITING = 9;
Editor.STATE_TESTING = 11;

//Editor editing modes
Editor.MODE_SELECT = 0;
Editor.MODE_MOVE = 1;
Editor.MODE_SCALE = 2;
Editor.MODE_ROTATE = 3;

//Editor camera mode
Editor.CAMERA_ORTHOGRAPHIC = 20;
Editor.CAMERA_PERSPECTIVE = 21;

//Initialize Main
Editor.initialize = function()
{
	Editor.fullscreen = false;
	
	document.body.style.overflow = "hidden";
	
	//Open ISP file if dragged to the window
	document.body.ondrop = function(event)
	{
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];

			//Open project
			if(file.name.endsWith(".isp"))
			{
				if(confirm("All unsaved changes to the project will be lost! Load file?"))
				{
					Editor.loadProgram(file.path);
					Editor.resetEditingFlags();
					Editor.updateObjectViews();
				}
			}
		}
	}

	//TODO <USE SYNC INPUT KEYBOARD MOUSE AND GAMEPAD>

	//Initialize input
	Keyboard.initialize();
	Mouse.initialize();

	//Load settings
	Settings.load();

	//Load interface theme
	Editor.theme = Theme.get(Settings.general.theme);

	//Set windows close event
	if(Editor.gui !== undefined)
	{
		//Close event
		Editor.gui.Window.get().on("close", function()
		{
			if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		});
	}

	//Set window title
	document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ")";

	//Editor initial state
	Editor.tool_mode = Editor.MODE_SELECT;
	Editor.state = Editor.STATE_EDITING;

	//Open file
	Editor.open_file = null;

	//Editor Selected object
	Editor.selected_object = null;
	Editor.is_editing_object = false;

	//Performance meter
	Editor.stats = null;

	//History
	Editor.history = new History();

	//Editor program and scene
	Editor.program = null;
	Editor.program_running = null;

	//VR effect and controls
	Editor.vr_controls = new VRControls();

	//Renderer and canvas
	Editor.renderer = null;
	Editor.canvas = null;
	Editor.gl = null;

	//Material renderer for material previews
	Editor.material_renderer = new MaterialRenderer();
	Editor.font_renderer = new FontRenderer();
	
	//Default resources
	Editor.createDefaultResouces();

	//Initialize User Interface
	Interface.initialize();

	//Debug Elements
	Editor.tool_scene = new THREE.Scene();
	Editor.tool_scene_top = new THREE.Scene();

	//Raycaster
	Editor.raycaster = new THREE.Raycaster(); 

	//Grid and axis helpers
	Editor.grid_helper = new GridHelper(Settings.editor.grid_size, Settings.editor.grid_spacing, 0x888888);
	Editor.grid_helper.visible = Settings.editor.grid_enabled;
	Editor.tool_scene.add(Editor.grid_helper);

	Editor.axis_helper = new THREE.AxisHelper(Settings.editor.grid_size);
	Editor.axis_helper.material.depthWrite = false;
	Editor.axis_helper.material.transparent = true;
	Editor.axis_helper.material.opacity = 1;
	Editor.axis_helper.visible = Settings.editor.axis_enabled;
	Editor.tool_scene.add(Editor.axis_helper);

	//Object helper container
	Editor.object_helper = new THREE.Scene();
	Editor.tool_scene.add(Editor.object_helper);

	//Tool container
	Editor.tool_container = new THREE.Scene();
	Editor.tool_scene_top.add(Editor.tool_container);
	Editor.tool = null;

	//Editor Camera
	Editor.camera_mode = Editor.CAMERA_PERSPECTIVE;
	Editor.camera_rotation = new Vector2(0, 0);
	Editor.setCameraMode(Editor.CAMERA_PERSPECTIVE);
	
	//Check is some .isp file passed as argument
	for(var i = 0; i < Editor.args.length; i++)
	{
		if(Editor.args[i].endsWith(".isp"))
		{
			Editor.loadProgram(Editor.args[i]);
			break;
		}
	}

	//Create new program
	if(Editor.program === null)
	{	
		Editor.createNewProgram();
	}

	//Update views and start update loop
	Editor.updateObjectViews();
	Editor.update();
}

//Update Editor
Editor.update = function()
{
	requestAnimationFrame(Editor.update);

	//Update input
	Mouse.update();
	Keyboard.update();

	//End performance measure
	if(Editor.stats !== null)
	{
		Editor.stats.begin();
	}

	//Update editor interface
	Interface.update();
	Editor.is_editing_object = false;

	//If not on test mode
	if(Editor.state !== Editor.STATE_TESTING)
	{
		//Close tab, Save and load project
		if(Keyboard.keyPressed(Keyboard.CTRL))
		{
			if(Keyboard.keyJustPressed(Keyboard.S))
			{
				if(Editor.open_file === null)
				{
					Interface.saveProgram();
				}
				else
				{
					Editor.saveProgram(undefined, false);
				}
			}
			else if(Keyboard.keyJustPressed(Keyboard.L))
			{
				Interface.loadProgram();
			}
			else if(Keyboard.keyJustPressed(Keyboard.W) || Keyboard.keyJustPressed(Keyboard.F4))
			{
				Interface.tab.closeActual();
			}
			else if(Keyboard.keyJustPressed(Keyboard.TAB) || Keyboard.keyJustPressed(Keyboard.PAGE_DOWN))
			{
				Interface.tab.selectNextTab();
			}
			else if(Keyboard.keyJustPressed(Keyboard.PAGE_UP))
			{
				Interface.tab.selectPreviousTab();
			}
		}
	}

	//Editing a scene
	if(Editor.state === Editor.STATE_EDITING)
	{
		//Keyboard shortcuts
		if(Keyboard.keyJustPressed(Keyboard.DEL))
		{
			Editor.deleteObject();
		}
		else if(Keyboard.keyJustPressed(Keyboard.F5))
		{
			Editor.setState(Editor.STATE_TESTING);
		}
		else if(Keyboard.keyPressed(Keyboard.CTRL))
		{
			if(Interface.panel !== null && !Interface.panel.focused)
			{
				if(Keyboard.keyJustPressed(Keyboard.C))
				{
					Editor.copyObject();
				}
				else if(Keyboard.keyJustPressed(Keyboard.V))
				{
					Editor.pasteObject();
				}
				else if(Keyboard.keyJustPressed(Keyboard.X))
				{
					Editor.cutObject();
				}
			}
			
			if(Keyboard.keyJustPressed(Keyboard.Y))
			{
				Editor.redo();
			}
			else if(Keyboard.keyJustPressed(Keyboard.Z))
			{
				Editor.undo();
			}
		}

		//Select objects
		if(Editor.tool_mode === Editor.MODE_SELECT)
		{
			if(Mouse.buttonJustPressed(Mouse.LEFT) && Mouse.insideCanvas())
			{
				Editor.selectObjectWithMouse();
			}

			Editor.is_editing_object = false;
		}
		else
		{
			//If mouse double clicked select object
			if(Mouse.buttonDoubleClicked() && Mouse.insideCanvas())
			{
				Editor.selectObjectWithMouse();
			}

			//If no object selected update tool
			if(Editor.selected_object !== null)
			{
				if(Editor.tool !== null)
				{
					Editor.is_editing_object = Editor.tool.update();
					
					if(Mouse.buttonJustPressed(Mouse.LEFT) && Editor.is_editing_object)
					{
						Editor.history.push(Editor.selected_object, Action.CHANGED);
					}

					if(Editor.is_editing_object)
					{
						Editor.updateObjectPanel();
					}
				}
				else
				{
					Editor.is_editing_object = false;
				}
			}
		}
		
		//Update object transformation matrix
		if(Editor.selected_object !== null)
		{	
			if(!Editor.selected_object.matrixAutoUpdate)
			{
				Editor.selected_object.updateMatrix();
			}
		}

		//Update object helper
		Editor.object_helper.update();

		//Check if mouse is inside canvas
		if(Mouse.insideCanvas())
		{
			//Lock mouse when camera is moving
			if(Settings.editor.lock_mouse)
			{
				if(!Editor.is_editing_object && (Mouse.buttonJustPressed(Mouse.LEFT) || Mouse.buttonJustPressed(Mouse.RIGHT) || Mouse.buttonJustPressed(Mouse.MIDDLE)))
				{
					Mouse.setLock(true);
				}
				else if(Mouse.buttonJustReleased(Mouse.LEFT) || Mouse.buttonJustReleased(Mouse.RIGHT) || Mouse.buttonJustReleased(Mouse.MIDDLE))
				{
					Mouse.setLock(false);
				}
			}

			//Orthographic camera (2D mode)
			if(Editor.camera_mode === Editor.CAMERA_ORTHOGRAPHIC)
			{
				//Move camera on y / x
				if(Mouse.buttonPressed(Mouse.RIGHT))
				{
					var ratio = Editor.camera.size / Editor.canvas.width * 2;

					Editor.camera.position.x -= Mouse.delta.x * ratio;
					Editor.camera.position.y += Mouse.delta.y * ratio;
				}

				//Camera zoom
				if(Mouse.wheel !== 0)
				{
					Editor.camera.size += Mouse.wheel * Editor.camera.size / 1000;

					Editor.camera.updateProjectionMatrix();
				}
			}
			//Perpesctive camera
			else
			{
				//Look camera
				if(Mouse.buttonPressed(Mouse.LEFT) && !Editor.is_editing_object)
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
					var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0)) / 1000;
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
					var angle_cos = Math.cos(Editor.camera_rotation.x + MathUtils.pid2);
					var angle_sin = Math.sin(Editor.camera_rotation.x + MathUtils.pid2);
					Editor.camera.position.z += Mouse.delta.x * speed * angle_cos;
					Editor.camera.position.x += Mouse.delta.x * speed * angle_sin;
				}
				
				//Move Camera on Y
				else if(Mouse.buttonPressed(Mouse.MIDDLE))
				{
					Editor.camera.position.y += Mouse.delta.y * 0.1;
				}

				//Move in camera direction using mouse scroll
				if(Mouse.wheel !== 0)
				{
					//Move speed
					var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0))/2000;
					speed *= Mouse.wheel;

					//Limit zoom speed
					if(speed < 0 && speed > -0.03)
					{
						speed = -0.03;
					}
					else if(speed > 0 && speed < 0.03)
					{
						speed = 0.03;
					}

					//Move camera
					var direction = Editor.camera.getWorldDirection();
					Editor.camera.position.x -= speed * direction.x;
					Editor.camera.position.y -= speed * direction.y;
					Editor.camera.position.z -= speed * direction.z;
				}
			}
		}
	}
	//Update Scene if on test mode
	else if(Editor.state === Editor.STATE_TESTING)
	{
		Editor.program_running.update();

		if(Keyboard.keyJustPressed(Keyboard.F5))
		{
			Editor.setState(Editor.STATE_EDITING);
		}
	}

	Editor.render();
}

//Render stuff into screen
Editor.render = function()
{
	var renderer = Editor.renderer;	
	renderer.clear();

	if(Editor.state === Editor.STATE_EDITING)
	{
		//Render scene
		renderer.setViewport(0, 0, Editor.canvas.width, Editor.canvas.height);
		renderer.render(Editor.program.scene, Editor.camera);

		//Render tools
		renderer.render(Editor.tool_scene, Editor.camera);
		renderer.clearDepth();
		renderer.render(Editor.tool_scene_top, Editor.camera);

		//Render camera preview
		if(Settings.editor.camera_preview_enabled && (Editor.selected_object instanceof THREE.Camera || Editor.program.scene.cameras.length > 0))
		{
			var width = Settings.editor.camera_preview_percentage * Editor.canvas.width;
			var height = Settings.editor.camera_preview_percentage * Editor.canvas.height;
			var offset = Editor.canvas.width - width - 10;

			renderer.setScissorTest(true);
			renderer.setViewport(offset, 10, width, height);
			renderer.setScissor(offset, 10, width, height);
			renderer.clear();

			if(Editor.selected_object instanceof THREE.Camera)
			{
				var camera = Editor.selected_object;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setViewport(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.setScissor(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);

				renderer.render(Editor.program.scene, camera);
			}
			else
			{
				var scene = Editor.program.scene;
				for(var i = 0; i < scene.cameras.length; i++)
				{
					var camera = scene.cameras[i];
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
					
					if(camera.clear_color)
					{
						renderer.clearColor();
					}
					if(camera.clear_depth)
					{
						renderer.clearDepth();
					}

					renderer.setViewport(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.setScissor(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.render(scene, camera);
				}
			}

			renderer.setScissor(0, 0, Editor.canvas.width, Editor.canvas.height);
		}
	}
	else if(Editor.state === Editor.STATE_TESTING)
	{
		Editor.program_running.render(renderer, Editor.canvas.width, Editor.canvas.height);
	}

	//End performance measure
	if(Editor.stats !== null)
	{
		Editor.stats.end();
	}
}

//Resize to fit window
Editor.resize = function()
{
	if(!Editor.fullscreen)
	{
		Interface.updateInterface();
	}
}

//Select a object
Editor.selectObject = function(object)
{
	if(object instanceof THREE.Object3D)
	{
		Editor.selected_object = object;

		Editor.selectObjectPanel();
		Editor.selectObjectHelper();

		if(Editor.tool !== null)
		{
			Editor.tool.detach();
			Editor.tool.attach(object);
		}
		else
		{
			Editor.selectTool(Editor.tool_mode);
		}
	}
	else
	{
		Editor.selected_object = null;
		Editor.resetEditingFlags();
	}
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

//Add object to actual scene
Editor.addToScene = function(obj)
{
	if(Editor.program.scene !== null)
	{
		Editor.program.scene.add(obj);

		Editor.history.push(obj, Action.ADDED);

		Editor.updateObjectViews();
	}
}

//Delete selected Object
Editor.deleteObject = function(obj)
{
	if(obj === undefined)
	{
		obj = Editor.selected_object;
	}
	
	if(obj instanceof THREE.Object3D)
	{
		if(Editor.isObjectSelected(obj))
		{
			Editor.resetEditingFlags();
		}

		Editor.history.push(obj, Action.REMOVED);
		
		obj.destroy();

		Editor.updateObjectViews();
	}
}

//Copy selected object
Editor.copyObject = function(obj)
{
	if(obj !== undefined)
	{
		if(Editor.clipboard !== undefined)
		{
			Editor.clipboard.set(JSON.stringify(obj.toJSON()), "text");
		}
	}
	else if(Editor.selected_object !== null && !(Editor.selected_object instanceof Program || Editor.selected_object instanceof Scene))
	{
		if(Editor.clipboard !== undefined)
		{
			Editor.clipboard.set(JSON.stringify(Editor.selected_object.toJSON()), "text");
		}
	}
}

//Cut selected object
Editor.cutObject = function(obj)
{
	if(obj === undefined)
	{
		if(Editor.selected_object !== null && !(Editor.selected_object instanceof Program || Editor.selected_object instanceof Scene))
		{
			obj = Editor.selected_object;
		}
		else
		{
			return;
		}
	}

	if(Editor.clipboard !== undefined)
	{
		Editor.clipboard.set(JSON.stringify(obj.toJSON()), "text");
	}
	
	Editor.history.push(obj, Action.REMOVED);
	obj.destroy();

	Editor.updateObjectViews();
	if(Editor.isObjectSelected(obj))
	{
		Editor.resetEditingFlags();
	}
}

//Paste object as children of target object
Editor.pasteObject = function(target)
{
	try
	{
		var content = Editor.clipboard.get("text");
		var data = JSON.parse(content);

		//Create object
		var obj = new ObjectLoader().parse(data);
		obj.traverse(function(child)
		{
			child.uuid = THREE.Math.generateUUID();
		});

		//Add object to target
		if(target !== undefined)
		{
			target.add(obj);
		}
		else
		{
			Editor.program.scene.add(obj);
		}

		Editor.history.push(obj, Action.ADDED);
		
		Editor.updateObjectViews();
	}
	catch(e){}
}

//Redo action
Editor.redo = function()
{
	alert("Redo not implemented");
}

//Undo action
Editor.undo = function()
{
	var action = Editor.history.undo();
	if(action != null)
	{
		Editor.updateObjectViews();
	
		if(action.type === Action.CHANGED)
		{
			if(action.object.uuid === Editor.selected_object.uuid)
			{
				Editor.selectObject(action.object);
			}
		}
	}
	else
	{
		alert("Not possible to undo any further");
	}
}

//TODO <REMOVE TEST CODE>
var update = 0;
var tree_delta, asset_delta, tabs_delta, panel_delta;

//Update all object views
Editor.updateObjectViews = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	Editor.updateTreeView();
	Editor.updateObjectPanel();
	Editor.updateTabsData();
	Editor.updateAssetExplorer();

	//TODO <REMOVE TEST CODE>
	var delta = Date.now() - start;
	//console.log("Update " + (update++) + " ObjectView: " + delta + "ms");
	//console.log("    Treeview " + tree_delta + "ms");
	//console.log("    Panel " + panel_delta + "ms");
	//console.log("    Tabs " + tabs_delta + "ms");
	//console.log("    Assets " + asset_delta + "ms\n\n");
}

//Update tab names to match objects actual info
Editor.updateTabsData = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	Interface.tab.updateMetadata();

	//TODO <REMOVE TEST CODE>
	tabs_delta = Date.now() - start;
}

//Update tree view to match actual scene
Editor.updateTreeView = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	Interface.tree_view.attachObject(Editor.program);
	Interface.tree_view.updateView();
	
	//TODO <REMOVE TEST CODE>
	tree_delta = Date.now() - start;
}

//Update assets explorer content
Editor.updateAssetExplorer = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	//Clean asset explorer
	Interface.asset_explorer.clear();
	
	//Materials
	var materials = ObjectUtils.getMaterials(Editor.program, Editor.program.materials);
	for(var i in materials)
	{
		var file = new MaterialAsset(Interface.asset_explorer.element);
		file.setMaterial(materials[i]);
		Interface.asset_explorer.add(file);
	}

	//Textures
	var textures = ObjectUtils.getTextures(Editor.program, Editor.program.textures);
	for(var i in textures)
	{
		var file = new TextureAsset(Interface.asset_explorer.element);
		file.setTexture(textures[i]);
		Interface.asset_explorer.add(file);
	}

	//Fonts
	var fonts = ObjectUtils.getFonts(Editor.program, Editor.program.fonts);
	for(var i in fonts)
	{
		var file = new FontAsset(Interface.asset_explorer.element);
		file.setFont(fonts[i]);
		Interface.asset_explorer.add(file);
	}

	//Audio
	var audio = ObjectUtils.getAudio(Editor.program, Editor.program.audio);
	for(var i in audio)
	{
		var file = new AudioAsset(Interface.asset_explorer.element);
		file.setAudio(audio[i]);
		Interface.asset_explorer.add(file);
	}

	Interface.asset_explorer.updateInterface();

	//TODO <REMOVE TEST CODE>
	asset_delta = Date.now() - start;
}

//Updates object panel values
Editor.updateObjectPanel = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	if(Interface.panel !== null)
	{
		Interface.panel.updatePanel();
	}

	//TODO <REMOVE TEST CODE>
	panel_delta = Date.now() - start;
}

//Create default resouces to be used when creating new objects
Editor.createDefaultResouces = function()
{
	Editor.default_image = new Image("data/sample.png");		
	Editor.default_font = new Font("data/fonts/montserrat.json"); //new Font("data/fonts/droid_sans_mono_regular.json");
	Editor.default_audio = new Audio("data/sample.mp3");
	Editor.default_texture = new Texture(Editor.default_image);
	Editor.default_material = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
	Editor.default_material.name = "default";
	Editor.default_sprite_material = new THREE.SpriteMaterial({map: Editor.default_texture, color: 0xffffff});
	Editor.default_sprite_material.name = "default";
}

//Select tool to manipulate objects
Editor.selectTool = function(tool)
{
	Editor.tool_mode = tool;
	Editor.tool_container.removeAll();
	
	if(Editor.tool !== null)
	{
		Editor.tool.dispose();	
	}

	Interface.selectTool(tool);

	if(Editor.selected_object !== null && tool !== Editor.MODE_SELECT)
	{
		if(tool === Editor.MODE_MOVE)
		{
			Editor.tool = new TransformControls();
			Editor.tool.setMode("translate");
			Editor.tool.setSpace(Settings.editor.transformation_space);
		}
		else if(tool === Editor.MODE_SCALE)
		{
			Editor.tool = new TransformControls();
			Editor.tool.setMode("scale");
		}
		else if(tool === Editor.MODE_ROTATE)
		{
			Editor.tool = new TransformControls();
			Editor.tool.setMode("rotate");
			Editor.tool.setSpace(Settings.editor.transformation_space);
		}
		
		Editor.tool.attach(Editor.selected_object);
		Editor.tool_container.add(Editor.tool);
	}
	else
	{
		Editor.tool = null;
	}
}

//Update UI panel to match selected object
Editor.selectObjectPanel = function()
{
	Interface.tree_view.updateSelectedObject(Editor.selected_object);

	if(Interface.panel !== null)
	{
		Interface.panel.destroy();
	}

	if(Editor.selected_object !== null)
	{
		if(Editor.selected_object instanceof Text3D)
		{
			Interface.panel = new Text3DPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.Mesh)
		{
			Interface.panel = new MeshPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.PointLight)
		{
			Interface.panel = new PointLightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.RectAreaLight)
		{
			Interface.panel = new RectAreaLightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.SpotLight)
		{
			Interface.panel = new SpotLightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.DirectionalLight)
		{
			Interface.panel = new DirectionalLightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.HemisphereLight)
		{
			Interface.panel = new HemisphereLightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof THREE.Light)
		{
			Interface.panel = new LightPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof Sky)
		{
			Interface.panel = new SkyPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof LeapMotion)
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
		else if(Editor.selected_object instanceof AudioEmitter || Editor.selected_object instanceof PositionalAudio)
		{
			Interface.panel = new AudioPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof Scene)
		{
			Interface.panel = new ScenePanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof Program)
		{
			Interface.panel = new ProgramPanel(Interface.explorer_resizable.div_b);
		}
		else if(Editor.selected_object instanceof PhysicsObject)
		{
			Interface.panel = new PhysicsPanel(Interface.explorer_resizable.div_b);
		}
		else
		{
			Interface.panel = new ObjectPanel(Interface.explorer_resizable.div_b);
		}

		Interface.panel.attach(Editor.selected_object);
		Interface.panel.updateInterface();
	}
	else
	{
		Interface.panel = null;
	}
}

//Select helper to debug selected object data
Editor.selectObjectHelper = function()
{
	Editor.object_helper.removeAll();

	if(Editor.selected_object !== null)
	{
		//Camera
		if(Editor.selected_object instanceof THREE.Camera)
		{
			Editor.object_helper.add(new THREE.CameraHelper(Editor.selected_object));
			Editor.object_helper.add(new ObjectIconHelper(Editor.selected_object, Interface.file_dir + "icons/camera/camera.png"));
		}
		//Directional light
		else if(Editor.selected_object instanceof THREE.DirectionalLight)
		{
			Editor.object_helper.add(new THREE.DirectionalLightHelper(Editor.selected_object, 1));
		}
		//Point light
		else if(Editor.selected_object instanceof THREE.PointLight)
		{
			Editor.object_helper.add(new THREE.PointLightHelper(Editor.selected_object, 1));
		}
		//RectArea light
		else if(Editor.selected_object instanceof THREE.RectAreaLight)
		{
			Editor.object_helper.add(new RectAreaLightHelper(Editor.selected_object));
		}
		//Spot light
		else if(Editor.selected_object instanceof THREE.SpotLight)
		{
			Editor.object_helper.add(new THREE.SpotLightHelper(Editor.selected_object));
		}
		//Hemisphere light
		else if(Editor.selected_object instanceof THREE.HemisphereLight)
		{
			Editor.object_helper.add(new THREE.HemisphereLightHelper(Editor.selected_object, 1));
		}
		//Particle
		else if(Editor.selected_object instanceof ParticleEmitter)
		{
			Editor.object_helper.add(new ParticleEmitterHelper(Editor.selected_object));
		}
		//Physics
		else if(Editor.selected_object instanceof PhysicsObject)
		{
			Editor.object_helper.add(new PhysicsObjectHelper(Editor.selected_object));
		}
		//Script or Audio
		else if(Editor.selected_object instanceof Script || Editor.selected_object instanceof AudioEmitter)
		{
			Editor.object_helper.add(new ObjectIconHelper(Editor.selected_object, ObjectIcons.get(Editor.selected_object.type)));
		}
		//Animated Mesh
		else if(Editor.selected_object instanceof THREE.SkinnedMesh)
		{
			Editor.object_helper.add(new BoundingBoxHelper(Editor.selected_object, 0xFFFF00));
			Editor.object_helper.add(new WireframeHelper(Editor.selected_object));
			Editor.object_helper.add(new THREE.SkeletonHelper(Editor.selected_object));
		}
		//Mesh
		else if(Editor.selected_object instanceof THREE.Mesh)
		{
			Editor.object_helper.add(new BoundingBoxHelper(Editor.selected_object, 0xFFFF00));
			Editor.object_helper.add(new WireframeHelper(Editor.selected_object));
		}
		//Object 3D
		else if(Editor.selected_object instanceof THREE.Object3D)
		{
			Editor.object_helper.add(new BoundingBoxHelper(Editor.selected_object, 0xFFFF00));
		}
	}
}

//Resize Camera
Editor.resizeCamera = function()
{
	if(Editor.canvas !== null && Editor.renderer !== null)
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

//Set camera mode (ortho or perspective)
Editor.setCameraMode = function(mode)
{
	if(mode === undefined)
	{
		mode = (Editor.camera_mode === Editor.CAMERA_PERSPECTIVE) ? Editor.CAMERA_ORTHOGRAPHIC : Editor.CAMERA_PERSPECTIVE;
	}
	
	var aspect = (Editor.canvas !== null) ? Editor.canvas.width/Editor.canvas.height : 1.0;

	if(mode === Editor.CAMERA_ORTHOGRAPHIC)
	{
		Editor.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL);
		Editor.camera.position.set(0, 0, 20);
		Editor.grid_helper.rotation.x = Math.PI / 2;
	}
	else if(mode === Editor.CAMERA_PERSPECTIVE)
	{
		Editor.camera = new PerspectiveCamera(60, aspect);
		Editor.camera.position.set(0, 3, 20);
		Editor.camera_rotation.set(3.14, 0);
		Editor.grid_helper.rotation.x = 0;
		Editor.setCameraRotation(Editor.camera_rotation, Editor.camera);
	}

	Editor.camera_mode = mode;
	Editor.selectTool(Editor.tool_mode);
}

//Set camera rotation
Editor.setCameraRotation = function(camera_rotation, camera)
{
	//Calculate direction vector
	var cos_angle_y = Math.cos(camera_rotation.y);
	var direction = new THREE.Vector3(Math.sin(camera_rotation.x)*cos_angle_y, Math.sin(camera_rotation.y), Math.cos(camera_rotation.x)*cos_angle_y);

	//Add position offset and set camera direction
	direction.add(camera.position);
	camera.lookAt(direction);
}

//Update raycaster position from editor mouse position
Editor.updateRaycasterFromMouse = function()
{
	var mouse = new THREE.Vector2((Mouse.position.x/Editor.canvas.width)*2 - 1, -(Mouse.position.y/Editor.canvas.height)*2 + 1);
	Editor.raycaster.setFromCamera(mouse, Editor.camera);
}

//Select objects with mouse
Editor.selectObjectWithMouse = function()
{
	Editor.updateRaycasterFromMouse();
	var intersects = Editor.raycaster.intersectObjects(Editor.program.scene.children, true);
	if(intersects.length > 0)
	{
		Editor.selectObject(intersects[0].object);
	}
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
	Editor.is_editing_object = false;
	
	if(Interface.panel !== null)
	{
		Interface.panel.destroy();
		Interface.panel = null;
	}
	
	Editor.selectTool(Editor.MODE_SELECT);
	Editor.selectObjectHelper();
}

//Craete new Program
Editor.createNewProgram = function()
{
	Editor.createDefaultResouces();

	//Create new program
	Editor.program = new Program();
	Editor.program.addDefaultScene(Editor.default_material);
	Editor.resetEditingFlags();

	//Reset open file
	Editor.setOpenFile(null);

	//Remove old tabs from interface
	if(Interface.tab !== undefined)
	{
		Interface.tab.clear();
		var scene = Interface.tab.addTab("scene", Interface.file_dir + "icons/tab/scene.png", true);
		var canvas = new SceneEditor(scene.element);
		canvas.setScene(Editor.program.scene);
		scene.attachComponent(canvas);
		Interface.tab.selectTab(0);
	}
}

//Save program to file
Editor.saveProgram = function(fname, compressed, keep_directory)
{
	if(fname === undefined && Editor.open_file !== null)
	{
		fname = Editor.open_file;
	}

	//If compressed dont store all resources
	if(compressed === true)
	{
		var json = JSON.stringify(Editor.program.toJSON());
	}
	else
	{
		var output = Editor.program.toJSON();
		var json = JSON.stringify(output, null, "\t").replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1");
	}

	var success = FileSystem.writeFile(fname, json);
	
	if(success){
		Editor.setOpenFile(success);
	}
	
	return success;
}

//Load program from file
Editor.loadProgram = function(file)
{	
	//Dipose old program
	if(Editor.program !== null)
	{
		Editor.program.dispose();
	}

	//Load program data file
	FileSystem.readFile(file,true,function ( event )
	{
		var data = JSON.parse( event.target.result );
		var loader = new ObjectLoader();
		var program = loader.parse(data);
		Editor.program = program;
		Editor.resetEditingFlags();

		//Remove old tabs from interface
		Interface.tab.clear();

		//Set open file
		Editor.setOpenFile(file.name.replace(/\..*$/,""));

		//Add new scene tab to interface
		if(Editor.program.scene !== null)
		{
			var scene = Interface.tab.addTab("scene", Interface.file_dir + "icons/tab/scene.png", true);
			var editor = new SceneEditor(scene.element);
			editor.setScene(Editor.program.scene);
			scene.attachComponent(editor);
			Interface.tab.selectTab(0);
		}
	});
}

Editor.project_extension = ".isp";

//Set currently open file (also updates the editor title)
Editor.setOpenFile = function(fname)
{
	Editor.open_file = (fname !== undefined) ? fname : null;

	if(fname === null)
	{
		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ")";
	}
	else
	{
		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ") ( " + fname + Editor.project_extension + " )";
	}
}

//Export web project
Editor.exportWebProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile("runtime/vr.png", dir + "\\vr.png");
	FileSystem.copyFile("runtime/fullscreen.png", dir + "\\fullscreen.png");
	FileSystem.copyFile("runtime/index.html", dir + "\\index.html");
	FileSystem.copyFile("../build/nunu.min.js", dir + "\\nunu.min.js");
	
	Editor.saveProgram(dir + "\\app.isp", true, true);
}

//Export windows project
Editor.exportWindowsProject = function(dir)
{
	Editor.exportWebProject(dir);
	FileSystem.copyFolder("..\\nwjs\\win", dir + "\\nwjs");
	FileSystem.writeFile(dir + "\\package.json", JSON.stringify({name: Editor.program.name,main: "index.html",window:{frame: true}}));
	FileSystem.writeFile(dir + "\\" + Editor.program.name + ".bat", "cd nwjs\nstart nw.exe ..");
}

//Export linux project
Editor.exportLinuxProject = function(dir)
{
	Editor.exportWebProject(dir);
	FileSystem.copyFolder("nwjs\\linux", dir + "\\nwjs");
	FileSystem.writeFile(dir + "\\package.json", JSON.stringify({name: Editor.program.name,main: "index.html",window:{frame: true}}));
	FileSystem.writeFile(dir + "\\" + Editor.program.name + ".sh", "cd nwjs\n./nw ..");
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
			tab.show_buttons_camera_mode = true;
			tab.updateInterface();
		}
	}
	else if(state === Editor.STATE_TESTING)
	{
		//Copy program
		Editor.program_running = Editor.program.clone();

		//Use editor camera as default camera for program
		Editor.program_running.default_camera = Editor.camera;
		Editor.program_running.setRenderer(Editor.renderer);

		//Initialize scene
		Editor.program_running.initialize();
		Editor.program_running.resize(Editor.canvas.width, Editor.canvas.height);

		//Show full screen and VR buttons
		var tab = Interface.tab.getActual();
		tab.show_buttons_fullscreen = true;
		tab.show_buttons_camera_mode = false;

		//If program uses VR set button
		if(Editor.program_running.vr)
		{
			if(Nunu.webvrAvailable())
			{
				//Show VR button
				tab.show_buttons_vr = true;

				//Create VR switch callback
				var vr = true;
				tab.vr_button.setCallback(function()
				{
					if(vr)
					{
						Editor.program_running.displayVR();
					}
					else
					{
						Editor.program_running.exitVR();
					}

					vr = !vr;
				});
			}
		}

		//Update tab to show buttons
		tab.updateInterface();

		//Set renderer size
		Editor.renderer.setViewport(0, 0, Editor.canvas.width, Editor.canvas.height);
		Editor.renderer.setScissor(0, 0, Editor.canvas.width, Editor.canvas.height);

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
	}

	//Unlock mouse
	Mouse.setLock(false);
}

//Set performance meter to be used
Editor.setPerformanceMeter = function(stats)
{
	Editor.stats = stats;
}

//Set render canvas
Editor.setRenderCanvas = function(canvas)
{
	Mouse.setCanvas(canvas);
	Editor.initializeRenderer(canvas);
}

//Initialize renderer
Editor.initializeRenderer = function(canvas)
{
	if(canvas === undefined)
	{
		canvas = Editor.canvas;
	}
	else
	{
		Editor.canvas = canvas;
	}

	//Get rendering quality settings
	var antialiasing = Settings.render.follow_project ? Editor.program.antialiasing : Settings.render.antialiasing;
	var shadows = Settings.render.follow_project ? Editor.program.shadows : Settings.render.shadows;
	var shadows_type = Settings.render.follow_project ? Editor.program.shadows_type : Settings.render.shadows_type;

	//Dispose old renderer
	if(Editor.renderer !== null)
	{
		Editor.renderer.dispose();
	}

	//Create renderer
	Editor.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: antialiasing});
	Editor.renderer.setSize(canvas.width, canvas.height);
	Editor.renderer.shadowMap.enabled = shadows;
	Editor.renderer.shadowMap.type = shadows_type;
	Editor.renderer.autoClear = false;

	//Get webgl context
	Editor.gl = Editor.renderer.context;
}

//Set fullscreen mode
Editor.setFullscreen = function(fullscreen, element)
{
	Editor.fullscreen = fullscreen;

	if(fullscreen)
	{
		if(element === undefined)
		{
			element = document.body;
		}
		
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
		
		if(element.requestFullscreen)
		{
			element.requestFullscreen();
		}
	}
	else
	{
		document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		
		if(document.exitFullscreen)
		{
			document.exitFullscreen();
		}
	}
}

//Exit editor
Editor.exit = function()
{
	Settings.store();

	if(Editor.gui !== undefined)
	{
		Editor.gui.App.closeAllWindows();
		Editor.gui.App.quit();
	}
}

//Include javacript or css file in project
function include(file, onload)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		if(onload)
		{
			js.onload = onload;
		}
		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild(css);
	}
	else if(file.endsWith("*"))
	{
		if(Editor.fs !== undefined)
		{
			var directory = file.replace("*", "");
			var files = Editor.fs.readdirSync(directory);
			for(var i = 0; i < files.length; i++)
			{
				include(directory + files[i]);
			}
		}
	}
	else
	{
		if(Editor.fs !== undefined)
		{
			var directory = file + "/";
			try
			{
				var files = Editor.fs.readdirSync(directory);
				for(var i = 0; i < files.length; i++)
				{
					include(directory + files[i]);
				}
			}
			catch(e){}
		}
	}
}
