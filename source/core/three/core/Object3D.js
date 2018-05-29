"use strict";

/**
 * This is the base class for most objects in three.js and provides a set of properties and methods for manipulating objects in 3D space.
 * 
 * This page provides documentation for some of the main features of this class, the original documentation of this class can be found at https://threejs.org/docs/index.html#Reference/Core/Object3D.
 * 
 * All nunuStudio objects extend the Object3D class of some other higher level class from three.js.
 * 
 * @class Object3D
 * @module THREE
 * @constructor
 */

/**
 * Array with object's children.
 * @property children
 * @type {Array}
*/
/**
 * When this is set, it checks every frame if the object is in the frustum of the camera before rendering the object. Otherwise the object gets renderered every frame even if it isn't visible.
 * @property frustumCulled
 * @default true
 * @type {boolean}
*/
/**
 * The layer membership of the object. The object is only visible if it has at least one layer in common with the Camera in use.
 * @property layers
 * @type {Layers}
*/
/**
 * The local transform matrix
 * @property matrix
 * @type {Matrix4}
*/
/**
 * When this is set, it calculates the matrix of position, (rotation or quaternion) and scale every frame and also recalculates the matrixWorld property.
 * @property matrixAutoUpdate
 * @default true
 * @type {boolean}
*/
/**
 * The global transform of the object. If the Object3d has no parent, then it's identical to the local transform.
 * @property matrixWorld
 * @type {Matrix4}
*/
/**
 * Name of the object (doesn't need to be unique).
 * @property name
 * @type {String}
*/
/**
 * The object's local position.
 * @property position
 * @type {Vector3}
*/
/**
 * Object's local rotation as a Quaternion.
 * @property quaternion
 * @type {Quaternion}
*/
/**
 * Object's local rotation (see Euler angles), in radians.
 * @property rotation
 * @type {Euler}
*/
/**
 * The object's local scale.
 * @property scale
 * @type {Vector3}
*/
/**
 * This is used by the lookAt method, for example, to determine the orientation of the result.
 * @property up
 * @type {Vector3}
*/
/**
 * UUID of this object instance. This gets automatically assigned, so this shouldn't be edited.
 * @property uuid
 * @type {String}
 */
/**
 * Object gets rendered if true.
 * @property visible
 * @type {boolean}
 * @default true
 */
/**
 * This value allows the default rendering order of scene graph objects to be overridden although opaque and transparent objects remain sorted independently.
 * @property renderOrder
 * @default 0
 * @type {Number}
*/
/**
 * Whether the object gets rendered into shadow map.
 * @property castShadow
 * @default false
 * @type {boolean}
*/
/**
 * Whether the material receives shadows.
 * @property receiveShadow
 * @default false
 * @type {boolean}
*/
/**
 * Space reserved for user data, can be used for variables in runtime or can be used by scripts to store values on an object.
 * @property userData
 * @type {Object}
*/
/**
 * Array with the animations available in this object.
 *
 * Each position contains an AnimationClip that has name, tracks, duration and uuid.
 *
 * @property animations
 * @type {Array}
 */
/**
 * Folded attribute is used only for editing, if true the object shows as folded in the object explorer.
 * @property folded
 * @type {boolean}
*/
THREE.Object3D.prototype.folded = false;

/**
 * Hidden objects do not show in the editor.
 * @property hidden
 * @type {boolean}
*/
THREE.Object3D.prototype.locked = false;

/**
 * Play animations attached to this object.
 *
 * Animations rely on other objects, if some of these are missing the animation will have problems playing.
 *
 * @method playAnimation
 */
THREE.Object3D.prototype.playAnimation = function()
{
	if(this.mixer !== undefined)
	{
		this.mixer.play();
	}
};

/**
 * Stop all animations playback.
 * 
 * @method stopAnimation
 */
THREE.Object3D.prototype.stopAnimation = function()
{
	if(this.mixer !== undefined)
	{
		this.mixer.stop();
	}
};

/**
 * Initializes the object.
 *
 * This method is calling one time on initialization.
 * 
 * @method initialize
 */
THREE.Object3D.prototype.initialize = function()
{
	if(this.animations !== undefined)
	{	
		this.mixer = new AnimationMixer(this);
		this.mixer.createActions(this.animations);
		this.mixer.play();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

/**
 * Update the object state.
 * 
 * Called every time before rendering into the screen.
 * 
 * @method update
 * @param {Number} delta Time since last update call.
 */
THREE.Object3D.prototype.update = function(delta)
{
	if(this.mixer !== undefined)
	{
		this.mixer.update(delta);
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update(delta);
	}
};

/**
 * Resize this object, called everytime the window is resized.
 * 
 * @method resize
 * @param {Number} x Screen width.
 * @param {Number} y Screen height.
 */
THREE.Object3D.prototype.resize = function(x, y)
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].resize(x, y);
	}
};

/**
 * Disposes the object from memory.
 * 
 * Should be called when the object is no longer required to avoid memory leaks.
 * 
 * @method dispose
 */
THREE.Object3D.prototype.dispose = function()
{
	if(this.mixer !== undefined)
	{
		this.mixer.dispose();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
};

/**
 * Add object as children of this object above the indicated children
 *
 * @method addAbove
 * @param {Object3D} object
 * @param {Number} index
 */
THREE.Object3D.prototype.addAbove = function(object, children)
{
	if(object === this)
	{
		console.error("THREE.Object3D.add: object can't be added as a child of itself.", object );
		return this;
	}

	if(object && object.isObject3D)
	{
		if(object.parent !== null)
		{
			object.parent.remove(object);
		}

		object.parent = this;
		object.dispatchEvent({type: "added"});

		var index = this.children.indexOf(children);

		this.children.splice(index, 0, object);
	}
	else
	{
		console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
	}

	return this;
};

/**
 * Add object as children of this object bellow the indicated children
 *
 * @method addBellow
 * @param {Object3D} object
 * @param {Number} index
 */
THREE.Object3D.prototype.addBellow = function(object, children)
{
	if(object === this)
	{
		console.error("THREE.Object3D.add: object can't be added as a child of itself.", object );
		return this;
	}

	if(object && object.isObject3D)
	{
		if(object.parent !== null)
		{
			object.parent.remove(object);
		}

		object.parent = this;
		object.dispatchEvent({type: "added"});

		var index = this.children.indexOf(children) + 1;

		this.children.splice(index, 0, object);
	}
	else
	{
		console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
	}

	return this;
};

/**
 * Remove all children from the object.
 * 
 * @method removeAll
 */
THREE.Object3D.prototype.removeAll = function()
{
	for(var i = this.children.length - 1; i > -1; i--)
	{
		this.remove(this.children[i]);
	}
};

/**
 * Check if object is empty (has no childrens).
 * 
 * @method isEmpty
 * @return {boolean} True is object is empty
 */
THREE.Object3D.prototype.isEmpty = function()
{
	return this.children.length === 0;
};

/**
 * Destroy object, dispose and remove from its parent.
 * 
 * @method destroy
 */
THREE.Object3D.prototype.destroy = function()
{
	while(this.children.length > 0)
	{
		this.children[0].destroy();
	}
	
	if(this.parent !== null)
	{
		if(this.dispose)
		{
			this.dispose();
		}
		
		this.parent.remove(this);
		this.parent = null;
	}
};

/**
 * Serialize object to JSON.
 * @method toJSON
 * @param {Object} meta
 * @param {Function} resourceAccess
 * @param {boolean} recursive
 * @return {Object} json
 */
THREE.Object3D.prototype.toJSON = function(meta, resourceAccess, recursive)
{
	var isRootObject = (meta === undefined);
	var output = {};

	//If root object initialize base structure
	if(isRootObject)
	{
		meta =
		{
			fonts: {},
			videos: {},
			images: {},
			audio: {},
			geometries: {},
			materials: {},
			textures: {},
			skeletons: {},
			shapes: {},
			resources: {}
		};

		output.metadata =
		{
			version: Nunu.VERSION,
			type: "NunuProgram"
		};
	}

	var object = {};

	object.uuid = this.uuid;
	object.type = this.type;
	object.name = this.name;

	object.folded = this.folded;
	object.locked = this.locked;

	object.castShadow = this.castShadow;
	object.receiveShadow = this.receiveShadow;
	object.visible = this.visible;

	object.matrixAutoUpdate = this.matrixAutoUpdate;
	//object.matrix = this.matrix.toArray();

	object.frustumCulled = this.frustumCulled;
	object.renderOrder = this.renderOrder;

	object.position = this.position.toArray();
	object.quaternion = this.quaternion.toArray();
	object.scale = this.scale.toArray();

	if(JSON.stringify(this.userData) !== "{}")
	{
		object.userData = this.userData;
	}

	//Geometry
	if(this.geometry !== undefined)
	{
		object.geometry = serialize(meta.geometries, this.geometry);

		//Serialize shapes
		var parameters = this.geometry.parameters;
		if(parameters !== undefined && parameters.shapes !== undefined)
		{
			var shapes = parameters.shapes;
			if(Array.isArray(shapes))
			{
				for(var i = 0, l = shapes.length; i < l; i ++)
				{
					var shape = shapes[i];
					serialize(meta.shapes, shape);
				}
			}
			else
			{
				serialize(meta.shapes, shapes);
			}
		}
	}

	//Material
	if(this.material !== undefined)
	{
		if(this.material instanceof THREE.Material)
		{
			object.material = serialize(meta.materials, this.material);
		}
		else if(this.material instanceof Array)
		{
			var uuids = [];
			for(var i = 0; i < this.material.length; i++)
			{
				uuids.push(serialize(meta.materials, this.material[i]));
			}
			object.material = uuids;
		}
	}

	//Animations
	if(this.animations !== undefined && this.animations.length > 0)
	{
		object.animations = [];

		for(var i = 0; i < this.animations.length; i++)
		{
			object.animations.push(THREE.AnimationClip.toJSON(this.animations[i]));
		}
	}

	//Resource access callback
	if(resourceAccess !== undefined)
	{
		resourceAccess(meta, object);
	}

	//Serialize children
	if(recursive !== false && this.children.length > 0)
	{
		object.children = [];

		for(var i = 0; i < this.children.length; i ++)
		{
			if(!this.children[i].locked)
			{
				object.children.push(this.children[i].toJSON(meta).object);
			}
		}
	}

	//If root object add assets
	if(isRootObject)
	{
		output.geometries = extractFromCache(meta.geometries);
		output.materials = extractFromCache(meta.materials);
		output.textures = extractFromCache(meta.textures);
		output.images = extractFromCache(meta.images);
		output.videos = extractFromCache(meta.videos);
		output.audio = extractFromCache(meta.audio);
		output.fonts = extractFromCache(meta.fonts);
		output.skeletons = extractFromCache(meta.skeletons);
		output.resources = extractFromCache(meta.resources);
		output.shapes = extractFromCache(meta.shapes);
	}

	output.object = object;
	return output;

	//Auxiliar function to add resource to respective library
	function serialize(library, element)
	{
		if(library[element.uuid] === undefined)
		{
			library[element.uuid] = element.toJSON(meta);
		}

		return element.uuid;
	}

	//Extract data from the cache hash remove metadata on each item and return as array
	function extractFromCache(cache)
	{
		var values = [];

		for(var key in cache)
		{
			var data = cache[key];
			delete data.metadata;
			values.push(data);
		}

		return values;
	}
};

/**
 * Remove children from this object
 * @param {Object3D} objects Removes object as child of this object. An arbitrary number of objects may be removed.
 * @method remove
 */

/**
 * Rotates the object to face a point in world space.
 * @param {Vector3} vector A vector representing a position in world space.
 * @method lookAt
 */

/**
 * Converts the vector from local space to world space.
 * @param {Vector3} vector  vector representing a position in local (object) space.
 * @method localToWorld
 */

/**
 * Updates the vector from world space to local space.
 * @param {Vector3} vector A world vector
 * @method worldToLocal
 */

/**
 * Adds object as child of this object. An arbitrary number of objects may be added.
 * @method add
 * @param {Object3D} objects
 */

/**
 * This updates the position, rotation and scale with the matrix.
 * @method applyMatrix
 * @param {Matrix4} matrix
 */

/**
 * Returns a clone of this object and optionaly all descendants.
 * @method clone
 * @param {boolean} recursive If true, descendants of the object are also cloned. Default is true.
 */

/**
 * Copy the given object into this object.
 * @method copy
 * @param {Object3D} object
 * @param {boolean} recursive If true, descendants of the object are also copied. Default is true.
 */

/**
 * Searches through the object's children and returns the first with a matching name.
 * @param {String} name String to match to the children's Object3d.name property.
 * @method getObjectByName
 */

/**
 * Searches through the object's children and returns the first with a property that matches the aclue given.
 * @param {String} name The property name to search for.
 * @param {Object} value Value of the given property.
 * @method getObjectByProperty
 */

/**
 * @param {Vector3} optionalTarget Target to set the result. Otherwise, a new Vector3 is instantiated.
 * @return {Vector3} Returns a vector representing the position of the object in world space.
 * @method getWorldPosition
 */

/**
 * Returns a quaternion representing the rotation of the object in world space.
 * @method getWorldQuaternion
 * @param {Quaternion} optionalTarget If specified, the result will be copied into this Quaternion, otherwise a new Quaternion will be created. 
 */

/**
 * Returns a vector of the scaling factors applied to the object for each axis in world space.
 * @method getWorldScale
 * @param {Vector3} optionalTarget If specified, the result will be copied into this Vector3, otherwise a new Vector3 will be created. 
 */

/**
 * Returns a vector representing the direction of object's positive z-axis in world space.
 * @method getWorldDirection
 * @param {Vector3} optionalTarget If specified, the result will be copied into this Vector3, otherwise a new Vector3 will be created. 
 */

/**
 * Rotate an object along an axis in object space. The axis is assumed to be normalized..
 * @method rotateOnAxis
 * @param {Vector3} axis A normalized vector in object space.
 * @param {Number} angle The angle in radians.
 */

/**
 * Rotates the object around x axis in local space.
 * @method rotateX
 * @param {Number} rad The angle to rotate in radians.
 */

/**
 * Rotates the object around y axis in local space.
 * @method rotateY
 * @param {Number} rad The angle to rotate in radians.
 */

/**
 * Rotates the object around z axis in local space.
 * @method rotateZ
 * @param {Number} rad The angle to rotate in radians.
 */
