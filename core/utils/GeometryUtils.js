"use strict";

function GeometryUtils(){}

/*THREE.BufferGeometry.prototype.computeFaceNormals = function()
{
		var pos = this.attributes.position.array;
		var attrName = 'normal';

		if ( this.attributes[ attrName ] === undefined )
		{
			this.addAttribute( attrName, new THREE.BufferAttribute( new Float32Array( pos.length ), 3 ) );

		}
		var n = this.attributes[ attrName ].array;
		var i, v, il;
		var cb = new THREE.Vector3();
		var ab = new THREE.Vector3();
		for ( i = 0, il = pos.length; i < il; i += 9 ) {

			var iA = i;
			var iB = i + 3;
			var iC = i + 6;

			cb.set( pos[ iC ] - pos[ iB ],
			pos[ iC + 1 ] - pos[ iB + 1 ],
			pos[ iC + 2 ] - pos[ iB + 2 ] );
			ab.set( pos[ iA ] - pos[ iB ],
			pos[ iA + 1 ] - pos[ iB + 1 ],
			pos[ iA + 2 ] - pos[ iB + 2 ] );
			cb.cross( ab );
			cb.normalize();

			var face = [ iA, iB, iC ];
			// For each vertex on the face
			for ( v = 0; v < 3; v ++ ) {

				var faceAbc = face[ v ];
				n[ faceAbc ] = cb.x;
				n[ faceAbc + 1 ] = cb.y;
				n[ faceAbc + 2 ] = cb.z;

			}

		}

	};
/**
 * Merge a list of buffer geometries into a new one.
 * The old ones will be disposed, so they can be garbage collected.
 * @param  {Array.<THREE.Object3D>} geometries  A list of geometries containing geometry to merge
 * @return {THREE.BufferGeometry}       	The merged result.
 */
THREE.BufferGeometry.merge = function( geometries ) {

	var i, m, geom2;
	var geometry = new THREE.BufferGeometry();
	var geom1 = geometries[ 0 ];

	// Split all indexed geometry so we don't need it anymore
	for ( m = 0; m < geometries.length; m ++ ) {

		geom2 = geometries[ m ];
		if ( geom2.index ) {

			geom2 = THREE.BufferGeometry.splitVertices( geom2 );
			geometries[ m ] = geom2;

		}
		if ( ! geom2.attributes.normal ) {

			// geometries[ m ].geometry = computeNormals( geom2 );

		}

	}

	// for each attribute
	for ( var key in geom1.attributes ) {

		if ( geom1.attributes[ key ].array.constructor !== Float32Array ) continue;

		var data = [];
		// for each geometry
		for ( m = 0; m < geometries.length; m ++ ) {

			geom2 = geometries[ m ];
			if ( ! geom2.attributes[ key ] ) {

				throw new FluxGeometryError( 'Mismatched geometry attributes: ' + key );

			}

			var attributeArray2 = geom2.attributes[ key ].array;
			for ( i = 0; i < attributeArray2.length; i ++ ) {

				data.push( attributeArray2[ i ] );

			}

		} // end for each geom
		geometry.addAttribute( key, new THREE.BufferAttribute( new Float32Array( data ), geom1.attributes[ key ].itemSize ) );

	} // end for each attr

	for ( m = 0; m < geometries.length; m ++ ) {

		geometries[ m ].dispose();

	}

	return geometry;

};


/**
 * Split the faces of an indexed buffer geometry
 * This creates attribute arrays that are populated per face vertex allowing
 * it to have sharp changes in attributes and not need an index array.
 * @param  {THREE.BufferGeometry} geom The indexed geometry to split
 * @return {THREE.BufferGeometry}      A modified clone or the original geometry
 */
THREE.BufferGeometry.splitVertices = function( geom ) {

	var geometry = new THREE.BufferGeometry();
	if ( ! geom.index ) return geom;
	var i, j, il, idx;
	var index = geom.index.array;
	
	// for each attribute
	for ( var key in geom.attributes ) {

		if ( geom.attributes[ key ].array.constructor !== Float32Array ) continue;
		var attr = geom.attributes[ key ].array;
		var size = geom.attributes[ key ].itemSize
		var values = new Float32Array( index.length * size );

		for ( j = 0, i = 0, il = index.length; i < il; i ++ ) {

			idx = index[ i ] * size;
			for ( var k = 0; k < size; k ++ ) {

				values[ i * size + k ] = attr[ idx + k ];

			}

		}
		geometry.addAttribute( key, new THREE.BufferAttribute( values, size ) );

	}
	geom.dispose();
	return geometry;

};
