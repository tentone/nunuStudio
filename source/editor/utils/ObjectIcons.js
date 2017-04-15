"use strict";

//List of object icon path by object type
function ObjectIcons(){}

//Create icon map
ObjectIcons.icons = [];

//Default icon
ObjectIcons.icons["Object3D"] = Editor.filePath + "icons/misc/scene.png";

//Devices
ObjectIcons.icons["Kinect"] = Editor.filePath + "icons/hw/kinect.png";
ObjectIcons.icons["LeapDevice"] = Editor.filePath + "icons/hw/leap.png";

//Ligths
ObjectIcons.icons["Sky"] = Editor.filePath + "icons/lights/sky.png";
ObjectIcons.icons["SpotLight"] = Editor.filePath + "icons/lights/spot.png";
ObjectIcons.icons["PointLight"] = Editor.filePath + "icons/lights/point.png";
ObjectIcons.icons["HemisphereLight"] = Editor.filePath + "icons/lights/hemisphere.png";
ObjectIcons.icons["DirectionalLight"] = Editor.filePath + "icons/lights/directional.png";
ObjectIcons.icons["AmbientLight"] = Editor.filePath + "icons/lights/ambient.png";
ObjectIcons.icons["RectAreaLight"] = Editor.filePath + "icons/lights/rectarea.png";

//Cameras
ObjectIcons.icons["PerspectiveCamera"] = Editor.filePath + "icons/camera/prespective.png";
ObjectIcons.icons["OrthographicCamera"] = Editor.filePath + "icons/camera/orthographic.png";

//Objects
ObjectIcons.icons["SpineAnimation"] = Editor.filePath + "icons/misc/spine.png";
ObjectIcons.icons["Mesh"] = Editor.filePath + "icons/models/cube.png";
ObjectIcons.icons["SkinnedMesh"] = Editor.filePath + "icons/misc/skeleton.png";
ObjectIcons.icons["ParticleEmiter"] = Editor.filePath + "icons/effects/particles.png";
ObjectIcons.icons["Script"] = Editor.filePath + "icons/script/script.png";
ObjectIcons.icons["Sprite"] = Editor.filePath + "icons/misc/image.png";
ObjectIcons.icons["Text3D"] = Editor.filePath + "icons/models/text.png";
ObjectIcons.icons["Points"] = Editor.filePath + "icons/models/points.png";

//Program
ObjectIcons.icons["Program"] = Editor.filePath + "icons/script/script.png";
ObjectIcons.icons["Scene"] = Editor.filePath + "icons/models/models.png";

//Audio
ObjectIcons.icons["Audio"] = Editor.filePath + "icons/misc/audio.png";
ObjectIcons.icons["PositionalAudio"] = Editor.filePath + "icons/misc/audio_positional.png";

//Physics
ObjectIcons.icons["Physics"] = Editor.filePath + "icons/misc/physics.png";

//Others
ObjectIcons.icons["CubeCamera"] = Editor.filePath + "icons/misc/probe.png";
ObjectIcons.icons["Bone"] = Editor.filePath + "icons/misc/bone.png";
ObjectIcons.icons["Group"] = Editor.filePath + "icons/effects/container.png";

//Get icon path from object type
ObjectIcons.get = function(type)
{
	return ObjectIcons.icons[type];
};