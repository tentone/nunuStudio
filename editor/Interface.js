function Interface(){}

Interface.initialize = function()
{	
	//Style
	Interface.theme = new Style();
	Interface.theme.setStyleSheet("editor/files/css/dark.css");

	//Tab
	Interface.tab = new TabContainer();
	Interface.tab.addOption("Scene", "editor/files/icons/models.png", true);
	Interface.tab.options[0].division.element.className = "panel";
	Interface.tab.addOption("Tab", "editor/files/icons/cogwheel.png", true);
	Interface.tab.addOption("Script", "editor/files/icons/screen.png", true);

	//Canvas
	Interface.canvas = new Canvas();
	Interface.tab.options[0].attachComponent(Interface.canvas);
	
	//Dual Div
	Interface.dual_test = new DualDivisionResizable();
	Interface.dual_test.orientation = DualDivisionResizable.HORIZONTAL;
	Interface.dual_test.tab_position = 250;
	Interface.dual_test.div_a.className = "bar";
	Interface.tab.options[1].attachComponent(Interface.dual_test);

	//---------------------------------Asset Manager----------------------------------
	Interface.asset_explorer = new DivisionResizable();
	Interface.asset_explorer.resizable_side = DivisionResizable.TOP;
	Interface.asset_explorer.size.y = 200;

	//------------------------------------Explorer------------------------------------
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;

	//Test Text
	Interface.text = new Text(Interface.explorer.element);
	Interface.text.text = "TextBox:";
	Interface.text.alignment = Text.CENTER;
	Interface.text.position.set(40, 25);
	Interface.text.updateInterface();

	//Test Text Box
	Interface.text_box = new TextBox(Interface.explorer.element);
	Interface.text_box.position.set(80, 10);
	Interface.text_box.size.set(180, 25);
	Interface.text_box.updateInterface();

	//------------------------------------Tool Bar------------------------------------
	Interface.tool_bar = new Division();
	Interface.tool_bar.size.x = 40;
	Interface.tool_bar.element.className = "bar";

	//Tools text
	Interface.tool_text = new Text(Interface.tool_bar.element);
	Interface.tool_text.text = "Tools";
	Interface.tool_text.position.set(Interface.tool_bar.size.x/2, 40);
	Interface.tool_text.updateInterface();

	//Select
	Interface.tool_select = new ButtonImageToggle();
	Interface.tool_select.selected = true;
	Interface.tool_select.setImage("editor/files/icons/select.png");
	Interface.tool_select.image_scale.set(0.7, 0.7);
	Interface.tool_select.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_select.position.set(0, 80);
	Interface.tool_select.updateInterface();
	Interface.tool_select.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_SELECT;
		Interface.tool_select.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Move
	Interface.tool_move = new ButtonImageToggle();
	Interface.tool_move.setImage("editor/files/icons/move.png");
	Interface.tool_move.image_scale.set(0.7, 0.7);
	Interface.tool_move.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_move.position.set(0, 120);
	Interface.tool_move.updateInterface();
	Interface.tool_move.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_MOVE;
		Interface.tool_move.selected = true;
		Interface.tool_select.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Resize
	Interface.tool_resize = new ButtonImageToggle();
	Interface.tool_resize.setImage("editor/files/icons/resize.png");
	Interface.tool_resize.image_scale.set(0.7, 0.7);
	Interface.tool_resize.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_resize.position.set(0, 160);
	Interface.tool_resize.updateInterface();
	Interface.tool_resize.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_RESIZE;
		Interface.tool_resize.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_select.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Rotate
	Interface.tool_rotate = new ButtonImageToggle();
	Interface.tool_rotate.setImage("editor/files/icons/rotate.png");
	Interface.tool_rotate.image_scale.set(0.7, 0.7);
	Interface.tool_rotate.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_rotate.position.set(0, 200);
	Interface.tool_rotate.updateInterface();
	Interface.tool_rotate.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_ROTATE;
		Interface.tool_rotate.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_select.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});
 
	//Add Text
	Interface.add_text = new Text(Interface.tool_bar.element);
	Interface.add_text.text = "Add";
	Interface.add_text.position.set(Interface.tool_bar.size.x/2, 240);
	Interface.add_text.updateInterface();

	//Add Models
	Interface.add_model = new ButtonDrawer();
	Interface.add_model.setImage("editor/files/icons/models.png");
	Interface.add_model.image_scale.set(0.7, 0.7);
	Interface.add_model.options_scale.set(0.7, 0.7);
	Interface.add_model.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_model.position.set(0, 280);
	Interface.add_model.options_size.set(40, 40);
	Interface.add_model.updateInterface();

	Interface.add_model.addOption("editor/files/icons/cube.png", function()
	{
		//TODO <ADD CODE HERE>

		//Create Cube
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshPhongMaterial();
		var cube = new THREE.Mesh(geometry, material);
		Editor.scene.scene.add(cube);
	});

	Interface.add_model.addOption("editor/files/icons/cylinder.png", function()
	{
		//TODO <ADD CODE HERE>

		//Create Sphere
		var geometry = new THREE.SphereGeometry(0.6, 16, 16);
		var material = new THREE.MeshPhongMaterial();
		var sphere = new THREE.Mesh(geometry, material);
		Editor.scene.scene.add(sphere);
	});

	Interface.add_model.addOption("editor/files/icons/sphere.png", function()
	{
		//TODO <ADD CODE HERE>

		//Create Sphere
		var geometry = new THREE.SphereGeometry(0.6, 16, 16);
		var material = new THREE.MeshPhongMaterial();
		var sphere = new THREE.Mesh(geometry, material);
		Editor.scene.scene.add(sphere);
	});

	Interface.add_model.addOption("editor/files/icons/torus.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	Interface.add_model.addOption("editor/files/icons/pyramid.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	//Add lights
	Interface.add_light = new ButtonDrawer();
	Interface.add_light.setImage("editor/files/icons/bulb.png");
	Interface.add_light.image_scale.set(0.7, 0.7);
	Interface.add_light.options_scale.set(0.7, 0.7);
	Interface.add_light.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_light.position.set(0, 320);
	Interface.add_light.options_size.set(40, 40);
	Interface.add_light.updateInterface();

	Interface.add_light.addOption("editor/files/icons/bulb.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	Interface.add_light.addOption("editor/files/icons/sun.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	Interface.add_light.addOption("editor/files/icons/spotlight.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	//----------------------------------Menu Top Bar----------------------------------
	Interface.top_bar = new Division();
	Interface.top_bar.size.y = 25 ;
	Interface.top_bar.element.className = "bar";

	//Editor Logo
	Interface.image = new Image();
	Interface.image.setImage("data/logo.png");
	Interface.image.size.set(120, 15);
	Interface.image.updateInterface();

	//File
	Interface.file = new DropdownMenu();
	Interface.file.text = "File";
	Interface.file.size.set(150, Interface.top_bar.size.y);
	Interface.file.position.set(0,0);

	Interface.file.addOption("New Project", function()
	{
		//TODO <NEW PROJECT>
	});

	Interface.file.addOption("Save Project", function()
	{
		//TODO <SAVE PROJECT>
	});

	Interface.file.addOption("Load Project", function()
	{
		//TODO <LOAD PROJECT>
	});

	Interface.file.addOption("Exit", function()
	{
		//TODO <NEW PROJECT>
	});

	//Editor
	Interface.editor = new DropdownMenu();
	Interface.editor.text = "Editor";
	Interface.editor.size.set(150, Interface.top_bar.size.y);
	Interface.editor.position.set(150,0);
	Interface.editor.addOption("Undo", function()
	{
		//TODO <UNDO>
	});

	Interface.editor.addOption("Redo", function()
	{
		//TODO <REDO>
	});

	//About
	Interface.about = new Button();
	Interface.about.text = "About";
	Interface.about.size.set(150, Interface.top_bar.size.y);
	Interface.about.position.set(300, 0);
	Interface.about.updateInterface();
	Interface.about.setCallback(function()
	{
		//TODO <ABOUT>
	});
}

Interface.update = function()
{
	Interface.tool_bar.update();
	Interface.explorer.update();
	Interface.asset_explorer.update();
	Interface.add_model.update();
	Interface.dual_test.update();
}

Interface.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Menu Top bar
	Interface.top_bar.size.x = size.x;
	Interface.top_bar.updateInterface();

	//Tool bar
	Interface.tool_bar.position.set(0, Interface.top_bar.size.y);
	Interface.tool_bar.size.y = size.y - Interface.top_bar.size.y;
	Interface.tool_bar.updateInterface();

	//Explorer
	Interface.explorer.size.y = (size.y - Interface.top_bar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.top_bar.size.y);
	Interface.explorer.updateInterface();

	//Asset explorer
	Interface.asset_explorer.size.x = size.x - Interface.explorer.size.x - Interface.tool_bar.size.x;
	Interface.asset_explorer.position.set(Interface.tool_bar.size.x, size.y - Interface.asset_explorer.size.y);
	Interface.asset_explorer.updateInterface();

	//Image
	Interface.image.position.set(size.x - Interface.image.size.x, 5);
	Interface.image.updateInterface();

	//Tab
	Interface.tab.position.set(Interface.tool_bar.size.x, Interface.top_bar.size.y);
	Interface.tab.size.x = (size.x - Interface.tool_bar.size.x - Interface.explorer.size.x);
	Interface.tab.size.y = (size.y - Interface.top_bar.size.y - Interface.asset_explorer.size.y); 
	Interface.tab.updateInterface();

	//Resize editor camera
	Editor.resizeCamera();
}