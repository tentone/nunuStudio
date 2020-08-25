import {Locale} from "../../../locale/LocaleManager.js";
import {Nunu} from "../../../../core/Nunu.js";
import {ThemeManager} from "../../../theme/ThemeManager.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../components/TableForm.js";
import {NumberBox} from "../../../components/input/NumberBox.js";
import {DropdownList} from "../../../components/input/DropdownList.js";
import {CheckBox} from "../../../components/input/CheckBox.js";
import {ButtonText} from "../../../components/buttons/ButtonText.js";


function GeneralSettingsTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.general, Global.FILE_PATH + "icons/misc/tool.png");

	this.element.style.overflow = "auto";

	var self = this;

	this.form = new TableForm(this);
	this.form.defaultTextWidth = 125;
	this.form.setAutoSize(false);

	// General text
	this.form.addText(Locale.general);
	this.form.nextRow();
	
	// Ignore device pixel ratio
	this.form.addText(Locale.ignorePixelRatio).setAltText(Locale.hintIgnorePixelRatio);
	this.ignorePixelRatio = new CheckBox(this.form);
	this.ignorePixelRatio.size.set(18, 18);
	this.ignorePixelRatio.setOnChange(function()
	{
		Editor.settings.general.ignorePixelRatio = self.ignorePixelRatio.getValue();
		Editor.resize();
	});
	this.form.add(this.ignorePixelRatio);
	this.form.nextRow();

	// Theme
	this.form.addText(Locale.theme);
	this.theme = new DropdownList(this.form);
	this.theme.size.set(150, 18);
	this.theme.setOnChange(function()
	{
		var value = self.theme.getValue();
		Editor.settings.general.theme = value;
	});
	this.form.add(this.theme);
	this.form.nextRow();

	// Fill theme dropdown
	var list = ThemeManager.getList();
	for (var i = 0; i < list.length; i++)
	{
		var theme = list[i];
		this.theme.addValue(theme, theme);
	}

	// History size
	this.form.addText(Locale.historySize).setAltText(Locale.hintHistory);
	this.historySize = new NumberBox(this.form);
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

	this.form.addText(Locale.reset).setAltText("Reset editor back to default settings.");
	this.resetDefault = new ButtonText(this.form);
	this.resetDefault.setText("Reset settings");
	this.resetDefault.size.set(120, 18);
	this.resetDefault.setOnClick(function()
	{
		if (Editor.confirm("Reset back to default settings?"))
		{
			Editor.settings.loadDefault();
			Editor.settings.store();
		}
	});
	this.form.add(this.resetDefault);
	this.form.nextRow();

	// Auto update
	if (Nunu.runningOnDesktop())
	{
		this.form.addText(Locale.autoUpdate).setAltText("If checked the editor will auto-update to the latest version.");
		this.autoUpdate = new CheckBox(this.form);
		this.autoUpdate.size.set(18, 18);
		this.autoUpdate.setOnChange(function()
		{
			Editor.settings.general.autoUpdate = self.autoUpdate.getValue();

			if (Editor.settings.general.autoUpdate)
			{
				Editor.updateNunu();
			}
		});
		this.form.add(this.autoUpdate);
		this.form.nextRow();	
	}
	
	// Blank Space
	this.form.addText("");
	this.form.nextRow();

	// Scene editor
	this.form.addText("Testing");
	this.form.nextRow();

	// Immediate mode
	this.form.addText("Use immediate mode").setAltText("If checked objects changed during runtime test will keep their state when the testing mode stops.");
	this.immediateMode = new CheckBox(this.form);
	this.immediateMode.size.set(18, 18);
	this.immediateMode.setOnChange(function()
	{
		Editor.settings.general.immediateMode = self.immediateMode.getValue();
	});
	this.form.add(this.immediateMode);
	this.form.nextRow();
}

GeneralSettingsTab.prototype = Object.create(TabComponent.prototype);

GeneralSettingsTab.prototype.activate = function()
{
	this.theme.setValue(Editor.settings.general.theme);
	if (this.autoUpdate !== undefined)
	{
		this.autoUpdate.setValue(Editor.settings.general.autoUpdate);
	}
	this.historySize.setValue(Editor.settings.general.historySize);
	this.ignorePixelRatio.setValue(Editor.settings.general.ignorePixelRatio);
	this.immediateMode.setValue(Editor.settings.general.immediateMode);
};

GeneralSettingsTab.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);
	
	this.form.size.copy(this.size);
	this.form.updateInterface();
};
export {GeneralSettingsTab};
