"use strict";

function GeometryForm(){}

GeometryForm.create = function(form, obj)
{
	var geometry = obj.geometry;
	
	if(geometry instanceof THREE.BoxGeometry || geometry instanceof THREE.BoxBufferGeometry)
	{
		return new BoxGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.SphereGeometry || geometry instanceof THREE.SphereBufferGeometry)
	{
		return new SphereGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.TorusGeometry || geometry instanceof THREE.TorusBufferGeometry)
	{
		return new TorusGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.PlaneGeometry || geometry instanceof THREE.PlaneBufferGeometry)
	{
		return new PlaneGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.ConeGeometry || geometry instanceof THREE.ConeBufferGeometry)
	{
		return new ConeGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.CylinderGeometry || geometry instanceof THREE.CylinderBufferGeometry)
	{
		return new CylinderGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.TetrahedronGeometry || geometry instanceof THREE.TetrahedronBufferGeometry)
	{
		return new TetrahedronGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.DodecahedronGeometry || geometry instanceof THREE.DodecahedronBufferGeometry)
	{
		return new DodecahedronGeometryForm(form, obj);
	}
	else if(geometry instanceof THREE.CircleGeometry || geometry instanceof THREE.CircleBufferGeometry)
	{
		return new CircleGeometryForm(form, obj);
	}

	return null;
};