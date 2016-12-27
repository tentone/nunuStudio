![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/resources/logo.png)

# nunuStudio
nunuStudio is a JS based framework for 3D and VR applications that run direcly on the browser without the need for addicional plugins using WebGL and WebVR

### Features
- Visual application editor
- WebVR 1.1 compatible
- Real time lighting and shadows
- TTF Font support
- One file only project export with all assets included
	- No more broken projects because of missing files
- NWJS and Cordova used for desktop and mobile deployment
- CannonJS physics engine 
- SPE particle system
- three.js based
	- three.js code can be used inside nunuStudio scripts
- Microft Kinect and Leap Motion support
	- Kinect only supported in Windows projects

### Todo
 - Documentation
 - Blockly block script

### ChangeLog
- V0.8.9.15 Alpha
	- Added font preview in asset explorer
	- Fixed material preview projection
	- Projects can be loaded when dragged anywhere
	- Videos and images can now be exported to files
		- Left click on texture inside the asset explorer and select Export Image/Video
	- Added support for Positional Audio
		- Audio relative to origin
	- Fonts can now be dragged directly to an object
	- Fixed script onResize method
	- Projects can now be run by pressing F5
- V0.8.9.16 Alpha
	- Fixed file path changing after project export
	- Program rendering settings (Antialiasing, Shadows)
	- Text3D now supports line break with '\n'

### Runtime
- nunuStudio apps are meant to be used inside web pages
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
```

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

### License
- nunuStudio uses a MIT license (Available on GitHub page)