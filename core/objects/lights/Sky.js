"use strict";

function Sky(auto_update, day_time, sun_distance, time)
{	
	//Call super contructor
	THREE.Object3D.call(this);

	//Attributes
	this.name = "sky";
	this.type = "Sky";

	//Hemisphere light
	this.hemisphere = new HemisphereLight(0xffffff, 0xffffff, 0.5);
	this.hemisphere.color.setHSL(0.6, 1, 0.6);
	this.hemisphere.groundColor.setHSL(0.1, 1, 0.75);
	this.hemisphere.position.set(0, 500, 0);
	this.hemisphere.hidden = true;
	this.hemisphere.rotationAutoUpdate = false;
	this.hemisphere.matrixAutoUpdate = false;
	this.add(this.hemisphere);

	//Directional sun light
	this.sun = new DirectionalLight(Sky.sun_color, 0.3);
	this.sun.castShadow = true;
	this.sun.hidden = true;
	this.add(this.sun);

	//Vertex Shader
	var vertex = "varying vec3 vWorldPosition; \
	void main() \
	{ \
		vec4 worldPosition = modelMatrix * vec4(position, 1.0); \
		vWorldPosition = worldPosition.xyz; \
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); \
	}";

	//Pixel shader
	var fragment = "uniform vec3 top_color; \
	uniform vec3 bottom_color; \
	uniform float offset; \
	uniform float exponent; \
	varying vec3 vWorldPosition; \
	void main() \
	{ \
		float h = normalize(vWorldPosition + offset).y; \
		gl_FragColor = vec4(mix(bottom_color, top_color, max(pow(max(h , 0.0), exponent), 0.0)), 1.0); \
	}";

	//Uniform vars values
	var uniforms =
	{
		top_color: {type: "c", value: new THREE.Color(0.0, 0.46, 1.0)},
		bottom_color: {type: "c", value: new THREE.Color(1.0, 1.0, 1.0)},
		offset:	{type: "f", value: 20},
		exponent: {type: "f", value: 0.4}
	};
	uniforms.top_color.value.copy(this.hemisphere.color);

	//Sky geometry and material
	var geometry = new THREE.SphereBufferGeometry(5000, 16, 16);
	var material = new THREE.ShaderMaterial({vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms, side: THREE.BackSide});
	this.sky = new THREE.Mesh(geometry, material);
	this.sky.hidden = true;
	this.sky.rotationAutoUpdate = false;
	this.sky.matrixAutoUpdate = false;
	this.add(this.sky);

	//Day time (seconds) and sun distance
	this.auto_update = true;
	this.sun_distance = 1000;
	this.day_time = 20; //seconds
	this.time = 13;

	//Get parameters
	if(auto_update !== undefined)
	{
		this.auto_update = auto_update;
	}
	if(day_time !== undefined)
	{
		this.day_time = day_time;
	}
	if(sun_distance !== undefined)
	{
		this.sun_distance = sun_distance;
	}
	if(time !== undefined)
	{
		this.time = time;
	}

	this.updateSky();
}

//Sky color (morning, noon, afternoon, night)
Sky.color_top = [new THREE.Color(0x77b3fb), new THREE.Color(0x0076ff), new THREE.Color(0x035bb6), new THREE.Color(0x002439)];
Sky.color_bottom = [new THREE.Color(0xebece6), new THREE.Color(0xffffff), new THREE.Color(0xfee7d7), new THREE.Color(0x0065a7)];
Sky.sun_color = 0xffffaa;
Sky.moon_color = 0x8888ff;

//Function Prototype
Sky.prototype = Object.create(THREE.Object3D.prototype);
Sky.prototype.initialize = initialize;
Sky.prototype.update = update;
Sky.prototype.updateSky = updateSky;
Sky.prototype.toJSON = toJSON;
Sky.prototype.raycast = raycast;

//Initialize
function initialize()
{
	this.updateSky();
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	//Update time
	if(this.auto_update)
	{
		this.time += App.delta_time / 1000;
		if(this.time > this.day_time)
		{
			this.time -= this.day_time;
		}

		this.updateSky();
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}


//Update sky color and sun position
function updateSky()
{
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
	//17H -> 18h (noon to afternoon)
	else if(time < 0.75)
	{
		var t = (time-0.708) * 23.81;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[1].r + t*Sky.color_top[2].r, f*Sky.color_top[1].g + t*Sky.color_top[2].g, f*Sky.color_top[1].b + t*Sky.color_top[2].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[1].r + t*Sky.color_bottom[2].r, f*Sky.color_bottom[1].g + t*Sky.color_bottom[2].g, f*Sky.color_bottom[1].b + t*Sky.color_bottom[2].b);
	}
	//18H -> 20H (afternoon to night)
	else if(time < 0.8333)
	{
		var t = (time-0.75) * 12.048;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*Sky.color_top[2].r + t*Sky.color_top[3].r, f*Sky.color_top[2].g + t*Sky.color_top[3].g, f*Sky.color_top[2].b + t*Sky.color_top[3].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*Sky.color_bottom[2].r + t*Sky.color_bottom[3].r, f*Sky.color_bottom[2].g + t*Sky.color_bottom[3].g, f*Sky.color_bottom[2].b + t*Sky.color_bottom[3].b);
	}
	//20H -> 24H (night)
	else
	{
		this.sky.material.uniforms.top_color.value.setRGB(Sky.color_top[3].r, Sky.color_top[3].g, Sky.color_top[3].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(Sky.color_bottom[3].r, Sky.color_bottom[3].g, Sky.color_bottom[3].b);
	}

	//Sun / moon color
	if(time < 0.20)
	{
		this.sun.color.setHex(Sky.moon_color);
	}
	else if(time < 0.30)
	{
		var t = (time-0.20) * 10;
		var f = 1 - t;

		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * 0.3;
			this.sun.color.setHex(Sky.moon_color);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * 0.3;
			this.sun.color.setHex(Sky.sun_color);
		}
	}
	else if(time < 0.70)
	{
		this.sun.color.setHex(Sky.sun_color);
	}
	else if(time < 0.80)
	{
		var t = (time - 0.70) * 10;
		
		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * 0.3;
			this.sun.color.setHex(Sky.sun_color);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * 0.3;
			this.sun.color.setHex(Sky.moon_color);
		}
	}
	else
	{
		this.sun.color.setHex(Sky.moon_color);
	}

	//Update sun position
	var rotation = (MathUtils.pi2 * time) - MathUtils.pid2;
	if(time > 0.25 && time < 0.75)
	{
		this.sun.position.x = this.sun_distance * Math.cos(rotation);
		this.sun.position.y = this.sun_distance * Math.sin(rotation);
	}
	else
	{
		this.sun.position.x = this.sun_distance * Math.cos(rotation + Math.PI);
		this.sun.position.y = this.sun_distance * Math.sin(rotation + Math.PI);	
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);
	
	data.object.auto_update = this.auto_update;
	data.object.sun_distance = this.sun_distance;
	data.object.day_time = this.day_time;
	data.object.time = this.time;

	return data;
}

//Sky is not collidable
function raycast()
{
	return null;
}
