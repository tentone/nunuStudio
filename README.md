![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/logo_border.png)

# nunuStudio
 - nunuStudio is a three.js based framework for 3D and VR applications that runs direcly on the browser without the need for additional plugins using WebGL, WebAudio and WebVR.
 - nunuStudio provides a visual scene editor, a code editor, visual tools to edit textures, materials, particle emitters, etc.

### Editor
 - There is an editor web version available at https://nunustudio.org/editor/editor

### Documentation
 - Documentation for the scripting API is available on the nunu webpage https://nunustudio.org
 - nunuStudio was documented using YUIDocs

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
- Compatible with WebVR V1.1

### Screenshots
![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/2.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/3.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/4.png)
![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/1.png)![alt tag](https://raw.githubusercontent.com/tentone/nunuStudio/master/docs/img/github/5.png)

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
- V0.8.9.17 Alpha
	- Particle editor position, velocity and acceleration delta now shows in different a row
	- Fixed program resources dispose
	- Added support for mouse lock on runtime
	- Added RectArea light support
	- Added MTL loading support
	- Added program, scene and self variables to scripts (can be used without this reference)
	- Generic multi file format 3D model loading
- V0.8.9.18 Alpha
	- Added geometry properties to geometry panels
	- Camera draw order
	- Fixed OBJ and MTL loading
	- Default app export template loading screen
	- Audio preview
- V0.8.9.19 Alpha
	- Renamed variables variable_name to variableName
	- Added Texture Editor
	- Documentation page
- V0.8.9.20 Alpha
	- Cubetexture support
	- Improved material serialization
	- Sort objects in the explorer
- V0.8.9.21 Alpha
	- Editor standalone version (@Seagat2011)
	- Support for File API loading
	- Added reverse glyphs option to Font asset
	- Improved font preview
	- Added support for Textures as scene background
	- Drag and drop CubeTextures
	- Drag and drop tabs in editor
- V0.8.9.22 Alpha
	- Removed editor state, tabs are self updated
- V0.8.9.23 Alpha
	- Added support for STL files
	- Fixed locked keys in Keyboard after alerts, prompts, etc
	- Added support for nested menu in ContextMenus
	- Support for 3DS files
	- CircleGeometry
- V0.8.9.24 Alpha
	- Added snap to grid
	- First version of NodeJS build system (@GGAlanSmithee)
	- Open ISP as url argument on web version
	- Support for orbit navigation
- V0.8.9.25 Alpha
	- Added CubeCamera
	- Added SpriteSheet texture animation support
	- Gamepad support
	- Improved UI elements
- V0.8.9.26 Alpha
	- Improved audio implementation
	- Control sky colors on UI
	- Keyboard navigation in orbit mode
	- Export projects from web version
	- Calculate texture offset and repeat to fit aspect ratio in square
	- Code autocomplete from documentation
	- Keep file name on web version
	- Force webgl context loss when tabs closed
- V0.9.0 Beta
	- Division property for HTML elements
	- Camera preview positioning
	- Cubemaps from equirectangular projection
	- Binary project files
- V0.9.1 Beta
	- Internal debug console
	- Desktop auto update mechanism

### Runtime
- nunuStudio apps are meant to be used inside web pages
- To embed applications made inside nunuStudio in web pages the following code can be used
- nunuStudio can export full page web apps with a fullscreen and vr buttons by default but the following code can be used to embed nunu applications inside other webpages

```javascript
 var app = new NunuApp();
 app.setCanvas(canvas);
 app.load("app.isp");
 app.run();

 //Resize app
 function resize()
 {
 	app.resize();
 }

 //On exit callback (optional)
 app.onExit(function()
 {
 	//TODO <Exit callback>
 });
 
 //Toggle fullscreen (optional)
 function toggleFullscreen()
 {
 	app.setFullscreen();
 	app.resize();
 }
 
 //Toggle VR mode (optional, if available)
 function toggleVR()
 {
 	if(app.vrAvailable())
 	{
 		app.toggleVR();
 	}
 }
```

### Tech
nunuStudio is built on top of a number of open source projects
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
- JSHint
	- jshint.com
- YUIDocs
	- yui.github.io/yuidoc

### Installation
- nunuStudio is intended to run with NWJS direcly on the desktop
	- Linux and Windows are supported
	- Download the last release from the github repository and unzip it
	- Run the start.sh or start.bat file (depending on your OS)
- There is also a web version available on the project webpage
	- The web version cannot export desktop projects

### Building
- nunuStudio uses a custom solution for module management
- To build nunuStudio Java and NodeJS are required
	- Javascript is optimized and minified using Google closure
	- Documentation generation requires YuiDocs to be installed (npm -g install yuidocjs)
- The building system generates minified builds for the runtime and for the editor

### License
- nunuStudio uses a MIT license (Available on GitHub page)
