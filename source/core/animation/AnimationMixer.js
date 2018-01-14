"use strict";

/**
 * The AnimationMixer is a player for animations on a particular object in the scene.
 * 
 * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
 *
 * The object stores animations in its animations attribute, wich is an array an of animation clips.
 * 
 * @class AnimationMixer
 * @constructor
 * @module Animation
 * @extends {AnimationMixer}
 * @param {Object3D} root Animation root object
 */
function AnimationMixer(root)
{
	THREE.AnimationMixer.call(this, root);

	this.playing = false;
}

AnimationMixer.prototype = Object.create(THREE.AnimationMixer.prototype);

AnimationMixer.prototype.createActions = function(animations)
{
	for(var i = 0; i < animations.length; i++)
	{
		var action = this.clipAction(animations[i]);
		action.setLoop(animations[i].loop);
		action.weight = animations[i].weight;
		action.timeScale = animations[i].timeScale;
		action.enabled = animations[i].enabled;
		action.play();
	}

	return this._actions;
};

AnimationMixer.prototype.setTime = function(time)
{
	this.time = time;

	for(var i = 0; i < this._actions.length; i++)
	{
		this._actions[i].time = time;
	}

	this.update(0, true);
};

AnimationMixer.prototype.play = function()
{
	this.playing = true;
};

AnimationMixer.prototype.stop = function()
{
	this.setTime(0);
	this.playing = false;
};

AnimationMixer.prototype.pause = function()
{
	this.playing = false;
};

AnimationMixer.prototype.dispose = function()
{
	this.stopAllAction();
	this.uncacheRoot(this._root);
};

AnimationMixer.prototype.update = function(delta, forceUpdate)
{
	if(this.playing || forceUpdate)
	{
		this.time += delta;

		var direction = Math.sign(delta);

		//Run active actions
		for(var i = 0; i < this._actions.length; i++)
		{
			this._actions[i]._update(this.time, delta, direction, this._accuIndex);
		}

		//Update scene graph
		for(var i = 0; i < this._bindings.length; i++)
		{
			this._bindings[i].apply(this._accuIndex);
		}
	}

	return this;
};
