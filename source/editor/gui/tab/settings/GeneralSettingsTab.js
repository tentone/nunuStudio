"use strict";

function GeneralSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "General", Editor.filePath + "icons/misc/tool.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//General text
	this.form.addText("General");
	this.form.nextRow();
	
	//Theme
	this.form.addText("Theme");
	this.theme = new DropdownList(this.form.element);
	this.theme.size.set(150, 20);
	this.theme.setOnChange(function()
	{
		var value = self.theme.getValue();
		Editor.settings.general.theme = value;
	});
	this.form.add(this.theme);
	this.form.nextRow();

	//Fill theme dropdown
	var list = ThemeManager.getList();
	for(var i = 0; i < list.length; i++)
	{
		var theme = list[i];
		this.theme.addValue(theme, theme);
	}

	//History size
	this.form.addText("History size").setAltText("How many changes are stored in the history.");
	this.historySize = new NumberBox(this.form.element);
	this.historySize.size.set(60, 18);
	this.historySize.setRange(1.0, Number.MAX_SAFE_INTEGER);
	this.historySize.setStep(1.0);
	this.historySize.setOnChange(function()
	{
		Editor.settings.general.historySize = self.historySize.getValue();
		Editor.history.limit = Editor.settings.general.historySize;
	});
	this.form.add(this.historySize);
	this.form.nextRow();

	this.form.addText("Reset").setAltText("Reset editor back to default settings.");
	this.resetDefault = new ButtonText(this.form.element);
	this.resetDefault.setText("Reset settings");
	this.resetDefault.size.set(120, 18);
	this.resetDefault.setOnClick(function()
	{
		if(Editor.confirm("Reset back to default settings?"))
		{
			Editor.settings.loadDefault();
			Editor.settings.store();
		}
	});
	this.form.add(this.resetDefault);
	this.form.nextRow();

	//Auto update
	if(Nunu.runningOnDesktop())
	{
		this.form.addText("Auto update").setAltText("If checked the editor will auto-update to the latest version.");
		this.autoUpdate = new CheckBox(this.form.element);
		this.autoUpdate.size.set(15, 15);
		this.autoUpdate.setOnChange(function()
		{
			Editor.settings.general.autoUpdate = self.autoUpdate.getValue();

			if(Editor.settings.general.autoUpdate)
			{
				Editor.updateNunu();
			}
		});
		this.form.add(this.autoUpdate);
		this.form.nextRow();	
	}
	
	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Testing");
	this.form.nextRow();

	//Immediate mode
	this.form.addText("Use immediate mode").setAltText("If checked objects changed during runtime test will keep their state when the testing mode stops.");
	this.immediateMode = new CheckBox(this.form.element);
	this.immediateMode.size.set(15, 15);
	this.immediateMode.setOnChange(function()
	{
		Editor.settings.general.immediateMode = self.immediateMode.getValue();
	});
	this.form.add(this.immediateMode);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

GeneralSettingsTab.prototype = Object.create(TabElement.prototype);

GeneralSettingsTab.prototype.activate = function()
{
	this.theme.setValue(Editor.settings.general.theme);
	if(this.autoUpdate !== undefined)
	{
		this.autoUpdate.setValue(Editor.settings.general.autoUpdate);
	}
	this.historySize.setValue(Editor.settings.general.historySize);

	this.immediateMode.setValue(Editor.settings.general.immediateMode);
};
