"use strict";

function RotateTool()
{
	THREE.Object3D.call(this);

	var pid2 = Math.PI / 2;

	this.obj = null;

	this.selected = false;
	this.selected_x = false;
	this.selected_y = false;
	this.selected_z = false;
	this.selected_center = false;

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
	this.add(this.x);
	
	//Y
	this.y = new THREE.Scene();
	mesh = new THREE.Mesh(torus_geometry, this.material_green);
	this.y.add(mesh);
	mesh = new THREE.Mesh(torus_geometry_big, material_invisible);
	this.y.add(mesh);
	this.y.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.y.matrixAutoUpdate = false;
	this.y.updateMatrix();
	this.add(this.y);

	//Z
	this.z = new THREE.Scene();
	mesh = new THREE.Mesh(torus_geometry, this.material_blue);
	this.z.add(mesh);
	mesh = new THREE.Mesh(torus_geometry_big, material_invisible);
	this.z.add(mesh);
	this.z.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.add(this.z);

	//Center
	this.center = new THREE.Mesh(new THREE.SphereBufferGeometry(0.05, 8, 8), this.material_white);
	this.center.matrixAutoUpdate = false;
	this.center.updateMatrix();
	this.add(this.center);
}

//Super prototypes
RotateTool.prototype = Object.create(THREE.Object3D.prototype);

//Attach object to rotate tool
RotateTool.prototype.attach = function(obj)
{
	if(obj instanceof THREE.Object3D)
	{
		this.obj = obj;
		this.visible = true;
	}
	else
	{
		this.obj = null
		this.visible = false;
	}
}

//Update attached object returns if object is being edited
RotateTool.prototype.update = function(raycaster)
{
	if(this.obj !== null)
	{
		var position = this.obj.getWorldPosition();
		var distance = Editor.camera.position.distanceTo(this.obj.getWorldPosition())/6;
		this.scale.set(distance, distance, distance);
		this.obj.getWorldPosition(this.position);
		
		if(Mouse.buttonJustReleased(Mouse.LEFT))
		{
			this.selected = false;
			this.selected_x = false;
			this.selected_y = false;
			this.selected_z = false;
			this.selected_center = false;
		}

		if(this.selected)
		{
			var speed = 0.003;

			if(this.selected_x)
			{
				var delta = new THREE.Quaternion();
				delta.setFromEuler(new THREE.Euler(-(Mouse.delta.y + Mouse.delta.x) * speed, 0, 0, 'XYZ'));
				this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
				Editor.updateObjectPanel();
			}
			if(this.selected_y)
			{
				var delta = new THREE.Quaternion();
				delta.setFromEuler(new THREE.Euler(0, -(Mouse.delta.y + Mouse.delta.x) * speed, 0, 'XYZ'));
				this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
				Editor.updateObjectPanel();
			}
			if(this.selected_z)
			{
				var delta = new THREE.Quaternion();
				delta.setFromEuler(new THREE.Euler(0, 0, (Mouse.delta.y + Mouse.delta.x) * speed, 'XYZ'));
				this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
				Editor.updateObjectPanel();
			}

			Editor.updateObjectPanel();

			return true;
		}
		else
		{
			Editor.updateRaycasterFromMouse();

			//X Component
			if(Editor.raycaster.intersectObject(this.x, true).length > 0)
			{
				this.selected = true;
				this.selected_x = true;
				this.x.children[0].material = this.material_yellow;
			}
			else
			{
				this.x.children[0].material = this.material_red;
			}

			//Y Component
			if(Editor.raycaster.intersectObject(this.y, true).length > 0)
			{
				this.selected = true;
				this.selected_y = true;
				this.y.children[0].material = this.material_yellow;
			}
			else
			{
				this.y.children[0].material = this.material_green;
			}

			//Z Component
			if(Editor.raycaster.intersectObject(this.z, true).length > 0)
			{
				this.selected = true;
				this.selected_z = true;
				this.z.children[0].material = this.material_yellow;
			}
			else
			{
				this.z.children[0].material = this.material_blue;
			}

			//Center
			if(Editor.raycaster.intersectObject(this.center, false).length > 0)
			{
				this.selected = true;
				this.selected_center = true;
				this.center.material = this.material_yellow;
			}
			else
			{
				this.center.material = this.material_white;
			}
		}

		if(!Mouse.buttonJustPressed(Mouse.LEFT))
		{
			this.selected = false;
			this.selected_x = false;
			this.selected_y = false;
			this.selected_z = false;
			this.selected_center = false;
		}
	}

	return false;
}