"use strict";

function CameraOrientation()
{	
	//Camera
	this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
	this.camera.position.z = 2;

	//Raycaster
	this.raycaster = new THREE.Raycaster();

	//Scene
	this.scene = new THREE.Scene();
	this.scene.matrixAutoUpdate = false;

	var plane = new THREE.PlaneBufferGeometry(1, 1);

	//Cube faces
	this.xPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/xPos.png")}));
	this.xPos.code = CameraOrientation.X_POS;
	this.xPos.position.set(0.5, 0, 0);
	this.xPos.rotation.set(0, Math.PI / 2, 0);
	this.xPos.matrixAutoUpdate = false;
	this.xPos.updateMatrix();
	this.scene.add(this.xPos);

	this.xNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/xNeg.png")}));
	this.xNeg.code = CameraOrientation.X_NEG;
	this.xNeg.position.set(-0.5, 0, 0);
	this.xNeg.rotation.set(0, -Math.PI / 2, 0);
	this.xNeg.matrixAutoUpdate = false;
	this.xNeg.updateMatrix();
	this.scene.add(this.xNeg);

	this.yPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/yPos.png")}));
	this.yPos.code = CameraOrientation.Y_POS;
	this.yPos.position.set(0, 0.5, 0);
	this.yPos.rotation.set(-Math.PI / 2, 0, 0);
	this.yPos.matrixAutoUpdate = false;
	this.yPos.updateMatrix();
	this.scene.add(this.yPos);

	this.yNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/yNeg.png")}));
	this.yNeg.code = CameraOrientation.Y_NEG;
	this.yNeg.position.set(0, -0.5, 0);
	this.yNeg.rotation.set(Math.PI / 2, 0, 0);
	this.yNeg.matrixAutoUpdate = false;
	this.yNeg.updateMatrix();
	this.scene.add(this.yNeg);

	this.zPos = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/zPos.png")}));
	this.zPos.code = CameraOrientation.Z_POS;
	this.zPos.position.set(0, 0, 0.5);
	this.zPos.matrixAutoUpdate = false;
	this.zPos.updateMatrix();
	this.scene.add(this.zPos);

	this.zNeg = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({map: new Texture(Editor.filePath + "camera/zNeg.png")}));
	this.zNeg.code = CameraOrientation.Z_NEG;
	this.zNeg.position.set(0, 0, -0.5);
	this.zNeg.rotation.set(0, Math.PI, 0);
	this.zNeg.matrixAutoUpdate = false;
	this.zNeg.updateMatrix();
	this.scene.add(this.zNeg);
}

CameraOrientation.X_POS = 0;
CameraOrientation.X_NEG = 1;
CameraOrientation.Y_POS = 2;
CameraOrientation.Y_NEG = 3;
CameraOrientation.Z_POS = 4;
CameraOrientation.Z_NEG = 5;

//Raycast cube from mouse normalized coordinates
CameraOrientation.prototype.raycast = function(mouse)
{
	/*for(var i = 0; i < this.scene.children.length; i++)
	{
		this.scene.children[i].material.color.set(0xFFFFFF);
	}*/

	this.raycaster.setFromCamera(mouse, this.camera);

	var intersects = this.raycaster.intersectObjects(this.scene.children, true);
	
	/*
	if(intersects.length > 0)
	{
		intersects[0].object.material.color.set(0xFFFF00);
	}
	*/

	return intersects;
};

//Update cube position from camera
CameraOrientation.prototype.updateRotation = function(camera)
{
	this.scene.quaternion.copy(camera.quaternion);
	this.scene.updateMatrix();
	this.scene.matrix.getInverse(this.scene.matrix, false);
}

CameraOrientation.prototype.render = function(renderer)
{
	renderer.render(this.scene, this.camera);
};