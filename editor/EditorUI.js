function EditorUI(){}

EditorUI.initialize = function()
{	
	//Style
	EditorUI.theme = new Style();
	EditorUI.theme.setStyleSheet("editor/files/css/dark.css");

	//Top Bar
	EditorUI.top_bar = new Division();
	EditorUI.top_bar.size.y = 30 ;
	EditorUI.top_bar.element.className = "bar";

	//Project Exploer
	EditorUI.explorer = new DivisionResizable();
	EditorUI.explorer.size.x = 300;

	//Tool Bar
	EditorUI.tool_bar = new Division();
	EditorUI.tool_bar.size.x = 50;
	EditorUI.tool_bar.element.className = "bar";

	//Asset Explorer
	EditorUI.asset_explorer = new DivisionResizable();
	EditorUI.asset_explorer.resizable_side = DivisionResizable.TOP;
	EditorUI.asset_explorer.size.y = 200;

	//Button
	EditorUI.but_text = new Button();
	EditorUI.but_text.setCallback(function()
	{
		var a = new Button();
		a.size.set(50,30);
		a.position.set(Math.random() * 500, Math.random() * 500);
		a.text = "test";
		a.updateInterface();
		a.setCallback(function()
		{
			EditorUI.dropdown.visible = false;
			EditorUI.dropdown.updateInterface();
			//EditorUI.theme.setStyleSheet("editor/files/css/notdark.css");
		});
	});
	EditorUI.but_text.size.set(150,30);
	EditorUI.but_text.position.set(0,0);
	EditorUI.but_text.text = "File";

	//Text test
	EditorUI.text = new Text();
	EditorUI.text.text = "qwerty";

	//Image test
	EditorUI.image = new Image();
	EditorUI.image.setImage("data/logo.png");
	EditorUI.image.size.set(160, 20);
	EditorUI.image.updateInterface();
	
	//Image Button test
	EditorUI.but_image = new ButtonImage();
	EditorUI.but_image.setImage("editor/files/sign.png");
	EditorUI.but_image.size.set(50, 50);
	EditorUI.but_image.position.set(0,30);
	EditorUI.but_image.updateInterface();
	EditorUI.but_image.setCallback(function()
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
	EditorUI.but_drawer = new ButtonDrawer();
	EditorUI.but_drawer.setImage("editor/files/sign.png");
	EditorUI.but_drawer.size.set(50, 50);
	EditorUI.but_drawer.position.set(0, 80);
	EditorUI.but_drawer.updateInterface();
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	EditorUI.but_drawer.addOption("editor/files/sign.png", function(){});
	
	//Dropdown
	EditorUI.dropdown = new DropdownMenu();
	EditorUI.dropdown.text = "Test";
	EditorUI.dropdown.size.set(150,30);
	EditorUI.dropdown.position.set(150,0);
	EditorUI.temp = 0;
	EditorUI.dropdown.addOption("a", function()
	{
		EditorUI.dropdown.addOption("a" + EditorUI.temp, function()
		{
			EditorUI.dropdown.removeOption(1);
		});
		EditorUI.temp++;
	});

	EditorUI.updateInterface();
}

EditorUI.update = function()
{
	EditorUI.tool_bar.update();
	EditorUI.explorer.update();
	EditorUI.asset_explorer.update();
	EditorUI.but_drawer.update();
}

EditorUI.draw = function(){}

EditorUI.resize = function(){}

EditorUI.updateInterface = function()
{
	var canvas = document.getElementById("canvas");

	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Top bar
	EditorUI.top_bar.size.x = size.x;

	//Tool bar
	EditorUI.tool_bar.position.set(0, EditorUI.top_bar.size.y);
	EditorUI.tool_bar.size.y = size.y - EditorUI.top_bar.size.y;
	
	//Explorer
	EditorUI.explorer.size.y = (size.y - EditorUI.top_bar.size.y);
	EditorUI.explorer.position.set(size.x - EditorUI.explorer.size.x, EditorUI.top_bar.size.y);

	//Asset explorer
	EditorUI.asset_explorer.size.x = size.x - EditorUI.explorer.size.x - EditorUI.tool_bar.size.x;
	EditorUI.asset_explorer.position.set(EditorUI.tool_bar.size.x, size.y - EditorUI.asset_explorer.size.y);

	//Image
	EditorUI.image.position.set(size.x - EditorUI.image.size.x, 5);

	//Text
	EditorUI.text.position.set(size.x/2, size.y/2);

	//Canvas
	canvas.style.position = "absolute"; 
	canvas.style.top = EditorUI.top_bar.size.y + "px";
	canvas.style.left = EditorUI.tool_bar.size.x + "px";
	canvas.width = (size.x - EditorUI.tool_bar.size.x - EditorUI.explorer.size.x);
	canvas.height = (size.y - EditorUI.top_bar.size.y); 
	canvas.style.width = canvas.width + "px";
	canvas.style.height = canvas.height + "px";

	Editor.resizeCamera(canvas);

	//Update interface status
	EditorUI.explorer.updateInterface();
	EditorUI.asset_explorer.updateInterface();
	EditorUI.tool_bar.updateInterface();
	EditorUI.top_bar.updateInterface();
	EditorUI.but_text.updateInterface();
	EditorUI.dropdown.updateInterface();
	EditorUI.text.updateInterface();
	EditorUI.image.updateInterface();
}