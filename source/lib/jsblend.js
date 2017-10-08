(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
	throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
	tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	arr[L++] = (tmp >> 16) & 0xFF
	arr[L++] = (tmp >> 8) & 0xFF
	arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
	tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
	tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	arr[L++] = (tmp >> 8) & 0xFF
	arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
	tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
	tmp = uint8[len - 1]
	output += lookup[tmp >> 2]
	output += lookup[(tmp << 4) & 0x3F]
	output += '=='
  } else if (extraBytes === 2) {
	tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	output += lookup[tmp >> 10]
	output += lookup[(tmp >> 4) & 0x3F]
	output += lookup[(tmp << 2) & 0x3F]
	output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

/*jshint esversion: 6 */

const three = require("./threejs/blend_three.js");

const parser = require("./parser/parser.js")();


function loadFile(blender_file, res, rej){	
	three_module = three(blender_file);

	//TODO: Report any errors with ThreeJS before continuing.
	
	res({
		file : blender_file,
		three : three_module
	});
}

/* This represents a parsed blendfile instance if parsing is successful. It will accept a string or a binary data object. Strings must be a valid URI to a blender file. Binary data may be in the form of an ArrayBuffer, TypedArray, or a Blob. Binary data must also contain the binary data of a blender file.*/

JSBLEND = (fileuri_or_filedata, name = "")=>{

	const promise = new Promise(
		(res, rej) =>{
			parser.onParseReady = (blender_file) => {
				loadFile(blender_file, res, rej);
			};

			//If fileuri_or_filedata is a string, attempt to load the file asynchronously
			if(typeof fileuri_or_filedata == "string"){
				
				let request = new XMLHttpRequest();
				
				request.open("GET", fileuri_or_filedata, true);
				
				request.responseType = 'blob';
				
				request.onload = () => {
					let file = request.response;
					
					parser.loadBlendFromBlob(new Blob([file]), fileuri_or_filedata);
				};
				
				request.send();

				return;
			}
			debugger

			if(typeof fileuri_or_filedata == "object"){
				//Attempt to load from blob or array buffer;
				if(fileuri_or_filedata instanceof ArrayBuffer){
					parser.loadBlendFromArrayBuffer(fileuri_or_filedata, name);
					return;
				}

				if(fileuri_or_filedata instanceof Blob){
					parser.loadBlendFromBlob(fileuri_or_filedata, name);
					return;
				}
			}

			//Unknown file type passed -> abort and reject

			console.warn("Unsupported file type passed to JSBlend", fileuri_or_filedata);
			
			rej("Unsupported file type passed to JSBlend");
		}
	);

	return promise;
};
},{"./parser/parser.js":3,"./threejs/blend_three.js":4}],3:[function(require,module,exports){
/*jshint esversion: 6 */

const DNA1 = 826363460;
const ENDB = 1111772741;

/* Note: Blender cooridinates treat the Z axis as the verticle and  Y as depth. */
module.exports  = (function(unzipper) {
	//A helper object to identify Blender Object structs by type name. 
	var blender_types = {
		mesh_object: 1,
		lamp: 10,
	};

	//web worker not functional in this version
	USE_WEBWORKER = false;

	var worker = null,

		FR = new FileReader(),

		return_object = {
			loadBlendFromArrayBuffer: function(array_buffer) {
				return_object.ready = false;
				if (USE_WEBWORKER) {
					worker.postMessage(array_buffer, array_buffer);
				} else {
					worker.onmessage({
						data: array_buffer
					});
				}
			},
			loadBlendFromBlob: function(blob) {
				FR.onload = function() {
					return_object.loadBlendFromArrayBuffer(this.result);
				};
				FR.readAsArrayBuffer(blob);
			},
			ready: true,
			onParseReady: function() {},
		};

	worker = new worker_code();

	worker.postMessage = function(message) {
		return_object.onParseReady(message);
	};

	function worker_code() {
		"use strict";

		var data = null,
			_data = null,
			BIG_ENDIAN = false,
			pointer_size = 0,
			struct_names = [],
			offset = 0,
			working_blend_file = null,
			current_SDNA_template = null,
			templates = {},
			finished_objects = [],
			FILE = null,
			AB = null;

		function parseFile(msg) {
			var self = this;
			if (typeof msg.data == "object") {
				// reset global variables
				AB = null;
				data = null;
				BIG_ENDIAN = false;
				pointer_size = 0;
				struct_names = [];
				offset = 0;
				working_blend_file = null;
				finished_objects = [];
				current_SDNA_template = null;


				// set data
				_data = msg.data;

				AB = _data.slice();

				data = new DataView(_data);


				FILE = new BLENDER_FILE(AB);

				//start parsing
				readFile();

				//export parsed data
				self.postMessage(FILE);
			}
		}

		/*
			Export object for a parsed __blender_file__.
		*/

		var BLENDER_FILE = function(AB) {
			this.AB = AB;
			//this.double = new Float64Array(AB);
			this.byte = new Uint8Array(AB);

			this.dv = new DataView(AB);

			this.objects = {};
			this.memory_lookup = {},
				this.object_array = [];

			this.template = null;
		};

		BLENDER_FILE.prototype = {
			addObject: function(obj) {
				this.object_array.push(obj);
				if (!this.objects[obj.blender_name]) this.objects[obj.blender_name] = [];
				this.objects[obj.blender_name].push(obj);
			},
			primeTypes: function(list_of_dna_names) {
				for (var i = 0; i < list_of_dna_names.length; i++) {
					//this.objects[list_of_dna_names[i]] = [];
				}
			},
			getPointer: function(offset) {
				var pointerLow = this.dv.getUint32(offset, this.template.endianess);
				if (this.template.pointer_size > 4) {
					var pointerHigh = this.dv.getUint32(offset + 4, this.template.endianess);
					if (this.template.endianess) {
						return (pointerLow) + "l|h" + pointerHigh;
					} else {
						return (pointerHigh) + "h|l" + pointerLow;
					}
				} else {
					return pointerLow;
				}
			}
		};

		function getDocument(data) {
			var obj = readFile(null, data);
		}

		self.onmessage = parseFile;
		this.onmessage = parseFile;

		/*
			These functions map offsets in the blender __blender_file__ to basic types (byte,short,int,float) through TypedArrays;
			This allows the underlying binary data to be changed.
		*/

		function float64Prop(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Float64Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getFloat64(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(float) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setFloat64(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}

		function floatProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Float32Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getFloat32(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(float) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setFloat32(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}

		function intProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Int32Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getInt32(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(int) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setInt32(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}

		function uIntProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Uint32Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getUint32(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(int) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setUint32(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}

		function shortProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Int16Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getInt16(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(float) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setInt16(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}

		var uShortProp = (offset, Blender_Array_Length, length) => {
			return {
				get: function() {
					return (Blender_Array_Length > 1) ?
						new Uint16Array(this.__blender_file__.AB, this.__data_address__ + offset, length) :
						this.__blender_file__.dv.getUint16(this.__data_address__ + offset, this.__blender_file__.template.endianess);
				},
				set: function(float) {
					if (Blender_Array_Length > 1) {} else {
						this.__blender_file__.dv.setUint16(this.__data_address__ + offset, float, this.__blender_file__.template.endianess);
					}
				},
			};
		}


		function charProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					if (Blender_Array_Length > 1) {
						let start = this.__data_address__ + offset;
						let end = start;
						let buffer_guard = 0;

						while (this.__blender_file__.byte[end] != 0 && buffer_guard++ < length) end++;

						return toString(this.__blender_file__.AB, start, end)
					}
					return this.__blender_file__.byte[(this.__data_address__ + offset)];
				},
				set: function(byte) {
					if (Blender_Array_Length > 1) {
						var string = byte + "",
							i = 0,
							l = string.length;
						while (i < length) {
							if (i < l) {
								this.__blender_file__.byte[(this.__data_address__ + offset + i)] = string.charCodeAt(i) | 0;
							} else {
								this.__blender_file__.byte[(this.__data_address__ + offset + i)] = 0;
							}
							i++;
						}
					} else {
						this.__blender_file__.byte[(this.__data_address__ + offset)] = byte | 0;
					}
				}
			};
		}

		function pointerProp2(offset) {
			return {
				get: function() {
					let pointer = this.__blender_file__.getPointer(this.__data_address__ + offset, this.__blender_file__);
					var link = this.__blender_file__.memory_lookup[pointer];

					var results = [];

					if (link) {
						var address = link.__data_address__;
						let j = 0;
						while (true) {
							pointer = this.__blender_file__.getPointer(address + j * 8, this.__blender_file__);
							let obj = this.__blender_file__.memory_lookup[pointer];
							if (!obj) break;
							results.push(obj);
							j++
						}

					};

					return results;
				},
				set: function() {}
			}
		}

		function pointerProp(offset, Blender_Array_Length, length) {
			return {
				get: function() {
					if (Blender_Array_Length > 1) {
						let array = [];
						let j = 0;
						let off = offset;
						while (j < Blender_Array_Length) {
							let pointer = this.__blender_file__.getPointer(this.__data_address__ + off, this.__blender_file__);

							array.push(this.__blender_file__.memory_lookup[pointer]);
							off += length ///this.__blender_file__.template.pointer_size;
							j++;
						}

						return array;
					} else {
						let pointer = this.__blender_file__.getPointer(this.__data_address__ + offset, this.__blender_file__);
						return this.__blender_file__.memory_lookup[pointer];
					}
				},
				set: function() {}
			}
		}

		function compileProp(obj, name, type, offset, array_size, IS_POINTER, pointer_size, length) {

			if (!IS_POINTER) {
				switch (type) {
					case "double":
						Object.defineProperty(obj, name, float64Prop(offset, array_size, length >> 3));
						break;
					case "float":
						Object.defineProperty(obj, name, floatProp(offset, array_size, length >> 2));
						break;
					case "int":
						Object.defineProperty(obj, name, intProp(offset, array_size, length >> 2));
						break;
					case "short":
					case "ushort":
						Object.defineProperty(obj, name, shortProp(offset, array_size, length >> 1));
						break;
					case "char":
					case "uchar":
						Object.defineProperty(obj, name, charProp(offset, array_size, length));
						break;
					default:
						//compile list to 
						obj[name] = {};
						obj.__list__.push(name, type, length, offset, array_size, IS_POINTER);
				}
				obj._length += length;
				offset += length;
			} else {
				Object.defineProperty(obj, name, pointerProp(offset, array_size, pointer_size));
				offset += pointer_size * array_size;
			}

			return offset;
		}

		//Store final DNA structs
		var MASTER_SDNA_SCHEMA = function(version) {
			this.version = version;
			this.SDNA_SET = false;
			this.byte_size = 0;
			this.struct_index = 0;
			this.structs = {};
			this.SDNA = {};
			this.endianess = false;
		};

		MASTER_SDNA_SCHEMA.prototype = {
			getSDNAStructureConstructor: function(name, struct) {
				if (struct) {
					var blen_struct = Function("function " + name + "(){}; return " + name)();

					blen_struct.prototype = new BLENDER_STRUCTURE();
					blen_struct.prototype.blender_name = name;
					blen_struct.prototype.__pointers = [];
					blen_struct.prototype.__list__ = [];

					var offset = 0;
					//Create properties of struct
					for (var i = 0; i < struct.length; i += 3) {
						var _name = struct[i],
							n = _name,
							type = struct[i + 1],
							length = struct[i + 2],
							array_length = 0,
							match = null,
							Blender_Array_Length = 1,
							Suparray_match = 1,
							PointerToArray = false,
							Pointer_Match = 0;
						var DNA = this.SDNA[name] = {
							constructor: blen_struct
						};


						let original_name = _name;

						//mini type parser
						if ((match = _name.match(/(\*?)(\*?)(\w+)(\[(\w*)\])?(\[(\w*)\])?/))) {

							//base name
							_name = match[3];

							//pointer type
							if (match[1]) {
								Pointer_Match = 10;
								blen_struct.prototype.__pointers.push(_name);
							}

							if (match[2]) {
								PointerToArray = true;
							}

							//arrays
							if (match[4]) {
								if (match[6]) {
									Suparray_match = parseInt(match[5]);
									Blender_Array_Length = parseInt(match[7]);
								} else {
									Blender_Array_Length = parseInt(match[5]);
								}
							}
							array_length = Blender_Array_Length * length;
							length = array_length * Suparray_match;
						}

						DNA[n] = {
							type: type,
							length: length,
							isArray: (Blender_Array_Length > 0),
						};

						if (PointerToArray) {
							Object.defineProperty(blen_struct.prototype, _name, pointerProp2(offset));
							offset += pointer_size;
						} else if (Suparray_match > 1) {
							var array_names = new Array(Suparray_match);

							//construct sub_array object that will return the correct structs
							for (var j = 0; j < Suparray_match; j++) {
								let array_name_ = `__${_name}[${j}]__`;
								array_names[j] = array_name_;

								offset = compileProp(blen_struct.prototype, array_name_, type, offset, Blender_Array_Length, Pointer_Match, pointer_size, array_length);
							}

							Object.defineProperty(blen_struct.prototype, _name, {
								get: (function(array_names) {
									return function() {
										var array = [];
										for (var i = 0; i < array_names.length; i++) {
											array.push(this[array_names[i]])
										}
										return array;
									}
								})(array_names)
							});
						} else {
							offset = compileProp(blen_struct.prototype, _name, type, offset, Blender_Array_Length, Pointer_Match, pointer_size, length);
						}
					}

					return this.SDNA[name].constructor;

				} else {
					if (!this.SDNA[name]) {
						return null;
					}
					return this.SDNA[name].constructor;
				}
			}
		};

		var BLENDER_STRUCTURE = function() {
			this.__blender_file__ = null;
			this.__list__ = null;
			this.__super_array_list__ = null;
			this.blender_name = "";
			this.__pointers = null;
			this.address = null;
			this.length = 0;
			this.__data_address__ = 0;
			this.blender_name = "";
			this._length = 0;
		};


		/*
			Returns a pre-constructed BLENDER_STRUCTURE or creates a new BLENDER_STRUCTURE to match the DNA struct type
		*/
		var pointer_function = (pointer) => () => {
			return FILE.memory_lookup[pointer]
		};

		function getPointer(offset) {
			var pointerLow = data.getUint32(offset, BIG_ENDIAN);
			if (pointer_size > 4) {
				var pointerHigh = data.getUint32(offset + 4, BIG_ENDIAN);

				if (BIG_ENDIAN) {
					return (pointerLow) + "" + pointerHigh;
				} else {
					return (pointerHigh) + "" + pointerLow;
				}
			} else {
				return pointerLow;
			}
		}

		BLENDER_STRUCTURE.prototype = {
			setData: function(pointer, _data_offset, data_block_length, BLENDER_FILE) {
				if (this.__list__ == null) return this;
				BLENDER_FILE.addObject(this);

				this.__blender_file__ = BLENDER_FILE;

				var struct = this.__list__,
					j = 0,
					i = 0,
					obj, name = "",
					type, length, Blender_Array_Length, Pointer_Match, offset, constructor;

				this.__data_address__ = _data_offset;

				if (struct === null) return this;

				for (i = 0; i < struct.length; i += 6) {
					obj = null;
					name = struct[i];
					type = struct[i + 1];
					Blender_Array_Length = struct[i + 4];
					Pointer_Match = struct[i + 5];
					offset = this.__data_address__ + struct[i + 3];

					if (Blender_Array_Length > 1) {
						this[name] = [];
						j = 0;
						while (j < Blender_Array_Length) {
							if (current_SDNA_template.getSDNAStructureConstructor(type)) {
								constructor = current_SDNA_template.getSDNAStructureConstructor(type);
								this[name].push((new constructor()).setData(0, offset, offset + length / Blender_Array_Length, BLENDER_FILE));
							} else this[name].push(null);
							offset += length / Blender_Array_Length;
							j++;
						}
					} else {
						if (current_SDNA_template.getSDNAStructureConstructor(type)) {
							constructor = current_SDNA_template.getSDNAStructureConstructor(type);
							this[name] = (new constructor()).setData(0, offset, length + offset, BLENDER_FILE);
						} else this[name] = null;
					}
				}
				//break connection to configuration list
				this.__list__ = null;
				return this;
			},

			get aname() {
				if (this.id) return this.id.name.slice(2);
				else return undefined;
			}
		};

		function toString(buffer, _in, _out) {
			return String.fromCharCode.apply(String, new Uint8Array(buffer, _in, _out - _in));
		}

		//Begin parsing blender __blender_file__
		function readFile() {
			var count = 0;
			var offset2 = 0;
			var root = 0;
			var i = 0;
			var data_offset = 0;
			var sdna_index = 0;
			var code = "";
			var block_length = 0;
			var curr_count = 0;
			var curr_count2 = 0;

			FILE.memory_lookup = {};
			struct_names = [];
			offset = 0;

			// Make sure we have a .blend __blender_file__. All blend files have the first 12bytes
			// set with BLENDER-v### in Utf-8
			if (toString(_data, offset, 7) !== "BLENDER") return console.warn("File supplied is not a .blend compatible Blender file.");

			// otherwise get templete from save version.

			offset += 7;
			pointer_size = ((toString(_data, offset++, offset)) == "_") ? 4 : 8;
			BIG_ENDIAN = toString(_data, offset++, offset) !== "V";
			var version = toString(_data, offset, offset + 3);


			//create new master template if none exist for current blender version;
			if (!templates[version]) {
				templates[version] = new MASTER_SDNA_SCHEMA(version);
			}

			current_SDNA_template = templates[version];

			FILE.template = current_SDNA_template;

			offset += 3;

			//Set SDNA structs if template hasn't been set.
			//Todo: Move the following block into the MASTER_SDNA_SCHEMA object.
			//*Like so:*/ current_SDNA_template.set(AB);

			if (!current_SDNA_template.SDNA_SET) {
				current_SDNA_template.endianess = BIG_ENDIAN;
				current_SDNA_template.pointer_size = pointer_size;
				//find DNA1 data block
				offset2 = offset;

				while (true) {
					sdna_index = data.getInt32(offset2 + pointer_size + 8, BIG_ENDIAN);
					code = toString(_data, offset2, offset2 + 4).replace(/\u0000/g, "");
					block_length = data.getInt32(offset2 + 4, true);
					offset2 += 16 + (pointer_size);
					if (code === "DNA1") {
						// DNA found; This is the core of the __blender_file__ and contains all the structure for the various data types used in Blender.
						count = 0;
						var types = [],
							fields = [],
							names = [],
							lengths = [],
							name = "",
							curr_name = "";

						//skip SDNA and NAME identifiers
						offset2 += 8;

						//Number of structs.
						count = data.getInt32(offset2, true);
						offset2 += 4;

						curr_count = 0;

						//Build up list of names for structs
						while (curr_count < count) {
							curr_name = "";
							while (data.getInt8(offset2) !== 0) {
								curr_name += toString(_data, offset2, offset2 + 1);
								offset2++;
							}
							names.push(curr_name);
							offset2++;
							curr_count++;
						}


						//Adjust for 4byte alignment
						if ((offset2 % 4) > 0) offset2 = (4 - (offset2 % 4)) + offset2;
						offset2 += 4;

						//Number of struct types
						count = data.getInt32(offset2, true);
						offset2 += 4;
						curr_count = 0;

						//Build up list of types
						while (curr_count < count) {
							curr_name = "";
							while (data.getInt8(offset2) !== 0) {
								curr_name += toString(_data, offset2, offset2 + 1);
								offset2++;
							}
							types.push(curr_name);
							offset2++;
							curr_count++;
						}

						//Adjust for 4byte alignment
						if ((offset2 % 4) > 0) offset2 = (4 - (offset2 % 4)) + offset2;
						offset2 += 4;
						curr_count = 0;

						//Build up list of byte lengths for types
						while (curr_count < count) {
							lengths.push(data.getInt16(offset2, BIG_ENDIAN));
							offset2 += 2;
							curr_count++;
						}

						//Adjust for 4byte alignment
						if ((offset2 % 4) > 0) offset2 = (4 - (offset2 % 4)) + offset2;
						offset2 += 4;

						//Number of structures
						var structure_count = data.getInt32(offset2, BIG_ENDIAN);
						offset2 += 4;
						curr_count = 0;

						//Create constructor objects from list of SDNA structs
						while (curr_count < structure_count) {
							var struct_name = types[data.getInt16(offset2, BIG_ENDIAN)];
							offset2 += 2;
							obj = [];
							count = data.getInt16(offset2, BIG_ENDIAN);
							offset2 += 2;
							curr_count2 = 0;
							struct_names.push(struct_name);

							//Fill an array with name, type, and length for each SDNA struct property
							while (curr_count2 < count) {
								obj.push(names[data.getInt16(offset2 + 2, BIG_ENDIAN)], types[data.getInt16(offset2, BIG_ENDIAN)], lengths[data.getInt16(offset2, BIG_ENDIAN)]);
								offset2 += 4;
								curr_count2++;
							}

							//Create a SDNA constructor by passing [type,name,lenth] array as second argument
							current_SDNA_template.getSDNAStructureConstructor(struct_name, obj);
							curr_count++;
						}
						current_SDNA_template.SDNA_SET = true;
						current_SDNA_template.SDNA_NAMES = struct_names;
						break;
					}
					offset2 += block_length;
				}
			}

			//parse the rest of the data, starting back at the top.
			//TODO: turn into "on-demand" parsing.

			while (true) {
				if ((offset % 4) > 0) {
					offset = (4 - (offset % 4)) + offset;
				}

				data_offset = offset;
				sdna_index = data.getInt32(offset + pointer_size + 8, BIG_ENDIAN);
				let code_uint = data.getUint32(offset, BIG_ENDIAN);
				offset2 = offset + 16 + (pointer_size);
				offset += data.getInt32(offset + 4, true) + 16 + (pointer_size);

				if (code_uint === DNA1); //skip - already processed at this point    
				else if (code_uint === ENDB) break; //end of __blender_file__ found
				else {
					//Create a Blender object using a constructor template from current_SDNA_template
					var data_start = data_offset + pointer_size + 16;

					//Get a SDNA constructor by name;
					var constructor = current_SDNA_template.getSDNAStructureConstructor(current_SDNA_template.SDNA_NAMES[sdna_index]);

					var size = data.getInt32(data_offset + 4, BIG_ENDIAN);

					count = data.getInt32(data_offset + 12 + pointer_size, BIG_ENDIAN);

					if (count > 0) {
						var obj = new constructor();

						var length = constructor.prototype._length;


						var address = FILE.getPointer(data_offset + 8);

						obj.address = address + "";

						obj.setData(address, data_start, data_start + size, FILE);

						if (count > 1) {
							let array = [];
							array.push(obj);
							for (var u = 1; u < count; u++) {
								obj = new constructor();
								obj.setData(address, data_start + length * u, data_start + (length * u) + length, FILE);
								array.push(obj);
							}
							FILE.memory_lookup[address] = array;
						} else {
							FILE.memory_lookup[address] = obj;
						}
					}
				}
			}
		}
	}
	return return_object;
});
},{}],4:[function(require,module,exports){
/*jshint esversion: 6 */

const createMaterial = require("./material.js");
const createTexture = require("./texture.js");
const createMesh = require("./mesh.js");
const createLight = require("./light.js");

function loadModel(three_scene, model_name, blender_file, cache) {
	var mats = blender_mesh.mat,
		materials = [];
	for (var i = 0; i < mats.length; i++) {
		var material = createThreeJSMaterial(mats[i]);
		materials.push(material);
	}
}

var blender_types = {
	mesh_object: 1,
	lamp: 10
};

function loadScene(three_scene, blender_file, cache) {
	//build object from blender mesh object
	for (let i = 0; i < blender_file.objects.Object.length; i++) {

		let obj = blender_file.objects.Object[i];

		//Load Lights

		if (obj.type == blender_types.lamp) {

			let light = createLight(obj, blender_file);

			three_scene.add(light);
		}

		//Load Meshes

		if (obj.type == blender_types.mesh_object) {
			if (obj.data) {
				//get the mesh 
				var buffered_geometry = createMesh(obj.data, [0, 0, 0]);
					
				var blend_material = obj.data.mat[0];
				
				if(blend_material){
					var material = createMaterial(blend_material);
				}else{
					//create generic material
				}

				//var geometry = createThreeJSGeometry(obj.data, [0, 0, 0]);
				///*
				//create a transform from the mesh object
				var mesh = new THREE.Mesh(buffered_geometry, material);

				mesh.castShadow = true;
				mesh.receiveShadow = true;

				three_scene.add(mesh);

				mesh.rotateZ(obj.rot[2]);
				mesh.rotateY(obj.rot[1]);
				mesh.rotateX(obj.rot[0]);
				mesh.scale.fromArray(obj.size, 0);
				mesh.position.fromArray([obj.loc[0], (obj.loc[2]), (-obj.loc[1])], 0);
				//*/
			}
		}
	}
}

module.exports = (blender_file) => {

	if (!THREE) {
		console.warn("No ThreeJS object detected");
		return {};
	}

	var cache = {};

	return {
		loadScene: (three_scene) => loadScene(three_scene, blender_file, cache),
		loadModel: (model_name) => loadModel(model_name, blender_file, cache)
	};
};
},{"./light.js":5,"./material.js":6,"./mesh.js":7,"./texture.js":8}],5:[function(require,module,exports){
/*jshint esversion: 6 */

var blender_light_types = {
	point: 0,
	sun: 1,
	spot: 0,
	hemi: 0,
	area: 0
};

module.exports = function createThreeJSLamp(blend_lamp) {

	let ldata = blend_lamp.data;

	let pos_array = [blend_lamp.loc[0], blend_lamp.loc[2], -blend_lamp.loc[1]];

	let color = ((ldata.r * 255) << 16) | ((ldata.g * 255) << 8) | ((ldata.b * 255) << 0);
	let intesity = ldata.energy;
	let distance = 0;

	var three_light = null;

	switch (ldata.type) {
		case blender_light_types.point:
			var three_light = new THREE.PointLight(color, intesity, distance);
			three_light.position.fromArray(pos_array, 0);
			three_light.castShadow = true;
			break;
		case blender_light_types.sun:
			var three_light = new THREE.PointLight(color, intesity, distance);
			three_light.position.fromArray(pos_array, 0);
			three_light.castShadow = true;
			three_light.shadow.mapSize.width = 1024;
			three_light.shadow.mapSize.height = 1024;
			three_light.shadow.camera.near = 0.01;
			three_light.shadow.camera.far = 500;
			break;
	}

	return three_light;
}
},{}],6:[function(require,module,exports){
/*jshint esversion: 6 */

module.exports = (() => {
	const createTexture = require("./texture.js");

	var texture_mappings = {
		diff_color: 1,
		normal: 2,
		mirror: 8,
		diff_intensity: 16,
		spec_intensity: 32,
		emit: 32,
		alpha: 128,
		spec_hardness: 256,
		ray_mirror: 512,
		translucency: 1024,
		ambient: 2048,
		displacement: 4096,
		warp: 8192
	};

	let blender_specular_types = {
		cooktorr: 0,
		phong: 1,
		blinn: 2,
		toon: 3,
		wardiso: 4
	};

	function applyColorMapping(blender_texture, three_texture, material) {
		if (blender_texture.mapto & texture_mappings.diff_color) {
			material.map = three_texture;
		}
	}

	function applySpecMapping(blender_texture, three_texture, material) {
		if (blender_texture.mapto & texture_mappings.spec_color && material.type != "MeshStandardMaterial") {
			material.specularMap = three_texture;
		}

		if (blender_texture.mapto & texture_mappings.spec_intensity && material.type != "MeshStandardMaterial") {
			material.roughnessMap = three_texture;
		}
	}

	function applyAlphaMapping(blender_texture, three_texture, material) {
		if (blender_texture.mapto & texture_mappings.alpha) {
			material.alphaMap = three_texture;
		}
	}

	function applyNormalMapping(blender_texture, three_texture, material) {
		if (blender_texture.mapto & texture_mappings.normal) {
			material.normalMap = three_texture;
			material.normalScale = {
				x: blender_texture.norfac,
				y: blender_texture.norfac
			};
		}
	}

	function applyMirrorMapping(blender_texture, three_texture, material) {
		if (blender_texture.mapto & texture_mappings.mirror) {
			material.envMap = three_texture;
			material.envMapIntensity = blender_texture.mirrfac;
		}
	}

	var blender_texture_coordinates = {
		GENERATED : 1,
		REFLECTION : 2,
		NORMAL:4,
		GLOBAL : 8,
		UV : 16,
		OBJECT : 32,
		WINDOW: 1024,
		TANGENT:4096,
		PARTICLE: 8192,
		STRESS:16384
	}

	var blender_texture_mapping = {
		FLAT : 0,
		CUBE : 1,
		TUBE : 2,
		SPHERE : 3
	}

	function applyTexture(blender_texture, material) {
		//extract blender_texture data. Use Only if image has been supplied.
		if (blender_texture && blender_texture.tex && blender_texture.tex.ima) {

			let three_texture = createTexture(blender_texture.tex.ima);

			if(blender_texture.texco == blender_texture_coordinates.REFLECTION){
				switch(blender_texture.mapping){
					case blender_texture_mapping.FLAT:
						three_texture.mapping = THREE.EquirectangularReflectionMapping;
					break;
					case blender_texture_mapping.SPHERE:
						three_texture.mapping = THREE.SphericalReflectionMapping;
					break;
				}
				 //three_texture.mapping = THREE.EquirectangularRefractionMapping;
			}
			
			applyColorMapping(blender_texture, three_texture, material);
			
			applySpecMapping(blender_texture, three_texture, material);
			
			applyAlphaMapping(blender_texture, three_texture, material);
			
			applyNormalMapping(blender_texture, three_texture, material);

			applyMirrorMapping(blender_texture, three_texture, material);
		}
	}

	return function createThreeJSMaterial(blend_mat) {

		var material = null;

		var textures = blend_mat.mtex;

		switch (blend_mat.spec_shader) {
			case blender_specular_types.lambert:
				material = new THREE.MeshLambertMaterial();
				material.color.setRGB(blend_mat.r, blend_mat.g, blend_mat.b);
				break;
			case blender_specular_types.blinn:
			case blender_specular_types.phong:

				material = new THREE.MeshStandardMaterial();
				material.color.setRGB(blend_mat.r, blend_mat.g, blend_mat.b);
				//material.specular.setRGB(blend_mat.specr, blend_mat.specg, blend_mat.specb);
				material.roughness = (1 - (blend_mat.har / 512));
				material.metalness = 1 - blend_mat.ref;
				if(blend_mat.alpha < 0.98){
					material.transparent = true;
					material.opacity = blend_mat.alpha;
					console.log(blend_mat, material)
				}
				break;
			case blender_specular_types.wardiso:
			case blender_specular_types.cooktorr:
				material = new THREE.MeshPhongMaterial();
				material.color.setRGB(blend_mat.r, blend_mat.g, blend_mat.b);
				material.specular.setRGB(blend_mat.specr, blend_mat.specg, blend_mat.specb);
				material.shininess = blend_mat.har / 512;
				material.reflectivity = blend_mat.ref * 100;
				break;
			default:
				material = new THREE.MeshLambertMaterial();
				material.color.setRGB(blend_mat.r, blend_mat.g, blend_mat.b);
				break;
		}

		var at = (texture) => applyTexture(texture, material);


		if (textures && textures.length) textures.map(at);

		return material;
	};
})();
},{"./texture.js":8}],7:[function(require,module,exports){
/*jshint esversion: 6 */
module.exports = function createThreeJSBufferGeometry(blender_mesh, origin) {
	//get materials
	let pick_material = 0,
		mesh = blender_mesh,
		faces = mesh.mpoly,
		loops = mesh.mloop,
		UV = mesh.mloopuv,
		verts = mesh.mvert;

	var geometry = new THREE.BufferGeometry();

	if (!faces) return geometry;

	var index_count = 0;

	//precalculate the size of the array needed for faces
	var face_indice_count = 0;
	var face_indice_counta = 0;

	for (var i = 0; i < faces.length; i++) {
		var face = faces[i] || faces;
		var len = face.totloop;
		var indexi = 1;

		face_indice_counta += (len * 2 / 3) | 0;

		while (indexi < len) {
			face_indice_count += 3;
			indexi += 2;
		}
	}

	//extract face info and dump into array buffer;
	var face_buffer = new Uint32Array(face_indice_count);
	var uv_buffer = new Float32Array(face_indice_count * 2);
	var normal_buffer = new Float32Array(face_indice_count * 3);
	var verts_array_buff = new Float32Array(face_indice_count * 3);

	for (var i = 0; i < faces.length; i++) {
		var face = faces[i] || faces;
		var len = face.totloop;
		var start = face.loopstart;
		var indexi = 1;
		var offset = 0;

		while (indexi < len) {
			var face_normals = [];
			var face_index_array = [];
			var face_uvs = [];

			let index = 0;

			for (var l = 0; l < 3; l++) {
				//Per Vertice 

				if ((indexi - 1) + l < len) {
					index = start + (indexi - 1) + l;
				} else {
					index = start;
				}

				var v = loops[index].v;
				var vert = verts[v];
				face_buffer[index_count] = index_count;
				//get normals, which are 16byte ints, and norm them back into floats.

				verts_array_buff[index_count * 3 + 0] = vert.co[0] + origin[0];
				verts_array_buff[index_count * 3 + 1] = vert.co[2] + origin[2];
				verts_array_buff[index_count * 3 + 2] = -vert.co[1] + -origin[1];

				normal_buffer[index_count * 3 + 0] = vert.no[0];
				normal_buffer[index_count * 3 + 1] = vert.no[2];
				normal_buffer[index_count * 3 + 2] = (-vert.no[1]);


				if (UV) {
					var uv = UV[index].uv;
					uv_buffer[index_count * 2 + 0] = uv[0];
					uv_buffer[index_count * 2 + 1] = uv[1];
				}

				index_count++;
			}

			indexi += 2;
		}
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(verts_array_buff, 3));
	geometry.setIndex(new THREE.BufferAttribute(face_buffer, 1));
	geometry.addAttribute('normal', new THREE.BufferAttribute(normal_buffer, 3));
	geometry.addAttribute('uv', new THREE.BufferAttribute(uv_buffer, 2));
	//geometry.blend_mat = materials[pick_material];

	return geometry;
};

function createThreeJSGeometry(blender_mesh, origin) {
	//get materials
	var mats = blender_mesh.mat,
		materials = [];
	for (var i = 0; i < mats.length; i++) {
		var material = createThreeJSMaterial(mats[i]);
		materials.push(material);
	}

	let pick_material = 0,
		mesh = blender_mesh,
		faces = mesh.mpoly,
		loops = mesh.mloop,
		UV = mesh.mloopuv,
		verts = mesh.mvert,
		vert_array = [],
		face_array = [],
		uv_array = [],
		normal_array = [];

	var geometry = new THREE.Geometry();

	if (!faces) return geometry;


	var index_count = 0;

	let verts_array_buff = new Float32Array(verts.length * 3);

	for (var i = 0; i < verts.length; i++) {
		let vert = verts[i];
		vert_array.push(new THREE.Vector3(vert.co[0] + origin[0], vert.co[2] + origin[2], -vert.co[1] - origin[1]));
	}

	for (var i = 0; i < faces.length; i++) {
		var face = faces[i] || faces;
		var len = face.totloop;
		var start = face.loopstart;
		var indexi = 1;

		pick_material = face.mat_nr;

		while (indexi < len) {
			var face_normals = [];
			var face_index_array = [];
			var face_uvs = [];

			let index = 0;

			for (var l = 0; l < 3; l++) {
				//Per Vertice 

				if ((indexi - 1) + l < len) {
					index = start + (indexi - 1) + l;
				} else {
					index = start;
				}

				var v = loops[index].v;
				var vert = verts[v];

				face_index_array.push(v);

				index_count++;

				//get normals, which are 16byte ints, and norm them back into floats.

				var
					n1 = vert.no[0],
					n2 = vert.no[2],
					n3 = -vert.no[1];

				var nl = 1;

				Math.sqrt((n1 * n1) + (n2 * n2) + (n3 * n3));

				face_normals.push(new THREE.Vector3(n1 / nl, n2 / nl, n3 / nl));

				if (UV) {
					var uv = UV[index].uv;
					face_uvs.push(new THREE.Vector2(uv[0], uv[1]));
				}
			}
			uv_array.push(face_uvs);
			face_array.push(new THREE.Face3(
				face_index_array[0], face_index_array[1], face_index_array[2],
				face_normals
			));

			indexi += 2;
		}
	}
	geometry.blend_mat = materials[pick_material];
	geometry.vertices = vert_array;
	geometry.faces = face_array;
	if (uv_array.length > 0) {
		geometry.faceVertexUvs = [uv_array];
	}

	geometry.uvsNeedUpdate = true;

	//Well, using blender file normals does not work. Will need to investigate why normals from the blender file do not provide correct results. 
	//For now, have Three calculate normals. 

	geometry.computeVertexNormals();


	return geometry;
};
},{}],8:[function(require,module,exports){
/*jshint esversion: 6 */

let blender_texture_cache = {};


module.exports = function createThreeJSTexture(image) {
	let base64 = require("base64-js");
	let parsed_blend_file = image.__blender_file__;
	let texture = null;
	let name = image.aname;

	if (image.packedfile) {

		if (blender_texture_cache[name]) {
			texture = blender_texture_cache[name];
		} else {

			//get the extension
			let ext = name.split('.').pop();

			let data = image.packedfile;

			let size = data.size;

			let offset = data.data.__data_address__;

			let raw_data = parsed_blend_file.byte.slice(offset, offset + size);

			let encodedData = base64.fromByteArray(raw_data);

			let dataURI;

			switch (ext) {
				case "png":
					dataURI = "data:image/png;base64," + encodedData;
					break;
				case "jpg":
					dataURI = "data:image/jpeg;base64," + encodedData;
					break;
			}

			let img = new Image();

			img.src = dataURI;

			texture = new THREE.Texture(img);

			img.onload = () => {
				texture.needsUpdate = true;
			};

			blender_texture_cache[name] = texture;
		}
	}
	return texture;
};
},{"base64-js":1}]},{},[2])
