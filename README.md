<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/logo.png">

[![GitHub version](https://badge.fury.io/gh/tentone%2FnunuStudio.svg)](https://badge.fury.io/gh/tentone%2FnunuStudio)
[![GitHub issues](https://img.shields.io/github/issues/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/issues) [![GitHub stars](https://img.shields.io/github/stars/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/stargazers)

 - nunustudio is an open source 3D VR game engine for the web it allows designers and web developers to easily develop 3D experiences that can run directly in a web page or be exported as Desktop applications.
 - It has a fully featured visual editor, supports a wide range of file formats, the tools are open source and completely free to use for both personal and commercial usage, it is powered by open web APIs like WebGL, WebVR and WebAudio.
 - Visual scene editor, code editor, visual tools to edit textures, materials, particle emitters, etc and a powerful scripting API that allows the creation of complex applications.



## Web Editor
 - There is a fully featured web version of the editor available at https://nunustudio.org/editor
 - The web version was tested with Firefox, Chrome and Microsoft Edge, mobile browsers are not supported.

<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/web.png">

## Documentation
 - Documentation for the scripting API is available on the nunu webpage https://nunustudio.org/docs
    - nunuStudio was documented using YUIDocs
 - Tutorials available on the project page at <https://nunustudio.org/learn.html>



## Screenshots
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/2.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/3.png">
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/4.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/1.png">
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/5.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/6.png">



## Features

- Visual application editor
  - Drag and drop files directly into the project
  - Manage project resources
  - Edit material, textures, shaders, code, etc
- Built on three.js rendering library
  - Real time lighting and shadow map support
  - three.js code can be used inside nunuStudio scripts without the need for THREE prefix
  - Wide range of file formats supported
- NWJS and Cordova exports for desktop and mobile deployment
- Physics engine (cannon.js)
- Compatible with WebVR / WebXR



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



## Libraries
- nunuStudio is built on top of a number of open source projects
  - NWJS ([nwjs.io](https://nwjs.io))
  - three.js ([github.com/mrdoob/three.js](https://github.com/mrdoob/three.js))
  - Cannon.JS ([schteppe.github.io/cannon.js](https://schteppe.github.io/cannon.js))
  - opentype ([opentype.js.org](https://opentype.js.org))
  - SPE ([github.com/squarefeet/ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine))
  - JSColor ([jscolor.com](http://jscolor.com))
  - CodeMirror ([codemirror.net](https://codemirror.net))
  - Spine Runtime (<https://github.com/EsotericSoftware/spine-runtimes>)
  - LeapJS ([github.com/leapmotion/leapjs](https://github.com/leapmotion/leapjs))
  - JSHint ([jshint.com](https://jshint.com))
  - YUIDocs ([yui.github.io/yuidoc](https://yui.github.io/yuidoc))



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

- nunuStudio uses a MIT license that allow for comercial usage of the platform without any cost.
- The license is available on the project GitHub page
