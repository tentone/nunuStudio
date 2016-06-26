function RotateTool()
{
	//Super
	THREE.Object3D.call(this);

	var pid2 = Math.PI / 2;

	//Materials
	this.material_red = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.material_green = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.material_yellow = new THREE.MeshBasicMaterial({color: 0xffff00});
	this.material_white = new THREE.MeshBasicMaterial({color: 0xffffff});
	var material_invisible = new THREE.MeshBasicMaterial();
	material_invisible.opacity = 0;
	material_invisible.transparent = true;
	material_invisible.needsUpdate = true;

	//Geometries
	var torus_geometry = new THREE.TorusBufferGeometry(1, 0.01, 5, 64);
	var torus_geometry_big = new THREE.TorusBufferGeometry(1, 0.1, 5, 32);

	//X
	this.x = new THREE.Scene();
	var mesh = new THREE.Mesh(torus_geometry, this.material_red);
	this.x.add(mesh);
	mesh = new THREE.Mesh(torus_geometry_big, material_invisible);
	this.x.add(mesh);
	this.x.rotateOnAxis(new THREE.Vector3(0,1,0), pid2);
	this.x.matrixAutoUpdate = false;
	this.x.updateMatrix();

	//Y
	this.y = new THREE.Scene();
	mesh = new THREE.Mesh(torus_geometry, this.material_green);
	this.y.add(mesh);
	mesh = new THREE.Mesh(torus_geometry_big, material_invisible);
	this.y.add(mesh);
	this.y.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.y.matrixAutoUpdate = false;
	this.y.updateMatrix();

	//Z
	this.z = new THREE.Scene();
	mesh = new THREE.Mesh(torus_geometry, this.material_blue);
	this.z.add(mesh);
	mesh = new THREE.Mesh(torus_geometry_big, material_invisible);
	this.z.add(mesh);
	this.z.matrixAutoUpdate = false;
	this.z.updateMatrix();

	//Center
	this.center = new THREE.Mesh(new THREE.SphereBufferGeometry(0.05, 8, 8), this.material_white);
	this.center.matrixAutoUpdate = false;
	this.center.updateMatrix();

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
	if(raycaster.intersectObject(this.x, true).length > 0)
	{
		selected = true;
		x = true;
		this.x.children[0].material = this.material_yellow;
	}
	else
	{
		this.x.children[0].material = this.material_red;
	}

	//Y Component
	if(raycaster.intersectObject(this.y, true).length > 0)
	{
		selected = true;
		y = true;
		this.y.children[0].material = this.material_yellow;
	}
	else
	{
		this.y.children[0].material = this.material_green;
	}

	//Z Component
	if(raycaster.intersectObject(this.z, true).length > 0)
	{
		selected = true;
		z = true;
		this.z.children[0].material = this.material_yellow;
	}
	else
	{
		this.z.children[0].material = this.material_blue;
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