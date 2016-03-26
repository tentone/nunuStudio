function SpotLight(hex, intensity, distance, angle, exponent, decay)
{
	THREE.SpotLight.call(this, hex, intensity, distance, angle, exponent, decay);
	this.updateable = true;
	this.name = "spot_light";
	this.icon = "editor/files/icons/lights/spot.png";
}

SpotLight.prototype = Object.create(THREE.SpotLight.prototype);
SpotLight.prototype.update = update;

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
