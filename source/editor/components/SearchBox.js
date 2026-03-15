import {Locale} from "../locale/LocaleManager.js";
import {Global} from "../Global.js";
import {TextBox} from "./input/TextBox.js";
import {ImageContainer} from "./ImageContainer.js";
import {Component} from "./Component.js";

/**
 * Search box input element.
 * 
 * @class SearchBox
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class SearchBox extends Component {
	constructor(parent) {
	super(parent, "div");

	/**
	 * Input text box of the search box.
	 *
	 * @property search
	 * @type {TextBox}
	 */
	this.search = new TextBox(this);
	this.search.setMode(Component.TOP_RIGHT);
	this.search.element.placeholder = Locale.search;

	/**
	 * Search icon.
	 *
	 * @property searchIcon
	 * @type {Component}
	 */
	this.searchIcon = new ImageContainer(this);
	this.searchIcon.setImage(Global.FILE_PATH + "icons/misc/search.png");
	}

	setOnChange(callback) {
	this.search.setOnInput(callback, 100);
	}

	updateSize() {
	super.updateSize();

	this.searchIcon.size.set(this.size.y * 0.6, this.size.y * 0.6);
	this.searchIcon.position.set(this.size.y * 0.2, this.size.y * 0.2);
	this.searchIcon.updateInterface();

	this.search.size.set(this.size.x - this.size.y * 1.4, this.size.y * 0.8);
	this.search.position.set(this.size.y * 0.2, this.size.y * 0.1);
	this.search.updateInterface();
	}

}
export {SearchBox};
