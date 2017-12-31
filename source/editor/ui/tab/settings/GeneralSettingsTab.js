"use strict";

function GeneralSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "General", Editor.filePath + "icons/misc/tool.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//General text
	this.form.addText("General");
	this.form.nextRow();
	
	//Theme
	this.form.addText("Theme");
	this.theme = new DropdownList(this.form.element);
	this.theme.size.set(150, 20);
	this.theme.setOnChange(function()
	{
		var value = self.theme.getValue();
		Settings.general.theme = value;
	});
	this.form.add(this.theme);
	this.form.nextRow();

	//Fill theme dropdown
	for(var i = 0; i < Theme.list.length; i++)
	{
		var theme = Theme.list[i];
		this.theme.addValue(theme, theme);
	}

	//Auto update
	if(Nunu.runningOnDesktop())
	{
		this.form.addText("Auto Update").setAltText("If checked the editor will auto-update to the latest version.");
		this.autoUpdate = new CheckBox(this.form.element);
		this.autoUpdate.size.set(15, 15);
		this.autoUpdate.setOnChange(function()
		{
			Settings.general.autoUpdate = self.autoUpdate.getValue();

			if(Settings.general.autoUpdate)
			{
				Editor.updateNunu();
			}
		});
		this.form.add(this.autoUpdate);
		this.form.nextRow();	
	}

	//Show stats
	this.form.addText("Performance info").setAltText("Show performance information in the scene editor.");
	this.showStats = new CheckBox(this.form.element);
	this.showStats.size.set(15, 15);
	this.showStats.setOnChange(function()
	{
		Settings.general.showStats = self.showStats.getValue();
	});
	this.form.add(this.showStats);
	this.form.nextRow();

	//Show UUID
	this.form.addText("Show object UUID").setAltText("Show object UUID in the object panel.");
	this.showUUID = new CheckBox(this.form.element);
	this.showUUID.size.set(15, 15);
	this.showUUID.setOnChange(function()
	{
		Settings.general.showUUID = self.showUUID.getValue();
		Editor.selectObjectPanel();
	});
	this.form.add(this.showUUID);
	this.form.nextRow();

	//Show type
	this.form.addText("Show object type");
	this.showType = new CheckBox(this.form.element);
	this.showType.size.set(15, 15);
	this.showType.setOnChange(function()
	{
		Settings.general.showType = self.showType.getValue();
		Editor.selectObjectPanel();
	});
	this.form.add(this.showType);
	this.form.nextRow();

	//Immediate mode
	this.form.addText("Use immediate mode").setAltText("If checked objects changed during runtime test will keep their state when the testing mode stops.");
	this.immediateMode = new CheckBox(this.form.element);
	this.immediateMode.size.set(15, 15);
	this.immediateMode.setOnChange(function()
	{
		Settings.general.immediateMode = self.immediateMode.getValue();
	});
	this.form.add(this.immediateMode);
	this.form.nextRow();

	//History size
	this.form.addText("History size").setAltText("How many changes are stored in the history.");
	this.historySize = new NumberBox(this.form.element);
	this.historySize.size.set(60, 18);
	this.historySize.setRange(1.0, Number.MAX_SAFE_INTEGER);
	this.historySize.setStep(1.0);
	this.historySize.setOnChange(function()
	{
		Settings.general.historySize = self.historySize.getValue();
		Editor.history.limit = Settings.general.historySize;
	});
	this.form.add(this.historySize);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Editor");
	this.form.nextRow();

	//Enable Grid
	this.form.addText("Show grid");
	this.gridEnabled = new CheckBox(this.form.element);
	this.gridEnabled.size.set(15, 15);
	this.gridEnabled.setOnChange(function()
	{
		Settings.editor.gridEnabled = self.gridEnabled.getValue();
	});
	this.form.add(this.gridEnabled);
	this.form.nextRow();

	//Grid size 
	this.form.addText("Grid size");
	this.gridSize = new NumberBox(this.form.element);
	this.gridSize.size.set(60, 18);
	this.gridSize.setRange(1.0, Number.MAX_SAFE_INTEGER);
	this.gridSize.setStep(0.1);
	this.gridSize.setOnChange(function()
	{
		Settings.editor.gridSize = self.gridSize.getValue();
	});
	this.form.add(this.gridSize);
	this.form.nextRow();

	//Grid spacing
	this.form.addText("Grid spacing");
	this.gridSpacing = new NumberBox(this.form.element);
	this.gridSpacing.size.set(60, 18);
	this.gridSpacing.setRange(1.0, Number.MAX_SAFE_INTEGER);
	this.gridSpacing.setStep(1.0);
	this.gridSpacing.setOnChange(function()
	{
		Settings.editor.gridSpacing = self.gridSpacing.getValue();
	});
	this.form.add(this.gridSpacing);
	this.form.nextRow();

	//Enable Axis
	this.form.addText("Show axis");
	this.axisEnabled = new CheckBox(this.form.element);
	this.axisEnabled.size.set(15, 15);
	this.axisEnabled.setOnChange(function()
	{
		Settings.editor.axisEnabled = self.axisEnabled.getValue();
	});
	this.form.add(this.axisEnabled);
	this.form.nextRow();

	//Enable orientation cube
	this.form.addText("Orientation cube");
	this.cameraRotationCube = new CheckBox(this.form.element);
	this.cameraRotationCube.size.set(15, 15);
	this.cameraRotationCube.setOnChange(function()
	{
		Settings.editor.cameraRotationCube = self.cameraRotationCube.getValue();
	});
	this.form.add(this.cameraRotationCube);
	this.form.nextRow();

	//Orientation cube size
	this.form.addText("Orientation cube size");
	this.cameraRotationCubeSize = new NumberBox(this.form.element);
	this.cameraRotationCubeSize.size.set(60, 18);
	this.cameraRotationCubeSize.setRange(1.0, Number.MAX_SAFE_INTEGER);
	this.cameraRotationCubeSize.setStep(1.0);
	this.cameraRotationCubeSize.setOnChange(function()
	{
		Settings.editor.cameraRotationCubeSize = self.cameraRotationCubeSize.getValue();
	});
	this.form.add(this.cameraRotationCubeSize);
	this.form.nextRow();

	//Snap to grid
	this.form.addText("Snap to grid");
	this.snap = new CheckBox(this.form.element);
	this.snap.size.set(15, 15);
	this.snap.setOnChange(function()
	{
		Settings.editor.snap = self.snap.getValue();
	});
	this.form.add(this.snap);
	this.form.nextRow();

	//Snap angle
	this.form.addText("Snap angle");
	this.snapAngle = new NumberBox(this.form.element);
	this.snapAngle.size.set(60, 18);
	this.snapAngle.setRange(0.01, 3.14);
	this.snapAngle.setStep(0.01);
	this.snapAngle.setOnChange(function()
	{
		Settings.editor.snapAngle = self.snapAngle.getValue();
	});
	this.form.add(this.snapAngle);
	this.form.nextRow();

	//Tranformations space
	this.form.addText("Transformations space");
	this.transformationSpace = new DropdownList(this.form.element);
	this.transformationSpace.size.set(150, 20);
	this.transformationSpace.addValue("Local", "local");
	this.transformationSpace.addValue("World", "world");
	this.transformationSpace.setOnChange(function()
	{
		Settings.editor.transformationSpace = self.transformationSpace.getValue();
	});
	this.form.add(this.transformationSpace);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Navigation");
	this.form.nextRow();

	//Navigation
	this.form.addText("Navigation Mode");
	this.navigation = new DropdownList(this.form.element);
	this.navigation.size.set(150, 20);
	this.navigation.addValue("Free", Settings.FREE);
	this.navigation.addValue("Orbit", Settings.ORBIT);
	this.navigation.setOnChange(function()
	{
		Settings.editor.navigation = self.navigation.getValue();
	});
	this.form.add(this.navigation);
	this.form.nextRow();

	//Invert navigation
	this.form.addText("Invert Vertical");
	this.invertNavigation = new CheckBox(this.form.element);
	this.invertNavigation.size.set(15, 15);
	this.invertNavigation.setOnChange(function()
	{
		Settings.editor.invertNavigation = self.invertNavigation.getValue();
	});
	this.form.add(this.invertNavigation);
	this.form.nextRow();

	//Mouse look sensitivity
	this.form.addText("Mouse look");
	this.mouseLookSensitivity = new Slider(this.form.element);
	this.mouseLookSensitivity.size.set(120, 18);
	this.mouseLookSensitivity.setRange(0.0001, 0.02);
	this.mouseLookSensitivity.setStep(0.0001);
	this.mouseLookSensitivity.setOnChange(function()
	{
		Settings.editor.mouseLookSensitivity = self.mouseLookSensitivity.getValue();
	});
	this.form.add(this.mouseLookSensitivity);
	this.form.nextRow();

	//Mouse move speed
	this.form.addText("Mouse move");
	this.mouseMoveSpeed = new Slider(this.form.element);
	this.mouseMoveSpeed.size.set(120, 18);
	this.mouseMoveSpeed.setRange(0.0001, 0.01);
	this.mouseMoveSpeed.setStep(0.0001);
	this.mouseMoveSpeed.setOnChange(function()
	{
		Settings.editor.mouseMoveSpeed = self.mouseMoveSpeed.getValue();
	});
	this.form.add(this.mouseMoveSpeed);
	this.form.nextRow();

	//Mouse wheel speed
	this.form.addText("Mouse zoom");
	this.mouseWheelSensitivity = new Slider(this.form.element);
	this.mouseWheelSensitivity.size.set(120, 18);
	this.mouseWheelSensitivity.setRange(0.0001, 0.01);
	this.mouseWheelSensitivity.setStep(0.0001);
	this.mouseWheelSensitivity.setOnChange(function()
	{
		Settings.editor.mouseWheelSensitivity = self.mouseWheelSensitivity.getValue();
	});
	this.form.add(this.mouseWheelSensitivity);
	this.form.nextRow();

	//Mouse lock on camera move
	this.form.addText("Lock mouse");
	this.lockMouse = new CheckBox(this.form.element);
	this.lockMouse.size.set(15, 15);
	this.lockMouse.setOnChange(function()
	{
		Settings.editor.lockMouse = self.lockMouse.getValue();
	});
	this.form.add(this.lockMouse);
	this.form.nextRow();

	//Keyboard navigation
	this.form.addText("Keyboard navigation");
	this.keyboardNavigation = new CheckBox(this.form.element);
	this.keyboardNavigation.size.set(15, 15);
	this.keyboardNavigation.setOnChange(function()
	{
		Settings.editor.keyboardNavigation = self.keyboardNavigation.getValue();
	});
	this.form.add(this.keyboardNavigation);
	this.form.nextRow();

	//Keyboard movement speed
	this.form.addText("Keyboard speed");
	this.keyboardNavigationSpeed = new Slider(this.form.element);
	this.keyboardNavigationSpeed.size.set(120, 18);
	this.keyboardNavigationSpeed.setRange(0.1, 3);
	this.keyboardNavigationSpeed.setStep(0.1);
	this.keyboardNavigationSpeed.setOnChange(function()
	{
		Settings.editor.keyboardNavigationSpeed = self.keyboardNavigationSpeed.getValue();
	});
	this.form.add(this.keyboardNavigationSpeed);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Camera Preview");
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Show preview");
	this.cameraPreviewEnabled = new CheckBox(this.form.element);
	this.cameraPreviewEnabled.size.set(15, 15);
	this.cameraPreviewEnabled.setOnChange(function()
	{
		Settings.editor.cameraPreviewEnabled = self.cameraPreviewEnabled.getValue();
	});
	this.form.add(this.cameraPreviewEnabled);
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Preview size");
	this.cameraPreviewPercentage = new Slider(this.form.element);
	this.cameraPreviewPercentage.size.set(120, 18);
	this.cameraPreviewPercentage.setRange(0.05, 0.7);
	this.cameraPreviewPercentage.setStep(0.05);
	this.cameraPreviewPercentage.setOnChange(function()
	{
		Settings.editor.cameraPreviewPercentage = self.cameraPreviewPercentage.getValue();
	});
	this.form.add(this.cameraPreviewPercentage);
	this.form.nextRow();

	//Navigation
	this.form.addText("Position");
	this.cameraPreviewPosition = new DropdownList(this.form.element);
	this.cameraPreviewPosition.size.set(150, 20);
	this.cameraPreviewPosition.addValue("Bottom Right", Settings.BOTTOM_RIGHT);
	this.cameraPreviewPosition.addValue("Bottom Left", Settings.BOTTOM_LEFT);
	this.cameraPreviewPosition.addValue("Top Right", Settings.TOP_RIGHT);
	this.cameraPreviewPosition.addValue("Top Left", Settings.TOP_LEFT);
	this.cameraPreviewPosition.setOnChange(function()
	{
		Settings.editor.cameraPreviewPosition = self.cameraPreviewPosition.getValue();
	});
	this.form.add(this.cameraPreviewPosition);
	this.form.nextRow();


	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Asset explorer
	this.form.addText("Asset explorer");
	this.form.nextRow();

	//Code font size
	this.form.addText("Preview size");
	this.filePreviewSize = new NumberBox(this.form.element);
	this.filePreviewSize.size.set(60, 18);
	this.filePreviewSize.setRange(50, 200);
	this.filePreviewSize.setStep(1);
	this.filePreviewSize.setOnChange(function()
	{
		var value = self.filePreviewSize.getValue();
		Settings.general.filePreviewSize = value;
		Interface.assetExplorer.filesSize.set(value, value);
		Interface.assetExplorer.refresh();
	});
	this.form.add(this.filePreviewSize);
	
	//Update form
	this.form.updateInterface();
}

GeneralSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
GeneralSettingsTab.prototype.activate = function()
{
	//General
	this.theme.setValue(Settings.general.theme);
	if(this.autoUpdate !== undefined)
	{
		this.autoUpdate.setValue(Settings.general.autoUpdate);
	}
	this.filePreviewSize.setValue(Settings.general.filePreviewSize);
	this.showStats.setValue(Settings.general.showStats);
	this.showUUID.setValue(Settings.general.showUUID);
	this.showType.setValue(Settings.general.showType);
	this.immediateMode.setValue(Settings.general.immediateMode);
	this.historySize.setValue(Settings.general.historySize);
	
	//Editor
	this.snap.setValue(Settings.editor.snap);
	this.snapAngle.setValue(Settings.editor.snapAngle);
	this.gridEnabled.setValue(Settings.editor.gridEnabled);
	this.gridSize.setValue(Settings.editor.gridSize);
	this.gridSpacing.setValue(Settings.editor.gridSpacing);
	this.axisEnabled.setValue(Settings.editor.axisEnabled);
	this.cameraRotationCube.setValue(Settings.editor.cameraRotationCube);
	this.cameraRotationCubeSize.setValue(Settings.editor.cameraRotationCubeSize);

	//Navigation
	this.lockMouse.setValue(Settings.editor.lockMouse);
	this.navigation.setValue(Settings.editor.navigation);
	this.invertNavigation.setValue(Settings.editor.invertNavigation);
	this.keyboardNavigation.setValue(Settings.editor.keyboardNavigation);
	this.keyboardNavigationSpeed.setValue(Settings.editor.keyboardNavigationSpeed);
	this.mouseLookSensitivity.setValue(Settings.editor.mouseLookSensitivity);
	this.mouseMoveSpeed.setValue(Settings.editor.mouseMoveSpeed);
	this.mouseWheelSensitivity.setValue(Settings.editor.mouseWheelSensitivity);

	//Camera preview
	this.cameraPreviewEnabled.setValue(Settings.editor.cameraPreviewEnabled);
	this.cameraPreviewPercentage.setValue(Settings.editor.cameraPreviewPercentage);
	this.cameraPreviewPosition.setValue(Settings.editor.cameraPreviewPosition);

	//Transformations
	this.transformationSpace.setValue(Settings.editor.transformationSpace);
};
