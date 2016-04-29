function Text3D(text, font, material)
{
	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: font}), material);
	
	this.name = "text";
	this.type = "Text3D";
	
	this.font = font;
	this.text = text;

	this.scale.set(0.01, 0.01, 0.01);
}

//Function Prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);
Text3D.prototype.icon = "editor/files/icons/models/text.png";

//Runtime functions
Text3D.prototype.initialize = initialize;
Text3D.prototype.update = update;

//Auxiliar Functions
Text3D.prototype.setText = setText;

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

//Set Text
function setText(text)
{
	this.text = text;
	this.geometry = new THREE.TextGeometry(this.text, {font: this.font});
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	//TODO <ADD CODE HERE>
	data.object.text = this.text;

	return data;
}