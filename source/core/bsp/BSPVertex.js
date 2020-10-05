import {Vector2, Vector3} from "three";

function BSPVertex(x, y, z, normal, uv)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.normal = normal || new Vector3();
	this.uv = uv || new Vector2();
}

BSPVertex.prototype.clone = function()
{
	return new BSPVertex(this.x, this.y, this.z, this.normal.clone(), this.uv.clone());
};

BSPVertex.prototype.add = function(vertex)
{
	this.x += vertex.x;
	this.y += vertex.y;
	this.z += vertex.z;
	return this;
};

BSPVertex.prototype.subtract = function(vertex)
{
	this.x -= vertex.x;
	this.y -= vertex.y;
	this.z -= vertex.z;
	return this;
};

BSPVertex.prototype.multiplyScalar = function(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	return this;
};

BSPVertex.prototype.cross = function(vertex)
{
	var x = this.x;
	var y = this.y;
	var z = this.z;

	this.x = y * vertex.z - z * vertex.y;
	this.y = z * vertex.x - x * vertex.z;
	this.z = x * vertex.y - y * vertex.x;

	return this;
};

BSPVertex.prototype.normalize = function()
{
	var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

	this.x /= length;
	this.y /= length;
	this.z /= length;

	return this;
};

BSPVertex.prototype.dot = function(vertex)
{
	return this.x * vertex.x + this.y * vertex.y + this.z * vertex.z;
};

BSPVertex.prototype.lerp = function(a, t)
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

BSPVertex.prototype.interpolate = function(other, t)
{
	return this.clone().lerp(other, t);
};

BSPVertex.prototype.applyMatrix4 = function(m)
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

export {BSPVertex};
