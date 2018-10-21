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

	//Warnings
	unsavedChangesExit: "All unsaved changes to the project will be lost! Do you really wanna exit?",
	cannotAddItself: "Cannot add object into itself.",
	cannotAddToChildren: "Cannot add object into is children.",

	//Errors
	errorLoadFile: "Error loading file "
});
