"use strict";

function SkeletonHelper(obj) 
{
	THREE.SkeletonHelper.call(this, obj);
}

SkeletonHelper.prototype = Object.create(THREE.SkeletonHelper.prototype);

SkeletonHelper.prototype.update = function(){};