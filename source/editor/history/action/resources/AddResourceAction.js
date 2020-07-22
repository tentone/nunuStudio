import {ResourceManager} from "../../../../core/resources/ResourceManager.js";
import {Resource} from "../../../../core/resources/Resource.js";
import {ResourceCrawler} from "../../ResourceCrawler.js";
import {RemoveResourceAction} from "./RemoveResourceAction.js";
import {Action} from "../Action.js";
import {Editor} from "../../../Editor.js";

/**
 * Add resource to the resource manager.
 *
 * @class AddResourceAction
 * @param {Resource} resource Resource to add.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {string} category Category of the resource.
 */
function AddResourceAction(resource, manager, category)
{
	Action.call(this);
	
	this.resource = resource;
	this.manager = manager;
	this.category = category;
}

AddResourceAction.prototype.apply = function()
{
	ResourceCrawler.addResource(this.manager, this.resource, this.category);
	
	AddResourceAction.updateGUI();
};

AddResourceAction.prototype.revert = function()
{
	ResourceCrawler.removeResource(this.manager, this.resource, this.category);

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

AddResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};
export {AddResourceAction};