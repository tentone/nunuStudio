"use strict";

function TransformGizmoScale()
{
	TransformGizmo.call(this);

	var arrowGeometry = new THREE.Geometry();
	var mesh = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.125, 0.125));
	mesh.position.y = 0.5;
	mesh.updateMatrix();

	arrowGeometry.merge(mesh.geometry, mesh.matrix);

	var x = new THREE.BufferGeometry();
	x.addAttribute("position", new THREE.Float32Attribute([0, 0, 0,  1, 0, 0], 3));

	var y = new THREE.BufferGeometry();
	y.addAttribute("position", new THREE.Float32Attribute([0, 0, 0,  0, 1, 0], 3));

	var z = new THREE.BufferGeometry();
	z.addAttribute("position", new THREE.Float32Attribute([0, 0, 0,  0, 0, 1], 3));

	this.handleGizmos =
	{
		X: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0xff0000})), [0.5, 0, 0], [0, 0, - Math.PI / 2]],[new THREE.Line(x, new GizmoLineMaterial({color: 0xff0000}))]],
		Y: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0x00ff00})), [0, 0.5, 0]],[new THREE.Line(y, new GizmoLineMaterial({color: 0x00ff00}))]],
		Z: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0x0000ff})), [0, 0, 0.5], [Math.PI / 2, 0, 0]],[new THREE.Line(z, new GizmoLineMaterial({color: 0x0000ff}))]],
		XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), new GizmoMaterial({color: 0xffffff, opacity: 0.25}))]]
	};

	this.pickerGizmos =
	{
		X: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0.6, 0, 0], [0, 0, - Math.PI / 2]]],
		Y: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0.6, 0]]],
		Z: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],
		XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, 0.4, 0.4), TransformGizmo.pickerMaterial)]]
	};

	this.setActivePlane = function(axis, eye)
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

	this.init();
}

TransformGizmoScale.prototype = Object.create(TransformGizmo.prototype);