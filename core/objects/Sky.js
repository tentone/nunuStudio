function Sky()
{
	THREE.DirectionalLight.call(this, 0xffffaa, 0.3);

	this.name = "sky";

	this.castShadow = true;
	
	//Sun
	this.distance = 200;
	this.day_time = 10;

	//Runtime stuff
	this.time = 0;
}

//Function Prototype
Sky.prototype = Object.create(THREE.DirectionalLight.prototype);
Sky.prototype.icon = "editor/files/icons/lights/sky.png";

//Runtime functions
Sky.prototype.initialize = initialize;
Sky.prototype.update = update;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{
	this.time += App.delta_time / 1000;

	//Update positiond
	this.position.x = this.distance * Math.cos(this.time);
	this.position.y = this.distance * Math.sin(this.time);

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
