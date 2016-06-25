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

	//Options tab container
	this.tab = new TabGroup(this.element);
	this.tab.options_size.set(200, 30);
	this.tab.element.className = "bar";
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//Self pointer
	var self = this;

	//General tab
	this.general = this.tab.addOption("General", "editor/files/icons/misc/tool.png", false);

	//General form
	this.general_form = new Form(this.general.division.element);
	this.general_form.position.set(5, 5);
	this.general_form.spacing.set(5, 5);
	this.general_form.addText("General");
	this.general_form.nextRow();
	
	//Theme
	this.general_form.addText("Theme");
	this.theme = new DropdownList(this.general_form.element);
	this.theme.size.set(150, 20);
	this.theme.addValue("Dark", "dark.css");
	this.theme.setOnChange(function()
	{
		//TODO <ADD CODE HERE>
	});
	this.general_form.add(this.theme);
	this.general_form.nextRow();

	//Blank Space
	this.general_form.addText("");
	this.general_form.nextRow();

	//Scene editor
	this.general_form.addText("Rendering Quality");
	this.general_form.nextRow();

	//Enable Grid
	this.grid_enabled = new Checkbox(this.general_form.element);
	this.grid_enabled.setText("Show Grid");
	this.grid_enabled.size.set(200, 16);
	this.grid_enabled.setOnChange(function()
	{
		Settings.grid_enabled = self.grid_enabled.getValue();
		Editor.grid_helper.visible = Settings.grid_enabled;
	});
	this.general_form.add(this.grid_enabled);
	this.general_form.nextRow();

	//Enable Axis
	this.axis_enabled = new Checkbox(this.general_form.element);
	this.axis_enabled.setText("Show axis");
	this.axis_enabled.size.set(200, 16);
	this.axis_enabled.setOnChange(function()
	{
		Settings.axis_enabled = self.axis_enabled.getValue();
		Editor.axis_helper.visible = Settings.axis_enabled;
	});
	this.general_form.add(this.axis_enabled);
	this.general_form.nextRow();

	//Blank Space
	this.general_form.addText("");
	this.general_form.nextRow();

	//Renderer settings
	this.general_form.addText("Rendering Quality");
	this.general_form.nextRow();

	//Shadows settings
	this.general_form.addText("Shadows type");
	this.shadows_type = new DropdownList(this.general_form.element);
	this.shadows_type.size.set(150, 20);
	this.shadows_type.addValue("Basic", THREE.BasicShadowMap);
	this.shadows_type.addValue("PCF", THREE.PCFShadowMap);
	this.shadows_type.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadows_type.setOnChange(function()
	{
		Settings.shadows_type = self.shadows_type.getValue();
	});
	this.general_form.add(this.shadows_type);
	this.general_form.nextRow();

	//Antialiasing
	this.antialiasing = new Checkbox(this.general_form.element);
	this.antialiasing.setText("Antialiasing");
	this.antialiasing.size.set(200, 16);
	this.antialiasing.setOnChange(function()
	{
		Settings.antialiasing = self.antialiasing.getValue();
	});
	this.general_form.add(this.antialiasing);
	this.general_form.nextRow();

	//Code tab
	this.code = this.tab.addOption("Code", "editor/files/icons/script/script.png", false);
	
	//About
	this.about = this.tab.addOption("About", "editor/files/icons/misc/about.png", false);
	this.about.attachComponent(new AboutTab(this.about.division.element));
	this.about.updateInterface();
	
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
SettingsTab.prototype.updateMetadata = updateMetadata;

//Update container object data
function updateMetadata(container){}

//Activate
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();

	//Update UI elements
	this.grid_enabled.setValue(Settings.grid_enabled);
	this.axis_enabled.setValue(Settings.axis_enabled);
	this.shadows_type.setValue(Settings.shadows_type);
	this.antialiasing.setValue(Settings.antialiasing);

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
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update forms
	this.general_form.visible = this.visible;
	this.general_form.updateInterface();
	
	//Update tab
	this.tab.visible = this.visible;
	this.tab.size.copy(this.size);
	this.tab.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
