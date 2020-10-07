function BSPNode(polygons)
{
	var polygonCount;
	var front = [];
	var back = [];

	this.polygons = [];
	this.front = this.back = undefined;

	if (!(polygons instanceof Array) || polygons.length === 0) {return;}

	this.divider = polygons[0].clone();

	for (var i = 0, polygonCount = polygons.length; i < polygonCount; i++)
	{
		this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
	}

	if (front.length > 0)
	{
		this.front = new BSPNode(front);
	}

	if (back.length > 0)
	{
		this.back = new BSPNode(back);
	}
};

BSPNode.isConvex = function(polygons)
{
	for (var i = 0; i < polygons.length; i++)
	{
		for (var j = 0; j < polygons.length; j++)
		{
			if (i !== j && polygons[i].classifySide(polygons[j]) !== BACK)
			{
				return false;
			}
		}
	}

	return true;
};

BSPNode.prototype.build = function(polygons)
{
	var front = [];
	var back = [];

	if (!this.divider)
	{
		this.divider = polygons[0].clone();
	}

	for (var i = 0, polygonCount = polygons.length; i < polygonCount; i++)
	{
		this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
	}

	if (front.length > 0)
	{
		if (!this.front) {this.front = new BSPNode();}
		this.front.build(front);
	}

	if (back.length > 0)
	{
		if (!this.back) {this.back = new BSPNode();}
		this.back.build(back);
	}
};

BSPNode.prototype.allPolygons = function()
{
	var polygons = this.polygons.slice();

	if (this.front) {polygons = polygons.concat(this.front.allPolygons());}
	if (this.back) {polygons = polygons.concat(this.back.allPolygons());}

	return polygons;
};

BSPNode.prototype.clone = function()
{
	var node = new BSPNode();

	node.divider = this.divider.clone();
	node.polygons = this.polygons.map(function(polygon)
	{
		return polygon.clone();
	});
	node.front = this.front && this.front.clone();
	node.back = this.back && this.back.clone();

	return node;
};

BSPNode.prototype.invert = function()
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
BSPNode.prototype.clipPolygons = function(polygons)
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

BSPNode.prototype.clipTo = function(node)
{
	this.polygons = node.clipPolygons(this.polygons);
	if (this.front) {this.front.clipTo(node);}
	if (this.back) {this.back.clipTo(node);}
};

export {BSPNode};
