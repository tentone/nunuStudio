var EPSILON = 1e-5;
var COPLANAR = 0;
var FRONT = 1;
var BACK = 2;
var SPANNING = 3;

function BSPPolygon(vertices)
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
}

BSPPolygon.prototype.calculateProperties = function()
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

BSPPolygon.prototype.clone = function()
{
	var i, verticeCount,
		polygon = new BSPPolygon();

	for (i = 0, verticeCount = this.vertices.length; i < verticeCount; i++)
	{
		polygon.vertices.push(this.vertices[i].clone());
	};
	polygon.calculateProperties();

	return polygon;
};

BSPPolygon.prototype.flip = function()
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

BSPPolygon.prototype.classifyVertex = function(vertex)
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

BSPPolygon.prototype.classifySide = function(polygon)
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

BSPPolygon.prototype.splitPolygon = function(polygon, coplanarFront, coplanarBack, front, back)
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


		if (f.length >= 3) {front.push(new BSPPolygon(f).calculateProperties());}
		if (b.length >= 3) {back.push(new BSPPolygon(b).calculateProperties());}
	}
};

export {BSPPolygon};
