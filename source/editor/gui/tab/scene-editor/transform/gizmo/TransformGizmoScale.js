"use strict";

/**
 * Gizmo used to change scale of an object. Can be used with Object3D objects.
 *
 * @class TransformGizmoScale
 * @extends {TransformGizmo}
 */
function TransformGizmoScale()
{
	var arrowGeometry = new THREE.Geometry();
	var mesh = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.125, 0.125));
	mesh.position.y = 0.5;
	mesh.updateMatrix();

	arrowGeometry.merge(mesh.geometry, mesh.matrix);

	var x = new THREE.BufferGeometry();
	x.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  1, 0, 0], 3));

	var y = new THREE.BufferGeometry();
	y.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  0, 1, 0], 3));

	var z = new THREE.BufferGeometry();
	z.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  0, 0, 1], 3));

	this.handleGizmos =
	{
		X: [[new THREE.Mesh(arrowGeometry, GizmoMaterial.red), [0.5, 0, 0], [0, 0, - Math.PI / 2]],[new THREE.Line(x, GizmoLineMaterial.red)]],
		Y: [[new THREE.Mesh(arrowGeometry, GizmoMaterial.green), [0, 0.5, 0]],[new THREE.Line(y, GizmoLineMaterial.green)]],
		Z: [[new THREE.Mesh(arrowGeometry, GizmoMaterial.blue), [0, 0, 0.5], [Math.PI / 2, 0, 0]],[new THREE.Line(z, GizmoLineMaterial.blue)]],
		XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), GizmoMaterial.whiteAlpha)]]
	};

	this.pickerGizmos =
	{
		X: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0.6, 0, 0], [0, 0, - Math.PI / 2]]],
		Y: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0.6, 0]]],
		Z: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],
		XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, 0.4, 0.4), TransformGizmo.pickerMaterial)]]
	};

	TransformGizmo.call(this);
}

TransformGizmoScale.prototype = Object.create(TransformGizmo.prototype);

TransformGizmoScale.prototype.setActivePlane = function(axis, eye)
{
	var tempMatrix = new THREE.Matrix4();
	eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

	if(axis === "X")
	{
		this.activePlane = this.planes["XY"];
		if(Math.abs(eye.y) > Math.abs(eye.z)) this.activePlane = this.planes["XZ"];
	}
	else if(axis === "Y")
	{
		this.activePlane = this.planes["XY"];
		if(Math.abs(eye.x) > Math.abs(eye.z)) this.activePlane = this.planes["YZ"];
	}
	else if(axis === "Z")
	{
		this.activePlane = this.planes["XZ"];
		if(Math.abs(eye.x) > Math.abs(eye.y)) this.activePlane = this.planes["YZ"];
	}
	else if(axis === "XYZ") 
	{
		this.activePlane = this.planes["XYZE"];
	}
};