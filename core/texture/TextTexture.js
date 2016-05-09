function TextTexture()
{
	this.text = "text";
	
	this.span = document.createElement("span");
	this.span.innerHTML = "text";

	THREE.CanvasTexture.call(this, this.span);
}

//Functions prototype
TextTexture.prototype = Object.create(THREE.CanvasTexture.prototype);
TextTexture.prototype.update = update;

//Update texture
function update(){}
