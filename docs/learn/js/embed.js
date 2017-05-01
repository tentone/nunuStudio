if(hljs !== undefined)
{
	hljs.initHighlightingOnLoad();
}

var apps = [];

function initialize(fname, canvasId)
{	
	var canvas = document.getElementById(canvasId || "canvas");
	var app = new NunuApp(canvas);
	app.loadRunProgram(fname);

	apps.push({canvas:canvas, app:app});
	
	resize();
	document.body.onresize = resize;
}

function resize()
{
	for(var i = 0; i < apps.length; i++)
	{
		apps[i].canvas.width = apps[i].canvas.parentElement.offsetWidth * 0.8;
		apps[i].canvas.height = apps[i].canvas.parentElement.offsetWidth * 0.4;
		apps[i].app.resize();
	}
}