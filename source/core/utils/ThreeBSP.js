import {Geometry, Matrix4, Mesh, Face3, Vector2, Face4, Vector3} from "three";

var EPSILON = 1e-5;
var COPLANAR = 0;
var FRONT = 1;
var BACK = 2;
var SPANNING = 3;

function ThreeBSP(geometry)
{
	// Convert Geometry to ThreeBSP
	var i, LengthI,
		face, vertex, faceVertexUvs, uvs,
		polygon,
		polygons = [];

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
	else if (geometry instanceof ThreeBSP.Node)
	{
		this.tree = geometry;
		this.matrix = new Matrix4();
		return this;
	}
	else
	{
		throw new Error('ThreeBSP: Given geometry is unsupported');
	}

	for (i = 0, LengthI = geometry.faces.length; i < LengthI; i++)
	{
		face = geometry.faces[i];
		faceVertexUvs = geometry.faceVertexUvs[0][i];
		polygon = new ThreeBSP.Polygon();

		if (face instanceof Face3)
		{
			vertex = geometry.vertices[face.a];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[0].x, faceVertexUvs[0].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.b];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[1].x, faceVertexUvs[1].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[1], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.c];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[2].x, faceVertexUvs[2].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[2], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);
		}
		else if (typeof Face4)
		{
			vertex = geometry.vertices[face.a];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[0].x, faceVertexUvs[0].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[0], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.b];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[1].x, faceVertexUvs[1].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[1], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.c];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[2].x, faceVertexUvs[2].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[2], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);

			vertex = geometry.vertices[face.d];
			uvs = faceVertexUvs ? new Vector2(faceVertexUvs[3].x, faceVertexUvs[3].y) : null;
			vertex = new ThreeBSP.Vertex(vertex.x, vertex.y, vertex.z, face.vertexNormals[3], uvs);
			vertex.applyMatrix4(this.matrix);
			polygon.vertices.push(vertex);
		}
		else
		{
			throw new Error('Invalid face type at index ' + i);
		}

		polygon.calculateProperties();
		polygons.push(polygon);
	};

	this.tree = new ThreeBSP.Node(polygons);
};
ThreeBSP.prototype.subtract = function(otherTree)
{
	var a = this.tree.clone(),
		b = otherTree.tree.clone();

	a.invert();
	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	a.invert();
	a = new ThreeBSP(a);
	a.matrix = this.matrix;
	return a;
};
ThreeBSP.prototype.union = function(otherTree)
{
	var a = this.tree.clone(),
		b = otherTree.tree.clone();

	a.clipTo(b);
	b.clipTo(a);
	b.invert();
	b.clipTo(a);
	b.invert();
	a.build(b.allPolygons());
	a = new ThreeBSP(a);
	a.matrix = this.matrix;
	return a;
};
ThreeBSP.prototype.intersect = function(otherTree)
{
	var a = this.tree.clone(),
		b = otherTree.tree.clone();

	a.invert();
	b.clipTo(a);
	b.invert();
	a.clipTo(b);
	b.clipTo(a);
	a.build(b.allPolygons());
	a.invert();
	a = new ThreeBSP(a);
	a.matrix = this.matrix;
	return a;
};
ThreeBSP.prototype.toGeometry = function()
{
	var i, j,
		matrix = new Matrix4().getInverse(this.matrix),
		geometry = new Geometry(),
		polygons = this.tree.allPolygons(),
		polygonCount = polygons.length,
		polygon, polygonVerticeCount,
		verticeDict = {},
		vertexIdxA, vertexIdxB, vertexIdxC,
		vertex, face,
		verticeUvs;

	for (i = 0; i < polygonCount; i++)
	{
		polygon = polygons[i];
		polygonVerticeCount = polygon.vertices.length;

		for (j = 2; j < polygonVerticeCount; j++)
		{
			verticeUvs = [];

			vertex = polygon.vertices[0];
			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));
			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);

			if (typeof verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] !== 'undefined')
			{
				vertexIdxA = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxA = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] = geometry.vertices.length - 1;
			}

			vertex = polygon.vertices[j - 1];
			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));
			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);
			if (typeof verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] !== 'undefined')
			{
				vertexIdxB = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxB = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] = geometry.vertices.length - 1;
			}

			vertex = polygon.vertices[j];
			verticeUvs.push(new Vector2(vertex.uv.x, vertex.uv.y));
			vertex = new Vector3(vertex.x, vertex.y, vertex.z);
			vertex.applyMatrix4(matrix);
			if (typeof verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] !== 'undefined')
			{
				vertexIdxC = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z];
			}
			else
			{
				geometry.vertices.push(vertex);
				vertexIdxC = verticeDict[vertex.x + ',' + vertex.y + ',' + vertex.z] = geometry.vertices.length - 1;
			}

			face = new Face3(
				vertexIdxA,
				vertexIdxB,
				vertexIdxC,
				new Vector3(polygon.normal.x, polygon.normal.y, polygon.normal.z)
			);

			geometry.faces.push(face);
			geometry.faceVertexUvs[0].push(verticeUvs);
		}

	}
	return geometry;
};
ThreeBSP.prototype.toMesh = function(material)
{
	var geometry = this.toGeometry(),
		mesh = new Mesh(geometry, material);

	mesh.position.setFromMatrixPosition(this.matrix);
	mesh.rotation.setFromRotationMatrix(this.matrix);

	return mesh;
};


ThreeBSP.Polygon = function(vertices)
{
	if (!(vertices instanceof Array))
	{
		vertices = [];
	}

	this.vertices = vertices;
	if (vertices.length > 0)
	{
		this.calculateProperties();
	}
	else
	{
		this.normal = this.w = undefined;
	}
};
ThreeBSP.Polygon.prototype.calculateProperties = function()
{
	var a = this.vertices[0],
		b = this.vertices[1],
		c = this.vertices[2];

	this.normal = b.clone().subtract(a).cross(
		c.clone().subtract(a)
	).normalize();

	this.w = this.normal.clone().dot(a);

	return this;
};
ThreeBSP.Polygon.prototype.clone = function()
{
	var i, verticeCount,
		polygon = new ThreeBSP.Polygon();

	for (i = 0, verticeCount = this.vertices.length; i < verticeCount; i++)
	{
		polygon.vertices.push(this.vertices[i].clone());
	};
	polygon.calculateProperties();

	return polygon;
};

ThreeBSP.Polygon.prototype.flip = function()
{
	var i, vertices = [];

	this.normal.multiplyScalar(-1);
	this.w *= -1;

	for (i = this.vertices.length - 1; i >= 0; i--)
	{
		vertices.push(this.vertices[i]);
	};
	this.vertices = vertices;

	return this;
};
ThreeBSP.Polygon.prototype.classifyVertex = function(vertex)
{
	var sideValue = this.normal.dot(vertex) - this.w;

	if (sideValue < -EPSILON)
	{
		return BACK;
	}
	else if (sideValue > EPSILON)
	{
		return FRONT;
	}
	else
	{
		return COPLANAR;
	}
};
ThreeBSP.Polygon.prototype.classifySide = function(polygon)
{
	var i, vertex, classification,
		numPositive = 0,
		numNegative = 0,
		verticeCount = polygon.vertices.length;

	for (i = 0; i < verticeCount; i++)
	{
		vertex = polygon.vertices[i];
		classification = this.classifyVertex(vertex);
		if (classification === FRONT)
		{
			numPositive++;
		}
		else if (classification === BACK)
		{
			numNegative++;
		}
	}

	if (numPositive > 0 && numNegative === 0)
	{
		return FRONT;
	}
	else if (numPositive === 0 && numNegative > 0)
	{
		return BACK;
	}
	else if (numPositive === 0 && numNegative === 0)
	{
		return COPLANAR;
	}
	else
	{
		return SPANNING;
	}
};
ThreeBSP.Polygon.prototype.splitPolygon = function(polygon, coplanarFront, coplanarBack, front, back)
{
	var classification = this.classifySide(polygon);

	if (classification === COPLANAR)
	{

		(this.normal.dot(polygon.normal) > 0 ? coplanarFront : coplanarBack).push(polygon);

	}
	else if (classification === FRONT)
	{

		front.push(polygon);

	}
	else if (classification === BACK)
	{

		back.push(polygon);

	}
	else
	{

		var verticeCount,
			i, j, ti, tj, vi, vj,
			t, v,
			f = [],
			b = [];

		for (i = 0, verticeCount = polygon.vertices.length; i < verticeCount; i++)
		{

			j = (i + 1) % verticeCount;
			vi = polygon.vertices[i];
			vj = polygon.vertices[j];
			ti = this.classifyVertex(vi);
			tj = this.classifyVertex(vj);

			if (ti !== BACK) {f.push(vi);}
			if (ti !== FRONT) {b.push(vi);}
			if ((ti | tj) === SPANNING)
			{
				t = (this.w - this.normal.dot(vi)) / this.normal.dot(vj.clone().subtract(vi));
				v = vi.interpolate(vj, t);
				f.push(v);
				b.push(v);
			}
		}


		if (f.length >= 3) {front.push(new ThreeBSP.Polygon(f).calculateProperties());}
		if (b.length >= 3) {back.push(new ThreeBSP.Polygon(b).calculateProperties());}
	}
};

ThreeBSP.Vertex = function(x, y, z, normal, uv)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.normal = normal || new Vector3();
	this.uv = uv || new Vector2();
};
ThreeBSP.Vertex.prototype.clone = function()
{
	return new ThreeBSP.Vertex(this.x, this.y, this.z, this.normal.clone(), this.uv.clone());
};
ThreeBSP.Vertex.prototype.add = function(vertex)
{
	this.x += vertex.x;
	this.y += vertex.y;
	this.z += vertex.z;
	return this;
};
ThreeBSP.Vertex.prototype.subtract = function(vertex)
{
	this.x -= vertex.x;
	this.y -= vertex.y;
	this.z -= vertex.z;
	return this;
};
ThreeBSP.Vertex.prototype.multiplyScalar = function(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	return this;
};
ThreeBSP.Vertex.prototype.cross = function(vertex)
{
	var x = this.x,
		y = this.y,
		z = this.z;

	this.x = y * vertex.z - z * vertex.y;
	this.y = z * vertex.x - x * vertex.z;
	this.z = x * vertex.y - y * vertex.x;

	return this;
};
ThreeBSP.Vertex.prototype.normalize = function()
{
	var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

	this.x /= length;
	this.y /= length;
	this.z /= length;

	return this;
};
ThreeBSP.Vertex.prototype.dot = function(vertex)
{
	return this.x * vertex.x + this.y * vertex.y + this.z * vertex.z;
};
ThreeBSP.Vertex.prototype.lerp = function(a, t)
{
	this.add(
		a.clone().subtract(this).multiplyScalar(t)
	);

	this.normal.add(
		a.normal.clone().sub(this.normal).multiplyScalar(t)
	);

	this.uv.add(
		a.uv.clone().sub(this.uv).multiplyScalar(t)
	);

	return this;
};
ThreeBSP.Vertex.prototype.interpolate = function(other, t)
{
	return this.clone().lerp(other, t);
};
ThreeBSP.Vertex.prototype.applyMatrix4 = function(m)
{

	// input: Matrix4 affine matrix

	var x = this.x,
		y = this.y,
		z = this.z;

	var e = m.elements;

	this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
	this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
	this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

	return this;

};


ThreeBSP.Node = function(polygons)
{
	var i, polygonCount,
		front = [],
		back = [];

	this.polygons = [];
	this.front = this.back = undefined;

	if (!(polygons instanceof Array) || polygons.length === 0) {return;}

	this.divider = polygons[0].clone();

	for (i = 0, polygonCount = polygons.length; i < polygonCount; i++)
	{
		this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
	}

	if (front.length > 0)
	{
		this.front = new ThreeBSP.Node(front);
	}

	if (back.length > 0)
	{
		this.back = new ThreeBSP.Node(back);
	}
};
ThreeBSP.Node.isConvex = function(polygons)
{
	var i, j;
	for (i = 0; i < polygons.length; i++)
	{
		for (j = 0; j < polygons.length; j++)
		{
			if (i !== j && polygons[i].classifySide(polygons[j]) !== BACK)
			{
				return false;
			}
		}
	}
	return true;
};
ThreeBSP.Node.prototype.build = function(polygons)
{
	var i, polygonCount,
		front = [],
		back = [];

	if (!this.divider)
	{
		this.divider = polygons[0].clone();
	}

	for (i = 0, polygonCount = polygons.length; i < polygonCount; i++)
	{
		this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
	}

	if (front.length > 0)
	{
		if (!this.front) {this.front = new ThreeBSP.Node();}
		this.front.build(front);
	}

	if (back.length > 0)
	{
		if (!this.back) {this.back = new ThreeBSP.Node();}
		this.back.build(back);
	}
};
ThreeBSP.Node.prototype.allPolygons = function()
{
	var polygons = this.polygons.slice();
	if (this.front) {polygons = polygons.concat(this.front.allPolygons());}
	if (this.back) {polygons = polygons.concat(this.back.allPolygons());}
	return polygons;
};
ThreeBSP.Node.prototype.clone = function()
{
	var node = new ThreeBSP.Node();

	node.divider = this.divider.clone();
	node.polygons = this.polygons.map(function(polygon)
	{
		return polygon.clone();
	});
	node.front = this.front && this.front.clone();
	node.back = this.back && this.back.clone();

	return node;
};
ThreeBSP.Node.prototype.invert = function()
{
	var i, polygonCount, temp;

	for (i = 0, polygonCount = this.polygons.length; i < polygonCount; i++)
	{
		this.polygons[i].flip();
	}

	this.divider.flip();
	if (this.front) {this.front.invert();}
	if (this.back) {this.back.invert();}

	temp = this.front;
	this.front = this.back;
	this.back = temp;

	return this;
};
ThreeBSP.Node.prototype.clipPolygons = function(polygons)
{
	var i, polygonCount;

	if (!this.divider) {return polygons.slice();}

	var front = [];
	var back = [];

	for (i = 0, polygonCount = polygons.length; i < polygonCount; i++)
	{
		this.divider.splitPolygon(polygons[i], front, back, front, back);
	}

	if (this.front) {front = this.front.clipPolygons(front);}
	if (this.back) {back = this.back.clipPolygons(back);}
	else {back = [];}

	return front.concat(back);
};

ThreeBSP.Node.prototype.clipTo = function(node)
{
	this.polygons = node.clipPolygons(this.polygons);
	if (this.front) {this.front.clipTo(node);}
	if (this.back) {this.back.clipTo(node);}
};


export {ThreeBSP};
