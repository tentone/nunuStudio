import {Action} from "../../editor/history/action/Action.js";
import {AnimationMixer} from "three";

/**
 * The AnimationMixer is a player for animations on a particular object in the scene.
 * 
 * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
 *
 * The object stores animations in its animations attribute, wich is an array an of animation clips.
 * 
 * @class AnimationMixer
 * @module Animation
 * @extends {AnimationMixer}
 * @param {Object3D} root Animation root object
 */
function AnimationMixer(root)
{
	AnimationMixer.call(this, root);

	this.playing = false;
}

AnimationMixer.prototype = Object.create(AnimationMixer.prototype);

/**
 * Create actions from array of animations.
 * 
 * @method createActions
 * @param {Array} actions Array of animations.
 */
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

/**
 * Set animation mixer time.
 * 
 * @method setTime
 * @param {number} time Time in seconds.
 */
AnimationMixer.prototype.setTime = function(time)
{
	this.time = time;

	for(var i = 0; i < this._actions.length; i++)
	{
		this._actions[i].time = time;
	}

	this.update(0, true);
};

/**
 * Play animation.
 * 
 * @method play
 */
AnimationMixer.prototype.play = function()
{
	this.playing = true;
};

/**
 * Stop animation playback.
 * 
 * @method stop
 */
AnimationMixer.prototype.stop = function()
{
	this.setTime(0);
	this.playing = false;
};

/**
 * Pause animation playback.
 * 
 * @method pause
 */
AnimationMixer.prototype.pause = function()
{
	this.playing = false;
};

AnimationMixer.prototype.dispose = function()
{
	this.stopAllAction();
	this.uncacheRoot(this._root);
};

/**
 * Update animation state.
 * 
 * @method update
 * @param {number} delta Time since last call.
 * @param {boolean} forceUpdate If set true the mixer is updated even if it isnt playing.
 */
AnimationMixer.prototype.update = function(delta, forceUpdate)
{
	if(this.playing || forceUpdate)
	{
		this.time += delta;

		var direction = Math.sign(delta);

		// Run active actions
		for(var i = 0; i < this._actions.length; i++)
		{
			this._actions[i]._update(this.time, delta, direction, this._accuIndex);
		}

		// Update scene graph
		for(var i = 0; i < this._bindings.length; i++)
		{
			this._bindings[i].apply(this._accuIndex);
		}
	}

	return this;
};

export {AnimationMixer};