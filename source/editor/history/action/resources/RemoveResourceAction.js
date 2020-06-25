import {ResourceManager} from "../../../../core/resources/ResourceManager.js";
import {Resource} from "../../../../core/resources/Resource.js";
import {ResourceCrawler} from "../../ResourceCrawler.js";
import {AddResourceAction} from "./AddResourceAction.js";
import {Action} from "../Action.js";
import {Editor} from "../../../Editor.js";

/**
 * Remove a resource from the manager.
 *
 * Usages of the resource being removed are replaced with a default resource of the same category.
 *
 * @class RemoveResourceAction
 * @param {Resource} resource Resource to remove.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {string} category Category of the resource.
 */
function RemoveResourceAction(resource, manager, category)
{
	Action.call(this);
	
	this.resource = resource;
	this.category = category;
	this.manager = manager;
}

RemoveResourceAction.prototype.apply = function()
{
	ResourceCrawler.removeResource(this.manager, this.resource, this.category);

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

RemoveResourceAction.prototype.revert = function()
{
	ResourceCrawler.addResource(this.manager, this.resource, this.category);

	AddResourceAction.updateGUI();
};

RemoveResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};
export {RemoveResourceAction};