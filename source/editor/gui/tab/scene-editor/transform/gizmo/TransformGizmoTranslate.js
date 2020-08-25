import {Geometry, Mesh, CylinderGeometry, BufferGeometry, Float32BufferAttribute, Line, CylinderBufferGeometry, BoxBufferGeometry, PlaneBufferGeometry, Matrix4} from "three";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ActionBundle} from "../../../../../history/action/ActionBundle.js";
import {TransformControls} from "../TransformControls.js";
import {GizmoMaterial} from "../GizmoMaterial.js";
import {GizmoLineMaterial} from "../GizmoLineMaterial.js";
import {Editor} from "../../../../../Editor.js";
import {TransformGizmo} from "./TransformGizmo.js";

/**
 * Gizmo used to change position of an object. Can be used with Object3D objects.
 *
 * @class TransformGizmoTranslate
 * @extends {TransformGizmo}
 */
function TransformGizmoTranslate()
{
	var arrowGeometry = new Geometry();
	var mesh = new Mesh(new CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
	mesh.position.y = 0.5;
	mesh.updateMatrix();

	arrowGeometry.merge(mesh.geometry, mesh.matrix);

	var lineXGeometry = new BufferGeometry();
	lineXGeometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

	var lineYGeometry = new BufferGeometry();
	lineYGeometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

	var lineZGeometry = new BufferGeometry();
	lineZGeometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3));

	this.handleGizmos =
	{
		X: [[new Mesh(arrowGeometry, GizmoMaterial.red), [0.5, 0, 0], [0, 0, - Math.PI / 2]], [new Line(lineXGeometry, GizmoLineMaterial.red)]],
		Y: [[new Mesh(arrowGeometry, GizmoMaterial.green), [0, 0.5, 0]], [new Line(lineYGeometry, GizmoLineMaterial.green)]],
		Z: [[new Mesh(arrowGeometry, GizmoMaterial.blue), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new Line(lineZGeometry, GizmoLineMaterial.blue)]],
		XY: [[new Mesh(TransformGizmoTranslate.plane, GizmoMaterial.yellowAlpha), [0.15, 0.15, 0]]],
		YZ: [[new Mesh(TransformGizmoTranslate.plane, GizmoMaterial.cyanAlpha), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],
		XZ: [[new Mesh(TransformGizmoTranslate.plane, GizmoMaterial.magentaAlpha), [0.15, 0, 0.15], [- Math.PI / 2, 0, 0]]],
		XYZ: [[new Mesh(TransformGizmoTranslate.box, GizmoMaterial.whiteAlpha), [0, 0, 0], [0, 0, 0]]]
	};

	this.pickerGizmos =
	{
		X: [[new Mesh(TransformGizmoTranslate.cylinder, TransformGizmo.pickerMaterial), [0.6, 0, 0], [0, 0, - Math.PI / 2]]],
		Y: [[new Mesh(TransformGizmoTranslate.cylinder, TransformGizmo.pickerMaterial), [0, 0.6, 0]]],
		Z: [[new Mesh(TransformGizmoTranslate.cylinder, TransformGizmo.pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],
		XY: [[new Mesh(TransformGizmoTranslate.planeBig, TransformGizmo.pickerMaterial), [0.2, 0.2, 0]]],
		YZ: [[new Mesh(TransformGizmoTranslate.planeBig, TransformGizmo.pickerMaterial), [0, 0.2, 0.2], [0, Math.PI / 2, 0]]],
		XZ: [[new Mesh(TransformGizmoTranslate.planeBig, TransformGizmo.pickerMaterial), [0.2, 0, 0.2], [- Math.PI / 2, 0, 0]]],
		XYZ: [[new Mesh(TransformGizmoTranslate.box, TransformGizmo.pickerMaterial)]]
	};

	TransformGizmo.call(this);
}

TransformGizmoTranslate.prototype = Object.create(TransformGizmo.prototype);

TransformGizmoTranslate.cylinder = new CylinderBufferGeometry(0.2, 0, 1, 4, 1, false);
TransformGizmoTranslate.box = new BoxBufferGeometry(0.1, 0.1, 0.1);
TransformGizmoTranslate.plane = new PlaneBufferGeometry(0.29, 0.29);
TransformGizmoTranslate.planeBig = new PlaneBufferGeometry(0.4, 0.4);

TransformGizmoTranslate.prototype.setActivePlane = function(axis, eye)
{
	var tempMatrix = new Matrix4();
	eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

	if (axis === "X")
	{
		this.activePlane = this.planes["XY"];
		if (Math.abs(eye.y) > Math.abs(eye.z))
		{
			this.activePlane = this.planes["XZ"];
		}
	}
	else if (axis === "Y")
	{
		this.activePlane = this.planes["XY"];
		if (Math.abs(eye.x) > Math.abs(eye.z))
		{
			this.activePlane = this.planes["YZ"];
		}
	}
	else if (axis === "Z")
	{
		this.activePlane = this.planes["XZ"];
		if (Math.abs(eye.x) > Math.abs(eye.y))
		{
			this.activePlane = this.planes["YZ"];
		}
	}
	else if (axis === "XYZ")
	{
		this.activePlane = this.planes["XYZE"];
	}
	else if (axis === "XY")
	{
		this.activePlane = this.planes["XY"];
	}
	else if (axis === "YZ")
	{
		this.activePlane = this.planes["YZ"];
	}
	else if (axis === "XZ")
	{
		this.activePlane = this.planes["XZ"];
	}
};

TransformGizmoTranslate.prototype.applyChanges = function(controls)
{
	var actions = [];

	for (var i = 0; i < controls.objects.length; i++)
	{
		var object = controls.objects[i].position;
		actions.push(new ChangeAction(object, "x", object.x, controls.attributes[i].oldPosition.x));
		actions.push(new ChangeAction(object, "y", object.y, controls.attributes[i].oldPosition.y));
		actions.push(new ChangeAction(object, "z", object.z, controls.attributes[i].oldPosition.z));
	}

	Editor.addAction(new ActionBundle(actions));
};


TransformGizmoTranslate.prototype.transformObject = function(controls)
{
	var planeIntersect = controls.intersectObjects([controls.gizmo.activePlane]);
	if (planeIntersect === false) 
	{
		return;
	}

	for (var i = 0; i < controls.objects.length; i++)
	{
		controls.point.copy(planeIntersect.point);
		controls.point.sub(controls.offset);
		controls.point.multiply(controls.attributes[i].parentScale);

		if (controls.axis.search("X") === -1)
		{
			controls.point.x = 0;
		}
		if (controls.axis.search("Y") === -1) 
		{
			controls.point.y = 0;
		}
		if (controls.axis.search("Z") === -1)
		{
			controls.point.z = 0;
		}
				
		if (controls.space === TransformControls.WORLD || controls.axis.search("XYZ") !== -1)
		{
			controls.point.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].parentRotationMatrix));

			for (var j = 0; j < controls.objects.length; j++)
			{
				controls.objects[j].position.copy(controls.attributes[j].oldPosition);
				controls.objects[j].position.add(controls.point);
			}
		}
		else if (controls.space === TransformControls.LOCAL)
		{
			if (controls.axis.length > 1)
			{
				controls.point.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].worldRotationMatrix));
				controls.point.applyMatrix4(controls.attributes[i].oldRotationMatrix);
			}
			else
			{
				controls.point.applyMatrix4(controls.attributes[i].oldRotationMatrix);
			}

			for (var j = 0; j < controls.objects.length; j++)
			{
				controls.objects[j].position.copy(controls.attributes[j].oldPosition);
				controls.objects[j].position.add(controls.point);
			}
		}

		if (controls.snap)
		{
			if (controls.space === TransformControls.LOCAL)
			{
				controls.objects[i].position.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].worldRotationMatrix));
			}

			if (controls.axis.search("X") !== -1)
			{
				controls.objects[i].position.x = Math.round(controls.objects[i].position.x / controls.translationSnap) * controls.translationSnap;
			}
			if (controls.axis.search("Y") !== -1)
			{
				controls.objects[i].position.y = Math.round(controls.objects[i].position.y / controls.translationSnap) * controls.translationSnap;
			}
			if (controls.axis.search("Z") !== -1)
			{
				controls.objects[i].position.z = Math.round(controls.objects[i].position.z / controls.translationSnap) * controls.translationSnap;
			}

			if (controls.space === TransformControls.LOCAL)
			{
				controls.objects[i].position.applyMatrix4(controls.attributes[i].worldRotationMatrix);
			}
		}
	}
};

export {TransformGizmoTranslate};
