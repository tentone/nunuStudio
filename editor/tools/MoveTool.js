"use strict";

function MoveTool()
{
	THREE.Object3D.call(this);

	var pid2 = Math.PI / 2;

	this.obj = null;

	this.selected = false;
	this.selected_x = false;
	this.selected_y = false;
	this.selected_z = false;

	//Materials
	this.material_red = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.material_green = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
	this.material_yellow = new THREE.MeshBasicMaterial({color: 0xffff00});
	var material_invisible = new THREE.MeshBasicMaterial();
	material_invisible.opacity = 0;
	material_invisible.transparent = true;
	material_invisible.needsUpdate = true;

	//Geometries
	var cylinder_geometry = new THREE.CylinderBufferGeometry(0.01, 0.01, 1, 5);
	var cylinder_geometry_big = new THREE.CylinderBufferGeometry(0.15, 0.15, 1, 5);
	var cone_geomtry = new THREE.ConeBufferGeometry(0.05, 0.15, 8);

	//X
	this.x = new THREE.Scene();
	var mesh = new THREE.Mesh(cylinder_geometry, this.material_red);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.x.add(mesh);
	mesh = new THREE.Mesh(cone_geomtry, this.material_red);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 1, 0);
	mesh.updateMatrix();
	this.x.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.x.add(mesh);
	this.x.rotateOnAxis(new THREE.Vector3(0,0,1) , -pid2);
	this.x.updateMatrix();
	this.x.matrixAutoUpdate = false;
	this.add(this.x);

	//Y
	this.y = new THREE.Scene();
	mesh = new THREE.Mesh(cylinder_geometry, this.material_green);
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.y.add(mesh);
	mesh = new THREE.Mesh(cone_geomtry, this.material_green);
	mesh.position.set(0, 1, 0);
	mesh.updateMatrix();
	this.y.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.y.add(mesh);
	this.y.matrixAutoUpdate = false;
	this.add(this.y);

	//Z
	this.z = new THREE.Scene();
	mesh = new THREE.Mesh(cylinder_geometry, this.material_blue);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.z.add(mesh);
	mesh = new THREE.Mesh(cone_geomtry, this.material_blue);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 1, 0);
	mesh.updateMatrix();
	this.z.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.matrixAutoUpdate = false;
	mesh.position.set(0, 0.5, 0);
	mesh.updateMatrix();
	this.z.add(mesh);
	this.z.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.z.updateMatrix();
	this.z.matrixAutoUpdate = false;
	this.add(this.z);

	//Center
	this.block = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), this.material_yellow);
	this.block.matrixAutoUpdate = false;
	this.add(this.block);
}

//Functions Prototype
MoveTool.prototype = Object.create(THREE.Object3D.prototype);
MoveTool.prototype.attachObject = attachObject;
MoveTool.prototype.update = update;

//Attach object to move tool
function attachObject(obj)
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
function update()
{
	//Update tool position and scale
	if(this.obj !== null)
	{
		var distance = Editor.camera.position.distanceTo(this.obj.getWorldPosition())/6;
		this.scale.set(distance, distance, distance);
		this.obj.getWorldPosition(this.position);
		if(this.obj.parent !== null)
		{
			this.obj.parent.getWorldQuaternion(this.quaternion);
		}

		if(Mouse.buttonJustReleased(Mouse.LEFT))
		{
			this.selected = false;
			this.selected_x = false;
			this.selected_y = false;
			this.selected_z = false;
		}

		if(this.selected)
		{
			if(this.obj.parent !== null)
			{
				var scale = this.obj.parent.getWorldScale();
			}
			else
			{
				var scale = 1;
			}
			var speed = Editor.camera.position.distanceTo(this.obj.getWorldPosition())/500;

			if(this.selected_x)
			{
				this.obj.position.x -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x) / scale.x;
				this.obj.position.x -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x) / scale.x;
			}
			if(this.selected_y)
			{
				this.obj.position.y -= Mouse.delta.y * speed / scale.y;
			}
			if(this.selected_z)
			{
				this.obj.position.z -= Mouse.delta.y * speed * Math.sin(Editor.camera_rotation.x + Editor.pid2) / scale.z;
				this.obj.position.z -= Mouse.delta.x * speed * Math.cos(Editor.camera_rotation.x + Editor.pid2) / scale.z;
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
				this.x.children[1].material = this.material_yellow;
			}
			else
			{
				this.x.children[0].material = this.material_red;
				this.x.children[1].material = this.material_red;
			}

			//Y Component
			if(Editor.raycaster.intersectObject(this.y, true).length > 0)
			{
				this.selected = true;
				this.selected_y = true;
				this.y.children[0].material = this.material_yellow;
				this.y.children[1].material = this.material_yellow;
			}
			else
			{
				this.y.children[0].material = this.material_green;
				this.y.children[1].material = this.material_green;
			}

			//Z Component
			if(Editor.raycaster.intersectObject(this.z, true).length > 0)
			{
				this.selected = true;
				this.selected_z = true;
				this.z.children[0].material = this.material_yellow;
				this.z.children[1].material = this.material_yellow;
			}
			else
			{
				this.z.children[0].material = this.material_blue;
				this.z.children[1].material = this.material_blue;
			}

			if(!Mouse.buttonJustPressed(Mouse.LEFT))
			{
				this.selected = false;
				this.selected_x = false;
				this.selected_y = false;
				this.selected_z = false;
			}
		}
	}

	return false;
}
