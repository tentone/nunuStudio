"use strict";

function Editor(){}

//Node modules
try
{
	Editor.fs = require("fs");
	Editor.os = require("os");
	Editor.gui = require("nw.gui");
	
	Editor.clipboard = Editor.gui.Clipboard.get();
	Editor.args = Editor.gui.App.argv;
}
catch(e)
{
	Editor.args = [];
}

//Nunu global
include("Nunu.js");

//Runtime dependencies
include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");
include("lib/three/animation/Animation.js");
include("lib/three/animation/AnimationHandler.js");
include("lib/three/animation/KeyFrameAnimation.js");

include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");
include("lib/spine.min.js");
include("lib/opentype.min.js");

//Core runtime modules
include("core/Global.js");
include("core/FileSystem.js");

include("core/three/Object3D.js");
include("core/three/Vector3.js");
include("core/three/Vector2.js");
include("core/three/Texture.js");
include("core/three/LightShadow.js");
include("core/three/Fog.js");
include("core/three/Material.js");
include("core/three/MultiMaterial.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");

include("core/webvr/VRControls.js");

include("core/resources/Resource.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/resources/ResourceManager.js");

include("core/texture/Texture.js");
include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/CubeTexture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/MaterialLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/ObjectLoader.js");
include("core/loaders/TTFLoader.js");

include("core/objects/device/LeapMotion.js");
include("core/objects/device/KinectDevice.js");
include("core/objects/mesh/Mesh.js");
include("core/objects/mesh/SkinnedMesh.js");
include("core/objects/mesh/Text3D.js");
include("core/objects/sprite/Sprite.js");
include("core/objects/lights/PointLight.js");
include("core/objects/lights/SpotLight.js");
include("core/objects/lights/AmbientLight.js");
include("core/objects/lights/DirectionalLight.js");
include("core/objects/lights/HemisphereLight.js");
include("core/objects/lights/RectAreaLight.js");
include("core/objects/lights/Sky.js");
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");
include("core/objects/audio/AudioEmitter.js");
include("core/objects/audio/PositionalAudio.js");
include("core/objects/script/Script.js");
include("core/objects/physics/PhysicsObject.js");
include("core/objects/spine/SpineAnimation.js");
include("core/objects/spine/SpineTexture.js");
include("core/objects/particle/ParticleEmitter.js");
include("core/objects/animation/Bone.js");
include("core/objects/misc/Container.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/Base64Utils.js");
include("core/utils/ArraybufferUtils.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/BufferUtils.js");

//Codemirror
include("lib/codemirror/codemirror.min.js");
include("lib/codemirror/codemirror.css");
include("lib/codemirror/keymap/sublime.js");
include("lib/codemirror/keymap/emacs.js");
include("lib/codemirror/keymap/vim.js");
include("lib/codemirror/addon/edit/closebrackets.js");
include("lib/codemirror/addon/edit/matchbrackets.js");
include("lib/codemirror/addon/scroll/annotatescrollbar.js");
include("lib/codemirror/addon/search/search.js");
include("lib/codemirror/addon/search/searchcursor.js");
include("lib/codemirror/addon/search/jump-to-line.js");
include("lib/codemirror/addon/search/matchesonscrollbar.js");
include("lib/codemirror/addon/search/matchesonscrollbar.css");
include("lib/codemirror/addon/hint/show-hint.js");
include("lib/codemirror/addon/hint/show-hint.css");
include("lib/codemirror/addon/hint/anyword-hint.js");
include("lib/codemirror/addon/dialog/dialog.js");
include("lib/codemirror/addon/dialog/dialog.css");
include("lib/codemirror/addon/selection/active-line.js");
include("lib/codemirror/mode/javascript.js");
include("lib/codemirror/mode/glsl.js");
include("lib/codemirror/addon/lint/lint.css");
include("lib/codemirror/addon/lint/lint.js");
include("lib/codemirror/addon/lint/javascript-lint.js");
include("lib/codemirror/theme/*");

//Threejs
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/VRMLLoader.js");
include("lib/three/loaders/FBXLoader2.js");
include("lib/three/loaders/GLTFLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/PLYLoader.js");
include("lib/three/loaders/VTKLoader.js");
include("lib/three/loaders/AWDLoader.js");
include("lib/three/loaders/TGALoader.js");
include("lib/three/loaders/PCDLoader.js");

include("lib/jshint.min.js");
include("lib/jscolor.min.js");
include("lib/quickhull.js");

//Core modules
include("core/utils/Mesh2shape.js");

//Internal modules
include("editor/ui/element/Bar.js");
include("editor/ui/element/Button.js");
include("editor/ui/element/Text.js");
include("editor/ui/element/Division.js");
include("editor/ui/element/ImageBox.js");
include("editor/ui/element/DivisionResizable.js");
include("editor/ui/element/ButtonImage.js");
include("editor/ui/element/ButtonDrawer.js");
include("editor/ui/element/Canvas.js");
include("editor/ui/element/DualDivisionResizable.js");
include("editor/ui/element/ButtonImageToggle.js");
include("editor/ui/element/Form.js");
include("editor/ui/element/FormSeparator.js");
include("editor/ui/element/AudioPlayer.js");

include("editor/ui/element/input/Graph.js");
include("editor/ui/element/input/CodeEditor.js");
include("editor/ui/element/input/CheckBox.js");
include("editor/ui/element/input/TextBox.js");
include("editor/ui/element/input/TextArea.js");
include("editor/ui/element/input/ColorChooser.js");
include("editor/ui/element/input/Slider.js");
include("editor/ui/element/input/DropdownList.js");
include("editor/ui/element/input/NumberBox.js");
include("editor/ui/element/input/CoordinatesBox.js");
include("editor/ui/element/input/ImageChooser.js");
include("editor/ui/element/input/TextureChooser.js");
include("editor/ui/element/input/TextureBox.js");
include("editor/ui/element/input/CubeTextureBox.js");

include("editor/ui/DropdownMenu.js");
include("editor/ui/TreeView.js");
include("editor/ui/TreeElement.js");
include("editor/ui/ContextMenu.js");
include("editor/ui/AssetExplorer.js");
include("editor/ui/TabGroup.js");
include("editor/ui/TabElement.js");
include("editor/ui/TabButton.js");

include("editor/ui/asset/Asset.js");
include("editor/ui/asset/MaterialAsset.js");
include("editor/ui/asset/TextureAsset.js");
include("editor/ui/asset/FontAsset.js");
include("editor/ui/asset/AudioAsset.js");

include("editor/files/style/editor.css");
include("editor/ui/theme/Theme.js");
include("editor/ui/theme/ThemeDark.js");
include("editor/ui/theme/ThemeLight.js");

include("editor/ui/tab/ScriptEditor.js");
include("editor/ui/tab/SceneEditor.js");
include("editor/ui/tab/ParticleEditor.js");
include("editor/ui/tab/AboutTab.js");
include("editor/ui/tab/settings/SettingsTab.js");
include("editor/ui/tab/settings/CodeSettingsTab.js");
include("editor/ui/tab/settings/GeneralSettingsTab.js");
include("editor/ui/tab/material/MaterialEditor.js");
include("editor/ui/tab/material/PhongMaterialEditor.js");
include("editor/ui/tab/material/LambertMaterialEditor.js");
include("editor/ui/tab/material/BasicMaterialEditor.js");
include("editor/ui/tab/material/StandardMaterialEditor.js");
include("editor/ui/tab/material/SpriteMaterialEditor.js");
include("editor/ui/tab/material/ShaderMaterialEditor.js");
include("editor/ui/tab/material/PointMaterialEditor.js");
include("editor/ui/tab/texture/TextureEditor.js");
include("editor/ui/tab/texture/VideoTextureEditor.js");
include("editor/ui/tab/texture/CanvasTextureEditor.js");
include("editor/ui/tab/texture/CubeTextureEditor.js");

include("editor/ui/panels/Panel.js");
include("editor/ui/panels/ObjectPanel.js");
include("editor/ui/panels/ScenePanel.js");
include("editor/ui/panels/ProgramPanel.js");
include("editor/ui/panels/audio/AudioPanel.js");
include("editor/ui/panels/script/ScriptPanel.js");
include("editor/ui/panels/physics/PhysicsPanel.js");
include("editor/ui/panels/devices/LeapPanel.js");
include("editor/ui/panels/devices/KinectPanel.js");
include("editor/ui/panels/cameras/PerspectiveCameraPanel.js");
include("editor/ui/panels/cameras/OrthographicCameraPanel.js");
include("editor/ui/panels/lights/SkyPanel.js");
include("editor/ui/panels/lights/LightPanel.js");
include("editor/ui/panels/lights/RectAreaLightPanel.js");
include("editor/ui/panels/lights/HemisphereLightPanel.js");
include("editor/ui/panels/lights/PointLightPanel.js");
include("editor/ui/panels/lights/DirectionalLightPanel.js");
include("editor/ui/panels/lights/SpotLightPanel.js");
include("editor/ui/panels/mesh/MeshPanel.js");
include("editor/ui/panels/mesh/Text3DPanel.js");

include("editor/ui/panels/mesh/geometry/GeometryForm.js");
include("editor/ui/panels/mesh/geometry/BoxGeometryForm.js");
include("editor/ui/panels/mesh/geometry/SphereGeometryForm.js");
include("editor/ui/panels/mesh/geometry/TorusGeometryForm.js");
include("editor/ui/panels/mesh/geometry/PlaneGeometryForm.js");
include("editor/ui/panels/mesh/geometry/ConeGeometryForm.js");
include("editor/ui/panels/mesh/geometry/CylinderGeometryForm.js");
include("editor/ui/panels/mesh/geometry/TetrahedronGeometryForm.js");

include("editor/tools/TransformControls.js");
include("editor/tools/GizmoMaterial.js");
include("editor/tools/GizmoLineMaterial.js");
include("editor/tools/TransformGizmo.js");
include("editor/tools/TransformGizmoRotate.js");
include("editor/tools/TransformGizmoScale.js");
include("editor/tools/TransformGizmoTranslate.js");

include("editor/helpers/ParticleEmitterHelper.js");
include("editor/helpers/ObjectIconHelper.js");
include("editor/helpers/PhysicsObjectHelper.js");
include("editor/helpers/WireframeHelper.js");
include("editor/helpers/BoundingBoxHelper.js");
include("editor/helpers/GridHelper.js");
include("editor/helpers/RectAreaLightHelper.js");

include("editor/utils/FontRenderer.js");
include("editor/utils/MaterialRenderer.js");
include("editor/utils/ObjectIcons.js");

include("editor/history/History.js");
include("editor/history/Action.js");

include("editor/DragBuffer.js");
include("editor/Interface.js");
include("editor/Settings.js");

//Internal console
//include("editor/ui/tab/ConsoleTab.js");
//include("editor/Console.js");

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

	//Initialize input
	Editor.keyboard = new Keyboard();
	Editor.mouse = new Mouse();

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
	
	//Editor initial state
	Editor.toolMode = Editor.MODE_SELECT;
	Editor.state = Editor.STATE_EDITING;

	//Open file
	Editor.openFile = null;

	//Editor Selected object
	Editor.selectedObject = null;
	Editor.isEditingObject = false;

	//Performance meter
	Editor.stats = null;

	//Program
	Editor.program = null;
	Editor.programRunning = null;

	//History
	Editor.history = null;

	//Renderer and canvas
	Editor.renderer = null;
	Editor.canvas = null;
	Editor.gl = null;

	//Material renderer for material previews
	Editor.materialRenderer = new MaterialRenderer();
	Editor.fontRenderer = new FontRenderer();
	
	//Default resources
	Editor.createDefaultResouces();

	//Initialize User Interface
	Interface.initialize();

	//Debug Elements
	Editor.toolScene = new THREE.Scene();
	Editor.toolSceneTop = new THREE.Scene();

	//Raycaster
	Editor.raycaster = new THREE.Raycaster(); 

	//Grid and axis helpers
	Editor.gridHelper = new GridHelper(Settings.editor.gridSize, Settings.editor.gridSpacing, 0x888888);
	Editor.gridHelper.visible = Settings.editor.gridEnabled;
	Editor.toolScene.add(Editor.gridHelper);

	Editor.axisHelper = new THREE.AxisHelper(Settings.editor.gridSize);
	Editor.axisHelper.material.depthWrite = false;
	Editor.axisHelper.material.transparent = true;
	Editor.axisHelper.material.opacity = 1;
	Editor.axisHelper.visible = Settings.editor.axisEnabled;
	Editor.toolScene.add(Editor.axisHelper);

	//Object helper container
	Editor.objectHelper = new THREE.Scene();
	Editor.toolScene.add(Editor.objectHelper);

	//Tool container
	Editor.toolContainer = new THREE.Scene();
	Editor.toolSceneTop.add(Editor.toolContainer);
	Editor.tool = null;

	//Editor Camera
	Editor.cameraMode = Editor.CAMERA_PERSPECTIVE;
	Editor.cameraRotation = new THREE.Vector2(0, 0);
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
	Editor.mouse.update();
	Editor.keyboard.update();

	//End performance measure
	if(Editor.stats !== null)
	{
		Editor.stats.begin();
	}

	//Update editor interface
	Interface.update();
	Editor.isEditingObject = false;

	//If not on test mode
	if(Editor.state !== Editor.STATE_TESTING)
	{
		//Close tab, Save and load project
		if(Editor.keyboard.keyPressed(Keyboard.CTRL))
		{
			if(Editor.keyboard.keyJustPressed(Keyboard.S))
			{
				if(Editor.openFile === null)
				{
					Interface.saveProgram();
				}
				else
				{
					Editor.saveProgram(undefined, false);
				}
			}
			else if(Editor.keyboard.keyJustPressed(Keyboard.L))
			{
				Interface.loadProgram();
			}
			else if(Editor.keyboard.keyJustPressed(Keyboard.W) || Editor.keyboard.keyJustPressed(Keyboard.F4))
			{
				Interface.tab.closeActual();
			}
			else if(Editor.keyboard.keyJustPressed(Keyboard.TAB) || Editor.keyboard.keyJustPressed(Keyboard.PAGE_DOWN))
			{
				Interface.tab.selectNextTab();
			}
			else if(Editor.keyboard.keyJustPressed(Keyboard.PAGE_UP))
			{
				Interface.tab.selectPreviousTab();
			}
		}
	}

	//Editing a scene
	if(Editor.state === Editor.STATE_EDITING)
	{
		//Editor.keyboard shortcuts
		if(Editor.keyboard.keyJustPressed(Keyboard.DEL))
		{
			Editor.deleteObject();
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.F5))
		{
			Editor.setState(Editor.STATE_TESTING);
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.F2))
		{
			if(Editor.selectedObject !== null)
			{
				var name = prompt("Rename object", Editor.selectedObject.name);
				if(name !== null && name !== "")
				{
					Editor.selectedObject.name = name;
					Editor.updateObjectViews();
				}
			}
		}
		else if(Editor.keyboard.keyPressed(Keyboard.CTRL))
		{
			if(Interface.panel !== null && !Interface.panel.focused)
			{
				if(Editor.keyboard.keyJustPressed(Keyboard.C))
				{
					Editor.copyObject();
				}
				else if(Editor.keyboard.keyJustPressed(Keyboard.V))
				{
					Editor.pasteObject();
				}
				else if(Editor.keyboard.keyJustPressed(Keyboard.X))
				{
					Editor.cutObject();
				}
			}
			
			if(Editor.keyboard.keyJustPressed(Keyboard.Z))
			{
				Editor.undo();
			}
			/*else if(Editor.keyboard.keyJustPressed(Keyboard.Y))
			{
				Editor.redo();
			}*/
		}

		//Select objects
		if(Editor.toolMode === Editor.MODE_SELECT)
		{
			if(Editor.mouse.buttonJustPressed(Mouse.LEFT) && Editor.mouse.insideCanvas())
			{
				Editor.selectObjectWithMouse();
			}

			Editor.isEditingObject = false;
		}
		else
		{
			//If mouse double clicked select object
			if(Editor.mouse.buttonDoubleClicked() && Editor.mouse.insideCanvas())
			{
				Editor.selectObjectWithMouse();
			}

			//If no object selected update tool
			if(Editor.selectedObject !== null)
			{
				if(Editor.tool !== null)
				{
					Editor.isEditingObject = Editor.tool.update();
					
					if(Editor.mouse.buttonJustPressed(Mouse.LEFT) && Editor.isEditingObject)
					{
						Editor.history.push(Editor.selectedObject, Action.CHANGED);
					}

					if(Editor.isEditingObject)
					{
						Editor.updateObjectPanel();
					}
				}
				else
				{
					Editor.isEditingObject = false;
				}
			}
		}
		
		//Update object transformation matrix
		if(Editor.selectedObject !== null)
		{	
			if(!Editor.selectedObject.matrixAutoUpdate)
			{
				Editor.selectedObject.updateMatrix();
			}
		}

		//Update object helper
		Editor.objectHelper.update();

		//Check if mouse is inside canvas
		if(Editor.mouse.insideCanvas())
		{
			//Lock mouse when camera is moving
			if(Settings.editor.lockMouse)
			{
				if(!Editor.isEditingObject && (Editor.mouse.buttonJustPressed(Mouse.LEFT) || Editor.mouse.buttonJustPressed(Mouse.RIGHT) || Editor.mouse.buttonJustPressed(Mouse.MIDDLE)))
				{
					Editor.mouse.setLock(true);
				}
				else if(Editor.mouse.buttonJustReleased(Mouse.LEFT) || Editor.mouse.buttonJustReleased(Mouse.RIGHT) || Editor.mouse.buttonJustReleased(Mouse.MIDDLE))
				{
					Editor.mouse.setLock(false);
				}
			}

			//Orthographic camera (2D mode)
			if(Editor.cameraMode === Editor.CAMERA_ORTHOGRAPHIC)
			{
				//Move camera on y / x
				if(Editor.mouse.buttonPressed(Mouse.RIGHT))
				{
					var ratio = Editor.camera.size / Editor.canvas.width * 2;

					Editor.camera.position.x -= Editor.mouse.delta.x * ratio;
					Editor.camera.position.y += Editor.mouse.delta.y * ratio;
				}

				//Camera zoom
				if(Editor.mouse.wheel !== 0)
				{
					Editor.camera.size += Editor.mouse.wheel * Editor.camera.size / 1000;

					Editor.camera.updateProjectionMatrix();
				}
			}
			//Perpesctive camera
			else
			{
				//Look camera
				if(Editor.mouse.buttonPressed(Mouse.LEFT) && !Editor.isEditingObject)
				{
					Editor.cameraRotation.x -= 0.002 * Editor.mouse.delta.x;
					Editor.cameraRotation.y -= 0.002 * Editor.mouse.delta.y;

					//Limit Vertical Rotation to 90 degrees
					var pid2 = 1.57;
					if(Editor.cameraRotation.y < -pid2)
					{
						Editor.cameraRotation.y = -pid2;
					}
					else if(Editor.cameraRotation.y > pid2)
					{
						Editor.cameraRotation.y = pid2;
					}

					Editor.setCameraRotation(Editor.cameraRotation, Editor.camera);
				}

				//Move Camera on X and Z
				else if(Editor.mouse.buttonPressed(Mouse.RIGHT))
				{
					//Move speed
					var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0)) / 1000;
					if(speed < 0.02)
					{
						speed = 0.02;
					}

					//Move Camera Front and Back
					var angleCos = Math.cos(Editor.cameraRotation.x);
					var angleSin = Math.sin(Editor.cameraRotation.x);
					Editor.camera.position.z += Editor.mouse.delta.y * speed * angleCos;
					Editor.camera.position.x += Editor.mouse.delta.y * speed * angleSin;

					//Move Camera Lateral
					var angleCos = Math.cos(Editor.cameraRotation.x + MathUtils.pid2);
					var angleSin = Math.sin(Editor.cameraRotation.x + MathUtils.pid2);
					Editor.camera.position.z += Editor.mouse.delta.x * speed * angleCos;
					Editor.camera.position.x += Editor.mouse.delta.x * speed * angleSin;
				}
				
				//Move Camera on Y
				else if(Editor.mouse.buttonPressed(Mouse.MIDDLE))
				{
					Editor.camera.position.y += Editor.mouse.delta.y * 0.1;
				}

				//Move in camera direction using mouse scroll
				if(Editor.mouse.wheel !== 0)
				{
					//Move speed
					var speed = Editor.camera.position.distanceTo(new THREE.Vector3(0,0,0))/2000;
					speed *= Editor.mouse.wheel;

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
		Editor.programRunning.update();

		if(Editor.keyboard.keyJustPressed(Keyboard.F5))
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
		renderer.render(Editor.toolScene, Editor.camera);
		renderer.clearDepth();
		renderer.render(Editor.toolSceneTop, Editor.camera);

		//Render camera preview
		if(Settings.editor.cameraPreviewEnabled && (Editor.selectedObject instanceof THREE.Camera || Editor.program.scene.cameras.length > 0))
		{
			var width = Settings.editor.cameraPreviewPercentage * Editor.canvas.width;
			var height = Settings.editor.cameraPreviewPercentage * Editor.canvas.height;
			var offset = Editor.canvas.width - width - 10;

			renderer.setScissorTest(true);
			renderer.setViewport(offset, 10, width, height);
			renderer.setScissor(offset, 10, width, height);
			renderer.clear();

			//Preview selected camera
			if(Editor.selectedObject instanceof THREE.Camera)
			{
				var camera = Editor.selectedObject;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setViewport(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.setScissor(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);

				renderer.render(Editor.program.scene, camera);
			}
			//Preview all cameras in use
			else
			{
				var scene = Editor.program.scene;
				for(var i = 0; i < scene.cameras.length; i++)
				{
					var camera = scene.cameras[i];
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
					
					if(camera.clearColor)
					{
						renderer.clearColor();
					}
					if(camera.clearDepth)
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
		Editor.programRunning.render(renderer, Editor.canvas.width, Editor.canvas.height);
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
		Editor.selectedObject = object;

		Editor.selectObjectPanel();
		Editor.selectObjectHelper();

		if(Editor.tool !== null)
		{
			Editor.tool.detach();
			Editor.tool.attach(object);
		}
		else
		{
			Editor.selectTool(Editor.toolMode);
		}
	}
	else
	{
		Editor.selectedObject = null;
		Editor.resetEditingFlags();
	}
}

//Check if object is selected
Editor.isObjectSelected = function(obj)
{
	if(Editor.selectedObject !== null)
	{
		return Editor.selectedObject.uuid === obj.uuid;
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
		obj = Editor.selectedObject;
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
	//If no object passed copy selected object
	else if(Editor.selectedObject !== null && !(Editor.selectedObject instanceof Program || Editor.selectedObject instanceof Scene))
	{
		if(Editor.clipboard !== undefined)
		{
			Editor.clipboard.set(JSON.stringify(Editor.selectedObject.toJSON()), "text");
		}
	}
}

//Cut selected object
Editor.cutObject = function(obj)
{
	if(obj === undefined)
	{
		if(Editor.selectedObject !== null && !(Editor.selectedObject instanceof Program || Editor.selectedObject instanceof Scene))
		{
			obj = Editor.selectedObject;
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
			if(action.object.uuid === Editor.selectedObject.uuid)
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
var treeDelta, assetDelta, tabsDelta, panelDelta;

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
	//var delta = Date.now() - start;
	//console.log("Update " + (update++) + " ObjectView: " + delta + "ms");
	//console.log("    Treeview " + treeDelta + "ms");
	//console.log("    Panel " + panelDelta + "ms");
	//console.log("    Tabs " + tabsDelta + "ms");
	//console.log("    Assets " + assetDelta + "ms\n\n");
}

//Update tab names to match objects actual info
Editor.updateTabsData = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	Interface.tab.updateMetadata();

	//TODO <REMOVE TEST CODE>
	tabsDelta = Date.now() - start;
}

//Update tree view to match actual scene
Editor.updateTreeView = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	Interface.treeView.attachObject(Editor.program);
	Interface.treeView.updateView();
	
	//TODO <REMOVE TEST CODE>
	treeDelta = Date.now() - start;
}

//Update assets explorer content
Editor.updateAssetExplorer = function()
{
	//TODO <REMOVE TEST CODE>
	var start = Date.now();

	//Clean asset explorer
	Interface.assetExplorer.clear();
	
	//Materials
	var materials = ObjectUtils.getMaterials(Editor.program, Editor.program.materials);
	for(var i in materials)
	{
		var file = new MaterialAsset(Interface.assetExplorer.element);
		file.setMaterial(materials[i]);
		Interface.assetExplorer.add(file);
	}

	//Textures
	var textures = ObjectUtils.getTextures(Editor.program, Editor.program.textures);
	for(var i in textures)
	{
		var file = new TextureAsset(Interface.assetExplorer.element);
		file.setTexture(textures[i]);
		Interface.assetExplorer.add(file);
	}

	//Fonts
	var fonts = ObjectUtils.getFonts(Editor.program, Editor.program.fonts);
	for(var i in fonts)
	{
		var file = new FontAsset(Interface.assetExplorer.element);
		file.setFont(fonts[i]);
		Interface.assetExplorer.add(file);
	}

	//Audio
	var audio = ObjectUtils.getAudio(Editor.program, Editor.program.audio);
	for(var i in audio)
	{
		var file = new AudioAsset(Interface.assetExplorer.element);
		file.setAudio(audio[i]);
		Interface.assetExplorer.add(file);
	}

	Interface.assetExplorer.updateInterface();

	//TODO <REMOVE TEST CODE>
	assetDelta = Date.now() - start;
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
	panelDelta = Date.now() - start;
}

//Create default resouces to be used when creating new objects
Editor.createDefaultResouces = function()
{
	Editor.defaultImage = new Image("editor/files/default.png");
	Editor.defaultFont = new Font("editor/files/default.json");
	Editor.defaultAudio = new Audio("editor/files/default.mp3");

	Editor.defaultTexture = new Texture(Editor.defaultImage);
	Editor.defaultTexture.name = "default";

	Editor.defaultTextureParticle = new Texture(new Image("editor/files/particle.png"));
	Editor.defaultTextureParticle.name = "particle";

	Editor.defaultMaterial = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
	Editor.defaultMaterial.name = "default";
	
	Editor.defaultSpriteMaterial = new THREE.SpriteMaterial({map: Editor.defaultTexture, color: 0xffffff});
	Editor.defaultSpriteMaterial.name = "default";
}

//Select tool to manipulate objects
Editor.selectTool = function(tool)
{
	Editor.toolMode = tool;
	Editor.toolContainer.removeAll();
	
	if(Editor.tool !== null)
	{
		Editor.tool.dispose();	
	}

	Interface.selectTool(tool);

	if(Editor.selectedObject !== null && tool !== Editor.MODE_SELECT)
	{
		if(tool === Editor.MODE_MOVE)
		{
			Editor.tool = new TransformControls();
			Editor.tool.setMode("translate");
			Editor.tool.setSpace(Settings.editor.transformationSpace);
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
			Editor.tool.setSpace(Settings.editor.transformationSpace);
		}
		
		Editor.tool.attach(Editor.selectedObject);
		Editor.toolContainer.add(Editor.tool);
	}
	else
	{
		Editor.tool = null;
	}
}

//Update UI panel to match selected object
Editor.selectObjectPanel = function()
{
	Interface.treeView.updateSelectedObject(Editor.selectedObject);

	if(Interface.panel !== null)
	{
		Interface.panel.destroy();
	}

	if(Editor.selectedObject !== null)
	{
		if(Editor.selectedObject instanceof THREE.Mesh)
		{
			if(Editor.selectedObject instanceof Text3D)
			{
				Interface.panel = new Text3DPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else
			{
				Interface.panel = new MeshPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
		}
		else if(Editor.selectedObject instanceof THREE.Light)
		{
			if(Editor.selectedObject instanceof THREE.PointLight)
			{
				Interface.panel = new PointLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else if(Editor.selectedObject instanceof THREE.RectAreaLight)
			{
				Interface.panel = new RectAreaLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else if(Editor.selectedObject instanceof THREE.SpotLight)
			{
				Interface.panel = new SpotLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else if(Editor.selectedObject instanceof THREE.DirectionalLight)
			{
				Interface.panel = new DirectionalLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else if(Editor.selectedObject instanceof THREE.HemisphereLight)
			{
				Interface.panel = new HemisphereLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
			else
			{
				Interface.panel = new LightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
			}
		}
		else if(Editor.selectedObject instanceof Sky)
		{
			Interface.panel = new SkyPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof LeapMotion)
		{
			Interface.panel = new LeapPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof KinectDevice)
		{
			Interface.panel = new KinectPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof Script)
		{
			Interface.panel = new ScriptPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof PerspectiveCamera)
		{
			Interface.panel = new PerspectiveCameraPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof OrthographicCamera)
		{
			Interface.panel = new OrthographicCameraPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof THREE.Audio)
		{
			Interface.panel = new AudioPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof Scene)
		{
			Interface.panel = new ScenePanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof Program)
		{
			Interface.panel = new ProgramPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else if(Editor.selectedObject instanceof PhysicsObject)
		{
			Interface.panel = new PhysicsPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}
		else
		{
			Interface.panel = new ObjectPanel(Interface.explorerResizable.divB, Editor.selectedObject);
		}

		Interface.panel.updatePanel();
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
	Editor.objectHelper.removeAll();

	if(Editor.selectedObject !== null)
	{
		//Camera
		if(Editor.selectedObject instanceof THREE.Camera)
		{
			Editor.objectHelper.add(new THREE.CameraHelper(Editor.selectedObject));
			Editor.objectHelper.add(new ObjectIconHelper(Editor.selectedObject, Interface.fileDir + "icons/camera/camera.png"));
		}
		//Light
		else if(Editor.selectedObject instanceof THREE.Light)
		{
			//Directional light
			if(Editor.selectedObject instanceof THREE.DirectionalLight)
			{
				Editor.objectHelper.add(new THREE.DirectionalLightHelper(Editor.selectedObject, 1));
			}
			//Point light
			else if(Editor.selectedObject instanceof THREE.PointLight)
			{
				Editor.objectHelper.add(new THREE.PointLightHelper(Editor.selectedObject, 1));
			}
			//RectArea light
			else if(Editor.selectedObject instanceof THREE.RectAreaLight)
			{
				Editor.objectHelper.add(new RectAreaLightHelper(Editor.selectedObject));
			}
			//Spot light
			else if(Editor.selectedObject instanceof THREE.SpotLight)
			{
				Editor.objectHelper.add(new THREE.SpotLightHelper(Editor.selectedObject));
			}
			//Hemisphere light
			else if(Editor.selectedObject instanceof THREE.HemisphereLight)
			{
				Editor.objectHelper.add(new THREE.HemisphereLightHelper(Editor.selectedObject, 1));
			}
		}
		//Particle
		else if(Editor.selectedObject instanceof ParticleEmitter)
		{
			Editor.objectHelper.add(new ParticleEmitterHelper(Editor.selectedObject));
		}
		//Physics
		else if(Editor.selectedObject instanceof PhysicsObject)
		{
			Editor.objectHelper.add(new PhysicsObjectHelper(Editor.selectedObject));
		}
		//Script or Audio
		else if(Editor.selectedObject instanceof Script || Editor.selectedObject instanceof THREE.Audio)
		{
			Editor.objectHelper.add(new ObjectIconHelper(Editor.selectedObject, ObjectIcons.get(Editor.selectedObject.type)));
		}
		//Animated Mesh
		else if(Editor.selectedObject instanceof THREE.SkinnedMesh)
		{
			Editor.objectHelper.add(new WireframeHelper(Editor.selectedObject, 0xFFFF00));
			Editor.objectHelper.add(new THREE.SkeletonHelper(Editor.selectedObject));
		}
		//Mesh
		else if(Editor.selectedObject instanceof THREE.Mesh)
		{
			Editor.objectHelper.add(new WireframeHelper(Editor.selectedObject, 0xFFFF00));
		}
		//Object 3D
		else if(Editor.selectedObject instanceof THREE.Object3D)
		{
			Editor.objectHelper.add(new BoundingBoxHelper(Editor.selectedObject, 0xFFFF00));
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
			Editor.programRunning.resize(Editor.canvas.width, Editor.canvas.height);
		}
	}
}

//Set camera mode (ortho or perspective)
Editor.setCameraMode = function(mode)
{
	if(mode === undefined)
	{
		mode = (Editor.cameraMode === Editor.CAMERA_PERSPECTIVE) ? Editor.CAMERA_ORTHOGRAPHIC : Editor.CAMERA_PERSPECTIVE;
	}
	
	var aspect = (Editor.canvas !== null) ? Editor.canvas.width/Editor.canvas.height : 1.0;

	if(mode === Editor.CAMERA_ORTHOGRAPHIC)
	{
		Editor.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL);
		Editor.camera.position.set(0, 0, 20);
		Editor.gridHelper.rotation.x = Math.PI / 2;
	}
	else if(mode === Editor.CAMERA_PERSPECTIVE)
	{
		Editor.camera = new PerspectiveCamera(60, aspect);
		Editor.camera.position.set(0, 3, 5);
		Editor.cameraRotation.set(3.14, 0);
		Editor.gridHelper.rotation.x = 0;
		Editor.setCameraRotation(Editor.cameraRotation, Editor.camera);
	}

	Editor.cameraMode = mode;
	Editor.selectTool(Editor.toolMode);
}

//Set camera rotation
Editor.setCameraRotation = function(cameraRotation, camera)
{
	//Calculate direction vector
	var cosAngleY = Math.cos(cameraRotation.y);
	var direction = new THREE.Vector3(Math.sin(cameraRotation.x)*cosAngleY, Math.sin(cameraRotation.y), Math.cos(cameraRotation.x)*cosAngleY);

	//Add position offset and set camera direction
	direction.add(camera.position);
	camera.lookAt(direction);
}

//Update raycaster position from editor mouse position
Editor.updateRaycasterFromMouse = function()
{
	var mouse = new THREE.Vector2((Editor.mouse.position.x/Editor.canvas.width)*2 - 1, -(Editor.mouse.position.y/Editor.canvas.height)*2 + 1);
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
	Editor.selectedObject = null;
	Editor.isEditingObject = false;
	
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
	Editor.program.addDefaultScene(Editor.defaultMaterial);

	//History
	Editor.history = new History(Editor.program);

	//Reset open file
	Editor.setOpenFile(null);
	Editor.resetEditingFlags();

	//Remove old tabs from interface
	if(Interface.tab !== undefined)
	{
		Interface.tab.clear();
		var scene = Interface.tab.addTab(SceneEditor, true);
		scene.attach(Editor.program.scene);
		Interface.tab.selectTab(0);
	}
}

//Save program to file
Editor.saveProgram = function(fname, compressed, keepDirectory)
{
	if(fname === undefined && Editor.openFile !== null)
	{
		fname = Editor.openFile;
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

	FileSystem.writeFile(fname, json);

	if(keepDirectory !== true && Editor.openFile !== fname)
	{
		Editor.setOpenFile(fname);
	}
}

//Load program from file
Editor.loadProgram = function(fname)
{	
	//Dipose old program
	if(Editor.program !== null)
	{
		Editor.program.dispose();
	}

	//Load program data file
	var loader = new ObjectLoader();
	var data = JSON.parse(FileSystem.readFile(fname));
	Editor.program = loader.parse(data);
	
	//History
	Editor.history = new History(Editor.program);

	//Remove old tabs
	Interface.tab.clear();

	//Set open file
	Editor.setOpenFile(fname);
	Editor.resetEditingFlags();

	//Add new scene tab to interface
	if(Editor.program.scene !== null)
	{
		var scene = Interface.tab.addTab(SceneEditor, true);
		scene.attach(Editor.program.scene);
		Interface.tab.selectTab(0);
	}
}

//Set currently open file (also updates the editor title)
Editor.setOpenFile = function(fname)
{
	Editor.openFile = (fname !== undefined) ? fname : null;

	if(fname === null)
	{
		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ")";
	}
	else
	{
		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ") (" + fname + ")";
	}
}

//Export web project
Editor.exportWebProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile("runtime/vr.png", dir + "\\vr.png");
	FileSystem.copyFile("runtime/fullscreen.png", dir + "\\fullscreen.png");
	FileSystem.copyFile("runtime/logo.png", dir + "\\logo.png");
	FileSystem.copyFile("runtime/index.html", dir + "\\index.html");
	//FileSystem.copyFile("lib/webvr-polyfill.min.js", dir + "\\webvr-polyfill.min.js");
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
			tab.showButtonsFullscreen = false;
			tab.showButtonsVr = false;
			tab.showButtonsCameraMode = true;
			tab.updateInterface();
		}
	}
	else if(state === Editor.STATE_TESTING)
	{
		//Copy program
		Editor.programRunning = Editor.program.clone();

		//Use editor camera as default camera for program
		Editor.programRunning.defaultCamera = Editor.camera;
		Editor.programRunning.setRenderer(Editor.renderer);

		//Initialize scene
		Editor.programRunning.setMouseKeyboard(Editor.mouse, Editor.keyboard);
		Editor.programRunning.initialize();
		Editor.programRunning.resize(Editor.canvas.width, Editor.canvas.height);

		//Show full screen and VR buttons
		var tab = Interface.tab.getActual();
		tab.showButtonsFullscreen = true;
		tab.showButtonsCameraMode = false;

		//If program uses VR set button
		if(Editor.programRunning.vr)
		{
			if(Nunu.webvrAvailable())
			{
				//Show VR button
				tab.showButtonsVr = true;

				//Create VR switch callback
				var vr = true;
				tab.vrButton.setCallback(function()
				{
					if(vr)
					{
						Editor.programRunning.displayVR();
					}
					else
					{
						Editor.programRunning.exitVR();
					}

					vr = !vr;
				});
			}
		}

		//Lock mouse pointer
		if(Editor.programRunning.lockPointer)
		{
			Editor.mouse.setLock(true);
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
	if(Editor.programRunning !== null)
	{
		Editor.programRunning.dispose();
		Editor.programRunning = null;
	}

	//Unlock mouse
	Editor.mouse.setLock(false);
}

//Set performance meter to be used
Editor.setPerformanceMeter = function(stats)
{
	Editor.stats = stats;
}

//Set render canvas
Editor.setRenderCanvas = function(canvas)
{
	Editor.mouse.setCanvas(canvas);
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
	var antialiasing = Settings.render.followProject ? Editor.program.antialiasing : Settings.render.antialiasing;
	var shadows = Settings.render.followProject ? Editor.program.shadows : Settings.render.shadows;
	var shadowsType = Settings.render.followProject ? Editor.program.shadowsType : Settings.render.shadowsType;

	//Dispose old renderer
	if(Editor.renderer !== null)
	{
		Editor.renderer.dispose();
	}

	//Create renderer
	Editor.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: antialiasing});
	Editor.renderer.setSize(canvas.width, canvas.height);
	Editor.renderer.shadowMap.enabled = shadows;
	Editor.renderer.shadowMap.type = shadowsType;
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
