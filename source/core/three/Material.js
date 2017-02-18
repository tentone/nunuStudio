"use strict";

/**
 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don"t have to rewrite materials if you decide to use a different renderer.
 * 
 * Original documentation available here https://threejs.org/docs/index.html#Reference/Materials/Material
 *
 * @class Material
 * @module THREE
 */

/**
 * Dispose material.
 * 
 * Also disposes all the textures attached to the material.
 * 
 * @method dispose
 */
THREE.Material.prototype.dispose = function()
{
	function disposeTexture(texture)
	{
		if(texture !== undefined && texture !== null)
		{
			texture.dispose();
		}
	}

	this.dispatchEvent({type:"dispose"});

	disposeTexture(this.map);
	disposeTexture(this.bumpMap);
	disposeTexture(this.normalMap);
	disposeTexture(this.displacementMap);
	disposeTexture(this.specularMap);
	disposeTexture(this.emissiveMap);
	disposeTexture(this.alphaMap);
	disposeTexture(this.roughnessMap);
	disposeTexture(this.metalnessMap);
	disposeTexture(this.envMap);
}

THREE.Material.prototype.toJSON = function(meta)
{
	if(meta === undefined)
	{
		meta =
		{
			textures: {},
			images: {}
		};
	}

	var data = {};

	//Material metadata
	data.uuid = this.uuid;
	data.type = this.type;
	data.name = this.name;

	//Depth
	data.depthFunc = this.depthFunc;
	data.depthTest = this.depthTest;
	data.depthWrite = this.depthWrite;
	
	//Color
	if(this.color && this.color.isColor)
	{
		data.color = this.color.getHex();
	}

	//Roughness, metalness (Standard, PBR)
	if(this.roughness !== undefined)
	{
		data.roughness = this.roughness;
	}
	if(this.metalness !== undefined)
	{
		data.metalness = this.metalness;
	}

	//Specular
	if(this.specular && this.specular.isColor)
	{
		data.specular = this.specular.getHex();
	}
	
	//Shininess
	if(this.shininess !== undefined)
	{
		data.shininess = this.shininess;
	}

	//Clear coat (PBR)
	if(this.clearCoat !== undefined)
	{
		data.clearCoat = this.clearCoat;
	}
	if(this.clearCoatRoughness !== undefined)
	{
		data.clearCoatRoughness = this.clearCoatRoughness;
	}

	//Color map
	if(this.map && this.map.isTexture)
	{
		data.map = this.map.toJSON(meta).uuid;
	}
	
	//Alpha map
	if(this.alphaMap && this.alphaMap.isTexture)
	{
		data.alphaMap = this.alphaMap.toJSON(meta).uuid;
	}
	
	//Light map
	if(this.lightMap && this.lightMap.isTexture)
	{
		data.lightMap = this.lightMap.toJSON(meta).uuid;
	}
	
	//Bump map
	if(this.bumpMap && this.bumpMap.isTexture)
	{
		data.bumpMap = this.bumpMap.toJSON(meta).uuid;
		data.bumpScale = this.bumpScale;
	}

	//Normal map
	if(this.normalMap && this.normalMap.isTexture)
	{
		data.normalMap = this.normalMap.toJSON(meta).uuid;
		data.normalScale = this.normalScale.toArray();
	}

	//Displacement map
	if(this.displacementMap && this.displacementMap.isTexture)
	{
		data.displacementMap = this.displacementMap.toJSON(meta).uuid;
		data.displacementScale = this.displacementScale;
		data.displacementBias = this.displacementBias;
	}

	//Roughness and metalness map (Stanard, PBR)
	if(this.roughnessMap && this.roughnessMap.isTexture)
	{
		data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
	}
	if(this.metalnessMap && this.metalnessMap.isTexture)
	{
		data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;
	}

	//Emissive
	if(this.emissive && this.emissive.isColor)
	{
		data.emissive = this.emissive.getHex();
	}

	//TODO <ADD TO LOADER>
	if(this.emissiveIntensity && this.emissiveIntensity.isColor)
	{
		data.emissiveIntensity = this.emissiveIntensity.getHex();
	}

	//Emissive map
	if(this.emissiveMap && this.emissiveMap.isTexture)
	{
		data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
	}

	//TODO <ADD TO LOADER>
	//Ambient occlusion
	if(this.aoMap && this.aoMap.isTexture)
	{
		data.aoMap = this.aoMap.toJSON(meta).uuid;
	}
	if(this.aoMapIntensity)
	{
		data.aoMapIntensity = this.aoMapIntensity;
	}

	//Specular map (Lambert, Phong)
	if(this.specularMap && this.specularMap.isTexture)
	{
		data.specularMap = this.specularMap.toJSON(meta).uuid;
	}

	//Environment map (Lambert, Phong, Standard, PBR)
	if(this.envMap && this.envMap.isTexture)
	{
		data.envMap = this.envMap.toJSON(meta).uuid;
		data.reflectivity = this.reflectivity; //Scale behind envMap

		//TODO <ADD TO LOADER>
		if(this.combine)
		{
			data.combine = this.combine;
		}
		//TODO <ADD TO LOADER>
		if(this.envMapIntensity)
		{
			data.envMapIntensity = this.envMapIntensity;
		}
		//TODO <ADD TO LOADER>
		if(this.refractionRatio)
		{
			data.refractionRatio = this.refractionRatio;
		}
	}

	//Gradient map
	if(this.gradientMap && this.gradientMap.isTexture)
	{
		data.gradientMap = this.gradientMap.toJSON(meta).uuid;
	}

	//Size (PointsMaterial)
	if(this.size !== undefined)
	{
		data.size = this.size;
	}
	if(this.sizeAttenuation !== undefined)
	{
		data.sizeAttenuation = this.sizeAttenuation;
	}

	//Shading, blending
	if(this.blending !== THREE.NormalBlending)
	{
		data.blending = this.blending;
	}
	if(this.shading !== THREE.SmoothShading)
	{
		data.shading = this.shading;
	}
	if(this.side !== THREE.FrontSide)
	{
		data.side = this.side;
	}
	if(this.vertexColors !== THREE.NoColors)
	{
		data.vertexColors = this.vertexColors;
	}

	//Opacity
	if(this.opacity < 1)
	{
		data.opacity = this.opacity;
	}

	//Transparent
	if(this.transparent === true)
	{
		data.transparent = this.transparent;
	}

	//Alpha
	if(this.alphaTest > 0)
	{
		data.alphaTest = this.alphaTest;
	}
	if(this.premultipliedAlpha === true)
	{
		data.premultipliedAlpha = this.premultipliedAlpha;
	}
	
	//Wireframe
	if(this.wireframe === true)
	{
		data.wireframe = this.wireframe;
	}
	if(this.wireframeLinewidth > 1)
	{
		data.wireframeLinewidth = this.wireframeLinewidth;
	}
	if(this.wireframeLinecap !== "round")
	{
		data.wireframeLinecap = this.wireframeLinecap;
	}
	if(this.wireframeLinejoin !== "round")
	{
		data.wireframeLinejoin = this.wireframeLinejoin;
	}

	//Morph targets
	data.morphTargets = this.morphTargets;

	//TODO <ADD TO LOADER>
	//Morph normals
	if(this.morphNormals)
	{
		data.morphNormals = this.morphNormals;
	}

	//TODO <ADD TO LOADER>
	//Skinning
	if(this.skinning)
	{
		data.skinning = this.skinning;
	}

	//Copied from Object3D.toJSON
	function extractFromCache( cache)
	{
		var values = [];

		for(var key in cache)
		{
			var data = cache[key];
			delete data.metadata;
			values.push(data);
		}

		return values;
	}

	if(meta === undefined)
	{
		var textures = extractFromCache(meta.textures);
		var images = extractFromCache(meta.images);

		if(textures.length > 0)
		{
			data.textures = textures;
		}

		if(images.length > 0)
		{
			data.images = images;
		}
	}

	return data;
}