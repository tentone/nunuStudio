"use strict";

function CubemapFlatPreview(envMap, faceSizePx, paddingLeftPx, paddingRightPx)
{
	var faces = [], faceOffsets = [];
	var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	var scene  = new THREE.Scene();

	function setEnvLookupVector(vIdx, vEnvLookup, outputArray)
	{
		outputArray[3 * vIdx] = vEnvLookup[0];
		outputArray[3 * vIdx + 1] = vEnvLookup[1];
		outputArray[3 * vIdx + 2] = vEnvLookup[2];
	}

	//Each vertex of a cube face has an associated envmap lookup vector. These vectors are interpolated for each fragment and used to lookup envmap pixels.
	var geometryEnvLookupVectors =
	[
		//up left,  up right,   low left,    low right
		[[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1]], // cube face 0
		[[-1, 1, -1], [-1, 1, 1], [-1, -1, -1], [-1, -1, 1]], // face 1
		[[-1, 1, -1], [1, 1, -1], [-1, 1, 1], [1, 1, 1]], // face 2
		[[-1, -1, 1], [1, -1, 1], [-1, -1, -1], [1, -1, -1]], // face 3
		[[-1, 1, 1], [1, 1, 1], [-1, -1, 1], [1, -1, 1]], // face 4
		[[1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]] // face 5
	];

	var material = new THREE.ShaderMaterial(
	{
		vertexShader: "attribute vec3 envLookup; \
		varying vec3 vEnvLookup; \
		void main() {\
			vEnvLookup = envLookup;\
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\
		}",
		fragmentShader: "uniform samplerCube envMap;\
		varying vec3 vEnvLookup;\
		void main() {\
			gl_FragColor = textureCube(envMap, vEnvLookup);\
		}",
		uniforms:
		{
			envMap: {type: "t", value: envMap}
		}
	});

	for(var i = 0; i < 6; i++)
	{
		var geometry = new THREE.PlaneBufferGeometry(faceSizePx, faceSizePx);
		var envLookupArray = new Float32Array(12);
		geometry.addAttribute("envLookup", new THREE.BufferAttribute(envLookupArray, 3));
		for(var j = 0; j < 4; j++)
		{
			setEnvLookupVector(j, geometryEnvLookupVectors[i][j], envLookupArray);
		}
		faces[i] = new THREE.Mesh(geometry, material);
		scene.add(faces[i]);
	}

	// Faces layout:
	//   2
	// 1 4 0 5
	//   3
	faceOffsets[0] = [2 * faceSizePx, faceSizePx];
	faceOffsets[1] = [0, faceSizePx];
	faceOffsets[2] = [faceSizePx, 0];
	faceOffsets[3] = [faceSizePx, 2 * faceSizePx];
	faceOffsets[4] = [faceSizePx, faceSizePx];
	faceOffsets[5] = [3 * faceSizePx, faceSizePx];

	this.setSize = function(width, height)
	{
		var halfWidth = width / 2;
		var halfHeight = height / 2;

		camera.left = -halfWidth;
		camera.right = halfWidth;
		camera.top = halfHeight;
		camera.bottom = -halfHeight;
		camera.updateProjectionMatrix();

		var commonOffsetX = -halfWidth + paddingLeftPx + faceSizePx / 2;
		var commonOffsetY = halfHeight - paddingRightPx - faceSizePx / 2;

		for(var i = 0; i < faces.length; i += 1)
		{
			faces[i].position.set(commonOffsetX + faceOffsets[i][0], commonOffsetY - faceOffsets[i][1], 0);
		}
	};

	this.render = function(renderer)
	{
		renderer.render(scene, camera);
	};
};