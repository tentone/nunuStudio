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
	this.form.nextRow();

	//Tonemapping
	this.form.addText("Tonemapping");
	this.toneMapping = new DropdownList(this.form.element);
	this.toneMapping.size.set(150, 20);
	this.toneMapping.addValue("None", THREE.NoToneMapping);
	this.toneMapping.addValue("Linear", THREE.LinearToneMapping);
	this.toneMapping.addValue("Reinhard", THREE.ReinhardToneMapping);
	this.toneMapping.addValue("Uncharted", THREE.Uncharted2ToneMapping);
	this.toneMapping.addValue("Cineon", THREE.CineonToneMapping);
	this.toneMapping.setOnChange(function()
	{
		Settings.render.toneMapping = self.toneMapping.getValue();
	});
	this.form.add(this.toneMapping);
	this.form.nextRow();

	//Tonemapping exposure
	this.form.addText("Exposure");
	this.toneMappingExposure = new NumberBox(this.form.element);
	this.toneMappingExposure.size.set(40, 18);
	this.toneMappingExposure.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingExposure.setStep(0.1);
	this.toneMappingExposure.setOnChange(function()
	{
		Settings.render.toneMappingExposure = self.toneMappingExposure.getValue();
	});
	this.form.add(this.toneMappingExposure);
	this.form.nextRow();

	//Tonemapping whitepoint
	this.form.addText("Whitepoint");
	this.toneMappingWhitePoint = new NumberBox(this.form.element);
	this.toneMappingWhitePoint.size.set(40, 18);
	this.toneMappingWhitePoint.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingWhitePoint.setStep(0.1);
	this.toneMappingWhitePoint.setOnChange(function()
	{
		Settings.render.toneMappingWhitePoint = self.toneMappingWhitePoint.getValue();
	});
	this.form.add(this.toneMappingWhitePoint);
	this.form.nextRow();

	this.form.addText("");
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

	//Update form
	this.form.updateInterface();
}

RenderSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
RenderSettingsTab.prototype.activate = function()
{
	this.followProject.setValue(Settings.render.followProject);
	this.antialiasing.setValue(Settings.render.antialiasing);
	this.shadows.setValue(Settings.render.shadows);
	this.shadowsType.setValue(Settings.render.shadowsType);
	this.toneMapping.setValue(Settings.render.toneMapping);
	this.toneMappingExposure.setValue(Settings.render.toneMappingExposure);
	this.toneMappingWhitePoint.setValue(Settings.render.toneMappingWhitePoint);
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
