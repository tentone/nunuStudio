import {Fog} from "three";

/**
 * Fog class is used to store fog attributes attached to a Scene
 * 
 * Original documentation for fog available here https:// threejs.org/docs/index.html#Reference/Scenes/Fog and for exponential fog here https:// threejs.org/docs/index.html#Reference/Scenes/FogExp2
 *
 * @class Fog
 * @module THREE
 */

/**
 * No fog
 * 
 * @attribute NONE
 * @type {number}
 */
Fog.NONE = 0;

/**
 * Linear fog
 * 
 * @attribute LINEAR
 * @type {number}
 */
Fog.LINEAR = 1;

/**
 * Exponential fog
 * 
 * @attribute EXPONENTIAL
 * @type {number}
 */
Fog.EXPONENTIAL = 2;