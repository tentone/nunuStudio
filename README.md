<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/logo.png">

[![GitHub issues](https://img.shields.io/github/issues/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/issues) [![GitHub stars](https://img.shields.io/github/stars/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/stargazers)

 - nunustudio is an open source 3D VR game engine for the web it allows designers and web developers to easily develop 3D experiences that can run directly in a web page or be exported as Desktop applications.
 - nunuStudio has a fully featured visual editor, supports a wide range of file formats, the tools are open source and completely free to use for both personal and commercial usage, it is powered by open web APIs like WebGL, WebVR and WebAudio.
 - Visual scene editor, code editor, visual tools to edit textures, materials, particle emitters, etc and a powerful scripting API that allows the creation of complex applications.

## Web Editor
 - There is a fully featured web version of the editor available at https://nunustudio.org/editor/editor
 - The web version was tested with Firefox, Chrome and Microsoft Edge, mobile browsers are not supported.
 
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/web.png">

## Documentation
 - Documentation for the scripting API is available on the nunu webpage https://nunustudio.org/docs
 - nunuStudio was documented using YUIDocs

## Features
- Visual application editor
- Built on three.js
	- Real time lighting and shadow map support
	- three.js code can be used inside nunuStudio scripts without the need for THREE prefix
- Wide range of file formats supported
- TTF Font support
- Drag and drop files directly to objects
- One file only project export with all assets included
	- No more broken projects because of missing files
- NWJS and Cordova used for easy desktop and mobile deployment
- Physics engine (cannon.js)
- SPE particle system
- Compatible with WebVR V1.1

## Screenshots
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/2.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/3.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/4.png">
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/1.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/5.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/6.png">

## Installation
- nunuStudio is intended to run with NWJS on the desktop (Linux and Windows are supported)
	- Download last version from releases in the github page
- To run the development version of nunuStudio
- There a web version available on the project webpage
	- The web version cannot export desktop and mobile projects

## Building
- nunuStudio uses a custom solution for code management based of an include function
- To build nunuStudio Java and NodeJS are required
	- Javascript is optimized and minified using Google closure
	- Documentation generation uses YuiDocs
- The building system generates minified builds for the runtime and for the editor
- To build nunu editor, runtime and documentation, run "npm run build"
- The build system is compatible with windows, linux and macos.

## Tech
nunuStudio is built on top of a number of open source projects
- NWJS
	- nwjs.io
- three.js
	- github.com/mrdoob/three.js
- Cannon.JS
	- schteppe.github.io/cannon.js
- opentype
	- opentype.js.org
- SPE
	- github.com/squarefeet/ShaderParticleEngine
- JSColor
	- jscolor.com
- CodeMirror
	- codemirror.net
- LeapJS
	- github.com/leapmotion/leapjs
- JSHint
	- jshint.com
- YUIDocs
	- yui.github.io/yuidoc
- Timeliner
	- github.com/zz85/timeliner

## Runtime
- nunuStudio apps are meant to be used inside web pages
- To embed applications made inside nunuStudio in HTML pages the following code can be used

```html
<html>
	<head>
		<script src="nunu.min.js"></script>
	</head>
	<body onload="NunuApp.loadApp('pong.nsp', 'canvas')">
		<canvas width="800" height="480" id="canvas"></canvas>
	</body>
</html>
```

## License
- nunuStudio uses a MIT license (Available on GitHub page)
