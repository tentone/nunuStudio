import {Editor} from "./Editor.js";
import GLSL from "glsl-editor/glsl.js";
import "../lib/draco/draco_encoder.js";

// Register the GLSL plugin in Codemirror
GLSL(CodeMirror);

document.body.onload = function()
{
	Editor.initialize();
};

document.body.onresize = function()
{
	Editor.resize();
};
