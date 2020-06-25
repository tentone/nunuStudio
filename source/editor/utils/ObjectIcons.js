import {Audio} from "../../../core/resources/Audio.js";
import {TextSprite} from "../../../core/objects/text/TextSprite.js";
import {TextMesh} from "../../../core/objects/text/TextMesh.js";
import {TextBitmap} from "../../../core/objects/text/TextBitmap.js";
import {Sprite} from "../../../core/objects/sprite/Sprite.js";
import {SpineAnimation} from "../../../core/objects/spine/SpineAnimation.js";
import {Script} from "../../../core/objects/script/Script.js";
import {Scene} from "../../../core/objects/Scene.js";
import {Program} from "../../../core/objects/Program.js";
import {Sky} from "../../../core/objects/misc/Sky.js";
import {LensFlare} from "../../../core/objects/misc/LensFlare.js";
import {SkinnedMesh} from "../../../core/objects/mesh/SkinnedMesh.js";
import {Mesh} from "../../../core/objects/mesh/Mesh.js";
import {InstancedMesh} from "../../../core/objects/mesh/InstancedMesh.js";
import {SpotLight} from "../../../core/objects/lights/SpotLight.js";
import {RectAreaLight} from "../../../core/objects/lights/RectAreaLight.js";
import {PointLight} from "../../../core/objects/lights/PointLight.js";
import {LightProbe} from "../../../core/objects/lights/LightProbe.js";
import {HemisphereLight} from "../../../core/objects/lights/HemisphereLight.js";
import {DirectionalLight} from "../../../core/objects/lights/DirectionalLight.js";
import {AmbientLight} from "../../../core/objects/lights/AmbientLight.js";
import {OrbitControls} from "../../../core/objects/controls/OrbitControls.js";
import {FirstPersonControls} from "../../../core/objects/controls/FirstPersonControls.js";
import {PerspectiveCamera} from "../../../core/objects/cameras/PerspectiveCamera.js";
import {OrthographicCamera} from "../../../core/objects/cameras/OrthographicCamera.js";
import {CubeCamera} from "../../../core/objects/cameras/CubeCamera.js";
import {PositionalAudio} from "../../../core/objects/audio/PositionalAudio.js";
import {Text} from "../../components/Text.js";


/**
 * Stores and manages icons of the object types available in the platform.
 *
 * @static
 * @class ObjectIcons
 */
var ObjectIcons = {};

/**
 * Path of to the base icon files directory.
 *
 * @static
 * @attribute path
 * @type {string}
 */
ObjectIcons.path = "source/files/icons/";

ObjectIcons.default = ObjectIcons.path + "misc/question.png";
ObjectIcons.locked = ObjectIcons.path + "misc/padlock.png";

ObjectIcons.icons = new Map([
	// Devices
	["Kinect", ObjectIcons.path + "hw/kinect.png"],
	["LeapDevice", ObjectIcons.path + "hw/leap.png"],

	// Ligths
	["Sky", ObjectIcons.path + "lights/sky.png"],
	["SpotLight", ObjectIcons.path + "lights/spot.png"],
	["PointLight", ObjectIcons.path + "lights/point.png"],
	["HemisphereLight", ObjectIcons.path + "lights/hemisphere.png"],
	["DirectionalLight", ObjectIcons.path + "lights/directional.png"],
	["AmbientLight", ObjectIcons.path + "lights/ambient.png"],
	["RectAreaLight", ObjectIcons.path + "lights/rectarea.png"],
	["LightProbe", ObjectIcons.path + "misc/probe.png"],

	// Cameras
	["PerspectiveCamera", ObjectIcons.path + "camera/prespective.png"],
	["OrthographicCamera", ObjectIcons.path + "camera/orthographic.png"],

	// Objects
	["SpineAnimation", ObjectIcons.path + "misc/spine.png"],
	["InstancedMesh", ObjectIcons.path + "models/cubes.png"],
	["SkinnedMesh", ObjectIcons.path + "misc/skeleton.png"],
	["Mesh", ObjectIcons.path + "models/cube.png"],
	["ParticleEmiter", ObjectIcons.path + "misc/particles.png"],
	["Script", ObjectIcons.path + "script/script.png"],
	["Sprite", ObjectIcons.path + "misc/image.png"],
	["Points", ObjectIcons.path + "models/points.png"],
	["Line", ObjectIcons.path + "misc/nodes.png"],
	["LineSegments", ObjectIcons.path + "misc/nodes.png"],
	
	// Text
	["TextMesh", ObjectIcons.path + "text/textmesh.png"],
	["TextBitmap", ObjectIcons.path + "text/text.png"],
	["TextSprite", ObjectIcons.path + "text/textcanvas.png"],

	// Program
	["Program", ObjectIcons.path + "script/script.png"],
	["Scene", ObjectIcons.path + "models/models.png"],

	// Audio
	["Audio", ObjectIcons.path + "misc/audio.png"],
	["PositionalAudio", ObjectIcons.path + "misc/audio_positional.png"],

	// Physics
	["Physics", ObjectIcons.path + "misc/physics.png"],

	// Others
	["Object3D", ObjectIcons.path + "misc/scene.png"],
	["CubeCamera", ObjectIcons.path + "misc/probe.png"],
	["Bone", ObjectIcons.path + "misc/bone.png"],
	["Group", ObjectIcons.path + "misc/container.png"],
	["LensFlare", ObjectIcons.path + "misc/flare.png"],
	["OrbitControls", ObjectIcons.path + "misc/orbit.png"],
	["FirstPersonControls", ObjectIcons.path + "misc/crosshair.png"]
]);

/**
 * Get icon path from object type, if no icon available a default icon is returned.
 * 
 * @static
 * @method get
 * @param {string} Object type.
 */
ObjectIcons.get = function(type)
{
	if(ObjectIcons.icons.has(type))
	{
		return ObjectIcons.icons.get(type);
	}

	return ObjectIcons.default;
};