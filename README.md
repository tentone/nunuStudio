![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/resources/logo.png)

# nunuStudio
nunuStudio is a JS based framework for 3D and VR applications that run direcly on the browser without the need for addicional plugins using WebGL and WebVR

### Features
- Visual application editor
- WebVR 1.1 compatible
- Real time lighting and shadows
- TTF Font support
- One file only project export with all assets included
- NWJS and Cordova used for desktop and mobile deployment
- CannonJS physics engine 
- SPE particle system
- three.js based
	- three.js code can be used inside nunuStudio scripts
- Microft Kinect and Leap Motion support
	- Kinect only supported in windows projects

### Runtime
 - To embed applications made inside nunuStudio in web pages the following code can be used

    var app = new NunuApp();
    app.setCanvas(canvas);
    app.load("app.isp");
    app.initialize();
    
    //Called on page resize
    app.resize();
    
    //On exit callback
    app.onExit(function(){...});


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

### To do
 - Proper packaging
 - Documentation
 - Blockly block script

### License
 - nunuStudio uses a MIT license (Available on GitHub page)
