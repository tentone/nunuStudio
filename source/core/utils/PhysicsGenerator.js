"use strict";

/**
 * Physics generator is used to create Cannon.js shapes from three.js geometries.
 * 
 * Can be used with any object that contains a geometry.
 * 
 * It is based on the original Mesh2Shape converted by @donmccurdy.
 * 
 * @author tentone
 * @class PhysicsGenerator
 * @static
 * @module Physics
 */
function PhysicsGenerator(){}

/**
 * Type is used to indentify the type of cannonjs:
 *  - BOX
 *  - CYLINDER
 *  - SPHERE
 *  - HULL
 * 
 * @attribute Type
 * @type {Object}
 */
PhysicsGenerator.Type =
{
	BOX: "Box",
	CYLINDER: "Cylinder",
	SPHERE: "Sphere",
	HULL: "ConvexPolyhedron"
};

/**
 * Given a Object3D instance, creates a corresponding CANNON shape.
 *
 * @method createShape
 * @param {Object3D} object
 * @param {String} type PhysicsGenerator.Type
 * @return {CANNON.Shape} shape
 */
PhysicsGenerator.createShape = function(object, type)
{
	if(type !== undefined)
	{
		if(type === PhysicsGenerator.Type.BOX)
		{
			return PhysicsGenerator.createBoundingBoxShape(object);
		}
		else if(type === PhysicsGenerator.Type.CYLINDER)
		{
			return PhysicsGenerator.createBoundingCylinderShape(object);
		}
		else if(type === PhysicsGenerator.Type.SPHERE)
		{
			return PhysicsGenerator.createBoundingSphereShape(object);
		}
		else if(type === PhysicsGenerator.Type.HULL)
		{
			return PhysicsGenerator.createConvexPolyhedron(object);
		}
		
		return null;
	}

	var geometry = PhysicsGenerator.getGeometry(object);
	if(!geometry)
	{
		return null;
	}

	switch(geometry.type)
	{
		case "BoxGeometry":
		case "BoxBufferGeometry":
			return PhysicsGenerator.createBoxShape(geometry);
		case "CylinderGeometry":
		case "CylinderBufferGeometry":
			return PhysicsGenerator.createCylinderShape(geometry);
		case "PlaneGeometry":
		case "PlaneBufferGeometry":
			return PhysicsGenerator.createPlaneShape(geometry);
		case "SphereGeometry":
		case "SphereBufferGeometry":
			return PhysicsGenerator.createSphereShape(geometry);
		case "TubeGeometry":
			return PhysicsGenerator.createTubeShape(geometry);
		case "Geometry":
		case "BufferGeometry":
			return PhysicsGenerator.createConvexPolyhedron(object);
		default:
			return PhysicsGenerator.createBoxShape(geometry);
	}
};

/**
 * Create box shape from geometry.
 *
 * @method createBoxShape
 * @param {Geometry} geometry
 * @return {CANNON.Box} shape
 */
PhysicsGenerator.createBoxShape = function(geometry)
{
	var vertices = PhysicsGenerator.getVertices(geometry);

	if(!vertices.length)
	{
		return null;
	}

	geometry.computeBoundingBox();
	
	var box = geometry.boundingBox;
	
	return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2,(box.max.y - box.min.y) / 2,(box.max.z - box.min.z) / 2));
};

/**
 * Bounding box needs to be computed with the entire mesh, not just geometry.
 *
 * @method createBoundingBoxShape
 * @param {Geometry} geometry
 * @return {CANNON.Box} shape
 */
PhysicsGenerator.createBoundingBoxShape = function(object)
{
	var box = new Box3();
	box.setFromObject(object);

	if(!isFinite(box.min.lengthSq()))
	{
		return null;
	}

	var shape = new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));

	object.updateMatrixWorld();

	var worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition(object.matrixWorld);

	return shape;
};

/**
 * Computes 3D convex hull as a CANNON.ConvexPolyhedron.
 *
 * @method createConvexPolyhedron
 * @param {ConvexPolyhedron} geometry
 * @return {CANNON.Shape} shape
 */
PhysicsGenerator.createConvexPolyhedron = function(object)
{
	var useOldConvexHull = true;

	if(useOldConvexHull === true)
	{
		var geometry = PhysicsGenerator.getGeometry(object);

		if(geometry instanceof THREE.BufferGeometry)
		{
			geometry = new THREE.Geometry().fromBufferGeometry(geometry);
		}

		if(!geometry || !geometry.vertices.length)
		{
			return null;
		}

		//Compute the 3D convex hull
		var hull = new quickhull()(geometry);

		//Convert from Vector3 to CANNON.Vec3
		var vertices = new Array(hull.vertices.length);
		for(var i = 0; i < hull.vertices.length; i++)
		{
			vertices[i] = new CANNON.Vec3(hull.vertices[i].x, hull.vertices[i].y, hull.vertices[i].z);
		}

		//Convert from THREE.Face to Array<number>
		var faces = new Array(hull.faces.length);
		for(var i = 0; i < hull.faces.length; i++)
		{
			faces[i] = [hull.faces[i].a, hull.faces[i].b, hull.faces[i].c];
		}

		return new CANNON.ConvexPolyhedron(vertices, faces);
	}
	else
	{
		var geometry = PhysicsGenerator.getGeometry(object);
			
		//TODO <NOT WORKING AT ALL>
		//TODO <MOVE TO BUFFER GEOMETRY>

		if(geometry instanceof THREE.BufferGeometry)
		{
			geometry = new THREE.Geometry().fromBufferGeometry(geometry);
		}

		var hull = new THREE.ConvexGeometry(geometry.vertices);

		//Convert from Vector3 to CANNON.Vec3
		var vertices = new Array(hull.vertices.length);
		for(var i = 0; i < hull.vertices.length; i++)
		{
			vertices[i] = new CANNON.Vec3(hull.vertices[i].x, hull.vertices[i].y, hull.vertices[i].z);
		}

		//Convert from THREE.Face to Array<number>
		var faces = new Array(hull.faces.length);
		for(var i = 0; i < hull.faces.length; i++)
		{
			faces[i] = [hull.faces[i].a, hull.faces[i].b, hull.faces[i].c];
		}

		return null;
	}
};

/**
 * Create cylinder shape from geometry.
 *
 * @method createCylinderShape
 * @param {Geometry} geometry
 * @return {CANNON.Cylinder} shape
 */
PhysicsGenerator.createCylinderShape = function(geometry)
{
	var params = geometry.parameters;

	var shape = new CANNON.Cylinder(params.radiusTop, params.radiusBottom, params.height, params.radialSegments);
	shape.orientation = new CANNON.Quaternion();
	shape.orientation.setFromEuler(0, 0, 0, "XYZ").normalize();

	return shape;
};

/**
 * Create cylinder shape from bounding cylinder calculated from bounding box and bouding sphere.
 *
 * @method createBoundingCylinderShape
 * @param {Object3D} object
 * @return {CANNON.Cylinder} shape
 */
PhysicsGenerator.createBoundingCylinderShape = function(object)
{
	var axes = ["x", "y", "z"];
	var minorAxes = axes.splice(axes.indexOf("y"), 1) && axes;

	//Compute cylinder dimensions
	var geometry = PhysicsGenerator.getGeometry(object);
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();
	
	var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	var radius = 0.5 * Math.max(geometry.boundingBox.max[minorAxes[0]] - geometry.boundingBox.min[minorAxes[0]],geometry.boundingBox.max[minorAxes[1]] - geometry.boundingBox.min[minorAxes[1]]);

	//Create shape
	var shape = new CANNON.Cylinder(radius, radius, height, 12);
	shape.orientation = new CANNON.Quaternion();
	shape.orientation.setFromEuler(Math.PI / 2, 0, 0, "XYZ").normalize();
	
	return shape;
};

/**
 * Plane shape from geometry.
 *
 * @method createPlaneShape
 * @param {Geometry} geometry
 * @return {CANNON.Box} shape
 */
PhysicsGenerator.createPlaneShape = function(geometry)
{
	geometry.computeBoundingBox();
	var box = geometry.boundingBox;

	return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));
};

/**
 * Sphere shape from geometry.
 *
 * @method createSphereShape
 * @param {Geometry} geometry
 * @return {CANNON.Sphere} shape
 */
PhysicsGenerator.createSphereShape = function(geometry)
{
	return new CANNON.Sphere(geometry.parameters.radius);
};

/**
 * Sphere shape from bouding sphere.
 *
 * @method createBoundingSphereShape
 * @param {Geometry} geometry
 * @return {CANNON.Sphere} shape
 */
PhysicsGenerator.createBoundingSphereShape = function(object)
{
	var geometry = PhysicsGenerator.getGeometry(object);
	geometry.computeBoundingSphere();

	return new CANNON.Sphere(geometry.boundingSphere.radius);
};

/**
 * Sphere shape from bouding sphere.
 *
 * @method createTubeShape
 * @param {Geometry} geometry
 * @return {CANNON.Trimesh} shape
 */
PhysicsGenerator.createTubeShape = function(geometry)
{
	var tmp = new THREE.BufferGeometry();
	tmp.fromGeometry(geometry);
	return createTrimeshShape(tmp);
};

/**
 * Trimesh shape from geometry.
 * 
 * @method createTrimeshShape
 * @param {Geometry} geometry
 * @return {CANNON.Trimesh} shape
 */
PhysicsGenerator.createTrimeshShape = function(geometry)
{
	var indices, vertices = PhysicsGenerator.getVertices(geometry);

	if(!vertices.length)
	{
		return null;
	}

	indices = Object.keys(vertices).map(Number);
	return new CANNON.Trimesh(vertices, indices);
};

/**
 * Returns a single geometry for the given object.
 * 
 * If the object is compound, its geometries are automatically merged.
 * 
 * @method getGeometry
 * @param {Object3D} object
 * @return {Geometry} Geometry that contains all merger geometry
 */
PhysicsGenerator.getGeometry = function(object)
{
	var meshes = PhysicsGenerator.getMeshes(object);

	if(meshes.length === 0)
	{
		return null;
	}

	var tmp = new THREE.Geometry();
	
	//Apply scale (it can't easily be applied to a Shape later)
	if(meshes.length === 1)
	{
		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3(1, 1, 1);

		tmp = meshes[0].geometry.clone();
		meshes[0].updateMatrixWorld();
		meshes[0].matrixWorld.decompose(position, quaternion, scale);

		return tmp.scale(scale.x, scale.y, scale.z);
	}
	//If more than one mesh found merge into single geometry
	else
	{
		var combined = new THREE.Geometry();
		var mesh;

		//Recursively merge geometry, preserving local transforms
		while((mesh = meshes.pop()))
		{
			mesh.updateMatrixWorld();

			if(mesh.geometry instanceof THREE.BufferGeometry)
			{
				tmp.fromBufferGeometry(mesh.geometry);
				combined.merge(tmp, mesh.matrixWorld);
			}
			else
			{
				combined.merge(mesh.geometry, mesh.matrixWorld);
			}
		}

		var matrix = new THREE.Matrix4();
		matrix.scale(object.scale);
		combined.applyMatrix(matrix);
		return combined;
	}
};

/**
 * Get geometry vertices.
 *
 * @method getVertices
 * @param {Geometry} geometry
 * @return {Array} array
 */
PhysicsGenerator.getVertices = function(geometry)
{
	if(!geometry.attributes)
	{
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);
	}
	return geometry.attributes.position.array;
};

/**
 * Returns a array of THREE.Mesh instances from the given object.
 * 
 * If nested transformations are found, they are applied to child meshes as mesh.userData.matrix, so that each mesh has its position/rotation/scale independently of all of its parents except the top-level object.
 *
 * @method getMeshes
 * @param {Object3D} object
 * @return {Array} meshes found inside the Object3D
 */
PhysicsGenerator.getMeshes = function(object)
{
	var meshes = [];

	object.traverse(function(child)
	{
		if(child instanceof THREE.Mesh)
		{
			meshes.push(child);
		}
	});

	return meshes;
};
