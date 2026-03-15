import {Resource} from "./Resource.js";

/**
 * Text file resource can be used to store data or code.
 *
 * Text file data can be used to store information to be consumend by the application or runtime code that can be imported by scripts.
 *
 * @class TextFile
 * @extends {Resource}
 * @module Resources
 */
class TextFile extends Resource
{
	constructor(data, encoding)
	{
		super("text", "TextFile");

		this.format = "string";
		this.encoding = encoding !== undefined ? encoding : "txt";
		this.data = data !== undefined ? data : "";
	}

	/**
	 * Serialize File resource data to json.
	 *
	 * @method toJSON
	 * @param {meta} meta
	 * @return {Object} data
	 */
	toJSON(meta)
	{
		if (meta.resources[this.uuid] !== undefined)
		{
			return meta.resources[this.uuid];
		}

		var data = super.toJSON(meta);
		
		data.encoding = this.encoding;
		data.data = this.data;
		data.format = this.format;

		meta.resources[this.uuid] = data;

		return data;
	}
}

TextFile.extensions = [".js", ".txt", ".glsl", ".json", ".xml", ".yaml", ".csv", ".css", ".html"];

/**
 * Check if a file name refers to a text file.
 *
 * @method fileIsText
 * @static
 * @param {File} file
 * @return {boolean} True if the file is text.
 */
TextFile.fileIsText = function(file)
{
	file = file.name.toLocaleLowerCase();

	for (var i = 0; i < TextFile.extensions.length; i++)
	{
		if (file.endsWith(TextFile.extensions[i]))
		{
			return true;
		}
	}

	return false;
};

export {TextFile};
