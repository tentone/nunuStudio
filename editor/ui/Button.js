function Button(parent, id)
{
	if(id === undefined)
	{
		var id = "but" + Button.id;
		Button.id++;
	}

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = "#333333";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.text = "button";
	this.callback = null;

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		console.log("coco");
		if(self.callback != null)
		{
			self.callback();
		}
	};

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.element.style.backgroundColor = "#555555";
	};

	this.element.onmouseout = function()
	{
		self.element.style.backgroundColor = "#333333";
	};

	//Update element
	this.updateInterface();

	//Add element to document
	document.body.appendChild(this.element);
}

//Button conter
Button.id = 0;

//Functions Prototype
Button.prototype.update = update;
Button.prototype.updateInterface = updateInterface;
Button.prototype.setCallback = setCallback;

//Update status
function update(){}

//Set button callback function
function setCallback(callback)
{
	this.callback = callback;
}

//Update Button Size
function updateInterface()
{
	this.element.innerHTML = "<p>" + this.text + "</p>";
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}