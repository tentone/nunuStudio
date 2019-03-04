"use strict";

function RenderSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.render, Editor.FILE_PATH + "icons/misc/particles.png");

	this.element.style.overflow = "auto";

	var self = this;

	this.form = new TableForm(this);
	this.form.setAutoSize(false);
	this.form.defaultTextWidth = 125;

	//Renderer settings
	this.form.addText("Renderer Quality");
	this.form.nextRow();

	//Use project settings
	this.form.addText("Follow project").setAltText("If checked the project rendering settings will be used, its better to preview the final result.");
	this.followProject = new CheckBox(this.form);
	this.followProject.size.set(18, 18);
	this.followProject.setOnChange(function()
	{
		Editor.settings.render.followProject = self.followProject.getValue();
	});
	this.form.add(this.followProject);
	this.form.nextRow();

	//Space
	this.form.addText("");
	this.form.nextRow();

	//Editor rendering quality
	this.form.addText("Editor Rendering Quality");
	this.form.nextRow();
	this.rendererConfiguration = new RendererConfigurationFormTemplate(this.form, Editor.settings.render);
}

RenderSettingsTab.prototype = Object.create(TabElement.prototype);

RenderSettingsTab.prototype.activate = function()
{
	this.followProject.setValue(Editor.settings.render.followProject);
	this.rendererConfiguration.attach(Editor.settings.render);
};

RenderSettingsTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);
	
	this.form.size.copy(this.size);
	this.form.updateInterface();
};
