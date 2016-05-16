function MoveTool()
{
	//Super
	THREE.Scene.call(this);

	//Move components
	this.x = new THREE.Scene();
	this.y = new THREE.Scene();
	this.z = new THREE.Scene();

	var pid2 = Math.PI / 2;

	//Material
	this.material_red = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.material_green = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.material_yellow = new THREE.MeshBasicMaterial({color: 0xffff00});

	//X
	var geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 5);
	var mesh = new THREE.Mesh(geometry, this.material_red);
	mesh.position.set(0, 0.5, 0);
	this.x.add(mesh);
	geometry = new THREE.CylinderGeometry(0, 0.05, 0.15, 8);
	mesh = new THREE.Mesh(geometry, this.material_red);
	mesh.position.set(0, 1, 0);
	this.x.add(mesh);
	this.x.rotateOnAxis(new THREE.Vector3(0,0,1) , -pid2);
	this.x.updateMatrix();

	//Y
	geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 5);
	mesh = new THREE.Mesh(geometry, this.material_green);
	mesh.position.set(0, 0.5, 0);
	this.y.add(mesh);
	geometry = new THREE.CylinderGeometry(0, 0.05, 0.15, 8);
	mesh = new THREE.Mesh(geometry, this.material_green);
	mesh.position.set(0, 1, 0);
	this.y.add(mesh);

	//Z
	geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 5);
	mesh = new THREE.Mesh(geometry, this.material_blue);
	mesh.position.set(0, 0.5, 0);
	this.z.add(mesh);
	geometry = new THREE.CylinderGeometry(0, 0.05, 0.15, 8);
	mesh = new THREE.Mesh(geometry, this.material_blue);
	mesh.position.set(0, 1, 0);
	this.z.add(mesh);
	this.z.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.z.updateMatrix();
	
	//Center
	geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
	this.block = new THREE.Mesh(geometry, this.material_yellow);
	
	//Add to super
	this.add(this.x);
	this.add(this.y);
	this.add(this.z);

	this.x.updateMatrix();
	this.x.matrixAutoUpdate = false;
	this.y.updateMatrix();
	this.y.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.z.matrixAutoUpdate = false;

	this.add(this.block);
}

//Functions Prototype
MoveTool.prototype = Object.create(THREE.Scene.prototype);
MoveTool.prototype.highlightSelectedComponents = highlightSelectedComponents;

//Highligth selected compoonents and return witch are selected
function highlightSelectedComponents(raycaster)
{
	var selected = false;
	var x = false, y = false, z = false;

	//X Component
	if(raycaster.intersectObject(this.x, true).length > 0)
	{
		selected = true;
		x = true;
		this.x.children[0].material = this.material_yellow;
		this.x.children[1].material = this.material_yellow;
	}
	else
	{
		this.x.children[0].material = this.material_red;
		this.x.children[1].material = this.material_red;
	}

	//Y Component
	if(raycaster.intersectObject(this.y, true).length > 0)
	{
		selected = true;
		y = true;
		this.y.children[0].material = this.material_yellow;
		this.y.children[1].material = this.material_yellow;
	}
	else
	{
		this.y.children[0].material = this.material_green;
		this.y.children[1].material = this.material_green;
	}

	//Z Component
	if(raycaster.intersectObject(this.z, true).length > 0)
	{
		selected = true;
		z = true;
		this.z.children[0].material = this.material_yellow;
		this.z.children[1].material = this.material_yellow;
	}
	else
	{
		this.z.children[0].material = this.material_blue;
		this.z.children[1].material = this.material_blue;
	}

	return {selected, x, y, z};
}