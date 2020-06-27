import {Shape, Box, Vec3, ConvexPolyhedron, Cylinder, Quaternion as CQuaternion, Sphere, Trimesh} from "cannon";
import {Vector3, BufferGeometry, Geometry, Quaternion as TQuaternion, Matrix4, Mesh} from "three";
import {ConvexHull} from "three/examples/jsm/math/ConvexHull"

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
 * @param {string} type PhysicsGenerator.Type
 * @return {Shape} shape
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
 * @return {Box} shape
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
	
	return new Box(new Vec3((box.max.x - box.min.x) / 2,(box.max.y - box.min.y) / 2,(box.max.z - box.min.z) / 2));
};

/**
 * Bounding box needs to be computed with the entire mesh, not just geometry.
 *
 * @method createBoundingBoxShape
 * @param {Geometry} geometry
 * @return {Box} shape
 */
PhysicsGenerator.createBoundingBoxShape = function(object)
{
	var box = new Box3();
	box.setFromObject(object);

	if(!isFinite(box.min.lengthSq()))
	{
		return null;
	}

	var shape = new Box(new Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));

	object.updateMatrixWorld();

	var worldPosition = new Vector3();
	worldPosition.setFromMatrixPosition(object.matrixWorld);

	return shape;
};

/**
 * Computes 3D convex hull as a ConvexPolyhedron.
 *
 * @method createConvexPolyhedron
 * @param {ConvexPolyhedron} geometry
 * @return {Shape} shape
 */
PhysicsGenerator.createConvexPolyhedron = function(object)
{
	var quickhull = new ConvexHull();
	quickhull.setFromObject(object);

	var vertices = [];
	var faces = [];
	var normals = [];

	// Generate vertices and normals
	for(var i = 0; i < quickhull.faces.length; i++)
	{
		var face = quickhull.faces[i];
		var edge = face.edge;
		
		// We move along a doubly-connected edge list to access all face points
		do
		{
			var point = edge.head().point;
			vertices.push(new Vec3(point.x, point.y, point.z));
			edge = edge.next;
		}
		while(edge !== face.edge);

		// The face always has 3 points
		faces.push([vertices.length - 3, vertices.length - 2, vertices.length - 1]);
		normals.push(new Vec3(face.normal.x, face.normal.y, face.normal.z));
	}

	return new ConvexPolyhedron(vertices, faces, normals);
};

/**
 * Create cylinder shape from geometry.
 *
 * @method createCylinderShape
 * @param {Geometry} geometry
 * @return {Cylinder} shape
 */
PhysicsGenerator.createCylinderShape = function(geometry)
{
	var params = geometry.parameters;

	var shape = new Cylinder(params.radiusTop, params.radiusBottom, params.height, params.radialSegments);
	shape.orientation = new CQuaternion();
	shape.orientation.setFromEuler(0, 0, 0, "XYZ").normalize();

	return shape;
};

/**
 * Create cylinder shape from bounding cylinder calculated from bounding box and bouding sphere.
 *
 * @method createBoundingCylinderShape
 * @param {Object3D} object
 * @return {Cylinder} shape
 */
PhysicsGenerator.createBoundingCylinderShape = function(object)
{
	var axes = ["x", "y", "z"];
	var minorAxes = axes.splice(axes.indexOf("y"), 1) && axes;

	// Compute cylinder dimensions
	var geometry = PhysicsGenerator.getGeometry(object);
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();
	
	var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	var radius = 0.5 * Math.max(geometry.boundingBox.max[minorAxes[0]] - geometry.boundingBox.min[minorAxes[0]],geometry.boundingBox.max[minorAxes[1]] - geometry.boundingBox.min[minorAxes[1]]);

	// Create shape
	var shape = new Cylinder(radius, radius, height, 12);
	shape.orientation = new CQuaternion();
	shape.orientation.setFromEuler(Math.PI / 2, 0, 0, "XYZ").normalize();
	
	return shape;
};

/**
 * Plane shape from geometry.
 *
 * @method createPlaneShape
 * @param {Geometry} geometry
 * @return {Box} shape
 */
PhysicsGenerator.createPlaneShape = function(geometry)
{
	geometry.computeBoundingBox();
	var box = geometry.boundingBox;

	return new Box(new Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));
};

/**
 * Sphere shape from geometry.
 *
 * @method createSphereShape
 * @param {Geometry} geometry
 * @return {Sphere} shape
 */
PhysicsGenerator.createSphereShape = function(geometry)
{
	return new Sphere(geometry.parameters.radius);
};

/**
 * Sphere shape from bouding sphere.
 *
 * @method createBoundingSphereShape
 * @param {Geometry} geometry
 * @return {Sphere} shape
 */
PhysicsGenerator.createBoundingSphereShape = function(object)
{
	var geometry = PhysicsGenerator.getGeometry(object);
	geometry.computeBoundingSphere();

	return new Sphere(geometry.boundingSphere.radius);
};

/**
 * Sphere shape from bouding sphere.
 *
 * @method createTubeShape
 * @param {Geometry} geometry
 * @return {Trimesh} shape
 */
PhysicsGenerator.createTubeShape = function(geometry)
{
	var tmp = new BufferGeometry();
	tmp.fromGeometry(geometry);
	return createTrimeshShape(tmp);
};

/**
 * Trimesh shape from geometry.
 * 
 * @method createTrimeshShape
 * @param {Geometry} geometry
 * @return {Trimesh} shape
 */
PhysicsGenerator.createTrimeshShape = function(geometry)
{
	var indices, vertices = PhysicsGenerator.getVertices(geometry);

	if(!vertices.length)
	{
		return null;
	}

	indices = Object.keys(vertices).map(Number);
	return new Trimesh(vertices, indices);
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

	var tmp = new Geometry();
	
	// Apply scale (it can't easily be applied to a Shape later)
	if(meshes.length === 1)
	{
		var position = new Vector3();
		var quaternion = new TQuaternion();
		var scale = new Vector3(1, 1, 1);

		tmp = meshes[0].geometry.clone();
		meshes[0].updateMatrixWorld();
		meshes[0].matrixWorld.decompose(position, quaternion, scale);

		return tmp.scale(scale.x, scale.y, scale.z);
	}
	// If more than one mesh found merge into single geometry
	else
	{
		var combined = new Geometry();
		var mesh;

		// Recursively merge geometry, preserving local transforms
		while((mesh = meshes.pop()))
		{
			mesh.updateMatrixWorld();

			if(mesh.geometry instanceof BufferGeometry)
			{
				tmp.fromBufferGeometry(mesh.geometry);
				combined.merge(tmp, mesh.matrixWorld);
			}
			else
			{
				combined.merge(mesh.geometry, mesh.matrixWorld);
			}
		}

		var matrix = new Matrix4();
		matrix.scale(object.scale);
		combined.applyMatrix4(matrix);
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
		geometry = new BufferGeometry().fromGeometry(geometry);
	}
	return geometry.attributes.position.array;
};

/**
 * Returns a array of Mesh instances from the given object.
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
		if(child instanceof Mesh)
		{
			meshes.push(child);
		}
	});

	return meshes;
};

export {PhysicsGenerator};