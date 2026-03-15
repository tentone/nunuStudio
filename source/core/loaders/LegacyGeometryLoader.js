import {BufferGeometry, DefaultLoadingManager, FileLoader} from "three";

/**
 * Legacy geometry loader is used to load the old three.js geometry file format (v3/v4).
 *
 * NOTE: The old Geometry/Face3 API was removed in three.js r137.
 * This loader now returns empty geometries and logs a warning.
 * Projects relying on old geometry JSON format should be re-exported.
 *
 * @class LegacyGeometryLoader
 * @module Loaders
 */
class LegacyGeometryLoader
{
constructor(manager)
{
this.manager = manager !== undefined ? manager : DefaultLoadingManager;
this.withCredentials = false;
}

load(url, onLoad, onProgress, onError)
{
var self = this;

var loader = new FileLoader(this.manager);
loader.setWithCredentials(this.withCredentials);
loader.load(url, function(text)
{
var json = JSON.parse(text);
var object = self.parse(json);
onLoad(object.geometry, object.materials);
}, onProgress, onError);
}

setPath(value)
{
this.path = value;
return this;
}

setResourcePath(value)
{
this.resourcePath = value;
return this;
}

setCrossOrigin(value)
{
this.crossOrigin = value;
return this;
}

parse(json)
{
console.warn("nunuStudio: LegacyGeometryLoader - The old three.js JSON geometry format (Geometry/Face3) is no longer supported in three.js r137+. Returning empty BufferGeometry. Please re-export your assets.");
return {geometry: new BufferGeometry(), materials: []};
}
}

export {LegacyGeometryLoader};
