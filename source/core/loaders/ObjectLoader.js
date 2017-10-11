"use strict";

/**
 * Objectloader can be used to load external objects from files.
 *
 * Also loads all resources attached to the objects being loaded.
 * 
 * Can parse be used to load on runtime resources and objects from external isp project files.
 * 
 * @constructor
 * @class ObjectLoader
 * @module Loaders
 * @param {Object} manager
 */
function ObjectLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	this.texturePath = "";
}

/**
 * Load object file from URL.
 *
 * @method load
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
ObjectLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	if(this.texturePath === "")
	{
		this.texturePath = url.substring(0, url.lastIndexOf("/") + 1);
	}

	var self = this;
	
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
};


/**
 * Parse JSON object.
 * 
 * Data can be loaded from a file using the FileSystem methods and parsed to an Object using JSON.parse() method.
 *
 * @method parse
 * @param {Object} json JSON data to be loaded.
 * @param {Function} onLoad onLoad callback.
 * @return {Object} Program loaded from json data.
 */
ObjectLoader.prototype.parse = function(json, onLoad)
{
	var geometries = this.parseGeometries(json.geometries);
	var images = this.parseImages(json.images);
	var videos = this.parseVideos(json.videos);
	var audio = this.parseAudio(json.audio);
	var fonts = this.parseFonts(json.fonts);
	var textures = this.parseTextures(json.textures, images, videos);
	var materials = this.parseMaterials(json.materials, textures);
	var object = this.parseObject(json.object, geometries, materials, textures, audio, fonts);

	if(json.skeletons)
	{
		var skeletons = this.parseSkeletons(json.skeletons, object);
		this.bindSkeletons(object, skeletons);
	}

	if(json.animations)
	{
		object.animations = this.parseAnimations(json.animations);
	}

	if(json.images === undefined || json.images.length === 0)
	{
		if(onLoad !== undefined)
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
 * @param {String} path
 */
ObjectLoader.prototype.setTexturePath = function(path)
{
	this.texturePath = path;
};

/**
 * Set cross origin.
 *
 * @method setCrossOrigin
 * @param {String} origin
 */
ObjectLoader.prototype.setCrossOrigin = function(origin)
{
	this.crossOrigin = origin;
};

/**
 * Parse geometries on JSON.
 *
 * @method parseGeometries
 * @param {Object} json
 * @return {Array} geometries
 */
ObjectLoader.prototype.parseGeometries = function(json)
{
	var geometries = [];

	if(json !== undefined)
	{
		var geometryLoader = new THREE.JSONLoader();
		var bufferGeometryLoader = new THREE.BufferGeometryLoader();

		for(var i = 0; i < json.length; i++)
		{
			var geometry;
			var data = json[i];

			switch(data.type)
			{
				case "PlaneGeometry":
				case "PlaneBufferGeometry":
					geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
					break;

				case "BoxGeometry":
				case "BoxBufferGeometry":
				case "CubeGeometry":
					geometry = new THREE[data.type](data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
					break;

				case "CircleGeometry":
				case "CircleBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.segments, data.thetaStart, data.thetaLength);
					break;

				case "CylinderGeometry":
				case "CylinderBufferGeometry":
					geometry = new THREE[data.type](data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
					break;

				case "ConeGeometry":
				case "ConeBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
					break;

				case "SphereGeometry":
				case "SphereBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
					break;

				case "DodecahedronGeometry":
				case "IcosahedronGeometry":
				case "OctahedronGeometry":
				case "TetrahedronGeometry":
				case "DodecahedronBufferGeometry":
				case "IcosahedronBufferGeometry":
				case "OctahedronBufferGeometry":
				case "TetrahedronBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.detail);
					break;
				case "PolyhedronGeometry":
				case "PolyhedronBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.indices, data.radius, data.detail);
					break;
				case "RingGeometry":
				case "RingBufferGeometry":
					geometry = new THREE[data.type](data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
					break;

				case "TorusGeometry":
				case "TorusBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
					break;

				case "TorusKnotGeometry":
				case "TorusKnotBufferGeometry":
					geometry = new THREE[data.type](data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q);
					break;

				case "LatheGeometry":
				case "LatheBufferGeometry":
					geometry = new THREE[data.type](data.points, data.segments, data.phiStart, data.phiLength);
					break;

				case "BufferGeometry":
					geometry = bufferGeometryLoader.parse(data);
					break;

				case "Geometry":
					geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
					break;

				default:
					console.warn("ObjectLoader: Unsupported geometry type " + data.type);
					continue;
			}

			geometry.uuid = data.uuid;

			if(data.name !== undefined)
			{
				geometry.name = data.name;
			}
			else
			{
				geometry.name = "geometry";
			}

			geometries[data.uuid] = geometry;
		}
	}

	return geometries;
};

/**
 * Parse materials on json.
 *
 * @method parseMaterials
 * @param {Object} json
 * @return {Array} materials
 */
ObjectLoader.prototype.parseMaterials = function(json, textures)
{
	var materials = [];
	var loader = new MaterialLoader();
	loader.setTextures(textures);

	if(json !== undefined)
	{
		for(var i in json)
		{
			var material = loader.parse(json[i]);
			materials[material.uuid] = material;
		}
	}

	return materials;
};

/**
 * Parse animations on json.
 *
 * @method parseAnimations
 * @param {Object} json
 * @return {Array} animations
 */
ObjectLoader.prototype.parseAnimations = function(json)
{
	var animations = [];

	for(var i = 0; i < json.length; i++)
	{
		var clip = THREE.AnimationClip.parse(json[i]);
		animations.push(clip);
	}

	return animations;
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
	var loader = new ImageLoader();
	var images = [];

	if(json !== undefined)
	{
		for(var i in json)
		{
			images[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return images;
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
	var loader = new VideoLoader();
	var videos = [];

	if(json !== undefined)
	{
		for(var i in json)
		{
			videos[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return videos;
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
	var loader = new AudioLoader();
	var audio = [];

	if(json !== undefined)
	{
		for(var i in json)
		{
			audio[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return audio;
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
	var loader = new FontLoader();
	var fonts = [];

	if(json !== undefined)
	{
		for(var i in json)
		{
			fonts[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return fonts;
};

/**
 * Parse textures on json.
 *
 * @method parseTextures
 * @param {Object} json
 * @param {Array} images
 * @param {Array} videos
 * @return {Array} textures
 */
ObjectLoader.prototype.parseTextures = function(json, images, videos)
{
	var textures = [];
	var loader = new TextureLoader();
	loader.setImages(images);
	loader.setVideos(videos);

	if(json !== undefined)
	{
		for(var i in json)
		{
			textures[json[i].uuid] = loader.parse(json[i]);
		}
	}
	
	return textures;
};

/**
 * Parse skeletons from json.
 *
 * @method parseSkeletons
 * @param {Object} json
 * @param {Object} object
 */
ObjectLoader.prototype.parseSkeletons = function(json, object)
{
	var skeletons = {};

	if(json === undefined)
	{
		return skeletons;
	}

	for(var i = 0; i < json.length; i++)
	{
		var skeletonParams = json[i];

		var uuid = skeletonParams.uuid;
		var boneParams = skeletonParams.bones;
		var boneInverseParams = skeletonParams.boneInverses;

		var bones = [];
		var boneInverses = [];

		for(var j = 0, jl = boneParams.length; j < jl; j++)
		{
			var bone = object.getObjectByProperty("uuid", boneParams[j]);

			if(bone === undefined)
			{
				console.warn("THREE.ObjectLoader: Not found Bone whose uuid is " + boneParams[j]);
				bone = new THREE.Bone();
			}

			bones.push(bone);
			boneInverses.push(new THREE.Matrix4().fromArray(boneInverseParams[j]));
		}

		skeletons[uuid] = new Skeleton(bones, boneInverses);
	}

	return skeletons;
};

/**
 * Auxiliar method to bind skeletons to loaded objects.
 *
 * @method bindSkeletons
 * @param {Object3D} object Object3D that contains objects
 * @param {Array} skeletons Array of skeletons to be binded.
 */
ObjectLoader.prototype.bindSkeletons = function(object, skeletons)
{
	if(Object.keys(skeletons).length === 0)
	{
		return;
	}
	
	object.traverse(function(obj)
	{
		if(obj.isSkinnedMesh === true && obj.skeletonUUID !== undefined)
		{
			var skeleton = skeletons[obj.skeletonUUID];

			if(skeleton === undefined)
			{
				console.warn( 'THREE.ObjectLoader: Not found Skeleton whose uuid is ' + obj.skeletonUUID);
			}
			else
			{
				obj.bind(skeleton, obj.bindMatrix);
			}

			delete obj.skeletonUUID;
		}
	});
};
/**
 * Parse objects from json.
 *
 * @method parseObjects
 * @param {Object} json
 * @param {Array} geometries
 * @param {Array} materials
 * @param {Array} textures
 * @param {Array} audio
 * @param {Array} fonts
 * @return {Array} objects
 */
ObjectLoader.prototype.parseObject = function(data, geometries, materials, textures, audio, fonts)
{
	var matrix = new THREE.Matrix4();
	var object;

	function getTexture(uuid)
	{
		if(textures[uuid] === undefined)
		{
			console.warn("ObjectLoader: Undefined texture", uuid);
		}
		return textures[uuid];
	}

	function getGeometry(uuid)
	{
		if(geometries[uuid] === undefined)
		{
			console.warn("ObjectLoader: Undefined geometry", uuid);
		}
		return geometries[uuid];
	}

	function getMaterial(uuid)
	{
		if(uuid instanceof Array)
		{
			var array = [];
			for(var i = 0; i < uuid.length; i++)
			{
				array.push(materials[uuid[i]]);
			}
			
			return array;
		}

		if(materials[uuid] === undefined)
		{
			console.warn("ObjectLoader: Undefined material", uuid);
		}

		return materials[uuid];
	}

	function getFont(uuid)
	{
		if(fonts[uuid] === undefined)
		{
			console.warn("ObjectLoader: Undefined font", uuid);
		}
		return fonts[uuid];
	}

	function getAudio(uuid)
	{
		if(audio[uuid] === undefined)
		{
			console.warn("ObjectLoader: Undefined audio", uuid);
		}
		return audio[uuid];
	}

	switch(data.type)
	{
		case "SpineAnimation":
			for(var i = 0; i < data.textures.length; i++)
			{
				data.textures[i].texture = getTexture(data.textures[i].texture);
			}

			object = new SpineAnimation(data.json, data.atlas, "", data.textures);
			
			if(data.animation !== undefined)
			{
				object.animation = data.animation;
			}
			if(data.skin !== undefined)
			{
				object.skin = data.skin;
			}
			break;

		case "Audio":
			object = new AudioEmitter(getAudio(data.audio));
			object.autoplay = data.autoplay;
			object.startTime = data.startTime;
			object.playbackRate = data.playbackRate;
			object.loop = (data.source !== undefined) ? data.source.loop : data.loop;
			if(data.volume !== undefined)
			{
				object.volume = data.volume;
			}
			break;

		case "PositionalAudio":
			object = new PositionalAudio(getAudio(data.audio));
			object.autoplay = data.autoplay;
			object.startTime = data.startTime;
			object.playbackRate = data.playbackRate;
			object.loop = (data.source !== undefined) ? data.source.loop : data.loop;
			if(data.volume !== undefined)
			{
				object.volume = data.volume;
			}
			break;

		case "Physics":
			object = new PhysicsObject();
			object.body.type = data.body.type;
			object.body.mass = data.body.mass;
			object.body.linearDamping = data.body.linearDamping;
			object.body.angularDamping = data.body.angularDamping;
			object.body.allowSleep = data.body.allowSleep;
			object.body.sleepSpeedLimit = data.body.sleepSpeedLimit;
			object.body.sleepTimeLimit = data.body.sleepTimeLimit;
			object.body.collisionFilterGroup = data.body.collisionFilterGroup;
			object.body.collisionFilterMask = data.body.collisionFilterMask;
			object.body.fixedRotation = data.body.fixedRotation;
			var shapes = data.body.shapes;
			for(var i = 0; i < shapes.length; i++)
			{
				var shape = shapes[i];

				if(shape.type === CANNON.Shape.types.SPHERE)
				{
					object.body.addShape(new CANNON.Sphere(shape.radius));
				}
				else if(shape.type === CANNON.Shape.types.BOX)
				{
					object.body.addShape(new CANNON.Box(new CANNON.Vec3(shape.halfExtents.x, shape.halfExtents.y, shape.halfExtents.z)));
				}
				else if(shape.type === CANNON.Shape.types.PARTICLE)
				{
					object.body.addShape(new CANNON.Particle());
				}
				else if(shape.type === CANNON.Shape.types.PLANE)
				{
					object.body.addShape(new CANNON.Plane());
				}
				else if(shape.type === CANNON.Shape.types.CONVEXPOLYHEDRON)
				{
					object.body.addShape(new CANNON.ConvexPolyhedron(shape.vertices, shape.faces));
				}
			}
			break;

		case "ParticleEmiter":
			function loadVector3(data)
			{
				if(Array.isArray(data))
				{
					return new THREE.Vector3().fromArray(data);
				}
				else
				{
					return new THREE.Vector3(data.x, data.y, data.z);
				}
			}

			if(data.group !== undefined)
			{
				var group = data.group;
				group.texture.value = getTexture(group.texture.value);
				group.texture.frames = new THREE.Vector2().fromArray(group.texture.frames || [1, 1]);
			}
			if(data.emitter !== undefined)
			{
				var emitter = data.emitter;
				emitter.position.value = loadVector3(emitter.position.value);
				emitter.position.spread = loadVector3(emitter.position.spread);
				emitter.velocity.value = loadVector3(emitter.velocity.value);
				emitter.velocity.spread = loadVector3(emitter.velocity.spread);
				emitter.acceleration.value = loadVector3(emitter.acceleration.value);
				emitter.acceleration.spread = loadVector3(emitter.acceleration.spread);
				
				for(var i = 0; i < emitter.color.value.length; i++)
				{
					emitter.color.value[i] = new THREE.Color(emitter.color.value[i]);
					emitter.color.spread[i] = loadVector3(emitter.color.spread[i]);
				}
			}

			object = new ParticleEmitter(data.group, data.emitter);

			break;

		case "LensFlare":
			object = new LensFlare();
			
			for(var i = 0; i < data.lensFlares.length; i++)
			{
				object.addFlare(getTexture(data.lensFlares[i].texture), data.lensFlares[i].size, data.lensFlares[i].distance, data.lensFlares[i].blending, new THREE.Color(data.lensFlares[i].color), data.lensFlares[i].opacity)
			}

			break;

		case "Text3D":
			object = new Text3D(data.text, getMaterial(data.material), getFont(data.font), data.height, data.bevel, data.bevelThickness, data.bevelSize, data.size, data.curveSegments);
			break;

		case "Program":
			object = new Program(data.name);
			
			object.description = data.description;
			object.author = data.author;
			object.version = data.version;

			object.vr = data.vr;
			object.vrScale = data.vrScale;

			if(data.antialiasing !== undefined)
			{
				object.antialiasing = data.antialiasing;
				object.shadows = data.shadows;
				object.shadowsType = data.shadowsType;
			}
			
			if(data.toneMapping !== undefined)
			{
				object.toneMapping = data.toneMapping;
				object.toneMappingWhitePoint = data.toneMappingWhitePoint;
				object.toneMappingExposure = data.toneMappingExposure;
			}

			if(data.lockPointer !== undefined)
			{
				object.lockPointer = data.lockPointer;
			}

			if(data.defaultScene !== undefined)
			{
				object.defaultScene = data.defaultScene;
			}
			
			if(data.handlePixelRatio !== undefined)
			{
				object.handlePixelRatio = data.handlePixelRatio;	
			}

			break;

		case "LeapDevice":
			object = new LeapMotion();
			object.mode = data.mode;
			object.useArm = data.useArm;
			if(data.debugModel !== undefined)
			{
				object.debugModel = data.debugModel;
			}
			if(data.gesturesEnabled !== undefined)
			{
				object.gesturesEnabled = data.gesturesEnabled;
			}
			if(data.posesEnabled !== undefined)
			{
				object.posesEnabled = data.posesEnabled;
			}
			break;

		case "Kinect":
			object = new KinectDevice();
			if(data.debugModel !== undefined)
			{
				object.debugModel = data.debugModel;
			}
			break;

		case "Sky":
			object = new Sky(data.autoUpdate, data.dayTime, data.sunDistance, data.time);
			
			if(data.sun !== undefined)
			{
				object.sun.shadow.fromJSON(data.sun.shadow);
				
				if(data.sun.castShadow !== undefined)
				{
					object.sun.castShadow = data.sun.castShadow;
				}
			}

			if(data.colorTop !== undefined)
			{
				object.colorTop = [];
				for(var i = 0; i < data.colorTop.length; i++)
				{
					object.colorTop.push(new THREE.Color(data.colorTop[i])); 
				}
			}
			if(data.colorBottom !== undefined)
			{
				object.colorBottom = [];
				for(var i = 0; i < data.colorBottom.length; i++)
				{
					object.colorBottom.push(new THREE.Color(data.colorBottom[i])); 
				}
			}
			if(data.sunColor !== undefined)
			{
				object.sunColor = data.sunColor;
			}
			if(data.moonColor !== undefined)
			{
				object.moonColor = data.moonColor;
			}
			if(data.intensity !== undefined)
			{
				object.intensity = data.intensity;
			}

			break;

		case "CubeCamera":
			object = new CubeCamera(data.near, data.far, data.resolution, data.autoUpdate);
			break;
			
		case "FirstPersonControls":
			object = new FirstPersonControls();
			object.moveSpeed = data.moveSpeed;
			object.sensitivity = data.sensitivity;
			object.needsButtonPressed = data.needsButtonPressed;
			object.movementEnabled = data.movementEnabled;
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
			break;
			
		case "Scene":
			object = new Scene();

			if(data.background !== undefined)
			{
				if(Number.isInteger(data.background))
				{
					object.background = new THREE.Color(data.background);
				}
				else
				{
					object.background = getTexture(data.background);
				}
			}

			if(data.fog !== undefined)
			{
				if(data.fog.type === "Fog")
				{
					object.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far);
				}
				else if(data.fog.type === "FogExp2")
				{
					object.fog = new THREE.FogExp2(data.fog.color, data.fog.density);
				}
			}

			if(data.cameras !== undefined)
			{
				object.cameras = data.cameras;
			}

			if(data.usePhysics !== undefined)
			{
				object.usePhysics = data.usePhysics;
			}

			if(data.world !== undefined)
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
			
			if(data.focus !== undefined) 
			{
				object.focus = data.focus;
			}
			if(data.zoom !== undefined)
			{
				object.zoom = data.zoom;
			}
			if(data.filmGauge !== undefined)
			{
				object.filmGauge = data.filmGauge;
			}
			if(data.filmOffset !== undefined)
			{
				object.filmOffset = data.filmOffset;
			}
			if(data.view !== undefined)
			{
				object.view = Object.assign({}, data.view);
			}
			if(data.viewport !== undefined)
			{
				object.viewport.fromArray(data.viewport);
			}
			if(data.offset !== undefined)
			{
				object.offset.fromArray(data.offset);
			}
			if(data.clearColor !== undefined)
			{
				object.clearColor = data.clearColor;
			}
			if(data.clearDepth !== undefined)
			{
				object.clearDepth = data.clearDepth;
			}
			if(data.order !== undefined)
			{
				object.order = data.order;
			}

			if(data.composer !== undefined)
			{
				object.composer = EffectComposer.fromJSON(data.composer);
			}
			break;

		case "OrthographicCamera":
			object = new OrthographicCamera(data.size, data.aspect, data.mode, data.near, data.far);
			if(data.viewport !== undefined)
			{
				object.viewport.fromArray(data.viewport);
			}
			if(data.offset !== undefined)
			{
				object.offset.fromArray(data.offset);
			}
			if(data.clearColor !== undefined)
			{
				object.clearColor = data.clearColor;
			}
			if(data.clearDepth !== undefined)
			{
				object.clearDepth = data.clearDepth;
			}
			if(data.order !== undefined)
			{
				object.order = data.order;
			}
			if(data.composer !== undefined)
			{
				object.composer = EffectComposer.fromJSON(data.composer);
			}
			break;

		case "Script":
			object = new Script(data.code);
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

		case "SkinnedMesh":
			var geometry = getGeometry(data.geometry);
			var material = getMaterial(data.material);
			var tmpBones;

			//If data has skeleton, assumes bones are already in scene graph.
			//Then temporarily undefines geometry.bones not to create bones in SkinnedMesh constructor.
			if(data.skeleton !== undefined && geometry.bones !== undefined)
			{
				tmpBones = geometry.bones;
				geometry.bones = undefined;

			}

			object = new SkinnedMesh(geometry, material);

			//Rebinds with skeleton whose uuid is data.skeleton later.
			if(data.skeleton !== undefined)
			{
				object.skeletonUUID = data.skeleton;
			}

			if(data.bindMode !== undefined)
			{
				object.bindMode = data.bindMode;
			}

			if(data.bindMatrix !== undefined)
			{
				object.bindMatrix.fromArray(data.bindMatrix);
			}

			object.updateMatrixWorld(true);

			if(tmpBones !== undefined)
			{
				geometry.bones = tmpBones;
			}

			if(data.animations !== undefined)
			{
				for(var i = 0; i < data.animations.length; i++)
				{
					var clip = THREE.AnimationClip.parse(data.animations[i]);
					object.animations.push(clip);
				}
			}

			break;

		case "Mesh":
			var geometry = getGeometry(data.geometry);
			var material = getMaterial(data.material);

			if(geometry.bones && geometry.bones.length > 0)
			{
				object = new SkinnedMesh(geometry, material);
			}
			else
			{
				object = new Mesh(geometry, material);
			}
			break;

		case "LOD":
			object = new THREE.LOD();
			break;

		case "Line":
			object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
			break;

		case "LineLoop":
			object = new THREE.LineLoop(getGeometry(data.geometry), getMaterial(data.material));
			break;

		case "LineSegments":
			object = new THREE.LineSegments(getGeometry(data.geometry), getMaterial(data.material));
			break;

		case "PointCloud":
		case "Points":
			object = new THREE.Points(getGeometry(data.geometry), getMaterial(data.material));
			break;

		case "Sprite":
			object = new Sprite(getMaterial(data.material));
			break;

		case "Group":
			object = new Container();
			break;

		case "Bone":
			object = new THREE.Bone();
			break;

		default:
			object = new Container();
	}

	object.uuid = data.uuid;

	if(data.name !== undefined)
	{
		object.name = data.name;
	}
	if(data.hidden !== undefined)
	{
		object.hidden = data.hidden;
	}
	if(data.folded !== undefined)
	{
		object.folded = data.folded;
	}

	//Get or generate tranformation matrix if necessary
	if(data.matrix !== undefined)
	{
		matrix.fromArray(data.matrix);
		matrix.decompose(object.position, object.quaternion, object.scale);
	}
	else
	{
		if(data.position !== undefined)
		{
			object.position.fromArray(data.position);
		}
		if(data.rotation !== undefined)
		{
			object.rotation.fromArray(data.rotation);
		}
		if(data.quaternion !== undefined)
		{
			object.quaternion.fromArray(data.quaternion);
		}
		if(data.scale !== undefined)
		{
			object.scale.fromArray(data.scale);
		}
	}

	//Shadow casting
	if(data.castShadow !== undefined)
	{
		object.castShadow = data.castShadow;
	}
	if(data.receiveShadow !== undefined)
	{
		object.receiveShadow = data.receiveShadow;
	}

	//Shadowmap data
	if(data.shadow !== undefined)
	{
		object.shadow.fromJSON(data.shadow);
	}

	//Visibility
	if(data.visible !== undefined)
	{
		object.visible = data.visible;
	}

	//Aditional user data
	if(data.userData !== undefined)
	{
		object.userData = data.userData;
	}

	//Add children
	if(data.children !== undefined)
	{
		for(var child in data.children)
		{
			object.add(this.parseObject(data.children[child], geometries, materials, textures, audio, fonts));
		}
	}

	//Set static and update transformation matrix if necessary
	if(data.matrixAutoUpdate !== undefined)
	{
		object.matrixAutoUpdate = data.matrixAutoUpdate;
		
		if(!object.matrixAutoUpdate)
		{
			object.updateMatrix();
			object.updateMatrixWorld(true);
		}
	}

	//Attach resources to program
	if(data.type === "Program")
	{
		object.materials = materials;
		object.textures = textures;
		object.fonts = fonts;
		object.audio = audio;
		object.images = images;
		object.videos = videos;
		object.geometries = geometries;
	}
	//Get scene default cameras
	else if(data.type === "Scene")
	{
		for(var i = 0; i < object.cameras.length; i++)
		{
			var camera = object.getCamera(object.cameras[i]);
			if(camera !== null)
			{
				object.cameras[i] = camera;
			}
			else
			{
				object.cameras.splice(i, 1);
			}
		}
	}
	//LOD objects
	else if(data.type === "LOD")
	{
		var levels = data.levels;
		for(var l = 0; l < levels.length; l++)
		{
			var level = levels[l];
			var child = object.getObjectByProperty("uuid", level.object);
			if(child !== undefined)
			{
				object.addLevel(child, level.distance);
			}
		}
	}

	return object;
};
