function Positionbox(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "txt_box" + Positionbox.id;
	Positionbox.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.type = "text";
	this.element.style.position = "absolute";

	//X Text
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("X");
	text.position.set(0, 10);
	text.updateInterface();

	//X
	this.x = new Numberbox(this.element);
	this.x.position.set(15, 0);
	this.x.size.set(60, 18);
	this.x.updateInterface();

	//Y Text
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Y");
	text.position.set(80, 10);
	text.updateInterface();

	//Y
	this.y = new Numberbox(this.element);
	this.y.position.set(95, 0);
	this.y.size.set(60, 18);
	this.y.updateInterface();

	//Z Text
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Z");
	text.position.set(160, 10);
	text.updateInterface();

	//Z
	this.z = new Numberbox(this.element);
	this.z.position.set(175, 0);
	this.z.size.set(60, 18);
	this.z.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Positionbox ID counter
Positionbox.id = 0;

//Functions Prototype
Positionbox.prototype.update = update;
Positionbox.prototype.updateInterface = updateInterface;
Positionbox.prototype.destroy = destroy;
Positionbox.prototype.setOnChange = setOnChange;
Positionbox.prototype.getValue = getValue;
Positionbox.prototype.setValue = setValue;

//Get value of position box
function getValue()
{
	return {x: this.x.getValue(), y: this.y.getValue(), z: this.z.getValue()};
}

//Set value of position box
function setValue(x, y, z)
{
	this.x.setValue(x);
	this.y.setValue(y);
	this.z.setValue(z);
}

//Set onchange callback
function setOnChange(callback)
{
	this.x.setOnChange(callback);
	this.y.setOnChange(callback);
	this.z.setOnChange(callback);
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Update Interface
function updateInterface()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}