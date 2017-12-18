YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "ArraybufferUtils",
        "Audio",
        "AudioEmitter",
        "AudioLoader",
        "Base64Utils",
        "BokehPass",
        "BufferUtils",
        "ByteArrayUtils",
        "CanvasTexture",
        "ColorifyPass",
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
        "LensFlare",
        "LensFlare.Flare",
        "Material",
        "MaterialLoader",
        "MathUtils",
        "Mesh",
        "Mesh2shape",
        "Model",
        "Mouse",
        "MultiMaterial",
        "Nunu",
        "NunuApp",
        "Object3D",
        "ObjectLoader",
        "ObjectUtils",
        "OrbitControls",
        "OrthographicCamera",
        "ParticleEmitter",
        "Pass",
        "PerspectiveCamera",
        "PhysicsObject",
        "PointLight",
        "PositionalAudio",
        "Program",
        "RectAreaLight",
        "RenderPass",
        "Resource",
        "ResourceManager",
        "RoundedBoxBufferGeometry",
        "SSAOPass",
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
        "Tree",
        "TreeUtils",
        "UnrealBloomPass",
        "VRControls",
        "Vector3",
        "Video",
        "VideoLoader",
        "VideoTexture",
        "WebcamTexture"
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
        "Geometry",
        "Input",
        "Lights",
        "Loaders",
        "Math",
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
            "description": "FileSystem is used to read and write files using nunuStudio.\n\nSome operations are platform specific and might not work everywhere."
        },
        {
            "displayName": "Geometry",
            "name": "Geometry",
            "description": "RoundedBox Buffer Geometry.\n\nCreates a box with rounded corners, with normals.\n\nThere is no UV coordinates."
        },
        {
            "displayName": "Input",
            "name": "Input",
            "description": "Gamepad provides basic support for gamepads.\n\nSome gamepads require a button press to being detected.\n\nGamepad implementation across browsers is still fragmented, every browser implements it a bit differently, so test it on every target before deploying an application using it.\n\nFor more information about the Gamepad API state take look at the W3C Gamepad API page https://www.w3.org/TR/gamepad/."
        },
        {
            "displayName": "Lights",
            "name": "Lights",
            "description": "Ambient lights are used to create base ilumanition for the scene.\n\nThey are not influenced by position, scale or rotation.\n\nBased on THREE.AmbientLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/AmbientLight"
        },
        {
            "displayName": "Loaders",
            "name": "Loaders",
            "description": "Audio loader can be used to load external audio resources."
        },
        {
            "displayName": "Math",
            "name": "Math",
            "description": "Class representing a 3D vector. A 3D vector is an ordered triplet of numbers (labeled x, y, and z), which can be used to represent a number of things, such as:\n\n - A point in 3D space.\n - A direction and length in 3D space. In three.js the length will always be the Euclidean distance (straight-line distance) from (0, 0, 0) to (x, y, z) and the direction is also measured from (0, 0, 0) towards (x, y, z).\n - Any arbitrary ordered triplet of numbers.\n\nThere are other things a 3D vector can be used to represent, such as momentum vectors and so on, however these are the most common uses in three.js.\n\nOriginal documentation for Vector3 can be found here https://threejs.org/docs/index.html#Reference/Math/Vector3"
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
            "description": "Mesh2shape is used to convert ThreeJS objects to CannonJS shapes.\n\nIt is based on the original Mesh2Shape converted by @donmccurdy."
        },
        {
            "displayName": "Postprocessing",
            "name": "Postprocessing",
            "description": "Generate a texture that represents the luminosity of the current scene, adapted over time\nto simulate the optic nerve responding to the amount of light it is receiving.\nBased on a GDC2007 presentation by Wolfgang Engel titled \"Post-Processing Pipeline\"\n\nFull-screen tone-mapping shader based on http://www.graphics.cornell.edu/~jaf/publications/sig02_paper.pdf\n\nclass AdaptiveToneMappingPass"
        },
        {
            "displayName": "Resources",
            "name": "Resources",
            "description": "Audio class is used to store audio data as a arraybuffer to be later used by objects with the WebAudio API."
        },
        {
            "displayName": "Runtime",
            "name": "Runtime",
            "description": "NunuApp is the main class of the runtime system, is used to embed nunu application into a webpage.\n\n.isp files can be loaded directly into webpages."
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
            "description": "Fog class is used to store fog attributes attached to a Scene\n\nOriginal documentation for fog available here https://threejs.org/docs/index.html#Reference/Scenes/Fog and for exponential fog here https://threejs.org/docs/index.html#Reference/Scenes/FogExp2"
        },
        {
            "displayName": "Utils",
            "name": "Utils",
            "description": "ObjectUtils is a collection of methods to apply operations to Object3D objects"
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