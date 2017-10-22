"use strict";

function CameraOrientation()
{
	this.scene = new THREE.Scene();

	var plane = new THREE.PlaneBufferGeometry(1, 1);
	
	var red = new THREE.MeshBasicMaterial({color: 0x773333});
	var green = new THREE.MeshBasicMaterial({color: 0x337733});
	var blue = new THREE.MeshBasicMaterial({color: 0x333377});

	this.x = new THREE.Mesh(plane, red);
	this.x.position.set(0.5, 0, 0);
	this.x.rotation.set(0, Math.PI / 2, 0);
	this.x.matrixAutoUpdate = false;
	this.x.updateMatrix();
	this.scene.add(this.x);

	this.xNeg = new THREE.Mesh(plane, red);
	this.xNeg.position.set(-0.5, 0, 0);
	this.xNeg.rotation.set(0, -Math.PI / 2, 0);
	this.xNeg.matrixAutoUpdate = false;
	this.xNeg.updateMatrix();
	this.scene.add(this.xNeg);

	this.y = new THREE.Mesh(plane, green);
	this.y.position.set(0, 0.5, 0);
	this.y.rotation.set(-Math.PI / 2, 0, 0);
	this.y.matrixAutoUpdate = false;
	this.y.updateMatrix();
	this.scene.add(this.y);

	this.yNeg = new THREE.Mesh(plane, green);
	this.yNeg.position.set(0, -0.5, 0);
	this.yNeg.rotation.set(Math.PI / 2, 0, 0);
	this.yNeg.matrixAutoUpdate = false;
	this.yNeg.updateMatrix();
	this.scene.add(this.yNeg);

	this.z = new THREE.Mesh(plane, blue);
	this.z.position.set(0, 0, 0.5);
	this.z.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.scene.add(this.z);

	this.zNeg = new THREE.Mesh(plane, blue);
	this.zNeg.position.set(0, 0, -0.5);
	this.zNeg.rotation.set(0, Math.PI, 0);
	this.zNeg.matrixAutoUpdate = false;
	this.zNeg.updateMatrix();
	this.scene.add(this.zNeg);

	this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
	this.camera.position.z = 2;
}

CameraOrientation.prototype.render = function(renderer)
{
	renderer.render(this.scene, this.camera);
};