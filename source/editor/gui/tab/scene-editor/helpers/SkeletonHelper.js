import {BufferGeometry, Color, Float32BufferAttribute, LineSegments, LineBasicMaterial, VertexColors, Matrix4, Vector3} from "three";

function SkeletonHelper(object) 
{
	this.object = object;

	var bones = SkeletonHelper.getBoneList(object);
	var geometry = new BufferGeometry();

	var vertices = [];
	var colors = [];

	var color1 = new Color(0, 0, 1);
	var color2 = new Color(0, 1, 0);

	for (var i = 0; i < bones.length; i++)
	{
		var bone = bones[i];

		if (bone.parent && bone.parent.isBone)
		{
			vertices.push(0, 0, 0);
			vertices.push(0, 0, 0);
			colors.push(color1.r, color1.g, color1.b);
			colors.push(color2.r, color2.g, color2.b);
		}
	}

	geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
	geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

	LineSegments.call(this, geometry, new LineBasicMaterial(
		{
			vertexColors: VertexColors,
			depthTest: false,
			depthWrite: false,
			transparent: false
		}));

	this.root = object;
	this.bones = bones;
	this.matrixAutoUpdate = false;

	this.update();
}

SkeletonHelper.prototype = Object.create(LineSegments.prototype);

SkeletonHelper.getBoneList = function(object)
{
	var boneList = [];

	if (object && object.isBone)
	{
		boneList.push(object);
	}

	for (var i = 0; i < object.children.length; i++)
	{
		boneList.push.apply(boneList, SkeletonHelper.getBoneList(object.children[i]));
	}

	return boneList;
};

SkeletonHelper.prototype.update = function()
{
	var bones = this.bones;
	var geometry = this.geometry;
	var position = geometry.getAttribute("position");

	var matrixWorldInv = new Matrix4();
	matrixWorldInv.getInverse(this.root.matrixWorld);

	var boneMatrix = new Matrix4();
	var vector = new Vector3();

	for (var i = 0, j = 0; i < bones.length; i++)
	{
		var bone = bones[i];
		if (bone.parent && bone.parent.isBone)
		{	
			boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
			vector.setFromMatrixPosition(boneMatrix);
			position.setXYZ(j, vector.x, vector.y, vector.z);

			boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
			vector.setFromMatrixPosition(boneMatrix);
			position.setXYZ(j + 1, vector.x, vector.y, vector.z);

			j += 2;
		}
	}

	geometry.getAttribute("position").needsUpdate = true;
};
export {SkeletonHelper};
