function RotateTool()
{
	//Super
	THREE.Scene.call(this);

	var pid2 = Math.PI / 2;

	//X
	var material = new THREE.MeshBasicMaterial({color: 0xff0000});
	var geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.x = new THREE.Mesh(geometry, material);
	this.x.rotateOnAxis(new THREE.Vector3(0,1,0), pid2);

	//Y
	material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.y = new THREE.Mesh(geometry, material);
	this.y.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);

	//Z
	material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.z = new THREE.Mesh(geometry, material);


	//Add to super
	this.add(this.x);
	this.add(this.y);
	this.add(this.z);
}

//Functions Prototype
RotateTool.prototype = Object.create(THREE.Scene.prototype);
