"use strict";

function CameraOrientation()
{	
	this.raycaster = new THREE.Raycaster();

	this.scene = new THREE.Scene();

	var plane = new THREE.PlaneBufferGeometry(1, 1);
	
	var red = new THREE.MeshBasicMaterial({color: 0x773333});
	var green = new THREE.MeshBasicMaterial({color: 0x337733});
	var blue = new THREE.MeshBasicMaterial({color: 0x333377});

	this.xPos = new THREE.Mesh(plane, red);
	this.xPos.position.set(0.5, 0, 0);
	this.xPos.rotation.set(0, Math.PI / 2, 0);
	this.xPos.matrixAutoUpdate = false;
	this.xPos.updateMatrix();
	this.scene.add(this.xPos);

	this.xNeg = new THREE.Mesh(plane, red);
	this.xNeg.position.set(-0.5, 0, 0);
	this.xNeg.rotation.set(0, -Math.PI / 2, 0);
	this.xNeg.matrixAutoUpdate = false;
	this.xNeg.updateMatrix();
	this.scene.add(this.xNeg);

	this.yPos = new THREE.Mesh(plane, green);
	this.yPos.position.set(0, 0.5, 0);
	this.yPos.rotation.set(-Math.PI / 2, 0, 0);
	this.yPos.matrixAutoUpdate = false;
	this.yPos.updateMatrix();
	this.scene.add(this.yPos);

	this.yNeg = new THREE.Mesh(plane, green);
	this.yNeg.position.set(0, -0.5, 0);
	this.yNeg.rotation.set(Math.PI / 2, 0, 0);
	this.yNeg.matrixAutoUpdate = false;
	this.yNeg.updateMatrix();
	this.scene.add(this.yNeg);

	this.zPos = new THREE.Mesh(plane, blue);
	this.zPos.position.set(0, 0, 0.5);
	this.zPos.matrixAutoUpdate = false;
	this.zPos.updateMatrix();
	this.scene.add(this.zPos);

	this.zNeg = new THREE.Mesh(plane, blue);
	this.zNeg.position.set(0, 0, -0.5);
	this.zNeg.rotation.set(0, Math.PI, 0);
	this.zNeg.matrixAutoUpdate = false;
	this.zNeg.updateMatrix();
	this.scene.add(this.zNeg);

	this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
	this.camera.position.z = 2;
}

CameraOrientation.prototype.raycast = function(mouse)
{
	var objects = this.raycaster.setFromCamera(mouse, this.camera);
};

CameraOrientation.prototype.render = function(renderer)
{
	renderer.render(this.scene, this.camera);
};