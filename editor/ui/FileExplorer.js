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
	
	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Files in explorer
	this.files_size = new THREE.Vector2(70, 70);
	this.files_spacing = 0;
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
FileExplorer.prototype.clear = clear;

//Remove all files
function clear()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
	this.updateInterface();
}

//Add file to explorer
function add(file)
{
	file.setParent(this.element);
	file.size.copy(this.files_size);
	file.updateInterface();

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
	var files_per_row = Math.floor(this.files.length / ((this.files.length * (this.files_size.x+this.files_spacing)) / this.size.x));
	for(var i = 0; i < this.files.length; i++)
	{
		var row = Math.floor(i / files_per_row);
		var col = i % files_per_row;
		this.files[i].position.x = (col * this.files_size.x) + ((col+1) * this.files_spacing);
		this.files[i].position.y = (row * this.files_size.y) + ((row+1) * this.files_spacing);
		this.files[i].updateInterface();
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}