import {AnimationClip, Bone, BufferAttribute, Color, DefaultLoadingManager, FileLoader, Fog, FogExp2, LOD, Line, LineLoop, LineSegments, Points, Skeleton} from "three";

import {AmbientLight} from "../objects/lights/AmbientLight.js";
import {AudioEmitter} from "../objects/audio/AudioEmitter.js";
import {CubeCamera} from "../objects/cameras/CubeCamera.js";
import {DirectionalLight} from "../objects/lights/DirectionalLight.js";
import {EffectComposer} from "../postprocessing/EffectComposer.js";
import {FirstPersonControls} from "../objects/controls/FirstPersonControls.js";
import {Group} from "../objects/misc/Group.js";
import {HTMLView} from "../objects/misc/HTMLView.js";
import {HemisphereLight} from "../objects/lights/HemisphereLight.js";
import {InstancedMesh} from "../objects/mesh/InstancedMesh.js";
import {LensFlare} from "../objects/misc/LensFlare.js";
import {LightProbe} from "../objects/lights/LightProbe.js";
import {Mesh} from "../objects/mesh/Mesh.js";
import {OrbitControls} from "../objects/controls/OrbitControls.js";
import {OrthographicCamera} from "../objects/cameras/OrthographicCamera.js";
import {ParticleEmitter} from "../objects/particle/ParticleEmitter.js";
import {PerspectiveCamera} from "../objects/cameras/PerspectiveCamera.js";
import {PhysicsObject} from "../objects/physics/PhysicsObject.js";
import {PointLight} from "../objects/lights/PointLight.js";
import {PositionalAudio} from "../objects/audio/PositionalAudio.js";
import {Program} from "../objects/Program.js";
import {RectAreaLight} from "../objects/lights/RectAreaLight.js";
import {ResourceContainer} from "../resources/ResourceContainer.js";
import {Scene} from "../objects/Scene.js";
import {Script} from "../objects/script/Script.js";
import {SkinnedMesh} from "../objects/mesh/SkinnedMesh.js";
import {Sky} from "../objects/misc/Sky.js";
import {SpineAnimation} from "../objects/spine/SpineAnimation.js";
import {SpotLight} from "../objects/lights/SpotLight.js";
import {Sprite} from "../objects/sprite/Sprite.js";
import {TextBitmap} from "../objects/text/TextBitmap.js";
import {TextFile} from "../resources/TextFile.js";
import {TextMesh} from "../objects/text/TextMesh.js";
import {TextSprite} from "../objects/text/TextSprite.js";
import {MaterialLoader} from "./MaterialLoader.js";
import {ImageLoader} from "./ImageLoader.js";
import {GeometryLoader} from "./GeometryLoader.js";
import {FontLoader} from "./FontLoader.js";
import {AudioLoader} from "./AudioLoader.js";
import {TextureLoader} from "./TextureLoader.js";
import {VideoLoader} from "./VideoLoader.js";

/**
 * Objectloader can be used to load external objects from files.
 *
 * Also loads all resources attached to the objects being loaded.
 * 
 * Can parse be used to load on runtime resources and objects from external project files.
 * 
 * @module Loaders
 * @class ObjectLoader
 * @param {Object} manager
 */
function ObjectLoader(manager)
{
	ResourceContainer.call(this);

	this.manager = manager !== undefined ? manager : DefaultLoadingManager;
	this.texturePath = "";
}

ObjectLoader.prototype = Object.create(ResourceContainer.prototype);

/**
 * Load object file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
ObjectLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	if (this.texturePath === "")
	{
		this.texturePath = url.substring(0, url.lastIndexOf("/") + 1);
	}

	var self = this;
	var loader = new FileLoader(this.manager);
	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
};

/**
 * Parse JSON object and create the correct Object structure. 
 * 
 * Data can be loaded from a file and should be parsed into Object.
 *
 * @method parse
 * @param {Object} json JSON data to be loaded.
 * @param {Function} onLoad onLoad callback.
 * @return {Object} Program loaded from json data.
 */
ObjectLoader.prototype.parse = function(json, onLoad)
{
	this.parseResources(json.resources);
	this.parseShape(json.shapes);
	this.parseImages(json.images);
	this.parseGeometries(json.geometries);
	this.parseVideos(json.videos);
	this.parseAudio(json.audio);
	this.parseFonts(json.fonts);
	this.parseTextures(json.textures);
	this.parseMaterials(json.materials);

	var object = this.parseObject(json.object);

	// Bind sekeletons
	if (json.skeletons !== undefined)
	{
		this.parseSkeletons(json.skeletons, object);
		this.bindSkeletons(object);
	}

	// Load images and process callback
	if (json.images === undefined || json.images.length === 0)
	{
		if (onLoad !== undefined)
		{
			onLoad(object);
		}
	}

	return object;
};

/**
 * Define base path for external texture loading.
 *
 * @method setTexturePath
 * @param {string} path
 */
ObjectLoader.prototype.setTexturePath = function(path)
{
	this.texturePath = path;
};

/**
 * Set cross origin.
 *
 * @method setCrossOrigin
 * @param {string} origin
 */
ObjectLoader.prototype.setCrossOrigin = function(origin)
{
	this.crossOrigin = origin;
};

/**
 * Parse resources on JSON.
 *
 * @method parseResources
 * @param {Object} json
 * @return {Array} resources
 */
ObjectLoader.prototype.parseResources = function(json)
{
	if (json !== undefined)
	{
		for (var i in json)
		{
			var resource = new TextFile(json[i].data, json[i].encoding);
			resource.format = json[i].format;
			resource.name = json[i].name;
			resource.uuid = json[i].uuid;

			this.resources[resource.uuid] = resource;
		}
	}

	return this.resources;
};

/**
 * Parse geometries on JSON.
 *
 * @method parseShape
 * @param {Object} json
 * @return {Array} geometries
 */
ObjectLoader.prototype.parseShape = function(json)
{
	if (json !== undefined)
	{
		for (var i = 0, l = json.length; i < l; i ++)
		{
			var shape = new Shape().fromJSON(json[i]);
			this.shapes[shape.uuid] = shape;
		}
	}

	return this.shapes;
};

/**
 * Parse geometries on JSON.
 *
 * @method parseGeometries
 * @param {Object} array
 * @return {Array} geometries
 */
ObjectLoader.prototype.parseGeometries = function(array)
{
	if (array !== undefined)
	{
		var loader = new GeometryLoader();
		loader.setShapes(this.shapes);
		loader.setImages(this.images);

		for (var i = 0; i < array.length; i++)
		{	
			this.geometries[array[i].uuid] = loader.parse(array[i]);
		}
	}

	return this.geometries;
};

/**
 * Parse materials on json.
 *
 * @method parseMaterials
 * @param {Object} json
 * @return {Array} materials
 */
ObjectLoader.prototype.parseMaterials = function(json)
{
	if (json !== undefined)
	{
		var loader = new MaterialLoader();
		loader.setTextures(this.textures);

		for (var i in json)
		{
			this.materials[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return this.materials;
};

/**
 * Parse images on json.
 *
 * @method parseImages
 * @param {Object} json
 * @return {Array} images
 */
ObjectLoader.prototype.parseImages = function(json)
{
	if (json !== undefined)
	{
		var loader = new ImageLoader();
		for (var i in json)
		{
			this.images[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return this.images;
};

/**
 * Parse videos on json.
 *
 * @method parseVideos
 * @param {Object} json
 * @return {Array} videos
 */
ObjectLoader.prototype.parseVideos = function(json)
{
	if (json !== undefined)
	{
		var loader = new VideoLoader();
		for (var i in json)
		{
			this.videos[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return this.videos;
};

/**
 * Parse audio on json.
 *
 * @method parseAudio
 * @param {Object} json
 * @return {Array} audio
 */
ObjectLoader.prototype.parseAudio = function(json)
{
	if (json !== undefined)
	{
		var loader = new AudioLoader();
		for (var i in json)
		{
			this.audio[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return this.audio;
};

/**
 * Parse fonts on json.
 *
 * @method parseFonts
 * @param {Object} json
 * @return {Array} fonts
 */
ObjectLoader.prototype.parseFonts = function(json)
{
	if (json !== undefined)
	{
		var loader = new FontLoader();
		for (var i in json)
		{
			this.fonts[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return this.fonts;
};

/**
 * Parse textures on json.
 *
 * @method parseTextures
 * @param {Object} json
 * @return {Array} textures
 */
ObjectLoader.prototype.parseTextures = function(json)
{
	if (json !== undefined)
	{
		var loader = new TextureLoader();
		loader.setImages(this.images);
		loader.setVideos(this.videos);

		for (var i in json)
		{
			this.textures[json[i].uuid] = loader.parse(json[i]);
		}
	}
	
	return this.textures;
};

/**
 * Parse array of skeletons from JSON object.
 *
 * @method parseSkeletons
 * @param {Object} json
 * @param {Object} object
 */
ObjectLoader.prototype.parseSkeletons = function(json, object)
{
	if (json !== undefined)
	{
		for (var i = 0; i < json.length; i++)
		{
			this.skeletons[json[i].uuid] = Skeleton.fromJSON(json[i], object, this);
		}
	}

	return this.skeletons;
};

/**
 * Auxiliar method to bind skeletons to loaded objects.
 *
 * Look for skeletonUUID property, wich is a placeholder with the skeleton UUID and replace it with the skeleton object.
 *
 * @method bindSkeletons
 * @param {Object3D} object Object3D that contains objects
 */
ObjectLoader.prototype.bindSkeletons = function(object)
{
	var self = this;

	object.traverse(function(child)
	{
		if (child.isSkinnedMesh && child.skeletonUUID !== undefined)
		{
			var skeleton = self.skeletons[child.skeletonUUID];
			if (skeleton === undefined)
			{
				console.warn("nunuStudio: ObjectLoader Skeleton not found.", child.skeletonUUID);
				return;
			}

			delete child.skeletonUUID;
			child.bind(skeleton, child.bindMatrix);
		}
	});
};


/**
 * Parse objects from json data,
 *
 * @method parseObjects
 */
ObjectLoader.prototype.parseObject = function(data)
{
	var object;

	try
	{
		switch (data.type)
		{
		case "SpineAnimation":
			for (var i = 0; i < data.textures.length; i++)
			{
				data.textures[i].texture = this.getTexture(data.textures[i].texture);
			}

			object = new SpineAnimation(data.json, data.atlas, "", data.textures);
				
			if (data.animation !== undefined)
			{
				object.animation = data.animation;
				object.track = data.track;
				object.loop = data.loop;
			}
			if (data.skin !== undefined)
			{
				object.skin = data.skin;
			}
			break;

		case "Audio":
			object = new AudioEmitter(this.getAudio(data.audio));
			object.autoplay = data.autoplay;
			object.startTime = data.startTime;
			object.playbackRate = data.playbackRate;
			object.loop = data.source !== undefined ? data.source.loop : data.loop;
			if (data.volume !== undefined)
			{
				object.volume = data.volume;
			}
			break;

		case "PositionalAudio":
			object = new PositionalAudio(this.getAudio(data.audio));
			object.autoplay = data.autoplay;
			object.startTime = data.startTime;
			object.playbackRate = data.playbackRate;
			object.loop = data.source !== undefined ? data.source.loop : data.loop;
			if (data.volume !== undefined)
			{
				object.volume = data.volume;
			}
			object.distanceModel = data.distanceModel;
			object.panningModel = data.panningModel;
			break;

		case "Physics":
			object = PhysicsObject.fromJSON(data);
			break;

		case "ParticleEmiter":
			object = ParticleEmitter.fromJSON(data, this); 
			break;

		case "LensFlare":
			object = new LensFlare();
				
			if (data.lensFlares !== undefined)
			{
				data.elements = data.lensFlares;
			}

			for (var i = 0; i < data.elements.length; i++)
			{
				object.addFlare(this.getTexture(data.elements[i].texture), data.elements[i].size, data.elements[i].distance, new Color(data.elements[i].color));
			}

			break;

		case "TextMesh":
		case "Text3D":
			object = new TextMesh(data.text, this.getMaterial(data.material), this.getFont(data.font), data.height, data.bevel, data.bevelThickness, data.bevelSize, data.size, data.curveSegments, data.extruded);
			break;

		case "Program":
			object = new Program(data.name);
				
			object.description = data.description;
			object.author = data.author;
			object.version = data.version;

			object.ar = data.ar === true;
				
			object.vr = data.vr;
			object.vrScale = data.vrScale;

			if (data.rendererConfig !== undefined)
			{
				object.rendererConfig.fromJSON(data.rendererConfig);
			}
			else
			{
				object.rendererConfig.antialiasing = data.antialiasing;
				object.rendererConfig.shadows = data.shadows;
				object.rendererConfig.shadowsType = data.shadowsType;
				object.rendererConfig.toneMapping = data.toneMapping;
				object.rendererConfig.toneMappingExposure = data.toneMappingExposure;
			}

			if (data.lockPointer !== undefined)
			{
				object.lockPointer = data.lockPointer;
			}

			if (data.defaultScene !== undefined)
			{
				object.defaultScene = data.defaultScene;
			}
				
			if (data.handlePixelRatio !== undefined)
			{
				object.handlePixelRatio = data.handlePixelRatio;	
			}

			break;

		case "Sky":
			object = new Sky(data.autoUpdate, data.dayTime, data.sunDistance, data.time);
				
			if (data.sun !== undefined)
			{
				object.sun.shadow.fromJSON(data.sun.shadow);
					
				if (data.sun.castShadow !== undefined)
				{
					object.sun.castShadow = data.sun.castShadow;
				}
			}

			if (data.colorTop !== undefined)
			{
				object.colorTop = [];
				for (var i = 0; i < data.colorTop.length; i++)
				{
					object.colorTop.push(new Color(data.colorTop[i])); 
				}
			}
			if (data.colorBottom !== undefined)
			{
				object.colorBottom = [];
				for (var i = 0; i < data.colorBottom.length; i++)
				{
					object.colorBottom.push(new Color(data.colorBottom[i])); 
				}
			}
			if (data.sunColor !== undefined)
			{
				object.sunColor = data.sunColor;
			}
			if (data.moonColor !== undefined)
			{
				object.moonColor = data.moonColor;
			}
			if (data.intensity !== undefined)
			{
				object.intensity = data.intensity;
			}

			break;

		case "CubeCamera":
			object = new CubeCamera(data.near, data.far, data.resolution, data.autoUpdate);
			break;
				
		case "FirstPersonControls":
			object = new FirstPersonControls();
			object.sensitivity = data.sensitivity;
			object.needsButtonPressed = data.needsButtonPressed;
			object.movementEnabled = data.movementEnabled;
			object.moveSpeed = data.moveSpeed;
			object.moveOnPlane = data.moveOnPlane;
			object.moveKeys = data.moveKeys;
			break;

		case "OrbitControls":
			object = new OrbitControls();
			object.distance = data.distance;
			object.maxDistance = data.maxDistance;
			object.minDistance = data.minDistance;
			object.sensitivity = data.sensitivity;
			object.limitUp = data.limitUp;
			object.limitDown = data.limitDown;
			object.needsButtonPressed = data.needsButtonPressed;
			object.zoomEnabled = data.zoomEnabled;
			object.movementEnabled = data.movementEnabled;
				
			if (data.smooth !== undefined)
			{
				object.smooth = data.smooth;
				object.friction = data.friction;
				object.speed = data.speed;
				object.invertNavigation = data.invertNavigation;
			}
			if (data.center !== undefined)
			{
				object.center.fromArray(data.center);
				object.vector.fromArray(data.vector);
			}

			break;
				
		case "Scene":
			object = new Scene();

			if (data.background !== undefined)
			{
				if (Number.isInteger(data.background))
				{
					object.background = new Color(data.background);
				}
				else
				{
					object.background = this.getTexture(data.background);
				}
			}

			if (data.environment !== undefined)
			{
				object.environment = this.getTexture(data.environment);
			}

			if (data.fog !== undefined)
			{
				if (data.fog.type === "Fog")
				{
					object.fog = new Fog(data.fog.color, data.fog.near, data.fog.far);
				}
				else if (data.fog.type === "FogExp2")
				{
					object.fog = new FogExp2(data.fog.color, data.fog.density);
				}
			}

			if (data.defaultCamera !== undefined)
			{
				object.defaultCamera = this.parse(data.defaultCamera);
			}

			if (data.cameras !== undefined)
			{
				object.cameras = data.cameras;
			}

			if (data.usePhysics !== undefined)
			{
				object.usePhysics = data.usePhysics;
			}

			if (data.world !== undefined)
			{
				object.world.gravity.set(data.world.gravity.x, data.world.gravity.y, data.world.gravity.z);
				object.world.quatNormalizeSkip = data.world.quatNormalizeSkip;
				object.world.quatNormalizeFast = data.world.quatNormalizeFast;
					
				object.world.solver.tolerance = data.world.solver.tolerance;
				object.world.solver.iterations = data.world.solver.iterations;
			}
			break;

		case "PerspectiveCamera":
			object = new PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
				
			if (data.focus !== undefined) 
			{
				object.focus = data.focus;
			}
			if (data.zoom !== undefined)
			{
				object.zoom = data.zoom;
			}
			if (data.filmGauge !== undefined)
			{
				object.filmGauge = data.filmGauge;
			}
			if (data.filmOffset !== undefined)
			{
				object.filmOffset = data.filmOffset;
			}
			if (data.view !== undefined)
			{
				object.view = Object.assign({}, data.view);
			}

			if (data.viewport !== undefined)
			{
				if (data.viewport instanceof Array)
				{
					object.viewport.size.fromArray(data.viewport);
					object.viewport.offset.fromArray(data.offset);
				}
				else
				{
					object.viewport.fromJSON(data.viewport);
				}
			}

			if (data.clearColor !== undefined)
			{
				object.clearColor = data.clearColor;
			}
			if (data.clearDepth !== undefined)
			{
				object.clearDepth = data.clearDepth;
			}
			if (data.clearStencil !== undefined)
			{
				object.clearStencil = data.clearStencil;
			}
			if (data.order !== undefined)
			{
				object.order = data.order;
			}

			if (data.composer !== undefined)
			{
				object.composer = EffectComposer.fromJSON(data.composer);
			}
			break;

		case "OrthographicCamera":
			object = new OrthographicCamera(data.size, data.aspect, data.mode, data.near, data.far);

			if (data.viewport !== undefined)
			{
				if (data.viewport instanceof Array)
				{
					object.viewport.size.fromArray(data.viewport);
					object.viewport.offset.fromArray(data.offset);
				}
				else
				{
					object.viewport.fromJSON(data.viewport);
				}
			}

			if (data.clearColor !== undefined)
			{
				object.clearColor = data.clearColor;
			}
			if (data.clearDepth !== undefined)
			{
				object.clearDepth = data.clearDepth;
			}
			if (data.clearStencil !== undefined)
			{
				object.clearStencil = data.clearStencil;
			}
			if (data.order !== undefined)
			{
				object.order = data.order;
			}
			if (data.composer !== undefined)
			{
				object.composer = EffectComposer.fromJSON(data.composer);
			}
			if (data.zoom !== undefined)
			{
				object.zoom = data.zoom;
			}
			if (data.view !== undefined)
			{
				object.view = Object.assign({}, data.view);
			}
			break;

		case "Script":
			object = new Script(data.code, data.mode);
			break;
			
		case "NodeScript":
			object = new NodeScript();
			object.graph = Object2D.parse(data.graph);
			break;

		case "RectAreaLight":
			object = new RectAreaLight(data.color, data.intensity, data.width, data.height);
			break;

		case "AmbientLight":
			object = new AmbientLight(data.color, data.intensity);
			break;

		case "DirectionalLight":
			object = new DirectionalLight(data.color, data.intensity);
			break;

		case "PointLight":
			object = new PointLight(data.color, data.intensity, data.distance, data.decay);
			break;

		case "SpotLight":
			object = new SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
			break;

		case "HemisphereLight":
			object = new HemisphereLight(data.color, data.groundColor, data.intensity);
			break;

		case "HTMLView":
			object = new HTMLView();
			object.height = data.height;
			object.width = data.width;
			object.url = data.url;
			break;

		case "LightProbe":
			object = new LightProbe();
			object.sh.fromArray(data.sh);
			break;

		case "InstancedMesh":
			object = new InstancedMesh(this.getGeometry(data.geometry), this.getMaterial(data.material), data.count);
			object.instanceMatrix = new BufferAttribute(new Float32Array(data.instanceMatrix.array), 16);
			break;

		case "SkinnedMesh":
			object = new SkinnedMesh(this.getGeometry(data.geometry), this.getMaterial(data.material));

			// Rebinds with skeleton whose uuid is data.skeleton later.
			if (data.skeleton !== undefined) {object.skeletonUUID = data.skeleton;}
			if (data.bindMode !== undefined) {object.bindMode = data.bindMode;}
			if (data.bindMatrix !== undefined) {object.bindMatrix.fromArray(data.bindMatrix);}

			break;

		case "Mesh":
			object = new Mesh(this.getGeometry(data.geometry), this.getMaterial(data.material));
			break;

		case "TextBitmap":
			object = TextBitmap.fromJSON(data, this.getTexture(data.texture));
			break;

		case "TextSprite":
			object = TextSprite.fromJSON(data);
			break;

		case "LOD":
			object = new LOD();
			break;

		case "Line":
			object = new Line(this.getGeometry(data.geometry), this.getMaterial(data.material), data.mode);
			break;

		case "LineLoop":
			object = new LineLoop(this.getGeometry(data.geometry), this.getMaterial(data.material));
			break;

		case "LineSegments":
			object = new LineSegments(this.getGeometry(data.geometry), this.getMaterial(data.material));
			break;

		case "PointCloud":
		case "Points":
			object = new Points(this.getGeometry(data.geometry), this.getMaterial(data.material));
			break;

		case "Sprite":
			object = new Sprite(this.getMaterial(data.material));
			break;

		case "Group":
			object = new Group();
			break;

		case "Bone":
			object = new Bone();
			break;

		default:
			object = new Group();
		}
	}
	catch (e)
	{
		console.error("nunuStudio: Error parsing and creating object " + data.uuid + ", object skiped.", e, data);
		object = new Group();
	}

	object.uuid = data.uuid;
	object.name = data.name;

	object.locked = data.locked === true || data.hidden === true;
	object.folded = data.folded === true;

	if (data.frustumCulled !== undefined)
	{
		object.frustumCulled = data.frustumCulled;
	}
	
	if (data.renderOrder !== undefined)
	{
		object.renderOrder = data.renderOrder;
	}
	
	// Animations
	if (data.animations !== undefined)
	{
		object.animations = [];

		for (var i = 0; i < data.animations.length; i++)
		{
			var clip = AnimationClip.parse(data.animations[i]);

			if (data.animations[i].uuid !== undefined)
			{
				clip.uuid = data.animations[i].uuid;
			}

			object.animations.push(clip);
		}
	}

	// Get or generate tranformation matrix if necessary
	if (data.matrix !== undefined)
	{
		object.matrix.fromArray(data.matrix);
		object.matrix.decompose(object.position, object.quaternion, object.scale);
	}

	// If available use position rotation and quarternion stored in file
	if (data.position !== undefined) {object.position.fromArray(data.position);}
	if (data.rotation !== undefined) {object.rotation.fromArray(data.rotation);}
	if (data.quaternion !== undefined) {object.quaternion.fromArray(data.quaternion);}
	if (data.scale !== undefined) {object.scale.fromArray(data.scale);}

	// Shadow casting
	object.castShadow = data.castShadow === true;
	object.receiveShadow = data.receiveShadow === true;

	// Shadowmap data
	if (data.shadow !== undefined) {object.shadow.fromJSON(data.shadow);}

	// Visibility
	object.visible = data.visible === true;

	// Aditional user data
	if (data.userData !== undefined) {object.userData = data.userData;}
	if (data.layers !== undefined) {object.layers.mask = data.layers;}
	
	// Add children
	if (data.children !== undefined)
	{
		for (var child in data.children)
		{
			object.add(this.parseObject(data.children[child]));
		}
	}

	// Set static and update transformation matrix if necessary
	if (data.matrixAutoUpdate !== undefined)
	{
		object.matrixAutoUpdate = data.matrixAutoUpdate;
		
		if (!object.matrixAutoUpdate)
		{
			object.updateMatrix();
			object.updateMatrixWorld(true);
		}
	}

	// Attach resources to program
	if (data.type === "Program")
	{
		object.copyResources(this);
	}
	// Get scene default cameras
	else if (data.type === "Scene")
	{
		for (var i = 0; i < object.cameras.length; i++)
		{
			var camera = object.getCamera(object.cameras[i]);
			if (camera !== null)
			{
				object.cameras[i] = camera;
			}
			else
			{
				object.cameras.splice(i, 1);
			}
		}
	}
	// LOD objects
	else if (data.type === "LOD")
	{
		var levels = data.levels;
		for (var l = 0; l < levels.length; l++)
		{
			var level = levels[l];
			var child = object.getObjectByProperty("uuid", level.object);
			if (child !== undefined)
			{
				object.addLevel(child, level.distance);
			}
		}
	}

	return object;
};
export {ObjectLoader};
