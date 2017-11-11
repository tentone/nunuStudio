"use strict";

function AudioContext(){}

AudioContext.context = null;

AudioContext.getContext = function()
{
	if(AudioContext.context === null)
	{
		AudioContext.context = new (window.AudioContext || window.webkitAudioContext)();
	}

	return AudioContext.context;
};
