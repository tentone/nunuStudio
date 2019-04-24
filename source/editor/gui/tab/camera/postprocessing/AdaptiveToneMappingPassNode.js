"use strict";

function AdaptiveToneMappingPassNode(parent)
{
	PassNode.call(this, parent, "Adaptive Tone Mapping");
}

AdaptiveToneMappingPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("AdaptiveToneMapping", AdaptiveToneMappingPassNode);
