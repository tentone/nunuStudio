"use strict";

function Editor(){}

Editor.filePath = "files/";
Editor.runtimePath = "runtime/";
Editor.NWJSPath = "../nwjs/";

//Runtime
include("lib/three/three.min.js");

include("lib/three/shaders/CopyShader.js");
include("lib/three/shaders/BokehShader.js");
include("lib/three/shaders/SAOShader.js");
include("lib/three/shaders/DepthLimitedBlurShader.js");
include("lib/three/shaders/UnpackDepthRGBAShader.js");
include("lib/three/shaders/ConvolutionShader.js");
include("lib/three/shaders/LuminosityHighPassShader.js");
include("lib/three/shaders/FXAAShader.js");
include("lib/three/shaders/SSAOShader.js");
include("lib/three/shaders/FilmShader.js");
include("lib/three/shaders/DotScreenShader.js");
include("lib/three/shaders/LuminosityShader.js");
include("lib/three/shaders/SobelOperatorShader.js");
include("lib/three/shaders/ColorifyShader.js");
include("lib/three/shaders/ToneMapShader.js");
include("lib/three/shaders/TechnicolorShader.js");
include("lib/three/shaders/HueSaturationShader.js");

include("lib/three/postprocessing/EffectComposer.js");
include("lib/three/postprocessing/RenderPass.js");
include("lib/three/postprocessing/ShaderPass.js");
include("lib/three/postprocessing/MaskPass.js");

include("lib/three/curves/NURBSCurve.js");
include("lib/three/curves/NURBSSurface.js");
include("lib/three/curves/NURBSUtils.js");

include("lib/three/objects/Lensflare.js");
include("lib/three/objects/Reflector.js");
include("lib/three/objects/Refractor.js");

include("lib/three/loaders/TTFLoader.js");

include("lib/pson/bytebuffer.min.js");
include("lib/pson/long.min.js");
include("lib/pson/PSON.min.js");

include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/SPE.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");

include("core/Nunu.js");
include("core/Global.js");
include("core/FileSystem.js");

include("core/three/animation/KeyframeTrack.js");
include("core/three/animation/AnimationClip.js");
include("core/three/core/Object3D.js");
include("core/three/core/BufferGeometry.js");
include("core/three/cameras/Camera.js");
include("core/three/materials/Material.js");
include("core/three/loaders/BufferGeometryLoader.js");
include("core/three/textures/Texture.js");
include("core/three/lights/LightShadow.js");
include("core/three/scenes/Fog.js");
include("core/three/objects/Points.js");

include("core/animation/AnimationMixer.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");
include("core/input/Gamepad.js");
include("core/input/Gyroscope.js");

include("core/postprocessing/Pass.js");
include("core/postprocessing/ShaderPass.js");
include("core/postprocessing/EffectComposer.js");

include("core/postprocessing/pass/antialiasing/FXAAPass.js");
include("core/postprocessing/pass/RenderPass.js");
include("core/postprocessing/pass/UnrealBloomPass.js");
include("core/postprocessing/pass/BloomPass.js");
include("core/postprocessing/pass/SSAOPass.js");
include("core/postprocessing/pass/BokehPass.js");
include("core/postprocessing/pass/CopyPass.js");
include("core/postprocessing/pass/FilmPass.js");
include("core/postprocessing/pass/DotScreenPass.js");
include("core/postprocessing/pass/SobelPass.js");
include("core/postprocessing/pass/ColorifyPass.js");
include("core/postprocessing/pass/TechnicolorPass.js");
include("core/postprocessing/pass/HueSaturationPass.js");

include("core/vr/VRControls.js");
include("core/vr/VREffect.js");

include("core/resources/Resource.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/resources/Model.js");
include("core/resources/TextFile.js");
include("core/resources/ResourceManager.js");

include("core/texture/Texture.js");
include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/CubeTexture.js");
include("core/texture/CompressedTexture.js");
include("core/texture/SpriteSheetTexture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/MaterialLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/GeometryLoader.js");
include("core/loaders/ObjectLoader.js");

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
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");
include("core/objects/audio/AudioEmitter.js");
include("core/objects/audio/PositionalAudio.js");

include("core/objects/script/Script.js");
include("core/objects/script/Blueprints.js");

include("core/objects/physics/PhysicsObject.js");
include("core/objects/spine/SpineAnimation.js");
include("core/objects/spine/SpineTexture.js");
include("core/objects/particle/ParticleEmitter.js");
include("core/objects/misc/Sky.js");
include("core/objects/misc/Container.js");
include("core/objects/misc/CubeCamera.js");
include("core/objects/misc/LensFlare.js");
include("core/objects/animation/Skeleton.js");
include("core/objects/controls/OrbitControls.js");
include("core/objects/controls/FirstPersonControls.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/binary/Base64Utils.js");
include("core/utils/binary/ArraybufferUtils.js");
include("core/utils/binary/BufferUtils.js");

include("core/utils/struct/TreeUtils.js");

include("core/utils/timer/Timer.js");
include("core/utils/timer/AnimationTimer.js");

include("core/utils/LocalStorage.js");
include("core/utils/EventManager.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/PhysicsGenerator.js");

//Editor
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

include("lib/three/loaders/LoaderSupport.js");
include("lib/three/loaders/3MFLoader.js");
include("lib/three/loaders/AMFLoader.js");
include("lib/three/loaders/AssimpJSONLoader.js");
include("lib/three/loaders/AssimpLoader.js");
include("lib/three/loaders/AWDLoader.js");
include("lib/three/loaders/BabylonLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/DRACOLoader.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/GCodeLoader.js");
include("lib/three/loaders/GLTFLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/OBJLoader2.js");
include("lib/three/loaders/PCDLoader.js");
include("lib/three/loaders/PLYLoader.js");
include("lib/three/loaders/PRWMLoader.js");
include("lib/three/loaders/STLLoader.js");
include("lib/three/loaders/SVGLoader.js");
include("lib/three/loaders/TDSLoader.js");
include("lib/three/loaders/VRMLLoader.js");
include("lib/three/loaders/VTKLoader.js");
include("lib/three/loaders/XLoader.js");

include("lib/three/loaders/DDSLoader.js");
include("lib/three/loaders/PVRLoader.js");
include("lib/three/loaders/TGALoader.js");
include("lib/three/loaders/KTXLoader.js");

include("lib/three/modifiers/SimplifyModifier.js");
include("lib/three/modifiers/SubdivisionModifier.js");

include("lib/three/exporters/OBJExporter.js");
include("lib/three/exporters/STLExporter.js");
include("lib/three/exporters/GLTFExporter.js");

include("lib/zlib.min.js");
include("lib/stats.min.js");
include("lib/jsblend.js");
include("lib/jshint.min.js");
include("lib/jscolor.min.js");
include("lib/jszip.min.js");
include("lib/quickhull.js");
include("lib/ThreeCSG.js");

//Non-tentone libraries
include("lib/litegraph.js");
include("lib/litegraph.css");

include("editor/style.css");

include("editor/locale/LocaleManager.js");
include("editor/locale/LocaleEN.js");

include("editor/theme/ThemeManager.js");
include("editor/theme/ThemeDark.js");
include("editor/theme/ThemeWhite.js");

include("editor/gui/element/Element.js");
include("editor/gui/element/DocumentBody.js");
include("editor/gui/element/Division.js");
include("editor/gui/element/Bar.js");
include("editor/gui/element/Text.js");
include("editor/gui/element/Canvas.js");
include("editor/gui/element/RendererCanvas.js");
include("editor/gui/element/TableForm.js");
include("editor/gui/element/ImageContainer.js");
include("editor/gui/element/SearchBox.js");

include("editor/gui/element/dropdown/ContextMenu.js");
include("editor/gui/element/dropdown/DropdownMenu.js");

include("editor/gui/element/media/Media.js");
include("editor/gui/element/media/AudioPlayer.js");
include("editor/gui/element/media/VideoPlayer.js");

include("editor/gui/element/modal/LoadingModal.js");

include("editor/gui/element/buttons/Button.js");
include("editor/gui/element/buttons/ButtonText.js");
include("editor/gui/element/buttons/ButtonMenu.js");
include("editor/gui/element/buttons/ButtonImage.js");
include("editor/gui/element/buttons/ButtonDrawer.js");
include("editor/gui/element/buttons/ButtonImageToggle.js");

include("editor/gui/element/containers/DualDivision.js");
include("editor/gui/element/containers/DualContainer.js");

include("editor/gui/element/input/Graph.js");
include("editor/gui/element/input/CheckBox.js");
include("editor/gui/element/input/TextBox.js");
include("editor/gui/element/input/TextArea.js");
include("editor/gui/element/input/ColorChooser.js");
include("editor/gui/element/input/ColorGradientChooser.js");
include("editor/gui/element/input/Slider.js");
include("editor/gui/element/input/DropdownList.js");
include("editor/gui/element/input/NumberBox.js");
include("editor/gui/element/input/VectorBox.js");
include("editor/gui/element/input/ImageChooser.js");
include("editor/gui/element/input/TextureChooser.js");
include("editor/gui/element/input/TextureForm.js");
include("editor/gui/element/input/CubeTextureBox.js");

include("editor/gui/element/tabs/TabGroup.js");
include("editor/gui/element/tabs/TabElement.js");
include("editor/gui/element/tabs/TabButton.js");

include("editor/gui/element/tabs/splittable/TabGroupNew.js");
include("editor/gui/element/tabs/splittable/TabButtonNew.js");
include("editor/gui/element/tabs/splittable/TabContainer.js");
include("editor/gui/element/tabs/splittable/TabDualContainer.js");

include("editor/gui/tab/ConsoleTab.js");
include("editor/gui/tab/ProfilingTab.js");
include("editor/gui/tab/CodeEditor.js");
include("editor/gui/tab/AboutTab.js");
include("editor/gui/tab/TextEditor.js");

//Nodes tab
include("editor/gui/tab/nodes/NodesTab.js");

include("editor/gui/tab/nodes/EcMAMath.js");

include("editor/gui/tab/nodes/ThreeMath.js");
include("editor/gui/tab/nodes/ThreeScene.js");
include("editor/gui/tab/nodes/ThreeUtils.js");

include("editor/gui/tab/treeview/TreeView.js");
include("editor/gui/tab/treeview/TreeNode.js");

include("editor/gui/tab/objects/ScriptEditor.js");
include("editor/gui/tab/objects/ParticleEditor.js");

include("editor/gui/tab/scene/SceneEditor.js");
include("editor/gui/tab/scene/transform/TransformControls.js");
include("editor/gui/tab/scene/transform/material/GizmoMaterial.js");
include("editor/gui/tab/scene/transform/material/GizmoLineMaterial.js");
include("editor/gui/tab/scene/transform/gizmo/TransformGizmo.js");
include("editor/gui/tab/scene/transform/gizmo/TransformGizmoRotate.js");
include("editor/gui/tab/scene/transform/gizmo/TransformGizmoScale.js");
include("editor/gui/tab/scene/transform/gizmo/TransformGizmoTranslate.js");
include("editor/gui/tab/scene/controls/EditorControls.js");
include("editor/gui/tab/scene/controls/EditorFreeControls.js");
include("editor/gui/tab/scene/controls/EditorOrbitControls.js");
include("editor/gui/tab/scene/controls/EditorPlanarControls.js");
include("editor/gui/tab/scene/utils/OrientationCube.js");
include("editor/gui/tab/scene/helpers/ObjectIconHelper.js");
include("editor/gui/tab/scene/helpers/PhysicsObjectHelper.js");
include("editor/gui/tab/scene/helpers/WireframeHelper.js");
include("editor/gui/tab/scene/helpers/SkinnedWireframeHelper.js");
include("editor/gui/tab/scene/helpers/PointsHelper.js");
include("editor/gui/tab/scene/helpers/LineHelper.js");
include("editor/gui/tab/scene/helpers/GridHelper.js");
include("editor/gui/tab/scene/helpers/RectAreaLightHelper.js");
include("editor/gui/tab/scene/helpers/SkeletonHelper.js");

include("editor/gui/tab/asset/AssetExplorer.js");
include("editor/gui/tab/asset/AssetExplorerMenu.js");
include("editor/gui/tab/asset/asset/Asset.js");
include("editor/gui/tab/asset/asset/GeometryAsset.js");
include("editor/gui/tab/asset/asset/MaterialAsset.js");
include("editor/gui/tab/asset/asset/TextureAsset.js");
include("editor/gui/tab/asset/asset/FontAsset.js");
include("editor/gui/tab/asset/asset/AudioAsset.js");
include("editor/gui/tab/asset/asset/FileAsset.js");
include("editor/gui/tab/asset/asset/ImageAsset.js");
include("editor/gui/tab/asset/asset/VideoAsset.js");

include("editor/gui/tab/animation/AnimationTab.js");
include("editor/gui/tab/animation/AnimationClipTrack.js");
include("editor/gui/tab/animation/AnimationOptions.js");
include("editor/gui/tab/animation/AnimationButton.js");
include("editor/gui/tab/animation/AnimationKeyframe.js");
include("editor/gui/tab/animation/AnimationTrack.js");
include("editor/gui/tab/animation/AnimationTrackButton.js");

include("editor/gui/tab/camera/CameraEditor.js");
include("editor/gui/tab/camera/postprocessing/PassNode.js");
include("editor/gui/tab/camera/postprocessing/UnrealBloomPassNode.js");
include("editor/gui/tab/camera/postprocessing/BokehPassNode.js");
include("editor/gui/tab/camera/postprocessing/SSAOPassNode.js");
include("editor/gui/tab/camera/postprocessing/DotScreenPassNode.js");
include("editor/gui/tab/camera/postprocessing/FilmPassNode.js");
include("editor/gui/tab/camera/postprocessing/ColorifyPassNode.js");
include("editor/gui/tab/camera/postprocessing/HueSaturationPassNode.js");

include("editor/gui/tab/settings/SettingsTab.js");
include("editor/gui/tab/settings/EditorSettingsTab.js");
include("editor/gui/tab/settings/CodeSettingsTab.js");
include("editor/gui/tab/settings/GeneralSettingsTab.js");
include("editor/gui/tab/settings/RenderSettingsTab.js");
include("editor/gui/tab/settings/JSHintSettingsTab.js");

include("editor/gui/tab/material/MaterialEditor.js");
include("editor/gui/tab/material/ShaderMaterialEditor.js");
include("editor/gui/tab/material/points/PointsMaterialEditor.js");
include("editor/gui/tab/material/sprite/SpriteMaterialEditor.js");
include("editor/gui/tab/material/line/LineBasicMaterialEditor.js");
include("editor/gui/tab/material/line/LineDashedMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshPhongMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshLambertMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshBasicMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshMatcapMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshStandardMaterialEditor.js");
include("editor/gui/tab/material/mesh/MeshPhysicalMaterialEditor.js");

include("editor/gui/tab/texture/CubeTextureEditor.js");
include("editor/gui/tab/texture/TextureEditor.js");
include("editor/gui/tab/texture/VideoTextureEditor.js");
include("editor/gui/tab/texture/CanvasTextureEditor.js");
include("editor/gui/tab/texture/SpriteSheetTextureEditor.js");

include("editor/gui/tab/panel/PanelContainer.js");
include("editor/gui/tab/panel/Panel.js");

include("editor/gui/tab/panel/textures/TexturePanel.js");

include("editor/gui/tab/panel/materials/MaterialPanel.js");

include("editor/gui/tab/panel/resources/ResourcePanel.js");
include("editor/gui/tab/panel/resources/AudioPanel.js");
include("editor/gui/tab/panel/resources/ImagePanel.js");
include("editor/gui/tab/panel/resources/VideoPanel.js");

include("editor/gui/tab/panel/objects/ObjectPanel.js");
include("editor/gui/tab/panel/objects/LockedPanel.js");
include("editor/gui/tab/panel/objects/DrawablePanel.js");
include("editor/gui/tab/panel/objects/ScenePanel.js");
include("editor/gui/tab/panel/objects/ScriptPanel.js");
include("editor/gui/tab/panel/objects/ProgramPanel.js");
include("editor/gui/tab/panel/objects/audio/AudioEmitterPanel.js");
include("editor/gui/tab/panel/objects/physics/PhysicsPanel.js");
include("editor/gui/tab/panel/objects/devices/LeapPanel.js");
include("editor/gui/tab/panel/objects/devices/KinectPanel.js");
include("editor/gui/tab/panel/objects/cameras/PerspectiveCameraPanel.js");
include("editor/gui/tab/panel/objects/cameras/OrthographicCameraPanel.js");
include("editor/gui/tab/panel/objects/lights/AmbientLightPanel.js");
include("editor/gui/tab/panel/objects/lights/RectAreaLightPanel.js");
include("editor/gui/tab/panel/objects/lights/HemisphereLightPanel.js");
include("editor/gui/tab/panel/objects/lights/PointLightPanel.js");
include("editor/gui/tab/panel/objects/lights/DirectionalLightPanel.js");
include("editor/gui/tab/panel/objects/lights/SpotLightPanel.js");
include("editor/gui/tab/panel/objects/misc/CubeCameraPanel.js");
include("editor/gui/tab/panel/objects/misc/LensFlarePanel.js");
include("editor/gui/tab/panel/objects/misc/ParticleEmitterPanel.js");
include("editor/gui/tab/panel/objects/misc/SkyPanel.js");
include("editor/gui/tab/panel/objects/spine/SpinePanel.js");
include("editor/gui/tab/panel/objects/mesh/MeshPanel.js");
include("editor/gui/tab/panel/objects/mesh/Text3DPanel.js");
include("editor/gui/tab/panel/objects/controls/OrbitControlsPanel.js");
include("editor/gui/tab/panel/objects/controls/FirstPersonControlsPanel.js");

include("editor/gui/tab/panel/objects/mesh/geometry/GeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/BoxGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/SphereGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/TorusGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/TorusKnotGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/PlaneGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/ConeGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/CylinderGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/TetrahedronGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/DodecahedronGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/CircleGeometryForm.js");
include("editor/gui/tab/panel/objects/mesh/geometry/RingGeometryForm.js");

include("editor/gui/preview/CubemapFlatRenderer.js");
include("editor/gui/preview/FontRenderer.js");
include("editor/gui/preview/MaterialRenderer.js");
include("editor/gui/preview/TextureRenderer.js");
include("editor/gui/preview/GeometryRenderer.js");

include("editor/gui/main/Interface.js");
include("editor/gui/main/MainMenu.js");
include("editor/gui/main/sidebar/ToolBar.js");
include("editor/gui/main/sidebar/AddObjectSideBar.js");

include("editor/gui/DragBuffer.js");

include("editor/utils/DOMUtils.js");
include("editor/utils/ObjectIcons.js");
include("editor/utils/CodemirrorThemes.js");
include("editor/utils/VirtualClipboard.js");

include("editor/history/History.js");
include("editor/history/action/Action.js");
include("editor/history/action/ChangeAction.js");
include("editor/history/action/ActionBundle.js");
include("editor/history/action/CallbackAction.js");
include("editor/history/action/objects/AddedAction.js");
include("editor/history/action/objects/RemovedAction.js");
include("editor/history/action/objects/MovedAction.js");
include("editor/history/action/objects/SwapAction.js");
include("editor/history/action/resources/AddResourceAction.js");
include("editor/history/action/resources/RemoveResourceAction.js");

include("editor/Settings.js");

Editor.SELECT = 0;
Editor.MOVE = 1;
Editor.SCALE = 2;
Editor.ROTATE = 3;

//Initialize
Editor.initialize = function()
{
	//Check WebGL Support
	if(!Nunu.webglAvailable())
	{
		Editor.alert(Locale.webglNotSupported);
		Editor.exit();
	}
	
	//Settings
	Editor.settings = new Settings();
	Editor.settings.load();

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
		var gui = require("nw.gui");
		Editor.clipboard = gui.Clipboard.get();
		Editor.args = gui.App.argv;

		//Handle window close event
		gui.Window.get().on("close", function()
		{
			if(confirm(Locale.unsavedChangesExit))
			{
				Editor.exit();
			}
		});

		//Try to update the editor
		if(Editor.settings.general.autoUpdate)
		{
			Editor.updateNunu();
		}
	}
	else
	{
		//Clipboard
		Editor.clipboard = new VirtualClipboard();
		
		//Arguments
		Editor.args = [];

		var parameters = Nunu.getQueryParameters();
		for(var i in parameters)
		{
			Editor.args.push(parameters[i]);
		}
		
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
			Editor.settings.store();

			var message = Locale.unsavedChangesExit;
			event.returnValue = message;
			return message;	
		};
	}

	//Open ISP file if dragged to the window
	document.body.ondrop = function(event)
	{
		event.preventDefault();
		
		for(var i = 0; i < event.dataTransfer.files.length; i++)
		{
			var file = event.dataTransfer.files[i];
			var extension = FileSystem.getFileExtension(file.name);

			//Project file
			if(extension === "isp" || extension === "nsp")
			{
				if(Editor.confirm(Locale.loadProjectChangesLost + " " + Locale.loadProject))
				{
					Editor.loadProgram(file, extension === "nsp");
					Editor.resetEditor();
				}
				break;
			}
			//Text file
			else if(TextFile.fileIsText(file))
			{
				Editor.loadText(file);
			}
		}
	}

	//Load theme
	Editor.theme = ThemeManager.get(Editor.settings.general.theme);

	//Open file
	Editor.openFile = null;

	//Selected object
	Editor.selection = [];

	//Program
	Editor.program = null;

	//History
	Editor.history = null;

	//Initialize User Interface
	Editor.gui = new Interface();
	Editor.gui.updateInterface();

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

	//Event manager
	Editor.manager = new EventManager();
	Editor.manager.add(document.body, "keydown", function(event)
	{
		var key = event.keyCode;

		if(event.ctrlKey)
		{
			if(key === Keyboard.NUM1)
			{
				Editor.gui.toolBar.selectTool(Editor.SELECT);
			}
			else if(key === Keyboard.NUM2)
			{
				Editor.gui.toolBar.selectTool(Editor.MOVE);
			}
			else if(key === Keyboard.NUM3)
			{
				Editor.gui.toolBar.selectTool(Editor.SCALE);
			}
			else if(key === Keyboard.NUM4)
			{
				Editor.gui.toolBar.selectTool(Editor.ROTATE);
			}
			else if(key === Keyboard.S)
			{
				if(Editor.openFile === null)
				{
					Editor.gui.saveProgram();
				}
				else
				{
					Editor.saveProgram(undefined, true);
				}
			}
			else if(key === Keyboard.L)
			{
				Editor.gui.loadProgram();
			}
			else if(key === Keyboard.W || key === Keyboard.F4)
			{
				Editor.gui.tab.closeActual();
			}
			else if(key === Keyboard.TAB || key === Keyboard.PAGE_DOWN)
			{
				Editor.gui.tab.selectNextTab();
			}
			else if(key === Keyboard.PAGE_UP)
			{
				Editor.gui.tab.selectPreviousTab();
			}
			else if(key === Keyboard.Z)
			{
				var tabs = Editor.gui.tab.getActiveTab();
				for(var i = 0; i < tabs.length; i++)
				{
					if(tabs[i] instanceof CodeEditor)
					{
						return;
					}
				}
				
				Editor.undo();
			}
			else if(key === Keyboard.Y)
			{
				var tabs = Editor.gui.tab.getActiveTab();
				for(var i = 0; i < tabs.length; i++)
				{
					if(tabs[i] instanceof CodeEditor)
					{
						return;
					}
				}

				Editor.redo();
			}
		}
		else if(key === Keyboard.DEL)
		{
			var tabs = Editor.gui.tab.getActiveTab();
			for(var i = 0; i < tabs.length; i++)
			{
				if(tabs[i] instanceof CodeEditor)
				{
					return;
				}
			}

			if(Editor.hasObjectSelected())
			{
				var del = Editor.confirm(Locale.deleteObjects);
				if(del)
				{
					Editor.deleteObject();
				}
			}
		}
		else if(key === Keyboard.F2)
		{
			Editor.renameObject();
		}
		else if(key === Keyboard.F5)
		{
			//TODO <ADD CODE HERE>
		}
	});
	Editor.manager.create();
};

//Select a single object
Editor.selectObject = function(object)
{
	Editor.selection = [object];
	Editor.updateSelectionGUI();
	Editor.selectTool();
};

//Add object to selection
Editor.addToSelection = function(object)
{
	Editor.selection.push(object);
	Editor.updateSelectionGUI();
	Editor.selectTool();
};

//Remove object from selection
Editor.removeFromSelection = function(object)
{
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].uuid === object.uuid)
		{
			Editor.selection.splice(i, 1);

			Editor.updateSelectionGUI();
			Editor.selectTool();

			return;
		}
	}
};

//Check if object is selected
Editor.isSelected = function(object)
{
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].uuid === object.uuid)
		{
			return true;
		}
	}

	return false;
};

//Resize to fit window
Editor.resize = function()
{
	if(!Nunu.isFullscreen())
	{
		Editor.gui.updateInterface();
	}
};

//Check if there is some object selected
Editor.hasObjectSelected = function()
{
	return Editor.selection.length > 0;
};

//Clear object selection
Editor.clearSelection = function()
{
	Editor.selection = [];
};

Editor.addAction = function(action)
{
	Editor.history.add(action);
};

//Add object to actual scene
Editor.addObject = function(object, parent)
{
	if(parent === undefined)
	{
		parent = Editor.program.scene;
	}

	var actions = [new AddedAction(object, parent)];
	var resources = ResourceManager.searchObject(object, Editor.program);

	for(var category in resources)
	{
		for(var resource in resources[category])
		{
			actions.push(new AddResourceAction(resources[category][resource], category, Editor.program));
		}
	}

	Editor.addAction(new ActionBundle(actions));
};

//Rename object, if none passed as argument selected object is used
Editor.renameObject = function(object)
{
	if(object === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			object = Editor.selection[0];
		}
		else
		{
			return;
		}
	}

	if(!object.locked)
	{
		var name = Editor.prompt("Rename object", object.name);
		if(name !== null && name !== "")
		{
			Editor.addAction(new ChangeAction(object, "name", name));
		}
	}
};

//Delete selected Object
Editor.deleteObject = function(object)
{
	var selected = (object === undefined) ? Editor.selection : [object];
	
	//List of delete actions
	var actions = [];

	//Delect selection
	for(var i = 0; i < selected.length; i++)
	{
		//Object3D
		if(selected[i].isObject3D && !selected[i].locked && !(selected[i] instanceof Program))
		{
			actions.push(new RemovedAction(selected[i]));
		}
		else
		{
			console.warn("nunuStudio: Cant delete type of object.");
		}
	}

	//Check if any action was added
	if(actions.length > 0)
	{
		Editor.addAction(new ActionBundle(actions));
	}
};

//Copy selected object
Editor.copyObject = function(object)
{
	//If no object passed copy selected object
	if(object === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			object = Editor.selection[0];
		}
		else
		{
			return;
		}
	}

	if(object instanceof Program || object instanceof Scene)
	{
		return;
	}

	if(!object.locked)
	{
		Editor.clipboard.set(JSON.stringify(object.toJSON()), "text");
	}
};

//Cut selected object
Editor.cutObject = function(object)
{
	if(object === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			object = Editor.selection[0];
		}
		else
		{
			return;
		}
	}

	//Avoid cutting program or scene objects
	if(object instanceof Program || object instanceof Scene)
	{
		return;
	}

	if(!object.locked)
	{
		Editor.clipboard.set(JSON.stringify(object.toJSON()), "text");
		Editor.addAction(new RemovedAction(object));
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
		if(target !== undefined && !target.locked)
		{
			Editor.addAction(new AddedAction(obj, target));
		}
		else
		{
			Editor.addAction(new AddedAction(obj, Editor.program.scene));
		}
	}
	catch(e)
	{
		Editor.alert("Error pasting object");
	}
};

//Redo action
Editor.redo = function()
{
	if(Editor.history.redo())
	{
		Editor.updateObjectsViewsGUI();
	}
	else
	{
		Editor.alert(Locale.nothingToRedo);
	}
};

//Undo action
Editor.undo = function()
{
	if(Editor.history.undo())
	{
		Editor.updateObjectsViewsGUI();
	}
	else
	{
		Editor.alert(Locale.nothingToUndo);
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
	var tabs = Editor.gui.tab.getActiveTab();

	for(var i = 0; i < tabs.length; i++)
	{
		var tab = tabs[i];
	
		if(tab instanceof SceneEditor)
		{
			tab.selectTool(tool);
		}
	}
};

Editor.updateSettings = function()
{
	Editor.gui.tab.updateSettings();
};

//Update all object views
Editor.updateObjectsViewsGUI = function()
{
	Editor.gui.tab.updateObjectsView();
	Editor.gui.tab.updateMetadata();
};

//Update tabs after changing selection
Editor.updateSelectionGUI = function()
{
	Editor.gui.tab.updateMetadata();
	Editor.gui.tab.updateSelection();
};

/**
 * Reset the editor state.
 *
 * @method resetEditor
 */
Editor.resetEditor = function()
{
	Editor.clearSelection();
	Editor.selectTool(Editor.SELECT);
	Editor.updateSelectionGUI();
	Editor.updateObjectsViewsGUI();

	Editor.gui.treeView.updateObjectsView();
};

/**
 * Create a program and set to the editor.
 * 
 * @method createNewProgram
 */
Editor.createNewProgram = function()
{
	var program = new Program();
	
	Editor.createDefaultResouces();
	Editor.setProgram(program);
	Editor.addDefaultScene(Editor.defaultMaterial);
	Editor.setOpenFile(null);
};

/**
 * Create a scene using a default template.
 * 
 * This is the scene used when creating a new program or scene inside the editor.
 * 
 * @method addDefaultScene
 * @param {Material} material Default material used by objects, if empty a new material is created
 */
Editor.addDefaultScene = function(material)
{
	if(material === undefined)
	{
		material = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
		material.name = "default";
	}

	//Create new scene
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.autoUpdate = false;
	scene.add(sky);

	//Box
	var model = new Mesh(new THREE.BoxBufferGeometry(1, 1, 1), material);
	model.name = "box";
	scene.add(model);

	//Floor
	model = new Mesh(new THREE.BoxBufferGeometry(20, 1, 20), material);
 	model.position.set(0, -1.0, 0);
	model.name = "ground";
	scene.add(model);

	//Add scene to program
	Editor.addObject(scene, Editor.program);

	//Open scene
	var tab = Editor.gui.tab.addTab(SceneEditor, true);
	tab.attach(scene);
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

			var json = JSON.stringify(Editor.program.toJSON(), null, "\t");
			FileSystem.writeFile(fname, json);
		}

		if(keepDirectory !== true && Editor.openFile !== fname)
		{
			Editor.setOpenFile(fname);
		}
		
		if(suppressMessage !== true)
		{
			Editor.alert(Locale.projectSaved);
		}
	}
	catch(e)
	{
		Editor.alert(Locale.errorSavingFile + "\n(" + e + ")");
		console.error("nunuStudio: Error saving file", e);
	}
};

//Set a program to be edited, create new history object and clear editor windows
Editor.setProgram = function(program)
{
	if(Editor.program !== program)
	{
		if(Editor.program !== null)
		{
			Editor.program.dispose();
		}

		Editor.program = program;

		//Tree view
		Editor.gui.treeView.attach(Editor.program);
		Editor.gui.assetExplorer.attach(Editor.program);

		//History
		Editor.history = new History(Editor.settings.general.historySize);
		
		//Clear tabs
		Editor.gui.tab.clear();

		//Reset editor
		Editor.resetEditor();

		//Add new scene tab to interface
		if(Editor.program.scene !== null)
		{
			var scene = Editor.gui.tab.addTab(SceneEditor, true);
			scene.attach(Editor.program.scene);
		}
	}

};

//Load program from file
Editor.loadProgram = function(file, binary)
{
	function onload()
	{
		try
		{
			var loader = new ObjectLoader();

			var program;

			if(binary === true)
			{
				var pson = new dcodeIO.PSON.StaticPair();
				var data = pson.decode(reader.result);
				program = loader.parse(data);
			}
			else
			{
				program = loader.parse(JSON.parse(reader.result));
			}

			Editor.setOpenFile(file);
			Editor.setProgram(program);

			Editor.alert(Locale.projectLoaded);
		}
		catch(e)
		{
			Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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

//Load compressed texture from data parsed by the texture loaders (PVR, DDS, etc)
Editor.loadCompressedTexture = function(data)
{
	var texture = new CompressedTexture();
	
	if(data.isCubemap === true)
	{
		var faces = data.mipmaps.length / data.mipmapCount;

		texture.isCubeTexture = true;
		texture.image = [];

		for(var f = 0; f < faces; f++)
		{
			texture.image[f] = {mipmaps: []};

			for(var i = 0; i < data.mipmapCount; i ++)
			{
				texture.image[f].mipmaps.push(data.mipmaps[f * data.mipmapCount + i]);
				texture.image[f].format = data.format;
				texture.image[f].width = data.width;
				texture.image[f].height = data.height;
			}
		}

		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;
		texture.mapping = THREE.CubeReflectionMapping;
	}
	else
	{
		texture.image.width = data.width;
		texture.image.height = data.height;
		texture.mipmaps = data.mipmaps;
	}

	if(data.mipmapCount === 1)
	{
		texture.minFilter = THREE.LinearFilter;
	}

	texture.format = data.format;
	texture.needsUpdate = true;

	return texture;
}

//Load texture from file object
Editor.loadTexture = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);

	var reader = new FileReader();
	reader.onload = function()
	{
		if(extension === "dds")
		{
			var loader = new THREE.DDSLoader();
			var texture = Editor.loadCompressedTexture(loader._parser(reader.result));	
		}
		else if(extension === "pvr")
		{
			var loader = new THREE.PVRLoader();
			var texture = Editor.loadCompressedTexture(loader._parser(reader.result));	
		}
		else if(extension === "ktx")
		{
			var loader = new THREE.KTXLoader();
			var texture = Editor.loadCompressedTexture(loader._parser(reader.result));	
		}
		else if(extension === "tga")
		{
			var loader = new THREE.TGALoader();
			var jpeg = loader.parse(reader.result).toDataURL("image/jpeg", 1.0);
			var texture = new Texture(new Image(jpeg, "jpeg"));
		}
		else
		{
			var texture = new Texture(new Image(reader.result, extension));
		}

		texture.name = name;
	
		Editor.addAction(new AddResourceAction(texture, "textures", Editor.program));

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};
	reader.readAsArrayBuffer(file);
};

//Load video texture from file object
Editor.loadVideoTexture = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);

	var reader = new FileReader();
	reader.onload = function()
	{
		var texture = new VideoTexture(new Video(reader.result, extension));
		texture.name = name;

		Editor.addAction(new AddResourceAction(texture, "textures", Editor.program));

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};

	reader.readAsArrayBuffer(file);
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

		Editor.addAction(new AddResourceAction(audio, "audio", Editor.program));
	};

	reader.readAsArrayBuffer(file);
};

//Load font from file object
Editor.loadFont = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);
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

		Editor.addAction(new AddResourceAction(font, "fonts", Editor.program));
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

//Load text file
Editor.loadText = function(file)
{
	var reader = new FileReader();
	var name = FileSystem.getFileNameWithExtension(file.name);

	reader.onload = function()
	{
		var resource = new TextFile(reader.result, FileSystem.getFileExtension(name));
		resource.name = name;

		Editor.addAction(new AddResourceAction(resource, "resources", Editor.program));
	};

	reader.readAsText(file);
};

//Load geometry from files
Editor.loadModel = function(file, parent)
{
	var name = file.name;
	var extension = FileSystem.getFileExtension(name);
	var path = (file.path !== undefined) ? FileSystem.getFilePath(file.path) : "";
	var modal = new LoadingModal(DocumentBody);
	modal.show();

	try
	{
		//GCode
		if(extension === "gcode")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				var loader = new THREE.GCodeLoader();
				var obj = loader.parse(reader.result);
				Editor.addObject(obj, parent);
				modal.destroy();
			};

			reader.readAsText(file);
		}
		//Wavefront OBJ
		else if(extension === "obj")
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
						console.log("nunuStudio: MTL Found");
						var mtlLoader = new THREE.MTLLoader()
						mtlLoader.setPath(path);
						materials = mtlLoader.parse(FileSystem.readFile(mtl));
					}
				}
				catch(f)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + f + ")");
					console.error("nunuStudio: Error loading file", f);
				}
			}

			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.OBJLoader();

					if(materials !== null)
					{
						loader.setMaterials(materials);
					}

					var obj = loader.parse(reader.result);
					obj.name = FileSystem.getFileName(name);
					Editor.addObject(obj, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};

			reader.readAsText(file);
		}
		//3MF
		/*else if(extension === "3mf")
		{
			//TODO <Fix JSZip 2 Support or move to JSZip 3>
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.ThreeMFLoader();
					var obj = loader.parse(reader.result);
					Editor.addObject(obj, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}*/
		//AWD
		else if(extension === "awd")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.AWDLoader();
					loader._baseDir = path;
					var awd = loader.parse(reader.result);
					Editor.addObject(awd, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//AMF
		else if(extension === "amf")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.AMFLoader();
					var amf = loader.parse(reader.result);
					Editor.addObject(amf, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//Assimp
		else if(extension === "assimp")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.AssimpLoader();
					var assimp = loader.parse(reader.result, path);
					Editor.addObject(assimp.object, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//Assimp JSON
		else if(name.endsWith(".assimp.json"))
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.AssimpJSONLoader();
					var json = JSON.parse(reader.result);
					var assimp = loader.parse(json, path);
					Editor.addObject(assimp, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//Babylon
		else if(extension === "babylon")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.BabylonLoader();
					var json = JSON.parse(reader.result);
					var babylon = loader.parse(json, path);
					babylon.type = "Group";
					babylon.traverse(function(object)
					{
						if(object instanceof THREE.Mesh)
						{
							object.material = new THREE.MeshPhongMaterial();
						}
					});
					Editor.addObject(babylon, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//Blender
		else if(extension === "blend")
		{	
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					JSBLEND(reader.result).then(function(blend)
					{
						var container = new Container();
						container.name = FileSystem.getNameWithoutExtension(name);
						blend.three.loadScene(container);
						Editor.addObject(container, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
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
					loader.setPath(path);
					var group = loader.parse(reader.result);
					Editor.addObject(group, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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
					var animations = collada.animations;

					if(animations.length > 0)
					{
						scene.traverse(function(child)
						{
							if(child instanceof THREE.SkinnedMesh)
							{
								child.animations = animations;
							}
						});
					}
					
					Editor.addObject(scene, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		//Draco
		else if(extension === "drc")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					THREE.DRACOLoader.setDecoderPath(Editor.filePath + "wasm/draco/");
					THREE.DRACOLoader.setDecoderConfig({type: "wasm"});
					var loader = new THREE.DRACOLoader();
					loader.decodeDracoFile(reader.result, function(geometry)
					{
						geometry.computeVertexNormals();

						var mesh = new THREE.Mesh(geometry, Editor.defaultMaterial);
						Editor.addObject(mesh, parent);
						modal.destroy();

						THREE.DRACOLoader.releaseDecoderModule();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
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
						scene.name = FileSystem.getNameWithoutExtension(name);

						var animations = gltf.animations;
						
						if(animations.length > 0)
						{
							scene.traverse(function(child)
							{
								if(child instanceof THREE.SkinnedMesh)
								{
									child.animations = animations;
								}
							});
						}

						Editor.addObject(scene, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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
					var modelName = FileSystem.getNameWithoutExtension(name);

					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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
					var modelName = FileSystem.getNameWithoutExtension(name);
					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//PRWM
		else if(extension === "prwm")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.PRWMLoader();
					var modelName = FileSystem.getNameWithoutExtension(name);

					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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
						Editor.addObject(scene.children[i], parent);
					}

					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
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
					
					if(object.animations !== undefined && object.animations.length > 0)
					{					
						object.traverse(function(child)
						{
							if(child instanceof THREE.SkinnedMesh)
							{
								child.animations = object.animations;
							}
						});
					}

					Editor.addObject(object, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//X
		else if(extension === "x")
		{
			function convertAnimation(baseAnime, name)
			{
				var animation = {};
				animation.fps = baseAnime.fps;
				animation.name = name;
				animation.hierarchy = [];

				for(var i = 0; i < baseAnime.hierarchy.length; i++)
				{
					var firstKey = -1;
					var lastKey = -1;

					var frame = {};
					frame.name = baseAnime.hierarchy[i].name;
					frame.parent = baseAnime.hierarchy[i].parent;
					frame.keys = [];

					for(var m = 1; m < baseAnime.hierarchy[i].keys.length; m++)
					{
						if(baseAnime.hierarchy[i].keys[m].time > 0)
						{
							if(firstKey === -1)
							{
								firstKey = m - 1;
								frame.keys.push(baseAnime.hierarchy[i].keys[m - 1]);
							}

							frame.keys.push(baseAnime.hierarchy[i].keys[m]);
						}

						animation.length = baseAnime.hierarchy[i].keys[m].time;

						if(m >= baseAnime.hierarchy[i].keys.length - 1)
						{
							break;
						}

					}

					animation.hierarchy.push(frame);
				}

				return animation;
			}

			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.XLoader();
					loader.baseDir = path;
					loader.parse(reader.result, function(object)
					{
						for(var i = 0; i < object.FrameInfo.length; i ++)
						{
							var model = object.FrameInfo[i];

							if(model instanceof THREE.SkinnedMesh)
							{
								if(object.XAnimationObj !== undefined && object.XAnimationObj.length > 0)
								{
									var animations = object.XAnimationObj;
									for(var j = 0; j < animations.length; j++)
									{
										model.animationSpeed = 1000;
										model.animations.push(THREE.AnimationClip.parseAnimation(convertAnimation(animations[j], animations[j].name), model.skeleton.bones));
									}
								}
							}

							Editor.addObject(model, parent);
						}
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//PCD
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

					Editor.addObject(pcd, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//SVG
		else if(extension === "svg")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new THREE.SVGLoader();
					var paths = loader.parse(reader.result);

					var group = new Container();
					var position = 0;

					for(var i = 0; i < paths.length; i ++)
					{
						var material = new THREE.MeshBasicMaterial({color: paths[i].color});
						var shapes = paths[i].toShapes(true);

						for(var j = 0; j < shapes.length; j++)
						{
							var shape = shapes[j];
							var geometry = new THREE.ShapeBufferGeometry(shape);
							var mesh = new THREE.Mesh(geometry, material);
							mesh.position.z = position;
							position += 0.1;
							group.add(mesh);
						}
					}

					Editor.addObject(group, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
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

					var modelName = FileSystem.getNameWithoutExtension(name);
					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					Editor.addObject(new Mesh(geometry, Editor.defaultMaterial), parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//threejs JSON
		else if(extension === "json")
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

					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		else
		{
			modal.destroy();
			Editor.alert(Locale.unknownFileFormat);
			console.warn("nunuStudio: Unknown file format");
		}
	}
	catch(e)
	{
		modal.destroy();
		Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
		console.error("nunuStudio: Error loading file", e);
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

Editor.confirm = function(message)
{
	return window.confirm(message);	
};

Editor.alert = function(message)
{
	window.alert(message);
};

Editor.prompt = function(message, defaultValue)
{
	return window.prompt(message, defaultValue);	
};

/**
 * Try to update nunuStudio editor version using build from github repo.
 *
 * The version timestamp is compared to the local timestamp.
 *
 * @method updateNunu
 */
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
				Editor.alert(Locale.updatedRestart);
			}
			else
			{
				if(!silent)
				{
					Editor.alert(Locale.alreadyUpdated);
				}
			}
		});
	}
	catch(e)
	{
		if(!silent)
		{
			Editor.alert(Locale.updateFailed);
		}
	}
};

/**
 * Exit the editor and close all windows.
 *
 * @method exit.
 */
Editor.exit = function()
{
	if(Nunu.runningOnDesktop())
	{
		Editor.settings.store();
		
		var gui = require("nw.gui");
		var win = gui.Window.get();

		gui.App.closeAllWindows();
		win.close(true);
		gui.App.quit();
	}
};
