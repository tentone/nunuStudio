"use strict";

function Sky(auto_update, day_time, sun_distance, time)
{	
	THREE.Object3D.call(this);

	this.name = "sky";
	this.type = "Sky";

	//Clock
	this.clock = new THREE.Clock();

	//Colors (morning, noon, afternoon, night)
	this.color_top = [new THREE.Color(0x77b3fb), new THREE.Color(0x0076ff), new THREE.Color(0x035bb6), new THREE.Color(0x002439)];
	this.color_bottom = [new THREE.Color(0xebece6), new THREE.Color(0xffffff), new THREE.Color(0xfee7d7), new THREE.Color(0x0065a7)];
	this.sun_color = 0xffffaa;
	this.moon_color = 0x8888ff;

	//Hemisphere light
	this.hemisphere = new HemisphereLight(0xffffff, 0xffffff, 0.5);
	this.hemisphere.color.setHSL(0.6, 1, 0.6);
	this.hemisphere.groundColor.setHSL(0.1, 1, 0.75);
	this.hemisphere.position.set(0, 500, 0);
	this.hemisphere.hidden = true;
	this.hemisphere.matrixAutoUpdate = false;
	this.add(this.hemisphere);

	//Sun light
	this.sun = new DirectionalLight(this.sun_color, 0.3);
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

	//Uniforms
	var uniforms =
	{
		top_color: {type: "c", value: new THREE.Color(0.0, 0.46, 1.0)},
		bottom_color: {type: "c", value: new THREE.Color(1.0, 1.0, 1.0)},
		offset:	{type: "f", value: 20},
		exponent: {type: "f", value: 0.4}
	};
	uniforms.top_color.value.copy(this.hemisphere.color);

	//Sky
	var geometry = new THREE.SphereBufferGeometry(1000, 16, 16);
	var material = new THREE.ShaderMaterial({vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms, side: THREE.BackSide});
	
	this.sky = new THREE.Mesh(geometry, material);
	this.sky.hidden = true;
	this.sky.matrixAutoUpdate = false;
	this.add(this.sky);

	//Override sky raycast function
	this.sky.raycast = function()
	{
		return null;
	};

	//Day time (seconds) and sun distance
	this.auto_update = (auto_update !== undefined) ? auto_update : true;
	this.sun_distance = (sun_distance !== undefined) ? sun_distance : 500;
	this.day_time = (day_time !== undefined) ? day_time : 240;
	this.time = (time !== undefined) ? time : 150;

	this.updateSky();
}

Sky.prototype = Object.create(THREE.Object3D.prototype);

//Initialize
Sky.prototype.initialize = function()
{
	this.updateSky();
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
Sky.prototype.update = function()
{
	//Update time
	if(this.auto_update)
	{
		this.time += this.clock.getDelta();
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
Sky.prototype.updateSky = function()
{
	//Time in % of day
	var time = (this.time / this.day_time);

	//0H - 6H (night)
	if(time < 0.25)
	{
		this.sky.material.uniforms.top_color.value.setRGB(this.color_top[3].r, this.color_top[3].g, this.color_top[3].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(this.color_bottom[3].r, this.color_bottom[3].g, this.color_bottom[3].b);
	}
	//6H - 7H (night to morning)
	else if(time < 0.292)
	{
		var t = (time-0.25) * 23.81;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*this.color_top[3].r + t*this.color_top[0].r, f*this.color_top[3].g + t*this.color_top[0].g, f*this.color_top[3].b + t*this.color_top[0].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*this.color_bottom[3].r + t*this.color_bottom[0].r, f*this.color_bottom[3].g + t*this.color_bottom[0].g, f*this.color_bottom[3].b + t*this.color_bottom[0].b);
	}
	//7H - 10H (morning)
	else if(time < 0.4167)
	{
		this.sky.material.uniforms.top_color.value.setRGB(this.color_top[0].r, this.color_top[0].g, this.color_top[0].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(this.color_bottom[0].r, this.color_bottom[0].g, this.color_bottom[0].b);
	}
	//10H - 12H (morning to noon)
	else if(time < 0.5)
	{
		var t = (time-0.4167) * 12;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*this.color_top[0].r + t*this.color_top[1].r, f*this.color_top[0].g + t*this.color_top[1].g, f*this.color_top[0].b + t*this.color_top[1].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*this.color_bottom[0].r + t*this.color_bottom[1].r, f*this.color_bottom[0].g + t*this.color_bottom[1].g, f*this.color_bottom[0].b + t*this.color_bottom[1].b);
	}
	//12H - 17H (noon)
	else if(time < 0.708)
	{
		this.sky.material.uniforms.top_color.value.setRGB(this.color_top[1].r, this.color_top[1].g, this.color_top[1].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(this.color_bottom[1].r, this.color_bottom[1].g, this.color_bottom[1].b);
	}
	//17H -> 18h (noon to afternoon)
	else if(time < 0.75)
	{
		var t = (time-0.708) * 23.81;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*this.color_top[1].r + t*this.color_top[2].r, f*this.color_top[1].g + t*this.color_top[2].g, f*this.color_top[1].b + t*this.color_top[2].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*this.color_bottom[1].r + t*this.color_bottom[2].r, f*this.color_bottom[1].g + t*this.color_bottom[2].g, f*this.color_bottom[1].b + t*this.color_bottom[2].b);
	}
	//18H -> 20H (afternoon to night)
	else if(time < 0.8333)
	{
		var t = (time-0.75) * 12.048;
		var f = 1 - t;

		this.sky.material.uniforms.top_color.value.setRGB(f*this.color_top[2].r + t*this.color_top[3].r, f*this.color_top[2].g + t*this.color_top[3].g, f*this.color_top[2].b + t*this.color_top[3].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(f*this.color_bottom[2].r + t*this.color_bottom[3].r, f*this.color_bottom[2].g + t*this.color_bottom[3].g, f*this.color_bottom[2].b + t*this.color_bottom[3].b);
	}
	//20H -> 24H (night)
	else
	{
		this.sky.material.uniforms.top_color.value.setRGB(this.color_top[3].r, this.color_top[3].g, this.color_top[3].b);
		this.sky.material.uniforms.bottom_color.value.setRGB(this.color_bottom[3].r, this.color_bottom[3].g, this.color_bottom[3].b);
	}

	//Sun / moon color
	if(time < 0.20)
	{
		this.sun.color.setHex(this.moon_color);
	}
	else if(time < 0.30)
	{
		var t = (time-0.20) * 10;
		var f = 1 - t;

		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * 0.3;
			this.sun.color.setHex(this.moon_color);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * 0.3;
			this.sun.color.setHex(this.sun_color);
		}
	}
	else if(time < 0.70)
	{
		this.sun.color.setHex(this.sun_color);
	}
	else if(time < 0.80)
	{
		var t = (time - 0.70) * 10;
		
		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * 0.3;
			this.sun.color.setHex(this.sun_color);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * 0.3;
			this.sun.color.setHex(this.moon_color);
		}
	}
	else
	{
		this.sun.color.setHex(this.moon_color);
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
Sky.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);
	
	data.object.auto_update = this.auto_update;
	data.object.sun_distance = this.sun_distance;
	data.object.day_time = this.day_time;
	data.object.time = this.time;

	data.object.sun = {};
 	data.object.sun.shadow = this.sun.shadow.toJSON();

	return data;
}
