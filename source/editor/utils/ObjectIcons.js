"use strict";

var ObjectIcons = {};

ObjectIcons.path = "source/files/icons/";
ObjectIcons.default = ObjectIcons.path + "misc/question.png";
ObjectIcons.locked = ObjectIcons.path + "misc/padlock.png";

ObjectIcons.icons = 
{
	//Devices
	"Kinect": ObjectIcons.path + "hw/kinect.png",
	"LeapDevice": ObjectIcons.path + "hw/leap.png",

	//Ligths
	"Sky": ObjectIcons.path + "lights/sky.png",
	"SpotLight": ObjectIcons.path + "lights/spot.png",
	"PointLight": ObjectIcons.path + "lights/point.png",
	"HemisphereLight": ObjectIcons.path + "lights/hemisphere.png",
	"DirectionalLight": ObjectIcons.path + "lights/directional.png",
	"AmbientLight": ObjectIcons.path + "lights/ambient.png",
	"RectAreaLight": ObjectIcons.path + "lights/rectarea.png",

	//Cameras
	"PerspectiveCamera": ObjectIcons.path + "camera/prespective.png",
	"OrthographicCamera": ObjectIcons.path + "camera/orthographic.png",

	//Objects
	"SpineAnimation": ObjectIcons.path + "misc/spine.png",
	"Mesh": ObjectIcons.path + "models/cube.png",
	"SkinnedMesh": ObjectIcons.path + "misc/skeleton.png",
	"ParticleEmiter": ObjectIcons.path + "misc/particles.png",
	"Script": ObjectIcons.path + "script/script.png",
	"Sprite": ObjectIcons.path + "misc/image.png",
	"TextMesh": ObjectIcons.path + "text/text.png",
	"Points": ObjectIcons.path + "models/points.png",
	"Line": ObjectIcons.path + "misc/nodes.png",
	"LineSegments": ObjectIcons.path + "misc/nodes.png",

	//Program
	"Program": ObjectIcons.path + "script/script.png",
	"Scene": ObjectIcons.path + "models/models.png",

	//Audio
	"Audio": ObjectIcons.path + "misc/audio.png",
	"PositionalAudio": ObjectIcons.path + "misc/audio_positional.png",

	//Physics
	"Physics": ObjectIcons.path + "misc/physics.png",

	//Others
	"Object3D": ObjectIcons.path + "misc/scene.png",
	"CubeCamera": ObjectIcons.path + "misc/probe.png",
	"Bone": ObjectIcons.path + "misc/bone.png",
	"Group": ObjectIcons.path + "misc/container.png",
	"LensFlare": ObjectIcons.path + "misc/flare.png",
	"OrbitControls": ObjectIcons.path + "misc/orbit.png",
	"FirstPersonControls": ObjectIcons.path + "misc/crosshair.png"
};

//Get icon path from object type
ObjectIcons.get = function(type)
{
	return ObjectIcons.icons[type] || ObjectIcons.default;
};