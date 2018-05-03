"use strict";

function TransformGizmoTranslate()
{
	var arrowGeometry = new THREE.Geometry();
	var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
	mesh.position.y = 0.5;
	mesh.updateMatrix();

	arrowGeometry.merge(mesh.geometry, mesh.matrix);

	var lineXGeometry = new THREE.BufferGeometry();
	lineXGeometry.addAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  1, 0, 0], 3));

	var lineYGeometry = new THREE.BufferGeometry();
	lineYGeometry.addAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  0, 1, 0], 3));

	var lineZGeometry = new THREE.BufferGeometry();
	lineZGeometry.addAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0,  0, 0, 1], 3));

	this.handleGizmos =
	{
		X: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0xff0000})), [0.5, 0, 0], [0, 0, - Math.PI / 2]],[new THREE.Line(lineXGeometry, new GizmoLineMaterial({color: 0xff0000}))]],
		Y: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0x00ff00})), [0, 0.5, 0]],[new THREE.Line(lineYGeometry, new GizmoLineMaterial({color: 0x00ff00}))]],
		Z: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({color: 0x0000ff})), [0, 0, 0.5], [Math.PI / 2, 0, 0]],[new THREE.Line(lineZGeometry, new GizmoLineMaterial({color: 0x0000ff}))]],
		XYZ: [[new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.1, 0), new GizmoMaterial({color: 0xffffff, opacity: 0.25})), [0, 0, 0], [0, 0, 0]]],
		XY: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({color: 0xffff00, opacity: 0.25})), [0.15, 0.15, 0]]],
		YZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({color: 0x00ffff, opacity: 0.25})), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
		XZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({color: 0xff00ff, opacity: 0.25})), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]]]
	};

	this.pickerGizmos =
	{
		X: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0.6, 0, 0], [0, 0, - Math.PI / 2]]],
		Y: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0.6, 0]]],
		Z: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],
		XYZ: [[new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.2, 0), TransformGizmo.pickerMaterial)]],
		XY: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), TransformGizmo.pickerMaterial), [0.2, 0.2, 0]]],
		YZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), TransformGizmo.pickerMaterial), [0, 0.2, 0.2], [0, Math.PI / 2, 0]]],
		XZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), TransformGizmo.pickerMaterial), [0.2, 0, 0.2], [- Math.PI / 2, 0, 0]]]
	};

	TransformGizmo.call(this);
}

TransformGizmoTranslate.prototype = Object.create(TransformGizmo.prototype);

TransformGizmoTranslate.prototype.setActivePlane = function(axis, eye)
{
	var tempMatrix = new THREE.Matrix4();
	eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

	if(axis === "X")
	{
		this.activePlane = this.planes["XY"];
		if(Math.abs(eye.y) > Math.abs(eye.z))
		{
			this.activePlane = this.planes["XZ"];
		}
	}
	else if(axis === "Y")
	{
		this.activePlane = this.planes["XY"];
		if(Math.abs(eye.x) > Math.abs(eye.z))
		{
			this.activePlane = this.planes["YZ"];
		}
	}
	else if(axis === "Z")
	{
		this.activePlane = this.planes["XZ"];
		if(Math.abs(eye.x) > Math.abs(eye.y))
		{
			this.activePlane = this.planes["YZ"];
		}
	}

	if(axis === "XYZ")
	{
		this.activePlane = this.planes["XYZE"];
	}
	else if(axis === "XY")
	{
		this.activePlane = this.planes["XY"];
	}
	else if(axis === "YZ")
	{
		this.activePlane = this.planes["YZ"];
	}
	else if(axis === "XZ")
	{
		this.activePlane = this.planes["XZ"];
	}
};
