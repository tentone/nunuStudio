"use strict";

//Runtime
include("lib/three/three.min.js");

include("lib/three/QuickHull.js");
include("lib/three/SimplexNoise.js");

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
include("lib/SPE.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");

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

include("source/core/postprocessing/RendererState.js");
include("source/core/postprocessing/Pass.js");
include("source/core/postprocessing/ShaderPass.js");
include("source/core/postprocessing/EffectComposer.js");

include("source/core/postprocessing/pass/antialiasing/FXAAPass.js");
include("source/core/postprocessing/pass/RenderPass.js");
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
include("source/core/objects/text/TextMesh.js");
include("source/core/objects/text/TextBitmap.js");
include("source/core/objects/sprite/Sprite.js");

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
include("source/core/objects/particle/ParticleEmitter.js");
include("source/core/objects/misc/Sky.js");
include("source/core/objects/misc/Container.js");
include("source/core/objects/misc/CubeCamera.js");
include("source/core/objects/misc/LensFlare.js");
include("source/core/objects/animation/Skeleton.js");
include("source/core/objects/controls/OrbitControls.js");
include("source/core/objects/controls/FirstPersonControls.js");
include("source/core/objects/RendererConfiguration.js");
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

/**
 * nunuStudio main editor entry point. 
 *
 * @class Editor 
 */
function Editor(){}

//Editor
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
include("lib/three/exporters/ColladaExporter.js");
include("lib/three/exporters/PLYExporter.js");

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
include("source/editor/gui/tab/animation/AnimationOptions.js");
include("source/editor/gui/tab/animation/AnimationButton.js");
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

include("source/editor/gui/tab/panel/PanelContainer.js");
include("source/editor/gui/tab/panel/Panel.js");

include("source/editor/gui/tab/panel/textures/TexturePanel.js");

include("source/editor/gui/tab/panel/materials/MaterialPanel.js");

include("source/editor/gui/tab/panel/resources/ResourcePanel.js");
include("source/editor/gui/tab/panel/resources/AudioPanel.js");
include("source/editor/gui/tab/panel/resources/ImagePanel.js");
include("source/editor/gui/tab/panel/resources/VideoPanel.js");

include("source/editor/gui/tab/panel/objects/ObjectPanel.js");
include("source/editor/gui/tab/panel/objects/LockedPanel.js");
include("source/editor/gui/tab/panel/objects/DrawablePanel.js");
include("source/editor/gui/tab/panel/objects/ScenePanel.js");
include("source/editor/gui/tab/panel/objects/ScriptPanel.js");
include("source/editor/gui/tab/panel/objects/ProgramPanel.js");
include("source/editor/gui/tab/panel/objects/audio/AudioEmitterPanel.js");
include("source/editor/gui/tab/panel/objects/physics/PhysicsPanel.js");
include("source/editor/gui/tab/panel/objects/devices/LeapPanel.js");
include("source/editor/gui/tab/panel/objects/devices/KinectPanel.js");
include("source/editor/gui/tab/panel/objects/cameras/PerspectiveCameraPanel.js");
include("source/editor/gui/tab/panel/objects/cameras/OrthographicCameraPanel.js");
include("source/editor/gui/tab/panel/objects/lights/AmbientLightPanel.js");
include("source/editor/gui/tab/panel/objects/lights/RectAreaLightPanel.js");
include("source/editor/gui/tab/panel/objects/lights/HemisphereLightPanel.js");
include("source/editor/gui/tab/panel/objects/lights/PointLightPanel.js");
include("source/editor/gui/tab/panel/objects/lights/DirectionalLightPanel.js");
include("source/editor/gui/tab/panel/objects/lights/SpotLightPanel.js");
include("source/editor/gui/tab/panel/objects/misc/CubeCameraPanel.js");
include("source/editor/gui/tab/panel/objects/misc/LensFlarePanel.js");
include("source/editor/gui/tab/panel/objects/misc/ParticleEmitterPanel.js");
include("source/editor/gui/tab/panel/objects/misc/SkyPanel.js");
include("source/editor/gui/tab/panel/objects/spine/SpinePanel.js");
include("source/editor/gui/tab/panel/objects/text/TextMeshPanel.js");
include("source/editor/gui/tab/panel/objects/controls/OrbitControlsPanel.js");
include("source/editor/gui/tab/panel/objects/controls/FirstPersonControlsPanel.js");

include("source/editor/gui/tab/panel/objects/mesh/MeshPanel.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/GeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/BoxGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/SphereGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/TorusGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/TorusKnotGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/PlaneGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/ConeGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/CylinderGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/TetrahedronGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/DodecahedronGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/CircleGeometryForm.js");
include("source/editor/gui/tab/panel/objects/mesh/geometry/RingGeometryForm.js");

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

include("source/editor/Settings.js");
include("source/editor/Interface.js");
include("source/editor/MainMenu.js");
include("source/editor/Exporters.js");
include("source/editor/Loaders.js");

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
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Global.FILE_PATH + "tern/threejs.json")));
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Global.FILE_PATH + "tern/browser.json")));
	Editor.ternDefinitions.push(JSON.parse(FileSystem.readFile(Global.FILE_PATH + "tern/ecmascript.json")));

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
		var allowedKeys = [Keyboard.C, Keyboard.V, Keyboard.A, Keyboard.X];
		document.onkeydown = function(event)
		{
			//If F1-F11 or CTRL+Key prevent default action
			if((event.keyCode > Keyboard.F1 && event.keyCode < Keyboard.F11) || (!event.altKey && event.ctrlKey && allowedKeys.indexOf(event.keyCode) === -1))
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
			if(key === Keyboard.S)
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
			Editor.runProject();
		}
	});
	Editor.manager.create();
};

/** 
 * Run the project that is currently open in the editor.
 *
 * Opens a new tab, and sets the run button text.
 *
 * @method runProject
 */
Editor.runProject = function()
{
	var tab = Editor.gui.tab.getTab(RunProject, Editor.program);

	if(tab === null)
	{
		tab = Editor.gui.tab.addTab(RunProject, true);
		tab.select();
		Editor.gui.menuBar.run.setText(Locale.stop);
	}
	else
	{
		tab.close();
		Editor.gui.menuBar.run.setText(Locale.run);
	}
};

/**
 * Select single object.
 * 
 * @method selectObject
 * @param {THREE.Object3D} object Object to select.
 */
Editor.selectObject = function(object)
{
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].gui !== undefined && Editor.selection[i].gui.node !== undefined)
		{
			Editor.selection[i].gui.node.setSelected(false);
		}
	}

	Editor.selection = [object];

	if(object.gui !== undefined && object.gui.node !== undefined)
	{
		if(object.gui.node.setSelected !== undefined)
		{
			object.gui.node.setSelected(true);
		}
		if(object.gui.node.expandToRoot !== undefined)
		{
			object.gui.node.expandToRoot();
		}
	}

	Editor.updateSelectionGUI();
};

/** 
 * Add object to selection.
 * 
 * @method addToSelection
 * @param {THREE.Object3D} object Object to add to selection.
 * @param {Boolean} updateClient If false does not update the management client.
 */
Editor.addToSelection = function(object)
{
	Editor.selection.push(object);

	if(object.gui !== undefined && object.gui.node !== undefined)
	{
		if(object.gui.node.setSelected !== undefined)
		{
			object.gui.node.setSelected(true);
		}
		if(object.gui.node.expandToRoot !== undefined)
		{
			object.gui.node.expandToRoot();
		}
	}

	Editor.updateSelectionGUI();
};

/**
 * Remove from selection.
 * 
 * @method unselectObject
 * @param {THREE.Object3D} object Object to remove from selection.
 */
Editor.unselectObject = function(object)
{
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].uuid === object.uuid)
		{
			if(Editor.selection[i].gui !== undefined && Editor.selection[i].gui.node !== undefined)
			{
				if(Editor.selection[i].gui.node.setSelected !== undefined)
				{
					Editor.selection[i].gui.node.setSelected(false);
				}
			}
			
			Editor.selection.splice(i, 1);
			Editor.updateSelectionGUI();
			return;
		}
	}
};

/**
 * Check if a object is selected.
 * 
 * @method isSelected
 * @param {THREE.Object3D} Check if object is selected.
 */
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

/** 
 * Resize the editor to fit the document body.
 *
 * @method resize
 */
Editor.resize = function()
{
	if(!Nunu.isFullscreen())
	{
		Editor.gui.updateInterface();
	}
};

/**
 * Check if there is some object selected.
 *
 * @method hasObjectSelected
 * @return {Boolean} True if there is an object selected.
 */
Editor.hasObjectSelected = function()
{
	return Editor.selection.length > 0;
};

/**
 * Clear object selection.
 * 
 * @method clearSelection
 */
Editor.clearSelection = function()
{
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].gui !== undefined && Editor.selection[i].gui.node !== undefined)
		{
			if(Editor.selection[i].gui.node.setSelected !== undefined)
			{
				Editor.selection[i].gui.node.setSelected(false);
			}
		}
	}

	Editor.selection = [];
};

/**
 * Add action to history.
 *
 * Automatically calls the change method of GUI elements.
 * 
 * @method addAction
 * @param {Action} action Action to add to the history.
 */
Editor.addAction = function(action)
{
	Editor.history.add(action);
};

/**
 * Get currently active scene in the editor.
 *
 * @method getScene
 * @return {Scene} The scene currently active in the editor, null if none available.
 */
Editor.getScene = function()
{
	if(Editor.program.children.length > 0)
	{
		return Editor.program.children[0];
	}

	return null;
};

/**
 * Add objects to the actual scene, and creates an action in the editor history. 
 * 
 * @method addObject
 * @param {Object3D} object Object to be added.
 * @param {Object3D} parent Parent object, if undefined the program scene is used.
 */
Editor.addObject = function(object, parent)
{
	if(parent === undefined)
	{
		parent = Editor.getScene();
	}

	var actions = [new AddAction(object, parent)];
	var resources = ResourceManager.searchObject(object, Editor.program);

	for(var category in resources)
	{
		for(var resource in resources[category])
		{
			actions.push(new AddResourceAction(resources[category][resource], Editor.program, category));
		}
	}

	Editor.addAction(new ActionBundle(actions));
};

/**
 * Rename object, if none passed as argument selected object is used.
 *
 * @method renameObject
 * @param {Object3D} object Object to be renamed.
 */
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
		var name = Editor.prompt(Locale.renameObject, object.name);
		if(name !== null && name !== "")
		{
			Editor.addAction(new ChangeAction(object, "name", name));
		}
	}
};


/**
 * Delete object from the editor, and creates an action in the editor history. 
 * 
 * @method deleteObject
 * @param {Array} objects List of objects.
 */
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
			actions.push(new RemoveAction(selected[i]));
		}
		//Material
		else if(selected[i] instanceof THREE.Material)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "materials"));
		}
		//Texture
		else if(selected[i] instanceof THREE.Texture)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "textures"));
		}
		//Font
		else if(selected[i] instanceof Font)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "fonts"));
		}
		//Audio
		else if(selected[i] instanceof Audio)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "audio"));
		}
		//Video
		else if(selected[i] instanceof Video)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "videos"));
		}
		//Geometries
		else if(selected[i] instanceof THREE.Geometry || selected[i] instanceof THREE.BufferGeometry)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "geometries"));
		}
		//Shapes
		else if(selected[i] instanceof THREE.Shape)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "shapes"));
		}
		//Resources
		else if(selected[i] instanceof Resource)
		{
			Editor.addAction(new RemoveResourceAction(selected[i], Editor.program, "resources"));
		}
		//Unknown
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

/**
 * Copy selected object to the clipboard.
 *
 * Uses the JSON serialization of the object.
 *
 * @method copyObject
 * @param {Object3D} object Object to copy.
 */
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

/**
 * Cut selected object, copy to the clipboard and delete it.
 *
 * Uses the JSON serialization of the object.
 *
 * @method copyObject
 * @param {Object3D} object Object to copy.
 */
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
		Editor.addAction(new RemoveAction(object));
	}
};

/**
 * Paste object as children of target object.
 *
 * @method pasteObject
 * @param {Object3D} parent
 */
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
			Editor.addObject(obj, target);
		}
		else
		{
			Editor.addObject(obj);
		}
	}
	catch(e)
	{
		Editor.alert(Locale.errorPaste);
	}
};

/**
 * Redo history action.
 * 
 * @method redo
 */
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

/**
 * Undo history action.
 * 
 * @method undo
 */
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

/**
 * Create default resouces to be used when creating new objects.
 *
 * @method createDefaultResouces
 */
Editor.createDefaultResouces = function()
{
	Editor.defaultImage = new Image(Global.FILE_PATH + "default.png");
	Editor.defaultFont = new Font(Global.FILE_PATH + "default.json");
	Editor.defaultAudio = new Audio(Global.FILE_PATH + "default.mp3");

	Editor.defaultTexture = new Texture(Editor.defaultImage);
	Editor.defaultTexture.name = "default";

	Editor.defaultTextureParticle = new Texture(new Image(Global.FILE_PATH + "particle.png"));
	Editor.defaultTextureParticle.name = "particle";

	Editor.defaultMaterial = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
	Editor.defaultMaterial.name = "default";
	
	Editor.defaultSpriteMaterial = new THREE.SpriteMaterial({map: Editor.defaultTexture, color: 0xffffff});
	Editor.defaultSpriteMaterial.name = "default";

	Editor.defaultTextureLensFlare = [];
	for(var i = 0; i < 4; i++)
	{
		var texture = new Texture(new Image(Global.FILE_PATH + "lensflare/lensflare" + i + ".png"));
		texture.name = "lensflare" + i;
		Editor.defaultTextureLensFlare.push(texture);
	}
};

Editor.updateSettings = function()
{
	Editor.gui.tab.updateSettings();
};

/**
 * Update all object views
 *
 * @method updateObjectsViewsGUI
 */
Editor.updateObjectsViewsGUI = function()
{
	Editor.gui.tab.updateObjectsView();
	Editor.gui.tab.updateMetadata();
};

/**
 * Update tabs after changing selection.
 *
 * @method updateSelectionGUI
 */
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

	Editor.gui.tab.updateObjectsView();
	Editor.gui.tab.updateMetadata();
	Editor.gui.tab.updateSelection();
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

/**
 * Save program to file.
 *
 * @method saveProgram
 * @param {String} fname
 * @param {Boolean} binary If true the file is saved as nsp.
 * @param {Boolean} keepDirectory
 * @param {Boolean} supressMessage
 */
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

/**
 * Set a program to be edited, create new history object and clear editor windows.
 *
 * @method setProgram
 * @param {Program} program
 */
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
		Editor.gui.tree.attach(Editor.program);
		Editor.gui.assetExplorer.attach(Editor.program);

		//History
		Editor.history = new History(Editor.settings.general.historySize);
		
		//Clear tabs
		Editor.gui.tab.clear();

		//Reset editor
		Editor.resetEditor();

		//Add new scene tab to interface
		if(program.children.length > 0)
		{
			var scene = Editor.gui.tab.addTab(SceneEditor, true);
			scene.attach(program.children[0]);
		}
	}
};

/**
 * Load program from file.
 *
 * Programs can be stored as textual json files, or PSON files (binary).
 *
 * @method loadProgram
 * @param {File} file
 * @param {Boolean} binary Indicates if the file is binary.
 */
Editor.loadProgram = function(file, binary)
{
	var modal = new LoadingModal(DocumentBody);
	modal.show();

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

		modal.destroy();
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

/**
 * Set currently open file (also updates the editor title), if running in browser is not used.
 *
 * Used for the editor to remember the file location that it is currently working on.
 *
 * @method setOpenFile
 * @param {String} file Path of file currently open.
 */
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

/**
 * Show a confirm dialog with a message.
 *
 * @method confirm
 * @param {String} message
 * @return {Boolean} True or false depending on the confirm result.
 */
Editor.confirm = function(message)
{
	return window.confirm(message);	
};

/**
 * Show a alert dialog with a message.
 *
 * @method confirm
 * @param {String} message
 */
Editor.alert = function(message)
{
	window.alert(message);
};

/**
 * Prompt the user for a value.
 *
 * @method confirm
 * @param {String} message
 * @param {String} defaultValue
 * @return {String} Value inserted by the user.
 */
Editor.prompt = function(message, defaultValue)
{
	return window.prompt(message, defaultValue);	
};

/**
 * Try to update nunuStudio editor version using build from github repo.
 *
 * The version timestamp (Nunu.TIMESTAMP) is parsed compared to the local timestamp.
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
