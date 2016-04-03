function Sky()
{
	THREE.Scene.call(this);

	this.name = "sky";

	//Sun
	this.sun = new DirectionalLight(0xffffaa, 0.3);
	this.sun.castShadow = true;
	this.add(this.sun);

	//Hemisphere
	this.hemisphere = new HemisphereLight(0xffffff, 0xffffff, 0.3);
	this.hemisphere.color.setHSL(0.6, 1, 0.6);
	this.hemisphere.groundColor.setHSL(0.095, 1, 0.75);
	this.hemisphere.position.set(0, 500, 0);
	this.add(this.hemisphere);

	//Sun position controll
	this.distance = 200;
	this.day_time = 10;
	this.time = 0;

	//Sky Shader
	var vertex = App.readFile("data/shaders/sky_vertex.glsl");
	var fragment = App.readFile("data/shaders/sky_fragment.glsl");
	var uniforms =
	{
		topColor: {type: "c", value: new THREE.Color(0x0077ff)},
		bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
		offset:	{type: "f", value: 33},
		exponent: {type: "f", value: 0.6}
	};
	uniforms.topColor.value.copy(this.hemisphere.color);

	//Sky
	var geometry = new THREE.SphereGeometry(4000, 32, 15);
	var material = new THREE.ShaderMaterial({vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms, side: THREE.BackSide});
	this.sky = new Model3D(geometry, material);
	this.add(this.sky);
}

//Function Prototype
Sky.prototype = Object.create(THREE.Scene.prototype);
Sky.prototype.icon = "editor/files/icons/lights/sky.png";

//Runtime functions
Sky.prototype.initialize = initialize;
Sky.prototype.update = update;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{

	this.time += App.delta_time / (this.day_time * 1000);

	//Update position
	this.sun.position.x = this.distance * Math.cos(this.time);
	this.sun.position.y = this.distance * Math.sin(this.time);

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
