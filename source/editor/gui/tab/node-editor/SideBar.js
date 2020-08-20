import {ButtonDrawer} from "../../../components/buttons/ButtonDrawer.js";
import {Component} from "../../../components/Component.js";
import {Global} from "../../../Global.js";
import {Locale} from "../../../locale/LocaleManager.js";
import {OperationNode} from "../../../../core/objects/script/nodes/OperationNode.js";
import {Text} from "../../../components/Text.js";

/**
 * Side bar is used to add more nodes to the node editor graph.
 *
 * @class SideBar
 * @extends {Component}
 * @param {NodeEditor} parent Node editor where the sidebar is placed at.
 */
function SideBar(parent)
{
	Component.call(this, parent, "div");

	this.preventDragEvents();

	this.setStyle("overflow", "visible");
    this.setStyle("backgroundColor", "var(--bar-color)");
    
	/**
	 * List of object placing buttons.
	 *
	 * @attribute buttons
	 * @type {Array}
	 */	
	this.buttons = [];

	this.createObject();
    
	this.add = new Text(this);
	this.add.setText(Locale.add);
	this.add.size.set(40, 20);
	this.add.position.set(0, 5);
	this.add.updateInterface();

	/**
	 * More button is displayed when there is no space for the buttons placed in the side bar.
	 *
	 * @attribute more
	 * @type {ButtonDrawer}
	 */
	this.more = new ButtonDrawer(this);
	this.more.setImage(Global.FILE_PATH + "icons/misc/more.png");
	this.more.optionsPerLine = 1;
}

SideBar.prototype = Object.create(Component.prototype);

/** 
 * Create the icons to add objects to the scene.
 *
 * @method create
 */
SideBar.prototype.createObject = function()
{

	// Events
	var events = new ButtonDrawer(this);
	events.setImage(Global.FILE_PATH + "icons/models/models.png");
	this.buttons.push(events);

	// Initialization
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
    }, Locale.initialization);
    
    // Update
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
	}, Locale.update);
    
    // Resize
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
    }, Locale.resize);
	
	// Operations
	var events = new ButtonDrawer(this);
	events.setImage(Global.FILE_PATH + "icons/models/models.png");
	this.buttons.push(events);

	// Add
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// new OperationNode("+");
		// TODO <ADD CODE HERE>
    }, Locale.add);

	
	events.updateOptions();
};

SideBar.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);

	var size = this.size.x;
	var y = 30, i = 0;

	// Update buttons size
	while(y < this.size.y - 2 * size && i < this.buttons.length)
	{
		this.buttons[i].attachTo(this);
		this.buttons[i].size.set(size, size);
		this.buttons[i].position.set(0, y);
		this.buttons[i].optionsSize.set(size, size);
		this.buttons[i].visible = true;
		this.buttons[i].updateInterface();

		i++;
		y += size;
	}

	if(this.size.y < 250)
	{
		this.more.setVisibility(false);
	}
	else
	{
		if(i < this.buttons.length)
		{
			this.more.clear();
			this.more.optionsSize.set(size, size);
			this.more.size.set(size, size);
			this.more.position.set(0, y);
			this.more.visible = true;

			while(i < this.buttons.length)
			{
				this.more.insertOption(this.buttons[i]);
				i++;
			}

			this.more.updateOptions();
			this.more.updateInterface();
		}
		else
		{
			this.more.setVisibility(false);
		}
	}
};

export {SideBar};
