YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "AnimationMixer",
        "AnimationTimer",
        "ArraybufferUtils",
        "Audio",
        "AudioEmitter",
        "AudioLoader",
        "Base64Utils",
        "BloomPass",
        "BokehPass",
        "BufferUtils",
        "ByteArrayUtils",
        "CSS3DObject",
        "CSS3DRenderer",
        "CSS3DSprite",
        "CanvasTexture",
        "ColorifyPass",
        "CompressedTexture",
        "Container",
        "CopyPass",
        "CubeCamera",
        "CubeTexture",
        "DirectionalLight",
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
        "Gyroscope",
        "HemisphereLight",
        "HueSaturationPass",
        "Image",
        "ImageLoader",
        "Key",
        "Keyboard",
        "KinectDevice",
        "LeapMotion",
        "LegacyGeometryLoader",
        "LensFlare",
        "LocalStorage",
        "Material",
        "MaterialLoader",
        "MathUtils",
        "Mesh",
        "Model",
        "Mouse",
        "Nunu",
        "Object3D",
        "ObjectLoader",
        "ObjectUtils",
        "OrbitControls",
        "OrthographicCamera",
        "ParticleEmitter",
        "Pass",
        "PerspectiveCamera",
        "PhysicsGenerator",
        "PhysicsObject",
        "PointLight",
        "PositionalAudio",
        "Program",
        "RectAreaLight",
        "RenderPass",
        "RendererState",
        "Resource",
        "ResourceManager",
        "SSAONOHPass",
        "SSAOPass",
        "SSAOShader",
        "Scene",
        "Script",
        "ShaderPass",
        "Skeleton",
        "SkinnedMesh",
        "Sky",
        "SobelPass",
        "SpineAnimation",
        "SpineTexture",
        "SpotLight",
        "Sprite",
        "SpriteSheetTexture",
        "TechnicolorPass",
        "Text3D",
        "TextFile",
        "Texture",
        "TextureLoader",
        "Timer",
        "TizenKeyboard",
        "Tree",
        "TreeUtils",
        "UnrealBloomPass",
        "VRControls",
        "Video",
        "VideoLoader",
        "VideoStream",
        "VideoTexture",
        "WebcamTexture",
        "YoutubeTexture"
    ],
    "modules": [
        "Animation",
        "Animations",
        "Audio",
        "BinaryUtils",
        "Cameras",
        "Controls",
        "Core",
        "Devices",
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
        "Utils",
        "VirtualReality"
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
            "description": "Spine animation object, to used with animation produced inside Esoteric spine.\n\nBased on the official threejs runtime code available at https://github.com/EsotericSoftware/spine-runtimes.\n\nMore information abou spine available here www.esotericsoftware.com."
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
            "description": "Orthographic Camera is used for 2D like image projection.\n\nBased on THREE.OrthographicCamera, original documentation available at https://threejs.org/docs/index.html#Reference/Cameras/OrthographicCamera."
        },
        {
            "displayName": "Controls",
            "name": "Controls",
            "description": "First person controls can be controlled using the mouse and keyboard.\n\nProvides a navigations system familiar to the one found on FPS games.\n\nThe mouse left button can be used to look around, and the keyboard arrows for movement."
        },
        {
            "displayName": "Core",
            "name": "Core",
            "description": "Program class contains all the data of a nunuStudio program.\n\nProgram is also used to store and manage all available resources."
        },
        {
            "displayName": "Devices",
            "name": "Devices",
            "description": "Kinect device object.\n\nThis object is used to connect nunuStudio to a Microsoft Kinect V1, it only works in Microsoft Windows.\n\nThe operation of the kinect object depends on a server program used to connect to kinect that sends the data to nunuStudio via WebSocket.\n\nThe server software is available inside the tools folder in the nunuStudio repository, and communicates using the port 8181 in the localhost."
        },
        {
            "displayName": "Files",
            "name": "Files",
            "description": "FileSystem is used to read and write files using nunuStudio.\n\nIts implements muitple solutions for each method depending on the platform (NodeJS, brower or cordova).\n\nSome operations are platform specific and might not work everywhere."
        },
        {
            "displayName": "Input",
            "name": "Input",
            "description": "Gamepad provides basic support for gamepads.\n\nSome gamepads require a button press to being detected.\n\nGamepad implementation across browsers is still fragmented, every browser implements it a bit differently, so test it on every target before deploying an application using it.\n\nFor more information about the Gamepad API state take look at the W3C Gamepad API page https://www.w3.org/TR/gamepad/."
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
            "description": "A Mesh combines a geometry and a material forming a complete rederizable object.\n\nBased on THREE.Mesh documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Mesh."
        },
        {
            "displayName": "Misc",
            "name": "Misc",
            "description": "Containers are used to group objects together."
        },
        {
            "displayName": "Particles",
            "name": "Particles",
            "description": "Particle emitter is a wrapper for SPE particle system.\n\nSPE is a threejs based particle emitter engine.\n\nDocumentation for SPE particle engine can be found here https://squarefeet.github.io/ShaderParticleEngine/docs/api/index.html"
        },
        {
            "displayName": "Physics",
            "name": "Physics",
            "description": "Physics generator is used to create Cannon.js shapes from three.js geometries.\n\nCan be used with any object that contains a geometry.\n\nIt is based on the original Mesh2Shape converted by @donmccurdy."
        },
        {
            "displayName": "Postprocessing",
            "name": "Postprocessing",
            "description": "Fast approximate anti-aliasing (FXAA) is an anti-aliasing algorithm to smooth jagged edges on post procesing effects.\n\nMore information about FXAA available here:\n - https://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf"
        },
        {
            "displayName": "Resources",
            "name": "Resources",
            "description": "Video stream resource, used to load streamable video files."
        },
        {
            "displayName": "Runtime",
            "name": "Runtime",
            "description": "nunuStudio\nMIT license (http://opensource.org/licenses/MIT)\n  \nClass used to store nunuStudio development version and timestamp.\n\nContains methods to check browser feature support."
        },
        {
            "displayName": "Script",
            "name": "Script",
            "description": "Script objects are used to control other objects present in the scene.\n\nIt can access and change every object in the program and supports some events\n - initialize\n   - Called on app initialization, its called after all children elements are initialized, its safe to apply operations on other objects inside this method.\n - update(delta)\n   - Called on every frame after rendering\n - dispose\n   - Called when disposing the program\n - onMouseOver(intersections)\n   - Called on every frame if mouse is on top of one of the script children\n   - Receives an intersections array as argument.\n - onResize(x, y)\n   - Called every time the window is resized\n   - Receives width and height as parameters\n - onAppData(data)\n   - Called when receiving data sent by the host website\n\nCode written inside scripts have access to the following attributes:\n - scene\n - program\n - self\n   - Same as this reference but global in the script scope\n - Keyboard\n - Mouse\n\nThere is also access to the following functions\n - include\n   - Include a javascript file from resources, when including files the user needs to be carefull and clear manually global declarations"
        },
        {
            "displayName": "Sprite",
            "name": "Sprite",
            "description": "Sprites allways face the screen are used for 2D elements.\n\nBased on THREE.Sprite documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Sprite."
        },
        {
            "displayName": "Textures",
            "name": "Textures",
            "description": "Canvas textures can be used to draw content to the texture during runtime, using the context property.\n\nCanvas textures always start with black background and a red text \"Canvas Texture\"."
        },
        {
            "displayName": "THREE",
            "name": "THREE",
            "description": "This is the base class for most objects in three.js and provides a set of properties and methods for manipulating objects in 3D space.\n\nThis page provides documentation for some of the main features of this class, the original documentation of this class can be found at https://threejs.org/docs/index.html#Reference/Core/Object3D.\n\nAll nunuStudio objects extend the Object3D class of some other higher level class from three.js."
        },
        {
            "displayName": "Utils",
            "name": "Utils",
            "description": "EventManager is used to manager DOM events creationg and destruction in a single function call.\n\nIt is used by objects to make it easier to add and remove events from global DOM objects."
        },
        {
            "displayName": "VirtualReality",
            "name": "VirtualReality",
            "description": "VRControl is used to get input from an HDM device and apply it to an Object."
        }
    ],
    "elements": []
} };
});