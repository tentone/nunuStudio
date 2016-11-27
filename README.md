![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/resources/logo.png)

# nunuStudio
nunuStudio is a JS based framework for 3D and VR applications that run direcly on the browser without the need for addicional plugins using WebGL and WebVR

### Features
- Visual application editor (WYSIWYG)
- Compatible with WebVR V1.1
- Real time lighting and advanced graphics
- Support for almost every file type available
- One file only project with all assets included (no more broke projects cause of missing files)
- One click web, desktop and mobile deployment
    - NWJS and Cordova
- CannonJS 3D Physics engine
- SPE particle system
- three.js based
	- three.js code can be used inside nunu Studio scripts
	- Big community support
- Supports Spine animations
- Microft Kinect and Leap Motion support
	- Kinect only supported in windows projects

### Tech
nunuStudio uses a number of open source projects to work properly
- NWJS
	- nwjs.io
- three.js
	- github.com/mrdoob/three.js
- opentype
	- opentype.js.org
- SPE
	- github.com/squarefeet/ShaderParticleEngine
- Cannon.JS
	- schteppe.github.io/cannon.js
- JSColor
	- jscolor.com
- CodeMirror
	- codemirror.net
- LeapJS
	- github.com/leapmotion/leapjs

### Installation
 - nunuStudio is intended to run with NWJS direcly on the desktop
 - Download the repository and run the start.bat or start.sh file depending on your OS

### Todo
 - Documentation
 - Blockly block scripting
 - Resource manager
 - Some bug fixing

### Runtime
 - To embed applications made inside nunuStudio in web pages the following code can be used

```
 var app = new NunuApp();
 app.setCanvas(canvas);
 app.load("app.isp");
 app.run();
 
 //On exit callback
 app.onExit(function()
 {
 	//TODO <Exit callback>
 });
 
 (...)
 
 app.dispose();
```

### License
 - nunuStudio uses a MIT license (Available on GitHub page)