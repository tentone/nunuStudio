import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ActionBundle} from "../../../../../history/action/ActionBundle.js";
import {TransformControls} from "../TransformControls.js";
import {GizmoLineMaterial} from "../GizmoLineMaterial.js";
import {TransformGizmo} from "./TransformGizmo.js";
import {Editor} from "../../../../../Editor.js";
import {Line, Mesh, Geometry, TorusBufferGeometry, BufferGeometry, Float32BufferAttribute, Matrix4, Euler, Quaternion, Vector3} from "three";

/**
 * Gizmo used to change rotation of an object. Can be used with Object3D objects.
 *
 * @class TransformGizmoRotate
 * @extends {TransformGizmo}
 */
function TransformGizmoRotate()
{
	this.handleGizmos =
	{
		X: [[new Line(new CircleGeometry(1, "x", 0.5), GizmoLineMaterial.red)]],
		Y: [[new Line(new CircleGeometry(1, "y", 0.5), GizmoLineMaterial.green)]],
		Z: [[new Line(new CircleGeometry(1, "z", 0.5), GizmoLineMaterial.blue)]],
		E: [[new Line(new CircleGeometry(1.25, "z", 1), GizmoLineMaterial.yellow)]],
		XYZE: [[new Line(new CircleGeometry(1, "z", 1), GizmoLineMaterial.grey)]]
	};

	this.pickerGizmos =
	{
		X: [[new Mesh(TransformGizmoRotate.torus, TransformGizmo.pickerMaterial), [0, 0, 0], [0, - Math.PI / 2, - Math.PI / 2]]],
		Y: [[new Mesh(TransformGizmoRotate.torus, TransformGizmo.pickerMaterial), [0, 0, 0], [Math.PI / 2, 0, 0]]],
		Z: [[new Mesh(TransformGizmoRotate.torus, TransformGizmo.pickerMaterial), [0, 0, 0], [0, 0, - Math.PI / 2]]],
		E: [[new Mesh(TransformGizmoRotate.torusBig, TransformGizmo.pickerMaterial)]],
		XYZE: [[new Mesh(new Geometry())]]
	};

	TransformGizmo.call(this);
}

TransformGizmoRotate.torus = new TorusBufferGeometry(1, 0.12, 4, 12, Math.PI);
TransformGizmoRotate.torusBig = new TorusBufferGeometry(1.25, 0.12, 2, 24);

/**
 * Circle geometry used for the rotation gizmo rings.
 *
 * @class CircleGeometry
 */
function CircleGeometry(radius, facing, arc)
{
	BufferGeometry.call(this);
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

	this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
};

CircleGeometry.prototype = Object.create(BufferGeometry.prototype);

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

TransformGizmoRotate.prototype.update = function(rotation, eye2)
{
	TransformGizmo.prototype.update.apply(this, arguments);


	var tempMatrix = new Matrix4();
	var worldRotation = new Euler(0, 0, 1);
	var tempQuaternion = new Quaternion();
	var unitX = new Vector3(1, 0, 0);
	var unitY = new Vector3(0, 1, 0);
	var unitZ = new Vector3(0, 0, 1);
	var quaternionX = new Quaternion();
	var quaternionY = new Quaternion();
	var quaternionZ = new Quaternion();
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

TransformGizmoRotate.prototype.applyChanges = function(controls)
{
	var actions = [];

	for(var i = 0; i < controls.objects.length; i++)
	{
		var object = controls.objects[i].quaternion;
		actions.push(new ChangeAction(object, "x", object.x, controls.attributes[i].oldQuaternion.x));
		actions.push(new ChangeAction(object, "y", object.y, controls.attributes[i].oldQuaternion.y));
		actions.push(new ChangeAction(object, "z", object.z, controls.attributes[i].oldQuaternion.z));
		actions.push(new ChangeAction(object, "w", object.w, controls.attributes[i].oldQuaternion.w));
	}
	
	Editor.addAction(new ActionBundle(actions));
};

TransformGizmoRotate.prototype.transformObject = function(controls)
{
	var planeIntersect = controls.intersectObjects([controls.gizmo.activePlane]);
	if(planeIntersect === false) 
	{
		return;
	}
	
	for(var i = 0; i < controls.objects.length; i++)
	{
		controls.point.copy(planeIntersect.point);
		controls.point.sub(controls.attributes[i].worldPosition);
		controls.point.multiply(controls.attributes[i].parentScale);
		controls.tempVector.copy(controls.offset).sub(controls.attributes[i].worldPosition);
		controls.tempVector.multiply(controls.attributes[i].parentScale);

		if(controls.axis === "E")
		{
			controls.point.applyMatrix4(controls.tempMatrix.getInverse(controls.lookAtMatrix));
			controls.tempVector.applyMatrix4(controls.tempMatrix.getInverse(controls.lookAtMatrix));

			controls.toolRotation.set(Math.atan2(controls.point.z, controls.point.y), Math.atan2(controls.point.x, controls.point.z), Math.atan2(controls.point.y, controls.point.x));
			controls.offsetRotation.set(Math.atan2(controls.tempVector.z, controls.tempVector.y), Math.atan2(controls.tempVector.x, controls.tempVector.z), Math.atan2(controls.tempVector.y, controls.tempVector.x));

			controls.tempQuaternion.setFromRotationMatrix(controls.tempMatrix.getInverse(controls.attributes[i].parentRotationMatrix));

			controls.quaternionE.setFromAxisAngle(controls.eye, controls.toolRotation.z - controls.offsetRotation.z);
			controls.quaternionXYZ.setFromRotationMatrix(controls.attributes[i].worldRotationMatrix);

			controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionE);
			controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionXYZ);

			controls.objects[i].quaternion.copy(controls.tempQuaternion);
		}
		else if(controls.axis === "XYZE")
		{
			controls.quaternionE.setFromEuler(controls.point.clone().cross(controls.tempVector).normalize()); // rotation axis

			controls.tempQuaternion.setFromRotationMatrix(controls.tempMatrix.getInverse(controls.attributes[i].parentRotationMatrix));
			controls.quaternionX.setFromAxisAngle(controls.quaternionE, - controls.point.clone().angleTo(controls.tempVector));
			controls.quaternionXYZ.setFromRotationMatrix(controls.attributes[i].worldRotationMatrix);

			controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionX);
			controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionXYZ);

			controls.objects[i].quaternion.copy(controls.tempQuaternion);
		}
		else if(controls.space === TransformControls.LOCAL)
		{
			controls.point.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].worldRotationMatrix));

			controls.tempVector.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].worldRotationMatrix));

			controls.toolRotation.set(Math.atan2(controls.point.z, controls.point.y), Math.atan2(controls.point.x, controls.point.z), Math.atan2(controls.point.y, controls.point.x));
			controls.offsetRotation.set(Math.atan2(controls.tempVector.z, controls.tempVector.y), Math.atan2(controls.tempVector.x, controls.tempVector.z), Math.atan2(controls.tempVector.y, controls.tempVector.x));

			controls.quaternionXYZ.setFromRotationMatrix(controls.attributes[i].oldRotationMatrix);

			if(controls.snap)
			{
				controls.quaternionX.setFromAxisAngle(controls.unitX, Math.round((controls.toolRotation.x - controls.offsetRotation.x) / controls.rotationSnap) * controls.rotationSnap);
				controls.quaternionY.setFromAxisAngle(controls.unitY, Math.round((controls.toolRotation.y - controls.offsetRotation.y) / controls.rotationSnap) * controls.rotationSnap);
				controls.quaternionZ.setFromAxisAngle(controls.unitZ, Math.round((controls.toolRotation.z - controls.offsetRotation.z) / controls.rotationSnap) * controls.rotationSnap);
			}
			else
			{
				controls.quaternionX.setFromAxisAngle(controls.unitX, controls.toolRotation.x - controls.offsetRotation.x);
				controls.quaternionY.setFromAxisAngle(controls.unitY, controls.toolRotation.y - controls.offsetRotation.y);
				controls.quaternionZ.setFromAxisAngle(controls.unitZ, controls.toolRotation.z - controls.offsetRotation.z);
			}

			if(controls.axis === "X")
			{
				controls.quaternionXYZ.multiplyQuaternions(controls.quaternionXYZ, controls.quaternionX);
			}
			else if(controls.axis === "Y")
			{
				controls.quaternionXYZ.multiplyQuaternions(controls.quaternionXYZ, controls.quaternionY);
			}
			else if(controls.axis === "Z")
			{
				controls.quaternionXYZ.multiplyQuaternions(controls.quaternionXYZ, controls.quaternionZ);
			}

			controls.objects[i].quaternion.copy(controls.quaternionXYZ);
		}
		else if(controls.space === TransformControls.WORLD)
		{
			controls.toolRotation.set(Math.atan2(controls.point.z, controls.point.y), Math.atan2(controls.point.x, controls.point.z), Math.atan2(controls.point.y, controls.point.x));
			controls.offsetRotation.set(Math.atan2(controls.tempVector.z, controls.tempVector.y), Math.atan2(controls.tempVector.x, controls.tempVector.z), Math.atan2(controls.tempVector.y, controls.tempVector.x));
			controls.tempQuaternion.setFromRotationMatrix(controls.tempMatrix.getInverse(controls.attributes[i].parentRotationMatrix));

			if(controls.snap)
			{
				controls.quaternionX.setFromAxisAngle(controls.unitX, Math.round((controls.toolRotation.x - controls.offsetRotation.x) / controls.rotationSnap) * controls.rotationSnap);
				controls.quaternionY.setFromAxisAngle(controls.unitY, Math.round((controls.toolRotation.y - controls.offsetRotation.y) / controls.rotationSnap) * controls.rotationSnap);
				controls.quaternionZ.setFromAxisAngle(controls.unitZ, Math.round((controls.toolRotation.z - controls.offsetRotation.z) / controls.rotationSnap) * controls.rotationSnap);
			}
			else
			{
				controls.quaternionX.setFromAxisAngle(controls.unitX, controls.toolRotation.x - controls.offsetRotation.x);
				controls.quaternionY.setFromAxisAngle(controls.unitY, controls.toolRotation.y - controls.offsetRotation.y);
				controls.quaternionZ.setFromAxisAngle(controls.unitZ, controls.toolRotation.z - controls.offsetRotation.z);
			}

			controls.quaternionXYZ.setFromRotationMatrix(controls.attributes[i].worldRotationMatrix);

			if(controls.axis === "X")
			{
				controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionX);
			}
			else if(controls.axis === "Y")
			{
				controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionY);
			}
			else if(controls.axis === "Z")
			{
				controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionZ);
			}

			controls.tempQuaternion.multiplyQuaternions(controls.tempQuaternion, controls.quaternionXYZ);

			controls.objects[i].quaternion.copy(controls.tempQuaternion);
		}
	}
};
export {TransformGizmoRotate};