"use strict";

/**
 * A transform gizmo is a object used to transform a property of an entity.
 *
 * Should be used as basis for other transform gizmos. This base implementation does not apply any trasnforms to objects.
 *
 * @class TransformGizmo
 */
function TransformGizmo()
{
	THREE.Object3D.call(this);

	this.handles = new THREE.Object3D();
	this.pickers = new THREE.Object3D();
	this.planes = new THREE.Object3D();

	this.add(this.handles);
	this.add(this.pickers);
	this.add(this.planes);

	// Planes
	var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
	var planeMaterial = new THREE.MeshBasicMaterial({visible: false, side: THREE.DoubleSide});
	var planes =
	{
		"XY": new THREE.Mesh(planeGeometry, planeMaterial),
		"YZ": new THREE.Mesh(planeGeometry, planeMaterial),
		"XZ": new THREE.Mesh(planeGeometry, planeMaterial),
		"XYZE": new THREE.Mesh(planeGeometry, planeMaterial)
	};

	this.activePlane = planes["XYZE"];

	planes["YZ"].rotation.set(0, Math.PI / 2, 0);
	planes["XZ"].rotation.set(-Math.PI / 2, 0, 0);

	for(var i in planes)
	{
		planes[i].name = i;
		this.planes.add(planes[i]);
		this.planes[i] = planes[i];
	}

	// Handlers and pickers
	function setupGizmos(gizmoMap, parent)
	{
		for(var name in gizmoMap)
		{
			for(i = gizmoMap[name].length; i--;)
			{
				var object = gizmoMap[name][i][0];
				var position = gizmoMap[name][i][1];
				var rotation = gizmoMap[name][i][2];

				object.name = name;

				if(position)
				{
					object.position.set(position[0], position[1], position[2]);
				}
				
				if(rotation)
				{
					object.rotation.set(rotation[0], rotation[1], rotation[2]);
				}

				parent.add(object);
			}
		}
	}

	setupGizmos(this.handleGizmos, this.handles);
	setupGizmos(this.pickerGizmos, this.pickers);

	// Reset transformations
	this.traverse(function(child)
	{
		if(child.geometry !== undefined)
		{
			child.updateMatrix();

			// Move geometry to origin
			var tempGeometry = child.geometry.clone();
			tempGeometry.applyMatrix4(child.matrix);
			child.geometry = tempGeometry;

			// Reset pose
			child.position.set(0, 0, 0);
			child.rotation.set(0, 0, 0);
			child.scale.set(1, 1, 1);
		}
	});
}

TransformGizmo.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Invisible material used for the picking regions.
 *
 * These regions are not shown to the user but are raycasted as normal drawable geometries.
 *
 * @static
 * @attribute pickerMaterial
 * @type {GizmoMaterial}
 */
TransformGizmo.pickerMaterial = new GizmoMaterial({visible: false, transparent: false});

/**
 * Set the currently active plane in the gizmo object.
 *
 * Planes are used for user interaction relative to the plane, and these can be toggled based on view direction.
 *
 * @method setActivePlane
 * @param {string} axis Axis stored as text. (e.g X, Y, XY, XZ).
 * @param {THREE.Matrix4} eye Eye view camera combined (projection and pose) matrix.
 */
TransformGizmo.prototype.setActivePlane = function(axis, eye){};

/**
 * Called when the controls button is released and there was object being edited.
 *
 * Changes made to the object should be applied to the editor action history here.
 *
 * @method onPointerUp
 * @param {TransformControls} controls Transform controls object that contain this gizmo.
 */
TransformGizmo.prototype.applyChanges = function(controls){};

/**
 * Called while the pointer is moving around the canvas.
 *
 * Used to contantly tranform the object. Final changes are not applied in this method.
 *
 * @method transformObject
 * @param {TransformControls} controls Transform controls object that contain this gizmo.
 */
TransformGizmo.prototype.transformObject = function(controls){};

/**
 * Called everytime that the controls button is pressed to start transforming the object.
 *
 * @method startTransform
 * @param {TransformControls} controls Transform controls object that contain this gizmo.
 */
TransformGizmo.prototype.startTransform = function(controls){};

/**
 * Update transform of the gizmo, called everytime on update to calculate size of the gizmo on screen.
 *
 * @method updatePose
 * @param {TransformControls} controls Transform controls object that contain this gizmo.
 */
TransformGizmo.prototype.updatePose = function(controls)
{
	if(controls.space === TransformControls.LOCAL)
	{
		controls.gizmo.update(controls.attributes[0].worldRotation, controls.eye);
	}
	else if(controls.space === TransformControls.WORLD)
	{
		controls.gizmo.update(new THREE.Euler(), controls.eye);
	}

	controls.gizmo.highlight(controls.axis);
};


/**
 * Update the transformation of the gizmo from rotation and combined view matrix.
 *
 * @method update
 * @param {THREE.Eurler} rotation Euler rotation.
 * @param {THREE.Matrix4} eye Eye view camera combined (projection and pose) matrix.
 */
TransformGizmo.prototype.update = function(rotation, eye)
{
	var vec1 = new THREE.Vector3(0, 0, 0);
	var vec2 = new THREE.Vector3(0, 1, 0);
	var lookAtMatrix = new THREE.Matrix4();

	this.traverse(function(child)
	{
		if(child.name.search("E") !== - 1)
		{
			child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));
		}
		else if(child.name.search("X") !== - 1 || child.name.search("Y") !== - 1 || child.name.search("Z") !== - 1)
		{
			child.quaternion.setFromEuler(rotation);
		}
	});
};

/**
 * Hightlight axis in the gizmo object.
 *
 * @method highlight
 * @param {string} axis Exact name of the axis to be highlighted (assumes that the material uses the same name as the axis).
 */
TransformGizmo.prototype.highlight = function(axis)
{
	this.traverse(function(child)
	{
		if(child.material && child.material.highlight)
		{
			child.material.highlight(child.name === axis);
		}
	});
};