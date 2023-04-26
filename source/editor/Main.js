/*
 * Main file for the program editor, should be used as an entry point for the editor.
 *
 * Does not export any of the internal editor modules, creates events on the document.body to load the editor code properly.
 */
import GLSL from "glsl-editor/glsl.js";
import {Editor} from "./Editor.js";

// Register the GLSL plugin in Codemirror
GLSL(CodeMirror);

document.body.onload = Editor.initialize;
document.body.onresize = Editor.resize;

window.Buffer = window.ArrayBuffer;