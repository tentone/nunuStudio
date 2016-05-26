function SettingsTab(parent)
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
	var id = "settings" + SettingsTab.id;
	SettingsTab.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

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

	//Dual division
	this.container = new DualDivisionResizable(this.element);
	this.container.orientation = DualDivisionResizable.HORIZONTAL;
	this.container.tab_position = 0.2;
	this.container.tab_position_max = 0.8;
	this.container.tab_position_min = 0.2;
	this.container.fit_parent = true;
	this.container.updateInterface();

	//Set Div A style
	this.container.div_a.className = "bar";
	
	//Settings divisions buttons
	this.button_general = new Button(this.container.div_a);
	this.button_general.setText("General");
	this.button_general.position.set(0, 0);
	this.button_general.size.set(0, 25);
	this.button_general.updateInterface();

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//SettingsTab counter
SettingsTab.id = 0;

//Functions Prototype
SettingsTab.prototype.update = update;
SettingsTab.prototype.updateInterface = updateInterface;
SettingsTab.prototype.destroy = destroy;
SettingsTab.prototype.activate = activate;
SettingsTab.prototype.updateContainerMetaData = updateContainerMetaData;

//Update container object data
function updateContainerMetaData(container){}

//Activate
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
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

//Update SettingsTab
function update()
{
	this.container.update();
}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	

	//Update buttons
	this.button_general.size.x = this.container.tab_position * this.size.x;
	this.button_general.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	//Update Dual Division
	this.container.visible = this.visible;
	this.container.updateInterface();
}
