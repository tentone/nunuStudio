import {Editor} from "./Editor.js";

document.body.onload = function()
{
	Editor.initialize();
};

document.body.onresize = function()
{
	Editor.resize();
};

/*
import "../../lib/codemirror/codemirror.js";
import "../../lib/codemirror/codemirror.css";
import "../../lib/codemirror/keymap/sublime.js";
import "../../lib/codemirror/keymap/emacs.js";
import "../../lib/codemirror/keymap/vim.js";
import "../../lib/codemirror/mode/javascript/javascript.js";
import "../../lib/codemirror/mode/css/css.js";
import "../../lib/codemirror/mode/xml/xml.js";
import "../../lib/codemirror/mode/htmlmixed/htmlmixed.js";
import "../../lib/codemirror/mode/glsl.js";
import "../../lib/codemirror/addon/edit/closebrackets.js";
import "../../lib/codemirror/addon/edit/matchbrackets.js";
import "../../lib/codemirror/addon/scroll/annotatescrollbar.js";
import "../../lib/codemirror/addon/search/search.js";
import "../../lib/codemirror/addon/search/searchcursor.js";
import "../../lib/codemirror/addon/search/jump-to-line.js";
import "../../lib/codemirror/addon/search/match-highlighter.js";
import "../../lib/codemirror/addon/search/matchesonscrollbar.js";
import "../../lib/codemirror/addon/search/matchesonscrollbar.css";
import "../../lib/codemirror/addon/hint/show-hint.js";
import "../../lib/codemirror/addon/hint/show-hint.css";
import "../../lib/codemirror/addon/hint/anyword-hint.js";
import "../../lib/codemirror/addon/dialog/dialog.js";
import "../../lib/codemirror/addon/dialog/dialog.css";
import "../../lib/codemirror/addon/selection/mark-selection.js";
import "../../lib/codemirror/addon/selection/active-line.js";
import "../../lib/codemirror/addon/selection/selection-pointer.js";
import "../../lib/codemirror/addon/lint/lint.css";
import "../../lib/codemirror/addon/lint/lint.js";
import "../../lib/codemirror/addon/lint/javascript-lint.js";
import "../../lib/codemirror/addon/tern/tern.js";
import "../../lib/codemirror/addon/tern/tern.css";
import "../../lib/codemirror/addon/runmode/colorize.js";
import "../../lib/codemirror/addon/runmode/runmode.js";
import "../../lib/codemirror/theme/*";

import "../../lib/acorn/acorn.js";
import "../../lib/acorn/acorn_loose.js";
import "../../lib/acorn/walk.js";

import "../../lib/tern/signal.js";
import "../../lib/tern/tern.js";
import "../../lib/tern/def.js";
import "../../lib/tern/comment.js";
import "../../lib/tern/infer.js";
import "../../lib/tern/plugin/doc_comment.js";
*/