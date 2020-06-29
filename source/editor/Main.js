import {Editor} from "./Editor.js";

document.body.onload = function()
{
	Editor.initialize();
};

document.body.onresize = function()
{
	Editor.resize();
};
