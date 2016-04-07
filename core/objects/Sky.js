function Sky()
{
	THREE.Scene.call(this);

	this.name = "sky";

	//Sun
	this.sun = new DirectionalLight(0xffffaa, 0.3);
	this.sun.castShadow = true;
	this.sun.name = "sun";
	this.add(this.sun);

	//Hemisphere
	this.hemisphere = new HemisphereLight(0xffffff, 0xffffff, 0.3);
	this.hemisphere.color.setHSL(0.6, 1, 0.6);
	this.hemisphere.groundColor.setHSL(0.095, 1, 0.75);
	this.hemisphere.position.set(0, 500, 0);
	this.hemisphere.name = "horizon";
	this.add(this.hemisphere);

	//Sun position controll
	this.distance = 200;

	//Day time
	this.update_time = true;
	this.day_time = 20; //seconds
	this.time = 5;

	//Sky Shader
	var vertex = App.readFile("data/shaders/sky_vertex.glsl");
	var fragment = App.readFile("data/shaders/sky_fragment.glsl");
	var uniforms =
	{
		top_color: {type: "c", value: new THREE.Color(0.0, 0.46, 1.0)},
		bottom_color: {type: "c", value: new THREE.Color(1.0, 1.0, 1.0)},
		offset:	{type: "f", value: 20},
		exponent: {type: "f", value: 0.4}
	};
	uniforms.top_color.value.copy(this.hemisphere.color);

	//Sky
	var geometry = new THREE.SphereGeometry(4000, 32, 15);
	var material = new THREE.ShaderMaterial({vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms, side: THREE.BackSide});
	this.sky = new Model3D(geometry, material);
	this.sky.name = "sky";
	this.add(this.sky);
}

//Sky color (morning, noon, afternoon, night)
Sky.color_top = [new THREE.Color(0x77b3fb), new THREE.Color(0x0076ff), new THREE.Color(0x035bb6), new THREE.Color(0x002439)];
Sky.color_bottom = [new THREE.Color(0xebece6), new THREE.Color(0xffffff), new THREE.Color(0xfee7d7), new THREE.Color(0x0065a7)];

//Auxiliar Values
Sky.pi2 = Math.PI * 2;
Sky.pid2 = Math.PI / 2;

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
	if(this.update_time)
	{
		//Update time
		this.time += App.delta_time / 1000;
		if(this.time > this.day_time)
		{
			this.time -= this.day_time;
		}

		//Time in % of day
		var time = (this.time / this.day_time);

		//0H - 6H (night)
		if(time < 0.25)
		{
			this.sky.material.uniforms.top_color.value.setRGB(Sky.color_top[3].r, Sky.color_top[3].g, Sky.color_top[3].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(Sky.color_bottom[3].r, Sky.color_bottom[3].g, Sky.color_bottom[3].b);
		}
		//6H - 7H (night to morning)
		else if(time < 0.292)
		{
			var t = (time-0.25) * 23.81;
			var f = 1 - t;

			this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[3].r + t*Sky.color_top[0].r, f*Sky.color_top[3].g + t*Sky.color_top[0].g, f*Sky.color_top[3].b + t*Sky.color_top[0].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[3].r + t*Sky.color_bottom[0].r, f*Sky.color_bottom[3].g + t*Sky.color_bottom[0].g, f*Sky.color_bottom[3].b + t*Sky.color_bottom[0].b);
		}
		//7H - 10H (morning)
		else if(time < 0.4167)
		{
			this.sky.material.uniforms.top_color.value.setRGB(Sky.color_top[0].r, Sky.color_top[0].g, Sky.color_top[0].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(Sky.color_bottom[0].r, Sky.color_bottom[0].g, Sky.color_bottom[0].b);
		}
		//10H - 12H (morning to noon)
		else if(time < 0.5)
		{
			var t = (time-0.4167) * 12;
			var f = 1 - t;

			this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[0].r + t*Sky.color_top[1].r, f*Sky.color_top[0].g + t*Sky.color_top[1].g, f*Sky.color_top[0].b + t*Sky.color_top[1].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[0].r + t*Sky.color_bottom[1].r, f*Sky.color_bottom[0].g + t*Sky.color_bottom[1].g, f*Sky.color_bottom[0].b + t*Sky.color_bottom[1].b);
		}
		//12H - 17H (noon)
		else if(time < 0.708)
		{
			this.sky.material.uniforms.top_color.value.setRGB(Sky.color_top[1].r, Sky.color_top[1].g, Sky.color_top[1].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(Sky.color_bottom[1].r, Sky.color_bottom[1].g, Sky.color_bottom[1].b);
		}
		//17H -> 19h (noon to afternoon)
		else if(time < 0.792)
		{
			var t = (time-0.708) * 11.90476;
			var f = 1 - t;

			this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[1].r + t*Sky.color_top[2].r, f*Sky.color_top[1].g + t*Sky.color_top[2].g, f*Sky.color_top[1].b + t*Sky.color_top[2].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[1].r + t*Sky.color_bottom[2].r, f*Sky.color_bottom[1].g + t*Sky.color_bottom[2].g, f*Sky.color_bottom[1].b + t*Sky.color_bottom[2].b);
		}
		//19H -> 21H (afternoon to night)
		else if(time < 0.875)
		{
			var t = (time-0.792) * 12.048;
			var f = 1 - t;

			this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[2].r + t*Sky.color_top[3].r, f*Sky.color_top[2].g + t*Sky.color_top[3].g, f*Sky.color_top[2].b + t*Sky.color_top[3].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[2].r + t*Sky.color_bottom[3].r, f*Sky.color_bottom[2].g + t*Sky.color_bottom[3].g, f*Sky.color_bottom[2].b + t*Sky.color_bottom[3].b);
		}
		//21H -> 24H (night)
		else
		{
			this.sky.material.uniforms.top_color.value.setRGB(Sky.color_top[3].r, Sky.color_top[3].g, Sky.color_top[3].b);
			this.sky.material.uniforms.bottom_color.value.setRGB(Sky.color_bottom[3].r, Sky.color_bottom[3].g, Sky.color_bottom[3].b);
		}

		//Update sun position
		var rotation = (Sky.pi2 * time) - Sky.pid2;
		this.sun.position.x = this.distance * Math.cos(rotation);
		this.sun.position.y = this.distance * Math.sin(rotation);
	}
	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
