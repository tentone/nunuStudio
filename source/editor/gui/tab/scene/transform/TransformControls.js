"use strict";

/*
 * TranformControls is used to manipulate object in 3D space.
 *
 * Can be used to manipulate multiple Object3D instances simultaneously.
 *
 * Adapted from original code by arodic (github.com/arodic).
 */
function TransformControls(camera, canvas, mouse)
{
	THREE.Object3D.call(this);

	this.camera = camera;
	this.canvas = canvas;
	this.mouse = mouse;

	this.objects = [];
	this.visible = false;
	this.space = "world";
	this.size = 1;
	this.axis = null;

	this.snap = false;
	this.translationSnap = 1;
	this.rotationSnap = 0.1;

	this.mode = "translate";
	this.dragging = false;
	this.editing = false;

	this.gizmo =
	{
		"translate": new TransformGizmoTranslate(),
		"rotate": new TransformGizmoRotate(),
		"scale": new TransformGizmoScale()
	};

	for(var type in this.gizmo)
	{
		var obj = this.gizmo[type];
		obj.visible = (type === this.mode);
		this.add(obj);
	}

	this.ray = new THREE.Raycaster();
	this.pointerVector = new THREE.Vector2();

	this.point = new THREE.Vector3();
	this.offset = new THREE.Vector3();

	this.toolRotation = new THREE.Vector3();
	this.toolScale = 1;

	this.offsetRotation = new THREE.Vector3();

	this.lookAtMatrix = new THREE.Matrix4();
	this.eye = new THREE.Vector3();
	
	this.camPosition = new THREE.Vector3();
	this.camRotation = new THREE.Euler();

	this.tempMatrix = new THREE.Matrix4();
	this.tempVector = new THREE.Vector3();
	this.tempQuaternion = new THREE.Quaternion();
	this.unitX = new THREE.Vector3(1, 0, 0);
	this.unitY = new THREE.Vector3(0, 1, 0);
	this.unitZ = new THREE.Vector3(0, 0, 1);

	this.quaternionXYZ = new THREE.Quaternion();
	this.quaternionX = new THREE.Quaternion();
	this.quaternionY = new THREE.Quaternion();
	this.quaternionZ = new THREE.Quaternion();
	this.quaternionE = new THREE.Quaternion();

	//Object attributes (per object)
	this.parentRotationMatrix = [];
	this.parentScale = [];
	this.worldRotationMatrix = [];
	this.worldPosition = [];
	this.worldRotation = [];
	this.oldPosition = [];
	this.oldScale = [];
	this.oldQuaternion = [];
	this.oldRotationMatrix = [];
}

TransformControls.prototype = Object.create(THREE.Object3D.prototype);

TransformControls.prototype.setCanvas = function(canvas)
{
	this.canvas = canvas;
};

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

TransformControls.prototype.attach = function(objects)
{
	this.objects = objects;

	//Add more temporary attibutes if necessary
	while(this.oldPosition.length < this.objects.length)
	{
		this.parentRotationMatrix.push(new THREE.Matrix4());
		this.parentScale.push(new THREE.Vector3());
		this.worldRotationMatrix.push(new THREE.Matrix4());
		this.worldPosition.push(new THREE.Vector3());
		this.worldRotation.push(new THREE.Euler());
		this.oldPosition.push(new THREE.Vector3());
		this.oldScale.push(new THREE.Vector3());
		this.oldQuaternion.push(new THREE.Quaternion());
		this.oldRotationMatrix.push(new THREE.Matrix4());
	}

	if(this.objects.length > 0)
	{
		this.visible = true;
		this.updateScale();
	}
	else
	{
		this.visible = false;
	}
};

TransformControls.prototype.detach = function()
{
	this.objects = [];
	this.visible = false;
	this.axis = null;
};

TransformControls.prototype.getMode = function()
{
	return this.mode;
};

TransformControls.prototype.setMode = function(mode)
{
	this.mode = mode;

	//If scale mode force local space
	if(this.mode === "scale")
	{
		this.space = "local";
	}

	//Gizmo visibility
	var found = false;
	for(var type in this.gizmo)
	{
		if(type === this.mode)
		{
			this.gizmo[type].visible = true;
			found = true;
		}
		else
		{
			this.gizmo[type].visible = false;
		}
	}

	this.visible = (found === true && this.objects.length > 0);

	this.updateScale();
};

TransformControls.prototype.setCamera = function(camera)
{
	this.camera = camera;
	this.updateScale();
};

TransformControls.prototype.update = function()
{
	if(this.mouse.buttonJustPressed(Mouse.LEFT))
	{
		this.onPointerDown();
	}
	
	if(this.mouse.buttonJustReleased(Mouse.LEFT))
	{
		this.onPointerUp();
	}

	if(this.mouse.delta.x !== 0 || this.mouse.delta.y !== 0)
	{
		this.onPointerHover();
		this.onPointerMove();
	}

	this.updateScale();

	return this.editing;
};

TransformControls.prototype.updateScale = function()
{
	if(this.objects.length === 0)
	{
		return;
	}

	this.position.set(0, 0, 0);

	for(var i = 0; i < this.objects.length; i++)
	{
		this.worldPosition[i].setFromMatrixPosition(this.objects[i].matrixWorld);
		this.worldRotation[i].setFromRotationMatrix(this.tempMatrix.extractRotation(this.objects[i].matrixWorld));
		this.position.add(this.worldPosition[i]);
	}

	if(this.worldPosition.length > 0)
	{
		this.position.divideScalar(this.worldPosition.length);
	}

	this.camPosition.setFromMatrixPosition(this.camera.matrixWorld);
	this.camRotation.setFromRotationMatrix(this.tempMatrix.extractRotation(this.camera.matrixWorld));

	if(this.camera instanceof THREE.PerspectiveCamera)
	{
		this.toolScale = this.position.distanceTo(this.camPosition) / 6 * this.size;
		this.scale.set(this.toolScale, this.toolScale, this.toolScale);
	}
	else
	{
		this.toolScale = this.camera.size / 6 * this.size;
		this.scale.set(this.toolScale, this.toolScale, this.toolScale);
	}
	
	this.eye.copy(this.camPosition).sub(this.position).normalize();

	if(this.space === "local" || this.mode === "scale")
	{
		this.gizmo[this.mode].update(this.position, this.eye);
	}
	else if(this.space === "world")
	{
		this.gizmo[this.mode].update(new THREE.Euler(), this.eye);
	}

	this.gizmo[this.mode].highlight(this.axis);
};

TransformControls.prototype.onPointerHover = function()
{
	if(this.objects.length === 0 || this.dragging === true) 
	{
		return;
	}

	var intersect = this.intersectObjects(this.gizmo[this.mode].pickers.children);
	var axis = null;

	if(intersect)
	{
		axis = intersect.object.name;
	}

	if(this.axis !== axis)
	{
		this.axis = axis;
		this.updateScale();
	}
};

TransformControls.prototype.onPointerDown = function()
{
	if(this.objects.length === 0 || this.dragging === true) 
	{
		return;
	}

	var intersect = this.intersectObjects(this.gizmo[this.mode].pickers.children);

	if(intersect)
	{
		this.editing = true;
		this.axis = intersect.object.name;
		this.updateScale();

		this.eye.copy(this.camPosition).sub(this.position).normalize();
		this.gizmo[this.mode].setActivePlane(this.axis, this.eye);

		var planeIntersect = this.intersectObjects([this.gizmo[this.mode].activePlane]);
		if(planeIntersect)
		{
			for(var i = 0; i < this.objects.length; i++)
			{
				this.oldPosition[i].copy(this.objects[i].position);
				this.oldScale[i].copy(this.objects[i].scale);
				this.oldQuaternion[i].copy(this.objects[i].quaternion);
				this.oldRotationMatrix[i].extractRotation(this.objects[i].matrix);

				this.worldRotationMatrix[i].extractRotation(this.objects[i].matrixWorld);
				this.parentRotationMatrix[i].extractRotation(this.objects[i].parent.matrixWorld);
				this.parentScale[i].setFromMatrixScale(this.tempMatrix.getInverse(this.objects[i].parent.matrixWorld));
			}

			this.offset.copy(planeIntersect.point);
		}
	}

	this.dragging = true;
};

TransformControls.prototype.onPointerMove = function()
{
	if(this.objects.length === 0 || this.axis === null || this.dragging === false)
	{
		return;
	}

	var planeIntersect = this.intersectObjects([this.gizmo[this.mode].activePlane]);
	if(planeIntersect === false) 
	{
		return;
	}
	
	if(this.mode === "translate")
	{
		for(var i = 0; i < this.objects.length; i++)
		{
			this.point.copy(planeIntersect.point);
			this.point.sub(this.offset);
			this.point.multiply(this.parentScale[i]);

			if(this.axis.search("X") === -1)
			{
				this.point.x = 0;
			}
			if(this.axis.search("Y") === -1) 
			{
				this.point.y = 0;
			}
			if(this.axis.search("Z") === -1)
			{
				this.point.z = 0;
			}
					
			if(this.space === "world" || this.axis.search("XYZ") !== -1)
			{
				this.point.applyMatrix4(this.tempMatrix.getInverse(this.parentRotationMatrix[i]));

				for(var i = 0; i < this.objects.length; i++)
				{
					this.objects[i].position.copy(this.oldPosition[i]);
					this.objects[i].position.add(this.point);
				}
			}
			else if(this.space === "local")
			{
				if(this.axis.length > 1)
				{
					this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix[i]));
					this.point.applyMatrix4(this.oldRotationMatrix[i]);
				}
				else
				{
					this.point.applyMatrix4(this.oldRotationMatrix[i]);
				}

				for(var i = 0; i < this.objects.length; i++)
				{
					this.objects[i].position.copy(this.oldPosition[i]);
					this.objects[i].position.add(this.point);
				}
			}

			if(this.snap)
			{

				if(this.space === "local")
				{
					this.objects[i].position.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix[i]));
				}

				if(this.axis.search("X") !== -1)
				{
					this.objects[i].position.x = Math.round(this.objects[i].position.x / this.translationSnap) * this.translationSnap;
				}
				if(this.axis.search("Y") !== -1)
				{
					this.objects[i].position.y = Math.round(this.objects[i].position.y / this.translationSnap) * this.translationSnap;
				}
				if(this.axis.search("Z") !== -1)
				{
					this.objects[i].position.z = Math.round(this.objects[i].position.z / this.translationSnap) * this.translationSnap;
				}

				if(this.space === "local" )
				{
					this.objects[i].position.applyMatrix4(this.worldRotationMatrix[i]);
				}
			}
		}
	}
	else if(this.mode === "scale")
	{
		for(var i = 0; i < this.objects.length; i++)
		{
			this.point.copy(planeIntersect.point);
			this.point.sub(this.offset);
			this.point.multiply(this.parentScale[i]);

			if(this.axis === "XYZ")
			{
				this.toolScale = 1 + ((this.point.y) / Math.max(this.oldScale[i].x, this.oldScale[i].y, this.oldScale[i].z));

				this.objects[i].scale.copy(this.oldScale[i]);
				this.objects[i].scale.multiplyScalar(this.toolScale);
			}
			else
			{
				this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix[i]));

				if(this.axis === "X")
				{
					this.objects[i].scale.x = this.oldScale[i].x * (1 + this.point.x / this.oldScale[i].x);
				}
				else if(this.axis === "Y")
				{
					this.objects[i].scale.y = this.oldScale[i].y * (1 + this.point.y / this.oldScale[i].y);
				}
				else if(this.axis === "Z")
				{
					this.objects[i].scale.z = this.oldScale[i].z * (1 + this.point.z / this.oldScale[i].z);
				}
			}

			//Update physics objects
			if(this.objects[i] instanceof PhysicsObject)
			{
				var shapes = this.objects[i].body.shapes;
				var scale = this.objects[i].scale;

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
	else if(this.mode === "rotate")
	{
		for(var i = 0; i < this.objects.length; i++)
		{
			this.point.copy(planeIntersect.point);
			this.point.sub(this.worldPosition[i]);
			this.point.multiply(this.parentScale[i]);
			this.tempVector.copy(this.offset).sub(this.worldPosition[i]);
			this.tempVector.multiply(this.parentScale[i]);

			if(this.axis === "E")
			{
				this.point.applyMatrix4(this.tempMatrix.getInverse(this.lookAtMatrix));
				this.tempVector.applyMatrix4(this.tempMatrix.getInverse(this.lookAtMatrix));

				this.toolRotation.set(Math.atan2(this.point.z, this.point.y), Math.atan2(this.point.x, this.point.z), Math.atan2(this.point.y, this.point.x));
				this.offsetRotation.set(Math.atan2(this.tempVector.z, this.tempVector.y), Math.atan2(this.tempVector.x, this.tempVector.z), Math.atan2(this.tempVector.y, this.tempVector.x));

				this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix[i]));

				this.quaternionE.setFromAxisAngle(this.eye, this.toolRotation.z - this.offsetRotation.z);
				this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix[i]);

				this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionE);
				this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ);

				this.objects[i].quaternion.copy(this.tempQuaternion);
			}
			else if(this.axis === "XYZE")
			{
				this.quaternionE.setFromEuler(this.point.clone().cross(this.tempVector).normalize()); // rotation axis

				this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix[i]));
				this.quaternionX.setFromAxisAngle(this.quaternionE, - this.point.clone().angleTo(this.tempVector));
				this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix[i]);

				this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionX);
				this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ);

				this.objects[i].quaternion.copy(this.tempQuaternion);
			}
			else if(this.space === "local")
			{
				this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix[i]));

				this.tempVector.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix[i]));

				this.toolRotation.set(Math.atan2(this.point.z, this.point.y), Math.atan2(this.point.x, this.point.z), Math.atan2(this.point.y, this.point.x));
				this.offsetRotation.set(Math.atan2(this.tempVector.z, this.tempVector.y), Math.atan2(this.tempVector.x, this.tempVector.z), Math.atan2(this.tempVector.y, this.tempVector.x));

				this.quaternionXYZ.setFromRotationMatrix(this.oldRotationMatrix[i]);

				if(this.snap)
				{
					this.quaternionX.setFromAxisAngle(this.unitX, Math.round((this.toolRotation.x - this.offsetRotation.x) / this.rotationSnap) * this.rotationSnap);
					this.quaternionY.setFromAxisAngle(this.unitY, Math.round((this.toolRotation.y - this.offsetRotation.y) / this.rotationSnap) * this.rotationSnap);
					this.quaternionZ.setFromAxisAngle(this.unitZ, Math.round((this.toolRotation.z - this.offsetRotation.z) / this.rotationSnap) * this.rotationSnap);
				}
				else
				{
					this.quaternionX.setFromAxisAngle(this.unitX, this.toolRotation.x - this.offsetRotation.x);
					this.quaternionY.setFromAxisAngle(this.unitY, this.toolRotation.y - this.offsetRotation.y);
					this.quaternionZ.setFromAxisAngle(this.unitZ, this.toolRotation.z - this.offsetRotation.z);
				}

				if(this.axis === "X")
				{
					this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionX);
				}
				else if(this.axis === "Y")
				{
					this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionY);
				}
				else if(this.axis === "Z")
				{
					this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionZ);
				}

				this.objects[i].quaternion.copy(this.quaternionXYZ);
			}
			else if(this.space === "world")
			{
				this.toolRotation.set(Math.atan2(this.point.z, this.point.y), Math.atan2(this.point.x, this.point.z), Math.atan2(this.point.y, this.point.x));
				this.offsetRotation.set(Math.atan2(this.tempVector.z, this.tempVector.y), Math.atan2(this.tempVector.x, this.tempVector.z), Math.atan2(this.tempVector.y, this.tempVector.x));
				this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix[i]));

				if(this.snap)
				{
					this.quaternionX.setFromAxisAngle(this.unitX, Math.round((this.toolRotation.x - this.offsetRotation.x) / this.rotationSnap) * this.rotationSnap);
					this.quaternionY.setFromAxisAngle(this.unitY, Math.round((this.toolRotation.y - this.offsetRotation.y) / this.rotationSnap) * this.rotationSnap);
					this.quaternionZ.setFromAxisAngle(this.unitZ, Math.round((this.toolRotation.z - this.offsetRotation.z) / this.rotationSnap) * this.rotationSnap);
				}
				else
				{
					this.quaternionX.setFromAxisAngle(this.unitX, this.toolRotation.x - this.offsetRotation.x);
					this.quaternionY.setFromAxisAngle(this.unitY, this.toolRotation.y - this.offsetRotation.y);
					this.quaternionZ.setFromAxisAngle(this.unitZ, this.toolRotation.z - this.offsetRotation.z);
				}

				this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix[i]);

				if(this.axis === "X")
				{
					this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionX);
				}
				else if(this.axis === "Y")
				{
					this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionY);
				}
				else if(this.axis === "Z")
				{
					this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionZ);
				}

				this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ);

				this.objects[i].quaternion.copy(this.tempQuaternion);
			}
		}
	}

	this.updateScale();
};

TransformControls.prototype.onPointerUp = function()
{	
	//Add changes made to the editor history
	if(this.editing)
	{
		if(this.mode === "translate")
		{
			var actions = [];

			for(var i = 0; i < this.objects.length; i++)
			{
				var object = this.objects[i].position;
				actions.push(new ChangeAction(object, "x", object.x, this.oldPosition[i].x));
				actions.push(new ChangeAction(object, "y", object.y, this.oldPosition[i].y));
				actions.push(new ChangeAction(object, "z", object.z, this.oldPosition[i].z));
			}

			Editor.history.add(new ActionBundle(actions));
		}
		else if(this.mode === "scale")
		{
			var actions = [];

			for(var i = 0; i < this.objects.length; i++)
			{
				var object = this.objects[i].scale;
				actions.push(new ChangeAction(object, "x", object.x, this.oldScale[i].x));
				actions.push(new ChangeAction(object, "y", object.y, this.oldScale[i].y));
				actions.push(new ChangeAction(object, "z", object.z, this.oldScale[i].z));
			}
			
			Editor.history.add(new ActionBundle(actions));
		}
		else if(this.mode === "rotate")
		{
			var actions = [];

			for(var i = 0; i < this.objects.length; i++)
			{
				var object = this.objects[i].quaternion;
				actions.push(new ChangeAction(object, "x", object.x, this.oldQuaternion[i].x));
				actions.push(new ChangeAction(object, "y", object.y, this.oldQuaternion[i].y));
				actions.push(new ChangeAction(object, "z", object.z, this.oldQuaternion[i].z));
				actions.push(new ChangeAction(object, "w", object.w, this.oldQuaternion[i].w));
			}
			
			Editor.history.add(new ActionBundle(actions));
		}
	}

	this.editing = false;
	this.dragging = false;
	this.onPointerHover();
};

TransformControls.prototype.intersectObjects = function(objects)
{
	var rect = this.canvas.getBoundingClientRect();
	var x = this.mouse.position.x / rect.width;
	var y = this.mouse.position.y / rect.height;

	this.pointerVector.set((x * 2) - 1, - (y * 2) + 1);
	this.ray.setFromCamera(this.pointerVector, this.camera);

	var intersections = this.ray.intersectObjects(objects, true);
	return intersections.length > 0 ? intersections[0] : false;
};
