//Texture image
function Texture(url)
{
	//Create video element
	this.img = document.createElement("img");
	this.img.src = url;

	//Source URL
	this.url = url;

	//Create Texture part of object
	THREE.Texture.call(this, this.img);

	//Update texture content
	this.needsUpdate = true;
}

//Functions prototype
Texture.prototype = Object.create(THREE.Texture.prototype);
Texture.prototype.update = update;

//Update texture
function update(){}
