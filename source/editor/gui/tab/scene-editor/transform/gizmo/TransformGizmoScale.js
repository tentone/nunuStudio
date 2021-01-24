import {Shape} from "cannon-es";
import {Geometry, Mesh, BoxGeometry, BufferGeometry, Float32BufferAttribute, Line, BoxBufferGeometry, CylinderBufferGeometry, Matrix4} from "three";
import {PhysicsObject} from "../../../../../../core/objects/physics/PhysicsObject.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ActionBundle} from "../../../../../history/action/ActionBundle.js";
import {GizmoMaterial} from "../GizmoMaterial.js";
import {GizmoLineMaterial} from "../GizmoLineMaterial.js";
import {Editor} from "../../../../../Editor.js";
import {TransformGizmo} from "./TransformGizmo.js";

/**
 * Gizmo used to change scale of an object. Can be used with Object3D objects.
 *
 * @class TransformGizmoScale
 * @extends {TransformGizmo}
 */
function TransformGizmoScale()
{
	var arrowGeometry = new Geometry();
	var mesh = new Mesh(new BoxGeometry(0.125, 0.125, 0.125));
	mesh.position.y = 0.5;
	mesh.updateMatrix();

	arrowGeometry.merge(mesh.geometry, mesh.matrix);

	var x = new BufferGeometry();
	x.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

	var y = new BufferGeometry();
	y.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

	var z = new BufferGeometry();
	z.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3));

	this.handleGizmos =
	{
		X: [[new Mesh(arrowGeometry, GizmoMaterial.red), [0.5, 0, 0], [0, 0, - Math.PI / 2]], [new Line(x, GizmoLineMaterial.red)]],
		Y: [[new Mesh(arrowGeometry, GizmoMaterial.green), [0, 0.5, 0]], [new Line(y, GizmoLineMaterial.green)]],
		Z: [[new Mesh(arrowGeometry, GizmoMaterial.blue), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new Line(z, GizmoLineMaterial.blue)]],
		XYZ: [[new Mesh(new BoxBufferGeometry(0.125, 0.125, 0.125), GizmoMaterial.whiteAlpha)]]
	};

	this.pickerGizmos =
	{
		X: [[new Mesh(new CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0.6, 0, 0], [0, 0, - Math.PI / 2]]],
		Y: [[new Mesh(new CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0.6, 0]]],
		Z: [[new Mesh(new CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), TransformGizmo.pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],
		XYZ: [[new Mesh(new BoxBufferGeometry(0.4, 0.4, 0.4), TransformGizmo.pickerMaterial)]]
	};

	TransformGizmo.call(this);
}

TransformGizmoScale.prototype = Object.create(TransformGizmo.prototype);

TransformGizmoScale.prototype.setActivePlane = function(axis, eye)
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
};

TransformGizmoScale.prototype.updatePose = function(controls)
{
	controls.gizmo.update(controls.attributes[0].worldRotation, controls.eye);
	controls.gizmo.highlight(controls.axis);
};

TransformGizmoScale.prototype.applyChanges = function(controls)
{
	var actions = [];

	for (var i = 0; i < controls.objects.length; i++)
	{
		var object = controls.objects[i].scale;
		actions.push(new ChangeAction(object, "x", object.x, controls.attributes[i].oldScale.x));
		actions.push(new ChangeAction(object, "y", object.y, controls.attributes[i].oldScale.y));
		actions.push(new ChangeAction(object, "z", object.z, controls.attributes[i].oldScale.z));
	}

	Editor.addAction(new ActionBundle(actions));
};

TransformGizmoScale.prototype.transformObject = function(controls)
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

		if (controls.axis === "XYZ")
		{
			controls.toolScale = 1 + controls.point.y;

			controls.objects[i].scale.copy(controls.attributes[i].oldScale);
			controls.objects[i].scale.multiplyScalar(controls.toolScale);
		}
		else
		{
			controls.point.applyMatrix4(controls.tempMatrix.getInverse(controls.attributes[i].worldRotationMatrix));

			if (controls.axis === "X")
			{
				controls.objects[i].scale.x = controls.attributes[i].oldScale.x * (1 + controls.point.x);
			}
			else if (controls.axis === "Y")
			{
				controls.objects[i].scale.y = controls.attributes[i].oldScale.y * (1 + controls.point.y);
			}
			else if (controls.axis === "Z")
			{
				controls.objects[i].scale.z = controls.attributes[i].oldScale.z * (1 + controls.point.z);
			}
		}

		// Update physics objects
		if (controls.objects[i] instanceof PhysicsObject)
		{
			var shapes = controls.objects[i].body.shapes;
			var scale = controls.objects[i].scale;

			for (var i = 0; i < shapes.length; i++)
			{
				var shape = shapes[i];

				if (shape.type === Shape.types.BOX)
				{
					shape.halfExtents.x = scale.x / 2.0;
					shape.halfExtents.y = scale.y / 2.0;
					shape.halfExtents.z = scale.z / 2.0;
				}
				else if (shape.type === Shape.types.SPHERE)
				{
					shape.radius = scale.x;
				}
			}
		}
	}
};
export {TransformGizmoScale};
