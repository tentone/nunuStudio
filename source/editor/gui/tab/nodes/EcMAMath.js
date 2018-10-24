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

LiteGraph.wrapFunctionAsNode("Math/PI", pi, null, "number");
LiteGraph.wrapFunctionAsNode("Math/Round", round, ["number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Pow", pow, ["number", "number"], "number");
LiteGraph.wrapFunctionAsNode("Math/Sqrt", sqrt, ["number"], "number");