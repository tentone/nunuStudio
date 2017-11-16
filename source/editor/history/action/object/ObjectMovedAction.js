"use strict";

function ObjectMovedAction(object, newParent, newIndex)
{
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = this.oldParent.children.indexOf(this.object);

	this.newParent = newParent;
	this.newIndex = newIndex;
}

ObjectMovedAction.prototype.apply = function()
{
	this.oldParent.remove(this.object);
	this.newParent.add(this.object);
};

ObjectMovedAction.prototype.revert = function()
{
	this.newParent.remove(this.object);
	this.oldParent.add(this.object);
};

/*
var MoveObjectCommand = function ( object, newParent, newBefore )
{

	Command.call( this );

	this.type = 'MoveObjectCommand';
	this.name = 'Move Object';

	this.object = object;
	this.oldParent = ( object !== undefined ) ? object.parent : undefined;
	this.oldIndex = ( this.oldParent !== undefined ) ? this.oldParent.children.indexOf( this.object ) : undefined;
	this.newParent = newParent;

	if ( newBefore !== undefined ) {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.indexOf( newBefore ) : undefined;

	} else {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.length : undefined;

	}

	if ( this.oldParent === this.newParent && this.newIndex > this.oldIndex ) {

		this.newIndex --;

	}

	this.newBefore = newBefore;

};

MoveObjectCommand.prototype = {

	execute: function () {

		this.oldParent.remove( this.object );

		var children = this.newParent.children;
		children.splice( this.newIndex, 0, this.object );
		this.object.parent = this.newParent;

		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.newParent.remove( this.object );

		var children = this.oldParent.children;
		children.splice( this.oldIndex, 0, this.object );
		this.object.parent = this.oldParent;

		this.editor.signals.sceneGraphChanged.dispatch();

	},
*/