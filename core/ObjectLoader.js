"use strict";

//Object loader constructor
function ObjectLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	this.texturePath = "";
}

//Object loader methods
ObjectLoader.prototype.load = load;
ObjectLoader.prototype.parse = parse;
ObjectLoader.prototype.setTexturePath = setTexturePath;
ObjectLoader.prototype.setCrossOrigin = setCrossOrigin;
ObjectLoader.prototype.parseGeometries = parseGeometries;
ObjectLoader.prototype.parseMaterials = parseMaterials;
ObjectLoader.prototype.parseAnimations = parseAnimations;
ObjectLoader.prototype.parseImages = parseImages;
ObjectLoader.prototype.parseTextures = parseTextures;
ObjectLoader.prototype.parseObject = parseObject;

//Load object from url
function load(url, onLoad, onProgress, onError)
{
	if(this.texturePath === "")
	{
		this.texturePath = url.substring(0, url.lastIndexOf("/") + 1);
	}

	var self = this;
	var loader = new THREE.XHRLoader(this.manager);

	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
}

//Parse a object file
function parse(json, onLoad)
{
	var geometries = this.parseGeometries(json.geometries);
	var images = this.parseImages(json.images, function()
	{
		if(onLoad !== undefined)
		{
			onLoad(object);
		}
	});

	var textures = this.parseTextures(json.textures, images);
	var materials = this.parseMaterials(json.materials, textures);

	
	var object = this.parseObject(json.object, geometries, materials, textures);

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
function setTexturePath(value)
{
	this.texturePath = value;
}

//Set cross origin
function setCrossOrigin(value)
{
	this.crossOrigin = value;
}

//Parse geometries
function parseGeometries(json)
{
	var geometries = [];

	if(json !== undefined)
	{
		var geometryLoader = new THREE.JSONLoader();
		var bufferGeometryLoader = new THREE.BufferGeometryLoader();

		for(var i = 0, l = json.length; i < l; i ++)
		{
			var geometry;
			var data = json[i];

			switch(data.type)
			{
				case "PlaneGeometry":
				case "PlaneBufferGeometry":
					geometry = new THREE[data.type](
						data.width,
						data.height,
						data.widthSegments,
						data.heightSegments
					);
					break;

				case "BoxGeometry":
				case "BoxBufferGeometry":
				case "CubeGeometry":
					geometry = new THREE[data.type](
						data.width,
						data.height,
						data.depth,
						data.widthSegments,
						data.heightSegments,
						data.depthSegments
					);
					break;

				case "CircleGeometry":
				case "CircleBufferGeometry":
					geometry = new THREE[data.type](
						data.radius,
						data.segments,
						data.thetaStart,
						data.thetaLength
					);
					break;

				case "CylinderGeometry":
				case "CylinderBufferGeometry":
					geometry = new THREE[data.type](
						data.radiusTop,
						data.radiusBottom,
						data.height,
						data.radialSegments,
						data.heightSegments,
						data.openEnded,
						data.thetaStart,
						data.thetaLength
					);
					break;

				case 'ConeGeometry':
				case 'ConeBufferGeometry':

						geometry = new THREE [ data.type ](
							data.radius,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

				case "SphereGeometry":
				case "SphereBufferGeometry":
					geometry = new THREE[data.type](
						data.radius,
						data.widthSegments,
						data.heightSegments,
						data.phiStart,
						data.phiLength,
						data.thetaStart,
						data.thetaLength
					);
					break;

					case 'DodecahedronGeometry':
					case 'IcosahedronGeometry':
					case 'OctahedronGeometry':
					case 'TetrahedronGeometry':

						geometry = new THREE[ data.type ](
							data.radius,
							data.detail
						);

						break;

				case "RingGeometry":
				case "RingBufferGeometry":
					geometry = new THREE[data.type](
						data.innerRadius,
						data.outerRadius,
						data.thetaSegments,
						data.phiSegments,
						data.thetaStart,
						data.thetaLength
					);
					break;

				case "TorusGeometry":
				case "TorusBufferGeometry":
					geometry = new THREE[data.type](
						data.radius,
						data.tube,
						data.radialSegments,
						data.tubularSegments,
						data.arc
					);
					break;

				case "TorusKnotGeometry":
				case "TorusKnotBufferGeometry":
					geometry = new THREE[data.type](
						data.radius,
						data.tube,
						data.tubularSegments,
						data.radialSegments,
						data.p,
						data.q
					);
					break;

				case "LatheGeometry":
				case 'LatheBufferGeometry':
					geometry = new THREE[ data.type ](
						data.points,
						data.segments,
						data.phiStart,
						data.phiLength
					);
					break;

				case "BufferGeometry":
					geometry = bufferGeometryLoader.parse(data);
					break;

				case "Geometry":
					geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
					break;

				default:
					console.warn('ObjectLoader: Unsupported geometry type "' + data.type + '"');
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
function parseMaterials(json, textures)
{
	var materials = [];

	if(json !== undefined)
	{
		var loader = new THREE.MaterialLoader();
		loader.setTextures(textures);

		for(var i = 0, l = json.length; i < l; i ++)
		{
			var material = loader.parse(json[i]);
			materials[material.uuid] = material;
		}
	}

	return materials;
}

//Parse animations
function parseAnimations(json)
{
	var animations = [];

	for(var i = 0; i < json.length; i ++)
	{
		var clip = THREE.AnimationClip.parse(json[i]);
		animations.push(clip);
	}

	return animations;
}

//Parse images
function parseImages(json, onLoad)
{
	var scope = this;
	var images = [];

	function loadImage(url)
	{
		scope.manager.itemStart(url);
		return loader.load(url, function()
		{
			scope.manager.itemEnd(url);
		});
	}

	if(json !== undefined && json.length > 0)
	{
		var manager = new THREE.LoadingManager(onLoad);

		var loader = new THREE.ImageLoader(manager);
		loader.setCrossOrigin(this.crossOrigin);

		for(var i = 0, l = json.length; i < l; i ++)
		{
			var image = json[i];
			var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : scope.texturePath + image.url;
			images[image.uuid] = loadImage(path);
		}
	}

	return images;
}

//Parse textures
function parseTextures(json, images)
{
	function parseConstant(value)
	{
		if(typeof(value) === "number")
		{
			return value;
		}

		console.warn("ObjectLoader.parseTexture: Constant should be in numeric form.", value);
		return THREE[value];
	}

	var textures = [];

	if(json !== undefined)
	{
		for(var i = 0, l = json.length; i < l; i ++)
		{
			var data = json[i];

			if(data.image === undefined)
			{
				console.warn("ObjectLoader: No image specified for", data.uuid);
			}

			if(images[data.image] === undefined)
			{
				console.warn("ObjectLoader: Undefined image", data.image);
			}

			var texture = new THREE.Texture(images[ data.image ]);
			texture.needsUpdate = true;
			texture.uuid = data.uuid;

			if(data.name !== undefined)
			{
				texture.name = data.name;
			}
			if(data.mapping !== undefined)
			{
				texture.mapping = parseConstant(data.mapping);
			}
			if(data.offset !== undefined)
			{
				texture.offset = new THREE.Vector2(data.offset[0], data.offset[1]);
			}
			if(data.repeat !== undefined)
			{
				texture.repeat = new THREE.Vector2(data.repeat[0], data.repeat[1]);
			}
			if(data.minFilter !== undefined)
			{
				texture.minFilter = parseConstant(data.minFilter);
			}
			if(data.magFilter !== undefined)
			{
				texture.magFilter = parseConstant(data.magFilter);
			}
			if(data.anisotropy !== undefined)
			{
				texture.anisotropy = data.anisotropy;
			}
			if(data.flipY !== undefined)
			{
				texture.flipY = data.flipY;
			}

			if(Array.isArray(data.wrap))
			{
				texture.wrapS = parseConstant(data.wrap[0]);
				texture.wrapT = parseConstant(data.wrap[1]);
			}
			
			textures[data.uuid] = texture;
		}
	}

	return textures;
}

//Parse objects
function parseObject(data, geometries, materials, textures)
{
	var matrix = new THREE.Matrix4();
	var object;

	function getTexture(name)
	{
		if(textures[name] === undefined)
		{
			console.warn("ObjectLoader: Undefined texture", name);
		}

		return textures[name];
	}

	function getGeometry(name)
	{
		if(geometries[name] === undefined)
		{
			console.warn("ObjectLoader: Undefined geometry", name);
		}

		return geometries[name];
	}

	function getMaterial(name)
	{
		if(name === undefined)
		{
			return undefined;
		}

		if(materials[name] === undefined)
		{
			console.warn("ObjectLoader: Undefined material", name);
		}

		return materials[name];
	}

	switch(data.type)
	{
		case "Audio":
			object = new Audio();
			object.autoplay = data.autoplay;
			object.startTime = data.startTime;
			object.playbackRate = data.playbackRate;
			object.source.loop = data.source.loop;
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
					emitter.color.value[i] = THREE.Color.fromJSON(emitter.color.value[i]);
					emitter.color.spread[i] = THREE.Vector3.fromJSON(emitter.color.spread[i]);
				}
			}
			object = new ParticleEmitter(data.group, data.emitter);
			break;
			
		case "Text3D":
			object = new Text3D(data.text, getMaterial(data.material), new THREE.Font(data.font));
			break;

		case "Program":
			object = new Program(data.name);
			object.description = data.description;
			object.author = data.author;
			object.version = data.version;
			object.vr = data.vr;
			object.vr_scale = data.vr_scale;
			if(data.initial_scene !== undefined)
			{
				object.initial_scene = data.initial_scene;
			}
			break;

		case "LeapDevice":
			object = new LeapHand();
			object.mode = data.mode;
			object.use_arm = data.use_arm;
			if(data.debug_model !== undefined)
			{
				object.debug_model = data.debug_model;
			}
			if(data.gestures_enabled !== undefined)
			{
				object.gestures_enabled = data.gestures_enabled;
			}
			if(data.poses_enabled !== undefined)
			{
				object.poses_enabled = data.poses_enabled;
			}
			break;

		case "Kinect":
			object = new KinectDevice();
			if(data.debug_model !== undefined)
			{
				object.debug_model = data.debug_model;
			}
			break;

		case "Sky":
			object = new Sky(data.auto_update, data.day_time, data.sun_distance, data.time);
			break;

		case "Scene":
			object = new Scene();
			object.fog_color = data.fog_color;
			object.fog_density = data.fog_density;
			object.fog_near = data.fog_near;
			object.fog_far = data.fog_far;
			object.setFogMode(data.fog_mode);
			if(data.background !== undefined)
			{
				object.background = new THREE.Color(data.background.r, data.background.g, data.background.b);
			}
			if(data.initial_camera !== undefined)
			{
				object.initial_camera = data.initial_camera;
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
			break;

		case "OrthographicCamera":
			object = new OrthographicCamera(data.size, data.aspect, data.mode, data.near, data.far);
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
		case "SkinnedMesh":
			var geometry = getGeometry(data.geometry);
			var material = getMaterial(data.material);
			if(geometry.bones && geometry.bones.length > 0)
			{
				object = new AnimatedModel(geometry, material);
			}
			else
			{
				object = new Model3D(geometry, material);
			}
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

		case "Script":
			object = new Script(data.code, data.mode);
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

	//Visibility data
	if(data.castShadow !== undefined)
	{
		object.castShadow = data.castShadow;
	}
	if(data.receiveShadow !== undefined)
	{
		object.receiveShadow = data.receiveShadow;
	}
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
			object.add(this.parseObject(data.children[child], geometries, materials, textures));
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

	//LOD objects
	if(data.type === "Program")
	{
		object.materials = materials;
		object.textures = textures;
		object.geometries = geometries;
	}
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
