//Adapted from original transform controls for threejs by arodic (github.com/arodic)

"use strict";

function TransformControls(camera, canvas, mouse)
{
	THREE.Object3D.call(this);
	
	this.object = null;
	this.visible = false;
	this.space = "world";
	this.size = 1;
	this.axis = null;

	var self = this;
	
	var mode = "translate";
	var dragging = false;
	var editing = false;
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
	var worldRotationMatrix = new THREE.Matrix4();
	var camPosition = new THREE.Vector3();
	var camRotation = new THREE.Euler();

	this.attach = function(object)
	{
		this.object = object;
		this.visible = true;
		this.updateScale();
	};

	this.detach = function()
	{
		this.object = null;
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
			this.space = "local";
		}

		for(var type in gizmo)
		{
			gizmo[type].visible = (type === mode);
		}

		this.updateScale();
	};

	this.setSize = function(size)
	{
		this.size = size;
		this.updateScale();
	};

	this.setSpace = function(space)
	{
		this.space = space;
		this.updateScale();
	};

	this.update = function()
	{
		if(mouse.buttonJustPressed(Mouse.LEFT))
		{
			onPointerDown();
		}
		
		if(mouse.buttonJustReleased(Mouse.LEFT))
		{
			onPointerUp();
		}

		if(mouse.delta.x !== 0 || mouse.delta.y !== 0)
		{
			onPointerHover();
			onPointerMove();
		}

		this.updateScale();

		return editing;
	};

	this.updateScale = function()
	{
		if(this.object === null)
		{
			return;
		}

		//this.object.updateMatrixWorld();
		worldPosition.setFromMatrixPosition(this.object.matrixWorld);
		worldRotation.setFromRotationMatrix(tempMatrix.extractRotation(this.object.matrixWorld));

		//camera.updateMatrixWorld();
		camPosition.setFromMatrixPosition(camera.matrixWorld);
		camRotation.setFromRotationMatrix(tempMatrix.extractRotation(camera.matrixWorld));

		this.position.copy(worldPosition);

		if(camera instanceof THREE.PerspectiveCamera)
		{
			scale = worldPosition.distanceTo(camPosition) / 6 * this.size;
			this.scale.set(scale, scale, scale);
		}
		else
		{
			scale = camera.size / 6 * this.size;
			this.scale.set(scale, scale, scale);
		}
		
		eye.copy(camPosition).sub(worldPosition).normalize();

		if(this.space === "local")
		{
			gizmo[mode].update(worldRotation, eye);
		}
		else if(this.space === "world")
		{
			gizmo[mode].update(new THREE.Euler(), eye);
		}

		gizmo[mode].highlight(this.axis);
	}

	function onPointerHover()
	{
		if(self.object === null || dragging === true) 
		{
			return;
		}

		var intersect = intersectObjects(gizmo[mode].pickers.children);
		var axis = null;

		if(intersect)
		{
			axis = intersect.object.name;
		}

		if(self.axis !== axis)
		{
			self.axis = axis;
			self.updateScale();
		}
	}

	function onPointerDown()
	{
		if(self.object === null || dragging === true) 
		{
			return;
		}

		var intersect = intersectObjects(gizmo[mode].pickers.children);

		if(intersect)
		{
			editing = true;
			self.axis = intersect.object.name;
			self.updateScale();

			eye.copy(camPosition).sub(worldPosition).normalize();
			gizmo[mode].setActivePlane(self.axis, eye);
			var planeIntersect = intersectObjects([gizmo[mode].activePlane]);

			if(planeIntersect)
			{
				oldPosition.copy(self.object.position);
				oldScale.copy(self.object.scale);

				oldRotationMatrix.extractRotation(self.object.matrix);
				worldRotationMatrix.extractRotation(self.object.matrixWorld);

				parentRotationMatrix.extractRotation(self.object.parent.matrixWorld);
				parentScale.setFromMatrixScale(tempMatrix.getInverse(self.object.parent.matrixWorld));

				offset.copy(planeIntersect.point);
			}
		}

		dragging = true;
	}

	function onPointerMove()
	{
		if(self.object === null || self.axis === null || dragging === false)
		{
			return;
		}

		var planeIntersect = intersectObjects([gizmo[mode].activePlane]);

		if(planeIntersect === false) 
		{
			return;
		}

		point.copy(planeIntersect.point);

		if(mode === "translate")
		{
			point.sub(offset);
			point.multiply(parentScale);

			if(self.axis.search("X") === -1)
			{
				point.x = 0;
			}
			if(self.axis.search("Y") === -1) 
			{
				point.y = 0;
			}
			if(self.axis.search("Z") === -1)
			{
				point.z = 0;
			}
					
			if(self.space === "world" || self.axis.search("XYZ") !== -1)
			{
				point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix));

				self.object.position.copy(oldPosition);
				self.object.position.add(point);
			}
			else if(self.space === "local")
			{
				if(self.axis.length > 1)
				{
					point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));
					point.applyMatrix4(oldRotationMatrix);
				}
				else
				{
					point.applyMatrix4(oldRotationMatrix);
				}
				
				self.object.position.copy(oldPosition);
				self.object.position.add(point);
			}
		}
		else if(mode === "scale")
		{
			point.sub(offset);
			point.multiply(parentScale);

			if(self.space === "local")
			{
				if(self.axis === "XYZ")
				{
					scale = 1 + ((point.y) / Math.max(oldScale.x, oldScale.y, oldScale.z));

					self.object.scale.x = oldScale.x * scale;
					self.object.scale.y = oldScale.y * scale;
					self.object.scale.z = oldScale.z * scale;
				}
				else
				{
					point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

					if(self.axis === "X")
					{
						self.object.scale.x = oldScale.x * (1 + point.x / oldScale.x);
					}
					else if(self.axis === "Y")
					{
						self.object.scale.y = oldScale.y * (1 + point.y / oldScale.y);
					}
					else if(self.axis === "Z")
					{
						self.object.scale.z = oldScale.z * (1 + point.z / oldScale.z);
					}
				}

				//Update physics objects
				if(self.object instanceof PhysicsObject)
				{
					var shapes = self.object.body.shapes;
					var scale = self.object.scale;

					for(var i = 0; i < shapes.length; i++)
					{
						var shape = shapes[i];
						
						if(shape.type === CANNON.Shape.types.BOX)
						{
							shape.halfExtents.x = scale.x / 2.0;
							shape.halfExtents.y = scale.y / 2.0;
							shape.halfExtents.z = scale.z / 2.0;
						}
						else if(shape.type === CANNON.Shape.types.SPHERE)
						{
							shape.radius = scale.x;
						}
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

			if(self.axis === "E")
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

				self.object.quaternion.copy(tempQuaternion);
			}
			else if(self.axis === "XYZE")
			{
				quaternionE.setFromEuler(point.clone().cross(tempVector).normalize()); // rotation axis

				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));
				quaternionX.setFromAxisAngle(quaternionE, - point.clone().angleTo(tempVector));
				quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

				self.object.quaternion.copy(tempQuaternion);
			}
			else if(self.space === "local")
			{
				point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

				tempVector.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

				rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
				offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

				quaternionXYZ.setFromRotationMatrix(oldRotationMatrix);
				quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
				quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
				quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);

				if(self.axis === "X")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionX);
				}
				else if(self.axis === "Y")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionY);
				}
				else if(self.axis === "Z")
				{
					quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionZ);
				}

				self.object.quaternion.copy(quaternionXYZ);
			}
			else if(self.space === "world")
			{
				rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
				offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));
				tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));

				quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
				quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
				quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
				quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

				if(self.axis === "X")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
				}
				else if(self.axis === "Y")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
				}
				else if(self.axis === "Z")
				{
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
				}

				tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

				self.object.quaternion.copy(tempQuaternion);
			}
		}

		self.updateScale();
	}

	function onPointerUp()
	{
		editing = false;
		dragging = false;
		onPointerHover();
	}

	function intersectObjects(objects)
	{
		var rect = canvas.getBoundingClientRect();
		var x = mouse.position.x / rect.width;
		var y = mouse.position.y / rect.height;

		pointerVector.set((x * 2) - 1, - (y * 2) + 1);
		ray.setFromCamera(pointerVector, camera);

		var intersections = ray.intersectObjects(objects, true);
		return intersections[0] ? intersections[0] : false;
	}
}

TransformControls.prototype = Object.create(THREE.Object3D.prototype);
