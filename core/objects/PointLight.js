function PointLight(hex, intensity, distance, decay)
{
	THREE.PointLight.call(this, hex, intensity, distance, decay);

	this.name = "point_light";
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);
PointLight.prototype.icon = "editor/files/icons/lights/point.png";
PointLight.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
