import {Mouse} from "../../../../../core/input/Mouse.js";
import {TransformGizmoTranslate} from "./gizmo/TransformGizmoTranslate.js";
import {TransformGizmoScale} from "./gizmo/TransformGizmoScale.js";
import {TransformGizmoRotate} from "./gizmo/TransformGizmoRotate.js";
import {TransformGizmo} from "./gizmo/TransformGizmo.js";
import {Camera, Object3D, Raycaster, Vector2, Vector3, Matrix4, Euler, Quaternion, PerspectiveCamera} from "three";

/*
 * TranformControls is used to manipulate object in 3D space. It can be used to manipulate multiple Object3D instances simultaneously.
 *
 * The objects are transformed by Gizmos managed by the transform controls object, gizmos may be compatible with multiple types of objects (Object3D, Vector3, etc).
 *
 * @class TransformControls
 * @author arodic (github.com/arodic)
 * @param {Camera} camera
 * @param {Canvas} canvas
 * @param {Mouse} mouse
 */
function TransformControls(camera, canvas, mouse)
{
	Object3D.call(this);

	this.visible = false;

	/**
	 * View camera, the controls scale and behavior is calculated relative to the camera.
	 *
	 * The rotation and direction of the camera affects the appearence of the gizmos and the vectors applied to transform objects.
	 *
	 * Booth perspective or orthographic cameras are supported.
	 * 
	 * @attribute camera
	 * @type {Camera}
	 */
	this.camera = camera;

	/**
	 * DOM canvas where the scene is rendererd.
	 *
	 * Mouse input is calculated relative to this canvas position on screen.
	 *
	 * @attribute canvas
	 * @type {DOM} 
	 */
	this.canvas = canvas;
	
	/**
	 * Mouse to get user input from. Should be updated before updating the controls.
	 *
	 * @attribute mouse
	 * @type {Mouse}
	 */
	this.mouse = mouse;

	/**
	 * Object currently attached to the transform controls.
	 *
	 * @attribute objects
	 * @type {Array}
	 */
	this.objects = [];

	/**
	 * Object transform attributes for each selected object.
	 *
	 * Can be reused between selected objects.
	 *
	 * @attribute attributes
	 * @type {Array} 
	 */
	this.attributes = [];

	/**
	 * Transformation space defines how the transformations are applied.
	 *
	 * If set to WORLD the transformations are applied on the world referential.
	 *
	 * If set to LOCAL the transformations are applied relative to the object current transform
	 *
	 * After chaging 
	 *
	 * @attribute space
	 * @type {number}
	 */
	this.space = TransformControls.WORLD;

	/**
	 * Scale of the transform gizmo.
	 *
	 * Size of the gizmos is adjusted relative to the view camera distance.*
	 *
	 * @attribute size
	 * @type {number}
	 */
	this.size = 1;

	/**
	 * Axis of transformation selected stored as text. (e.g X, Y, Z).
	 *
	 * Can be a combination of multiple axis (e.g XYZ, XZ, etc)
	 *
	 * @attribute axis
	 * @type {string}
	 */
	this.axis = null;

	/**
	 * If set true the value set by the transform is always multiple of the snap ratio.
	 *
	 * Snap ratios are different for each transform gizmo.
	 *
	 * @attribute snap
	 * @type {boolean}
	 */
	this.snap = false;

	/**
	 * Snap ratio applies to translation transform.
	 *
	 * @attribute translationSnap
	 * @type {number}
	 */
	this.translationSnap = 1.0;

	/**
	 * Snap ratio applies to rotation transform.
	 *
	 * @attribute rotationSnap
	 * @type {number}
	 */
	this.rotationSnap = 0.1;

	/**
	 * Mode indicates the gizmo currently being used.
	 *
	 * @attribute mode
	 * @type {string}
	 */
	this.mode = TransformControls.TRANSLATE;

	/**
	 * If set true the pointer is currently being dragged around.
	 *
	 * @attribute dragging
	 * @type {boolean}
	 */
	this.dragging = false;

	/**
	 * If set true a object is currently being edited.
	 *
	 * @attribute editing
	 * @type {boolean}
	 */
	this.editing = false;

	/**
	 * Gizmo tools currenctly in use to edit the object.
	 *
	 * Defines what and how the attribute of the object is manipulated.
	 *
	 * @attribute gizmo
	 * @type {TransformGizmo}
	 */
	this.gizmo = new TransformGizmo();

	/**
	 * Raycaster object used to pick the gizmo sections.
	 *
	 * @attribute raycaster
	 * @type {Raycaster}
	 */
	this.raycaster = new Raycaster();

	/**
	 * Normalized vector containing the pointer coordinates used with the raycaster.
	 *
	 * @attribute pointerVector
	 * @type {Vector2}
	 */
	this.pointerVector = new Vector2();

	this.point = new Vector3();
	this.offset = new Vector3();

	this.toolRotation = new Vector3();
	this.toolScale = 1;
	this.offsetRotation = new Vector3();

	/**
	 * View and projection matrix combined.
	 *
	 * @attribute lookAtMatrix
	 * @type {Matrix4}
	 */
	this.lookAtMatrix = new Matrix4();

	/**
	 * Camera normalized direction vector relative to the selected object.
	 *
	 * @attribute eye
	 * @type {Vector3}
	 */
	this.eye = new Vector3();
	
	/**
	 * View camera position.
	 *
	 * @attribute camPosition
	 * @type {Vector3}
	 */
	this.camPosition = new Vector3();

	/**
	 * View camera rotation.
	 *
	 * @attribute camRotation
	 * @type {Vector3}
	 */
	this.camRotation = new Euler();

	// Temporary variables used for runtime calcs
	this.tempMatrix = new Matrix4();
	this.tempVector = new Vector3();
	this.tempQuaternion = new Quaternion();
	this.unitX = new Vector3(1, 0, 0);
	this.unitY = new Vector3(0, 1, 0);
	this.unitZ = new Vector3(0, 0, 1);
	this.quaternionXYZ = new Quaternion();
	this.quaternionX = new Quaternion();
	this.quaternionY = new Quaternion();
	this.quaternionZ = new Quaternion();
	this.quaternionE = new Quaternion();
}

/**
 * Attributes that need to be stored for each object to keep their transform state.
 *
 * Each selected object has one state.
 *
 * @class TransformControlAtttributes
 */
function TransformControlAtttributes()
{
	this.parentRotationMatrix = new Matrix4();
	this.parentScale = new Vector3();
	this.worldRotationMatrix = new Matrix4();
	this.worldPosition = new Vector3();
	this.worldRotation = new Euler();
	this.oldPosition = new Vector3();
	this.oldScale = new Vector3();
	this.oldQuaternion = new Quaternion();
	this.oldRotationMatrix = new Matrix4();
}

TransformControls.NONE = "none";
TransformControls.TRANSLATE = "translate";
TransformControls.ROTATE = "rotate";
TransformControls.SCALE = "scale";

TransformControls.LOCAL = "local";
TransformControls.WORLD = "world";

TransformControls.prototype = Object.create(Object3D.prototype);

/**
 * Attach a list of objects to the transform controls.
 *
 * @method attach
 * @param {Array} objects Array of objects to be attached.
 */
TransformControls.prototype.attach = function(objects)
{
	this.objects = [];

	for(var i = 0; i < objects.length; i++)
	{
		if(objects[i].isObject3D && !objects[i].locked && objects[i].parent !== null)
		{
			this.objects.push(objects[i]);
		}
	}

	// Add more temporary attributes if necessary
	while(this.attributes.length < this.objects.length)
	{
		this.attributes.push(new TransformControlAtttributes());
	}

	if(this.objects.length > 0)
	{
		this.updatePose();
	}
	else
	{
		this.clear();
	}
};

/**
 * Detach/clear all objects attached to the transform controls.
 * 
 * @method clear
 */
TransformControls.prototype.clear = function()
{
	this.objects = [];
	this.visible = false;
	this.axis = null;
};

/**
 * Set canvas where the scene is being rendered.
 *
 * @method setCanvas
 * @param {DOM} canvas Canvas element.
 */
TransformControls.prototype.setCanvas = function(canvas)
{
	this.canvas = canvas;
};

/**
 * Set the transform gizmo to be used by the transform controls.
 *
 * @method setMode
 * @param {string} mode Name of the gizmo to be activated.
 */
TransformControls.prototype.setMode = function(mode)
{
	if(this.mode === mode)
	{
		return;
	}

	this.mode = mode;

	// Remove old gizmo
	if(this.gizmo !== null)
	{
		if(this.gizmo.dismiss !== undefined)
		{
			this.gizmo.dismiss();
		}

		this.remove(this.gizmo);
		this.gizmo = null;
	}

	// Create gizmo for the mode selected
	if(this.mode === TransformControls.TRANSLATE)
	{
		this.gizmo = new TransformGizmoTranslate();
	}
	else if(this.mode === TransformControls.ROTATE)
	{
		this.gizmo = new TransformGizmoRotate();
	}
	else if(this.mode === TransformControls.SCALE)
	{
		// If scale mode force local space
		this.space = TransformControls.LOCAL;
		this.gizmo = new TransformGizmoScale();
	}

	if(this.gizmo !== null)
	{
		this.add(this.gizmo);
	}


	this.visible = this.objects.length > 0;
};

/**
 * Update the controls using mouse input provided takes camera of all the functionality of the controls.
 *
 * Should be called every frame to update the controls state.
 *
 * @method update
 */
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

	this.updatePose();

	return this.editing;
};

/**
 * Update the pose and transform of the controls and gizmos based on the selected objects and view camera.
 *
 * @method updatePose
 */
TransformControls.prototype.updatePose = function()
{
	if(this.objects.length === 0 || this.gizmo === null)
	{
		return;
	}

	this.visible = true;

	// Calculate position from the avegare of all selected objects.
	this.position.set(0, 0, 0);
	for(var i = 0; i < this.objects.length; i++)
	{
		this.attributes[i].worldPosition.setFromMatrixPosition(this.objects[i].matrixWorld);
		this.attributes[i].worldRotation.setFromRotationMatrix(this.tempMatrix.extractRotation(this.objects[i].matrixWorld));
		this.position.add(this.attributes[i].worldPosition);
	}

	if(this.objects.length > 0)
	{
		this.position.divideScalar(this.objects.length);
	}

	// Get camera rotation and position
	this.camPosition.setFromMatrixPosition(this.camera.matrixWorld);
	this.camRotation.setFromRotationMatrix(this.tempMatrix.extractRotation(this.camera.matrixWorld));

	// Set controls scale based of camera dsitance to object
	if(this.camera instanceof PerspectiveCamera)
	{
		this.toolScale = this.position.distanceTo(this.camPosition) / 6 * this.size;
		this.scale.set(this.toolScale, this.toolScale, this.toolScale);
	}
	else
	{
		this.toolScale = this.camera.size / 6 * this.size;
		this.scale.set(this.toolScale, this.toolScale, this.toolScale);
	}
		
	// Camera direction vector
	this.eye.copy(this.camPosition).sub(this.position).normalize();

	// Update gizmo specific pose
	this.gizmo.updatePose(this);
};

/**
 * Check if the pointer if over any of the picker objects.
 *
 * If it is set the axis to the picker object detected.
 *
 * @method onPointerHover
 */
TransformControls.prototype.onPointerHover = function()
{
	if(this.objects.length === 0 || this.dragging === true || this.gizmo === null)
	{
		return;
	}

	var intersect = this.intersectObjects(this.gizmo.pickers.children);
	if(intersect)
	{
		var axis = intersect.object.name;
		if(this.axis !== axis)
		{
			this.axis = axis;
		}
	}
	else
	{
		this.axis = null;
	}
};

TransformControls.prototype.onPointerDown = function()
{
	if(this.objects.length === 0 || this.dragging === true || this.gizmo === null)
	{
		return;
	}

	var intersect = this.intersectObjects(this.gizmo.pickers.children);
	if(intersect)
	{
		this.editing = true;
		this.axis = intersect.object.name;

		this.updatePose();

		this.eye.copy(this.camPosition).sub(this.position).normalize();
		this.gizmo.setActivePlane(this.axis, this.eye);

		var planeIntersect = this.intersectObjects([this.gizmo.activePlane]);
		if(planeIntersect)
		{
			for(var i = 0; i < this.objects.length; i++)
			{
				this.attributes[i].oldPosition.copy(this.objects[i].position);
				this.attributes[i].oldScale.copy(this.objects[i].scale);
				this.attributes[i].oldQuaternion.copy(this.objects[i].quaternion);
				this.attributes[i].oldRotationMatrix.extractRotation(this.objects[i].matrix);
				this.attributes[i].worldRotationMatrix.extractRotation(this.objects[i].matrixWorld);
				this.attributes[i].parentRotationMatrix.extractRotation(this.objects[i].parent.matrixWorld);
				this.attributes[i].parentScale.setFromMatrixScale(this.tempMatrix.getInverse(this.objects[i].parent.matrixWorld));
			}

			this.offset.copy(planeIntersect.point);
		}

		this.gizmo.startTransform(this);
	}

	this.dragging = true;
};

/**
 * Called whenever the mouse is moved inside of the canvas.
 *
 * Constantly recaulculates the transforms being applied.
 *
 * @method onPointerMove
 */
TransformControls.prototype.onPointerMove = function()
{
	if(this.objects.length === 0 || this.axis === null || this.dragging === false || this.gizmo === null)
	{
		return;
	}

	this.gizmo.transformObject(this)
};

/**
 * Method called when user input button is released.
 *
 * Changes made to the object are added to the editor action history.
 * 
 * @method onPointerUp
 */
TransformControls.prototype.onPointerUp = function()
{
	if(this.editing)
	{
		this.gizmo.applyChanges(this);
	}

	this.editing = false;
	this.dragging = false;
};

/**
 * Check if the mouse is currently intersecting objects inside of the canvas.
 *
 * @method intersectObjects
 * @param {Array} objects Object to be tested.
 * @return {Object} Object intersected is any, false otherwise.
 */
TransformControls.prototype.intersectObjects = function(objects)
{
	var rect = this.canvas.getBoundingClientRect();
	var x = this.mouse.position.x / rect.width;
	var y = this.mouse.position.y / rect.height;

	this.pointerVector.set((x * 2) - 1, - (y * 2) + 1);
	this.raycaster.setFromCamera(this.pointerVector, this.camera);

	var intersections = this.raycaster.intersectObjects(objects, true);

	return intersections.length > 0 ? intersections[0] : false;
};

export {TransformControls};