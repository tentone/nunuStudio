import {FileSystem} from "../FileSystem.js";
import {Video} from "./Video.js";

/**
 * Video stream resource, used to load streamable video files directly from URL.
 * 
 * @class VideoStream
 * @extends {Video}
 * @module Resources
 * @param {string} url URL to video file.
 * @param {string} encoding Image encoding, required for ArrayBuffer data.
 */
class VideoStream extends Video
{
	constructor(url)
	{
		super();

		this.format = "url";
		this.encoding = FileSystem.getFileExtension(url);
		this.data = url;
	}
}

export {VideoStream};
