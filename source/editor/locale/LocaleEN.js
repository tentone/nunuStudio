"use strict";

/**
 * LocaleEN defines text and audio for the English language.
 * 
 * @static
 * @class LocaleEN
 */
LocaleManager.register(
{
	meta:
	{
		language: "EN",
		name: "English",
		version: 1
	},

	//Actions
	delete: "Delete",
	copy: "Copy",
	paste: "Paste",
	cut: "Cut",
	duplicate: "Duplicate",
	rename: "Rename",
	select: "Select",
	redo: "Redo",
	undo: "Undo",

	//Context menu
	computeNormals: "Compute normals",
	applyTransformation: "Apply transformation",
	sceneEditor: "Scene editor",
	objectEditor: "Object editor",
	scriptEditor: "Script editor",
	particleEditor: "Particle editor",
	recenterGeometries: "Recenter geometries",
	enable: "Enable",
	disable: "Disable",
	static: "Static",
	dynamic: "Dynamic",
	shadows: "Shadows",
	createScene: "Create scene",

	//Geometries
	box: "Box",
	sphere: "Sphere",
	cylinder: "Cylinder",
	convexHull: "ConvexHull",
	cube: "Cube",
	torus: "Torus",
	torusKnot: "Torus Knot",
	cone: "Cone",

	//Properties
	name: "Name",
	side: "Side",
	position: "Position",
	rotation: "Rotation",
	scale: "Scale",
	uuid: "UUID",
	repeat: "Repeat",
	offset: "Offset",
	center: "Center",
	wrapHor: "Wrap Hor.",
	wrapVert: "Wrap Vert.",
	clampEdge: "Clamp to Edge",
	repeatMirror: "Repeat Mirrored",
	premulAlpha: "Premul. Alpha",
	vector: "Vector",
	
	//Editor
	project: "Project",
	run: "Run",
	new: "New",
	save: "Save",
	saveAs: "Save as",
	load: "Load",
	settings: "Settings",
	publish: "Publish",
	import: "Import",
	export: "Export",
	exit: "Exit",
	nothingToShow: "Select an object to view its properties.",
	selectAll: "Select all",
	
	//Resources
	image: "Image",
	video: "Video",
	file: "File",
	material: "Material",
	
	//Messages
	projectSaved: "Project saved.",
	projectLoaded: "Project loaded",
	projectExported: "Project exported",

	//Confirm
	deleteObjects: "Delete objects?",
	loadProjectChangesLost: "All unsaved changes to the project will be lost.",
	loadProject: "Load project?",
	createProject: "Create new project?",

	//Warnings
	unsavedChangesExit: "All unsaved changes to the project will be lost. Do you really wanna exit?",
	cannotAddItself: "Cannot add object into itself.",
	cannotAddToChildren: "Cannot add object into is children.",
	nothingToRedo: "Nothing to redo!",
	nothingToUndo: "Not possible to undo any further",

	//Errors
	errorExportingProject: "Error exporting project",
	webglNotSupported: "WebGL is not supported or is disabled.\nnunuStudio cannot run.",
	errorLoadingFile: "Error loading file",
	errorSavingFile: "Error saving file",
	unknownFileFormat: "Unknown file format.",

	//Update
	updatedRestart: "nunuStudio updated\nRestart the editor",
	alreadyUpdated: "nunuStudio already up to date.",
	updateFailed: "Failed to download update files."
});
