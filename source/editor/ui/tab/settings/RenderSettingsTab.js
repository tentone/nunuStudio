"use strict";

function RenderSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Render", "editor/files/icons/misc/scene.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//Renderer settings
	this.form.addText("Renderer Quality");
	this.form.nextRow();

	//Use project settings
	this.form.addText("Follow project");
	this.followProject = new CheckBox(this.form.element);
	this.followProject.size.set(20, 16);
	this.followProject.setOnChange(function()
	{
		Settings.render.followProject = self.followProject.getValue();
	});
	this.form.add(this.followProject);
	this.form.nextRow();

	//Antialiasing
	this.form.addText("Antialiasing");
	this.antialiasing = new CheckBox(this.form.element);
	this.antialiasing.size.set(20, 16);
	this.antialiasing.setOnChange(function()
	{
		Settings.render.antialiasing = self.antialiasing.getValue();
	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Shadows
	this.form.addText("Shadows");
	this.shadows = new CheckBox(this.form.element);
	this.shadows.size.set(20, 15);
	this.shadows.setOnChange(function()
	{	
		Settings.render.shadows = self.shadows.getValue();
	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadows settings
	this.form.addText("Shadows type");
	this.shadowsType = new DropdownList(this.form.element);
	this.shadowsType.size.set(150, 20);
	this.shadowsType.addValue("Basic", THREE.BasicShadowMap);
	this.shadowsType.addValue("PCF", THREE.PCFShadowMap);
	this.shadowsType.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadowsType.setOnChange(function()
	{
		Settings.render.shadowsType = self.shadowsType.getValue();
	});
	this.form.add(this.shadowsType);

	//Update form
	this.form.updateInterface();
}

RenderSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
RenderSettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);

	this.followProject.setValue(Settings.render.followProject);
	this.antialiasing.setValue(Settings.render.antialiasing);
	this.shadows.setValue(Settings.render.shadows);
	this.shadowsType.setValue(Settings.render.shadowsType);
};

//Update division Size
RenderSettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
