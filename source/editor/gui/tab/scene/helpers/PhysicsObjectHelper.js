"use strict";

/**
 * Helper to preview cannonjs physics objects.
 *
 * Based on code from cannonjs debug shape renderer made by schteppe
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

	this.meshes = [];

	this.material = new THREE.MeshBasicMaterial(
	{
		color: (color !== undefined) ? color : 0x00FF00,
		wireframe: false,
		transparent: true,
		opacity: 0.5
	});

	this.tmpVec0 = new CANNON.Vec3();
	this.tmpVec1 = new CANNON.Vec3();
	this.tmpVec2 = new CANNON.Vec3();
	this.tmpQuat0 = new CANNON.Vec3();
}

PhysicsObjectHelper.SPHERE = new THREE.SphereBufferGeometry(1, 32, 32);
PhysicsObjectHelper.BOX = new THREE.BoxBufferGeometry(1, 1, 1);
PhysicsObjectHelper.PLANE = new THREE.PlaneBufferGeometry(100, 100);
PhysicsObjectHelper.CYLINDER = new THREE.CylinderBufferGeometry(1, 1, 10, 32);

PhysicsObjectHelper.prototype = Object.create(THREE.Object3D.prototype);

PhysicsObjectHelper.prototype.update = function()
{
	var meshes = this.meshes;
	var shapeWorldPosition = this.tmpVec0;
	var shapeWorldQuaternion = this.tmpQuat0;

	var meshIndex = 0;

	var body = this.object.body;
	body.position.copy(this.object.position);
	body.quaternion.copy(this.object.quaternion);

	for(var j = 0; j < body.shapes.length; j++)
	{
		var shape = body.shapes[j];
		this.updateMesh(meshIndex, body, shape);
		var mesh = meshes[meshIndex];

		if(mesh)
		{
			//Get world position
			body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
			body.position.vadd(shapeWorldPosition, shapeWorldPosition);

			//Get world quaternion
			body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

			//Copy to meshes
			mesh.position.copy(shapeWorldPosition);
			mesh.quaternion.copy(shapeWorldQuaternion);
		}

		meshIndex++;
	}

	for(var i = meshIndex; i < meshes.length; i++)
	{
		var mesh = meshes[i];
		if(mesh)
		{
			this.remove(mesh);
		}
	}

	meshes.length = meshIndex;
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

PhysicsObjectHelper.prototype.createMesh = function(shape)
{
	var mesh;
	var material = this.material;

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
			var v0 = this.tmpVec0;
			var v1 = this.tmpVec1;
			var v2 = this.tmpVec2;
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
			var v0 = this.tmpVec0;
			var v1 = this.tmpVec1;
			var v2 = this.tmpVec2;

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

	if(mesh)
	{
		this.add(mesh);
	}

	return mesh;
};

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
