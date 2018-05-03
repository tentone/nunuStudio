"use strict";

function OrientationCube()
{
	//Viewport
	this.size = new THREE.Vector2(150, 150);

	//Camera
	this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
	this.camera.position.z = 2;

	//Raycaster
	this.raycaster = new THREE.Raycaster();
	this.normalized = new THREE.Vector2(0, 0);

	//Scene
	this.scene = new THREE.Scene();
	this.scene.matrixAutoUpdate = false;

	//Selected face
	this.selected = null;

	var plane = new THREE.PlaneBufferGeometry(1, 1);

	//Cube faces
	var texture = new Texture(Editor.filePath + "camera/xPos.png");
	texture.format = THREE.RGBFormat;
	this.xPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.xPos.code = OrientationCube.X_POS;
	this.xPos.position.set(0.5, 0, 0);
	this.xPos.rotation.set(0, Math.PI / 2, 0);
	this.xPos.matrixAutoUpdate = false;
	this.xPos.updateMatrix();
	this.scene.add(this.xPos);

	var texture = new Texture(Editor.filePath + "camera/xNeg.png");
	texture.format = THREE.RGBFormat;
	this.xNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.xNeg.code = OrientationCube.X_NEG;
	this.xNeg.position.set(-0.5, 0, 0);
	this.xNeg.rotation.set(0, -Math.PI / 2, 0);
	this.xNeg.matrixAutoUpdate = false;
	this.xNeg.updateMatrix();
	this.scene.add(this.xNeg);

	var texture = new Texture(Editor.filePath + "camera/yPos.png");
	texture.format = THREE.RGBFormat;
	this.yPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.yPos.code = OrientationCube.Y_POS;
	this.yPos.position.set(0, 0.5, 0);
	this.yPos.rotation.set(-Math.PI / 2, 0, 0);
	this.yPos.matrixAutoUpdate = false;
	this.yPos.updateMatrix();
	this.scene.add(this.yPos);

	var texture = new Texture(Editor.filePath + "camera/yNeg.png");
	texture.format = THREE.RGBFormat;
	this.yNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.yNeg.code = OrientationCube.Y_NEG;
	this.yNeg.position.set(0, -0.5, 0);
	this.yNeg.rotation.set(Math.PI / 2, 0, 0);
	this.yNeg.matrixAutoUpdate = false;
	this.yNeg.updateMatrix();
	this.scene.add(this.yNeg);

	var texture = new Texture(Editor.filePath + "camera/zPos.png");
	texture.format = THREE.RGBFormat;
	this.zPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.zPos.code = OrientationCube.Z_POS;
	this.zPos.position.set(0, 0, 0.5);
	this.zPos.matrixAutoUpdate = false;
	this.zPos.updateMatrix();
	this.scene.add(this.zPos);

	var texture = new Texture(Editor.filePath + "camera/zNeg.png");
	texture.format = THREE.RGBFormat;
	this.zNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: texture}));
	this.zNeg.code = OrientationCube.Z_NEG;
	this.zNeg.position.set(0, 0, -0.5);
	this.zNeg.rotation.set(0, Math.PI, 0);
	this.zNeg.matrixAutoUpdate = false;
	this.zNeg.updateMatrix();
	this.scene.add(this.zNeg);
}

OrientationCube.X_POS = 0;
OrientationCube.X_NEG = 1;
OrientationCube.Y_POS = 2;
OrientationCube.Y_NEG = 3;
OrientationCube.Z_POS = 4;
OrientationCube.Z_NEG = 5;

//Raycast cube from mouse normalized coordinates
OrientationCube.prototype.raycast = function(mouse, canvas)
{
	var x = canvas.width - this.size.x;

	if(mouse.position.x > x && mouse.position.y > 0 && mouse.position.x < canvas.width && mouse.position.y < this.size.y)
	{
		//Raycast cube
		this.normalized.set((mouse.position.x - x) / this.size.x * 2 - 1, -(mouse.position.y / this.size.y * 2 - 1));
		this.raycaster.setFromCamera(this.normalized , this.camera);

		var intersects = this.raycaster.intersectObjects(this.scene.children, true);
		if(intersects.length > 0)
		{
			this.selected = intersects[0].object;
			this.selected.material.color.set(0xFFFF00);
			return intersects[0].object.code
		}
	}

	return null;
};

//Update cube position from camera
OrientationCube.prototype.updateRotation = function(camera)
{
	this.scene.quaternion.copy(camera.quaternion);
	this.scene.updateMatrix();
	this.scene.matrix.getInverse(this.scene.matrix, false);
};

OrientationCube.prototype.render = function(renderer, canvas)
{
	var x = canvas.width - this.size.x;
	
	renderer.setScissorTest(true);
	renderer.setViewport(x, 0, this.size.x, this.size.y);
	renderer.setScissor(x, 0, this.size.x, this.size.y);
	renderer.render(this.scene, this.camera);

	if(this.selected !== null)
	{
		this.selected.material.color.set(0xFFFFFF);
		this.selected = null;
	}

	renderer.setScissorTest(false);
	renderer.setViewport(0, 0, canvas.width, canvas.height);
	renderer.setScissor(0, 0, canvas.width, canvas.height);
};
