import {NormalBlending, FrontSide, NoColors} from "three";

/**
 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don"t have to rewrite materials if you decide to use a different renderer.
 * 
 * Original documentation available here https:// threejs.org/docs/index.html#Reference/Materials/Material
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
		if (texture !== undefined && texture !== null)
		{
			texture.dispose();
		}
	}

	this.dispatchEvent({type: "dispose"});

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
};

/**
 * Serialize material to JSON data.
 *
 * @method toJSON
 * @param {Object} meta Metadata.
 * @return {Object} JSON data.
 */
THREE.Material.prototype.toJSON = function(meta)
{
	if (meta === undefined)
	{
		meta =
		{
			textures: {},
			images: {},
			videos: {}
		};
	}

	var data = {};

	// Material metadata
	data.uuid = this.uuid;
	data.type = this.type;
	data.name = this.name;

	data.toneMapped = this.toneMapped;

	// Depth
	data.depthFunc = this.depthFunc;
	data.depthTest = this.depthTest;
	data.depthWrite = this.depthWrite;
	
	// Color
	if (this.color && this.color.isColor)
	{
		data.color = this.color.getHex();
	}

	// Roughness, metalness (Standard, PBR)
	if (this.roughness !== undefined)
	{
		data.roughness = this.roughness;
	}
	if (this.metalness !== undefined)
	{
		data.metalness = this.metalness;
	}

	// Specular
	if (this.specular && this.specular.isColor)
	{
		data.specular = this.specular.getHex();
	}
	
	// Shininess
	if (this.shininess !== undefined)
	{
		data.shininess = this.shininess;
	}

	// Clear coat (PBR)
	if (this.clearcoat !== undefined)
	{
		data.clearcoat = this.clearcoat;
	}
	if (this.clearcoatRoughness !== undefined)
	{
		data.clearcoatRoughness = this.clearcoatRoughness;
	}
	if (this.transmission !== undefined)
	{
		data.transmission = this.transmission;
	}

	// Color map
	if (this.map && this.map.isTexture)
	{
		data.map = this.map.toJSON(meta).uuid;
	}
	
	// Alpha map
	if (this.alphaMap && this.alphaMap.isTexture)
	{
		data.alphaMap = this.alphaMap.toJSON(meta).uuid;
	}
	
	// Light map
	if (this.lightMap && this.lightMap.isTexture)
	{
		data.lightMap = this.lightMap.toJSON(meta).uuid;
	}
	
	// Bump map
	if (this.bumpMap && this.bumpMap.isTexture)
	{
		data.bumpMap = this.bumpMap.toJSON(meta).uuid;
		data.bumpScale = this.bumpScale;
	}

	// Normal map
	if (this.normalMap && this.normalMap.isTexture)
	{
		data.normalMap = this.normalMap.toJSON(meta).uuid;
		data.normalMapType = this.normalMapType;
		data.normalScale = this.normalScale.toArray();
	}

	// Clear coat normal map (PBR)
	if (this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture)
	{
		data.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(meta).uuid;
		data.clearcoatNormalScale = this.clearcoatNormalScale.toArray();
	}

	// Displacement map
	if (this.displacementMap && this.displacementMap.isTexture)
	{
		data.displacementMap = this.displacementMap.toJSON(meta).uuid;
		data.displacementScale = this.displacementScale;
		data.displacementBias = this.displacementBias;
	}

	// Roughness and metalness map (Stanard, PBR)
	if (this.roughnessMap && this.roughnessMap.isTexture)
	{
		data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
	}
	if (this.metalnessMap && this.metalnessMap.isTexture)
	{
		data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;
	}

	// Emissive
	if (this.emissive && this.emissive.isColor)
	{
		data.emissive = this.emissive.getHex();
	}
	if (this.emissiveIntensity !== 1.0)
	{
		data.emissiveIntensity = this.emissiveIntensity;
	}

	// Matcap map
	if (this.matcap && this.matcap.isTexture)
	{
		data.matcap = this.matcap.toJSON(meta).uuid;
	}

	// Emissive map
	if (this.emissiveMap && this.emissiveMap.isTexture)
	{
		data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
	}

	// Ambient occlusion
	if (this.aoMap && this.aoMap.isTexture)
	{
		data.aoMap = this.aoMap.toJSON(meta).uuid;
	}
	if (this.aoMapIntensity)
	{
		data.aoMapIntensity = this.aoMapIntensity;
	}

	// Specular map (Lambert, Phong)
	if (this.specularMap && this.specularMap.isTexture)
	{
		data.specularMap = this.specularMap.toJSON(meta).uuid;
	}

	// Environment map (Lambert, Phong, Standard, PBR)
	if (this.envMap && this.envMap.isTexture)
	{
		data.envMap = this.envMap.toJSON(meta).uuid;
		data.reflectivity = this.reflectivity; // Scale behind envMap

		if (this.combine)
		{
			data.combine = this.combine;
		}
		if (this.envMapIntensity)
		{
			data.envMapIntensity = this.envMapIntensity;
		}
		if (this.refractionRatio)
		{
			data.refractionRatio = this.refractionRatio;
		}
	}

	// Gradient map
	if (this.gradientMap && this.gradientMap.isTexture)
	{
		data.gradientMap = this.gradientMap.toJSON(meta).uuid;
	}

	// Size (PointsMaterial)
	if (this.size !== undefined)
	{
		data.size = this.size;
	}
	if (this.sizeAttenuation !== undefined)
	{
		data.sizeAttenuation = this.sizeAttenuation;
	}

	// Rotation (SpriteMaterial)
	if (this.rotation !== undefined)
	{
		data.rotation = this.rotation;
	}

	// Line (LineMaterial)
	if (this.linewidth !== undefined)
	{
		data.linewidth = this.linewidth;
	}
	if (this.dashSize !== undefined)
	{
		data.dashSize = this.dashSize;
	}
	if (this.gapSize !== undefined)
	{
		data.gapSize = this.gapSize;
	}
	if (this.scale !== undefined)
	{
		data.scale = this.scale;
	}

	// Shading, blending
	if (this.blending !== NormalBlending)
	{
		data.blending = this.blending;
	}
	if (this.side !== FrontSide)
	{
		data.side = this.side;
	}
	if (this.vertexColors !== NoColors)
	{
		data.vertexColors = this.vertexColors;
	}

	data.flatShading = this.flatShading;

	// Opacity
	if (this.opacity < 1)
	{
		data.opacity = this.opacity;
	}

	// Transparent
	if (this.transparent === true)
	{
		data.transparent = this.transparent;
	}

	if (this.dithering === true)
	{
		data.dithering = true;
	}

	// Alpha
	if (this.alphaTest > 0)
	{
		data.alphaTest = this.alphaTest;
	}
	if (this.premultipliedAlpha === true)
	{
		data.premultipliedAlpha = this.premultipliedAlpha;
	}
	
	// Wireframe
	if (this.wireframe === true)
	{
		data.wireframe = this.wireframe;
	}
	if (this.wireframeLinewidth > 1)
	{
		data.wireframeLinewidth = this.wireframeLinewidth;
	}
	if (this.wireframeLinecap !== "round")
	{
		data.wireframeLinecap = this.wireframeLinecap;
	}
	if (this.wireframeLinejoin !== "round")
	{
		data.wireframeLinejoin = this.wireframeLinejoin;
	}

	// Skinning
	data.skinning = this.skinning;

	// Morph targets
	data.morphTargets = this.morphTargets;

	// Morph normals
	if (this.morphNormals !== undefined)
	{
		data.morphNormals = this.morphNormals;
	}

	// Copied from Object3D.toJSON
	function extractFromCache(cache)
	{
		var values = [];

		for (var key in cache)
		{
			var data = cache[key];
			delete data.metadata;
			values.push(data);
		}

		return values;
	}

	if (meta === undefined)
	{
		var textures = extractFromCache(meta.textures);
		var images = extractFromCache(meta.images);
		var videos = extractFromCache(meta.videos);

		if (textures.length > 0)
		{
			data.textures = textures;
		}
		
		if (images.length > 0)
		{
			data.images = images;
		}

		if (videos.length > 0)
		{
			data.videos = videos;
		}
	}

	return data;
};
