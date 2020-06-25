import {TerrainBufferGeometry} from "../../../../../../core/geometries/TerrainBufferGeometry.js";
import {RoundedBoxBufferGeometry} from "../../../../../../core/geometries/RoundedBoxBufferGeometry.js";
import {CapsuleBufferGeometry} from "../../../../../../core/geometries/CapsuleBufferGeometry.js";
import {TorusKnotGeometryForm} from "../TorusKnotGeometryForm.js";
import {TorusGeometryForm} from "../TorusGeometryForm.js";
import {TetrahedronGeometryForm} from "../TetrahedronGeometryForm.js";
import {TerrainGeometryForm} from "../TerrainGeometryForm.js";
import {SphereGeometryForm} from "../SphereGeometryForm.js";
import {RoundedBoxGeometryForm} from "../RoundedBoxGeometryForm.js";
import {RingGeometryForm} from "../RingGeometryForm.js";
import {PlaneGeometryForm} from "../PlaneGeometryForm.js";
import {OctahedronGeometryForm} from "../OctahedronGeometryForm.js";
import {IcosahedronGeometryForm} from "../IcosahedronGeometryForm.js";
import {DodecahedronGeometryForm} from "../DodecahedronGeometryForm.js";
import {CylinderGeometryForm} from "../CylinderGeometryForm.js";
import {ConeGeometryForm} from "../ConeGeometryForm.js";
import {CircleGeometryForm} from "../CircleGeometryForm.js";
import {CapsuleGeometryForm} from "../CapsuleGeometryForm.js";
import {BoxGeometryForm} from "../BoxGeometryForm.js";
import {Form} from "../../../../../components/Form.js";
import {BoxGeometry, BoxBufferGeometry, SphereGeometry, SphereBufferGeometry, TorusGeometry, TorusBufferGeometry, PlaneGeometry, PlaneBufferGeometry, ConeGeometry, ConeBufferGeometry, CylinderGeometry, CylinderBufferGeometry, TetrahedronGeometry, TetrahedronBufferGeometry, DodecahedronGeometry, DodecahedronBufferGeometry, CircleGeometry, CircleBufferGeometry, TorusKnotGeometry, TorusKnotBufferGeometry, RingGeometry, RingBufferGeometry, IcosahedronGeometry, IcosahedronBufferGeometry, OctahedronGeometry, OctahedronBufferGeometry} from "three";

function GeometryForm(){}

GeometryForm.create = function(form, object)
{
	var geometry = object.geometry;
	
	if(geometry instanceof BoxGeometry || geometry instanceof BoxBufferGeometry)
	{
		return new BoxGeometryForm(form, object);
	}
	else if(geometry instanceof SphereGeometry || geometry instanceof SphereBufferGeometry)
	{
		return new SphereGeometryForm(form, object);
	}
	else if(geometry instanceof TorusGeometry || geometry instanceof TorusBufferGeometry)
	{
		return new TorusGeometryForm(form, object);
	}
	else if(geometry instanceof PlaneGeometry || geometry instanceof PlaneBufferGeometry)
	{
		return new PlaneGeometryForm(form, object);
	}
	else if(geometry instanceof ConeGeometry || geometry instanceof ConeBufferGeometry)
	{
		return new ConeGeometryForm(form, object);
	}
	else if(geometry instanceof CylinderGeometry || geometry instanceof CylinderBufferGeometry)
	{
		return new CylinderGeometryForm(form, object);
	}
	else if(geometry instanceof TetrahedronGeometry || geometry instanceof TetrahedronBufferGeometry)
	{
		return new TetrahedronGeometryForm(form, object);
	}
	else if(geometry instanceof DodecahedronGeometry || geometry instanceof DodecahedronBufferGeometry)
	{
		return new DodecahedronGeometryForm(form, object);
	}
	else if(geometry instanceof CircleGeometry || geometry instanceof CircleBufferGeometry)
	{
		return new CircleGeometryForm(form, object);
	}
	else if(geometry instanceof TorusKnotGeometry || geometry instanceof TorusKnotBufferGeometry)
	{
		return new TorusKnotGeometryForm(form, object);
	}
	else if(geometry instanceof RingGeometry || geometry instanceof RingBufferGeometry)
	{
		return new RingGeometryForm(form, object);
	}
	else if(geometry instanceof IcosahedronGeometry || geometry instanceof IcosahedronBufferGeometry)
	{
		return new IcosahedronGeometryForm(form, object);
	}
	else if(geometry instanceof OctahedronGeometry || geometry instanceof OctahedronBufferGeometry)
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
	else if(geometry instanceof TerrainBufferGeometry)
	{
		return new TerrainGeometryForm(form, object);
	}

	return null;
};
export {GeometryForm};