import {AnimationMixer as TAnimationMixer} from "three";

/**
 * The AnimationMixer is a player for animations on a particular object in the scene.
 *
 * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
 *
 * The object stores animations in its animations attribute, which is an array an of animation clips.
 *
 * @class AnimationMixer
 * @module Animation
 * @extends {AnimationMixer}
 * @param {Object3D} root Animation root object
 */
class AnimationMixer extends TAnimationMixer
{
	constructor(root)
	{
		super(root);

		this.playing = false;
	}

	/**
	 * Create actions from array of animations.
	 *
	 * @method createActions
	 * @param {Array} animations Array of animations.
	 */
	createActions(animations)
	{
		for (var i = 0; i < animations.length; i++)
		{
			var action = this.clipAction(animations[i]);
			action.setLoop(animations[i].loop);
			action.weight = animations[i].weight;
			action.timeScale = animations[i].timeScale;
			action.enabled = animations[i].enabled;
			action.play();
		}

		return this._actions;
	}

	/**
	 * Set animation mixer time.
	 *
	 * @method setTime
	 * @param {number} time Time in seconds.
	 */
	setTime(time)
	{
		this.time = time;

		for (var i = 0; i < this._actions.length; i++)
		{
			this._actions[i].time = time;
		}

		this.update(0, true);
	}

	/**
	 * Play animation.
	 *
	 * @method play
	 */
	play()
	{
		this.playing = true;
	}

	/**
	 * Stop animation playback.
	 *
	 * @method stop
	 */
	stop()
	{
		this.setTime(0);
		this.playing = false;
	}

	/**
	 * Pause animation playback.
	 *
	 * @method pause
	 */
	pause()
	{
		this.playing = false;
	}

	dispose()
	{
		this.stopAllAction();
		this.uncacheRoot(this._root);
	}

	/**
	 * Update animation state.
	 *
	 * @method update
	 * @param {number} delta Time since last call.
	 * @param {boolean} forceUpdate If set true the mixer is updated even if it isnt playing.
	 */
	update(delta, forceUpdate)
	{
		if (this.playing || forceUpdate)
		{
			this.time += delta;

			var direction = Math.sign(delta);

			// Run active actions
			for (var i = 0; i < this._actions.length; i++)
			{
				this._actions[i]._update(this.time, delta, direction, this._accuIndex);
			}

			// Update scene graph
			for (var i = 0; i < this._bindings.length; i++)
			{
				this._bindings[i].apply(this._accuIndex);
			}
		}

		return this;
	}
}

export {AnimationMixer};
