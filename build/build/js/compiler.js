const compile = require('google-closure-compiler-js').compile;
const utils = require('./utils');

const readFile = utils.readFile;
const writeFile = utils.writeFile;

const optimize = (inName, outName) => {
    console.log(' Optimizing with google closure (takes a while) ');
    
    // const src = readFile(inName);
    const fs = require("fs");
    const src = fs.readFileSync(inName, "utf8");

    // seems like there is no pretty print option available
    const flags = {
        jsCode: [{src}],
        languageIn: 'ECMASCRIPT5',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'SIMPLE',
        warningLevel: 'QUIET',
    };
    
    const out = compile(flags);
    
    writeFile(outName, out.compiledCode);
};

const minify = (inName, outName) => {
    console.log(' Minifying ');
    
    const src = readFile(inName);
    
    // seems like there is no pretty print option available
    const flags = {
        jsCode: [{src}],
        languageIn: 'ECMASCRIPT5',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'WHITESPACE_ONLY',
        warningLevel: 'QUIET',
    };
    
    const out = compile(flags);
    
    writeFile(outName, out.compiledCode);
};
    
module.exports =  {
    optimize,
    minify
};