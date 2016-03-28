function SpotLight(hex, intensity, distance, angle, exponent, decay)
{
	THREE.SpotLight.call(this, hex, intensity, distance, angle, exponent, decay);

	this.name = "spot_light";
}

SpotLight.prototype = Object.create(THREE.SpotLight.prototype);
SpotLight.prototype.icon = "editor/files/icons/lights/spot.png";
SpotLight.prototype.updateable = true;
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
