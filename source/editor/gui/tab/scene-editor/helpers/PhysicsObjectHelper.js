"use strict";

/**
 * Helper to preview physics objects on the editor.
 *
 * Based on code from CANNON debug shape renderer made by schteppe
 *
 * @class PhysicsObjectHelper
 */
function PhysicsObjectHelper(object, color)
{
	THREE.Object3D.call(this);

	/**
	 * Object attached to the helper.
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	/**
	 * Meshes used to represent the shapes attached to the body.
	 *
	 * @attribute meshes
	 * @type {Array}
	 */
	this.meshes = [];
	this.matrixAutoUpdate = false;

	this.material = new THREE.MeshBasicMaterial(
	{
		color: (color !== undefined) ? color : 0x00FF00,
		wireframe: false,
		transparent: true,
		opacity: 0.5
	});
}

PhysicsObjectHelper.SPHERE = new THREE.SphereBufferGeometry(1, 32, 32);
PhysicsObjectHelper.BOX = new THREE.BoxBufferGeometry(1, 1, 1);
PhysicsObjectHelper.PLANE = new THREE.PlaneBufferGeometry(100, 100);
PhysicsObjectHelper.CYLINDER = new THREE.CylinderBufferGeometry(1, 1, 10, 32);

PhysicsObjectHelper.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Update the helper from the physics body.
 *
 * @method update
 */
PhysicsObjectHelper.prototype.update = function()
{
	this.matrix.copy(this.object.matrixWorld);

	var body = this.object.body;
	var index = 0;

	// Iterate all the shapes in the physics body
	for(var j = 0; j < body.shapes.length; j++)
	{
		var shape = body.shapes[j];

		this.updateMesh(index, body, shape);

		var mesh = this.meshes[index];
		if(mesh !== undefined)
		{
			var tmpVec = new CANNON.Vec3();
			var tmpQuat = new CANNON.Vec3();

			//Get world position
			body.quaternion.vmult(body.shapeOffsets[j], tmpVec);
			body.position.vadd(tmpVec, tmpVec);

			//Get world quaternion
			body.quaternion.mult(body.shapeOrientations[j], tmpQuat);

			//Copy to meshes
			mesh.position.copy(tmpVec);
			mesh.quaternion.copy(tmpQuat);
		}

		index++;
	}

	for(var i = index; i < this.meshes.length; i++)
	{
		var mesh = index[i];
		if(mesh)
		{
			this.remove(mesh);
		}
	}

	this.meshes.length = index;
};

PhysicsObjectHelper.prototype.updateMesh = function(index, body, shape)
{
	var mesh = this.meshes[index];
	if(!this.typeMatch(mesh, shape))
	{
		if(mesh)
		{
			this.remove(mesh);
		}
		mesh = this.meshes[index] = this.createMesh(shape);
	}

	this.scaleMesh(mesh, shape);
};

/**
 * Check if the mesh attahched to this helper object matches the CANNON body shape.
 *
 * @method typeMatch
 * @return {boolean} True if the mesh matches the shape.
 */
PhysicsObjectHelper.prototype.typeMatch = function(mesh, shape)
{
	if(!mesh)
	{
		return false;
	}

	var geometry = mesh.geometry;

	return (geometry instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
	(geometry instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
	(geometry instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
	(geometry.id === shape.geometryId && (shape instanceof CANNON.ConvexPolyhedron || shape instanceof CANNON.Trimesh) || shape instanceof CANNON.Heightfield);
};

/**
 * Create a mesh to represent a CANNON physics shape and attach it to this helper object.
 *
 * @method createMesh
 * @return {THREE.Mesh} Mesh created to represent the shape.
 */
PhysicsObjectHelper.prototype.createMesh = function(shape)
{
	var material = this.material;
	var mesh = null;

	switch(shape.type)
	{
		case CANNON.Shape.types.SPHERE:
			mesh = new THREE.Mesh(PhysicsObjectHelper.SPHERE, material);
			break;

		case CANNON.Shape.types.PARTICLE:
			mesh = new THREE.Mesh(PhysicsObjectHelper.SPHERE, material);
			break;

		case CANNON.Shape.types.BOX:
			mesh = new THREE.Mesh(PhysicsObjectHelper.BOX, material);
			break;

		case CANNON.Shape.types.PLANE:
			mesh = new THREE.Mesh(PhysicsObjectHelper.PLANE, material);
			mesh.scale.set(1000, 1000, 1);
			break;

		case CANNON.Shape.types.CONVEXPOLYHEDRON:
			//Create mesh
			var geo = new THREE.Geometry();

			//Add vertices
			for(var i = 0; i < shape.vertices.length; i++)
			{
				var v = shape.vertices[i];
				geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
			}

			//Add faces
			for(var i = 0; i < shape.faces.length; i++)
			{
				var face = shape.faces[i];

				//Add triangles
				var a = face[0];
				for(var j = 1; j < face.length - 1; j++)
				{
					var b = face[j];
					var c = face[j + 1];
					geo.faces.push(new THREE.Face3(a, b, c));
				}
			}
			geo.computeBoundingSphere();
			geo.computeFaceNormals();
			mesh = new THREE.Mesh(geo, material);
			shape.geometryId = geo.id;
			break;

		case CANNON.Shape.types.TRIMESH:
			var geometry = new THREE.Geometry();
			var v0 = new CANNON.Vec3();
			var v1 = new CANNON.Vec3();
			var v2 = new CANNON.Vec3();
			for(var i = 0; i < shape.indices.length / 3; i++)
			{
				shape.getTriangleVertices(i, v0, v1, v2);
				geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
				var j = geometry.vertices.length - 3;
				geometry.faces.push(new THREE.Face3(j, j+1, j+2));
			}
			geometry.computeBoundingSphere();
			geometry.computeFaceNormals();
			mesh = new THREE.Mesh(geometry, material);
			shape.geometryId = geometry.id;
			break;

		case CANNON.Shape.types.HEIGHTFIELD:
			var geometry = new THREE.Geometry();
			var v0 = new CANNON.Vec3();
			var v1 = new CANNON.Vec3();
			var v2 = new CANNON.Vec3();

			for(var xi = 0; xi < shape.data.length - 1; xi++)
			{
				for(var yi = 0; yi < shape.data[xi].length - 1; yi++)
				{
					for(var k = 0; k < 2; k++)
					{
						shape.getConvexTrianglePillar(xi, yi, k === 0);
						v0.copy(shape.pillarConvex.vertices[0]);
						v1.copy(shape.pillarConvex.vertices[1]);
						v2.copy(shape.pillarConvex.vertices[2]);
						v0.vadd(shape.pillarOffset, v0);
						v1.vadd(shape.pillarOffset, v1);
						v2.vadd(shape.pillarOffset, v2);
						geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
						var i = geometry.vertices.length - 3;
						geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
					}
				}
			}

			geometry.computeBoundingSphere();
			geometry.computeFaceNormals();
			mesh = new THREE.Mesh(geometry, material);
			shape.geometryId = geometry.id;
			break;
	}

	if(mesh !== null)
	{
		this.add(mesh);
	}

	return mesh;
};

/**
 * Set to correct scale of the helper mesh based on the shape type and size configuration.
 *
 * @method scaleMesh
 * @param {THREE.Mesh} mesh Mesh to be changed.
 * @param {CANNON.Shape} shape Shape to analyse and extract scale from.
 */
PhysicsObjectHelper.prototype.scaleMesh = function(mesh, shape)
{
	var type = shape.type;

	if(type === CANNON.Shape.types.SPHERE)
	{
		var radius = shape.radius;
		mesh.scale.set(radius, radius, radius);
	}
	else if(type === CANNON.Shape.types.PARTICLE)
	{
		mesh.scale.set(0.1, 0.1, 0.1);
	}
	else if(type === CANNON.Shape.types.BOX)
	{
		mesh.scale.copy(shape.halfExtents);
		mesh.scale.multiplyScalar(2);
	}
	else if(type === CANNON.Shape.types.CONVEXPOLYHEDRON)
	{
		mesh.scale.set(1, 1, 1);
	}
	else if(type === CANNON.Shape.types.TRIMESH)
	{
		mesh.scale.copy(shape.scale);
	}
	else if(type === CANNON.Shape.types.HEIGHTFIELD)
	{
		mesh.scale.set(1, 1, 1);
	}
};
