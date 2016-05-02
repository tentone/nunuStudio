function Text3D(text, material, font)
{
	if(font === undefined)
	{
		this.font = new FontLoader().parse(App.readFile("data/fonts/helvetiker_bold.typeface.js"));
	}
	else
	{
		this.font = new FontLoader().parse(font);
	}

	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: this.font}), material);
	
	this.name = "text";
	this.type = "Text3D";

	this.text = text;
}

//Function Prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);
Text3D.prototype.icon = "editor/files/icons/models/text.png";

//Overrided functions
Text3D.prototype.initialize = initialize;
Text3D.prototype.update = update;

//Auxiliar functions
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
	this.geometry.dispose();
	this.geometry = new THREE.TextGeometry(this.text, {font: this.font});
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.text = this.text;

	return data;
}
