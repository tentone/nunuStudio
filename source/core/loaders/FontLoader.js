import {DefaultLoadingManager, FileLoader} from "three";
import {ArraybufferUtils} from "../utils/binary/ArraybufferUtils.js";
import {Font} from "../resources/Font.js";

/**
 * FontLoader can be used to load external font resources.
 *
 * @class FontLoader
 * @module Loaders
 * @param {Object} manager
 */
function FontLoader(manager)
{
	this.manager = manager !== undefined ? manager : DefaultLoadingManager;
}

/**
 * Load font file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
FontLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(new Font(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse font json and return resource.
 *
 * @method parse
 * @param {Object} json
 * @return {Font} Font resource
 */
FontLoader.prototype.parse = function(json)
{
	if (json.data !== undefined)
	{
		var font = new Font();

		font.name = json.name;
		font.uuid = json.uuid;
		font.encoding = json.encoding;
		
		if (json.reversed !== undefined)
		{
			font.reversed = json.reversed;
		}
		
		if (json.format === "arraybuffer")
		{
			font.format = json.format;
			font.data = json.data.toArrayBuffer !== undefined ? json.data.toArrayBuffer() : json.data;
			font.loadTTF();
		}
		else if (json.format === "base64")
		{
			font.format = "arraybuffer";
			font.data = ArraybufferUtils.fromBase64(json.data);
			font.loadTTF();
		}
		else
		{
			font.format = json.format;
			font.data = json.data;
			font.font = json.data;
		}

		return font;
	}
	else
	{
		return new Font(json);
	}
};
export {FontLoader};
