YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ARHandler",
        "AfterimagePass",
        "AmbientLight",
        "AnimationMixer",
        "AnimationTimer",
        "App",
        "ArraybufferUtils",
        "Audio",
        "AudioEmitter",
        "AudioLoader",
        "Base64Utils",
        "BaseNode",
        "BillboardGroup",
        "BloomPass",
        "BokehPass",
        "BufferUtils",
        "ByteArrayUtils",
        "CSS3DObject",
        "CSS3DRenderer",
        "CSS3DSprite",
        "CanvasSprite",
        "CanvasTexture",
        "CapsuleBufferGeometry",
        "ColorifyPass",
        "CompressedTexture",
        "CopyPass",
        "CubeCamera",
        "CubeTexture",
        "DataTexture",
        "DirectionalLight",
        "DirectionalLightCSM",
        "DotScreenPass",
        "EffectComposer",
        "EventManager",
        "FXAAPass",
        "FileSystem",
        "FilmPass",
        "FirstPersonControls",
        "Fog",
        "Font",
        "FontLoader",
        "Gamepad",
        "GeometryLoader",
        "Group",
        "Gyroscope",
        "HTMLView",
        "HemisphereLight",
        "HueSaturationPass",
        "Image",
        "ImageLoader",
        "InstancedMesh",
        "Key",
        "Keyboard",
        "LegacyGeometryLoader",
        "LensFlare",
        "LightProbe",
        "LocalStorage",
        "Material",
        "MaterialLoader",
        "MathUtils",
        "Mesh",
        "Model",
        "Mouse",
        "NodeScript",
        "Nunu",
        "Object3D",
        "ObjectLoader",
        "ObjectUtils",
        "OperationNode",
        "OrbitControls",
        "OrthographicCamera",
        "ParametricBufferGeometry",
        "ParticleDistributions",
        "ParticleEmitter",
        "ParticleEmitterControl",
        "ParticleEmitterControlOptions",
        "ParticleGroup",
        "Pass",
        "PerspectiveCamera",
        "PhysicsGenerator",
        "PhysicsObject",
        "PointLight",
        "PositionalAudio",
        "Program",
        "PythonScript",
        "RectAreaLight",
        "RenderPass",
        "RendererConfiguration",
        "RendererState",
        "Resource",
        "ResourceManager",
        "RoundedBoxBufferGeometry",
        "SSAONOHPass",
        "SSAOPass",
        "SSAOShader",
        "Scene",
        "Script",
        "ShaderAttribute",
        "ShaderPass",
        "ShaderUtils",
        "SimplexNoise",
        "Skeleton",
        "SkinnedMesh",
        "Sky",
        "SobelPass",
        "SpineAnimation",
        "SpineTexture",
        "SpotLight",
        "Sprite",
        "SpriteSheetTexture",
        "TargetConfig",
        "TechnicolorPass",
        "TerrainBufferGeometry",
        "TextBitmap",
        "TextFile",
        "TextMesh",
        "TextSprite",
        "Texture",
        "TextureLoader",
        "Timer",
        "TizenKeyboard",
        "Tree",
        "TreeUtils",
        "TwistModifier",
        "TypedArrayHelper",
        "UnitConverter",
        "UnrealBloomPass",
        "VRHandler",
        "Video",
        "VideoLoader",
        "VideoStream",
        "VideoTexture",
        "Viewport",
        "WebcamTexture",
        "WorkerPool",
        "WorkerTask",
        "{Object} ParticleGroupOptions"
    ],
    "modules": [
        "Animation",
        "Animations",
        "Audio",
        "BinaryUtils",
        "Cameras",
        "Controls",
        "Core",
        "Files",
        "Input",
        "Lights",
        "Loaders",
        "Meshes",
        "Misc",
        "Particles",
        "Physics",
        "Postprocessing",
        "Resources",
        "Runtime",
        "Script",
        "Sprite",
        "THREE",
        "Textures",
        "Utils"
    ],
    "allModules": [
        {
            "displayName": "Animation",
            "name": "Animation",
            "description": "Use an array of bones to create a skeleton that can be used by a SkinnedMesh."
        },
        {
            "displayName": "Animations",
            "name": "Animations",
            "description": "Spine animation object, to used with animation produced inside Esoteric spine. These animations are created using the Spine animation studio software.\n\nBased on the official three.js runtime code available at https:// github.com/EsotericSoftware/spine-runtimes.\n\nMore information about spine available at www.esotericsoftware.com."
        },
        {
            "displayName": "Audio",
            "name": "Audio",
            "description": "AudioEmitter is a Object3D used to play audio inside the scene."
        },
        {
            "displayName": "BinaryUtils",
            "name": "BinaryUtils",
            "description": "ArraybufferUtils contains methods to convert from and to ArrayBuffer binary format"
        },
        {
            "displayName": "Cameras",
            "name": "Cameras",
            "description": "Orthographic Camera is used for 2D like image projection.\n\nBased on OrthographicCamera, original documentation available at https:// threejs.org/docs/index.html#Reference/Cameras/OrthographicCamera."
        },
        {
            "displayName": "Controls",
            "name": "Controls",
            "description": "First person controls can be controlled using the mouse and keyboard.\n\nProvides a navigations system familiar to the one found on FPS games.\n\nThe mouse left button can be used to look around, and the keyboard arrows for movement."
        },
        {
            "displayName": "Core",
            "name": "Core",
            "description": "Program class contains all the data of a app.\n\nIs stores and manages all available resources used by the children objects.\n\nIs responsible for handling runtime tasks, initialization, update, resizes etc."
        },
        {
            "displayName": "Files",
            "name": "Files",
            "description": "FileSystem is used to read and write files using nunuStudio.\n\nIts implements multiple solutions for each method depending on the platform (NodeJS, brower or cordova).\n\nSome operations are platform specific and might not work everywhere."
        },
        {
            "displayName": "Input",
            "name": "Input",
            "description": "Gamepad provides basic support for gamepads.\n\nSome gamepads require a button press to being detected.\n\nGamepad implementation across browsers is still fragmented, every browser implements it a bit differently, so test it on every target before deploying an application using it.\n\nFor more information about the Gamepad API state take look at the W3C Gamepad API page https:// www.w3.org/TR/gamepad/."
        },
        {
            "displayName": "Lights",
            "name": "Lights",
            "description": "Sky class if composed of a HemisphereLight, DirectionalLight and a dynamic generated Sky sphere geometry.\n\nThis object is composed by 3 internal objects\n\t- Hemisphere light\n\t- Directional Light\n\t- Mesh"
        },
        {
            "displayName": "Loaders",
            "name": "Loaders",
            "description": "Audio loader can be used to load external audio resources."
        },
        {
            "displayName": "Meshes",
            "name": "Meshes",
            "description": "Special mesh type used to draw 3D text.\n\nIt receives a Font resource that is used to triangulate and extrude font data into a 3D mesh."
        },
        {
            "displayName": "Misc",
            "name": "Misc",
            "description": "Groups are used to group objects together.\n\nThey are not drawn in the scene are just used as logic containers."
        },
        {
            "displayName": "Particles",
            "name": "Particles",
            "description": "Particle emitter is a wrapper for SPE particle system.\n\nSPE is a threejs based particle emitter engine.\n\nDocumentation for SPE particle engine can be found here https:// squarefeet.github.io/ShaderParticleEngine/docs/api/index.html"
        },
        {
            "displayName": "Physics",
            "name": "Physics",
            "description": "Physics generator is used to create Cannon.js shapes from three.js geometries.\n\nCan be used with any object that contains a geometry.\n\nIt is based on the original Mesh2Shape converted by @donmccurdy."
        },
        {
            "displayName": "Postprocessing",
            "name": "Postprocessing",
            "description": "Fast approximate anti-aliasing (FXAA) is an anti-aliasing algorithm to smooth jagged edges on post procesing effects.\n\nMore information about FXAA available here:\n - https:// developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf"
        },
        {
            "displayName": "Resources",
            "name": "Resources",
            "description": "Audio class is used to store audio data as a arraybuffer to be later used by objects with the WebAudio API."
        },
        {
            "displayName": "Runtime",
            "name": "Runtime",
            "description": "nunuStudio core main file.\n\nStore development version, timestamp and contains global method to check browser feature support."
        },
        {
            "displayName": "Script",
            "name": "Script",
            "description": "Base node are used as a basis for all other nodes, they implement the necessary common functionality for all nodes.\n\nBase nodes add a destructible function with a button which allows the user to destroy them.\n\nWhen the node gets destroyed it automatically gets removed from the graph."
        },
        {
            "displayName": "Sprite",
            "name": "Sprite",
            "description": "Sprites always face the screen are used for 2D elements.\n\nBased on Sprite documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Objects/Sprite."
        },
        {
            "displayName": "Textures",
            "name": "Textures",
            "description": "Canvas textures can be used to draw content to the texture during runtime, using the context property.\n\nCanvas textures always start with black background and a red text \"Canvas Texture\"."
        },
        {
            "displayName": "THREE",
            "name": "THREE",
            "description": "Fog class is used to store fog attributes attached to a Scene\n\nOriginal documentation for fog available here https:// threejs.org/docs/index.html#Reference/Scenes/Fog and for exponential fog here https:// threejs.org/docs/index.html#Reference/Scenes/FogExp2"
        },
        {
            "displayName": "Utils",
            "name": "Utils",
            "description": "EventManager is used to manager DOM events creationg and destruction in a single function call.\n\nIt is used by objects to make it easier to add, manager and remove events from DOM elements."
        }
    ],
    "elements": []
} };
});