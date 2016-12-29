![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/logo_border.png)

# nunuStudio
nunuStudio is a JS based framework for 3D and VR applications that run direcly on the browser without the need for addicional plugins using WebGL and WebVR

### Features
- Visual application editor
- three.js based
	- Real time lighting and shadow map support
	- three.js code can be used inside nunuStudio scripts
- Wide range of file formats supported
- TTF Font support
- Drag and drop files directly to objects
- One file only project export with all assets included
	- No more broken projects because of missing files
- NWJS and Cordova used for easy desktop and mobile deployment
- Physics engine (cannon.js)
- SPE particle system
- Microft Kinect and Leap Motion support
	- Kinect only supported in Windows projects
- WebVR 1.1 compatible

### Screenshots
![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/screenshot/editor_b.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/screenshot/editor_c.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/screenshot/editor_d.png)
![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/screenshot/editor_a.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/images/screenshot/editor_e.png)

### Todo
- Documentation website
- Blockly based visual block scripting
- Audio editor
- Editor UI
	- CTRL-Z and CTRL-Y support
	- File dialogs sometimes dont open/save files

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
	- Text3D panel can be used to edit multiline text
	- Program stores pointer to nunu app (program.app)
	- Added program.sendDataApp and app.setOnDataReceived for app/page communication
	- Renamed NunuRuntime to NunuApp (Makes more sense)
	- Fixed copy/paste inside object panels

### Runtime
- nunuStudio apps are meant to be used inside web pages
- To embed applications made inside nunuStudio in web pages the following code can be used

```javascript
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
	-Linux and Windows are supported
- Download the repository and run the start.bat or start.sh file depending on your OS

### License
- nunuStudio uses a MIT license (Available on GitHub page)