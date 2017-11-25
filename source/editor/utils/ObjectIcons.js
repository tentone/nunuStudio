"use strict";

function ObjectIcons(){}

ObjectIcons.path = "editor/files/icons/";
ObjectIcons.default = ObjectIcons.path + "misc/question.png";
ObjectIcons.icons = [];

//Devices
ObjectIcons.icons["Kinect"] = ObjectIcons.path + "hw/kinect.png";
ObjectIcons.icons["LeapDevice"] = ObjectIcons.path + "hw/leap.png";

//Ligths
ObjectIcons.icons["Sky"] = ObjectIcons.path + "lights/sky.png";
ObjectIcons.icons["SpotLight"] = ObjectIcons.path + "lights/spot.png";
ObjectIcons.icons["PointLight"] = ObjectIcons.path + "lights/point.png";
ObjectIcons.icons["HemisphereLight"] = ObjectIcons.path + "lights/hemisphere.png";
ObjectIcons.icons["DirectionalLight"] = ObjectIcons.path + "lights/directional.png";
ObjectIcons.icons["AmbientLight"] = ObjectIcons.path + "lights/ambient.png";
ObjectIcons.icons["RectAreaLight"] = ObjectIcons.path + "lights/rectarea.png";

//Cameras
ObjectIcons.icons["PerspectiveCamera"] = ObjectIcons.path + "camera/prespective.png";
ObjectIcons.icons["OrthographicCamera"] = ObjectIcons.path + "camera/orthographic.png";

//Objects
ObjectIcons.icons["SpineAnimation"] = ObjectIcons.path + "misc/spine.png";
ObjectIcons.icons["Mesh"] = ObjectIcons.path + "models/cube.png";
ObjectIcons.icons["SkinnedMesh"] = ObjectIcons.path + "misc/skeleton.png";
ObjectIcons.icons["ParticleEmiter"] = ObjectIcons.path + "misc/particles.png";
ObjectIcons.icons["Script"] = ObjectIcons.path + "script/script.png";
ObjectIcons.icons["Sprite"] = ObjectIcons.path + "misc/image.png";
ObjectIcons.icons["Text3D"] = ObjectIcons.path + "models/text.png";
ObjectIcons.icons["Points"] = ObjectIcons.path + "models/points.png";
ObjectIcons.icons["Line"] = ObjectIcons.path + "misc/nodes.png";
ObjectIcons.icons["LineSegments"] = ObjectIcons.path + "misc/nodes.png";

//Program
ObjectIcons.icons["Program"] = ObjectIcons.path + "script/script.png";
ObjectIcons.icons["Scene"] = ObjectIcons.path + "models/models.png";

//Audio
ObjectIcons.icons["Audio"] = ObjectIcons.path + "misc/audio.png";
ObjectIcons.icons["PositionalAudio"] = ObjectIcons.path + "misc/audio_positional.png";

//Physics
ObjectIcons.icons["Physics"] = ObjectIcons.path + "misc/physics.png";

//Others
ObjectIcons.icons["Object3D"] = ObjectIcons.path + "misc/scene.png";
ObjectIcons.icons["CubeCamera"] = ObjectIcons.path + "misc/probe.png";
ObjectIcons.icons["Bone"] = ObjectIcons.path + "misc/bone.png";
ObjectIcons.icons["Group"] = ObjectIcons.path + "misc/container.png";
ObjectIcons.icons["LensFlare"] = ObjectIcons.path + "misc/flare.png";
ObjectIcons.icons["OrbitControls"] = ObjectIcons.path + "misc/orbit.png";
ObjectIcons.icons["FirstPersonControls"] = ObjectIcons.path + "misc/crosshair.png";

//Get icon path from object type
ObjectIcons.get = function(type)
{
	return ObjectIcons.icons[type] || ObjectIcons.default;
};