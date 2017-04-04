const join = require('./join');
const path = require('path');
const compiler = require('./compiler');
const cleanFiles = require('./utils').cleanFiles;

const shouldOptimize = process.env.NODE_ENV === 'production';

const cwd = process.cwd();

const tempOutPath      = path.join(cwd, 'build/temp.js');
const appOutPath       = path.join(cwd, 'build/nunu.js');
const appMinOutPath    = path.join(cwd, 'build/nunu.min.js');
const editorOutPath    = path.join(cwd, 'build/editor/nunu.editor.js');
const editorMinOutPath = path.join(cwd, 'build/editor/nunu.editor.min.js');
const tempCSSPath      = path.join(cwd, 'build/nunu.css');
const editorCSSPath    = path.join(cwd, 'build/editor/nunu.editor.css');
const srcPath          = path.join(cwd, 'source/');
const appPath          = path.join(cwd, 'source/runtime/NunuApp.js');
const editorPath       = path.join(cwd, 'source/Editor.js');

(function logHeader() {
    console.log(' ------------------------ ');
    console.log('        nunuStudio        ');
    console.log(' ------------------------ ');
    console.log('         Runtime          ');
    console.log(' ------------------------ ');
})();


if (shouldOptimize) {
    const stream = join(srcPath, appPath, tempOutPath, tempCSSPath);
    
    stream.on('close', function() {
        compiler.optimize(tempOutPath, appOutPath);

        compiler.minify(appOutPath, appMinOutPath);

        cleanFiles(tempOutPath, tempCSSPath);
    });
} else {
    join(srcPath, appPath, appOutPath, tempCSSPath);
}

(function logEditorHeader() {
    console.log(' ------------------------ ');
    console.log('         Editor           ');
    console.log(' ------------------------ ');
})();

if (shouldOptimize) {
    const stream = join(srcPath, editorPath, tempOutPath, editorCSSPath);
    
    stream.on('close', function() {
        compiler.optimize(tempOutPath, editorOutPath);
    
        compiler.minify(editorOutPath, editorMinOutPath);
    
        cleanFiles(tempOutPath, tempCSSPath);
    });
} else {
    join(srcPath, appPath, editorOutPath, editorCSSPath);
}

(function logFooter() {
    console.log(' Done ');
})();