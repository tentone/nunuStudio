import {ShaderMaterial, OrthographicCamera, Scene, PlaneBufferGeometry, BufferAttribute, Mesh} from "three";
import CubemapFlatVertex from "./cubemap_flat_vertex.glsl";
import CubemapFlatFragment from "./cubemap_flat_fragment.glsl";

/**
 * The cube map flat renderer generates preview for cube map textures.
 *
 * Is draws the faces of the cube map into a flat surface.
 *
 * @class CubemapFlatRenderer
 */
function CubemapFlatRenderer(envMap, faceSize, paddingLeft, paddingRight)
{
	this.faceSize = faceSize;
	this.paddingLeft = paddingLeft;
	this.paddingRight = paddingRight;

	function setEnvLookupVector(vIdx, vEnvLookup, outputArray)
	{
		outputArray[3 * vIdx] = vEnvLookup[0];
		outputArray[3 * vIdx + 1] = vEnvLookup[1];
		outputArray[3 * vIdx + 2] = vEnvLookup[2];
	}

	// Each vertex of a cube face has an associated envmap lookup vector. These vectors are interpolated for each fragment and used to lookup envmap pixels.
	var geometryEnvLookupVectors =
	[
		// up left,  up right,   low left,    low right
		[[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1]], // cube face 0
		[[-1, 1, -1], [-1, 1, 1], [-1, -1, -1], [-1, -1, 1]], // face 1
		[[-1, 1, -1], [1, 1, -1], [-1, 1, 1], [1, 1, 1]], // face 2
		[[-1, -1, 1], [1, -1, 1], [-1, -1, -1], [1, -1, -1]], // face 3
		[[-1, 1, 1], [1, 1, 1], [-1, -1, 1], [1, -1, 1]], // face 4
		[[1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]] // face 5
	];

	var material = new ShaderMaterial(
		{
			vertexShader: CubemapFlatVertex,
			fragmentShader: CubemapFlatFragment,
			uniforms:
		{envMap: {type: "t", value: envMap}}
		});
	
	this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene = new Scene();

	this.faces = [];
	for (var i = 0; i < 6; i++)
	{
		var geometry = new PlaneBufferGeometry(faceSize, faceSize);
		var envLookupArray = new Float32Array(12);
		geometry.setAttribute("envLookup", new BufferAttribute(envLookupArray, 3));
		for (var j = 0; j < 4; j++)
		{
			setEnvLookupVector(j, geometryEnvLookupVectors[i][j], envLookupArray);
		}
		this.faces[i] = new Mesh(geometry, material);
		this.scene.add(this.faces[i]);
	}

	/**
	 * Faces layout offsets.
	 * --2
	 * 1 4 0 5
	 * --3
	 *
	 * @attribute faceOffsets
	 * @type {Array}
	 */
	this.faceOffsets =
	[
		[2 * faceSize, faceSize],
		[0, faceSize],
		[faceSize, 0],
		[faceSize, 2 * faceSize],
		[faceSize, faceSize],
		[3 * faceSize, faceSize]
	];
};

CubemapFlatRenderer.prototype.setSize = function(width, height)
{
	var halfWidth = width / 2;
	var halfHeight = height / 2;

	this.camera.left = -halfWidth;
	this.camera.right = halfWidth;
	this.camera.top = halfHeight;
	this.camera.bottom = -halfHeight;
	this.camera.updateProjectionMatrix();

	var offsetX = -halfWidth + this.paddingLeft + this.faceSize / 2;
	var offsetY = halfHeight - this.paddingRight - this.faceSize / 2;

	for (var i = 0; i < this.faces.length; i += 1)
	{
		this.faces[i].position.set(offsetX + this.faceOffsets[i][0], offsetY - this.faceOffsets[i][1], 0);
	}
};

CubemapFlatRenderer.prototype.render = function(renderer)
{
	renderer.render(this.scene, this.camera);
};
export {CubemapFlatRenderer};
