import {SkinnedMesh, MeshBasicMaterial} from "three";

function SkinnedWireframeHelper(object, hex) 
{
	SkinnedMesh.call(this, object.geometry, new MeshBasicMaterial(
		{
			color: hex !== undefined ? hex : 0xFFFFFF,
			wireframe: true,
			skinning: true
		}));

	this.object = object;
	
	this.matrixAutoUpdate = false;
	this.update();
}

SkinnedWireframeHelper.prototype = Object.create(SkinnedMesh.prototype);

SkinnedWireframeHelper.prototype.update = function()
{
	this.geometry = this.object.geometry;
	this.matrix.copy(this.object.matrixWorld);
};

export {SkinnedWireframeHelper};
