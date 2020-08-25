import {LineSegments, BufferGeometry, LineBasicMaterial, Float32BufferAttribute} from "three";

/**
 * Grid helper is used to visualize a grid in the editor.
 *
 * Size, spacing and color of the grid can be costumized.
 *
 * @class GridHelper
 * @param size {number} Total size of the grid.
 * @param spacing {number} Spacing between lines.
 * @param color {number} Hex color of the grid lines.
 */
function GridHelper(size, spacing, color)
{
	this.size = size !== undefined ? size : 100;
	this.spacing = spacing !== undefined ? spacing : 1;

	LineSegments.call(this, new BufferGeometry(), new LineBasicMaterial(
		{
			color: color !== undefined ? color : 0x888888,
			depthWrite: false,
			transparent: true,
			opacity: 0.5
		}));

	this.update();
};

GridHelper.prototype = Object.create(LineSegments.prototype);

GridHelper.prototype.setSize = function(size)
{
	this.size = size;
};

GridHelper.prototype.setSpacing = function(spacing)
{
	this.spacing = spacing;
};

/**
 * Update the geometry of the grid.
 *
 * @method update
 */
GridHelper.prototype.update = function()
{
	var geometry = this.geometry;
	geometry.deleteAttribute("position");

	var divisions = Math.round(this.size / this.spacing) * 2;
	var center = divisions / 2;
	var step = this.size * 2 / divisions;
	var vertices = [];
	var colors = [];

	for (var i = 0, j = 0, k = -this.size; i <= divisions; i ++, k += step)
	{
		vertices.push(-this.size, 0, k, this.size, 0, k);
		vertices.push(k, 0, -this.size, k, 0, this.size);
	}

	geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
};

export {GridHelper};
