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
		this.particle.getWorldPosition(this.runtime.position);
		this.particle.getWorldRotation(this.runtime.rotation);
		this.particle.getWorldScale(this.runtime.scale);
		this.runtime.updateMatrix();
		
		this.runtime.update();
	}
}