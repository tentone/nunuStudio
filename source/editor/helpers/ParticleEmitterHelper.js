"use strict";

function ParticleEmitterHelper(particle)
{
	THREE.Object3D.call(this);

	this.particle = particle;
	this.runtime = null;

	if(particle instanceof ParticleEmitter)
	{
		var json = particle.toJSON();
		json.object.children = [];

		this.runtime = new ObjectLoader().parse(json);
		this.runtime.initialize();
		this.add(this.runtime);
	}
}

ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);

ParticleEmitterHelper.prototype.update = function()
{
	if(this.runtime !== null)
	{
		this.runtime.position.copy(this.particle.position);
		this.runtime.rotation.copy(this.particle.rotation);
		this.runtime.scale.copy(this.particle.scale);
		this.runtime.updateMatrix();
		this.runtime.update();
	}
}