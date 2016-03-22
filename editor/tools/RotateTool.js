function RotateTool()
{
	//Super
	THREE.Scene.call(this);

	var pid2 = Math.PI / 2;

	this.material_red = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.material_green = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.material_yellow = new THREE.MeshBasicMaterial({color: 0xffff00});

	//X
	var geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.x = new THREE.Mesh(geometry, this.material_red);
	this.x.rotateOnAxis(new THREE.Vector3(0,1,0), pid2);

	//Y
	geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.y = new THREE.Mesh(geometry, this.material_green);
	this.y.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);

	//Z
	geometry = new THREE.TorusGeometry(1, 0.02, 5, 64);
	this.z = new THREE.Mesh(geometry, this.material_blue);

	//Disable components auto matrix update
	this.x.updateMatrix();
	this.x.matrixAutoUpdate = false;
	this.y.updateMatrix();
	this.y.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.z.matrixAutoUpdate = false;

	//Add to super
	this.add(this.x);
	this.add(this.y);
	this.add(this.z);
}

//Functions Prototype
RotateTool.prototype = Object.create(THREE.Scene.prototype);
RotateTool.prototype.highlightSelectedComponents = highlightSelectedComponents;

//Highligth selected compoonents and return witch are selected
function highlightSelectedComponents(raycaster)
{
	var x = false, y = false, z = false;
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

	return {selected, x, y, z};
}