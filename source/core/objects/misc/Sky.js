"use strict";

/**
 * Sky class if composed of a HemisphereLight, DirectionalLight and a dynamic generated Sky sphere geometry.
 * 
 * This object is composed by 3 internal objects
 * 	- Hemisphere light
 * 	- Directional Light
 * 	- Mesh
 * 
 * @param {boolean} autoUpdate If true sky auto updated its state 
 * @param {Number} dayTime Day duration in seconds
 * @param {Number} sunDistance Distance of the sun
 * @param {Number} time Starting time
 * @class Sky
 * @extends {Object3D}
 * @module Lights
 */
function Sky(autoUpdate, dayTime, sunDistance, time)
{	
	THREE.Group.call(this);

	this.name = "sky";
	this.type = "Sky";
	
	/**
	 * Array with top sky colors.
	 *
	 * @property colorTop
	 * @type {Array}
	 */
	this.colorTop = [new THREE.Color(0x77b3fb), new THREE.Color(0x0076ff), new THREE.Color(0x035bb6), new THREE.Color(0x002439)];

	/**
	 * Array with bottom sky colors.
	 *
	 * @property colorBottom
	 * @type {Array}
	 */
	this.colorBottom = [new THREE.Color(0xebece6), new THREE.Color(0xffffff), new THREE.Color(0xfee7d7), new THREE.Color(0x0065a7)];

	/**
	 * Sun color in hex RGB.
	 *
	 * @property sunColor
	 * @type {Number}
	 * @default 0xFFFFAA
	 */
	this.sunColor = 0xFFFFAA;

	/**
	 * Sun color intensity.
	 *
	 * @property intensity
	 * @type {Number}
	 */
	this.intensity = 0.3;

	/**
	 * Moon color in hex RGB.
	 *
	 * @property moonColor
	 * @type {Number}
	 * @default 0x5555BB
	 */
	this.moonColor = 0x5555BB;

	/**
	 * Hemisphere light used to match ambient ligth with sky color.
	 *
	 * @property hemisphere
	 * @type {HemisphereLight}
	 */
	this.hemisphere = new THREE.HemisphereLight(0x3284ff, 0xffcc7f, 0.5);
	this.hemisphere.locked = true;
	this.hemisphere.matrixAutoUpdate = false;
	this.add(this.hemisphere);

	/**
	 * Directional light to simulate sun light and cast shadows.
	 *
	 * @property sun
	 * @type {DirectionalLight}
	 */
	this.sun = new DirectionalLight(this.sunColor, this.intensity);
	this.sun.castShadow = true;
	this.sun.locked = true;
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
	var fragment = "uniform vec3 topColor; \
	uniform vec3 bottomColor; \
	uniform float offset; \
	uniform float exponent; \
	varying vec3 vWorldPosition; \
	void main() \
	{ \
		float h = normalize(vWorldPosition + offset).y; \
		gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h , 0.0), exponent), 0.0)), 1.0); \
	}";

	//Uniforms
	var uniforms =
	{
		topColor: {type: "c", value: new THREE.Color(0.0, 0.46, 1.0)},
		bottomColor: {type: "c", value: new THREE.Color(1.0, 1.0, 1.0)},
		offset:	{type: "f", value: 20},
		exponent: {type: "f", value: 0.2}
	};
	
	uniforms.topColor.value.copy(this.hemisphere.color);

	//Sky
	var geometry = new THREE.SphereBufferGeometry(1500, 16, 16);
	var material = new THREE.ShaderMaterial({vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms, side: THREE.BackSide});

	/**
	 * Sky mesh with material shader to calculate dinamically sky color.
	 *
	 * @property sky
	 * @type {Mesh}
	 */
	this.sky = new THREE.Mesh(geometry, material);
	this.sky.locked = true;
	this.sky.matrixAutoUpdate = false;
	this.add(this.sky);

	//Override sky raycast function
	this.sky.raycast = function()
	{
		return null;
	};

	/**
	 * If set to true the sky auto updates its time.
	 *
	 * @property autoUpdate
	 * @default true
	 * @type {boolean}
	 */
	this.autoUpdate = autoUpdate !== undefined ? autoUpdate : true;

	/**
	 * Sun distance.
	 *
	 * @property sunDistance
	 * @type {Number}
	 */
	this.sunDistance = sunDistance !== undefined ? sunDistance : 100;

	/**
	 * Day time in seconds.
	 *
	 * @property dayTime
	 * @type {Number}
	 */
	this.dayTime = dayTime !== undefined ? dayTime : 120;

	/**
	 * Current day time in seconds.
	 *
	 * @property time
	 * @type {Number}
	 */
	this.time = time !== undefined ? time : 75;
	
	this.updateSky();
}

Sky.prototype = Object.create(THREE.Group.prototype);

/**
 * Initialize sky object.
 * 
 * Called automatically by the runtime.
 * 
 * @method initialize
 */
Sky.prototype.initialize = function()
{
	this.updateSky();
	
	THREE.Object3D.prototype.initialize.call(this);
};

/**
 * Update sky state.
 * 
 * Called automatically by the runtime.
 * 
 * @method update
 */
Sky.prototype.update = function(delta)
{
	//Update time
	if(this.autoUpdate)
	{
		this.time += delta;

		if(this.time > this.dayTime)
		{
			this.time -= this.dayTime;
		}

		this.updateSky();
	}

	//Update children
	THREE.Object3D.prototype.update.call(this, delta);
};

/**
 * Update sky color and sun position.
 * 
 * If autoUpdate set to true is automatically called by the update method.
 * 
 * @method updateSky
 */
Sky.prototype.updateSky = function()
{
	//Time in % of day
	var time = (this.time / this.dayTime);

	//0H - 6H (night)
	if(time < 0.25)
	{
		this.sky.material.uniforms.topColor.value.setRGB(this.colorTop[3].r, this.colorTop[3].g, this.colorTop[3].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(this.colorBottom[3].r, this.colorBottom[3].g, this.colorBottom[3].b);
	}
	//6H - 7H (night to morning)
	else if(time < 0.292)
	{
		var t = (time-0.25) * 23.81;
		var f = 1 - t;

		this.sky.material.uniforms.topColor.value.setRGB(f*this.colorTop[3].r + t*this.colorTop[0].r, f*this.colorTop[3].g + t*this.colorTop[0].g, f*this.colorTop[3].b + t*this.colorTop[0].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(f*this.colorBottom[3].r + t*this.colorBottom[0].r, f*this.colorBottom[3].g + t*this.colorBottom[0].g, f*this.colorBottom[3].b + t*this.colorBottom[0].b);
	}
	//7H - 10H (morning)
	else if(time < 0.4167)
	{
		this.sky.material.uniforms.topColor.value.setRGB(this.colorTop[0].r, this.colorTop[0].g, this.colorTop[0].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(this.colorBottom[0].r, this.colorBottom[0].g, this.colorBottom[0].b);
	}
	//10H - 12H (morning to noon)
	else if(time < 0.5)
	{
		var t = (time-0.4167) * 12;
		var f = 1 - t;

		this.sky.material.uniforms.topColor.value.setRGB(f*this.colorTop[0].r + t*this.colorTop[1].r, f*this.colorTop[0].g + t*this.colorTop[1].g, f*this.colorTop[0].b + t*this.colorTop[1].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(f*this.colorBottom[0].r + t*this.colorBottom[1].r, f*this.colorBottom[0].g + t*this.colorBottom[1].g, f*this.colorBottom[0].b + t*this.colorBottom[1].b);
	}
	//12H - 17H (noon)
	else if(time < 0.708)
	{
		this.sky.material.uniforms.topColor.value.setRGB(this.colorTop[1].r, this.colorTop[1].g, this.colorTop[1].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(this.colorBottom[1].r, this.colorBottom[1].g, this.colorBottom[1].b);
	}
	//17H -> 18h (noon to afternoon)
	else if(time < 0.75)
	{
		var t = (time-0.708) * 23.81;
		var f = 1 - t;

		this.sky.material.uniforms.topColor.value.setRGB(f*this.colorTop[1].r + t*this.colorTop[2].r, f*this.colorTop[1].g + t*this.colorTop[2].g, f*this.colorTop[1].b + t*this.colorTop[2].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(f*this.colorBottom[1].r + t*this.colorBottom[2].r, f*this.colorBottom[1].g + t*this.colorBottom[2].g, f*this.colorBottom[1].b + t*this.colorBottom[2].b);
	}
	//18H -> 20H (afternoon to night)
	else if(time < 0.8333)
	{
		var t = (time-0.75) * 12.048;
		var f = 1 - t;

		this.sky.material.uniforms.topColor.value.setRGB(f*this.colorTop[2].r + t*this.colorTop[3].r, f*this.colorTop[2].g + t*this.colorTop[3].g, f*this.colorTop[2].b + t*this.colorTop[3].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(f*this.colorBottom[2].r + t*this.colorBottom[3].r, f*this.colorBottom[2].g + t*this.colorBottom[3].g, f*this.colorBottom[2].b + t*this.colorBottom[3].b);
	}
	//20H -> 24H (night)
	else
	{
		this.sky.material.uniforms.topColor.value.setRGB(this.colorTop[3].r, this.colorTop[3].g, this.colorTop[3].b);
		this.sky.material.uniforms.bottomColor.value.setRGB(this.colorBottom[3].r, this.colorBottom[3].g, this.colorBottom[3].b);
	}

	//Sun / moon color
	if(time < 0.20)
	{
		this.sun.intensity = this.intensity;
		this.sun.color.setHex(this.moonColor);
	}
	else if(time < 0.30)
	{
		var t = (time-0.20) * 10;
		var f = 1 - t;

		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * this.intensity;
			this.sun.color.setHex(this.moonColor);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * this.intensity;
			this.sun.color.setHex(this.sunColor);
		}
	}
	else if(time < 0.70)
	{
		this.sun.intensity = this.intensity;
		this.sun.color.setHex(this.sunColor);
	}
	else if(time < 0.80)
	{
		var t = (time - 0.70) * 10;
		
		if(t < 0.5)
		{
			var f = 2 - t*2;
			this.sun.intensity = f * this.intensity;
			this.sun.color.setHex(this.sunColor);
		}
		else
		{
			t = t*2;
			this.sun.intensity = t * this.intensity;
			this.sun.color.setHex(this.moonColor);
		}
	}
	else
	{
		this.sun.intensity = this.intensity;
		this.sun.color.setHex(this.moonColor);
	}

	//Update sun position
	var rotation = (MathUtils.pi2 * time) - MathUtils.pid2;
	if(time > 0.25 && time < 0.75)
	{
		this.sun.position.x = this.sunDistance * Math.cos(rotation);
		this.sun.position.y = this.sunDistance * Math.sin(rotation);
	}
	else
	{
		this.sun.position.x = this.sunDistance * Math.cos(rotation + Math.PI);
		this.sun.position.y = this.sunDistance * Math.sin(rotation + Math.PI);	
	}
};

/**
 * Create JSON for object.
 * 
 * @param {Object} meta
 * @method toJSON
 * @return {Object} json
 */
Sky.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);
	
	data.object.colorTop = [];
	for(var i = 0; i < this.colorTop.length; i++)
	{
		data.object.colorTop.push(this.colorTop[i].toJSON());
	}
	
	data.object.colorBottom = [];
	for(var i = 0; i < this.colorBottom.length; i++)
	{
		data.object.colorBottom.push(this.colorBottom[i].toJSON());
	}

	data.object.sunColor = this.sunColor;
	data.object.moonColor = this.moonColor;
	data.object.intensity = this.intensity;

	data.object.autoUpdate = this.autoUpdate;
	data.object.sunDistance = this.sunDistance;
	data.object.dayTime = this.dayTime;
	data.object.time = this.time;

	data.object.sun = {};
	data.object.sun.castShadow = this.sun.castShadow;
	data.object.sun.shadow = this.sun.shadow.toJSON();

	return data;
};
