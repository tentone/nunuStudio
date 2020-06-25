"use strict";

// Runtime libs
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

include("lib/three/lights/LightProbeGenerator.js");

include("lib/three/curves/NURBSCurve.js");
include("lib/three/curves/NURBSSurface.js");
include("lib/three/curves/NURBSUtils.js");

include("lib/three/objects/Lensflare.js");

include("lib/three/loaders/TTFLoader.js");

include("lib/pson/bytebuffer.min.js");
include("lib/pson/long.min.js");
include("lib/pson/PSON.min.js");

include("lib/octree/sparse-octree.min.js");

include("lib/three-bmfont.js");
include("lib/cannon.js");
include("lib/leap.min.js");
include("lib/spine-threejs.js");
include("lib/opentype.min.js");
include("lib/chevrotain.min.js");

// Threejs Overrides
include("source/core/three/animation/KeyframeTrack.js");
include("source/core/three/animation/AnimationClip.js");

include("source/core/three/core/Object3D.js");
include("source/core/three/core/BufferAttribute.js");
include("source/core/three/core/InterleavedBufferAttribute.js");
include("source/core/three/core/InterleavedBuffer.js");
include("source/core/three/core/InstancedBufferAttribute.js");

include("source/core/three/loaders/BufferGeometryLoader.js");

include("source/core/three/cameras/Camera.js");
include("source/core/three/materials/Material.js");
include("source/core/three/textures/Texture.js");
include("source/core/three/lights/LightShadow.js");
include("source/core/three/scenes/Fog.js");

include("source/core/three/objects/Points.js");
include("source/core/three/objects/Skeleton.js");

// Runtime core
include("source/core/Nunu.js");

include("source/core/FileSystem.js");
include("source/core/platform/TargetConfig.js");

include("source/core/animation/AnimationMixer.js");

include("source/core/input/Key.js");
include("source/core/input/Keyboard.js");
include("source/core/input/TizenKeyboard.js");
include("source/core/input/Mouse.js");
include("source/core/input/Gamepad.js");
include("source/core/input/Gyroscope.js");

include("source/core/renderer/RendererState.js");
include("source/core/renderer/RendererConfiguration.js");
include("source/core/renderer/css/CSS3DRenderer.js");
include("source/core/renderer/css/CSS3DObject.js");
include("source/core/renderer/css/CSS3DSprite.js");

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

include("source/core/resources/Resource.js");
include("source/core/resources/Font.js");
include("source/core/resources/Video.js");
include("source/core/resources/Audio.js");
include("source/core/resources/Image.js");
include("source/core/resources/Model.js");
include("source/core/resources/TextFile.js");
include("source/core/resources/ResourceContainer.js");
include("source/core/resources/ResourceManager.js");
include("source/core/resources/stream/VideoStream.js");

include("source/core/texture/Texture.js");
include("source/core/texture/CanvasTexture.js");
include("source/core/texture/VideoTexture.js");
include("source/core/texture/WebcamTexture.js");
include("source/core/texture/CubeTexture.js");
include("source/core/texture/DataTexture.js");
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

include("source/core/geometries/CapsuleBufferGeometry.js");
include("source/core/geometries/RoundedBoxBufferGeometry.js");
include("source/core/geometries/TerrainBufferGeometry.js");

include("source/core/objects/device/LeapMotion.js");

include("source/core/objects/device/LeapMotion.js");
include("source/core/objects/device/KinectDevice.js");

include("source/core/objects/mesh/Mesh.js");
include("source/core/objects/mesh/SkinnedMesh.js");
include("source/core/objects/mesh/InstancedMesh.js");

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
include("source/core/objects/lights/LightProbe.js");

include("source/core/objects/cameras/Viewport.js");
include("source/core/objects/cameras/PerspectiveCamera.js");
include("source/core/objects/cameras/OrthographicCamera.js");
include("source/core/objects/cameras/CubeCamera.js");

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
include("source/core/objects/misc/LensFlare.js");
include("source/core/objects/misc/HTMLView.js");

include("source/core/objects/controls/OrbitControls.js");
include("source/core/objects/controls/FirstPersonControls.js");

include("source/core/objects/Program.js");
include("source/core/objects/Scene.js");

include("source/core/utils/worker/WorkerTask.js");
include("source/core/utils/worker/WorkerPool.js");

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
include("source/core/utils/UnitConverter.js");