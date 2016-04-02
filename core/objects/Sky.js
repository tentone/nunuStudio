function Sky()
{
	THREE.DirectionalLight.call(this, 0xffffaa, 0.3);

	this.name = "sky";

	this.castShadow = true;
	
	this.angle = 0;
	this.distance = 20;
	this.day_time = 10; //seconds
}

Sky.prototype = Object.create(THREE.DirectionalLight.prototype);
Sky.prototype.icon = "editor/files/icons/lights/sky.png";
Sky.prototype.update = update;

function update()
{
	//Update position
	this.position.x = this.distance * Math.cos(App.time / 10000);
	this.position.y = this.distance * Math.sin(App.time / 10000);

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
