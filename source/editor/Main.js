import {Editor} from "./Editor.js";

document.onload = function()
{
	Editor.initialize();
};

document.onresize = function()
{
	Editor.resize();
};
