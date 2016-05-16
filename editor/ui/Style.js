function Style(parent)
{
	//Create element
	this.element = document.createElement("link");
	this.element.rel = "stylesheet"
	this.element.href = "";

	//Add element to document
	document.body.appendChild(this.element);
}

//Functions Prototype
Style.prototype.update = update;
Style.prototype.setStyleSheet = setStyleSheet;
Style.prototype.destroy = destroy;

//Remove element
function destroy()
{
	try
	{
		document.body.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Set CSS file
function setStyleSheet(file)
{
	this.element.href = file;
}
