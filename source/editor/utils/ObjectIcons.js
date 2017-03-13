"use strict";

//List of object icon path by object type
function ObjectIcons(){}

//Create icon map
ObjectIcons.icons = [];

//Default icon
ObjectIcons.icons["Object3D"] = "editor/files/icons/misc/scene.png";

//Devices
ObjectIcons.icons["Kinect"] = "editor/files/icons/hw/kinect.png";
ObjectIcons.icons["LeapDevice"] = "editor/files/icons/hw/leap.png";

//Ligths
ObjectIcons.icons["Sky"] = "editor/files/icons/lights/sky.png";
ObjectIcons.icons["SpotLight"] = "editor/files/icons/lights/spot.png";
ObjectIcons.icons["PointLight"] = "editor/files/icons/lights/point.png";
ObjectIcons.icons["HemisphereLight"] = "editor/files/icons/lights/hemisphere.png";
ObjectIcons.icons["DirectionalLight"] = "editor/files/icons/lights/directional.png";
ObjectIcons.icons["AmbientLight"] = "editor/files/icons/lights/ambient.png";
ObjectIcons.icons["RectAreaLight"] = "editor/files/icons/lights/rectarea.png";

//Cameras
ObjectIcons.icons["PerspectiveCamera"] = "editor/files/icons/camera/prespective.png";
ObjectIcons.icons["OrthographicCamera"] = "editor/files/icons/camera/orthographic.png";

//Objects
ObjectIcons.icons["SpineAnimation"] = "editor/files/icons/misc/spine.png";
ObjectIcons.icons["Mesh"] = "editor/files/icons/models/cube.png";
ObjectIcons.icons["SkinnedMesh"] = "editor/files/icons/misc/skeleton.png";
ObjectIcons.icons["ParticleEmiter"] = "editor/files/icons/effects/particles.png";
ObjectIcons.icons["Script"] = "editor/files/icons/script/script.png";
ObjectIcons.icons["Sprite"] = "editor/files/icons/misc/image.png";
ObjectIcons.icons["Text3D"] = "editor/files/icons/models/text.png";
ObjectIcons.icons["Points"] = "editor/files/icons/models/points.png";

//Program
ObjectIcons.icons["Program"] = "editor/files/icons/script/script.png";
ObjectIcons.icons["Scene"] = "editor/files/icons/models/models.png";

//Audio
ObjectIcons.icons["Audio"] = "editor/files/icons/misc/audio.png";
ObjectIcons.icons["PositionalAudio"] = "editor/files/icons/misc/audio_positional.png";

//Physics
ObjectIcons.icons["Physics"] = "editor/files/icons/misc/physics.png";

//Others
ObjectIcons.icons["Bone"] = "editor/files/icons/misc/bone.png";
ObjectIcons.icons["Group"] = "editor/files/icons/effects/container.png";

//Get icon path from object type
ObjectIcons.get = function(type)
{
	return ObjectIcons.icons[type];
};