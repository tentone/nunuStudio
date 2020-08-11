import {Locale} from "./locale/LocaleManager.js";
import {VideoTexture} from "../core/texture/VideoTexture.js";
import {Texture} from "../core/texture/Texture.js";
import {CompressedTexture} from "../core/texture/CompressedTexture.js";
import {Video} from "../core/resources/Video.js";
import {TextFile} from "../core/resources/TextFile.js";
import {Image} from "../core/resources/Image.js";
import {Font} from "../core/resources/Font.js";
import {Audio} from "../core/resources/Audio.js";
import {SpineAnimation} from "../core/objects/spine/SpineAnimation.js";
import {Group} from"../core/objects/misc/Group.js";
import {Nunu} from "../core/Nunu.js";
import {FileSystem} from "../core/FileSystem.js";
import {AddResourceAction} from "./history/action/resources/AddResourceAction.js";
import {Global} from "./Global.js";
import {Editor} from "./Editor.js";
import {LoadingModal} from "./components/modal/LoadingModal.js";
import {DocumentBody} from "./components/DocumentBody.js";
import {InstancedMesh} from "../core/objects/mesh/InstancedMesh.js";
import {LinearFilter, CubeReflectionMapping, WebGLRenderer, Object3D, Mesh, SkinnedMesh, AnimationClip,  MeshBasicMaterial, MeshPhongMaterial, ShapeBufferGeometry, JSONLoader, Matrix4} from "three";
import {BasisTextureLoader} from "three/examples/jsm/loaders/BasisTextureLoader";
import {AMFLoader} from "three/examples/jsm/loaders/AMFLoader";
import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
import {PVRLoader} from "three/examples/jsm/loaders/PVRLoader";
import {KTXLoader} from "three/examples/jsm/loaders/KTXLoader";
import {TGALoader} from "three/examples/jsm/loaders/TGALoader";
import {GCodeLoader} from "three/examples/jsm/loaders/GCodeLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {ThreeMFLoader} from "three/examples/jsm/loaders/3MFLoader";
import {AssimpLoader} from "three/examples/jsm/loaders/AssimpLoader";
import {TDSLoader} from "three/examples/jsm/loaders/TDSLoader";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {VTKLoader} from "three/examples/jsm/loaders/VTKLoader";
import {PRWMLoader} from "three/examples/jsm/loaders/PRWMLoader";
import {VRMLLoader} from "three/examples/jsm/loaders/VRMLLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {XLoader} from "three/examples/jsm/loaders/XLoader";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import {VOXLoader} from "three/examples/jsm/loaders/VOXLoader";
import {AWDLoader} from "./loaders/AWDLoader";
import {BabylonLoader} from "./loaders/BabylonLoader";
import "js.blend/build/js.blend.js";

function Loaders() {}

/**
 * Load texture from file object, checks the type of the file, can be used to load all types of textures
 *
 * Supports browser supported format (png, jpeg, bmp, gif, etc), and GPU compressed formats (pvr, dds, ktx, etc).
 *
 * @static
 * @method loadTexture
 * @param {File} file
 * @param {Function} onLoad
 */
Loaders.loadTexture = function(file, onLoad)
{
	// Load compressed texture from data parsed by the texture loaders.
	function loadCompressedTexture(data)
	{
		var texture = new CompressedTexture();
		
		if(data.isCubemap === true)
		{
			var faces = data.mipmaps.length / data.mipmapCount;

			texture.isCubeTexture = true;
			texture.image = [];

			for(var f = 0; f < faces; f++)
			{
				texture.image[f] = {mipmaps: []};

				for(var i = 0; i < data.mipmapCount; i ++)
				{
					texture.image[f].mipmaps.push(data.mipmaps[f * data.mipmapCount + i]);
					texture.image[f].format = data.format;
					texture.image[f].width = data.width;
					texture.image[f].height = data.height;
				}
			}

			texture.magFilter = LinearFilter;
			texture.minFilter = LinearFilter;
			texture.mapping = CubeReflectionMapping;
		}
		else
		{
			texture.image.width = data.width;
			texture.image.height = data.height;
			texture.mipmaps = data.mipmaps;
		}

		if(data.mipmapCount === 1)
		{
			texture.minFilter = LinearFilter;
		}

		texture.format = data.format;
		texture.needsUpdate = true;

		return texture;
	}

	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);

	var reader = new FileReader();
	reader.onload = function()
	{
		if(extension === "dds")
		{
			var loader = new DDSLoader();
			var texture = loadCompressedTexture(loader.parse(reader.result));
			texture.name = name;
			Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
		}
		else if(extension === "pvr")
		{
			var loader = new PVRLoader();
			var texture = loadCompressedTexture(loader.parse(reader.result));
			texture.name = name;
			Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
		}
		else if(extension === "ktx")
		{
			var loader = new KTXLoader();
			var texture = loadCompressedTexture(loader.parse(reader.result));
			texture.name = name;
			Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
		}
		else if(extension === "tga")
		{
			var loader = new TGALoader();
			var jpeg = loader.parse(reader.result).toDataURL("image/jpeg", 1.0);

			var image = new Image(jpeg, "jpeg");
			Editor.addAction(new AddResourceAction(image, Editor.program, "images"));
			
			var texture = new Texture(image);
			texture.name = name;
			Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
		}
		else if(extension === "basis")
		{
			var renderer = new WebGLRenderer({alpha: true});

			var loader = new BasisTextureLoader();
			loader.setTranscoderPath(Global.FILE_PATH + "wasm/basis/");
			loader.detectSupport(renderer);
			loader._createTexture(reader.result).then(function(texture)
			{
				texture.encoding = THREE.sRGBEncoding;
				texture.name = name;
				Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
			}).catch(function(error)
			{
				Editor.alert("Error decoding basis texture.");
				console.error("nunuStudio: Error decoding basis texture.", error);
			});

			renderer.dispose();
		}
		else
		{
			var image = new Image(reader.result, extension);
			var texture = new Texture(image);
			texture.name = name;
			Editor.addAction(new AddResourceAction(image, Editor.program, "images"));
			Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
		}

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};
	reader.readAsArrayBuffer(file);
};

/**
 * Load video file as texture from file object.
 *
 * @static
 * @method loadVideoTexture
 * @param {File} file
 * @param {Function} onLoad Callback function called after the resource is loaded.
 */
Loaders.loadVideoTexture = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);

	var reader = new FileReader();
	reader.onload = function()
	{
		var video = new Video(reader.result, extension)
		video.name = name;

		var texture = new VideoTexture(video);
		texture.name = name;

		Editor.addAction(new AddResourceAction(video, Editor.program, "videos"));
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	};

	reader.readAsArrayBuffer(file);
};

// Load audio from file object
Loaders.loadAudio = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var reader = new FileReader();

	reader.onload = function()
	{
		var audio = new Audio(reader.result);
		audio.name = name;
		
		if(onLoad !== undefined)
		{
			onLoad(audio);
		}

		Editor.addAction(new AddResourceAction(audio, Editor.program, "audio"));
	};

	reader.readAsArrayBuffer(file);
};

// Load font from file object
Loaders.loadFont = function(file, onLoad)
{
	var name = FileSystem.getFileName(file.name);
	var extension = FileSystem.getFileExtension(file.name);
	var reader = new FileReader();
	
	reader.onload = function()
	{
		if(extension === "json")
		{
			var font = new Font(JSON.parse(reader.result));
		}
		else
		{
			var font = new Font(reader.result);
			font.encoding = extension;
		}
		font.name = name;

		if(onLoad !== undefined)
		{
			onLoad(font);
		}

		Editor.addAction(new AddResourceAction(font, Editor.program, "fonts"));
	};

	if(extension === "json")
	{
		reader.readAsText(file);
	}
	else
	{
		reader.readAsArrayBuffer(file);
	}
};

/**
 * Load spine animation file from file.
 *
 * Also searches for the .atlas file on the file path.
 *
 * @static
 * @method loadSpineAnimation
 * @param {File} file File to load.
 */
Loaders.loadSpineAnimation = function(file)
{
	try
	{
		var path = FileSystem.getFilePath(file.path);

		var atlasFile = null;
		var files = FileSystem.getFilesDirectory(path);
		for(var i = 0; i < files.length; i++)
		{
			if(files[i].endsWith("atlas"))
			{
				atlasFile = path + files[i];
				break;
			}
		}

		if(atlasFile === null)
		{
			Editor.alert(Locale.failedLoadSpine);
			console.warn("nunuStudio: No atlas file found in the directory.");
			return;
		}

		var data = FileSystem.readFile(file.path);
		var atlas = FileSystem.readFile(atlasFile);

		var animation = new SpineAnimation(data, atlas, path);
		animation.name = FileSystem.getFileName(file.path);
		Editor.addObject(animation);
	}
	catch(e)
	{
		Editor.alert(Locale.failedLoadSpine + "(" + e + ")");
	}
};

/**
 * Load text from file and add it as a resource to the program.
 *
 * @static
 * @method loadText
 * @param {File} file File to load.
 */
Loaders.loadText = function(file)
{
	var reader = new FileReader();
	var name = FileSystem.getFileNameWithExtension(file.name);

	reader.onload = function()
	{
		var resource = new TextFile(reader.result, FileSystem.getFileExtension(name));
		resource.name = name;

		Editor.addAction(new AddResourceAction(resource, Editor.program, "resources"));
	};

	reader.readAsText(file);
};

/**
 * Load a 3D file containing objects to be added to the scene.
 *
 * If no parent is specified it adds the objects to currently open scene.
 * 
 * @method loadModel
 * @param {File} file File to be read and parsed.
 * @param {Object3D} parent Object to add the objects.
 */
Loaders.loadModel = function(file, parent)
{
	var name = file.name;
	var extension = FileSystem.getFileExtension(name);
	var path = (file.path !== undefined) ? FileSystem.getFilePath(file.path) : "";
	var modal = new LoadingModal(DocumentBody);
	modal.show();

	try
	{
		// GCode
		if(extension === "gcode")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				var loader = new GCodeLoader();
				var obj = loader.parse(reader.result);
				Editor.addObject(obj, parent);
				modal.destroy();
			};

			reader.readAsText(file);
		}
		// Wavefront OBJ
		else if(extension === "obj")
		{
			var materials = null;
			
			// Look for MTL file
			if(Nunu.runningOnDesktop())
			{
				try
				{
					var mtl = FileSystem.getNameWithoutExtension(file.path) + ".mtl";

					if(FileSystem.fileExists(mtl))
					{
						console.log("nunuStudio: MTL file found.", path);
						var mtlLoader = new MTLLoader()
						mtlLoader.setPath(path);
						materials = mtlLoader.parse(FileSystem.readFile(mtl), path);
					}
				}
				catch(f)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + f + ")");
					console.error("nunuStudio: Error loading file", f);
				}
			}

			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new OBJLoader();

					if(materials !== null)
					{
						loader.setMaterials(materials);
					}

					var obj = loader.parse(reader.result);
					obj.name = FileSystem.getFileName(name);
					Editor.addObject(obj, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};

			reader.readAsText(file);
		}
		//3MF
		else if(extension === "3mf")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new ThreeMFLoader();
					loader.parse(reader.result, function(obj)
					{
						Editor.addObject(obj, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//VOX
		else if(extension === "vox")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new VOXLoader();
					var chunks = loader.parse(reader.result);

					var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
					var material = new MeshPhongMaterial();
					var matrix = new Matrix4();

					var group = new Group();
					// group.name = FileSystem.getFileName(file);

					for(var i = 0; i < chunks.length; i++)
					{
						var chunk = chunks[i];
						var size = chunk.size;
						var data = chunk.data;

						var mesh = new InstancedMesh(geometry, material, data.length / 4);
						for(var j = 0, k = 0; j < data.length; j += 4, k++)
						{
							var x = data[j + 0] - size.x / 2;
							var y = data[j + 1] - size.y / 2;
							var z = data[j + 2] - size.z / 2;
							mesh.setMatrixAt(k, matrix.setPosition(x, z, - y));
						}
						group.add(mesh);

					}
					
					Editor.addObject(group, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// AWD
		else if(extension === "awd")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new AWDLoader();
					loader._baseDir = path;
					var awd = loader.parse(reader.result);
					Editor.addObject(awd, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// AMF
		else if(extension === "amf")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new AMFLoader();
					var amf = loader.parse(reader.result);
					Editor.addObject(amf, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// Assimp
		else if(extension === "assimp")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new AssimpLoader();
					var assimp = loader.parse(reader.result, path);
					Editor.addObject(assimp.object, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// Babylon
		else if(extension === "babylon")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new BabylonLoader();
					var json = JSON.parse(reader.result);
					var babylon = loader.parse(json, path);
					babylon.type = "Group";
					babylon.traverse(function(object)
					{
						if(object instanceof Mesh)
						{
							object.material = new MeshPhongMaterial();
						}
					});
					Editor.addObject(babylon, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		// Blender
		else if(extension === "blend")
		{	
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					JSBLEND(reader.result).then(function(blend)
					{
						var container = new Group();
						container.name = FileSystem.getNameWithoutExtension(name);
						blend.three.loadScene(container);
						Editor.addObject(container, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		//3DS
		else if(extension === "3ds")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new TDSLoader();
					loader.setPath(path);
					var group = loader.parse(reader.result);
					Editor.addObject(group, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// Collada
		else if(extension === "dae")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new ColladaLoader();
					var collada = loader.parse(reader.result, path);
					
					var scene = collada.scene;
					var animations = collada.animations;

					if(animations.length > 0)
					{
						scene.traverse(function(child)
						{
							if(child instanceof SkinnedMesh)
							{
								child.animations = animations;
							}
						});
					}
					
					Editor.addObject(scene, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		// Draco
		else if(extension === "drc")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new DRACOLoader();
					loader.setDecoderPath(Global.FILE_PATH + "wasm/draco/");
					loader.setDecoderConfig({type: "wasm"});
					loader.decodeDracoFile(reader.result, function(geometry)
					{
						loader.releaseDecoderModule();

						if(geometry.isBufferGeometry === true)
						{
							var normals = geometry.getAttribute("normal");
							if(normals === undefined)
							{
								geometry.computeVertexNormals();
							}
						}

						var mesh = new Mesh(geometry, Editor.defaultMaterial);
						Editor.addObject(mesh, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// GLTF
		else if(extension === "gltf" || extension === "glb")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath(Global.FILE_PATH + "wasm/draco/");
					dracoLoader.setDecoderConfig({type: "wasm"});

					var loader = new GLTFLoader();
					loader.dracoLoader = dracoLoader;
					loader.parse(reader.result, path, function(gltf)
					{
						dracoLoader.dispose();

						var scene = gltf.scene;
						scene.type = "Group";
						scene.name = FileSystem.getNameWithoutExtension(name);

						var animations = gltf.animations;
						if(animations.length > 0)
						{
							scene.traverse(function(child)
							{
								if(child instanceof SkinnedMesh)
								{
									child.animations = animations;
								}
							});
						}

						Editor.addObject(scene, parent);
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// PLY
		else if(extension === "ply")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new PLYLoader();
					var modelName = FileSystem.getNameWithoutExtension(name);

					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		// VTK
		else if(extension === "vtk" || extension === "vtp")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new VTKLoader();
					var modelName = FileSystem.getNameWithoutExtension(name);
					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// PRWM
		else if(extension === "prwm")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new PRWMLoader();
					var modelName = FileSystem.getNameWithoutExtension(name);

					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					var mesh = new Mesh(geometry, Editor.defaultMaterial);
					mesh.name = modelName;
					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		
		// VRML
		else if(extension === "wrl" || extension === "vrml")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new VRMLLoader();
					var scene = loader.parse(reader.result);

					for(var i = 0; i < scene.children.length; i++)
					{
						Editor.addObject(scene.children[i], parent);
					}

					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		// FBX
		else if(extension === "fbx")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new FBXLoader();
					var object = loader.parse(reader.result, path);
					
					if(object.animations !== undefined && object.animations.length > 0)
					{					
						object.traverse(function(child)
						{
							if(child instanceof SkinnedMesh)
							{
								child.animations = object.animations;
							}
						});
					}

					Editor.addObject(object, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// X
		else if(extension === "x")
		{
			function convertAnimation(baseAnime, name)
			{
				var animation = {};
				animation.fps = baseAnime.fps;
				animation.name = name;
				animation.hierarchy = [];

				for(var i = 0; i < baseAnime.hierarchy.length; i++)
				{
					var firstKey = -1;

					var frame = {};
					frame.name = baseAnime.hierarchy[i].name;
					frame.parent = baseAnime.hierarchy[i].parent;
					frame.keys = [];

					for(var m = 1; m < baseAnime.hierarchy[i].keys.length; m++)
					{
						if(baseAnime.hierarchy[i].keys[m].time > 0)
						{
							if(firstKey === -1)
							{
								firstKey = m - 1;
								frame.keys.push(baseAnime.hierarchy[i].keys[m - 1]);
							}

							frame.keys.push(baseAnime.hierarchy[i].keys[m]);
						}

						animation.length = baseAnime.hierarchy[i].keys[m].time;

						if(m >= baseAnime.hierarchy[i].keys.length - 1)
						{
							break;
						}

					}

					animation.hierarchy.push(frame);
				}

				return animation;
			}

			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new XLoader();
					loader.baseDir = path;
					loader.parse(reader.result, function(object)
					{
						for(var i = 0; i < object.FrameInfo.length; i ++)
						{
							var model = object.FrameInfo[i];

							if(model instanceof SkinnedMesh)
							{
								if(object.XAnimationObj !== undefined && object.XAnimationObj.length > 0)
								{
									var animations = object.XAnimationObj;
									for(var j = 0; j < animations.length; j++)
									{
										model.animationSpeed = 1000;
										model.animations.push(AnimationClip.parseAnimation(convertAnimation(animations[j], animations[j].name), model.skeleton.bones));
									}
								}
							}

							Editor.addObject(model, parent);
						}
						modal.destroy();
					});
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// PCD
		else if(extension === "pcd")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new PCDLoader();
					var pcd = loader.parse(reader.result, file.name);
					pcd.material.name = "points";

					Editor.addObject(pcd, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// SVG
		else if(extension === "svg")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new SVGLoader();
					var paths = loader.parse(reader.result);

					var group = new Group();
					var position = 0;

					for(var i = 0; i < paths.length; i ++)
					{
						var material = new MeshBasicMaterial({color: paths[i].color});
						var shapes = paths[i].toShapes(true);

						for(var j = 0; j < shapes.length; j++)
						{
							var shape = shapes[j];
							var geometry = new ShapeBufferGeometry(shape);
							var mesh = new Mesh(geometry, material);
							mesh.position.z = position;
							position += 0.1;
							group.add(mesh);
						}
					}

					Editor.addObject(group, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		// STL
		else if(extension === "stl")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new STLLoader();

					var modelName = FileSystem.getNameWithoutExtension(name);
					var geometry = loader.parse(reader.result);
					geometry.name = modelName;

					Editor.addObject(new Mesh(geometry, Editor.defaultMaterial), parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsArrayBuffer(file);
		}
		// threejs JSON
		else if(extension === "json")
		{
			var reader = new FileReader();
			reader.onload = function()
			{
				try
				{
					var loader = new JSONLoader();
					var data = loader.parse(JSON.parse(reader.result));
					var materials = data.materials;
					var geometry = data.geometry;

					// Material
					var material = null;
					if(materials === undefined || materials.length === 0)
					{
						material = Editor.defaultMaterial;
					}
					else if(materials.length === 1)
					{
						material = materials[0];
					}
					else if(materials.length > 1)
					{
						material = materials;
					}

					// Mesh
					var mesh = null;
					if(geometry.bones.length > 0)
					{
						mesh = new SkinnedMesh(geometry, material);
					}
					else
					{
						mesh = new Mesh(geometry, material);
					}

					Editor.addObject(mesh, parent);
					modal.destroy();
				}
				catch(e)
				{
					Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
					console.error("nunuStudio: Error loading file", e);
				}
			};
			reader.readAsText(file);
		}
		else
		{
			modal.destroy();
			Editor.alert(Locale.unknownFileFormat);
			console.warn("nunuStudio: Unknown file format");
		}
	}
	catch(e)
	{
		modal.destroy();
		Editor.alert(Locale.errorLoadingFile + "\n(" + e + ")");
		console.error("nunuStudio: Error loading file", e);
	}
};

export {Loaders};