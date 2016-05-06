function FileExplorer(parent)
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
	var id = "fe" + FileExplorer.id;
	FileExplorer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	
	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Files in explorer
	this.files_size = new THREE.Vector2(50, 50);
	this.files_spacing = 5;
	this.files = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//FileExplorer conter
FileExplorer.id = 0;

//Functions Prototype
FileExplorer.prototype.update = update;
FileExplorer.prototype.updateInterface = updateInterface;
FileExplorer.prototype.destroy = destroy;
FileExplorer.prototype.add = add;

//Add file
function add(text, icon)
{
	var file = new File(this.element);
	file.position.set(5, 5);
	file.size.set(50, 50);
	file.setText(text);
	file.setIcon(icon);
	file.updateInterface();

	//Add file
	this.files.push(file);
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

//Update FileExplorer
function update(){}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}

	//Element visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update file position
	var files_per_row = Math.floor((this.files.length * (this.files_size.x+this.files_spacing)) / this.size.x);
	console.log(files_per_row);
	/*for(var i = 0; i < this.files.length; i++)
	{
		this.files[i].position.x = this.
	}*/

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}