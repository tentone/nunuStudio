function RotateTool()
{
	//Super
	THREE.Object3D.call(this);

	var pid2 = Math.PI / 2;

	this.material_red = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.material_green = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.material_yellow = new THREE.MeshBasicMaterial({color: 0xffff00});
	this.material_white = new THREE.MeshBasicMaterial({color: 0xffffff});

	//X
	var geometry = new THREE.TorusBufferGeometry(1, 0.015, 5, 64);
	this.x = new THREE.Mesh(geometry, this.material_red);
	this.x.matrixAutoUpdate = false;
	this.x.rotateOnAxis(new THREE.Vector3(0,1,0), pid2);
	this.x.updateMatrix();

	//Y
	geometry = new THREE.TorusBufferGeometry(1, 0.015, 5, 64);
	this.y = new THREE.Mesh(geometry, this.material_green);
	this.y.matrixAutoUpdate = false;
	this.y.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.y.updateMatrix();

	//Z
	geometry = new THREE.TorusBufferGeometry(1, 0.015, 5, 64);
	this.z = new THREE.Mesh(geometry, this.material_blue);
	this.z.matrixAutoUpdate = false;
	this.z.updateMatrix();

	//Center
	geometry = new THREE.SphereBufferGeometry(0.05, 8, 8);
	this.center = new THREE.Mesh(geometry, this.material_white);
	this.center.matrixAutoUpdate = false;

	//Disable components auto matrix update
	this.x.updateMatrix();
	this.x.matrixAutoUpdate = false;
	this.y.updateMatrix();
	this.y.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.z.matrixAutoUpdate = false;
	this.center.updateMatrix();
	this.center.matrixAutoUpdate = false;

	//Add to super
	this.add(this.x);
	this.add(this.y);
	this.add(this.z);
	this.add(this.center);
}

//Functions Prototype
RotateTool.prototype = Object.create(THREE.Object3D.prototype);
RotateTool.prototype.highlightSelectedComponents = highlightSelectedComponents;

//Highligth selected compoonents and return witch are selected
function highlightSelectedComponents(raycaster)
{
	var x = false, y = false, z = false, center = false;
	var selected = false;

	//X Component
	if(raycaster.intersectObject(this.x, false).length > 0)
	{
		selected = true;
		x = true;
		this.x.material = this.material_yellow;
	}
	else
	{
		this.x.material = this.material_red;
	}

	//Y Component
	if(raycaster.intersectObject(this.y, false).length > 0)
	{
		selected = true;
		y = true;
		this.y.material = this.material_yellow;
	}
	else
	{
		this.y.material = this.material_green;
	}

	//Z Component
	if(raycaster.intersectObject(this.z, false).length > 0)
	{
		selected = true;
		z = true;
		this.z.material = this.material_yellow;
	}
	else
	{
		this.z.material = this.material_blue;
	}

	//Z Component
	if(raycaster.intersectObject(this.center, false).length > 0)
	{
		selected = true;
		center = true;
		this.center.material = this.material_yellow;
	}
	else
	{
		this.center.material = this.material_white;
	}

	return {selected, x, y, z, center};
}