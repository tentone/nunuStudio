//Adapted from original transform controls for threejs by arodic (github.com/arodic)

"use strict";

function TransformControls()
{
	THREE.Object3D.call(this);

	var camera = Editor.camera;
	var element = Editor.canvas;

	this.object = undefined;
	this.visible = false;
	this.translationSnap = null;
	this.rotationSnap = null;
	this.space = "world";
	this.size = 1;
	this.axis = null;

	var scope = this;
	var mode = "translate";
	var dragging = false;
	var gizmo =
	{
		"translate": new TransformGizmoTranslate(),
		"rotate": new TransformGizmoRotate(),
		"scale": new TransformGizmoScale()
	};

	//Select gizmo
	for(var type in gizmo)
	{
		var obj = gizmo[type];
		obj.visible = (type === mode);
		this.add(obj);
	}

	var ray = new THREE.Raycaster();
	var pointerVector = new THREE.Vector2();

	var point = new THREE.Vector3();
	var offset = new THREE.Vector3();

	var rotation = new THREE.Vector3();
	var offsetRotation = new THREE.Vector3();
	var scale = 1;

	var lookAtMatrix = new THREE.Matrix4();
	var eye = new THREE.Vector3();

	var tempMatrix = new THREE.Matrix4();
	var tempVector = new THREE.Vector3();
	var tempQuaternion = new THREE.Quaternion();
	var unitX = new THREE.Vector3(1, 0, 0);
	var unitY = new THREE.Vector3(0, 1, 0);
	var unitZ = new THREE.Vector3(0, 0, 1);

	var quaternionXYZ = new THREE.Quaternion();
	var quaternionX = new THREE.Quaternion();
	var quaternionY = new THREE.Quaternion();
	var quaternionZ = new THREE.Quaternion();
	var quaternionE = new THREE.Quaternion();

	var oldPosition = new THREE.Vector3();
	var oldScale = new THREE.Vector3();
	var oldRotationMatrix = new THREE.Matrix4();

	var parentRotationMatrix  = new THREE.Matrix4();
	var parentScale = new THREE.Vector3();

	var worldPosition = new THREE.Vector3();
	var worldRotation = new THREE.Euler();
	var worldRotationMatrix  = new THREE.Matrix4();
	var camPosition = new THREE.Vector3();
	var camRotation = new THREE.Euler();

	element.addEventListener("mousedown", onPointerDown, false);
	//element.addEventListener("touchstart", onPointerDown, false);

	element.addEventListener("mousemove", onPointerHover, false);
	//element.addEventListener("touchmove", onPointerHover, false);

	element.addEventListener("mousemove", onPointerMove, false);
	//element.addEventListener("touchmove", onPointerMove, false);

	element.addEventListener("mouseup", onPointerUp, false);
	element.addEventListener("mouseout", onPointerUp, false);
	//element.addEventListener("touchend", onPointerUp, false);
	//element.addEventListener("touchcancel", onPointerUp, false);
	//element.addEventListener("touchleave", onPointerUp, false);

	this.dispose = function()
	{
		element.removeEventListener("mousedown", onPointerDown);
		//element.removeEventListener("touchstart", onPointerDown);

		element.removeEventListener("mousemove", onPointerHover);
		//element.removeEventListener("touchmove", onPointerHover);

		element.removeEventListener("mousemove", onPointerMove);
		//element.removeEventListener("touchmove", onPointerMove);

		element.removeEventListener("mouseup", onPointerUp);
		element.removeEventListener("mouseout", onPointerUp);
		//element.removeEventListener("touchend", onPointerUp);
		//element.removeEventListener("touchcancel", onPointerUp);
		//element.removeEventListener("touchleave", onPointerUp);
	};

	this.attach = function(object)
	{
		this.object = object;
		this.visible = true;
		this.update();
	};

	this.detach = function()
	{
		this.object = undefined;
		this.visible = false;
		this.axis = null;
	};

	this.getMode = function()
	{
		return mode;
	};

	this.setMode = function(value)
	{
		mode = value ? value : mode;

		if(mode === "scale")
		{
			scope.space = "local";
		}

		for(var type in gizmo)
		{
			gizmo[type].visible = (type === mode);
		}

		this.update();
	};

	this.setTranslationSnap = function(translationSnap)
	{
		scope.translationSnap = translationSnap;
	};

	this.setRotationSnap = function(rotationSnap)
	{
		scope.rotationSnap = rotationSnap;
	};

	this.setSize = function(size)
	{
		scope.size = size;
		this.update();
	};

	this.setSpace = function(space)
	{
		scope.space = space;
		this.update();
	};

	this.update = function()
	{
		if(scope.object === undefined)
		{
			return true;
		}

		scope.object.updateMatrixWorld();
		worldPosition.setFromMatrixPosition(scope.object.matrixWorld);
		worldRotation.setFromRotationMatrix(tempMatrix.extractRotation(scope.object.matrixWorld));

		camera.updateMatrixWorld();
		camPosition.setFromMatrixPosition(camera.matrixWorld);
		camRotation.setFromRotationMatrix(tempMatrix.extractRotation(camera.matrixWorld));

		scale = worldPosition.distanceTo(camPosition) / 6 * scope.size;
		this.position.copy(worldPosition);
		this.scale.set(scale, scale, scale);

		eye.copy(camPosition).sub(worldPosition).normalize();

		if(scope.space === "local")
		{
			gizmo[mode].update(worldRotation, eye);
		}
		else if(scope.space === "world")
		{
			gizmo[mode].update(new THREE.Euler(), eye);
		}

		gizmo[mode].highlight(scope.axis);

		return true;
	};

	function onPointerHover(event)
	{
		if(scope.object === undefined || dragging === true || (event.button !== undefined && event.button !== 0)) 
		{
			return;
		}

		var pointer = event.changedTouches ? event.changedTouches[0] : event;
		var intersect = intersectObjects(pointer, gizmo[mode].pickers.children);

		var axis = null;

		if(intersect)
		{
			axis = intersect.object.name;
			event.preventDefault();
		}

		if(scope.axis !== axis)
		{
			scope.axis = axis;
			scope.update();
		}
	}

	function onPointerDown(event)
	{
		if(scope.object === undefined || dragging === true || (event.button !== undefined && event.button !== 0)) 
		{
			return;
		}

		var pointer = event.changedTouches ? event.changedTouches[0] : event;

		if(pointer.button === 0 || pointer.button === undefined)
		{
			var intersect = intersectObjects(pointer, gizmo[mode].pickers.children);

			if(intersect)
			{
				event.preventDefault();
				event.stopPropagation();

				scope.axis = intersect.object.name;

				scope.update();

				eye.copy(camPosition).sub(worldPosition).normalize();

				gizmo[mode].setActivePlane(scope.axis, eye);

				var planeIntersect = intersectObjects(pointer, [gizmo[mode].activePlane]);

				if(planeIntersect)
				{
					oldPosition.copy(scope.object.position);
					oldScale.copy(scope.object.scale);

					oldRotationMatrix.extractRotation(scope.object.matrix);
					worldRotationMatrix.extractRotation(scope.object.matrixWorld);

					parentRotationMatrix.extractRotation(scope.object.parent.matrixWorld);
					parentScale.setFromMatrixScale(tempMatrix.getInverse(scope.object.parent.matrixWorld));

					offset.copy(planeIntersect.point);
				}
			}
		}

		dragging = true;
	}

	function onPointerMove(event)
	{
		if(scope.object === undefined || scope.axis === null || dragging === false || (event.button !== undefined && event.button !== 0))
		{
			return;
		}

		var pointer = event.changedTouches ? event.changedTouches[0] : event;
		var planeIntersect = intersectObjects(pointer, [gizmo[mode].activePlane]);

		if(planeIntersect === false) 
		{
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		point.copy(planeIntersect.point);

		if(mode === "translate")
		{
			point.sub(offset);
			point.multiply(parentScale);
			if(scope.axis.search("X") === - 1) point.x = 0;
			if(scope.axis.search("Y") === - 1) point.y = 0;
			if(scope.axis.search("Z") === - 1) point.z = 0;

			if(scope.space === "local")
			{
				point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));
				point.applyMatrix4(oldRotationMatrix);

				scope.object.position.copy(oldPosition);
				scope.object.position.add(point);
			}

			if(scope.space === "world" || scope.axis.search("XYZ") !== - 1)
			{
				point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix));

				scope.object.position.copy(oldPosition);
				scope.object.position.add(point);
			}

			if(scope.translationSnap !== null)
			{
				if(scope.space === "local")
				{
					scope.object.position.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));
				}

				if(scope.axis.search("X") !== - 1)
				{
					scope.object.position.x = Math.round(scope.object.position.x / scope.translationSnap) * scope.translationSnap;
				}
				if(scope.axis.search("Y") !== - 1)
				{
					scope.object.position.y = Math.round(scope.object.position.y / scope.translationSnap) * scope.translationSnap;
				}
				if(scope.axis.search("Z") !== - 1)
				{
					scope.object.position.z = Math.round(scope.object.position.z / scope.translationSnap) * scope.translationSnap;
				}

				if(scope.space === "local")
				{
					scope.object.position.applyMatrix4(worldRotationMatrix);
				}
			}
		}
		else if(mode === "scale")
		{
			point.sub(offset);
			point.multiply(parentScale);

			if(scope.space === "local")
			{
				if(scope.axis === "XYZ")
				{
					scale = 1 + ((point.y) / Math.max(oldScale.x, oldScale.y, oldScale.z));

					scope.object.scale.x = oldScale.x * scale;
					scope.object.scale.y = oldScale.y * scale;
					scope.object.scale.z = oldScale.z * scale;
				}
				else
				{
					point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

					if(scope.axis === "X")
					{
						scope.object.scale.x = oldScale.x * (1 + point.x / oldScale.x);
					}
					else if(scope.axis === "Y")
					{
						scope.object.scale.y = oldScale.y * (1 + point.y / oldScale.y);
					}
					else if(scope.axis === "Z")
					{
						scope.object.scale.z = oldScale.z * (1 + point.z / oldScale.z);
					}
				}
			}
		}
		else if(mode === "rotate")
		{
			point.sub(worldPosition);
			point.multiply(parentScale);
			tempVector.copy(offset).sub(worldPosition);
			tempVector.multiply(parentScale);

			if(scope.axis === "E")
			{
				point.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));
				tempVector.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));

				rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
				offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));

				quaternionE.setFromAxisAngle(eye, rotation.z - offsetRotation.z);
				quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionE);
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

				scope.object.quaternion.copy(tempQuaternion);
			}
			else if(scope.axis === "XYZE")
			{
				quaternionE.setFromEuler(point.clone().cross(tempVector).normalize()); // rotation axis

				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));
				quaternionX.setFromAxisAngle(quaternionE, - point.clone().angleTo(tempVector));
				quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

				scope.object.quaternion.copy(tempQuaternion);
			}
			else if(scope.space === "local")
			{
				point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

				tempVector.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

				rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
				offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

				quaternionXYZ.setFromRotationMatrix(oldRotationMatrix);

				if(scope.rotationSnap !== null)
				{
					quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / scope.rotationSnap) * scope.rotationSnap);
					quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / scope.rotationSnap) * scope.rotationSnap);
					quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / scope.rotationSnap) * scope.rotationSnap);
				}
				else
				{
					quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
					quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
					quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
				}

				if(scope.axis === "X")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionX);
				}
				else if(scope.axis === "Y")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionY);
				}
				else if(scope.axis === "Z")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionZ);
				}

				scope.object.quaternion.copy(quaternionXYZ);
			}
			else if(scope.space === "world")
			{
				rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
				offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));
				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));

				if(scope.rotationSnap !== null)
				{
					quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / scope.rotationSnap) * scope.rotationSnap);
					quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / scope.rotationSnap) * scope.rotationSnap);
					quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / scope.rotationSnap) * scope.rotationSnap);
				}
				else
				{
					quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
					quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
					quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
				}

				quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

				if(scope.axis === "X")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
				}
				else if(scope.axis === "Y")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
				}
				else if(scope.axis === "Z")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
				}

				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

				scope.object.quaternion.copy(tempQuaternion);
			}
		}

		scope.update();
	}

	function onPointerUp(event)
	{
		event.preventDefault();

		if(event.button !== undefined && event.button !== 0)
		{
			return;
		}

		dragging = false;

		onPointerHover(event);
	}

	function intersectObjects(pointer, objects)
	{
		var rect = element.getBoundingClientRect();
		var x = (pointer.clientX - rect.left) / rect.width;
		var y = (pointer.clientY - rect.top) / rect.height;

		pointerVector.set((x * 2) - 1, - (y * 2) + 1);
		ray.setFromCamera(pointerVector, camera);

		var intersections = ray.intersectObjects(objects, true);
		return intersections[0] ? intersections[0] : false;
	}
}

TransformControls.prototype = Object.create(THREE.Object3D.prototype);
