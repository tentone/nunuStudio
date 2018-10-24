function pi() {
	return Math.PI;
}

function round(toRound) {
	return Math.round(toRound);
}

function pow(x, y) {
	return Math.pow(x,y);
}

function sqrt(x) {
	return Math.sqrt(x);
}

function abs(x) {
	return Math.abs(x);
}

function ceil(x) {
	return Math.ceil(x);
}

function floor(x) {
	return Math.floor(x);
}

function sin(x) {
	return Math.sin(x);
}

LiteGraph.wrapFunctionAsNode("Math/PI", pi, null, "number");
LiteGraph.wrapFunctionAsNode("Math/Round", round, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Pow", pow, ["number", "number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Sqrt", sqrt, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Abs", abs, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Ceil", ceil, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Floor", floor, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Sin", sin, ["number"], "number");