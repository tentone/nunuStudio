import {KeyframeTrack} from "three";

KeyframeTrack.prototype.color = "#FF0000";

KeyframeTrack.prototype.setColor = function(color)
{
	this.color = color;
};

KeyframeTrack.prototype.sort = function()
{
	for(var i = 0; i < this.times.length; i++)
	{
		for(var j = i + 1; j < this.times.length; j++)
		{
			if(this.times[i] > this.times[j])
			{
				var temp = this.times[j];
				this.times[j] = this.times[i];
				this.times[i] = temp;

				var valueSize = this.getValueSize();
				var k = j * valueSize;
				var l = i * valueSize;

				for(var m = 0; m < valueSize; m++)
				{
					var temp = this.values[k + m];
					this.values[k + m] = this.values[l + m];
					this.values[l + m] = temp;
				}
			}
		}
	}
};

KeyframeTrack._toJSON = KeyframeTrack.toJSON;
KeyframeTrack.toJSON = function(track)
{
	var data = KeyframeTrack._toJSON.call(this, track);

	data.color = track.color;

	return data;
};

KeyframeTrack._parse = KeyframeTrack.parse;
KeyframeTrack.parse = function(json)
{
	var track = KeyframeTrack._parse.call(this, json);

	if(json.color !== undefined)
	{
		track.color = json.color;
	}

	return track;
};