function Interface(){}

Interface.initialize = function()
{	
	//Style
	Interface.theme = new Style();
	Interface.theme.setStyleSheet("editor/files/css/dark.css");

	//Top Bar
	Interface.top_bar = new Division();
	Interface.top_bar.size.y = 30 ;
	Interface.top_bar.element.className = "bar";

	//Project Exploer
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;

	//Tool Bar
	Interface.tool_bar = new Division();
	Interface.tool_bar.size.x = 50;
	Interface.tool_bar.element.className = "bar";

	//Asset Explorer
	Interface.asset_explorer = new DivisionResizable();
	Interface.asset_explorer.resizable_side = DivisionResizable.TOP;
	Interface.asset_explorer.size.y = 200;

	//Button
	Interface.but_text = new Button();
	Interface.but_text.setCallback(function()
	{
		var a = new Button();
		a.size.set(50,30);
		a.position.set(Math.random() * 500, Math.random() * 500);
		a.text = "test";
		a.updateInterface();
		a.setCallback(function()
		{
			Interface.dropdown.visible = false;
			Interface.dropdown.updateInterface();
		});
	});
	Interface.but_text.size.set(150,30);
	Interface.but_text.position.set(0,0);
	Interface.but_text.text = "File";

	//Text test
	Interface.text = new Text();
	Interface.text.text = "qwerty";

	//Image test
	Interface.image = new Image();
	Interface.image.setImage("data/logo.png");
	Interface.image.size.set(160, 20);
	Interface.image.updateInterface();
	
	//Image Button test
	Interface.but_image = new ButtonImage();
	Interface.but_image.setImage("editor/files/icons/models.png");
	Interface.but_image.size.set(50, 50);
	Interface.but_image.position.set(0,30);
	Interface.but_image.updateInterface();
	Interface.but_image.setCallback(function()
	{
		var material = new THREE.MeshPhongMaterial({color: Math.floor(Math.random() * 0xffffff)});
		var i = 2;
		if(Math.random() < 0.5)
		{
			var size = Math.random();
			var shape = new CANNON.Box(new CANNON.Vec3(size, size, size));
			var geometry = new THREE.BoxGeometry(size*2, size*2, size*2, 10, 10);
		}
		else
		{
			var size = Math.random() * 2;
			var shape = new CANNON.Sphere(size);
			var geometry = new THREE.SphereGeometry(size, 16, 16);
		}

		var body = new CANNON.Body({mass:1, linearDamping:0.1, angularDamping:0.1});
		body.addShape(shape);
		body.position.set(Math.random()*10 - 5, 2.5*i+0.5, Math.random()*10 - 5);
		Editor.physics_objects.push(body);
		Editor.world.addBody(body);

		var cube = new THREE.Mesh(geometry, material);
		cube.castShadow = true;
		Editor.render_objects.push(cube);
		Editor.scene.add(cube);
	});

	//Button drawer
	Interface.but_drawer = new ButtonDrawer();
	Interface.but_drawer.setImage("editor/files/sign.png");
	Interface.but_drawer.size.set(50, 50);
	Interface.but_drawer.position.set(0, 80);
	Interface.but_drawer.updateInterface();
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});
	Interface.but_drawer.addOption("editor/files/sign.png", function(){});

	//Dropdown
	Interface.dropdown = new DropdownMenu();
	Interface.dropdown.text = "Test";
	Interface.dropdown.size.set(150,30);
	Interface.dropdown.position.set(150,0);
	Interface.temp = 0;
	Interface.dropdown.addOption("a", function()
	{
		Interface.dropdown.addOption("a" + Interface.temp, function()
		{
			Interface.dropdown.removeOption(1);
		});
		Interface.temp++;
	});

	//Text box test
	Interface.text_box = new TextBox(Interface.explorer.element);
	Interface.text_box.position.set(80, 10);
	Interface.text_box.size.set(180, 25);
	Interface.text_box.updateInterface();

	Interface.text_2 = new Text(Interface.explorer.element);
	Interface.text_2.text = "TextBox:";
	Interface.text_2.position.set(40, 25);
	Interface.text_2.updateInterface();

	Interface.updateInterface();
}

Interface.update = function()
{
	Interface.tool_bar.update();
	Interface.explorer.update();
	Interface.asset_explorer.update();
	Interface.but_drawer.update();
}

Interface.draw = function(){}

Interface.resize = function(){}

Interface.updateInterface = function()
{
	var canvas = document.getElementById("canvas");

	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Top bar
	Interface.top_bar.size.x = size.x;

	//Tool bar
	Interface.tool_bar.position.set(0, Interface.top_bar.size.y);
	Interface.tool_bar.size.y = size.y - Interface.top_bar.size.y;
	
	//Explorer
	Interface.explorer.size.y = (size.y - Interface.top_bar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.top_bar.size.y);

	//Asset explorer
	Interface.asset_explorer.size.x = size.x - Interface.explorer.size.x - Interface.tool_bar.size.x;
	Interface.asset_explorer.position.set(Interface.tool_bar.size.x, size.y - Interface.asset_explorer.size.y);

	//Image
	Interface.image.position.set(size.x - Interface.image.size.x, 5);

	//Text
	Interface.text.position.set(size.x/2, size.y/2);

	//Canvas
	canvas.style.position = "absolute"; 
	canvas.style.top = Interface.top_bar.size.y + "px";
	canvas.style.left = Interface.tool_bar.size.x + "px";
	canvas.width = (size.x - Interface.tool_bar.size.x - Interface.explorer.size.x);
	canvas.height = (size.y - Interface.top_bar.size.y); 
	canvas.style.width = canvas.width + "px";
	canvas.style.height = canvas.height + "px";

	Editor.resizeCamera(canvas);

	//Update interface status
	Interface.explorer.updateInterface();
	Interface.asset_explorer.updateInterface();
	Interface.tool_bar.updateInterface();
	Interface.top_bar.updateInterface();
	Interface.but_text.updateInterface();
	Interface.dropdown.updateInterface();
	Interface.text.updateInterface();
	Interface.image.updateInterface();
	Interface.text_box.updateInterface();
}