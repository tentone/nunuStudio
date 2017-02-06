/*
	Mesh2shape - Convert ThreeJS objects to Cannon shapes
	@author Don McCurdy / https://github.com/donmccurdy
*/

"use strict";

var PI2 = Math.PI / 2;

function Mesh2shape(){}

//Shape type
Mesh2shape.Type =
{
	BOX: "Box",
	CYLINDER: "Cylinder",
	SPHERE: "Sphere",
	HULL: "ConvexPolyhedron"
};

//Given a THREE.Object3D instance, creates a corresponding CANNON shape
Mesh2shape.createShape = function(object, type)
{
	if(type !== undefined)
	{
		if(type === Mesh2shape.Type.BOX)
		{
			return Mesh2shape.createBoundingBoxShape(object);
		}
		else if(type === Mesh2shape.Type.CYLINDER)
		{
			return Mesh2shape.createBoundingCylinderShape(object, options);
		}
		else if(type === Mesh2shape.Type.SPHERE)
		{
			return Mesh2shape.createBoundingSphereShape(object, options);
		}
		else if(type === Mesh2shape.Type.HULL)
		{
			return Mesh2shape.createConvexPolyhedron(object);
		}
		
		return null;
	}

	var geometry = Mesh2shape.getGeometry(object);
	if(!geometry)
	{
		return null;
	}

	type = geometry.metadata ? geometry.metadata.type : geometry.type;
	switch(type)
	{
		case "BoxGeometry":
		case "BoxBufferGeometry":
			return Mesh2shape.createBoxShape(geometry);

		case "CylinderGeometry":
		case "CylinderBufferGeometry":
			return Mesh2shape.createCylinderShape(geometry);

		case "PlaneGeometry":
		case "PlaneBufferGeometry":
			return Mesh2shape.createPlaneShape(geometry);

		case "SphereGeometry":
		case "SphereBufferGeometry":
			return Mesh2shape.createSphereShape(geometry);

		case "TubeGeometry":
			return Mesh2shape.createTubeShape(geometry);

		case "Geometry":
		case "BufferGeometry":
			return Mesh2shape.createConvexPolyhedron(object);

		default:
			console.warn("Unrecognized geometry: Using bounding box as shape.", geometry.type);
			return Mesh2shape.createBoxShape(geometry);
	}
};

//Create box shape from geometry
Mesh2shape.createBoxShape = function(geometry)
{
	var vertices = Mesh2shape.getVertices(geometry);

	if(!vertices.length)
	{
		return null;
	}

	geometry.computeBoundingBox();
	
	var box = geometry.boundingBox;
	
	return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2,(box.max.y - box.min.y) / 2,(box.max.z - box.min.z) / 2));
}

//Bounding box needs to be computed with the entire mesh, not just geometry
Mesh2shape.createBoundingBoxShape = function(object)
{
	var localPosition, worldPosition;
	
	var helper = new THREE.BoundingBoxHelper(object);
	helper.update();
	
	var box = helper.box;

	if(!isFinite(box.min.lengthSq()))
	{
		return null;
	}

	var shape = new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2, (box.max.y - box.min.y) / 2, (box.max.z - box.min.z) / 2));

	object.updateMatrixWorld();
	worldPosition = new THREE.Vector3();
	worldPosition.setFromMatrixPosition(object.matrixWorld);
	localPosition = helper.position.sub(worldPosition);
	if(localPosition.lengthSq())
	{
		shape.offset = localPosition;
	}

	return shape;
}

//Computes 3D convex hull as a CANNON.ConvexPolyhedron
Mesh2shape.createConvexPolyhedron = function(object)
{
	var i, vertices, faces, hull;
	var geometry = Mesh2shape.getGeometry(object);

	if(geometry instanceof THREE.BufferGeometry)
	{
		geometry = new THREE.Geometry().fromBufferGeometry(geometry);
	}

	if(!geometry || !geometry.vertices.length)
	{
		return null;
	}

	//Perturb
	for(i = 0; i < geometry.vertices.length; i++)
	{
		geometry.vertices[i].x +=(Math.random() - 0.5) * 1e-4;
		geometry.vertices[i].y +=(Math.random() - 0.5) * 1e-4;
		geometry.vertices[i].z +=(Math.random() - 0.5) * 1e-4;
	}

	//Compute the 3D convex hull
	var hull = new quickhull()(geometry);
	console.log(hull);

	//Convert from Vector3 to CANNON.Vec3
	vertices = new Array(hull.vertices.length);
	for(i = 0; i < hull.vertices.length; i++)
	{
		vertices[i] = new CANNON.Vec3(hull.vertices[i].x, hull.vertices[i].y, hull.vertices[i].z);
	}

	//Convert from THREE.Face to Array<number>
	faces = new Array(hull.faces.length);
	for(i = 0; i < hull.faces.length; i++)
	{
		faces[i] = [hull.faces[i].a, hull.faces[i].b, hull.faces[i].c];
	}

	return new CANNON.ConvexPolyhedron(vertices, faces);
}

//Create cylinder shape from geometry
Mesh2shape.createCylinderShape = function(geometry)
{
	var params = geometry.metadata ? geometry.metadata.parameters : geometry.parameters;

	var shape = new CANNON.Cylinder(params.radiusTop, params.radiusBottom, params.height, params.radialSegments);
	shape.orientation = new CANNON.Quaternion();
	shape.orientation.setFromEuler(THREE.Math.degToRad(-90), 0, 0, "XYZ").normalize();

	return shape;
}

//Create cylinder shape from bounding cylinder
Mesh2shape.createBoundingCylinderShape = function(object, options)
{
	var axes = ["x", "y", "z"],
		majorAxis = options.cylinderAxis || "y",
		minorAxes = axes.splice(axes.indexOf(majorAxis), 1) && axes;

	//Compute cylinder dimensions
	var geometry = Mesh2shape.getGeometry(object);
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();
	var height = geometry.boundingBox.max[majorAxis] - geometry.boundingBox.min[majorAxis];
	var radius = 0.5 * Math.max(geometry.boundingBox.max[minorAxes[0]] - geometry.boundingBox.min[minorAxes[0]],geometry.boundingBox.max[minorAxes[1]] - geometry.boundingBox.min[minorAxes[1]]);

	//Create shape
	var shape = new CANNON.Cylinder(radius, radius, height, 12);
	shape.orientation = new CANNON.Quaternion();
	shape.orientation.setFromEuler(majorAxis === "y" ? PI2 : 0, majorAxis === "z" ? PI2 : 0, 0, "XYZ").normalize();
	
	return shape;
}

//Plane shape from geometry
Mesh2shape.createPlaneShape = function(geometry)
{
	geometry.computeBoundingBox();

	var box = geometry.boundingBox;
	return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2 || 0.1, (box.max.y - box.min.y) / 2 || 0.1, (box.max.z - box.min.z) / 2 || 0.1));
}

//Sphere shape from geometry
Mesh2shape.createSphereShape = function(geometry)
{
	var params = geometry.metadata ? geometry.metadata.parameters : geometry.parameters;
	return new CANNON.Sphere(params.radius);
}

//Sphere shape from bouding sphere
Mesh2shape.createBoundingSphereShape = function(object, options)
{
	var geometry = Mesh2shape.getGeometry(object);
	geometry.computeBoundingSphere();
	return new CANNON.Sphere(options.sphereRadius || geometry.boundingSphere.radius);
}

//Tube shape from geometry
Mesh2shape.createTubeShape = function(geometry)
{
	var tmp = new THREE.BufferGeometry();
	tmp.fromGeometry(geometry);
	return createTrimeshShape(tmp);
}

//Trimesh shape from geometry
Mesh2shape.createTrimeshShape = function(geometry)
{
	var indices, vertices = Mesh2shape.getVertices(geometry);

	if(!vertices.length)
	{
		return null;
	}

	indices = Object.keys(vertices).map(Number);
	return new CANNON.Trimesh(vertices, indices);
}

//Returns a single geometry for the given object
//If the object is compound, its geometries are automatically merged
Mesh2shape.getGeometry = function(object)
{
	var meshes = Mesh2shape.getMeshes(object);

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
		var scale = new THREE.Vector3();

		tmp = meshes[0].geometry.clone();
		tmp.metadata = meshes[0].geometry.metadata;
		meshes[0].updateMatrixWorld();
		meshes[0].matrixWorld.decompose(position, quaternion, scale);

		return tmp.scale(scale.x, scale.y, scale.z);
	}

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

//Get geometry vertices
Mesh2shape.getVertices = function(geometry)
{
	if(!geometry.attributes)
	{
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);
	}
	return geometry.attributes.position.array;
}

//Returns a array of THREE.Mesh instances from the given object.
//If nested transformations are found, they are applied to child meshes as mesh.userData.matrix, so that each mesh has its position/rotation/scale independently of all of its parents except the top-level object.
Mesh2shape.getMeshes = function(object)
{
	var meshes = [];

	object.traverse(function(child)
	{
		if(child.type === "Mesh")
		{
			meshes.push(child);
		}
	});

	return meshes;
}
