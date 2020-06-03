"use strict";

/**
 * Terrrain geometry is a plane like geometry deformed by a height map texture.
 *
 * This geometry type can be used to create large terrains.
 *
 * @class TerrainBufferGeometry
 * @constructor
 */
function TerrainBufferGeometry(width, height, widthSegments, heightSegments, image)
{
	THREE.BufferGeometry.call(this);

	this.type = "TerrainBufferGeometry";

	this.parameters =
	{
		width: width || 1,
		height: height || 1,
		widthSegments: widthSegments || 10,
		heightSegments: heightSegments || 10,
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

	var data = this.image.getImageData();
	// TODO <REMOVE THIS>
	console.log(data);

	var widthHalf = width / 2;
	var heightHalf = height / 2;

	var gridX = Math.floor(widthSegments) || 1;
	var gridY = Math.floor(heightSegments) || 1;
	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;

	// Buffers
	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// Generate vertices, normals and uvs
	for(var iy = 0; iy < gridY1; iy ++)
	{
		var y = iy * segment_height - heightHalf;

		for(var ix = 0; ix < gridX1; ix ++)
		{
			var x = ix * segment_width - widthHalf;

			vertices.push(x, 0, y);
			normals.push(0, 1, 0);

			uvs.push(ix / gridX);
			uvs.push(1 - (iy / gridY));
		}
	}

	// Indices
	for(var iy = 0; iy < gridY; iy ++)
	{
		for(var ix = 0; ix < gridX; ix ++)
		{
			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * (iy + 1);
			var c = (ix + 1) + gridX1 * (iy + 1);
			var d = (ix + 1) + gridX1 * iy;

			indices.push(a, b, d);
			indices.push(b, c, d);
		}
	}

	this.setIndex(indices);
	this.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	this.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
};
