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
		this.add(this.runtime);
		this.runtime.initialize();
	}
}

ParticleEmitterHelper.prototype = Object.create(THREE.Object3D.prototype);

ParticleEmitterHelper.prototype.update = function()
{
	if(this.runtime !== null)
	{
		this.particle.getWorldPosition(this.runtime.position);
		this.particle.getWorldQuaternion(this.runtime.quaternion);
		this.particle.getWorldScale(this.runtime.scale);
		
		this.runtime.update();
	}
}