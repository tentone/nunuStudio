import {SkinnedMesh, MeshBasicMaterial} from "three";

class SkinnedWireframeHelper extends SkinnedMesh {
	constructor(object, hex) {
	super(object.geometry, new MeshBasicMaterial(
		{
			color: hex !== undefined ? hex : 0xFFFFFF,
			wireframe: true,
			skinning: true
		}));

	this.object = object;
	
	this.matrixAutoUpdate = false;
	this.update();
	}

	update() {
	this.geometry = this.object.geometry;
	this.matrix.copy(this.object.matrixWorld);
	}

}

export {SkinnedWireframeHelper};
