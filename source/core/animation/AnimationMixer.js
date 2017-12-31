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

AnimationMixer.prototype.createActions = function(animations, loop)
{
	for(var i = 0; i < animations.length; i++)
	{
		var action = this.clipAction(animations[i]);
		//action.setLoop(THREE.LoopRepeat); //LoopOnce || LoopRepeat || LoopPingPong
		action.play();
	}
};

AnimationMixer.prototype.setTime = function(time)
{
	this.time = time;

	for(var i = 0; i < this._actions.length; i++)
	{
		this._actions[i].time = time;
	}

	THREE.AnimationMixer.prototype.update.call(this, 0);
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

AnimationMixer.prototype.update = function(delta)
{
	if(this.playing)
	{
		THREE.AnimationMixer.prototype.update.call(this, delta);	
	}
};

