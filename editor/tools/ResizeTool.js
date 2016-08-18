"use strict";

function ResizeTool()
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
	var cylinder_geometry = new THREE.CylinderBufferGeometry(0.01, 0.01, 1, 5);
	var cylinder_geometry_big = new THREE.CylinderBufferGeometry(0.15, 0.15, 1, 5);
	var box_geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);

	//X
	this.x = new THREE.Scene();
	var mesh = new THREE.Mesh(cylinder_geometry, this.material_red);
	mesh.position.set(0, 0.5, 0);
	this.x.add(mesh);
	mesh = new THREE.Mesh(box_geometry, this.material_red);
	mesh.position.set(0, 1, 0);
	this.x.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.position.set(0, 0.5, 0);
	this.x.add(mesh);
	this.x.rotateOnAxis(new THREE.Vector3(0,0,1) , -pid2);
	this.x.matrixAutoUpdate = false;
	this.x.updateMatrix();
	this.add(this.x);

	//Y
	this.y = new THREE.Scene();
	mesh = new THREE.Mesh(cylinder_geometry, this.material_green);
	mesh.position.set(0, 0.5, 0);
	this.y.add(mesh);
	mesh = new THREE.Mesh(box_geometry, this.material_green);
	mesh.position.set(0, 1, 0);
	this.y.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.position.set(0, 0.5, 0);
	this.y.add(mesh);
	this.y.matrixAutoUpdate = false;
	this.add(this.y);

	//Z
	this.z = new THREE.Scene();
	mesh = new THREE.Mesh(cylinder_geometry, this.material_blue);
	mesh.position.set(0, 0.5, 0);
	this.z.add(mesh);
	mesh = new THREE.Mesh(box_geometry, this.material_blue);
	mesh.position.set(0, 1, 0);
	this.z.add(mesh);
	mesh = new THREE.Mesh(cylinder_geometry_big, material_invisible);
	mesh.position.set(0, 0.5, 0);
	this.z.add(mesh);
	this.z.rotateOnAxis(new THREE.Vector3(1,0,0), pid2);
	this.z.matrixAutoUpdate = false;
	this.z.updateMatrix();
	this.add(this.z);

	//Center
	this.block = new THREE.Mesh(box_geometry, this.material_yellow);
	this.block.matrixAutoUpdate = false;
	this.block.updateMatrix();
	this.add(this.block);
}

//Functions Prototype
ResizeTool.prototype = Object.create(THREE.Object3D.prototype);
ResizeTool.prototype.attachObject = attachObject;
ResizeTool.prototype.update = update;

//Attach object to resize tool
function attachObject(obj)
{
	if(obj instanceof THREE.Camera)
	{
		this.obj = null
		this.visible = false;
	}
	else if(obj instanceof THREE.Object3D)
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
function update(raycaster)
{
	if(this.obj !== null)
	{
		var distance = Editor.camera.position.distanceTo(this.obj.getWorldPosition())/6;
		this.scale.set(distance, distance, distance);
		this.obj.getWorldPosition(this.position);
		this.obj.getWorldQuaternion(this.quaternion);

		//Reset selected flags
		if(Mouse.buttonJustReleased(Mouse.LEFT))
		{
			this.selected = false;
			this.selected_x = false;
			this.selected_y = false;
			this.selected_z = false;
			this.selected_center = false;
		}

		//Update object scale
		if(this.selected)
		{
			var scale = this.obj.scale;
			var delta = Mouse.delta;
			var rotation = Editor.camera_rotation;
			var x = 0, y = 0, z = 0;

			if(this.selected_center)
			{
				var size = (Mouse.delta.x - Mouse.delta.y);
				x = size * scale * 0.01;
				y = size * scale * 0.01;
				z = size * scale * 0.01;
			}
			else if(this.selected_x)
			{
				x = (-delta.y * Math.sin(rotation.x) - delta.x * Math.cos(rotation.x)) * scale.x * 0.01;
			}
			else if(this.selected_y)
			{
				y = -delta.y * scale.y * 0.01;
			}
			else if(this.selected_z)
			{
				z = (-delta.y * Math.sin(rotation.x + 1.57) - delta.x * Math.cos(rotation.x + 1.57))* scale.z * 0.01;
			}

			this.obj.scale.x += x;
			this.obj.scale.y += y;
			this.obj.scale.z += z;

			//Update physics objects
			if(this.obj instanceof PhysicsObject)
			{
				var shapes = this.obj.body.shapes;
				for(var i = 0; i < shapes.length; i++)
				{
					var shape = shapes[i];
					
					if(shape.type === CANNON.Shape.types.BOX)
					{
						shape.halfExtents.x += x / 2.0;
						shape.halfExtents.y += y / 2.0;
						shape.halfExtents.z += z / 2.0;
					}
					else if(shape.type === CANNON.Shape.types.SPHERE)
					{
						shape.radius += x;
					}
				}
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
				this.selected_x = true;
				this.selected = true;
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
				this.selected_y = true;
				this.selected = true;
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
				this.selected_z = true;
				this.selected = true;
				this.z.children[0].material = this.material_yellow;
				this.z.children[1].material = this.material_yellow;
			}
			else
			{
				this.z.children[0].material = this.material_blue;
				this.z.children[1].material = this.material_blue;
			}

			//Center Block Component
			if(Editor.raycaster.intersectObject(this.block, true).length > 0)
			{
				this.selected_center = true;
				this.selected = true;
				this.block.material = this.material_yellow;
			}
			else
			{
				this.block.material = this.material_white;
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