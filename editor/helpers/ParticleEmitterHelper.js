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

//Functions prototypes
ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);
ParticleEmitterHelper.prototype.update = update;

//Update attached particle
function update()
{
	if(this.runtime !== null)
	{
		this.particle.getWorldPosition(this.runtime.position);
		this.particle.getWorldScale(this.runtime.scale);
		this.runtime.rotation.copy(this.particle.rotation);
		this.runtime.update();
	}
}