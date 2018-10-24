function pi() {
	return Math.PI;
}

LiteGraph.wrapFunctionAsNode("Math/PI", pi, null, "number");