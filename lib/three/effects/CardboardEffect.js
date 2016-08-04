/**
 * Original Cardboard Distortion Effect. This can be used where WebVR is not enabled on devices.
 * Changes to turn it into a three.js module for bundling.
 * @author mrdoob / http://mrdoob.com/
 * @author danrossi / https://www.electroteque.org
 */



function CardboardEffect( renderer ) {

	this._camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

	this._scene = new THREE.Scene();

	this._stereo = new THREE.StereoCamera();
	this._stereo.aspect = 0.5;

	this.renderer = renderer;

	var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

	this._renderTarget = new THREE.WebGLRenderTarget( 512, 512, _params );
	this._renderTarget.scissorTest = true;

	// Distortion Mesh ported from:
	// https://github.com/borismus/webvr-boilerplate/blob/master/src/distortion/barrel-distortion-fragment.js

	var distortion = new THREE.Vector2( 0.441, 0.156 );

	var geometry = new THREE.PlaneBufferGeometry( 1, 1, 10, 20 ).removeAttribute( 'normal' ).toNonIndexed();

	var positions = geometry.attributes.position.array;
	var uvs = geometry.attributes.uv.array;

	// duplicate

	var positions2 = new Float32Array( positions.length * 2 );
	positions2.set( positions );
	positions2.set( positions, positions.length );

	var uvs2 = new Float32Array( uvs.length * 2 );
	uvs2.set( uvs );
	uvs2.set( uvs, uvs.length );

	var vector = new THREE.Vector2();
	var length = positions.length / 3;

	for ( var i = 0, l = positions2.length / 3; i < l; i ++ ) {

		vector.x = positions2[ i * 3 + 0 ];
		vector.y = positions2[ i * 3 + 1 ];

		var dot = vector.dot( vector );
		var scalar = 1.5 + ( distortion.x + distortion.y * dot ) * dot;

		var offset = i < length ? 0 : 1;

		positions2[ i * 3 + 0 ] = ( vector.x / scalar ) * 1.5 - 0.5 + offset;
		positions2[ i * 3 + 1 ] = ( vector.y / scalar ) * 3.0;

		uvs2[ i * 2 ] = ( uvs2[ i * 2 ] + offset ) * 0.5;

	}

	geometry.attributes.position.array = positions2;
	geometry.attributes.uv.array = uvs2;

	//

	// var material = new THREE.MeshBasicMaterial( { wireframe: true } );
	var material = new THREE.MeshBasicMaterial( { map: this._renderTarget.texture } );
	var mesh = new THREE.Mesh( geometry, material );
	this._scene.add( mesh );

};

CardboardEffect.prototype.setSize = function ( width, height ) {

	this.renderer.setSize( width, height );

	var pixelRatio = this.renderer.getPixelRatio();

	this._renderTarget.setSize( width * pixelRatio, height * pixelRatio );

};

CardboardEffect.prototype.render = function ( scene, camera ) {

	scene.updateMatrixWorld();

	if ( camera.parent === null ) camera.updateMatrixWorld();

	this._stereo.update( camera );

	var width = this._renderTarget.width / 2;
	var height = this._renderTarget.height;

	this._renderTarget.scissor.set( 0, 0, width, height );
	this._renderTarget.viewport.set( 0, 0, width, height );
	this.renderer.render( scene, this._stereo.cameraL, this._renderTarget );

	this._renderTarget.scissor.set( width, 0, width, height );
	this._renderTarget.viewport.set( width, 0, width, height );
	this.renderer.render( scene, this._stereo.cameraR, this._renderTarget );

	this.renderer.render( this._scene, this._camera );

};


CardboardEffect.prototype.constructor = CardboardEffect;

export { CardboardEffect };