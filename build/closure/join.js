"use strict";

var path = "../../source/";
var code = "";

include("App.js");
include("core/three/Three.js");
include("core/three/Object3D.js");
include("core/three/Vector3.js");
include("core/three/Vector2.js");
include("core/three/Color.js");
include("core/three/Texture.js");
include("core/three/LightShadow.js");
include("core/three/Fog.js");
include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");
include("core/webvr/VRControls.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/texture/TextTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/Texture.js");
include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/ObjectLoader.js");
include("core/loaders/TTFLoader.js");
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
include("core/objects/lights/Sky.js");
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");
include("core/objects/audio/AudioEmitter.js");
include("core/objects/script/Script.js");
include("core/objects/script/BlockScript.js");
include("core/objects/physics/PhysicsObject.js");
include("core/objects/spine/SpineAnimation.js");
include("core/objects/spine/SpineTexture.js");
include("core/objects/Bone.js");
include("core/objects/Container.js");
include("core/objects/ParticleEmitter.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");
include("core/utils/Base64Utils.js");
include("core/utils/ArraybufferUtils.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/Mesh2shape.js");
include("core/FileSystem.js");

writeFile("out.js", "\"use strict\";" + code.replace(/"use strict";/gi, "").replace(/include\(".*"\);/gi, ""));

function include(file)
{
	code += "\n" + readFile(path + file);
}

function readFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		return fs.readFileSync(fname, "utf8");
	}
}

function writeFile(fname, text)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		var stream = fs.createWriteStream(fname, "utf8");
		stream.write(text);
		stream.end();
	}
}