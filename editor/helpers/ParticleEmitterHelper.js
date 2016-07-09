"use strict";

function ParticleEmitterHelper()
{
	THREE.Object3D.call(this);

	//TODO <ADD CODE HERE>

	this.particle = null;
	this.particle_runtime = null;
}

//Functions prototypes
ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);
ParticleEmitterHelper.prototype.update = update;

//Update attached particle
function update()
{
	if(this.particle_runtime !== null)
	{
		this.particle_runtime.update();
	}
}