import {Loader, Object3D, FileLoader, Mesh, MeshPhongMaterial, Texture, ImageLoader, Bone, Matrix4, BufferGeometry, BufferAttribute} from "three";

/**
 * Author: Pierre Lepers
 * Date: 09/12/2013 17:21
 */
var AWDLoader = (function()
{
	var // UNCOMPRESSED = 0,
		// DEFLATE = 1,
		// LZMA = 2,
		AWD_FIELD_INT8 = 1,
		AWD_FIELD_INT16 = 2,
		AWD_FIELD_INT32 = 3,
		AWD_FIELD_UINT8 = 4,
		AWD_FIELD_UINT16 = 5,
		AWD_FIELD_UINT32 = 6,
		AWD_FIELD_FLOAT32 = 7,
		AWD_FIELD_FLOAT64 = 8,
		AWD_FIELD_BOOL = 21,
		// AWD_FIELD_COLOR = 22,
		AWD_FIELD_BADDR = 23,
		// AWD_FIELD_STRING = 31,
		// AWD_FIELD_BYTEARRAY = 32,
		AWD_FIELD_VECTOR2x1 = 41,
		AWD_FIELD_VECTOR3x1 = 42,
		AWD_FIELD_VECTOR4x1 = 43,
		AWD_FIELD_MTX3x2 = 44,
		AWD_FIELD_MTX3x3 = 45,
		AWD_FIELD_MTX4x3 = 46,
		AWD_FIELD_MTX4x4 = 47,
		BOOL = 21,
		// COLOR = 22,
		BADDR = 23,
		// INT8 = 1,
		// INT16 = 2,
		// INT32 = 3,
		UINT8 = 4,
		UINT16 = 5,
		// UINT32 = 6,
		FLOAT32 = 7,
		FLOAT64 = 8;
	var littleEndian = true;

	function Block()
	{
		this.id = 0;
		this.data = null;
		this.namespace = 0;
		this.flags = 0;
	}

	function AWDProperties()
	{}
	AWDProperties.prototype = {
		set: function(key, value)
		{
			this[key] = value;
		},
		get: function(key, fallback)
		{
			if (this.hasOwnProperty(key))
			{
				return this[key];
			}
			else
			{
				return fallback;
			}
		}
	};
	var AWDLoader = function(manager)
	{
		Loader.call(this, manager);
		this.trunk = new Object3D();
		this.materialFactory = undefined;
		this._url = '';
		this._baseDir = '';
		this.data = undefined;
		this._ptr = 0;
		this._version = [];
		this._streaming = false;
		this._optimizedForAccuracy = false;
		this._compression = 0;
		this._bodylen = 0xFFFFFFFF;
		this._blocks = [new Block()];
		this._accuracyMatrix = false;
		this._accuracyGeo = false;
		this._accuracyProps = false;
	};
	AWDLoader.prototype = Object.assign(Object.create(Loader.prototype),
		{
			constructor: AWDLoader,
			load: function(url, onLoad, onProgress, onError)
			{
				var scope = this;
				this._url = url;
				this._baseDir = url.substr(0, url.lastIndexOf('/') + 1);
				var loader = new FileLoader(this.manager);
				loader.setPath(this.path);
				loader.setResponseType('arraybuffer');
				loader.load(url, function(text)
				{
					onLoad(scope.parse(text));
				}, onProgress, onError);
			},
			parse: function(data)
			{
				var blen = data.byteLength;
				this._ptr = 0;
				this.data = new DataView(data);
				this._parseHeader();
				if (this._compression !== 0)
				{
					console.error('compressed AWD not supported');
				}
				if (!this._streaming && this._bodylen !== data.byteLength - this._ptr)
				{
					console.error('AWDLoader: body len does not match file length', this._bodylen, blen - this._ptr);
				}
				while (this._ptr < blen)
				{
					this.parseNextBlock();
				}
				return this.trunk;
			},
			parseNextBlock: function()
			{
				var assetData,
					block,
					blockId = this.readU32(),
					ns = this.readU8(),
					type = this.readU8(),
					flags = this.readU8(),
					len = this.readU32();
				switch (type)
				{
				case 1:
					assetData = this.parseMeshData();
					break;
				case 22:
					assetData = this.parseContainer();
					break;
				case 23:
					assetData = this.parseMeshInstance();
					break;
				case 81:
					assetData = this.parseMaterial();
					break;
				case 82:
					assetData = this.parseTexture();
					break;
				case 101:
					assetData = this.parseSkeleton();
					break;
				case 112:
					assetData = this.parseMeshPoseAnimation(false);
					break;
				case 113:
					assetData = this.parseVertexAnimationSet();
					break;
				case 102:
					assetData = this.parseSkeletonPose();
					break;
				case 103:
					assetData = this.parseSkeletonAnimation();
					break;
				case 122:
					assetData = this.parseAnimatorSet();
					break;
				default:
					// debug('Ignoring block!',type, len);
					this._ptr += len;
					break;
				}
				// Store block reference for later use
				this._blocks[blockId] = block = new Block();
				block.data = assetData;
				block.id = blockId;
				block.namespace = ns;
				block.flags = flags;
			},
			_parseHeader: function()
			{
				var version = this._version,
					awdmagic = this.readU8() << 16 | this.readU8() << 8 | this.readU8();
				if (awdmagic !== 4282180) {throw new Error("AWDLoader - bad magic");}
				version[0] = this.readU8();
				version[1] = this.readU8();
				var flags = this.readU16();
				this._streaming = (flags & 0x1) === 0x1;
				if (version[0] === 2 && version[1] === 1)
				{
					this._accuracyMatrix = (flags & 0x2) === 0x2;
					this._accuracyGeo = (flags & 0x4) === 0x4;
					this._accuracyProps = (flags & 0x8) === 0x8;
				}
				this._geoNrType = this._accuracyGeo ? FLOAT64 : FLOAT32;
				this._matrixNrType = this._accuracyMatrix ? FLOAT64 : FLOAT32;
				this._propsNrType = this._accuracyProps ? FLOAT64 : FLOAT32;
				this._optimizedForAccuracy = (flags & 0x2) === 0x2;
				this._compression = this.readU8();
				this._bodylen = this.readU32();
			},
			parseContainer: function()
			{
				var parent,
					ctr = new Object3D(),
					parId = this.readU32(),
					mtx = this.parseMatrix4();
				ctr.name = this.readUTF();
				ctr.applyMatrix(mtx);
				parent = this._blocks[parId].data || this.trunk;
				parent.add(ctr);
				this.parseProperties(
					{
						1: this._matrixNrType,
						2: this._matrixNrType,
						3: this._matrixNrType,
						4: UINT8
					});
				ctr.extra = this.parseUserAttributes();
				return ctr;
			},
			parseMeshInstance: function()
			{
				var name,
					mesh, geometries, meshLen, meshes,
					parId, dataId,
					mtx,
					materials, mat, matId,
					numMaterials,
					parent,
					i;
				parId = this.readU32();
				mtx = this.parseMatrix4();
				name = this.readUTF();
				dataId = this.readU32();
				numMaterials = this.readU16();
				geometries = this.getBlock(dataId);
				materials = [];
				for (i = 0; i < numMaterials; i++)
				{
					matId = this.readU32();
					mat = this.getBlock(matId);
					materials.push(mat);
				}
				meshLen = geometries.length;
				meshes = [];
				// TODO : BufferGeometry don't support "geometryGroups" for now.
				// so we create sub meshes for each groups
				if (meshLen > 1)
				{
					mesh = new Object3D();
					for (i = 0; i < meshLen; i++)
					{
						var sm = new Mesh(geometries[i]);
						meshes.push(sm);
						mesh.add(sm);
					}
				}
				else
				{
					mesh = new Mesh(geometries[0]);
					meshes.push(mesh);
				}
				mesh.applyMatrix(mtx);
				mesh.name = name;
				parent = this.getBlock(parId) || this.trunk;
				parent.add(mesh);
				var matLen = materials.length;
				var maxLen = Math.max(meshLen, matLen);
				for (i = 0; i < maxLen; i++) {meshes[i % meshLen].material = materials[i % matLen];}
				// Ignore for now
				this.parseProperties(null);
				mesh.extra = this.parseUserAttributes();
				return mesh;
			},
			parseMaterial: function()
			{
				var name,
					type,
					props,
					mat,
					attributes,
					numMethods,
					methodsParsed;
				name = this.readUTF();
				type = this.readU8();
				numMethods = this.readU8();
				// log( "AWDLoader parseMaterial ",name )
				// Read material numerical properties
				// (1=color, 2=bitmap url, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
				props = this.parseProperties(
					{
						1: AWD_FIELD_INT32,
						2: AWD_FIELD_BADDR,
						11: AWD_FIELD_BOOL,
						12: AWD_FIELD_FLOAT32,
						13: AWD_FIELD_BOOL
					});
				methodsParsed = 0;
				while (methodsParsed < numMethods)
				{
				// read method_type before
					this.readU16();
					this.parseProperties(null);
					this.parseUserAttributes();
				}
				attributes = this.parseUserAttributes();
				if (this.materialFactory !== undefined)
				{
					mat = this.materialFactory(name);
					if (mat) {return mat;}
				}
				mat = new MeshPhongMaterial();
				if (type === 1)
				{
				// Color material
					mat.color.setHex(props.get(1, 0xcccccc));
				}
				else if (type === 2)
				{
				// Bitmap material
					var texAddr = props.get(2, 0);
					mat.map = this.getBlock(texAddr);
				}
				mat.extra = attributes;
				mat.alphaThreshold = props.get(12, 0.0);
				mat.repeat = props.get(13, false);
				return mat;
			},
			parseTexture: function()
			{
				var name = this.readUTF(),
					type = this.readU8(),
					asset,
					dataLen;
				// External
				if (type === 0)
				{
					dataLen = this.readU32();
					var url = this.readUTFBytes(dataLen);
					asset = this.loadTexture(url);
					asset.userData = {};
					asset.userData.name = name;
				}
				else
				{
				// embed texture not supported
				}

				// Ignore for now
				this.parseProperties(null);
				this.parseUserAttributes();
				return asset;
			},
			loadTexture: function(url)
			{
				var tex = new Texture();
				var loader = new ImageLoader(this.manager);
				loader.load(this._baseDir + url, function(image)
				{
					tex.image = image;
					tex.needsUpdate = true;
				});
				return tex;
			},
			parseSkeleton: function()
			{
			// Array<Bone>
			//
				this.readUTF();
				var numJoints = this.readU16(),
					skeleton = [],
					jointsParsed = 0;
				this.parseProperties(null);
				while (jointsParsed < numJoints)
				{
					var joint, ibp;
					// Ignore joint id
					this.readU16();
					joint = new Bone();
					joint.parent = this.readU16() - 1; // 0=null in AWD
					joint.name = this.readUTF();
					ibp = this.parseMatrix4();
					joint.skinMatrix = ibp;
					// Ignore joint props/attributes for now
					this.parseProperties(null);
					this.parseUserAttributes();
					skeleton.push(joint);
					jointsParsed++;
				}
				// Discard attributes for now
				this.parseUserAttributes();
				return skeleton;
			},
			parseSkeletonPose: function()
			{
				var name = this.readUTF();
				var numJoints = this.readU16();
				this.parseProperties(null);
				// debug( 'parse Skeleton Pose. joints : ' + numJoints);
				var pose = [];
				var jointsParsed = 0;
				while (jointsParsed < numJoints)
				{
					var hasTransform; // :uint;
					var mtxData;
					hasTransform = this.readU8();
					if (hasTransform === 1)
					{
						mtxData = this.parseMatrix4();
					}
					else
					{
						mtxData = new Matrix4();
					}
					pose[jointsParsed] = mtxData;
					jointsParsed++;
				}
				// Skip attributes for now
				this.parseUserAttributes();
				return pose;
			},
			parseSkeletonAnimation: function()
			{
				var frameDur;
				var poseAddr;
				var pose;
				var name = this.readUTF();
				var clip = [];
				var numFrames = this.readU16();
				this.parseProperties(null);
				var framesParsed = 0;
				// debug( 'parse Skeleton Animation. frames : ' + numFrames);
				while (framesParsed < numFrames)
				{
					poseAddr = this.readU32();
					frameDur = this.readU16();
					pose = this._blocks[poseAddr].data;
					// debug( 'pose address ',pose[2].elements[12],pose[2].elements[13],pose[2].elements[14] );
					clip.push(
						{
							pose: pose,
							duration: frameDur
						});
					framesParsed++;
				}
				if (clip.length === 0)
				{
				// debug("Could not this SkeletonClipNode, because no Frames where set.");
					return;
				}
				// Ignore attributes for now
				this.parseUserAttributes();
				return clip;
			},
			parseVertexAnimationSet: function()
			{
				var poseBlockAdress,
					name = this.readUTF(),
					numFrames = this.readU16(),
					props = this.parseProperties({1: UINT16}),
					framesParsed = 0,
					skeletonFrames = [];
				while (framesParsed < numFrames)
				{
					poseBlockAdress = this.readU32();
					skeletonFrames.push(this._blocks[poseBlockAdress].data);
					framesParsed++;
				}
				this.parseUserAttributes();
				return skeletonFrames;
			},
			parseAnimatorSet: function()
			{
				var animSetBlockAdress; // :int
				var targetAnimationSet; // :AnimationSetBase;
				var name = this.readUTF();
				var type = this.readU16();
				var props = this.parseProperties(
					{1: BADDR});
				animSetBlockAdress = this.readU32();
				var targetMeshLength = this.readU16();
				var meshAdresses = []; // :Vector.<uint> = new Vector.<uint>;
				for (var i = 0; i < targetMeshLength; i++) {meshAdresses.push(this.readU32());}
				var activeState = this.readU16();
				var autoplay = Boolean(this.readU8());
				this.parseUserAttributes();
				this.parseUserAttributes();
				var targetMeshes = []; // :Vector.<Mesh> = new Vector.<Mesh>;
				for (i = 0; i < meshAdresses.length; i++)
				{
				//			returnedArray = getAssetByID(meshAdresses[i], [AssetType.MESH]);
				//			if (returnedArray[0])
					targetMeshes.push(this._blocks[meshAdresses[i]].data);
				}
				targetAnimationSet = this._blocks[animSetBlockAdress].data;
				var thisAnimator;
				if (type === 1)
				{
					thisAnimator = {
						animationSet: targetAnimationSet,
						skeleton: this._blocks[props.get(1, 0)].data
					};
				}
				else if (type === 2)
				{
				// debug( "vertex Anim???");
				}
				for (i = 0; i < targetMeshes.length; i++)
				{
					targetMeshes[i].animator = thisAnimator;
				}
				// debug("Parsed a Animator: Name = " + name);
				return thisAnimator;
			},
			parseMeshData: function()
			{
				var name = this.readUTF(),
					numSubs = this.readU16(),
					geom,
					subsParsed = 0,
					buffer,
					geometries = [];
				// Ignore for now
				this.parseProperties(
					{
						1: this._geoNrType,
						2: this._geoNrType
					});
				// Loop through sub meshes
				while (subsParsed < numSubs)
				{
					var smLen, smEnd, attrib;
					geom = new BufferGeometry();
					geom.name = name;
					geometries.push(geom);
					smLen = this.readU32();
					smEnd = this._ptr + smLen;
					// Ignore for now
					this.parseProperties(
						{
							1: this._geoNrType,
							2: this._geoNrType
						});
					// Loop through data streams
					while (this._ptr < smEnd)
					{
						var idx = 0,
							strType = this.readU8(),
							strFtype = this.readU8(),
							strLen = this.readU32(),
							strEnd = strLen + this._ptr;
						if (strType === 1)
						{
						// VERTICES
							buffer = new Float32Array(strLen / 12 * 3);
							attrib = new BufferAttribute(buffer, 3);
							geom.addAttribute('position', attrib);
							idx = 0;
							while (this._ptr < strEnd)
							{
								buffer[idx] = -this.readF32();
								buffer[idx + 1] = this.readF32();
								buffer[idx + 2] = this.readF32();
								idx += 3;
							}
						}
						else if (strType === 2)
						{
						// INDICES
							buffer = new Uint16Array(strLen / 2);
							attrib = new BufferAttribute(buffer, 1);
							geom.setIndex(attrib);
							idx = 0;
							while (this._ptr < strEnd)
							{
								buffer[idx + 1] = this.readU16();
								buffer[idx] = this.readU16();
								buffer[idx + 2] = this.readU16();
								idx += 3;
							}
						}
						else if (strType === 3)
						{
						// UVS
							buffer = new Float32Array(strLen / 8 * 2);
							attrib = new BufferAttribute(buffer, 2);
							geom.addAttribute('uv', attrib);
							idx = 0;
							while (this._ptr < strEnd)
							{
								buffer[idx] = this.readF32();
								buffer[idx + 1] = 1.0 - this.readF32();
								idx += 2;
							}
						}
						else if (strType === 4)
						{
						// NORMALS
							buffer = new Float32Array(strLen / 12 * 3);
							attrib = new BufferAttribute(buffer, 3);
							geom.addAttribute('normal', attrib);
							idx = 0;
							while (this._ptr < strEnd)
							{
								buffer[idx] = -this.readF32();
								buffer[idx + 1] = this.readF32();
								buffer[idx + 2] = this.readF32();
								idx += 3;
							}
						}
						else
						{
							this._ptr = strEnd;
						}
					}
					this.parseUserAttributes();
					geom.computeBoundingSphere();
					subsParsed++;
				}
				// geom.computeFaceNormals();
				this.parseUserAttributes();
				// finalizeAsset(geom, name);
				return geometries;
			},
			parseMeshPoseAnimation: function(poseOnly)
			{
				var numFrames = 1,
					numSubmeshes,
					framesParsed,
					subMeshParsed,
					strLen,
					strEnd,
					geom,
					idx = 0,
					clip = {},
					numStreams,
					streamsParsed,
					streamtypes = [],
					props,
					name = this.readUTF(),
					geoAdress = this.readU32();
				var mesh = this.getBlock(geoAdress);
				if (mesh === null)
				{
					console.log("parseMeshPoseAnimation target mesh not found at:", geoAdress);
					return;
				}
				geom = mesh.geometry;
				geom.morphTargets = [];
				if (!poseOnly) {numFrames = this.readU16();}
				numSubmeshes = this.readU16();
				numStreams = this.readU16();
				// debug("VA numFrames : ", numFrames );
				// debug("VA numSubmeshes : ", numSubmeshes );
				// debug("VA numstreams : ", numStreams );
				streamsParsed = 0;
				while (streamsParsed < numStreams)
				{
					streamtypes.push(this.readU16());
					streamsParsed++;
				}
				props = this.parseProperties(
					{
						1: BOOL,
						2: BOOL
					});
				clip.looping = props.get(1, true);
				clip.stitchFinalFrame = props.get(2, false);
				framesParsed = 0;
				while (framesParsed < numFrames)
				{
					this.readU16();
					subMeshParsed = 0;
					while (subMeshParsed < numSubmeshes)
					{
						streamsParsed = 0;
						strLen = this.readU32();
						strEnd = this._ptr + strLen;
						while (streamsParsed < numStreams)
						{
							if (streamtypes[streamsParsed] === 1)
							{
							// geom.addAttribute( 'morphTarget'+framesParsed, Float32Array, strLen/12, 3 );
								var buffer = new Float32Array(strLen / 4);
								geom.morphTargets.push(
									{array: buffer});
								// buffer = geom.attributes['morphTarget'+framesParsed].array
								idx = 0;
								while (this._ptr < strEnd)
								{
									buffer[idx] = this.readF32();
									buffer[idx + 1] = this.readF32();
									buffer[idx + 2] = this.readF32();
									idx += 3;
								}
								subMeshParsed++;
							}
							else {this._ptr = strEnd;}
							streamsParsed++;
						}
					}
					framesParsed++;
				}
				this.parseUserAttributes();
				return null;
			},
			getBlock: function(id)
			{
				return this._blocks[id].data;
			},
			parseMatrix4: function()
			{
				var mtx = new Matrix4();
				var e = mtx.elements;
				e[0] = this.readF32();
				e[1] = this.readF32();
				e[2] = this.readF32();
				e[3] = 0.0;
				// e[3] = 0.0;
				e[4] = this.readF32();
				e[5] = this.readF32();
				e[6] = this.readF32();
				// e[7] = this.readF32();
				e[7] = 0.0;
				e[8] = this.readF32();
				e[9] = this.readF32();
				e[10] = this.readF32();
				// e[11] = this.readF32();
				e[11] = 0.0;
				e[12] = -this.readF32();
				e[13] = this.readF32();
				e[14] = this.readF32();
				// e[15] = this.readF32();
				e[15] = 1.0;
				return mtx;
			},
			parseProperties: function(expected)
			{
				var listLen = this.readU32();
				var listEnd = this._ptr + listLen;
				var props = new AWDProperties();
				if (expected)
				{
					while (this._ptr < listEnd)
					{
						var key = this.readU16();
						var len = this.readU32();
						var type;
						if (expected.hasOwnProperty(key))
						{
							type = expected[key];
							props.set(key, this.parseAttrValue(type, len));
						}
						else
						{
							this._ptr += len;
						}
					}
				}
				return props;
			},
			parseUserAttributes: function()
			{
			// skip for now
				this._ptr = this.readU32() + this._ptr;
				return null;
			},
			parseAttrValue: function(type, len)
			{
				var elemLen;
				var readFunc;
				switch (type)
				{
				case AWD_FIELD_INT8:
					elemLen = 1;
					readFunc = this.readI8;
					break;
				case AWD_FIELD_INT16:
					elemLen = 2;
					readFunc = this.readI16;
					break;
				case AWD_FIELD_INT32:
					elemLen = 4;
					readFunc = this.readI32;
					break;
				case AWD_FIELD_BOOL:
				case AWD_FIELD_UINT8:
					elemLen = 1;
					readFunc = this.readU8;
					break;
				case AWD_FIELD_UINT16:
					elemLen = 2;
					readFunc = this.readU16;
					break;
				case AWD_FIELD_UINT32:
				case AWD_FIELD_BADDR:
					elemLen = 4;
					readFunc = this.readU32;
					break;
				case AWD_FIELD_FLOAT32:
					elemLen = 4;
					readFunc = this.readF32;
					break;
				case AWD_FIELD_FLOAT64:
					elemLen = 8;
					readFunc = this.readF64;
					break;
				case AWD_FIELD_VECTOR2x1:
				case AWD_FIELD_VECTOR3x1:
				case AWD_FIELD_VECTOR4x1:
				case AWD_FIELD_MTX3x2:
				case AWD_FIELD_MTX3x3:
				case AWD_FIELD_MTX4x3:
				case AWD_FIELD_MTX4x4:
					elemLen = 8;
					readFunc = this.readF64;
					break;
				}
				if (elemLen < len)
				{
					var list;
					var numRead;
					var numElems;
					list = [];
					numRead = 0;
					numElems = len / elemLen;
					while (numRead < numElems)
					{
						list.push(readFunc.call(this));
						numRead++;
					}
					return list;
				}
				else
				{
					return readFunc.call(this);
				}
			},
			readU8: function()
			{
				return this.data.getUint8(this._ptr++);
			},
			readI8: function()
			{
				return this.data.getInt8(this._ptr++);
			},
			readU16: function()
			{
				var a = this.data.getUint16(this._ptr, littleEndian);
				this._ptr += 2;
				return a;
			},
			readI16: function()
			{
				var a = this.data.getInt16(this._ptr, littleEndian);
				this._ptr += 2;
				return a;
			},
			readU32: function()
			{
				var a = this.data.getUint32(this._ptr, littleEndian);
				this._ptr += 4;
				return a;
			},
			readI32: function()
			{
				var a = this.data.getInt32(this._ptr, littleEndian);
				this._ptr += 4;
				return a;
			},
			readF32: function()
			{
				var a = this.data.getFloat32(this._ptr, littleEndian);
				this._ptr += 4;
				return a;
			},
			readF64: function()
			{
				var a = this.data.getFloat64(this._ptr, littleEndian);
				this._ptr += 8;
				return a;
			},

			/**
			 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
			 * 
			 * @param {Array.<number>} bytes UTF-8 byte array.
			 * @return {string} 16-bit Unicode string.
			 */
			readUTF: function()
			{
				var len = this.readU16();
				return this.readUTFBytes(len);
			},

			/**
			 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
			 * 
			 * @param {Array.<number>} bytes UTF-8 byte array.
			 * @return {string} 16-bit Unicode string.
			 */
			readUTFBytes: function(len)
			{
				var out = [],
					c = 0;
				while (out.length < len)
				{
					var c1 = this.data.getUint8(this._ptr++, littleEndian);
					if (c1 < 128)
					{
						out[c++] = String.fromCharCode(c1);
					}
					else if (c1 > 191 && c1 < 224)
					{
						var c2 = this.data.getUint8(this._ptr++, littleEndian);
						out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
					}
					else
					{
						var c2 = this.data.getUint8(this._ptr++, littleEndian);
						var c3 = this.data.getUint8(this._ptr++, littleEndian);
						out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
					}
				}
				return out.join('');
			}
		});
	return AWDLoader;
})();

export {AWDLoader};
