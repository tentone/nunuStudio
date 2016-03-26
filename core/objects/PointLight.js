function PointLight(hex, intensity, distance, decay)
{
	THREE.PointLight.call(this, hex, intensity, distance, decay);
	this.updateable = true;
	this.name = "point_light";
	this.icon = "editor/files/icons/lights/point.png";
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);
PointLight.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].updateable)
		{
			this.children[i].update();
		}
	}
}
