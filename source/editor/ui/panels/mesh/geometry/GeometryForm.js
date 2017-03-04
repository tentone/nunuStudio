"use strict";

function GeometryForm(){}

GeometryForm.create = function(form, obj)
{
	if(obj.geometry instanceof THREE.BoxGeometry || obj.geometry instanceof THREE.BoxBufferGeometry)
	{
		return new BoxGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.SphereGeometry || obj.geometry instanceof THREE.SphereBufferGeometry)
	{
		return new SphereGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.TorusGeometry || obj.geometry instanceof THREE.TorusBufferGeometry)
	{
		return new TorusGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.PlaneGeometry || obj.geometry instanceof THREE.PlaneBufferGeometry)
	{
		return new PlaneGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.ConeGeometry || obj.geometry instanceof THREE.ConeBufferGeometry)
	{
		return new ConeGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.CylinderGeometry || obj.geometry instanceof THREE.CylinderBufferGeometry)
	{
		return new CylinderGeometryForm(form, obj);
	}
	else if(obj.geometry instanceof THREE.TetrahedronGeometry || obj.geometry instanceof THREE.TetrahedronBufferGeometry)
	{
		return new TetrahedronGeometryForm(form, obj);
	}
	
	return null;
};