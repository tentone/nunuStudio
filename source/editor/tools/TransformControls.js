"use strict";

//Adapted from original transform controls by arodic (github.com/arodic)
function TransformControls(camera, canvas, mouse)
{
	THREE.Object3D.call(this);
	
	this.objects = null;
	this.visible = false;
	this.space = "world";
	this.size = 1;
	this.axis = null;

	this.snap = false;
	this.translationSnap = 1;
	this.rotationSnap = 0.1;

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
	
	var camPosition = new THREE.Vector3();
	var camRotation = new THREE.Euler();

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

	//Per object attributes
	var parentRotationMatrix = [];
	var parentScale = [];
	var worldRotationMatrix = [];
	var worldPosition = [];
	var worldRotation = [];
	var oldPosition = [];
	var oldScale = [];
	var oldQuaternion = [];
	var oldRotationMatrix = [];

	this.attach = function(objects)
	{
		//Add more temporary attibutes if necessary
		while(oldPosition.length < objects.length)
		{
			parentRotationMatrix.push(new THREE.Matrix4());
			parentScale.push(new THREE.Vector3());
			worldRotationMatrix.push(new THREE.Matrix4());
			worldPosition.push(new THREE.Vector3());
			worldRotation.push(new THREE.Euler());
			oldPosition.push(new THREE.Vector3());
			oldScale.push(new THREE.Vector3());
			oldQuaternion.push(new THREE.Quaternion());
			oldRotationMatrix.push(new THREE.Matrix4());
		}

		self.objects = objects;
		self.visible = true;
		self.updateScale();
	};

	this.detach = function()
	{
		self.objects = null;
		self.visible = false;
		self.axis = null;
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

		self.updateScale();
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
		if(this.objects === null)
		{
			return;
		}

		for(var i = 0; i < self.objects.length; i++)
		{
			worldPosition[i].setFromMatrixPosition(this.objects[i].matrixWorld);
			worldRotation[i].setFromRotationMatrix(tempMatrix.extractRotation(this.objects[i].matrixWorld));
		}

		camPosition.setFromMatrixPosition(camera.matrixWorld);
		camRotation.setFromRotationMatrix(tempMatrix.extractRotation(camera.matrixWorld));

		this.position.copy(worldPosition[0]);

		if(camera instanceof THREE.PerspectiveCamera)
		{
			scale = worldPosition[0].distanceTo(camPosition) / 6 * this.size;
			this.scale.set(scale, scale, scale);
		}
		else
		{
			scale = camera.size / 6 * this.size;
			this.scale.set(scale, scale, scale);
		}
		
		eye.copy(camPosition).sub(worldPosition[0]).normalize();

		if(this.space === "local" || mode === "scale")
		{
			gizmo[mode].update(worldRotation[0], eye);
		}
		else if(this.space === "world")
		{
			gizmo[mode].update(new THREE.Euler(), eye);
		}

		gizmo[mode].highlight(this.axis);
	}

	function onPointerHover()
	{
		if(self.objects === null || dragging === true) 
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
		if(self.objects === null || dragging === true) 
		{
			return;
		}

		var intersect = intersectObjects(gizmo[mode].pickers.children);

		if(intersect)
		{
			editing = true;
			self.axis = intersect.object.name;
			self.updateScale();

			eye.copy(camPosition).sub(worldPosition[0]).normalize();
			gizmo[mode].setActivePlane(self.axis, eye);
			var planeIntersect = intersectObjects([gizmo[mode].activePlane]);

			if(planeIntersect)
			{
				for(var i = 0; i < self.objects.length; i++)
				{
					oldPosition[i].copy(self.objects[i].position);
					oldScale[i].copy(self.objects[i].scale);
					oldQuaternion[i].copy(self.objects[i].quaternion);
					oldRotationMatrix[i].extractRotation(self.objects[i].matrix);

					worldRotationMatrix[i].extractRotation(self.objects[i].matrixWorld);
					parentRotationMatrix[i].extractRotation(self.objects[i].parent.matrixWorld);
					parentScale[i].setFromMatrixScale(tempMatrix.getInverse(self.objects[i].parent.matrixWorld));
				}


				offset.copy(planeIntersect.point);
			}
		}

		dragging = true;
	}

	function onPointerMove()
	{
		if(self.objects === null || self.axis === null || dragging === false)
		{
			return;
		}

		var planeIntersect = intersectObjects([gizmo[mode].activePlane]);

		if(planeIntersect === false) 
		{
			return;
		}

		
		if(mode === "translate")
		{
			for(var i = 0; i < self.objects.length; i++)
			{
				point.copy(planeIntersect.point);
				point.sub(offset);
				point.multiply(parentScale[i]);

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
					point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix[i]));

					for(var i = 0; i < self.objects.length; i++)
					{
						self.objects[i].position.copy(oldPosition[i]);
						self.objects[i].position.add(point);
					}
				}
				else if(self.space === "local")
				{
					if(self.axis.length > 1)
					{
						point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix[i]));
						point.applyMatrix4(oldRotationMatrix[i]);
					}
					else
					{
						point.applyMatrix4(oldRotationMatrix[i]);
					}

					for(var i = 0; i < self.objects.length; i++)
					{
						self.objects[i].position.copy(oldPosition[i]);
						self.objects[i].position.add(point);
					}
				}

				if(self.snap)
				{

					if(self.space === "local")
					{
						self.objects[i].position.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix[i]));
					}

					if(self.axis.search("X") !== -1)
					{
						self.objects[i].position.x = Math.round(self.objects[i].position.x / self.translationSnap) * self.translationSnap;
					}
					if(self.axis.search("Y") !== -1)
					{
						self.objects[i].position.y = Math.round(self.objects[i].position.y / self.translationSnap) * self.translationSnap;
					}
					if(self.axis.search("Z") !== -1)
					{
						self.objects[i].position.z = Math.round(self.objects[i].position.z / self.translationSnap) * self.translationSnap;
					}

					if(self.space === "local" )
					{
						self.objects[i].position.applyMatrix4(worldRotationMatrix[i]);
					}
				}
			}
		}
		else if(mode === "scale")
		{
			for(var i = 0; i < self.objects.length; i++)
			{
				point.copy(planeIntersect.point);
				point.sub(offset);
				point.multiply(parentScale[i]);

				if(self.axis === "XYZ")
				{
					scale = 1 + ((point.y) / Math.max(oldScale[i].x, oldScale[i].y, oldScale[i].z));

					self.objects[i].scale.copy(oldScale[i]);
					self.objects[i].scale.multiplyScalar(scale);
				}
				else
				{
					point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix[i]));

					if(self.axis === "X")
					{
						self.objects[i].scale.x = oldScale[i].x * (1 + point.x / oldScale[i].x);
					}
					else if(self.axis === "Y")
					{
						self.objects[i].scale.y = oldScale[i].y * (1 + point.y / oldScale[i].y);
					}
					else if(self.axis === "Z")
					{
						self.objects[i].scale.z = oldScale[i].z * (1 + point.z / oldScale[i].z);
					}
				}

				//Update physics objects
				if(self.objects[i] instanceof PhysicsObject)
				{
					var shapes = self.objects[i].body.shapes;
					var scale = self.objects[i].scale;

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
			for(var i = 0; i < self.objects.length; i++)
			{
				point.copy(planeIntersect.point);
				point.sub(worldPosition[i]);
				point.multiply(parentScale[i]);
				tempVector.copy(offset).sub(worldPosition[i]);
				tempVector.multiply(parentScale[i]);

				if(self.axis === "E")
				{
					point.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));
					tempVector.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));

					rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
					offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

					tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix[i]));

					quaternionE.setFromAxisAngle(eye, rotation.z - offsetRotation.z);
					quaternionXYZ.setFromRotationMatrix(worldRotationMatrix[i]);

					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionE);
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

					self.objects[i].quaternion.copy(tempQuaternion);
				}
				else if(self.axis === "XYZE")
				{
					quaternionE.setFromEuler(point.clone().cross(tempVector).normalize()); // rotation axis

					tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix[i]));
					quaternionX.setFromAxisAngle(quaternionE, - point.clone().angleTo(tempVector));
					quaternionXYZ.setFromRotationMatrix(worldRotationMatrix[i]);

					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
					tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

					self.objects[i].quaternion.copy(tempQuaternion);
				}
				else if(self.space === "local")
				{
					point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix[i]));

					tempVector.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix[i]));

					rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
					offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

					quaternionXYZ.setFromRotationMatrix(oldRotationMatrix[i]);

					if(self.snap)
					{
						quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / self.rotationSnap) * self.rotationSnap);
						quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / self.rotationSnap) * self.rotationSnap);
						quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / self.rotationSnap) * self.rotationSnap);
					}
					else
					{
						quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
						quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
						quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
					}

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

					self.objects[i].quaternion.copy(quaternionXYZ);
				}
				else if(self.space === "world")
				{
					rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
					offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));
					tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix[i]));

					if(self.snap)
					{
						quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / self.rotationSnap) * self.rotationSnap);
						quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / self.rotationSnap) * self.rotationSnap);
						quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / self.rotationSnap) * self.rotationSnap);
					}
					else
					{
						quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
						quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
						quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
					}

					quaternionXYZ.setFromRotationMatrix(worldRotationMatrix[i]);

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

					self.objects[i].quaternion.copy(tempQuaternion);
				}
			}
		}

		self.updateScale();
	}

	function onPointerUp()
	{	
		//Add changes made to the editor history
		if(editing)
		{
			if(mode === "translate")
			{
				var actions = [];

				for(var i = 0; i < self.objects.length; i++)
				{
					var object = self.objects[i].position;
					actions.push(new ChangeAction(object, "x", object.x, oldPosition[i].x));
					actions.push(new ChangeAction(object, "y", object.y, oldPosition[i].y));
					actions.push(new ChangeAction(object, "z", object.z, oldPosition[i].z));
				}

				Editor.history.add(new ActionBundle(actions));
			}
			else if(mode === "scale")
			{
				var actions = [];

				for(var i = 0; i < self.objects.length; i++)
				{
					var object = self.objects[i].scale;
					actions.push(new ChangeAction(object, "x", object.x, oldScale[i].x));
					actions.push(new ChangeAction(object, "y", object.y, oldScale[i].y));
					actions.push(new ChangeAction(object, "z", object.z, oldScale[i].z));
				}
				
				Editor.history.add(new ActionBundle(actions));
			}
			else if(mode === "rotate")
			{
				var actions = [];

				for(var i = 0; i < self.objects.length; i++)
				{
					var object = self.objects[i].quaternion;
					actions.push(new ChangeAction(object, "x", object.x, oldQuaternion[i].x));
					actions.push(new ChangeAction(object, "y", object.y, oldQuaternion[i].y));
					actions.push(new ChangeAction(object, "z", object.z, oldQuaternion[i].z));
					actions.push(new ChangeAction(object, "w", object.w, oldQuaternion[i].w));
				}
				
				Editor.history.add(new ActionBundle(actions));
			}
		}

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

TransformControls.prototype.setSize = function(size)
{
	this.size = size;
	this.updateScale();
};

TransformControls.prototype.setSpace = function(space)
{
	this.space = space;
	this.updateScale();
};

TransformControls.prototype.setSnap = function(snap)
{
	this.snap = snap;
};

TransformControls.prototype.setTranslationSnap = function(translationSnap)
{
	this.translationSnap = translationSnap;
};

TransformControls.prototype.setRotationSnap = function(rotationSnap)
{
	this.rotationSnap = rotationSnap;
};
