"use strict";

function ObjectLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	this.texturePath = "";
}

//Load object from file url
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
}

//Parse a json object representation
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
}

//Set base texture path
ObjectLoader.prototype.setTexturePath = function(value)
{
	this.texturePath = value;
}

//Set cross origin
ObjectLoader.prototype.setCrossOrigin = function(value)
{
	this.crossOrigin = value;
}

//Parse geometries
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
					geometry = new THREE[data.type](data.radius, data.detail);
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
}

//Parse all materials
ObjectLoader.prototype.parseMaterials = function(json, textures)
{
	var materials = [];
	var loader = new THREE.MaterialLoader();
	loader.setTextures(textures);

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			var material = loader.parse(json[i]);
			materials[material.uuid] = material;
		}
	}

	return materials;
}

//Parse animations
ObjectLoader.prototype.parseAnimations = function(json)
{
	var animations = [];

	for(var i = 0; i < json.length; i++)
	{
		var clip = THREE.AnimationClip.parse(json[i]);
		animations.push(clip);
	}

	return animations;
}

//Parse images
ObjectLoader.prototype.parseImages = function(json)
{
	var loader = new ImageLoader();
	var images = [];

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			images[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return images;
}

//Parse videos
ObjectLoader.prototype.parseVideos = function(json)
{
	var loader = new VideoLoader();
	var videos = [];

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			videos[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return videos;
}

//Parse audio
ObjectLoader.prototype.parseAudio = function(json)
{
	var loader = new AudioLoader();
	var audio = [];

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			audio[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return audio;
}

//Parse fonts
ObjectLoader.prototype.parseFonts = function(json)
{
	var loader = new FontLoader();
	var fonts = [];

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			fonts[json[i].uuid] = loader.parse(json[i]);
		}
	}

	return fonts;
}

//Parse textures
ObjectLoader.prototype.parseTextures = function(json, images, videos)
{
	var loader = new TextureLoader();
	loader.setImages(images);
	loader.setVideos(videos);

	var textures = [];

	if(json !== undefined)
	{
		for(var i = 0; i < json.length; i++)
		{
			var texture = loader.parse(json[i]);
			textures[texture.uuid] = texture;
		}
	}
	
	return textures;
}

//Parse objects
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
			if(data.group !== undefined)
			{
				var group = data.group;
				group.texture.value = getTexture(group.texture.value);
				group.textureFrames = THREE.Vector2(group.textureFrames);
			}
			if(data.emitter !== undefined)
			{
				var emitter = data.emitter;
				emitter.position.value = THREE.Vector3.fromJSON(emitter.position.value);
				emitter.position.spread = THREE.Vector3.fromJSON(emitter.position.spread);
				emitter.velocity.value = THREE.Vector3.fromJSON(emitter.velocity.value);
				emitter.velocity.spread = THREE.Vector3.fromJSON(emitter.velocity.spread);
				emitter.acceleration.value = THREE.Vector3.fromJSON(emitter.acceleration.value);
				emitter.acceleration.spread = THREE.Vector3.fromJSON(emitter.acceleration.spread);
				
				for(var i = 0; i < emitter.color.value.length; i++)
				{
					emitter.color.value[i] = new THREE.Color(emitter.color.value[i]);
					emitter.color.spread[i] = THREE.Vector3.fromJSON(emitter.color.spread[i]);
				}
			}

			
			object = new ParticleEmitter(data.group, data.emitter);

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

			if(data.lockPointer !== undefined)
			{
				object.lockPointer = data.lockPointer;
			}

			if(data.defaultScene !== undefined)
			{
				object.defaultScene = data.defaultScene;
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
			}
			if(data.colorTop !== undefined)
			{
				object.colorTop = data.colorTop;
			}
			if(data.colorBottom !== undefined)
			{
				object.colorBottom = data.colorBottom;
			}
			if(data.sunColor !== undefined)
			{
				object.sunColor = data.sunColor;
			}
			if(data.moonColor !== undefined)
			{
				object.moonColor = data.moonColor;
			}
			break;

		case "Scene":
			object = new Scene();
			if(data.background !== undefined)
			{
				if(Number.isInteger(data.background))
				{
					object.background = new THREE.Color(data.background);
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
			if(data.world !== undefined)
			{
				object.world.gravity.set(data.world.gravity.x, data.world.gravity.y, data.world.gravity.z);
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

		case "Mesh":
			object = new Mesh(getGeometry(data.geometry), getMaterial(data.material));
			break;

		case "SkinnedMesh":
			object = new SkinnedMesh(getGeometry(data.geometry), getMaterial(data.material));
			break;

		case "LOD":
			object = new THREE.LOD();
			break;

		case "Line":
			object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
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
			object = new Bone();
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
		//object.images = images;
		//object.videos = videos;
		//object.geometries = geometries;
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
}
