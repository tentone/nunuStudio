"use strict";

function AnimationMixer(root)
{
	THREE.AnimationMixer.call(this, root);

	this.playing = true;
}

AnimationMixer.prototype = Object.create(THREE.AnimationMixer.prototype);

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

	if(this.playing)
	{
		this.playing = false;
	}
};

AnimationMixer.prototype.pause = function()
{
	this.playing = false;
};

AnimationMixer.prototype.dispose = function()
{
	this.stopAllAction();
	//TODO <ADD CODE HERE>
};

AnimationMixer.prototype.update = function(delta)
{
	if(this.playing)
	{
		THREE.AnimationMixer.prototype.update.call(this, delta);	
	}

};

