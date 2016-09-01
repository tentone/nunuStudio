"use strict";

function ObjectUtils(){}

//Get all materials in object and childs
ObjectUtils.getMaterials = function(obj, materials)
{
	//Auxiliar function to add materials
	function add(material)
	{
		if(materials[material.uuid] === undefined)
		{
			materials[material.uuid] = material;
		}
	}

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
		if(!child.hidden && child.material !== undefined && !(child instanceof Sky))
		{
			if(child.material instanceof THREE.Material)
			{
				add(child.material);
			}
			else if(child.material instanceof THREE.MultiMaterial)
			{
				var material_array = child.material.materials;

				for(var j = 0; j < material_array.length; j++)
				{
					add(material_array[j]);
				}
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
	//Auxiliar function to add textures
	function add(texture)
	{
		if(texture !== null && texture !== undefined)
		{
			if(textures[texture.uuid] === undefined)
			{
				textures[texture.uuid] = texture;
			}
		}
	}

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
			var material = child.material;
			add(material.map);
			add(material.bumpMap);
			add(material.normalMap);
			add(material.displacementMap);
			add(material.specularMap);
			add(material.emissiveMap);
			add(material.alphaMap);
			add(material.roughnessMap);
			add(material.metalnessMap);
		}
		else if(child instanceof ParticleEmitter)
		{
			add(child.group.texture);
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

//Set matrix auto update value
ObjectUtils.setMatrixAutoUpdate = function(obj, value)
{
	obj.traverse(function(child)
	{
		child.matrixAutoUpdate = value;
	});
}

//Set shadow receiving
ObjectUtils.setShadowReceiving = function(obj, value)
{
	obj.traverse(function(child)
	{
		child.receiveShadow = value;
	});
}

//Set shadow casting
ObjectUtils.setShadowCasting = function(obj, value)
{
	obj.traverse(function(child)
	{
		child.castShadow = value;
	});
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
			var object3d = new Mesh(geometry, material);
			object3d.rotateY(angle);
			object3d.position.copy(position);
			object3d.updateMatrix();
			merged_geometry.merge(object3d.geometry, object3d.matrix);

			//Back face
			var object3d = new Mesh(geometry, material);
			object3d.rotateY(angle + Math.PI);
			object3d.position.copy(position);
			object3d.updateMatrix();
			merged_geometry.merge(object3d.geometry, object3d.matrix);
		}
	}

	return new Mesh(merged_geometry, material);
}