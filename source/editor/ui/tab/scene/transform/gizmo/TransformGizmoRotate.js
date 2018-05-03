"use strict";

function TransformGizmoRotate()
{
	var CircleGeometry = function(radius, facing, arc)
	{
		var geometry = new THREE.BufferGeometry();
		var vertices = [];

		var arcLen = (arc !== undefined) ? (arc * 64) : 64;

		for(var i = 0; i < arcLen; i++)
		{
			if(facing === "x")
			{
				vertices.push(0, Math.cos(i / 32 * Math.PI) * radius, Math.sin(i / 32 * Math.PI) * radius);
			}
			else if(facing === "y")
			{
				vertices.push(Math.cos(i / 32 * Math.PI) * radius, 0, Math.sin(i / 32 * Math.PI) * radius);
			}
			else if(facing === "z")
			{
				vertices.push(Math.sin(i / 32 * Math.PI) * radius, Math.cos(i / 32 * Math.PI) * radius, 0);
			}
		}

		geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		return geometry;
	};

	this.handleGizmos =
	{
		X: [[new THREE.Line(new CircleGeometry(1, "x", 0.5), new GizmoLineMaterial({ color: 0xff0000 }))]],
		Y: [[new THREE.Line(new CircleGeometry(1, "y", 0.5), new GizmoLineMaterial({ color: 0x00ff00 }))]],
		Z: [[new THREE.Line(new CircleGeometry(1, "z", 0.5), new GizmoLineMaterial({ color: 0x0000ff }))]],
		E: [[new THREE.Line(new CircleGeometry(1.25, "z", 1), new GizmoLineMaterial({ color: 0xcccc00 }))]],
		XYZE: [[new THREE.Line(new CircleGeometry(1, "z", 1), new GizmoLineMaterial({ color: 0x787878 }))]]
	};

	this.pickerGizmos =
	{
		X: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), TransformGizmo.pickerMaterial), [0, 0, 0], [0, - Math.PI / 2, - Math.PI / 2]]],
		Y: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), TransformGizmo.pickerMaterial), [0, 0, 0], [Math.PI / 2, 0, 0]]],
		Z: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), TransformGizmo.pickerMaterial), [0, 0, 0], [0, 0, - Math.PI / 2]]],
		E: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1.25, 0.12, 2, 24), TransformGizmo.pickerMaterial)]],
		XYZE: [[new THREE.Mesh(new THREE.Geometry())]]
	};

	this.update = function(rotation, eye2)
	{
		TransformGizmo.prototype.update.apply(this, arguments);

		var group =
		{
			handles: this["handles"],
			pickers: this["pickers"],
		};

		var tempMatrix = new THREE.Matrix4();
		var worldRotation = new THREE.Euler(0, 0, 1);
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3(1, 0, 0);
		var unitY = new THREE.Vector3(0, 1, 0);
		var unitZ = new THREE.Vector3(0, 0, 1);
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var eye = eye2.clone();

		worldRotation.copy(this.planes["XY"].rotation);
		tempQuaternion.setFromEuler(worldRotation);

		tempMatrix.makeRotationFromQuaternion(tempQuaternion).getInverse(tempMatrix);
		eye.applyMatrix4(tempMatrix);

		this.traverse(function(child)
		{
			tempQuaternion.setFromEuler(worldRotation);

			if(child.name === "X")
			{
				quaternionX.setFromAxisAngle(unitX, Math.atan2(- eye.y, eye.z));
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
				child.quaternion.copy(tempQuaternion);
			}
			else if(child.name === "Y")
			{
				quaternionY.setFromAxisAngle(unitY, Math.atan2(eye.x, eye.z));
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
				child.quaternion.copy(tempQuaternion);
			}
			else if(child.name === "Z")
			{
				quaternionZ.setFromAxisAngle(unitZ, Math.atan2(eye.y, eye.x));
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
				child.quaternion.copy(tempQuaternion);
			}
		});
	};

	TransformGizmo.call(this);
}

TransformGizmoRotate.prototype = Object.create(TransformGizmo.prototype);

TransformGizmoRotate.prototype.setActivePlane = function(axis)
{
	if(axis === "E")
	{
		this.activePlane = this.planes["XYZE"];
	}
	else if(axis === "X")
	{
		this.activePlane = this.planes["YZ"];
	}
	else if(axis === "Y")
	{
		this.activePlane = this.planes["XZ"];
	}
	else if(axis === "Z")
	{
		this.activePlane = this.planes["XY"];
	}
};