"use strict";

function WireframeHelper(obj, hex) 
{
	var color = (hex !== undefined) ? hex : 0xFFFFFF;

	THREE.Mesh.call(this, obj.geometry, new THREE.MeshBasicMaterial({color: color, wireframe: true, transparent: true, opacity: 1.0, skinning: true}));

	this.matrix = obj.matrixWorld;
	this.matrixAutoUpdate = false;

	this.obj = obj;
}

WireframeHelper.prototype = Object.create(THREE.Mesh.prototype);

WireframeHelper.prototype.update = function()
{
	if(this.obj !== null)
	{
		this.matrix = this.obj.matrixWorld;
		this.geometry = this.obj.geometry;
	}
};