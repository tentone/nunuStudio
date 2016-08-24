"use strict";

function ParticleEmitterHelper(particle)
{
	THREE.Object3D.call(this);

	this.particle = particle;
	this.runtime = null;

	if(particle instanceof ParticleEmitter)
	{
		this.runtime = new ObjectLoader().parse(particle.toJSON());
		this.add(this.runtime);
		this.runtime.initialize();
	}
}

//Super prototypes
ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);

//Update attached particle
ParticleEmitterHelper.prototype.update = function()
{
	if(this.runtime !== null)
	{
		this.particle.getWorldPosition(this.runtime.position);
		this.particle.getWorldScale(this.runtime.scale);
		this.particle.getWorldRotation(this.runtime.rotation);
		this.runtime.update();
	}
}