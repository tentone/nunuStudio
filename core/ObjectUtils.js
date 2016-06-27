"use strict";

//Object tools contains some object managing helpers
function ObjectUtils(){}

//Get all materials in object and childs
ObjectUtils.getMaterials = function(obj, materials)
{
	//If undefined create new array to store materials
	if(materials === undefined)
	{
		materials = [];
	}

	//Add materials from children and call func for them
	for(var i = 0; i < obj.children.length; i++)
	{
		var child = obj.children[i];

		//Check if child has material
		if(child.material !== undefined && !(child instanceof Sky))
		{
			if(materials[child.material.uuid] === undefined)
			{
				materials[child.material.uuid] = child.material;
			}
		}

		//Call recursively for childs
		ObjectUtils.getMaterials(child, materials);
	}

	return materials;
}

//Get all textures in object and childs
ObjectUtils.getTextures = function(obj, textures)
{
	//If undefined create new array to store materials
	if(textures === undefined)
	{
		textures = [];
	}

	//Add textures from children and call func for them
	for(var i = 0; i < obj.children.length; i++)
	{
		var child = obj.children[i];

		if(child.material !== undefined)
		{
			//TODO <ADD CODE HERE>
		}
		else if(child instanceof ParticleEmitter)
		{
			var texture = child.group.texture;

			if(textures[texture.uuid] === undefined)
			{
				textures[texture.uuid] = texture;
			}
		}

		//Call recursively for childs
		ObjectUtils.getTextures(child, textures);
	}

	return textures;
}

//Get object scene
ObjectUtils.getScene = function(obj)
{
	var node = obj;

	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			return node;
		}
	}

	return null;
}

//Get object tree root
ObjectUtils.getRoot = function(obj)
{
	var node = obj;
	while(node.parent !== null)
	{
		node = node.parent;
	}

	return node;
}

//Convert threejs type to internal types
ObjectUtils.convertFromThreeType = function(obj)
{
	var data = obj.toJSON();
	var loader = new ObjectLoader();
	return loader.parse(data);
}

//Set static
ObjectUtils.setMatrixAutoUpdate = function(obj, value)
{
	obj.matrixAutoUpdate = value;

	for(var i = 0; i < obj.children.length; i++)
	{
		ObjectUtils.setMatrixAutoUpdate(obj.children[i], value);
	}
}

//Set shadow receiving
ObjectUtils.setShadowReceiving = function(obj, value)
{
	obj.receiveShadow = value;

	for(var i = 0; i < obj.children.length; i++)
	{
		ObjectUtils.setShadowReceiving(obj.children[i], value);
	}
}

//Enable shadow casting
ObjectUtils.setShadowCasting = function(obj, value)
{
	obj.castShadow = value;

	for(var i = 0; i < obj.children.length; i++)
	{
		ObjectUtils.setShadowCasting(obj.children[i], value);
	}
}

//Check if object is child of another object
ObjectUtils.isChildOf = function(parent, child)
{
	for(var i = 0; i < parent.children.length; i++)
	{
		if(parent.children[i] === child || ObjectUtils.isChildOf(parent.children[i], child))
		{
			return true;
		}
	}
	return false;
}

//Create a cylinder between points a and b
ObjectUtils.createCylinderBetweenPoints = function(a, b)
{
	var dist = Math.sqrt(Math.pow((a.x - b.x),2) + Math.pow((a.y - b.y),2) + Math.pow((a.z - b.z),2));

	var geometry = new THREE.CylinderGeometry(0.1, 0.1, dist, 16, 32, false);
	var material = new THREE.MeshPhongMaterial({color: 0xff0000});
	var cylinder = new Model3D(geometry, material);
	cylinder.position.set(0, dist/2, 0)

	var obj = new THREE.Object3D();
	obj.position.set(a.x, a.y, a.z);
	obj.add(cylinder);
	obj.lookAt(b);

	return obj;
}

//Create grass tufts (nice to render large fields of grass)
ObjectUtils.createGrassTufts = function(positions)
{
	//Create the initial geometry
	var geometry = new THREE.PlaneGeometry(0.5, 0.5);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, geometry.height/2, 0));

	//Tweak the normal for better lighting
	geometry.faces.forEach(function(face)
	{
		face.vertexNormals.forEach(function(normal)
		{
			normal.set(0.0, 1.0, 0.0);
		});
	});
	
	//The material without texture
	var material = new THREE.MeshPhongMaterial({color: 0xffffff});

	//Create each tuft and merge their geometry for performance
	var merged_geometry = new THREE.Geometry();

	for(var i = 0; i < positions.length; i++)
	{
		var position = positions[i];		
		var base_angle = Math.PI*2*Math.random();
		var n_planes = 2;

		for(var j = 0; j < n_planes; j++)
		{
			var angle = base_angle + j*Math.PI/n_planes;

			//Front face
			var object3d = new Model3D(geometry, material);
			object3d.rotateY(angle);
			object3d.position.copy(position);
			object3d.updateMatrix();
			merged_geometry.merge(object3d.geometry, object3d.matrix);

			//Back face
			var object3d = new Model3D(geometry, material);
			object3d.rotateY(angle+Math.PI);
			object3d.position.copy(position);
			object3d.updateMatrix();
			merged_geometry.merge(object3d.geometry, object3d.matrix);
		}
	}

	//Create the mesh
	var mesh = new Model3D(merged_geometry, material)
	return mesh;
}