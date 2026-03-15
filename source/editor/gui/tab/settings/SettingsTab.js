import {Locale} from "../../../locale/LocaleManager.js";
import {Global} from "../../../Global.js";
import {TabGroup} from "../../../components/tabs/TabGroup.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {UnitsSettingsTab} from "./UnitsSettingsTab.js";
import {RenderSettingsTab} from "./RenderSettingsTab.js";
import {JSHintSettingsTab} from "./JSHintSettingsTab.js";
import {GeneralSettingsTab} from "./GeneralSettingsTab.js";
import {EditorSettingsTab} from "./EditorSettingsTab.js";
import {CodeSettingsTab} from "./CodeSettingsTab.js";

class SettingsTab extends TabComponent {
	constructor(parent, closeable, container, index) {
	super(parent, closeable, container, index, Locale.settings, Global.FILE_PATH + "icons/misc/settings.png");

	this.tab = new TabGroup(this, TabGroup.LEFT);
	this.tab.element.style.backgroundColor = "var(--bar-color)";
	this.tab.buttonSize.set(200, 25);

	this.tab.addTab(GeneralSettingsTab, false).activate();
	this.tab.addTab(EditorSettingsTab, false);
	this.tab.addTab(UnitsSettingsTab, false);
	this.tab.addTab(RenderSettingsTab, false);
	this.tab.addTab(CodeSettingsTab, false);
	this.tab.addTab(JSHintSettingsTab, false);
	}

	updateSize() {
	super.updateSize();

	this.tab.size.copy(this.size);
	this.tab.updateInterface();
	}

}
export {SettingsTab};
