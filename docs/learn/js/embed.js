if(hljs !== undefined)
{
	hljs.initHighlightingOnLoad();
}

var nunuApps = [];

function initialize(fname, canvasId)
{	
	var canvas = document.getElementById(canvasId || "canvas");
	var app = new NunuApp(canvas);
	app.loadRunProgram(fname);

	nunuApps.push({canvas:canvas, app:app});
	
	resize();
	document.body.onresize = resize;
}

function resize()
{
	for(var i = 0; i < nunuApps.length; i++)
	{
		nunuApps[i].canvas.width = nunuApps[i].canvas.parentElement.offsetWidth * 0.8;
		nunuApps[i].canvas.height = nunuApps[i].canvas.parentElement.offsetWidth * 0.4;
		nunuApps[i].app.resize();
	}
}