YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AmbientLight",
        "ArraybufferUtils",
        "Audio",
        "AudioEmitter",
        "Base64Utils",
        "BufferUtils",
        "CanvasTexture",
        "Container",
        "CubeTexture",
        "DirectionalLight",
        "FileSystem",
        "Fog",
        "Font",
        "HemisphereLight",
        "Image",
        "Key",
        "Keyboard",
        "KinectDevice",
        "LeapMotion",
        "Material",
        "MathUtils",
        "Mesh",
        "Mesh2shape",
        "Mouse",
        "MultiMaterial",
        "Nunu",
        "NunuApp",
        "Object3D",
        "ObjectUtils",
        "OrthographicCamera",
        "ParticleEmitter",
        "PerspectiveCamera",
        "PhysicsObject",
        "PointLight",
        "PositionalAudio",
        "Program",
        "RectAreaLight",
        "Resource",
        "ResourceManager",
        "Scene",
        "Script",
        "SkinnedMesh",
        "Sky",
        "SpineAnimation",
        "SpineTexture",
        "SpotLight",
        "Sprite",
        "Text3D",
        "Texture",
        "Vector3",
        "Video",
        "VideoTexture",
        "WebcamTexture"
    ],
    "modules": [
        "Animations",
        "Audio",
        "BinaryData",
        "Cameras",
        "Core",
        "Devices",
        "Files",
        "Input",
        "Lights",
        "Math",
        "Meshes",
        "Misc",
        "Particles",
        "Physics",
        "Resources",
        "Runtime",
        "Script",
        "Sprite",
        "THREE",
        "Textures"
    ],
    "allModules": [
        {
            "displayName": "Animations",
            "name": "Animations",
            "description": "Spine animation object, to used with animation produced inside Esoteric spine\nBased on the official threejs runtime\nMore information abou spine available here www.esotericsoftware.com"
        },
        {
            "displayName": "Audio",
            "name": "Audio",
            "description": "AudioEmitter is a Object3D used to play audio inside the scene"
        },
        {
            "displayName": "BinaryData",
            "name": "BinaryData",
            "description": "ArraybufferUtils contains methods to convert from and to ArrayBuffer binary format"
        },
        {
            "displayName": "Cameras",
            "name": "Cameras",
            "description": "Orthographic Camera is used for 2D like image projection\nBased on THREE.OrthographicCamera, original documentation available at https://threejs.org/docs/index.html#Reference/Cameras/OrthographicCamera"
        },
        {
            "displayName": "Core",
            "name": "Core",
            "description": "Program class contains all the data of a nunuStudio program.\n\nProgram is also used to store and manage all available resources."
        },
        {
            "displayName": "Devices",
            "name": "Devices",
            "description": "Kinect device object\nThis object is used to connect nunuStudio to a Microsoft Kinect v1, it only works in Microsoft Windows.\nThe operation of the kinect object depends on a server program used to connect to kinect that sends the data to nunuStudio via WebSocket.\nThe server software is available inside the tools folder in the nunuStudio repository."
        },
        {
            "displayName": "Files",
            "name": "Files",
            "description": "FileSystem is used to read and write files using nunuStudio\nSome operations are platform specific and might not work everywhere"
        },
        {
            "displayName": "Input",
            "name": "Input",
            "description": "Key is used by Keyboard, Mouse, etc, to represent a key state"
        },
        {
            "displayName": "Lights",
            "name": "Lights",
            "description": "Same as THREE.AmbientLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/AmbientLight"
        },
        {
            "displayName": "Math",
            "name": "Math",
            "description": "MathUtils contains auxiliar values and function to help with mathematical operations."
        },
        {
            "displayName": "Meshes",
            "name": "Meshes",
            "description": "A Mesh combines a geometry and a material forming a complete rederizable object\n\nBased on THREE.Mesh documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Mesh"
        },
        {
            "displayName": "Misc",
            "name": "Misc",
            "description": "Containers are used to group objects together."
        },
        {
            "displayName": "Particles",
            "name": "Particles",
            "description": "Particle emitter is a wrapper for SPE particle systems\n\nDocumentation for SPE particle engine can be found here https://squarefeet.github.io/ShaderParticleEngine/docs/api/index.html"
        },
        {
            "displayName": "Physics",
            "name": "Physics",
            "description": "Mesh2shape is used to convert ThreeJS objects to CannonJS shapes\nIt is based on the original Mesh2Shape converted by @donmccurdy"
        },
        {
            "displayName": "Resources",
            "name": "Resources",
            "description": "Audio class is used to store audio data as a arraybuffer to be later used by objects with the WebAudio API"
        },
        {
            "displayName": "Runtime",
            "name": "Runtime",
            "description": "NunuApp is used to load .isp files into a webpage, it controls all the runtime elements necessary to embed nunu apps anywhere"
        },
        {
            "displayName": "Script",
            "name": "Script",
            "description": "Script objects are used to control other objects present in the scene\nIt can access and change every object in the program and supports some events\n - initialize\n   - Called on app initialization\n - update\n   - Called on every frame (after the frame is rendered)\n - onMouseOver\n   - Called on every frame if mouse is on top of one of the script children\n - onResize\n   - Called every time the window is resized\n - onAppData\n   - Called when receiving data sent by the host website\n\nCode written inside scripts have access to the following attributes\n - scene\n - program\n - self\n   - Same as this reference but global in the script scope\n - Keyboard\n - Mouse"
        },
        {
            "displayName": "Sprite",
            "name": "Sprite",
            "description": "Sprites allways face the screen are used for 2D elements\nBased on THREE.Sprite documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Sprite"
        },
        {
            "displayName": "Textures",
            "name": "Textures",
            "description": "Canvas textures can be used to draw content to the texture during runtime, using the context property.\n\nCanvas textures always start with black background and a red text \"Canvas Texture\"."
        },
        {
            "displayName": "THREE",
            "name": "THREE",
            "description": "Fog class is used to store fog attributes attached to a Scene\n\nOriginal documentation for linear fog available here https://threejs.org/docs/index.html#Reference/Scenes/Fog and for exponential fog here https://threejs.org/docs/index.html#Reference/Scenes/FogExp2"
        }
    ],
    "elements": []
} };
});