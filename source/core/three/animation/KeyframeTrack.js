"use strict";

THREE.KeyframeTrack.prototype.sort = function()
{
	for(var i = 0; i < this.times.length; i++)
	{
		for(var j = i + 1; j < this.times.length; j++)
		{
			if(this.times[j] < this.times[i])
			{
				var temp = this.times[j];
				this.times[j] = this.times[i];
				this.times[i] = temp;

				var valueSize = this.getValueSize();
				var k = j * valueSize;
				var l = i * valueSize;

				for(var k = 0; k < valueSize; k++)
				{
					var temp = this.values[k + k];
					this.values[k + k] = this.values[l + k];
					this.values[l + k] = temp;
				}
			}
		}
	}
};