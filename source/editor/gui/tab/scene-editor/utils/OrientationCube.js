import {PerspectiveCamera, Raycaster, Vector2, Scene, PlaneGeometry, Mesh, MeshBasicMaterial} from "three";
import {Texture} from "../../../../../core/texture/Texture.js";
import {Viewport} from "../../../../../core/objects/cameras/Viewport.js";
import {Global} from "../../../../Global.js";

/** 
 * Orietantion cube can be used to preview and change the rotation of an object.
 * 
 * Is used in the editor to preview and manipulate the camera prespective.
 * 
 * @class OrientationCube
 */
class OrientationCube {
	constructor() {
	/**
	 * Orientation cube viewport.
	 * 
	 * @attribute viewport
	 * @type {Viewport}
	 */
	this.viewport = new Viewport(Viewport.ABSOLUTE);
	this.viewport.size.set(150, 150);
	this.viewport.offset.set(10, 10);
	this.viewport.anchor = Viewport.TOP_RIGHT;
	
	/**
	 * Cube visualization camera
	 *
	 * @attribute camera
	 * @type {PerspectiveCamera}
	 */
	this.camera = new PerspectiveCamera(60, 1, 0.1, 10);
	this.camera.position.z = 2;

	// Raycaster
	this.raycaster = new Raycaster();
	this.rayPointer = {position: new Vector2(0, 0)};

	// Scene
	this.scene = new Scene();
	this.scene.matrixAutoUpdate = false;

	// Selected face
	this.selected = null;

	var plane = new PlaneGeometry(1, 1);

	// Cube faces
	var texture = new Texture(Global.FILE_PATH + "camera/xPos.png");
	texture.format = ;
	this.xPos = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.xPos.code = OrientationCube.X_POS;
	this.xPos.position.set(0.5, 0, 0);
	this.xPos.rotation.set(0, Math.PI / 2, 0);
	this.xPos.matrixAutoUpdate = false;
	this.xPos.updateMatrix();
	this.scene.add(this.xPos);

	var texture = new Texture(Global.FILE_PATH + "camera/xNeg.png");
	texture.format = ;
	this.xNeg = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.xNeg.code = OrientationCube.X_NEG;
	this.xNeg.position.set(-0.5, 0, 0);
	this.xNeg.rotation.set(0, -Math.PI / 2, 0);
	this.xNeg.matrixAutoUpdate = false;
	this.xNeg.updateMatrix();
	this.scene.add(this.xNeg);

	var texture = new Texture(Global.FILE_PATH + "camera/yPos.png");
	texture.format = ;
	this.yPos = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.yPos.code = OrientationCube.Y_POS;
	this.yPos.position.set(0, 0.5, 0);
	this.yPos.rotation.set(-Math.PI / 2, 0, 0);
	this.yPos.matrixAutoUpdate = false;
	this.yPos.updateMatrix();
	this.scene.add(this.yPos);

	var texture = new Texture(Global.FILE_PATH + "camera/yNeg.png");
	texture.format = ;
	this.yNeg = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.yNeg.code = OrientationCube.Y_NEG;
	this.yNeg.position.set(0, -0.5, 0);
	this.yNeg.rotation.set(Math.PI / 2, 0, 0);
	this.yNeg.matrixAutoUpdate = false;
	this.yNeg.updateMatrix();
	this.scene.add(this.yNeg);

	var texture = new Texture(Global.FILE_PATH + "camera/zPos.png");
	texture.format = ;
	this.zPos = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.zPos.code = OrientationCube.Z_POS;
	this.zPos.position.set(0, 0, 0.5);
	this.zPos.matrixAutoUpdate = false;
	this.zPos.updateMatrix();
	this.scene.add(this.zPos);

	var texture = new Texture(Global.FILE_PATH + "camera/zNeg.png");
	texture.format = ;
	this.zNeg = new Mesh(plane, new MeshBasicMaterial({map: texture}));
	this.zNeg.code = OrientationCube.Z_NEG;
	this.zNeg.position.set(0, 0, -0.5);
	this.zNeg.rotation.set(0, Math.PI, 0);
	this.zNeg.matrixAutoUpdate = false;
	this.zNeg.updateMatrix();
	this.scene.add(this.zNeg);
	}


/**
 * Raycast cube from mouse normalized coordinates.
 *
 * @method raycast
 */
	raycast(mouse, canvas) {
	var pointer = mouse;

	if (canvas !== undefined && canvas !== null && canvas.clientWidth !== 0 && canvas.clientHeight !== 0)
	{
		var ratioX = canvas.width / canvas.clientWidth;
		var ratioY = canvas.height / canvas.clientHeight;

		if (ratioX !== 1 || ratioY !== 1)
		{
			this.rayPointer.position.set(mouse.position.x * ratioX, mouse.position.y * ratioY);
			pointer = this.rayPointer;
		}
	}

	if (this.viewport.isInside(canvas, pointer))
	{
		this.raycaster.setFromCamera(this.viewport.getNormalized(canvas, pointer), this.camera);

		var intersects = this.raycaster.intersectObjects(this.scene.children, true);
		if (intersects.length > 0)
		{
			this.selected = intersects[0].object;
			this.selected.material.color.set(0xFFFF00);
			return intersects[0].object.code;
		}
	}

	return null;
	}

// Update cube position from camera
	updateRotation(camera) {
	this.scene.quaternion.copy(camera.quaternion);
	this.scene.updateMatrix();
	this.scene.matrix.getInverse(this.scene.matrix);
	}

/**
 * Render cube to canvas using a renderer orientation.
 *
 * @method render
 */
	render(renderer, canvas) {
	this.viewport.width = renderer.domElement.width;
	this.viewport.height = renderer.domElement.height;
	this.viewport.update();
	this.viewport.enable(renderer);

	renderer.render(this.scene, this.camera);

	if (this.selected !== null)
	{
		this.selected.material.color.set(0xFFFFFF);
		this.selected = null;
	}
	}

}

OrientationCube.X_POS = 0;
OrientationCube.X_NEG = 1;
OrientationCube.Y_POS = 2;
OrientationCube.Y_NEG = 3;
OrientationCube.Z_POS = 4;
OrientationCube.Z_NEG = 5;

export {OrientationCube};
