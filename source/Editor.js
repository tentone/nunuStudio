"use strict";

function Editor(){}

Editor.filePath = "editor/files/";
Editor.NWJSPath = "../nwjs/";

//Runtime
include("Nunu.js");

include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");

include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");

include("core/Global.js");
include("core/FileSystem.js");

include("core/three/Object3D.js");
include("core/three/Texture.js");
include("core/three/LightShadow.js");
include("core/three/Fog.js");
include("core/three/Material.js");
include("core/three/MultiMaterial.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");
include("core/input/Gamepad.js");

include("core/controls/VRControls.js");

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
include("core/objects/animation/Bone.js");
include("core/objects/misc/Container.js");
include("core/objects/misc/CubeCamera.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/Base64Utils.js");
include("core/utils/ArraybufferUtils.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/BufferUtils.js");
include("core/utils/Mesh2shape.js");

//Loaders
include("core/loaders/external/TDSLoader.js");

//Editor
include("lib/codemirror/codemirror.js");
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
include("lib/codemirror/addon/search/match-highlighter.js");
include("lib/codemirror/addon/search/matchesonscrollbar.js");
include("lib/codemirror/addon/search/matchesonscrollbar.css");
include("lib/codemirror/addon/hint/show-hint.js");
include("lib/codemirror/addon/hint/show-hint.css");
include("lib/codemirror/addon/hint/anyword-hint.js");
include("lib/codemirror/addon/dialog/dialog.js");
include("lib/codemirror/addon/dialog/dialog.css");
include("lib/codemirror/addon/selection/active-line.js");
include("lib/codemirror/addon/selection/selection-pointer.js");
include("lib/codemirror/mode/javascript.js");
include("lib/codemirror/mode/glsl.js");
include("lib/codemirror/addon/lint/lint.css");
include("lib/codemirror/addon/lint/lint.js");
include("lib/codemirror/addon/lint/javascript-lint.js");
include("lib/codemirror/theme/*");

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
include("lib/three/loaders/STLLoader.js");

include("lib/three/animation/Animation.js");
include("lib/three/animation/AnimationHandler.js");
include("lib/three/animation/KeyFrameAnimation.js");

include("lib/three/exporters/OBJExporter.js");
include("lib/three/exporters/STLExporter.js");
include("lib/three/exporters/STLBinaryExporter.js");

include("lib/jscookie.min.js");
include("lib/jshint.min.js");
include("lib/jscolor.min.js");
include("lib/quickhull.js");

include("editor/style.css");

include("editor/theme/Theme.js");
include("editor/theme/ThemeDark.js");

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
include("editor/ui/AssetExplorer.js");
include("editor/ui/TabGroup.js");
include("editor/ui/TabElement.js");
include("editor/ui/TabButton.js");

include("editor/ui/asset/Asset.js");
include("editor/ui/asset/MaterialAsset.js");
include("editor/ui/asset/TextureAsset.js");
include("editor/ui/asset/FontAsset.js");
include("editor/ui/asset/AudioAsset.js");

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
include("editor/ui/tab/material/MaterialEditor.js");
include("editor/ui/tab/material/PhongMaterialEditor.js");
include("editor/ui/tab/material/LambertMaterialEditor.js");
include("editor/ui/tab/material/BasicMaterialEditor.js");
include("editor/ui/tab/material/StandardMaterialEditor.js");
include("editor/ui/tab/material/SpriteMaterialEditor.js");
include("editor/ui/tab/material/PointMaterialEditor.js");
include("editor/ui/tab/material/ShaderMaterialEditor.js");
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
include("editor/helpers/BoundingBoxHelper.js");
include("editor/helpers/GridHelper.js");
include("editor/helpers/RectAreaLightHelper.js");

include("editor/utils/FontRenderer.js");
include("editor/utils/MaterialRenderer.js");
include("editor/utils/ObjectIcons.js");
include("editor/utils/CodemirrorThemes.js");

include("editor/history/History.js");
include("editor/history/Action.js");

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
		alert("WebGL is not supported or is disabled!\nnunuStudio cannot run!");

		if(Nunu.runningOnDesktop())
		{
			Settings.store();
			Editor.gui.App.closeAllWindows();
			Editor.gui.App.quit();
		}
	}
		
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
				Settings.store();
				Editor.gui.App.closeAllWindows();
				Editor.gui.App.quit();
			}
		});
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
		};
	}

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
					Editor.loadProgram(file);
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

	//Load settings
	Settings.load();

	//Load theme
	Editor.theme = Theme.get(Settings.general.theme);

	//Open file
	Editor.openFile = null;

	//Selected object
	Editor.selectedObject = null;

	//Program
	Editor.program = null;

	//History
	Editor.history = null;

	//Material renderer for material previews
	Editor.materialRenderer = new MaterialRenderer();
	Editor.fontRenderer = new FontRenderer();
	
	//Default resources
	Editor.createDefaultResouces();

	//Initialize User Interface
	Interface.initialize();
	
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

//Select a object
Editor.selectObject = function(object)
{
	if(object instanceof THREE.Object3D)
	{
		Editor.selectedObject = object;

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

//Check if object is selected
Editor.isObjectSelected = function(obj)
{
	if(Editor.selectedObject !== null)
	{
		return Editor.selectedObject.uuid === obj.uuid;
	}

	return false;
};

//Clear object selectio
Editor.clearSelection = function()
{
	Editor.selectedObject = null;
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

//Rename object
Editor.renameObject = function(obj)
{
	if(obj === undefined)
	{
		obj = Editor.selectedObject;
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
	else if(Editor.selectedObject !== null && !(Editor.selectedObject instanceof Program || Editor.selectedObject instanceof Scene))
	{
		if(Editor.clipboard !== undefined)
		{
			Editor.clipboard.set(JSON.stringify(Editor.selectedObject.toJSON()), "text");
		}
	}
};

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
	catch(e){}
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
				Interface.panel = new AmbientLightPanel(Interface.explorerResizable.divB, Editor.selectedObject);
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
		else if(Editor.selectedObject instanceof CubeCamera)
		{
			Interface.panel = new CubeCameraPanel(Interface.explorerResizable.divB, Editor.selectedObject);
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
Editor.saveProgram = function(fname, compressed, keepDirectory)
{
	try
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

		alert("Project saved");
	}
	catch(e)
	{
		alert("Error saving file\n(" + e + ")");
	}
};

//Load program from file
Editor.loadProgram = function(file)
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

			//Load program
			var loader = new ObjectLoader();
			Editor.program = loader.parse(JSON.parse(reader.result));

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

			alert("Project loaded");
		}
		catch(e)
		{
			alert("Error loading file\n(" + e + ")");
		}
	};

	if(file instanceof File)
	{
		var reader = new FileReader();
		reader.onload = onload;
		reader.readAsText(file);
	}
	else if(typeof file === "string")
	{
		var reader = {};
		reader.result = FileSystem.readFile(file);
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
Editor.loadGeometry = function(file, onLoad)
{
	var name = file.name;
	var extension = FileSystem.getFileExtension(name);

	//Wavefront OBJ
	if(extension === "obj")
	{
		var loader = new THREE.OBJLoader();

		//Look for MTL file
		if(Nunu.runningOnDesktop())
		{
			var path = FileSystem.getFilePath(file.path);
			var mtl = FileSystem.getNameWithoutExtension(file.path) + ".mtl";

			if(FileSystem.fileExists(mtl))
			{
				var mtlLoader = new THREE.MTLLoader()
				mtlLoader.setPath(path);
				var materials = mtlLoader.parse(FileSystem.readFile(mtl));
				loader.setMaterials(materials);
			}
		}

		var reader = new FileReader();
		reader.onload = function()
		{
			var obj = loader.parse(reader.result);
			Editor.addToScene(obj);
		};
		reader.readAsText(file);
	}
	//3DS
	else if(extension === "3ds")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.TDSLoader();
			var group = loader.parse(reader.result);
			Editor.addToScene(group);
		};
		reader.readAsArrayBuffer(file);
	}
	//Collada
	else if(extension === "dae")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			var collada = loader.parse(reader.result);
			var scene = collada.scene;
			Editor.addToScene(scene);
		};
		reader.readAsText(file);
	}
	//GLTF
	else if(extension === "gltf" || extension === "glb")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.GLTFLoader();
			var gltf = loader.parse(reader.result);
			if(gltf.scene !== undefined)
			{
				Editor.addToScene(gltf.scene);
			}
		};
		reader.readAsText(file);
	}
	//AWD
	else if(extension === "awd")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.AWDLoader();
			var awd = loader.parse(reader.result);
			Editor.addToScene(awd);
		};
		reader.readAsArrayBuffer(file);
	}
	//PLY
	else if(extension === "ply")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.PLYLoader();
			var geometry = loader.parse(reader.result);
			Editor.addToScene(new Mesh(geometry));
		};
		reader.readAsText(file);
	}
	//VTK
	else if(extension === "vtk" || extension === "vtp")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.VTKLoader();
			var geometry = loader.parse(reader.result);
			Editor.addToScene(new Mesh(geometry));
		};
		reader.readAsArrayBuffer(file);
	}
	//VRML
	else if(extension === "wrl" || extension === "vrml")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.VRMLLoader();
			var scene = loader.parse(reader.result);

			for(var i = 0; i < scene.children.length; i++)
			{
				Editor.addToScene(scene.children[i]);
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
			var loader = new THREE.FBXLoader();
			var obj = loader.parse(reader.result);
			Editor.addToScene(obj);
		};
		reader.readAsText(file);
	}
	//PCD Point Cloud Data
	else if(extension === "pcd")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.PCDLoader();
			var pcd = loader.parse(reader.result, file.name);
			pcd.material.name = "points";

			Editor.addToScene(pcd);
		};
		reader.readAsArrayBuffer(file);
	}
	//STL
	else if(extension === "stl")
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			var loader = new THREE.STLLoader();
			var geometry = loader.parse(reader.result);

			Editor.addToScene(new Mesh(geometry, Editor.defaultMaterial));
		};
		reader.readAsArrayBuffer(file);
	}
	//THREE JSON Model
	else if(extension === "json" || extension === "js")
	{
		var reader = new FileReader();
		reader.onload = function()
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
		};
		reader.readAsText(file);
	}
};

//Set currently open file (also updates the editor title), if running in browser never shows openfile
Editor.setOpenFile = function(file)
{
	if(file !== undefined && file !== null && Nunu.runningOnDesktop())
	{	
		if(file instanceof window.File)
		{
			Editor.openFile = file.path;
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
	FileSystem.copyFile("runtime/vr.png", dir + "/vr.png");
	FileSystem.copyFile("runtime/fullscreen.png", dir + "/fullscreen.png");
	FileSystem.copyFile("runtime/logo.png", dir + "/logo.png");
	FileSystem.copyFile("runtime/index.html", dir + "/index.html");
	FileSystem.copyFile("../build/nunu.min.js", dir + "/nunu.min.js");
	
	Editor.saveProgram(dir + "/app.isp", true, true);
};

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
