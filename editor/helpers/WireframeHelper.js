"use strict";

function WireframeHelper(obj, hex) 
{
	var color = (hex !== undefined) ? hex : 0xffffff;

	THREE.LineSegments.call(this, new THREE.WireframeGeometry(obj.geometry), new THREE.LineBasicMaterial({color: color, transparent: true, opacity: 0.3}));

	this.matrix = obj.matrixWorld;
	this.matrixAutoUpdate = false;

	this.obj = obj;
}

WireframeHelper.prototype = Object.create(THREE.LineSegments.prototype);

WireframeHelper.prototype.update = function()
{
	if(this.obj !== null)
	{
		this.matrix = this.obj.matrixWorld;
		this.geometry = this.obj.geometry;
	}
}