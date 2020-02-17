# Changelog
 - All notable changes to this project will be documented in this file, this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## Unpublished
### V0.9.6 Beta
 - Fixed canvas background.
 - Physics object positioning mode.
 - Terrain and shaders tutorials.
 - CSS 3D renderer support.
    - Perspective transformed HTML containers.
    - Billboarded HTML containers.
 - Added bitmap text with support for SDF and MSDF text rendering.
 - Added canvas based text with support for CSS styling.
 - Support for extruded or planar Text Mesh.
 - Fixed bug with tree overlaping other tabs.
 - Select multiple tree objects using SHIFT.
 - Export draco compressed geometries.
 - Scene editor toolbar is now attached to the scene editor tab. 
 - Fixed postprocessing pipeline bugs.
 - Adaptive luminance pass.
 - Improve search text box.
 - Fixed scene disposing the first scene loaded before running.
 - Added support for capsule geometry (library)



## Published
### V0.9.5 Beta
 - Splitabble tabs in the UI
 - Improved form GUI
 - Support for mesh-cap materials
 - Loading data screen
 - Torus knot and ring geometries
 - Post-processing refactored
 - Resource management refactored
 - Remove resources using the keyboard
 - Refactored forms UI
 - Fixed problems with convex hull generation
 - Search bard for objects and resource
 - Automatically focus objects on selection
 - Using NWJS-builder now
 - Fixed shader editor layout
 - Support for Tizen key codes (TizenKeyboard)
 - VideoStream object
 - Mouse back and forward buttons support (Chrome and desktop only).



### V0.9.4 Beta
 - Multi object edit (position, rotation and scale)
 - Support for SVG file loading
 - Improved camera controls
 - New UI elements (Slider, Checkbox)
 - Dodecahedron geometry
 - Resources are now selectable
 - Resource preview on inspector
 - New general settings tab
 - Experimental android export support



### V0.9.3 Beta
 - Shadow material
 - Support for .blend files (@Galactrax)
 - Fixed support for spine animations
 - Editor infinite grid
 - Improved history system in the editor
 - Support for mesh modifiers
 - Support for GPU compressed textures
 - Improved texture preview
 - Image and Video can be managed as resources
 - Animation timeline editor
 - Support for external libs in scripts
 - Support for text and code resources
 - Fixed particle scalling issues
 - File export API



### V0.9.2 Beta
 - Support for multi selection
 - Geometry binary operations (CSG)
    - Subtract
    - Intersect
    - Union
 - Immediate mode
 - Postprocessing
    - Postprocessing editor
 - Resize is now a part of Object3D
 - Improvements to nsp files
    - Moved from base64 to raw binary data.
 - Cube camera preview
 - Fixed dropdown menus getting out of screen



### V0.9.1 Beta
 - Internal debug console
    - Preview materials and textures in console
    - Visualize math structures
 - Desktop auto update mechanism (auto download build from github master branch)
 - Load 3D file drag and drop with texture support
 - Skeleton serialization (@takahirox)
 - ES6 lint support
 - Support for line and points material
 - Improvements in material editor



### V0.9.0 Beta
 - Division property for HTML elements
 - Camera preview positioning
 - Cubemaps from equirectangular projection
 - Binary project files (.nsp)



### V0.8.9.26 Alpha
 - Improved audio implementation
 - Control sky colors on UI
 - Keyboard navigation in orbit mode
 - Export projects from web version
 - Calculate texture offset and repeat to fit aspect ratio in square
 - Code autocomplete from documentation
 - Keep file name on web version
 - Force webgl context loss when tabs closed



### V0.8.9.25 Alpha
 - Added CubeCamera
 - Added SpriteSheet texture animation support
 - Gamepad support
 - Improved UI elements



### V0.8.9.24 Alpha
 - Added snap to grid
 - First version of NodeJS build system (@GGAlanSmithee)
 - Open ISP as url argument on web version
 - Support for orbit navigation



### V0.8.9.23 Alpha
 - Added support for STL files
 - Fixed locked keys in Keyboard after alerts, prompts, etc
 - Added support for nested menu in ContextMenus
 - Support for 3DS files
 - CircleGeometry



### V0.8.9.22 Alpha
 - Removed editor state, tabs are self updated



### V0.8.9.21 Alpha
 - Editor standalone version (@Seagat2011)
 - Support for File API loading
 - Added reverse glyphs option to Font asset
 - Improved font preview
 - Added support for Textures as scene background
 - Drag and drop CubeTextures
 - Drag and drop tabs in editor



### V0.8.9.20 Alpha
 - Cubetexture support
 - Improved material serialization
 - Sort objects in the explorer



### V0.8.9.19 Alpha
 - Renamed variables variable_name to variableName
 - Added Texture Editor
 - Documentation page



### V0.8.9.18 Alpha
 - Added geometry properties to geometry panels
 - Camera draw order
 - Fixed OBJ and MTL loading
 - Default app export template loading screen
 - Audio preview



### V0.8.9.17 Alpha
 - Particle editor position, velocity and acceleration delta now shows in different a row
 - Fixed program resources dispose
 - Added support for mouse lock on runtime
 - Added RectArea light support
 - Added MTL loading support
 - Added program, scene and self variables to scripts (can be used without this reference)
 - Generic multi file format 3D model loading



### V0.8.9.16 Alpha
 - Fixed file path changing after project export
 - Program rendering settings (Antialiasing, Shadows)
 - Text3D now supports line break with '\n'
 - Text3D panel can be used to edit multiline text
 - Program stores pointer to nunu app (program.app)
 - Added program.sendDataApp and app.setOnDataReceived for app/page communication
 - Renamed NunuRuntime to NunuApp (Makes more sense)
 - Fixed copy/paste inside object panels



### V0.8.9.15 Alpha
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
