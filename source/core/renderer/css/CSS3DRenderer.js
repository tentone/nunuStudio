import {Vector2, Matrix4, Scene, Camera} from "three";

/**
 * 3D renderer using DOM elements.
 *
 * Applies the threejs transformation hierarchy to the DOM element using CSS3D.
 *
 * Only renders CSS specific objects, the output of the renderer is not combined with the WebGL output. Everything is renderer of top.
 *
 * Based on the three.js adaptation (mrdoob, yomotsu) of http:// www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * 
 * @class CSS3DRenderer
 * @param {Component} domElement DOM division to place rendered objects.
 */
function CSS3DRenderer(domElement)
{
	/**
	 * Size of the renderer viewport.
	 *
	 * @attribute size
	 * @type {Vector2}
	 */
	this.size = new Vector2(2, 2);

	/**
	 * Size of the renderer viewport.
	 *
	 * @attribute size
	 * @type {Vector2}
	 */
	this.halfSize = new Vector2(1, 1);

	/**
	 * Temporary matrix object.
	 *
	 * @attribute matrix
	 * @type {Matrix4}
	 */
	this.matrix = new Matrix4();

	/**
	 * Object cache, used to store the rendered objects state.
	 *
	 * @attribute cache
	 * @type {Object}
	 */
	this.cache =
	{
		camera: {fov: 0, style: ""},
		objects: new WeakMap()
	};

	/**
	 * Main DOM element used for the renderer.
	 *
	 * @attribute domElement
	 * @type {Element}
	 */
	this.domElement = domElement !== undefined ? domElement : document.createElement("div");
	this.domElement.style.overflow = "hidden";
	this.domElement.style.pointerEvents = "none";

	/**
	 * Camera projected DOM element.
	 *
	 * @attribute domElement
	 * @type {Element}
	 */
	this.cameraElement = document.createElement("div");
	this.cameraElement.style.WebkitTransformStyle = "preserve-3d";
	this.cameraElement.style.transformStyle = "preserve-3d";
	this.domElement.appendChild(this.cameraElement);
};

/**
 * Get the size of the renderer.
 *
 * @method getSize
 */
CSS3DRenderer.prototype.getSize = function()
{
	return {width: this.size.x, height: this.size.y};
};

/**
 * Set the size of the renderer.
 *
 * The size is also applie to the internal DOM division.
 *
 * @method setSize
 * @param {number} width
 * @param {number} height
 */
CSS3DRenderer.prototype.setSize = function(width, height)
{
	this.size.set(width, height);
	this.halfSize.set(width / 2, height / 2);

	this.domElement.style.width = width + "px";
	this.domElement.style.height = height + "px";
	this.cameraElement.style.width = width + "px";
	this.cameraElement.style.height = height + "px";
};

/**
 * Render the CSS object of a scene using a camera.
 *
 * @method render
 * @param {Scene} scene Scene to be rendered.
 * @param {Camera} camera Camera used to render the scene.
 */
CSS3DRenderer.prototype.render = function(scene, camera)
{
	// Get the camera transform as a css 3D string
	function getCameraCSSMatrix(matrix)
	{
		var elements = matrix.elements;

		return "matrix3d(" +
			elements[0] + "," +
			(-elements[1]) + "," +
			elements[2] + "," +
			elements[3] + "," +
			elements[4] + "," +
			(-elements[5]) + "," +
			elements[6] + "," +
			elements[7] + "," +
			elements[8] + "," +
			(-elements[9]) + "," +
			elements[10] + "," +
			elements[11] + "," +
			elements[12] + "," +
			(-elements[13]) + "," +
			elements[14] + "," +
			elements[15] +
		")";
	}

	// Get the object transform as a css 3D string
	function getObjectCSSMatrix(matrix, cameraCSSMatrix)
	{
		var elements = matrix.elements;
		
		return "translate(-50%,-50%)matrix3d(" +
			elements[0] + "," +
			elements[1] + "," +
			elements[2] + "," +
			elements[3] + "," +
			(-elements[4]) + "," +
			(-elements[5]) + "," +
			(-elements[6]) + "," +
			(-elements[7]) + "," +
			elements[8] + "," +
			elements[9] + "," +
			elements[10] + "," +
			elements[11] + "," +
			elements[12] + "," +
			elements[13] + "," +
			elements[14] + "," +
			elements[15] +
		")";
	}

	var self = this;

	// Auxiliar method to render a single object
	function renderObject(object, camera, cameraCSSMatrix)
	{
		// Render only CSS objects
		if(object.isCSS3DObject === true)
		{
			// Store the css transformation style value
			var style;

			// Remove rotation from the transformation matrix for Sprites
			if(object.isCSS3DSprite === true)
			{
				matrix.copy(camera.matrixWorldInverse);
				matrix.transpose();
				matrix.copyPosition(object.matrixWorld);
				matrix.scale(object.scale);

				matrix.elements[3] = 0;
				matrix.elements[7] = 0;
				matrix.elements[11] = 0;
				matrix.elements[15] = 1;

				style = getObjectCSSMatrix(matrix, cameraCSSMatrix);
			}
			else
			{
				style = getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix);
			}

			var element = object.element;
			var cachedObject = self.cache.objects.get(object);

			// Add the DOM element to the cache
			if(cachedObject === undefined || cachedObject.style !== style)
			{
				element.style.WebkitTransform = style;
				element.style.transform = style;
				self.cache.objects.set(object, {style: style});
			}

			// If the DOM element does not have a parend add to the cameraElement division
			if(element.parentNode !== self.cameraElement)
			{
				self.cameraElement.appendChild(element);
			}
		}

		// Render children object
		for(var i = 0, l = object.children.length; i < l; i++)
		{
			renderObject(object.children[i], camera, cameraCSSMatrix);
		}
	}

	// Get the effective camera fov from the projection matrix
	var fov = camera.projectionMatrix.elements[5] * this.halfSize.y;

	// If the camera fov is diferrent from the cached one ajust values.
	if(this.cache.camera.fov !== fov)
	{
		if(camera.isPerspectiveCamera)
		{
			this.domElement.style.WebkitPerspective = fov + "px";
			this.domElement.style.perspective = fov + "px";
		}

		this.cache.camera.fov = fov;
	}

	// Update the scene world matrix
	scene.updateMatrixWorld();

	// Update the camera world matrix
	if(camera.parent === null)
	{
		camera.updateMatrixWorld();
	}

	var cameraCSSMatrix;

	// Orthographic camera matrix
	if(camera.isOrthographicCamera)
	{
		var tx = -(camera.right + camera.left) / 2;
		var ty = (camera.top + camera.bottom) / 2;

		cameraCSSMatrix = "scale(" + fov + ")" + "translate(" + tx + "px," + ty + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse);
	}
	// Perpective camera matrix
	else
	{
		cameraCSSMatrix = "translateZ(" + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse);
	}

	var style = cameraCSSMatrix + "translate(" + this.halfSize.x + "px," + this.halfSize.y + "px)";

	// If the style is diferent from cache ajust style
	if(this.cache.camera.style !== style)
	{
		this.cameraElement.style.WebkitTransform = style;
		this.cameraElement.style.transform = style;
		this.cache.camera.style = style;
	}

	// Render scene recursively
	renderObject(scene, camera, cameraCSSMatrix);
};

export {CSS3DRenderer};