/**
 * A map of supported distribution types used by ParticleEmitterControl instances.
 *
 * These distribution types can be applied to an emitter globally, which will affect the position, velocity, and acceleration value calculations for an emitter, or they can be applied on a per-property basis.
 *
 * @class ParticleDistributions
 */
var ParticleDistributions = {
	/**
	 * Values will be distributed within a box.
	 *
	 * @attribute BOX
	 * @type {number}
	 */
	BOX: 1,

	/**
	 * Values will be distributed on a sphere.
	 *
	 * @attribute SPHERE
	 * @type {number}
	 */
	SPHERE: 2,

	/**
	 * Values will be distributed on a 2d-disc shape.
	 *
	 * @attribute DISC
	 * @type {number}
	 */
	DISC: 3,
};

export {ParticleDistributions};