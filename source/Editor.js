"use strict";

function Editor(){}

Editor.filePath = "editor/files/";
Editor.runtimePath = "runtime/";
Editor.NWJSPath = "../nwjs/";

//Runtime
include("Nunu.js");

include("lib/three/three.js");

include("lib/three/effects/VREffect.js");

include("lib/three/shaders/CopyShader.js");
include("lib/three/shaders/BokehShader.js");
include("lib/three/shaders/SAOShader.js");
include("lib/three/shaders/DepthLimitedBlurShader.js");
include("lib/three/shaders/UnpackDepthRGBAShader.js");
include("lib/three/shaders/ConvolutionShader.js");
include("lib/three/shaders/LuminosityHighPassShader.js");
include("lib/three/shaders/FXAAShader.js");
include("lib/three/shaders/SSAOShader.js");

include("lib/three/postprocessing/EffectComposer.js");
include("lib/three/postprocessing/RenderPass.js");
include("lib/three/postprocessing/ShaderPass.js");
include("lib/three/postprocessing/MaskPass.js");
include("lib/three/postprocessing/BokehPass.js");
include("lib/three/postprocessing/SAOPass.js");
include("lib/three/postprocessing/UnrealBloomPass.js");
include("lib/three/postprocessing/SSAOPass.js");

include("lib/three/curves/NURBSCurve.js");
include("lib/three/curves/NURBSSurface.js");
include("lib/three/curves/NURBSUtils.js");

include("lib/aruco.js");
include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");

include("lib/bytebuffer.min.js");
include("lib/long.min.js");
include("lib/PSON.min.js");

include("core/Global.js");
include("core/FileSystem.js");

include("core/three/core/Object3D.js");
include("core/three/core/BufferGeometry.js");
include("core/three/cameras/Camera.js");
include("core/three/materials/Material.js");
include("core/three/materials/MultiMaterial.js");
include("core/three/loaders/BufferGeometryLoader.js");
include("core/three/math/Vector3.js");
include("core/three/textures/Texture.js");
include("core/three/lights/LightShadow.js");
include("core/three/scenes/Fog.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");
include("core/input/Gamepad.js");
include("core/input/Gyroscope.js");

include("core/postprocessing/EffectComposer.js");

include("core/controls/VRControls.js");

include("core/resources/Resource.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/resources/Model.js");
include("core/resources/ResourceManager.js");

include("core/texture/Texture.js");
include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/CubeTexture.js");
include("core/texture/SpriteSheetTexture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/MaterialLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/ObjectLoader.js");
include("core/loaders/external/TTFLoader.js");

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
include("core/objects/misc/Container.js");
include("core/objects/misc/CubeCamera.js");
include("core/objects/misc/LensFlare.js");
include("core/objects/animation/Skeleton.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/binary/Base64Utils.js");
include("core/utils/binary/ArraybufferUtils.js");
include("core/utils/binary/BufferUtils.js");

include("core/utils/EventManager.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/Mesh2shape.js");

//Editor
include("core/loaders/external/TDSLoader.js");

include("lib/codemirror/codemirror.js");
include("lib/codemirror/codemirror.css");
include("lib/codemirror/keymap/sublime.js");
include("lib/codemirror/keymap/emacs.js");
include("lib/codemirror/keymap/vim.js");
include("lib/codemirror/mode/javascript.js");
include("lib/codemirror/mode/glsl.js");
include("lib/codemirror/addon/edit/closebrackets.js");
include("lib/codemirror/addon/edit/matchbrackets.js");
include("lib/codemirror/addon/scroll/annotatescrollbar.js");
include("lib/codemirror/addon/search/search.js");
include("lib/codemirror/addon/search/searchcursor.js");
include("lib/codemirror/addon/search/jump-to-line.js");
include("lib/codemirror/addon/search/match-highlighter.js");
include("lib/codemirror/addon/search/matchesonscrollbar.js");
include("lib/codemirror/addon/search/matchesonscrollbar.css");
include("lib/codemirror/addon/hint/show-hint.js");
include("lib/codemirror/addon/hint/show-hint.css");
include("lib/codemirror/addon/hint/anyword-hint.js");
include("lib/codemirror/addon/dialog/dialog.js");
include("lib/codemirror/addon/dialog/dialog.css");
include("lib/codemirror/addon/selection/mark-selection.js");
include("lib/codemirror/addon/selection/active-line.js");
include("lib/codemirror/addon/selection/selection-pointer.js");
include("lib/codemirror/addon/lint/lint.css");
include("lib/codemirror/addon/lint/lint.js");
include("lib/codemirror/addon/lint/javascript-lint.js");
include("lib/codemirror/addon/tern/tern.js");
include("lib/codemirror/addon/tern/tern.css");
include("lib/codemirror/theme/*");

include("lib/acorn/acorn.js");
include("lib/acorn/acorn_loose.js");
include("lib/acorn/walk.js");

include("lib/tern/signal.js");
include("lib/tern/tern.js");
include("lib/tern/def.js");
include("lib/tern/comment.js");
include("lib/tern/infer.js");
include("lib/tern/plugin/doc_comment.js");

include("lib/three/loaders/3MFLoader.js");
include("lib/three/loaders/AWDLoader.js");
include("lib/three/loaders/ColladaLoader2.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/GLTFLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/OBJLoader2.js");
include("lib/three/loaders/PCDLoader.js");
include("lib/three/loaders/PLYLoader.js");
include("lib/three/loaders/STLLoader.js");
include("lib/three/loaders/SVGLoader.js");
include("lib/three/loaders/TGALoader.js");
include("lib/three/loaders/VRMLLoader.js");
include("lib/three/loaders/VTKLoader.js");

include("lib/three/exporters/OBJExporter.js");
include("lib/three/exporters/STLExporter.js");
include("lib/three/exporters/STLBinaryExporter.js");
include("lib/three/exporters/GLTFExporter.js");

include("lib/zlib.min.js");
include("lib/jscookie.min.js");
include("lib/jshint.min.js");
include("lib/jscolor.min.js");
include("lib/jszip.min.js");
include("lib/quickhull.js");
include("lib/ThreeCSG.js");

include("editor/style.css");

include("editor/theme/Theme.js");
include("editor/theme/ThemeDark.js");

include("editor/ui/element/Message.js");
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
include("editor/ui/TabGroup.js");
include("editor/ui/TabElement.js");
include("editor/ui/TabButton.js");

include("editor/ui/preview/TexturePreview.js");
include("editor/ui/preview/MaterialPreview.js");
include("editor/ui/preview/renderer/FontRenderer.js");
include("editor/ui/preview/renderer/MaterialRenderer.js");

include("editor/ui/asset/Asset.js");
include("editor/ui/asset/MaterialAsset.js");
include("editor/ui/asset/TextureAsset.js");
include("editor/ui/asset/FontAsset.js");
include("editor/ui/asset/AudioAsset.js");

include("editor/ui/tab/ConsoleTab.js");
include("editor/ui/tab/AssetExplorer.js");
include("editor/ui/tab/ScriptEditor.js");
include("editor/ui/tab/SceneEditor.js");
include("editor/ui/tab/ParticleEditor.js");
include("editor/ui/tab/AboutTab.js");
include("editor/ui/tab/CameraEditor.js");
include("editor/ui/tab/CubeTextureEditor.js");

include("editor/ui/tab/settings/SettingsTab.js");
include("editor/ui/tab/settings/CodeSettingsTab.js");
include("editor/ui/tab/settings/GeneralSettingsTab.js");
include("editor/ui/tab/settings/RenderSettingsTab.js");
include("editor/ui/tab/settings/JSHintSettingsTab.js");

include("editor/ui/tab/material/MaterialEditor.js");
include("editor/ui/tab/material/PointsMaterialEditor.js");
include("editor/ui/tab/material/ShaderMaterialEditor.js");
include("editor/ui/tab/material/SpriteMaterialEditor.js");
include("editor/ui/tab/material/line/LineBasicMaterialEditor.js");
include("editor/ui/tab/material/line/LineDashedMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshPhongMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshLambertMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshBasicMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshStandardMaterialEditor.js");
include("editor/ui/tab/material/mesh/MeshPhysicalMaterialEditor.js");

include("editor/ui/tab/texture/TextureEditor.js");
include("editor/ui/tab/texture/VideoTextureEditor.js");
include("editor/ui/tab/texture/CanvasTextureEditor.js");
include("editor/ui/tab/texture/SpriteSheetTextureEditor.js");

include("editor/ui/panels/Panel.js");
include("editor/ui/panels/ObjectPanel.js");
include("editor/ui/panels/ScenePanel.js");
include("editor/ui/panels/ProgramPanel.js");
include("editor/ui/panels/audio/AudioPanel.js");
include("editor/ui/panels/physics/PhysicsPanel.js");
include("editor/ui/panels/devices/LeapPanel.js");
include("editor/ui/panels/devices/KinectPanel.js");
include("editor/ui/panels/cameras/PerspectiveCameraPanel.js");
include("editor/ui/panels/cameras/OrthographicCameraPanel.js");
include("editor/ui/panels/lights/SkyPanel.js");
include("editor/ui/panels/lights/AmbientLightPanel.js");
include("editor/ui/panels/lights/RectAreaLightPanel.js");
include("editor/ui/panels/lights/HemisphereLightPanel.js");
include("editor/ui/panels/lights/PointLightPanel.js");
include("editor/ui/panels/lights/DirectionalLightPanel.js");
include("editor/ui/panels/lights/SpotLightPanel.js");
include("editor/ui/panels/misc/CubeCameraPanel.js");
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
include("editor/ui/panels/mesh/geometry/CircleGeometryForm.js");

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
include("editor/helpers/SkinnedWireframeHelper.js");
include("editor/helpers/BoundingBoxHelper.js");
include("editor/helpers/GridHelper.js");
include("editor/helpers/RectAreaLightHelper.js");
include("editor/helpers/SkeletonHelper.js");

include("editor/utils/ObjectIcons.js");
include("editor/utils/CodemirrorThemes.js");

include("editor/history/History.js");
include("editor/history/Action.js");

include("editor/Console.js");
include("editor/Clipboard.js");
include("editor/DragBuffer.js");
include("editor/Interface.js");
include("editor/Settings.js");

Editor.SELECT = 0;
Editor.MOVE = 1;
Editor.SCALE = 2;
Editor.ROTATE = 3;

//Initialize
Editor.initialize = function()
{
	try
	{	
		Editor.gui = require("nw.gui");	
		Editor.clipboard = Editor.gui.Clipboard.get();
		Editor.args = Editor.gui.App.argv;
	}
	catch(e)
	{
		Editor.clipboard = new Clipboard();
		Editor.args = [];

		var parameters = location.search.substring(1).split("&");
		for(var i = 0; i < parameters.length; i++)
		{
			var entry = parameters[i].split("=")[1];
			if(entry !== undefined)
			{
				entry = unescape(entry);
				entry = entry.replace(new RegExp("\"", "g"), "");
				Editor.args.push(entry);
			}
		}
	}

	//Check WebGL Support
	if(!Nunu.webglAvailable())
	{
		Editor.alert("WebGL is not supported or is disabled!\nnunuStudio cannot run!");
		Editor.exit();
	}
	
	//Load settings
	Settings.load();

	//Register tern plugins
	Editor.ternDefinitions = [];
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Editor.filePath + "tern/threejs.json")));
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Editor.filePath + "tern/browser.json")));
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Editor.filePath + "tern/ecmascript.json")));

	//Disable body overflow
	document.body.style.overflow = "hidden";
	
	//Disable context menu
	document.body.oncontextmenu = function(event)
	{
		return false;
	};

	if(Nunu.runningOnDesktop())
	{
		//Handle window close event
		Editor.gui.Window.get().on("close", function()
		{
			if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		});

		//Try to update the editor
		if(Settings.general.autoUpdate)
		{
			Editor.updateNunu();
		}
	}
	else
	{
		//Prevent some key combinations
		var allowedKeys = [67, 86, 65, 88];
		document.onkeydown = function(event)
		{
			//If F1-F12 or CTRL+Key prevent default
			if((event.keyCode > 112 && event.keyCode < 122) || (!event.altKey && event.ctrlKey && allowedKeys.indexOf(event.keyCode) === -1))
			{
				event.preventDefault();
			}
		};

		//Store settings when exiting the page
		window.onbeforeunload = function(event)
		{
			Settings.store();

			var message = "All unsaved changes to the project will be lost! Do you really wanna exit?";

			event.returnValue = message;

			return message;	
		};
	}

	//Open ISP file if dragged to the window
	document.body.ondrop = function(event)
	{
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];

			//Open project
			if(file.name.endsWith(".isp") || file.name.endsWith(".nsp"))
			{
				if(confirm("All unsaved changes to the project will be lost! Load file?"))
				{
					Editor.loadProgram(file, file.name.endsWith(".nsp"));
					Editor.resetEditingFlags();
					Editor.updateObjectViews();
				}
			}
		}
	}
	
	//Fullscreen
	Editor.fullscreen = false;

	//Input
	Editor.keyboard = new Keyboard();
	Editor.mouse = new Mouse();

	//Load theme
	Editor.theme = Theme.get(Settings.general.theme);

	//Open file
	Editor.openFile = null;

	//Selected object
	Editor.selectedObjects = [];

	//Program
	Editor.program = null;

	//History
	Editor.history = null;

	//Default resources
	Editor.createDefaultResouces();

	//Initialize User Interface
	Interface.initialize();
	
	//Check is some .isp file passed as argument
	for(var i = 0; i < Editor.args.length; i++)
	{
		if(Editor.args[i].endsWith(".isp"))
		{
			Editor.loadProgram(Editor.args[i], false);
			break;
		}
		else if(Editor.args[i].endsWith(".nsp"))
		{
			Editor.loadProgram(Editor.args[i], true);
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
};

//Update Editor
Editor.update = function()
{
	//Update input
	Editor.mouse.update();
	Editor.keyboard.update();

	//Keyboard shortcuts
	if(Editor.keyboard.keyPressed(Keyboard.CTRL))
	{
		if(Editor.keyboard.keyJustPressed(Keyboard.NUM1))
		{
			Interface.selectTool(Editor.SELECT);
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.NUM2))
		{
			Interface.selectTool(Editor.MOVE);
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.NUM3))
		{
			Interface.selectTool(Editor.SCALE);
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.NUM4))
		{
			Interface.selectTool(Editor.ROTATE);
		}
		else if(Editor.keyboard.keyJustPressed(Keyboard.S))
		{
			if(Editor.openFile === null)
			{
				Interface.saveProgram();
			}
			else
			{
				Editor.saveProgram(undefined, true);
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
	else if(Editor.keyboard.keyJustPressed(Keyboard.F2))
	{
		Editor.renameObject();
	}

	requestAnimationFrame(Editor.update);
};

//Resize to fit window
Editor.resize = function()
{
	if(!Editor.fullscreen)
	{
		Interface.updateInterface();
	}
};

//Select a single object
Editor.selectObject = function(object)
{
	if(object instanceof THREE.Object3D)
	{
		Editor.clearSelection();

		Editor.selectedObjects[0] = object;

		Editor.selectObjectPanel();
		Editor.selectObjectHelper();
		Editor.selectTool();
	}
	else
	{
		Editor.clearSelection();
		Editor.resetEditingFlags();
	}
};

//Add object to selection
Editor.addToSelection = function(object)
{
	if(object instanceof THREE.Object3D)
	{
		Editor.selectedObjects.push(object);

		Editor.selectObjectPanel();
		Editor.selectObjectHelper();
		Editor.selectTool();
	}
	else
	{
		Editor.clearSelection();
		Editor.resetEditingFlags();
	}
};

//Remove object from selection
Editor.removeFromSelection = function(object)
{
	for(var i = 0; i < Editor.selectedObjects.length; i++)
	{
		if(Editor.selectedObjects[i].uuid === object.uuid)
		{
			Editor.selectedObjects.splice(i, 1);

			Editor.selectObjectPanel();
			Editor.selectObjectHelper();
			Editor.selectTool();

			return;
		}
	}
};

//Check if object is selected
Editor.isObjectSelected = function(object)
{
	for(var i = 0; i < Editor.selectedObjects.length; i++)
	{
		if(Editor.selectedObjects[i].uuid === object.uuid)
		{
			return true;
		}
	}

	return false;
};

//Check if there is some object selected
Editor.hasObjectSelected = function()
{
	return Editor.selectedObjects.length > 0;
};

//Clear object selection
Editor.clearSelection = function()
{
	Editor.selectedObjects = [];
};

//Add object to actual scene
Editor.addToScene = function(obj)
{
	if(Editor.program.scene !== null)
	{
		Editor.program.scene.add(obj);

		Editor.history.push(obj, Action.ADDED);
		Editor.updateObjectViews();
	}
};

//Rename object, if none passed as argument selected object is used
Editor.renameObject = function(obj)
{
	if(obj === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			obj = Editor.selectedObjects[0];
		}
		else
		{
			return;
		}
	}

	var name = prompt("Rename object", obj.name);
	if(name !== null && name !== "")
	{
		obj.name = name;
		Editor.updateObjectViews();
	}
};

//Delete selected Object
Editor.deleteObject = function(obj)
{
	var del = Editor.confirm("Delete object?");

	if(del)
	{ 
		if(obj === undefined)
		{

			if(Editor.hasObjectSelected())
			{
				var selected = Editor.selectedObjects;
				Editor.resetEditingFlags();
			}
			else
			{
				return;
			}
		}
		else
		{
			var selected = [obj];
		}

		//Delect selection
		for(var i = 0; i < selected.length; i++)
		{
			//Avoid deleting program
			if(selected[i] instanceof Program)
			{
				continue;
			}
			else if(selected[i] instanceof THREE.Object3D)
			{
				if(Editor.isObjectSelected(selected[i]))
				{
					Editor.removeFromSelection(selected[i]);
				}

				Editor.history.push(selected[i], Action.REMOVED);
				selected[i].destroy();
			}
		}

		Editor.updateObjectViews();
	}
};

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
	else if(Editor.hasObjectSelected() && !(Editor.selectedObjects[0] instanceof Program || Editor.selectedObjects[0] instanceof Scene))
	{
		if(Editor.clipboard !== undefined)
		{
			Editor.clipboard.set(JSON.stringify(Editor.selectedObjects[0].toJSON()), "text");
		}
	}
};

//Cut selected object
Editor.cutObject = function(obj)
{
	if(obj === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			obj = Editor.selectedObjects[0];
		}
		else
		{
			return;
		}
	}

	//Avoid cutting program or scene objects
	if(obj instanceof Program || obj instanceof Scene)
	{
		return;
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
};

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
	catch(e)
	{
		Editor.alert("Error pasting object");
	}
};

//Redo action
Editor.redo = function()
{
	//TODO <ADD CODE HERE>
};

//Undo action
Editor.undo = function()
{
	var action = Editor.history.undo();
	if(action != null)
	{
		Editor.updateObjectViews();
	
		if(action.type === Action.CHANGED)
		{
			if(action.object.uuid === Editor.selectedObjects[0].uuid)
			{
				Editor.selectObject(action.object);
			}
		}
	}
	else
	{
		Editor.alert("Not possible to undo any further");
	}
};

//Update all object views
Editor.updateObjectViews = function()
{
	Editor.updateTreeView();
	Editor.updateObjectPanel();
	Editor.updateTabsData();
	Editor.updateAssetExplorer();
};

//Update tab names to match objects actual info
Editor.updateTabsData = function()
{
	Interface.tab.updateMetadata();
};

//Update tree view to match actual scene
Editor.updateTreeView = function()
{
	Interface.treeView.attachObject(Editor.program);
	Interface.treeView.updateView();
};

//Update assets explorer content
Editor.updateAssetExplorer = function()
{
	//Clean asset explorer
	Interface.assetExplorer.clear();
	
	//Materials
	var materials = ObjectUtils.getMaterials(Editor.program, Editor.program.materials);
	for(var i in materials)
	{
		var file = new MaterialAsset(Interface.assetExplorer.assets);
		file.setMaterial(materials[i]);
		Interface.assetExplorer.add(file);
	}

	//Textures
	var textures = ObjectUtils.getTextures(Editor.program, Editor.program.textures);
	for(var i in textures)
	{
		var file = new TextureAsset(Interface.assetExplorer.assets);
		file.setTexture(textures[i]);
		Interface.assetExplorer.add(file);
	}

	//Fonts
	var fonts = ObjectUtils.getFonts(Editor.program, Editor.program.fonts);
	for(var i in fonts)
	{
		var file = new FontAsset(Interface.assetExplorer.assets);
		file.setFont(fonts[i]);
		Interface.assetExplorer.add(file);
	}

	//Audio
	var audio = ObjectUtils.getAudio(Editor.program, Editor.program.audio);
	for(var i in audio)
	{
		var file = new AudioAsset(Interface.assetExplorer.assets);
		file.setAudio(audio[i]);
		Interface.assetExplorer.add(file);
	}

	Interface.assetExplorer.updateInterface();
};

//Updates object panel values
Editor.updateObjectPanel = function()
{
	if(Interface.panel !== null)
	{
		Interface.panel.updatePanel();
	}
};

//Create default resouces to be used when creating new objects
Editor.createDefaultResouces = function()
{
	Editor.defaultImage = new Image(Editor.filePath + "default.png");
	Editor.defaultFont = new Font(Editor.filePath + "default.json");
	Editor.defaultAudio = new Audio(Editor.filePath + "default.mp3");

	Editor.defaultTexture = new Texture(Editor.defaultImage);
	Editor.defaultTexture.name = "default";

	Editor.defaultTextureParticle = new Texture(new Image(Editor.filePath + "particle.png"));
	Editor.defaultTextureParticle.name = "particle";

	Editor.defaultMaterial = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
	Editor.defaultMaterial.name = "default";
	
	Editor.defaultSpriteMaterial = new THREE.SpriteMaterial({map: Editor.defaultTexture, color: 0xffffff});
	Editor.defaultSpriteMaterial.name = "default";

	Editor.defaultTextureLensFlare = [];
	for(var i = 0; i < 4; i++)
	{
		var texture = new Texture(new Image(Editor.filePath + "lensflare/lensflare" + i + ".png"));
		texture.name = "lensflare" + i;
		Editor.defaultTextureLensFlare.push(texture);
	}
};

//Select tool to manipulate objects
Editor.selectTool = function(tool)
{
	var tab = Interface.tab.getActual();
	if(tab instanceof SceneEditor)
	{
		tab.selectTool(tool);
	}
};

//Select objecct helper
Editor.selectObjectHelper = function(tool)
{
	var tab = Interface.tab.getActual();
	if(tab instanceof SceneEditor)
	{
		tab.selectObjectHelper();
	}
};

//Update UI panel to match selected object
Editor.selectObjectPanel = function()
{
	Interface.treeView.updateSelectedObject();

	if(Interface.panel !== null)
	{
		Interface.panel.destroy();
	}

	if(Editor.hasObjectSelected())
	{
		if(Editor.selectedObjects[0] instanceof THREE.Mesh)
		{
			if(Editor.selectedObjects[0] instanceof Text3D)
			{
				Interface.panel = new Text3DPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else
			{
				Interface.panel = new MeshPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
		}
		else if(Editor.selectedObjects[0] instanceof THREE.Light)
		{
			if(Editor.selectedObjects[0] instanceof THREE.PointLight)
			{
				Interface.panel = new PointLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else if(Editor.selectedObjects[0] instanceof THREE.RectAreaLight)
			{
				Interface.panel = new RectAreaLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else if(Editor.selectedObjects[0] instanceof THREE.SpotLight)
			{
				Interface.panel = new SpotLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else if(Editor.selectedObjects[0] instanceof THREE.DirectionalLight)
			{
				Interface.panel = new DirectionalLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else if(Editor.selectedObjects[0] instanceof THREE.HemisphereLight)
			{
				Interface.panel = new HemisphereLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
			else
			{
				Interface.panel = new AmbientLightPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
			}
		}
		else if(Editor.selectedObjects[0] instanceof Sky)
		{
			Interface.panel = new SkyPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof LeapMotion)
		{
			Interface.panel = new LeapPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof KinectDevice)
		{
			Interface.panel = new KinectPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof PerspectiveCamera)
		{
			Interface.panel = new PerspectiveCameraPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof OrthographicCamera)
		{
			Interface.panel = new OrthographicCameraPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof THREE.Audio)
		{
			Interface.panel = new AudioPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof CubeCamera)
		{
			Interface.panel = new CubeCameraPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof Scene)
		{
			Interface.panel = new ScenePanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof Program)
		{
			Interface.panel = new ProgramPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else if(Editor.selectedObjects[0] instanceof PhysicsObject)
		{
			Interface.panel = new PhysicsPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}
		else
		{
			Interface.panel = new ObjectPanel(Interface.explorerResizable.divB, Editor.selectedObjects[0]);
		}

		Interface.panel.updatePanel();
		Interface.panel.updateInterface();
	}
	else
	{
		Interface.panel = null;
	}
};

//Reset editing flags
Editor.resetEditingFlags = function()
{
	Editor.clearSelection();
	
	if(Interface.panel !== null)
	{
		Interface.panel.destroy();
		Interface.panel = null;
	}
	
	Editor.selectTool(Editor.SELECT);
	Editor.selectObjectHelper();
};

//Craete new Program
Editor.createNewProgram = function()
{
	//Reset resources
	Editor.createDefaultResouces();

	if(Editor.program !== null)
	{
		Editor.program.dispose();
	}

	//Create program
	Editor.program = new Program();
	Editor.program.addDefaultScene(Editor.defaultMaterial);

	//History
	Editor.history = new History(Editor.program);

	//Reset editor
	Editor.setOpenFile(null);
	Editor.resetEditingFlags();
	Editor.updateObjectViews();

	//Clear tabs
	Interface.tab.clear();

	//Scene tab
	var scene = Interface.tab.addTab(SceneEditor, true);
	scene.attach(Editor.program.scene);
};

//Save program to file
Editor.saveProgram = function(fname, binary, keepDirectory, suppressMessage)
{
	try
	{
		if(fname === undefined && Editor.openFile !== null)
		{
			fname = Editor.openFile;
		}

		if(binary === true)
		{
			fname = fname.replace(".isp", ".nsp");

			var pson = new dcodeIO.PSON.StaticPair();
			var data = pson.toArrayBuffer(Editor.program.toJSON());
			FileSystem.writeFileArrayBuffer(fname, data);
		}
		else
		{
			fname = fname.replace(".nsp", ".isp");

			var json = JSON.stringify(Editor.program.toJSON());
			FileSystem.writeFile(fname, json);
		}

		if(keepDirectory !== true && Editor.openFile !== fname)
		{
			Editor.setOpenFile(fname);
		}
		
		if(suppressMessage !== true)
		{
			Editor.alert("Project saved");
		}
	}
	catch(e)
	{
		Editor.alert("Error saving file\n(" + e + ")");
		console.error("nunuStudio: Error saving file", e);
	}
};

//Load program from file
Editor.loadProgram = function(file, binary)
{
	var onload = function()
	{
		try
		{
			//Dispose old program
			if(Editor.program !== null)
			{
				Editor.program.dispose();
			}

			var loader = new ObjectLoader();

			if(binary === true)
			{
				var pson = new dcodeIO.PSON.StaticPair();
				var data = pson.decode(reader.result);
				Editor.program = loader.parse(data);
			}
			else
			{
				Editor.program = loader.parse(JSON.parse(reader.result));
			}

			//Reset history
			Editor.history = new History(Editor.program);

			//Remove old tabs
			Interface.tab.clear();

			//Set open file
			Editor.setOpenFile(file);
			Editor.resetEditingFlags();
			Editor.updateObjectViews();

			//Add new scene tab to interface
			if(Editor.program.scene !== null)
			{
				var scene = Interface.tab.addTab(SceneEditor, true);
				scene.attach(Editor.program.scene);
			}

			Editor.alert("Project loaded");
		}
		catch(e)
		{
			Editor.alert("Error loading file\n(" + e + ")");
			console.error("nunuStudio: Error loading file", e);
		}
	};

	if(file instanceof File)
	{
		var reader = new FileReader();
		reader.onload = onload;
		if(binary === true)
		{
			reader.readAsArrayBuffer(file);
		}
		else
		{
			reader.readAsText(file);
		}
	}
	else if(typeof file === "string")
	{
		var reader = {};
		if(binary === true)
		{
			reader.result = FileSystem.readFileArrayBuffer(file);
		}
		else
		{
			reader.result = FileSystem.readFile(file);
		}
		onload();
	}
};

//Load texture from file object
Editor.loadTexture = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = file.name.split(".").pop().toLowerCase();
	var reader = new FileReader();

	reader.onload = function()
	{
		var texture = new Texture(new Image(reader.result));
		texture.name = name;

		Editor.program.addTexture(texture);
		Editor.updateObjectViews();

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};

	if(extension === "tga")
	{
		reader.readAsArrayBuffer(file);
	}
	else
	{
		reader.readAsDataURL(file);
	}
};

//Load video texture from file object
Editor.loadVideoTexture = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);

	var reader = new FileReader();
	reader.onload = function()
	{
		var texture = new VideoTexture(new Video(reader.result));
		texture.name = name;

		Editor.program.addTexture(texture);
		Editor.updateObjectViews();

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};

	reader.readAsDataURL(file);
};

//Load audio from file object
Editor.loadAudio = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var reader = new FileReader();

	reader.onload = function()
	{
		var audio = new Audio(reader.result);
		audio.name = name;
		
		if(onLoad !== undefined)
		{
			onLoad(audio);
		}

		Editor.program.addAudio(audio);
		Editor.updateObjectViews();
	};

	reader.readAsArrayBuffer(file);
};

//Load font from file object
Editor.loadFont = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = file.name.split(".").pop().toLowerCase();
	var reader = new FileReader();
	
	reader.onload = function()
	{
		if(extension === "json")
		{
			var font = new Font(JSON.parse(reader.result));
		}
		else
		{
			var font = new Font(reader.result);
			font.encoding = extension;
		}
		font.name = name;

		if(onLoad !== undefined)
		{
			onLoad(font);
		}

		Editor.program.addFont(font);
		Editor.updateObjectViews();
	};


	if(extension === "json")
	{
		reader.readAsText(file);
	}
	else
	{
		reader.readAsArrayBuffer(file);
	}
};

//Load geometry from file object
Editor.loadModel = function(file, onLoad)
{
	var name = file.name;
	var extension = FileSystem.getFileExtension(name);
	var path = (file.path !== undefined) ? FileSystem.getFilePath(file.path) : "";

	try
	{
		//Wavefront OBJ
		if(extension === "obj")
		{
			try
			{
				var materials = null;

				//Look for MTL file
				if(Nunu.runningOnDesktop())
				{
					try
					{
						var mtl = FileSystem.getNameWithoutExtension(file.path) + ".mtl";

						if(FileSystem.fileExists(mtl))
						{
							var mtlLoader = new THREE.MTLLoader()
							mtlLoader.setPath(path);
							materials = mtlLoader.parse(FileSystem.readFile(mtl));
						}
					}
					catch(f)
					{
						console.error("nunuStudio: Error loading mtl file", f);
					}
				}

				var reader = new FileReader();
				reader.onload = function()
				{
					//Try loading with OBJLoader1
					try
					{
						var loader = new THREE.OBJLoader();
						if(materials !== null)
						{
							loader.setMaterials(materials);
						}
						var obj = loader.parse(reader.result);
						Editor.addToScene(obj);
					}
					catch(e)
					{
						//Try loading with OBJLoader2
						try
						{
							var loader = new THREE.OBJLoader2();
							if(materials !== null)
							{
								loader.setMaterials(materials);
							}
							var obj = loader.parseText(reader.result);
							Editor.addToScene(obj);
						}
						catch(f)
						{
							Editor.alert("Error loading file");
							console.error("nunuStudio: Error loading file", f);
						}
					}
				};

				reader.readAsText(file);
			}
			catch(e)
			{
				Editor.alert("Error loading file");
				console.error("nunuStudio: Error loading file", e);
			}

		}
		//SVG
		else if(extension === "svg")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					console.log(reader.result);
					//TODO <ADD CODE HERE>
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			}
			reader.readAsText(file);
		}
		//3DS
		else if(extension === "3ds")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.TDSLoader();
					var group = loader.parse(reader.result, path);
					Editor.addToScene(group);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//Collada
		else if(extension === "dae")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.ColladaLoader();
					var collada = loader.parse(reader.result, path);
					
					var scene = collada.scene;

					//var animations = collada.animations;
					//TODO <SUPPORT FOR ANIMATIONS>
					
					Editor.addToScene(scene);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//GLTF
		else if(extension === "gltf" || extension === "glb")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.GLTFLoader();
					loader.parse(reader.result, path, function(gltf)
					{
						var scene = gltf.scene;
						scene.type = "Group";
						
						//var animation = gltf.animations;
						//TODO <SUPPORT FOR ANIMATIONS>

						Editor.addToScene(scene);
					});
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//3MF
		else if(extension === "3mf")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.ThreeMFLoader();
					var obj = loader.parse(reader.result);
					Editor.addToScene(obj);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//AWD
		else if(extension === "awd")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.AWDLoader();
					var awd = loader.parse(reader.result);
					Editor.addToScene(awd);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//PLY
		else if(extension === "ply")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.PLYLoader();
					var geometry = loader.parse(reader.result);
					Editor.addToScene(new Mesh(geometry));
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//VTK
		else if(extension === "vtk" || extension === "vtp")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.VTKLoader();
					var geometry = loader.parse(reader.result);
					Editor.addToScene(new Mesh(geometry));
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//VRML
		else if(extension === "wrl" || extension === "vrml")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.VRMLLoader();
					var scene = loader.parse(reader.result);

					for(var i = 0; i < scene.children.length; i++)
					{
						Editor.addToScene(scene.children[i]);
					}
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//FBX
		else if(extension === "fbx")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.FBXLoader();
					var object = loader.parse(reader.result, path);

					//TODO <OBJECT ANIMATIONS>
					//object.animations
					
					Editor.addToScene(object);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//PCD Point Cloud Data
		else if(extension === "pcd")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.PCDLoader();
					var pcd = loader.parse(reader.result, file.name);
					pcd.material.name = "points";

					Editor.addToScene(pcd);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//STL
		else if(extension === "stl")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.STLLoader();
					var geometry = loader.parse(reader.result);

					Editor.addToScene(new Mesh(geometry, Editor.defaultMaterial));
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//THREE JSON Model
		else if(extension === "json" || extension === "js")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.JSONLoader();
					var data = loader.parse(JSON.parse(reader.result));
					var materials = data.materials;
					var geometry = data.geometry;

					//Material
					var material = null;
					if(materials === undefined || materials.length === 0)
					{
						material = Editor.defaultMaterial;
					}
					else if(materials.length === 1)
					{
						material = materials[0];
					}
					else if(materials.length > 1)
					{
						material = materials;
					}

					//Mesh
					var mesh = null;
					if(geometry.bones.length > 0)
					{
						mesh = new SkinnedMesh(geometry, material);
					}
					else
					{
						mesh = new Mesh(geometry, material);
					}

					Editor.addToScene(mesh);
				}
				catch(e)
				{
					Editor.alert("Error loading file");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		else
		{
			Editor.alert("Unknown file format!");
			console.warn("nunuStudio: Unknown file format");
		}
	}
	catch(e)
	{
		Editor.alert("Error importing file (" + e + ")");
		console.error("nunuStudio: Error importing file", e);
	}
};

//Set currently open file (also updates the editor title), if running in browser never shows openfile
Editor.setOpenFile = function(file)
{
	if(file !== undefined && file !== null)
	{	
		if(file instanceof window.File)
		{
			if(Nunu.runningOnDesktop())
			{
				Editor.openFile = file.path;
			}
			else
			{
				Editor.openFile = file.name;
			}
		}
		else
		{
			Editor.openFile = file;
		}

		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ") (" + Editor.openFile + ")";
	}
	else
	{
		Editor.openFile = null;
		document.title = Nunu.NAME + " " + Nunu.VERSION + " (" + Nunu.TIMESTAMP + ")";
	}
};

//Export web project
Editor.exportWebProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile(Editor.runtimePath + "vr.png", dir + "/vr.png");
	FileSystem.copyFile(Editor.runtimePath + "fullscreen.png", dir + "/fullscreen.png");
	FileSystem.copyFile(Editor.runtimePath + "logo.png", dir + "/logo.png");
	FileSystem.copyFile(Editor.runtimePath + "index.html", dir + "/index.html");
	FileSystem.copyFile(FileSystem.fileExists("nunu.min.js") ? "nunu.min.js" : "../build/nunu.min.js", dir + "/nunu.min.js");
	
	Editor.saveProgram(dir + "/app.nsp", true, true, true);
};

//Export web project as a zip package
Editor.exportWebProjectZip = function(fname)
{
	var zip = new JSZip();
	zip.file("index.html", FileSystem.readFile(Editor.runtimePath + "index.html"));
	zip.file("nunu.min.js", FileSystem.readFile("nunu.min.js"));
	
	var pson = new dcodeIO.PSON.StaticPair();
	var data = pson.toArrayBuffer(Editor.program.toJSON());

	zip.file("app.nsp", Base64Utils.fromArraybuffer(data), {base64: true});

	zip.file("logo.png", FileSystem.readFileBase64(Editor.runtimePath + "logo.png"), {base64: true});
	zip.file("fullscreen.png", FileSystem.readFileBase64(Editor.runtimePath + "fullscreen.png"), {base64: true});
	zip.file("vr.png", FileSystem.readFileBase64(Editor.runtimePath + "vr.png"), {base64: true});

	zip.generateAsync({type:"blob"}).then(function(content)
	{
		var download = document.createElement("a");
		download.download = fname;
		download.href = window.URL.createObjectURL(content);
		download.style.display = "none";
		download.onclick = function()
		{
			document.body.removeChild(this);
		};
		document.body.appendChild(download);
		download.click();
	});
}

//Export NWJS project
Editor.exportNWJSProject = function(dir)
{
	Editor.exportWebProject(dir + "/package.nw");
	FileSystem.writeFile(dir + "/package.nw/package.json", JSON.stringify(
	{
		name: Editor.program.name,
		main: "index.html",
		window:
		{
			frame: true
		}
	}));
};

//Export windows project
Editor.exportWindowsProject = function(dir)
{
	FileSystem.copyFolder(Editor.NWJSPath + "win", dir);
	Editor.exportNWJSProject(dir);
};

//Export linux project
Editor.exportLinuxProject = function(dir)
{
	FileSystem.copyFolder(Editor.NWJSPath + "linux", dir);
	Editor.exportNWJSProject(dir);
};

//Export mac os project
Editor.exportMacOSProject = function(dir)
{
	FileSystem.copyFolder(Editor.NWJSPath + "mac", dir);
	Editor.exportNWJSProject(dir);
};

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
};

//Confirmation box
Editor.confirm = function(message)
{
	return confirm(message);
};

//Show alert box editor
Editor.alert = function(message)
{
	alert(message);
};

//Update nunuStudio editor version using build from github repo
Editor.updateNunu = function(silent)
{
	if(silent === undefined)
	{
		silent = true;
	}

	try
	{
		var url = "https://raw.githubusercontent.com/tentone/nunuStudio/master/build/nunu.editor.min.js";

		FileSystem.readFile(url, false, function(data)
		{
			var token = "Nunu.TIMESTAMP";
			var pos = data.search(token);
			var timestamp = data.slice(pos + token.length + 2, pos + token.length + 14);

			if(parseInt(timestamp) > parseInt(Editor.TIMESTAMP))
			{
				FileSystem.writeFile("nunu.min.js", data);
				Editor.alert("nunuStudio updated\nRestart the editor");
			}
			else
			{
				if(!silent)
				{
					Editor.alert("nunuStudio already up to date!");
				}
			}
		});
	}
	catch(e)
	{
		if(!silent)
		{
			Editor.alert("Failed to download update files!");
		}
	}
};

//Exit the editor
Editor.exit = function()
{
	if(Nunu.runningOnDesktop())
	{
		Settings.store();
		Editor.gui.App.closeAllWindows();
		Editor.gui.App.quit();
	}
};

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
	else if(window.require !== undefined)
	{
		var fs = require("fs");
		if(fs !== undefined)
		{
			if(file.endsWith("*"))
			{
				var directory = file.replace("*", "");
				var files = fs.readdirSync(directory);
				for(var i = 0; i < files.length; i++)
				{
					include(directory + files[i]);
				}
			}
			else
			{
				var directory = file + "/";
				try
				{
					var files = fs.readdirSync(directory);
					for(var i = 0; i < files.length; i++)
					{
						include(directory + files[i]);
					}
				}
				catch(e){}
			}
			
		}
	}
}
