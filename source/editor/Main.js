"use strict";

/**
 * nunuStudio main editor entry point. 
 *
 * @class Editor 
 */
function Editor(){}

//Runtime
include("lib/three/three.js");

include("lib/three/QuickHull.js");
include("lib/three/SimplexNoise.js");

include("lib/three/shaders/AfterimageShader.js");
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

include("lib/three-bmfont.js");
include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");
include("lib/chevrotain.min.js");

include("source/core/Nunu.js");
include("source/core/Global.js");
include("source/core/FileSystem.js");

include("source/core/three/animation/KeyframeTrack.js");
include("source/core/three/animation/AnimationClip.js");
include("source/core/three/core/Object3D.js");
include("source/core/three/core/BufferGeometry.js");
include("source/core/three/cameras/Camera.js");
include("source/core/three/materials/Material.js");
include("source/core/three/loaders/BufferGeometryLoader.js");
include("source/core/three/textures/Texture.js");
include("source/core/three/lights/LightShadow.js");
include("source/core/three/scenes/Fog.js");
include("source/core/three/objects/Points.js");

include("source/core/animation/AnimationMixer.js");

include("source/core/input/Key.js");
include("source/core/input/Keyboard.js");
include("source/core/input/TizenKeyboard.js");
include("source/core/input/Mouse.js");
include("source/core/input/Gamepad.js");
include("source/core/input/Gyroscope.js");

include("source/core/renderer/RendererConfiguration.js");
include("source/core/renderer/css/CSS3DRenderer.js");
include("source/core/renderer/css/CSS3DObject.js");
include("source/core/renderer/css/CSS3DSprite.js");

include("source/core/postprocessing/RendererState.js");
include("source/core/postprocessing/Pass.js");
include("source/core/postprocessing/ShaderPass.js");
include("source/core/postprocessing/EffectComposer.js");
include("source/core/postprocessing/RenderPass.js");

include("source/core/postprocessing/pass/antialiasing/FXAAPass.js");
include("source/core/postprocessing/pass/AfterimagePass.js");
include("source/core/postprocessing/pass/UnrealBloomPass.js");
include("source/core/postprocessing/pass/BloomPass.js");
include("source/core/postprocessing/pass/SSAONOHPass.js");
include("source/core/postprocessing/pass/SSAOPass.js");
include("source/core/postprocessing/pass/BokehPass.js");
include("source/core/postprocessing/pass/CopyPass.js");
include("source/core/postprocessing/pass/FilmPass.js");
include("source/core/postprocessing/pass/DotScreenPass.js");
include("source/core/postprocessing/pass/SobelPass.js");
include("source/core/postprocessing/pass/ColorifyPass.js");
include("source/core/postprocessing/pass/TechnicolorPass.js");
include("source/core/postprocessing/pass/HueSaturationPass.js");
include("source/core/postprocessing/pass/AdaptiveToneMappingPass.js");

include("source/core/postprocessing/shaders/SSAOShader.js");

include("source/core/vr/VRControls.js");
include("source/core/vr/VREffect.js");

include("source/core/resources/Resource.js");
include("source/core/resources/Font.js");
include("source/core/resources/Video.js");
include("source/core/resources/Audio.js");
include("source/core/resources/Image.js");
include("source/core/resources/Model.js");
include("source/core/resources/TextFile.js");
include("source/core/resources/ResourceManager.js");
include("source/core/resources/stream/VideoStream.js");

include("source/core/texture/Texture.js");
include("source/core/texture/CanvasTexture.js");
include("source/core/texture/VideoTexture.js");
include("source/core/texture/WebcamTexture.js");
include("source/core/texture/CubeTexture.js");
include("source/core/texture/CompressedTexture.js");
include("source/core/texture/SpriteSheetTexture.js");

include("source/core/loaders/FontLoader.js");
include("source/core/loaders/ImageLoader.js");
include("source/core/loaders/VideoLoader.js");
include("source/core/loaders/AudioLoader.js");
include("source/core/loaders/MaterialLoader.js");
include("source/core/loaders/TextureLoader.js");
include("source/core/loaders/GeometryLoader.js");
include("source/core/loaders/LegacyGeometryLoader.js");
include("source/core/loaders/ObjectLoader.js");

include("source/core/objects/device/LeapMotion.js");
include("source/core/objects/device/KinectDevice.js");

include("source/core/objects/mesh/Mesh.js");
include("source/core/objects/mesh/SkinnedMesh.js");

include("source/core/objects/sprite/CanvasSprite.js");
include("source/core/objects/sprite/Sprite.js");

include("source/core/objects/text/TextMesh.js");
include("source/core/objects/text/TextBitmap.js");
include("source/core/objects/text/TextSprite.js");

include("source/core/objects/lights/PointLight.js");
include("source/core/objects/lights/SpotLight.js");
include("source/core/objects/lights/AmbientLight.js");
include("source/core/objects/lights/DirectionalLight.js");
include("source/core/objects/lights/HemisphereLight.js");
include("source/core/objects/lights/RectAreaLight.js");

include("source/core/objects/cameras/Viewport.js");
include("source/core/objects/cameras/PerspectiveCamera.js");
include("source/core/objects/cameras/OrthographicCamera.js");

include("source/core/objects/audio/AudioEmitter.js");
include("source/core/objects/audio/PositionalAudio.js");

include("source/core/objects/script/Script.js");

include("source/core/objects/physics/PhysicsObject.js");

include("source/core/objects/spine/SpineAnimation.js");
include("source/core/objects/spine/SpineTexture.js");

include("source/core/objects/particle/core/ParticleEmitterControl.js");
include("source/core/objects/particle/core/ParticleGroup.js");
include("source/core/objects/particle/core/ShaderUtils.js");
include("source/core/objects/particle/helpers/ShaderAttribute.js");
include("source/core/objects/particle/helpers/TypedArrayHelper.js");
include("source/core/objects/particle/shaders/ParticleShaderChunks.js");
include("source/core/objects/particle/shaders/ParticleShaders.js");
include("source/core/objects/particle/ParticleEmitter.js");

include("source/core/objects/misc/Sky.js");
include("source/core/objects/misc/Container.js");
include("source/core/objects/misc/CubeCamera.js");
include("source/core/objects/misc/LensFlare.js");
include("source/core/objects/misc/BrowserView.js");

include("source/core/objects/animation/Skeleton.js");

include("source/core/objects/controls/OrbitControls.js");
include("source/core/objects/controls/FirstPersonControls.js");

include("source/core/objects/Program.js");
include("source/core/objects/Scene.js");

include("source/core/utils/binary/Base64Utils.js");
include("source/core/utils/binary/ArraybufferUtils.js");
include("source/core/utils/binary/BufferUtils.js");

include("source/core/utils/timer/Timer.js");
include("source/core/utils/timer/AnimationTimer.js");

include("source/core/utils/LocalStorage.js");
include("source/core/utils/EventManager.js");
include("source/core/utils/MathUtils.js");
include("source/core/utils/ObjectUtils.js");
include("source/core/utils/PhysicsGenerator.js");

//Editor
include("source/editor/Editor.js");
include("source/editor/Global.js");

include("lib/codemirror/codemirror.js");
include("lib/codemirror/codemirror.css");
include("lib/codemirror/keymap/sublime.js");
include("lib/codemirror/keymap/emacs.js");
include("lib/codemirror/keymap/vim.js");
include("lib/codemirror/mode/javascript/javascript.js");
include("lib/codemirror/mode/css/css.js");
include("lib/codemirror/mode/xml/xml.js");
include("lib/codemirror/mode/htmlmixed/htmlmixed.js");
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
include("lib/three/loaders/BasisTextureLoader.js");
include("lib/three/loaders/BabylonLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/DRACOLoader.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/GCodeLoader.js");
include("lib/three/loaders/GLTFLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/OBJLoader.js");
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

include("lib/three/exporters/DRACOExporter.js");
include("lib/three/exporters/OBJExporter.js");
include("lib/three/exporters/STLExporter.js");
include("lib/three/exporters/GLTFExporter.js");
include("lib/three/exporters/ColladaExporter.js");
include("lib/three/exporters/PLYExporter.js");

include("lib/draco/draco_encoder.js");

include("lib/zlib.min.js");
include("lib/stats.min.js");
include("lib/jsblend.js");
include("lib/jshint.min.js");
include("lib/jscolor.min.js");
include("lib/jszip.min.js");
include("lib/ThreeCSG.js");
include("lib/tween.js");

include("source/editor/style.css");

include("source/editor/locale/LocaleManager.js");
include("source/editor/locale/LocaleEN.js");

include("source/editor/theme/ThemeManager.js");
include("source/editor/theme/ThemeDark.js");

include("source/editor/gui/element/Element.js");
include("source/editor/gui/element/DocumentBody.js");
include("source/editor/gui/element/Division.js");
include("source/editor/gui/element/Text.js");
include("source/editor/gui/element/Canvas.js");
include("source/editor/gui/element/RendererCanvas.js");
include("source/editor/gui/element/TableForm.js");
include("source/editor/gui/element/ImageContainer.js");
include("source/editor/gui/element/SearchBox.js");

include("source/editor/gui/element/dropdown/ContextMenu.js");
include("source/editor/gui/element/dropdown/DropdownMenu.js");

include("source/editor/gui/element/media/Media.js");
include("source/editor/gui/element/media/AudioPlayer.js");
include("source/editor/gui/element/media/VideoPlayer.js");

include("source/editor/gui/element/modal/LoadingModal.js");

include("source/editor/gui/element/buttons/Button.js");
include("source/editor/gui/element/buttons/ButtonText.js");
include("source/editor/gui/element/buttons/ButtonMenu.js");
include("source/editor/gui/element/buttons/ButtonImage.js");
include("source/editor/gui/element/buttons/ButtonDrawer.js");
include("source/editor/gui/element/buttons/ButtonImageToggle.js");

include("source/editor/gui/element/containers/DualDivision.js");
include("source/editor/gui/element/containers/DualContainer.js");

include("source/editor/gui/element/input/Graph.js");
include("source/editor/gui/element/input/CheckBox.js");
include("source/editor/gui/element/input/TextBox.js");
include("source/editor/gui/element/input/TextArea.js");
include("source/editor/gui/element/input/ColorChooser.js");
include("source/editor/gui/element/input/ColorGradientChooser.js");
include("source/editor/gui/element/input/Slider.js");
include("source/editor/gui/element/input/DropdownList.js");
include("source/editor/gui/element/input/NumberBox.js");
include("source/editor/gui/element/input/NumberRow.js");
include("source/editor/gui/element/input/VectorBox.js");
include("source/editor/gui/element/input/ImageChooser.js");
include("source/editor/gui/element/input/TextureChooser.js");
include("source/editor/gui/element/input/TextureForm.js");
include("source/editor/gui/element/input/CubeTextureBox.js");

include("source/editor/gui/element/tabs/TabGroup.js");
include("source/editor/gui/element/tabs/TabElement.js");
include("source/editor/gui/element/tabs/TabButton.js");

include("source/editor/gui/element/tabs/splittable/TabGroupSplit.js");
include("source/editor/gui/element/tabs/splittable/TabButtonSplit.js");
include("source/editor/gui/element/tabs/splittable/TabContainer.js");
include("source/editor/gui/element/tabs/splittable/TabDualContainer.js");

include("source/editor/gui/formtemplate/FormTemplate.js");
include("source/editor/gui/formtemplate/ViewportFormTemplate.js");
include("source/editor/gui/formtemplate/RendererConfigurationFormTemplate.js");

include("source/editor/gui/tab/ConsoleTab.js");
include("source/editor/gui/tab/CodeEditor.js");
include("source/editor/gui/tab/AboutTab.js");
include("source/editor/gui/tab/TextEditor.js");

include("source/editor/gui/tab/treeview/TreeView.js");
include("source/editor/gui/tab/treeview/TreeNode.js");

include("source/editor/gui/tab/objects/ScriptEditor.js");
include("source/editor/gui/tab/objects/ParticleEditor.js");

include("source/editor/gui/tab/run/RunProject.js");

include("source/editor/gui/tab/scene/SceneEditor.js");
include("source/editor/gui/tab/scene/sidebar/SideBar.js");
include("source/editor/gui/tab/scene/transform/TransformControls.js");
include("source/editor/gui/tab/scene/transform/material/GizmoMaterial.js");
include("source/editor/gui/tab/scene/transform/material/GizmoLineMaterial.js");
include("source/editor/gui/tab/scene/transform/gizmo/TransformGizmo.js");
include("source/editor/gui/tab/scene/transform/gizmo/TransformGizmoRotate.js");
include("source/editor/gui/tab/scene/transform/gizmo/TransformGizmoScale.js");
include("source/editor/gui/tab/scene/transform/gizmo/TransformGizmoTranslate.js");
include("source/editor/gui/tab/scene/controls/EditorControls.js");
include("source/editor/gui/tab/scene/controls/EditorFreeControls.js");
include("source/editor/gui/tab/scene/controls/EditorOrbitControls.js");
include("source/editor/gui/tab/scene/controls/EditorPlanarControls.js");
include("source/editor/gui/tab/scene/utils/OrientationCube.js");
include("source/editor/gui/tab/scene/helpers/ObjectIconHelper.js");
include("source/editor/gui/tab/scene/helpers/PhysicsObjectHelper.js");
include("source/editor/gui/tab/scene/helpers/WireframeHelper.js");
include("source/editor/gui/tab/scene/helpers/SkinnedWireframeHelper.js");
include("source/editor/gui/tab/scene/helpers/PointsHelper.js");
include("source/editor/gui/tab/scene/helpers/LineHelper.js");
include("source/editor/gui/tab/scene/helpers/GridHelper.js");
include("source/editor/gui/tab/scene/helpers/RectAreaLightHelper.js");
include("source/editor/gui/tab/scene/helpers/SkeletonHelper.js");

include("source/editor/gui/tab/asset/AssetExplorer.js");
include("source/editor/gui/tab/asset/AssetExplorerMenu.js");
include("source/editor/gui/tab/asset/asset/Asset.js");
include("source/editor/gui/tab/asset/asset/GeometryAsset.js");
include("source/editor/gui/tab/asset/asset/MaterialAsset.js");
include("source/editor/gui/tab/asset/asset/TextureAsset.js");
include("source/editor/gui/tab/asset/asset/FontAsset.js");
include("source/editor/gui/tab/asset/asset/AudioAsset.js");
include("source/editor/gui/tab/asset/asset/FileAsset.js");
include("source/editor/gui/tab/asset/asset/ImageAsset.js");
include("source/editor/gui/tab/asset/asset/VideoAsset.js");

include("source/editor/gui/tab/animation/AnimationTab.js");
include("source/editor/gui/tab/animation/AnimationClipTrack.js");
include("source/editor/gui/tab/animation/AnimationClipMenuBar.js");
include("source/editor/gui/tab/animation/AnimationClipButton.js");
include("source/editor/gui/tab/animation/AnimationKeyframe.js");
include("source/editor/gui/tab/animation/AnimationTrack.js");
include("source/editor/gui/tab/animation/AnimationTrackButton.js");

include("source/editor/gui/tab/camera/CameraEditor.js");
include("source/editor/gui/tab/camera/postprocessing/PassNode.js");
include("source/editor/gui/tab/camera/postprocessing/UnrealBloomPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/BokehPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/SSAONOHPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/SSAOPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/DotScreenPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/FilmPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/ColorifyPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/HueSaturationPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/AdaptiveToneMappingPassNode.js");
include("source/editor/gui/tab/camera/postprocessing/AfterimagePassNode.js");

include("source/editor/gui/tab/settings/SettingsTab.js");
include("source/editor/gui/tab/settings/EditorSettingsTab.js");
include("source/editor/gui/tab/settings/CodeSettingsTab.js");
include("source/editor/gui/tab/settings/GeneralSettingsTab.js");
include("source/editor/gui/tab/settings/RenderSettingsTab.js");
include("source/editor/gui/tab/settings/JSHintSettingsTab.js");

include("source/editor/gui/tab/material/MaterialEditor.js");
include("source/editor/gui/tab/material/ShaderMaterialEditor.js");
include("source/editor/gui/tab/material/points/PointsMaterialEditor.js");
include("source/editor/gui/tab/material/sprite/SpriteMaterialEditor.js");
include("source/editor/gui/tab/material/line/LineBasicMaterialEditor.js");
include("source/editor/gui/tab/material/line/LineDashedMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshPhongMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshLambertMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshBasicMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshMatcapMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshStandardMaterialEditor.js");
include("source/editor/gui/tab/material/mesh/MeshPhysicalMaterialEditor.js");

include("source/editor/gui/tab/texture/CubeTextureEditor.js");
include("source/editor/gui/tab/texture/TextureEditor.js");
include("source/editor/gui/tab/texture/VideoTextureEditor.js");
include("source/editor/gui/tab/texture/CanvasTextureEditor.js");
include("source/editor/gui/tab/texture/SpriteSheetTextureEditor.js");

include("source/editor/gui/tab/inspector/InspectorContainer.js");
include("source/editor/gui/tab/inspector/Inspector.js");

include("source/editor/gui/tab/inspector/textures/TextureInspector.js");

include("source/editor/gui/tab/inspector/materials/MaterialInspector.js");

include("source/editor/gui/tab/inspector/resources/ResourceInspector.js");
include("source/editor/gui/tab/inspector/resources/AudioInspector.js");
include("source/editor/gui/tab/inspector/resources/ImageInspector.js");
include("source/editor/gui/tab/inspector/resources/VideoInspector.js");
include("source/editor/gui/tab/inspector/resources/GeometryInspector.js");

include("source/editor/gui/tab/inspector/objects/ObjectInspector.js");
include("source/editor/gui/tab/inspector/objects/LockedInspector.js");
include("source/editor/gui/tab/inspector/objects/DrawableInspector.js");
include("source/editor/gui/tab/inspector/objects/SceneInspector.js");
include("source/editor/gui/tab/inspector/objects/ScriptInspector.js");
include("source/editor/gui/tab/inspector/objects/ProgramInspector.js");
include("source/editor/gui/tab/inspector/objects/audio/AudioEmitterInspector.js");
include("source/editor/gui/tab/inspector/objects/physics/PhysicsInspector.js");
include("source/editor/gui/tab/inspector/objects/devices/LeapInspector.js");
include("source/editor/gui/tab/inspector/objects/devices/KinectInspector.js");
include("source/editor/gui/tab/inspector/objects/cameras/PerspectiveCameraInspector.js");
include("source/editor/gui/tab/inspector/objects/cameras/OrthographicCameraInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/AmbientLightInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/RectAreaLightInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/HemisphereLightInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/PointLightInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/DirectionalLightInspector.js");
include("source/editor/gui/tab/inspector/objects/lights/SpotLightInspector.js");
include("source/editor/gui/tab/inspector/objects/misc/CubeCameraInspector.js");
include("source/editor/gui/tab/inspector/objects/misc/LensFlareInspector.js");
include("source/editor/gui/tab/inspector/objects/misc/ParticleEmitterInspector.js");
include("source/editor/gui/tab/inspector/objects/misc/SkyInspector.js");
include("source/editor/gui/tab/inspector/objects/spine/SpineInspector.js");
include("source/editor/gui/tab/inspector/objects/text/TextMeshInspector.js");
include("source/editor/gui/tab/inspector/objects/text/TextSpriteInspector.js");
include("source/editor/gui/tab/inspector/objects/text/TextBitmapInspector.js");
include("source/editor/gui/tab/inspector/objects/controls/OrbitControlsInspector.js");
include("source/editor/gui/tab/inspector/objects/controls/FirstPersonControlsInspector.js");

include("source/editor/gui/tab/inspector/objects/mesh/MeshInspector.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/GeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/BoxGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/SphereGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/TorusGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/TorusKnotGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/PlaneGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/ConeGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/CylinderGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/TetrahedronGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/DodecahedronGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/CircleGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/RingGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/IcosahedronGeometryForm.js");
include("source/editor/gui/tab/inspector/objects/mesh/geometry/OctahedronGeometryForm.js");

include("source/editor/gui/preview/PreviewRenderer.js");
include("source/editor/gui/preview/FontRenderer.js");
include("source/editor/gui/preview/MaterialRenderer.js");
include("source/editor/gui/preview/TextureRenderer.js");
include("source/editor/gui/preview/GeometryRenderer.js");
include("source/editor/gui/preview/CubemapFlatRenderer.js");

include("source/editor/gui/DragBuffer.js");

include("source/editor/utils/DOMUtils.js");
include("source/editor/utils/ObjectIcons.js");
include("source/editor/utils/CodemirrorThemes.js");
include("source/editor/utils/VirtualClipboard.js");
include("source/editor/utils/animation/TweenAnimation.js");

include("source/editor/history/History.js");
include("source/editor/history/action/Action.js");
include("source/editor/history/action/ChangeAction.js");
include("source/editor/history/action/ActionBundle.js");
include("source/editor/history/action/CallbackAction.js");
include("source/editor/history/action/objects/AddAction.js");
include("source/editor/history/action/objects/RemoveAction.js");
include("source/editor/history/action/objects/MoveAction.js");
include("source/editor/history/action/objects/SwapAction.js");
include("source/editor/history/action/resources/AddResourceAction.js");
include("source/editor/history/action/resources/RemoveResourceAction.js");

include("source/editor/ResourceUtils.js");
include("source/editor/Settings.js");
include("source/editor/Interface.js");
include("source/editor/MainMenu.js");
include("source/editor/Exporters.js");
include("source/editor/Loaders.js");