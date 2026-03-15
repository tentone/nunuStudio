import {BoxGeometry, SphereGeometry, TorusGeometry, PlaneGeometry, ConeGeometry, CylinderGeometry, TetrahedronGeometry, DodecahedronGeometry, CircleGeometry, TorusKnotGeometry, RingGeometry, IcosahedronGeometry, OctahedronGeometry} from "three";
import {TerrainBufferGeometry} from "../../../../../core/geometries/TerrainBufferGeometry.js";
import {RoundedBoxGeometry} from "../../../../../core/geometries/RoundedBoxGeometry.js";
import {CapsuleBufferGeometry} from "../../../../../core/geometries/CapsuleBufferGeometry.js";
import {ParametricBufferGeometry} from "../../../../../core/geometries/ParametricBufferGeometry.js";
import {TorusKnotGeometryForm} from "./TorusKnotGeometryForm.js";
import {TorusGeometryForm} from "./TorusGeometryForm.js";
import {TetrahedronGeometryForm} from "./TetrahedronGeometryForm.js";
import {TerrainGeometryForm} from "./TerrainGeometryForm.js";
import {SphereGeometryForm} from "./SphereGeometryForm.js";
import {RoundedBoxGeometryForm} from "./RoundedBoxGeometryForm.js";
import {RingGeometryForm} from "./RingGeometryForm.js";
import {PlaneGeometryForm} from "./PlaneGeometryForm.js";
import {OctahedronGeometryForm} from "./OctahedronGeometryForm.js";
import {IcosahedronGeometryForm} from "./IcosahedronGeometryForm.js";
import {DodecahedronGeometryForm} from "./DodecahedronGeometryForm.js";
import {CylinderGeometryForm} from "./CylinderGeometryForm.js";
import {ConeGeometryForm} from "./ConeGeometryForm.js";
import {CircleGeometryForm} from "./CircleGeometryForm.js";
import {CapsuleGeometryForm} from "./CapsuleGeometryForm.js";
import {BoxGeometryForm} from "./BoxGeometryForm.js";
import {ParametricGeometryForm} from "./ParametricGeometryForm.js";

function GeometryForm() {}

GeometryForm.create = function(form, object)
{
	var geometry = object.geometry;
	
	if (geometry instanceof BoxGeometry || geometry instanceof BoxGeometry)
	{
		return new BoxGeometryForm(form, object);
	}
	else if (geometry instanceof SphereGeometry || geometry instanceof SphereGeometry)
	{
		return new SphereGeometryForm(form, object);
	}
	else if (geometry instanceof TorusGeometry || geometry instanceof TorusGeometry)
	{
		return new TorusGeometryForm(form, object);
	}
	else if (geometry instanceof PlaneGeometry || geometry instanceof PlaneGeometry)
	{
		return new PlaneGeometryForm(form, object);
	}
	else if (geometry instanceof ConeGeometry || geometry instanceof ConeGeometry)
	{
		return new ConeGeometryForm(form, object);
	}
	else if (geometry instanceof CylinderGeometry || geometry instanceof CylinderGeometry)
	{
		return new CylinderGeometryForm(form, object);
	}
	else if (geometry instanceof TetrahedronGeometry || geometry instanceof TetrahedronGeometry)
	{
		return new TetrahedronGeometryForm(form, object);
	}
	else if (geometry instanceof DodecahedronGeometry || geometry instanceof DodecahedronGeometry)
	{
		return new DodecahedronGeometryForm(form, object);
	}
	else if (geometry instanceof CircleGeometry || geometry instanceof CircleGeometry)
	{
		return new CircleGeometryForm(form, object);
	}
	else if (geometry instanceof TorusKnotGeometry || geometry instanceof TorusKnotGeometry)
	{
		return new TorusKnotGeometryForm(form, object);
	}
	else if (geometry instanceof RingGeometry || geometry instanceof RingGeometry)
	{
		return new RingGeometryForm(form, object);
	}
	else if (geometry instanceof IcosahedronGeometry || geometry instanceof IcosahedronGeometry)
	{
		return new IcosahedronGeometryForm(form, object);
	}
	else if (geometry instanceof OctahedronGeometry || geometry instanceof OctahedronGeometry)
	{
		return new OctahedronGeometryForm(form, object);
	}
	else if (geometry instanceof CapsuleBufferGeometry)
	{
		return new CapsuleGeometryForm(form, object);
	}
	else if (geometry instanceof RoundedBoxGeometry)
	{
		return new RoundedBoxGeometryForm(form, object);
	}
	else if (geometry instanceof TerrainBufferGeometry)
	{
		return new TerrainGeometryForm(form, object);
	}
	else if (geometry instanceof ParametricBufferGeometry)
	{
		return new ParametricGeometryForm(form, object);
	}

	return null;
};
export {GeometryForm};
