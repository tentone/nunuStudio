function FontLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

//Functions prototype
FontLoader.prototype.load = load;
FontLoader.prototype.parse = parse;

//Parse font data
function parse(data)
{
	var font = new THREE.Font(JSON.parse(data.substring(65, data.length - 2)));

	return font;
}

//Load  font
function load(url, onLoad, onProgress, onError)
{
	var loader = new THREE.XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(new THREE.Font(JSON.parse(text.substring(65, text.length - 2))));
	}, onProgress, onError);
}