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

		this.runtime.matrix = particle.matrixWorld;
		this.runtime.matrixAutoUpdate = false;
	}
}

ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);

ParticleEmitterHelper.prototype.update = function()
{
	if(this.runtime !== null)
	{
		this.runtime.matrix = this.particle.matrixWorld;
		this.runtime.update();
	}
}