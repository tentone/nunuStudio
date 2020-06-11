"use strict";

/**
 * Terrrain geometry is a plane like geometry deformed by a height map texture.
 *
 * This geometry type can be used to create large terrains. Its possible to generate the height data using scripts and create terrain dynamically.
 *
 * @class TerrainBufferGeometry
 * @constructor
 * @param {number} width Width of the terrain.
 * @param {number} height Height of the terrain.
 * @param {number} widthSegments How many segments compose the terrain width.
 * @param {number} heightSegments How many segments compose the terrain height.
 * @param {number} scale Scale of the terrain in height (maximum altitude of the terrain).
 * @param {Image} image Image containing the height data of the terrain.
 */
function TerrainBufferGeometry(width, height, widthSegments, heightSegments, scale, image)
{
	THREE.BufferGeometry.call(this);

	this.type = "TerrainBufferGeometry";

	this.parameters =
	{
		width: width || 1,
		height: height || 1,
		widthSegments: widthSegments || 10,
		heightSegments: heightSegments || 10,
		scale: scale || 1
	};

	this.image = image;


	this.generate();
};

TerrainBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
TerrainBufferGeometry.constructor = TerrainBufferGeometry;

TerrainBufferGeometry.prototype.generate = function()
{
	var width = this.parameters.width;
	var height = this.parameters.height;
	var widthSegments = this.parameters.widthSegments;
	var heightSegments = this.parameters.heightSegments;
	var scale = this.parameters.scale;

	var self = this;
	
	this.image.getImageData(function(data, imgWidth, imgHeight)
	{
		var imgChannels = 4;

		var widthHalf = width / 2;
		var heightHalf = height / 2;

		var gridX = Math.floor(widthSegments) || 1;
		var gridX1 = gridX + 1;
		var gridY = Math.floor(heightSegments) || 1;

		// Size of each individual segment
		var segWidth = width / gridX;
		var segHeight = height / gridY;

		// Buffers
		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		var widthRatio = imgWidth / (width + 1);
		var heightRatio = imgHeight / (height + 1);

		// Get image pixel from x, y coordinates in the geometry space, value is normalized
		function getPixel(x, z)
		{
			var imgX = Math.round((x + widthHalf) * widthRatio);
			var imgY = Math.round((z + heightHalf) * heightRatio);
			var iy = (imgY * (imgWidth * imgChannels) + imgX * imgChannels);
			return data.data[iy] / 255;
		}

		// Generate vertices, normals and uvs
		for(var iz = 0; iz <= gridY; iz++)
		{
			var z = iz * segHeight - heightHalf;

			for(var ix = 0; ix <= gridX; ix++)
			{
				var x = ix * segWidth - widthHalf;

				// Read height from the image data
				var y = (getPixel(x, z) * scale);
				vertices.push(x, y, z);
				normals.push(0, 1, 0);

				uvs.push(ix / gridX);
				uvs.push(1 - (iz / gridY));
			}
		}

		// Indices
		for(var iz = 0; iz < gridY; iz ++)
		{
			for(var ix = 0; ix < gridX; ix ++)
			{
				var a = ix + gridX1 * iz;
				var b = ix + gridX1 * (iz + 1);
				var c = (ix + 1) + gridX1 * (iz + 1);
				var d = (ix + 1) + gridX1 * iz;

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}

		self.setIndex(indices);
		self.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		self.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		self.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

		self.computeVertexNormals();

		self.boundingBox = null;
		self.boundingSphere = null;
	});
};

TerrainBufferGeometry.prototype.toJSON = function()
{
	var data = THREE.BufferGeometry.prototype.toJSON.call(this);
	
	data.image = this.image.uuid;

	return data;
};