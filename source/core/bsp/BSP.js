import {Geometry, Matrix4, Mesh, Face3, Vector2, Face4, Vector3} from "three";
import {BSPNode} from "./BSPNode.js";
import {BSPPolygon} from "./BSPPolygon.js";
import {BSPVertex} from "./BSPVertex.js";

function BSP(geometry)
{
	// Convert Geometry to BSP
	var length;
	var face, vertex, faceVertexUvs, uvs;
	var polygon;
	var polygons = [];

	if (geometry instanceof Geometry)
	{
		this.matrix = new Matrix4();
	}
	else if (geometry instanceof Mesh)
	{
		// #todo: add hierarchy support
		geometry.updateMatrix();
		this.matrix = geometry.matrix.clone();
		geometry = geometry.geometry;
	}
	else if (geometry instanceof BSPNode)
	{
		this.tree = geometry;
		this.matrix = new Matrix4();
		return this;
	}
	else
	{
		throw new Error("nunuStudio: Given geometry is unsupported");
	}

	for (var i = 0, length = geometry.faces.length; i < length; i++)
	{
		face = geometry.faces[i];
		faceVertexUvs = geometry.faceVertexUvs[0][i];
		polygon = new BSPPolygon();

		if (face instanceof Face3)
		{
			vertex = geometry.vertices[face.a];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[0].x, faceVertexUvs[0].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.b];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[1].x, faceVertexUvs[1].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[1], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.c];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[2].x, faceVertexUvs[2].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[2], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);
		}
		else if (typeof Face4)
		{
			vertex = geometry.vertices[face.a];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[0].x, faceVertexUvs[0].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.b];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[1].x, faceVertexUvs[1].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[1], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.c];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[2].x, faceVertexUvs[2].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[2], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.d];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[3].x, faceVertexUvs[3].y) : null;
			vertex = new BSPVertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[3], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);
		}
		else
		{
			throw new Error("Invalid face type at index " + i);
		}

		polygon.calculateProperties();
		polygons.push(polygon);
	};

	this.tree = new BSPNode(polygons);
};

BSP.prototype.subtract = function(otherTree)
{
	var a = this.tree.clone();
	var b = otherTree.tree.clone();

	a.invert();
	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	a.invert();
	a = new BSP(a);
	a.matrix = this.matrix;
	return a;
};

BSP.prototype.union = function(otherTree)
{
	var a = this.tree.clone();
	var b = otherTree.tree.clone();

	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	a = new BSP(a);
	a.matrix = this.matrix;
	return a;
};

BSP.prototype.intersect = function(otherTree)
{
	var a = this.tree.clone();
	var b = otherTree.tree.clone();

	a.invert();
	b.clipTo(a);
	b.invert();
	a.clipTo(b);
	b.clipTo(a);
	a.build(b.allPolygons());
	a.invert();
	a = new BSP(a);
	a.matrix = this.matrix;
	return a;
};

BSP.prototype.toGeometry = function()
{
	var matrix = new Matrix4().getInverse(this.matrix);
	var geometry = new Geometry();
	var polygons = this.tree.allPolygons();
	var polygonCount = polygons.length;
	var polygon, polygonVerticeCount;
	var verticeDict = {};
	var vertexIdxA, vertexIdxB, vertexIdxC;
	var vertex, face;
	var verticeUvs;

	for (var i = 0; i < polygonCount; i++)
	{
		polygon = polygons[i];
		polygonVerticeCount = polygon.vertices.length;

		for (var j = 2; j < polygonVerticeCount; j++)
		{
			verticeUvs = [];

			vertex = polygon.vertices[0];
			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));
			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);

			if (typeof verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] !== "undefined")
			{
				vertexIdxA = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxA = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] = geometry.vertices.length - 1;
			}

			vertex = polygon.vertices[j - 1];

			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));

			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);
			if (typeof verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] !== "undefined")
			{
				vertexIdxB = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxB = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] = geometry.vertices.length - 1;
			}

			vertex = polygon.vertices[j];
			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));
			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);
			if (typeof verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] !== "undefined")
			{
				vertexIdxC = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxC = verticeDict[vertex.x + "," + vertex.y + "," + vertex.z] = geometry.vertices.length - 1;
			}

			face = new Face3(vertexIdxA, vertexIdxB, vertexIdxC, new Vector3(polygon.normal.x, polygon.normal.y, polygon.normal.z));

			geometry.faces.push(face);
			geometry.faceVertexUvs[0].push(verticeUvs);
		}

	}
	return geometry;
};

BSP.prototype.toMesh = function(material)
{
	var geometry = this.toGeometry();
	var mesh = new Mesh(geometry, material);

	mesh.position.setFromMatrixPosition(this.matrix);
	mesh.rotation.setFromRotationMatrix(this.matrix);

	return mesh;
};

export {BSP};
