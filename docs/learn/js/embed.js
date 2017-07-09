if(hljs !== undefined)
{
	hljs.initHighlightingOnLoad();
}

var nunuApps = [];

function initialize(fname, canvasId)
{	
	var canvas = document.getElementById(canvasId || "canvas");
	var app = new NunuApp(canvas);

	var onLoad = function()
	{
		//Fullscreen Button
		var fs = document.createElement("div");
		fs.style.backgroundColor = "#333333";
		fs.style.color = "#FFFFFF";
		fs.style.width = "20%";
		fs.style.height = "30px";
		fs.style.borderRadius = "5px";
		fs.style.marginLeft = "40%";
		fs.style.textAlign = "center";
		fs.style.cursor = "pointer";
		fs.innerHTML = "<b>Fullscreen</b>";
		fs.onclick = function()
		{
			app.toggleFullscreen();
		};
		canvas.parentElement.appendChild(fs);

		//VR Button
		if(app.vrAvailable())
		{
			Nunu.getVRDisplays(function(display)
			{
				var vr = document.createElement("div");
				vr.style.backgroundColor = "#333333";
				vr.style.color = "#FFFFFF";
				vr.style.width = "20%";
				vr.style.height = "30px";
				vr.style.borderRadius = "5px";
				vr.style.marginLeft = "40%";
				vr.style.textAlign = "center";
				vr.style.cursor = "pointer";
				vr.innerHTML = "<b>Enter VR</b>";
				vr.onclick = function()
				{
					app.toggleVR();
				};
				canvas.parentElement.appendChild(vr);
			});
		}
	};

	app.loadRunProgram(fname, onLoad);
	nunuApps.push({canvas:canvas, app:app});
	
	resize();
	document.body.onresize = resize;
}

function resize()
{
	for(var i = 0; i < nunuApps.length; i++)
	{
		if(nunuApps[i].app.isFullscreen())
		{
			nunuApps[i].canvas.width = window.innerWidth;
			nunuApps[i].canvas.height = window.innerHeight;
		}
		else
		{
			nunuApps[i].canvas.width = nunuApps[i].canvas.parentElement.offsetWidth * 0.8;
			nunuApps[i].canvas.height = nunuApps[i].canvas.parentElement.offsetWidth * 0.4;
		}
		nunuApps[i].app.resize();
	}
}