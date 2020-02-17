"use strict";

/**
 * Geometry loader can be used to load geometry files.
 * 
 * @class GeometryLoader
 * @module Loaders
 * @param {Object} manager
 */
function GeometryLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

	this.geometryLoader = new LegacyGeometryLoader();
	this.bufferGeometryLoader = new THREE.BufferGeometryLoader();

	this.shapes = {};
}

/**
 * Set list of shapes to be used by this loader.
 *
 * @method setShapes
 * @param {Array} shapes
 */
GeometryLoader.prototype.setShapes = function(shapes)
{
	this.shapes = shapes;
	return this;
};


/**
 * Load geometry json file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
GeometryLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse geometry json.
 *
 * @method parse
 * @param {Object} json
 * @return {Geometry} Geometry loaded from json.
 */
GeometryLoader.prototype.parse = function(data)
{
	var geometry;
	
	switch(data.type)
	{
		case "PlaneGeometry":
		case "PlaneBufferGeometry":
			geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
			break;

		case "BoxGeometry":
		case "BoxBufferGeometry":
		case "CubeGeometry":
			geometry = new THREE[data.type](data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
			break;

		case "CircleGeometry":
		case "CircleBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.segments, data.thetaStart, data.thetaLength);
			break;

		case "CylinderGeometry":
		case "CylinderBufferGeometry":
			geometry = new THREE[data.type](data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
			break;

		case "ConeGeometry":
		case "ConeBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
			break;

		case "SphereGeometry":
		case "SphereBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
			break;

		case "DodecahedronGeometry":
		case "IcosahedronGeometry":
		case "OctahedronGeometry":
		case "TetrahedronGeometry":
		case "DodecahedronBufferGeometry":
		case "IcosahedronBufferGeometry":
		case "OctahedronBufferGeometry":
		case "TetrahedronBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.detail);
			break;

		case "RingGeometry":
		case "RingBufferGeometry":
			geometry = new THREE[data.type](data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
			break;

		case "TorusGeometry":
		case "TorusBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
			break;

		case "TorusKnotGeometry":
		case "TorusKnotBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q);
			break;

		case "LatheGeometry":
		case "LatheBufferGeometry":
			geometry = new THREE[data.type](data.points, data.segments, data.phiStart, data.phiLength);
			break;
			
		case "PolyhedronGeometry":
		case "PolyhedronBufferGeometry":
			geometry = new THREE[data.type](data.radius, data.indices, data.radius, data.detail);
			break;

		case "ShapeGeometry": 
		case "ShapeBufferGeometry": 
			var geometryShapes = [];
			for(var j = 0, jl = data.shapes.length; j < jl; j++)
			{
				var shape = this.shapes[data.shapes[j]];
				geometryShapes.push(shape);
			}
			geometry = new THREE[data.type](geometryShapes, data.curveSegments);
			break; 

		case "ExtrudeGeometry":
		case "ExtrudeBufferGeometry":
			var geometryShapes = [];
			for(var j = 0; j < data.shapes.length; j ++)
			{
				var shape = this.shapes[data.shapes[j]];
				geometryShapes.push(shape);
			}

			var extrudePath = data.options.extrudePath;
			if(extrudePath !== undefined)
			{
				data.options.extrudePath = new Curves[extrudePath.type]().fromJSON(extrudePath);
			}

			geometry = new Geometries[data.type](geometryShapes, data.options);
			break;

		case "CapsuleBufferGeometry":
			geometry = new THREE.CapsuleBufferGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.capsTopSegments, data.capsBottomSegments, data.thetaStart, data.thetaLength);
			break;

		case "BufferGeometry":
		case "InstancedBufferGeometry":
			geometry = this.bufferGeometryLoader.parse(data);
			break;

		case "Geometry":
			geometry = this.geometryLoader.parse(data.data).geometry;
			break;

		default:
			console.warn("GeometryLoader: Unsupported geometry type " + data.type + ".", data);
			geometry = new THREE.Geometry();
			break;
	}

	geometry.uuid = data.uuid;

	if(data.name !== undefined)
	{
		geometry.name = data.name;
	}
	else
	{
		geometry.name = "geometry";
	}

	return geometry;
};
