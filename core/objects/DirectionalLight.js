function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);
	this.updateable = true;
}

DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);
DirectionalLight.prototype.update = update;

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
