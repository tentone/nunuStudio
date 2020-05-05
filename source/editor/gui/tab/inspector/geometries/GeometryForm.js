"use strict";

function GeometryForm(){}

GeometryForm.create = function(form, object)
{
	var geometry = object.geometry;
	
	if(geometry instanceof THREE.BoxGeometry || geometry instanceof THREE.BoxBufferGeometry)
	{
		return new BoxGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.SphereGeometry || geometry instanceof THREE.SphereBufferGeometry)
	{
		return new SphereGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.TorusGeometry || geometry instanceof THREE.TorusBufferGeometry)
	{
		return new TorusGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.PlaneGeometry || geometry instanceof THREE.PlaneBufferGeometry)
	{
		return new PlaneGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.ConeGeometry || geometry instanceof THREE.ConeBufferGeometry)
	{
		return new ConeGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.CylinderGeometry || geometry instanceof THREE.CylinderBufferGeometry)
	{
		return new CylinderGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.TetrahedronGeometry || geometry instanceof THREE.TetrahedronBufferGeometry)
	{
		return new TetrahedronGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.DodecahedronGeometry || geometry instanceof THREE.DodecahedronBufferGeometry)
	{
		return new DodecahedronGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.CircleGeometry || geometry instanceof THREE.CircleBufferGeometry)
	{
		return new CircleGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.TorusKnotGeometry || geometry instanceof THREE.TorusKnotBufferGeometry)
	{
		return new TorusKnotGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.RingGeometry || geometry instanceof THREE.RingBufferGeometry)
	{
		return new RingGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.IcosahedronGeometry || geometry instanceof THREE.IcosahedronBufferGeometry)
	{
		return new IcosahedronGeometryForm(form, object);
	}
	else if(geometry instanceof THREE.OctahedronGeometry || geometry instanceof THREE.OctahedronBufferGeometry)
	{
		return new OctahedronGeometryForm(form, object);
	}
	else if(geometry instanceof CapsuleBufferGeometry)
	{
		return new CapsuleGeometryForm(form, object);
	}
	else if(geometry instanceof RoundedBoxBufferGeometry)
	{
		return new RoundedBoxGeometryForm(form, object);
	}

	return null;
};