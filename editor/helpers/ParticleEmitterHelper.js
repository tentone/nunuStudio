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
		this.runtime.position.copy(this.particle.position);
		this.runtime.scale.copy(this.particle.scale);
		this.runtime.rotation.copy(this.particle.rotation);
		this.runtime.update();
	}
}