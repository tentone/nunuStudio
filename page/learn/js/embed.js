if(hljs !== undefined)
{
	hljs.initHighlightingOnLoad();
}

var nunuApps = [];

function initialize(fname, canvasId)
{	
	var canvas = document.getElementById(canvasId || "canvas");
	var app = new Nunu.App(canvas);

	var onLoad = function()
	{
		//Fullscreen Button
		var fs = createButton("Fullscreen");
		fs.onclick = function()
		{
			app.toggleFullscreen();
		};
		canvas.parentElement.appendChild(fs);

		//VR Button
		setTimeout(function()
		{
			if(app.vrAvailable())
			{
				var vr = createButton("Enter VR");
				vr.onclick = function()
				{
					app.toggleVR();
				};
				canvas.parentElement.appendChild(vr);
			}
		}, 1000)
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
		if(Nunu.isFullscreen())
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

function createButton(text)
{
	var button = document.createElement("div");
	button.style.backgroundColor = "#333333";
	button.style.color = "#FFFFFF";
	button.style.height = "30px";
	button.style.lineHeight = "30px";
	button.style.borderRadius = "5px";
	button.style.marginTop = "2px";
	button.style.marginLeft = "40%";
	button.style.width = "20%";
	button.style.verticalAlign = "middle";
	button.style.textAlign = "center";
	button.style.cursor = "pointer";

	var span = document.createElement("span");
	button.appendChild(span);

	var b = document.createElement("b");
	b.innerHTML = text;
	span.appendChild(b);

	button.onmouseenter = function()
	{
		this.style.backgroundColor = "#666666";
	};
	button.onmouseleave = function()
	{
		this.style.backgroundColor = "#333333";
	};
	
	return button;
}
