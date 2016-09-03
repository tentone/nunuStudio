"use strict";

function TransformGizmo()
{
	var scope = this;

	this.init = function()
	{
		THREE.Object3D.call(this);

		this.handles = new THREE.Object3D();
		this.pickers = new THREE.Object3D();
		this.planes = new THREE.Object3D();

		this.add(this.handles);
		this.add(this.pickers);
		this.add(this.planes);

		//Planes
		var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
		var planeMaterial = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
		var planes =
		{
			"XY": new THREE.Mesh(planeGeometry, planeMaterial),
			"YZ": new THREE.Mesh(planeGeometry, planeMaterial),
			"XZ": new THREE.Mesh(planeGeometry, planeMaterial),
			"XYZE": new THREE.Mesh(planeGeometry, planeMaterial)
		};

		this.activePlane = planes["XYZE"];

		planes["YZ"].rotation.set(0, Math.PI / 2, 0);
		planes["XZ"].rotation.set(- Math.PI / 2, 0, 0);

		for(var i in planes)
		{
			planes[i].name = i;
			this.planes.add(planes[i]);
			this.planes[i] = planes[i];
		}

		//Handlers and pickers
		var setupGizmos = function(gizmoMap, parent)
		{
			for(var name in gizmoMap)
			{
				for(i = gizmoMap[name].length; i --;)
				{
					var object = gizmoMap[name][i][0];
					var position = gizmoMap[name][i][1];
					var rotation = gizmoMap[name][i][2];

					object.name = name;

					if(position)
					{
						object.position.set(position[0], position[1], position[2]);
					}
					if(rotation)
					{
						object.rotation.set(rotation[0], rotation[1], rotation[2]);
					}

					parent.add(object);
				}
			}
		};

		setupGizmos(this.handleGizmos, this.handles);
		setupGizmos(this.pickerGizmos, this.pickers);

		//Reset transformations
		this.traverse(function (child)
		{
			if(child instanceof THREE.Mesh)
			{
				child.updateMatrix();

				var tempGeometry = child.geometry.clone();
				tempGeometry.applyMatrix(child.matrix);
				child.geometry = tempGeometry;

				child.position.set(0, 0, 0);
				child.rotation.set(0, 0, 0);
				child.scale.set(1, 1, 1);
			}
		});
	};

	this.highlight = function(axis)
	{
		this.traverse(function(child)
		{
			if(child.material && child.material.highlight)
			{
				if(child.name === axis)
				{
					child.material.highlight(true);
				}
				else
				{
					child.material.highlight(false);
				}
			}
		});
	};
}

TransformGizmo.prototype = Object.create(THREE.Object3D.prototype);

TransformGizmo.pickerMaterial = new GizmoMaterial({visible: false, transparent: false});

TransformGizmo.prototype.update = function(rotation, eye)
{
	var vec1 = new THREE.Vector3(0, 0, 0);
	var vec2 = new THREE.Vector3(0, 1, 0);
	var lookAtMatrix = new THREE.Matrix4();

	this.traverse(function(child)
	{
		if(child.name.search("E") !== - 1)
		{
			child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));
		}
		else if(child.name.search("X") !== - 1 || child.name.search("Y") !== - 1 || child.name.search("Z") !== - 1)
		{
			child.quaternion.setFromEuler(rotation);
		}
	});
}