function HemisphereLight(skyColorHex, groundColorHex, intensity)
{
	THREE.HemisphereLight.call(this, skyColorHex, groundColorHex, intensity);

	this.name = "hemisphere_light";
}

//Function Prototype
HemisphereLight.prototype = Object.create(THREE.HemisphereLight.prototype);
HemisphereLight.prototype.icon = "editor/files/icons/lights/hemisphere.png";

//Runtime functions
HemisphereLight.prototype.update = update;
HemisphereLight.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}