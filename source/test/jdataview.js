//
// jDataView by Vjeux - Jan 2010
//
// A unique way to work with a binary file in the browser
// http://github.com/vjeux/jDataView
// http://blog.vjeux.com/ <vjeuxx@gmail.com>
//

(function (exports) {

var global = this;

var compatibility = {
	ArrayBuffer: typeof ArrayBuffer !== 'undefined',
	DataView: typeof DataView !== 'undefined' &&
		('getFloat64' in DataView.prototype ||				// Chrome
		 'getFloat64' in new DataView(new ArrayBuffer(1))), // Node
	// NodeJS Buffer in v0.5.5 and newer
	NodeBuffer: typeof Buffer !== 'undefined' && 'readInt16LE' in Buffer.prototype
};

var dataTypes = {
	'Int8': 1,
	'Int16': 2,
	'Int32': 4,
	'Uint8': 1,
	'Uint16': 2,
	'Uint32': 4,
	'Float32': 4,
	'Float64': 8
};

var nodeNaming = {
	'Int8': 'Int8',
	'Int16': 'Int16',
	'Int32': 'Int32',
	'Uint8': 'UInt8',
	'Uint16': 'UInt16',
	'Uint32': 'UInt32',
	'Float32': 'Float',
	'Float64': 'Double'
};

var jDataView = function (buffer, byteOffset, byteLength, littleEndian) {
	if (!(this instanceof jDataView)) {
		throw new Error("jDataView constructor may not be called as a function");
	}

	this.buffer = buffer = jDataView.wrapBuffer(buffer);

	// Check parameters and existing functionnalities
	this._isArrayBuffer = compatibility.ArrayBuffer && buffer instanceof ArrayBuffer;
	this._isDataView = compatibility.DataView && this._isArrayBuffer;
	this._isNodeBuffer = compatibility.NodeBuffer && buffer instanceof Buffer;

	// Handle Type Errors
	if (!this._isNodeBuffer && !this._isArrayBuffer && !(buffer instanceof Array)) {
		throw new TypeError('jDataView buffer has an incompatible type');
	}

	// Default Values
	this._littleEndian = Boolean(littleEndian);

	var bufferLength = this._isArrayBuffer ? buffer.byteLength : buffer.length;
	if (byteOffset === undefined) {
		byteOffset = 0;
	}
	this.byteOffset = byteOffset;

	if (byteLength === undefined) {
		byteLength = bufferLength - byteOffset;
	}
	this.byteLength = byteLength;

	if (!this._isDataView) {
		// Do additional checks to simulate DataView
		if (typeof byteOffset !== 'number') {
			throw new TypeError('jDataView byteOffset is not a number');
		}
		if (typeof byteLength !== 'number') {
			throw new TypeError('jDataView byteLength is not a number');
		}
		if (byteOffset < 0) {
			throw new Error('jDataView byteOffset is negative');
		}
		if (byteLength < 0) {
			throw new Error('jDataView byteLength is negative');
		}
	}

	// Instanciate
	if (this._isDataView) {
		this._view = new DataView(buffer, byteOffset, byteLength);
	}
	this._start = byteOffset;
	if (byteOffset + byteLength > bufferLength) {
		throw new Error("jDataView (byteOffset + byteLength) value is out of bounds");
	}

	this._offset = 0;

	// Create uniform reading methods (wrappers) for the following data types

	if (this._isDataView) { // DataView: we use the direct method
		for (var type in dataTypes) {
			if (!dataTypes.hasOwnProperty(type)) {
				continue;
			}
			(function(type, view){
				var size = dataTypes[type];
				view['get' + type] = function (byteOffset, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// Move the internal offset forward
					view._offset = byteOffset + size;

					return view._view['get' + type](byteOffset, littleEndian);
				};
				view['set' + type] = function (byteOffset, value, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// Move the internal offset forward
					view._offset = byteOffset + size;

					view._view['set' + type](byteOffset, value, littleEndian);
				};
			})(type, this);
		}
	} else if (this._isNodeBuffer) {
		for (var type in dataTypes) {
			if (!dataTypes.hasOwnProperty(type)) {
				continue;
			}
			(function(type, view){
				var size = dataTypes[type];
				view['get' + type] = function (byteOffset, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					var name;
					if (type === 'Int8' || type === 'Uint8') {
						name = 'read' + nodeNaming[type];
					} else if (littleEndian) {
						name = 'read' + nodeNaming[type] + 'LE';
					} else {
						name = 'read' + nodeNaming[type] + 'BE';
					}

					// Move the internal offset forward
					view._offset = byteOffset + size;

					return view.buffer[name](view._start + byteOffset);
				};
				view['set' + type] = function (byteOffset, value, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					var name;
					if (type === 'Int8' || type === 'Uint8') {
						name = 'write' + nodeNaming[type];
					} else if (littleEndian) {
						name = 'write' + nodeNaming[type] + 'LE';
					} else {
						name = 'write' + nodeNaming[type] + 'BE';
					}

					// Move the internal offset forward
					view._offset = byteOffset + size;

					view.buffer[name](value, view._start + byteOffset);
				};
			})(type, this);
		}
	} else if (this._isArrayBuffer) {
		for (var type in dataTypes) {
			if (!dataTypes.hasOwnProperty(type)) {
				continue;
			}
			(function(type, view){
				var size = dataTypes[type];
				view['get' + type] = function (byteOffset, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// ArrayBuffer: we use a typed array of size 1 from original buffer if alignment is good and from slice when it's not
					var buffer, offset;
					if (size === 1 || ((view._start + byteOffset) % size === 0 && littleEndian)) {
						buffer = view.buffer;
						offset = view._start + byteOffset;
						view._offset = byteOffset + size;
					} else {
						// standard decoding functions are still faster than JS implementations, so let's use them via hack
						buffer = new Uint8Array(view.getBytes(size, byteOffset, littleEndian)).buffer;
						offset = 0;
					}

					return new global[type + 'Array'](buffer, offset, 1)[0];
				};
				view['set' + type] = function (byteOffset, value, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// ArrayBuffer: we use a typed array of size 1 from original buffer if alignment is good and from slice when it's not
					var TypedArray = global[type + 'Array'];
					if (size === 1 || ((view._start + byteOffset) % size === 0 && littleEndian)) {
						new TypedArray(view.buffer, view._start + byteOffset, 1)[0] = value;
						view._offset = byteOffset + size;
					} else {
						// standard encoding functions are still faster than JS implementations, so let's use them via hack
						var bytes = new Uint8Array(size);
						new TypedArray(bytes.buffer, 0, 1)[0] = value;
						view.setBytes(byteOffset, bytes, littleEndian);
					}
				};
			})(type, this);
		}
	} else {
		for (var type in dataTypes) {
			if (!dataTypes.hasOwnProperty(type)) {
				continue;
			}
			(function(type, view){
				var size = dataTypes[type];
				view['get' + type] = function (byteOffset, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// Error checking:
					if (typeof byteOffset !== 'number') {
						throw new TypeError('jDataView byteOffset is not a number');
					}
					if (byteOffset + size > view.byteLength) {
						throw new Error('jDataView (byteOffset + size) value is out of bounds');
					}

					return view['_get' + type](byteOffset, littleEndian);
				};
				view['set' + type] = function (byteOffset, value, littleEndian) {
					// Handle the lack of endianness
					if (littleEndian === undefined) {
						littleEndian = view._littleEndian;
					}

					// Handle the lack of byteOffset
					if (byteOffset === undefined) {
						byteOffset = view._offset;
					}

					// Move the internal offset forward
					view._offset = byteOffset + size;

					// Error checking:
					if (typeof byteOffset !== 'number') {
						throw new TypeError('jDataView byteOffset is not a number');
					}
					if (byteOffset + size > view.byteLength) {
						throw new Error('jDataView (byteOffset + size) value is out of bounds');
					}

					view['_set' + type.replace('Uint', 'Int')](byteOffset, value, littleEndian);
				};
			})(type, this);
		}
	}

	for (var type in dataTypes) {
		if (!dataTypes.hasOwnProperty(type)) {
			continue;
		}
		(function (type, view) {
			view['write' + type] = function (value, littleEndian) {
				this['set' + type](undefined, value, littleEndian);
			};
		})(type, this);
	}
};

// mostly internal function for wrapping any supported input (String or Array-like) to best suitable buffer format
jDataView.wrapBuffer = function (buffer) {
	switch (typeof buffer) {
		case 'string':
			buffer = Array.prototype.map.call(buffer, function (char) {
				return char.charCodeAt(0) & 0xff;
			});
			break;

		case 'number':
			buffer = {length: buffer};
			break;
	}

	if ('length' in buffer && !((compatibility.NodeBuffer && buffer instanceof Buffer) || (compatibility.ArrayBuffer && buffer instanceof ArrayBuffer))) {
		if (compatibility.NodeBuffer) {
			buffer = new Buffer(buffer);
		} else
		if (compatibility.ArrayBuffer) {
			var bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
			buffer = bytes.buffer;
		} else {
			if (!(buffer instanceof Array)) {
				buffer = Array.prototype.slice.call(buffer);
			}
			// as simple Array may contain non-byte values (incl. undefined)
			for (var i = 0, length = buffer.length; i < length; i++) {
				buffer[i] &= 0xff;
			}
		}
	}

	return buffer;
};

// left for backward compatibility
jDataView.createBuffer = function () {
	return jDataView.wrapBuffer(arguments);
};

jDataView.prototype = {
	compatibility: compatibility,

	// Helpers

	_getBytes: function (length, byteOffset, littleEndian) {
		var result;

		// Handle the lack of endianness
		if (littleEndian === undefined) {
			littleEndian = this._littleEndian;
		}

		// Handle the lack of byteOffset
		if (byteOffset === undefined) {
			byteOffset = this._offset;
		}

		if (length === undefined) {
			length = this.byteLength - byteOffset;
		}

		// Error Checking
		if (typeof byteOffset !== 'number') {
			throw new TypeError('jDataView byteOffset is not a number');
		}
		if (length < 0 || byteOffset + length > this.byteLength) {
			throw new Error('jDataView length or (byteOffset+length) value is out of bounds');
		}

		byteOffset += this._start;

		if (this._isArrayBuffer) {
			result = new Uint8Array(this.buffer, byteOffset, length);
		}
		else {
			result = this.buffer.slice(byteOffset, byteOffset + length);
		}

		if (!littleEndian && length > 1) {
			if (!(result instanceof Array)) {
				result = Array.prototype.slice.call(result);
			}

			result.reverse();
		}

		this._offset = byteOffset - this._start + length;

		return result;
	},

	// wrapper for external calls (do not return inner buffer directly to prevent it's modifying)
	getBytes: function (length, byteOffset, littleEndian) {
		var result = this._getBytes.apply(this, arguments);

		if (!(result instanceof Array)) {
			result = Array.prototype.slice.call(result);
		}

		return result;
	},

	setBytes: function (byteOffset, bytes, littleEndian) {
		var length = bytes.length;

		// Handle the lack of endianness
		if (littleEndian === undefined) {
			littleEndian = this._littleEndian;
		}

		// Handle the lack of byteOffset
		if (byteOffset === undefined) {
			byteOffset = this._offset;
		}

		// Error Checking
		if (typeof byteOffset !== 'number') {
			throw new TypeError('jDataView byteOffset is not a number');
		}
		if (length < 0 || byteOffset + length > this.byteLength) {
			throw new Error('jDataView length or (byteOffset+length) value is out of bounds');
		}

		if (!littleEndian && length > 1) {
			bytes = Array.prototype.slice.call(bytes).reverse();
		}

		byteOffset += this._start;

		if (this._isArrayBuffer) {
			new Uint8Array(this.buffer, byteOffset, length).set(bytes);
		}
		else {
			if (this._isNodeBuffer) {
				new Buffer(bytes).copy(this.buffer, byteOffset);
			} else {
				for (var i = 0; i < length; i++) {
					this.buffer[byteOffset + i] = bytes[i];
				}
			}
		}

		this._offset = byteOffset - this._start + length;
	},

	writeBytes: function (bytes, littleEndian) {
		this.setBytes(undefined, bytes, littleEndian);
	},

	getString: function (length, byteOffset) {
		return String.fromCharCode.apply(null, this._getBytes(length, byteOffset, true));
	},

	setString: function (byteOffset, subString) {
		this.setBytes(byteOffset, Array.prototype.map.call(subString, function (char) {
			return char.charCodeAt(0) & 0xff;
		}), true);
	},

	writeString: function (subString) {
		this.setString(undefined, subString);
	},

	getChar: function (byteOffset) {
		return this.getString(1, byteOffset);
	},

	setChar: function (byteOffset, char) {
		this.setString.apply(this, arguments);
	},

	writeChar: function (char) {
		this.setChar(undefined, char);
	},

	tell: function () {
		return this._offset;
	},

	seek: function (byteOffset) {
		if (typeof byteOffset !== 'number') {
			throw new TypeError('jDataView byteOffset is not a number');
		}
		if (byteOffset < 0 || byteOffset > this.byteLength) {
			throw new Error('jDataView byteOffset value is out of bounds');
		}

		return this._offset = byteOffset;
	},

	slice: function (start, end, forceCopy) {
		return forceCopy
			   ? new jDataView(this.getBytes(end - start, start), undefined, undefined, true)
			   : new jDataView(this.buffer, this._start + start, end - start, this._littleEndian);
	},

	// Compatibility functions on a String Buffer

	_getFloat64: function (byteOffset, littleEndian) {
		var b = this._getBytes(8, byteOffset, littleEndian),

			sign = 1 - (2 * (b[7] >> 7)),
			exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),

		// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
			mantissa = ((b[6] & 0x0f) * Math.pow(2, 48)) + (b[5] * Math.pow(2, 40)) + (b[4] * Math.pow(2, 32)) +
						(b[3] * Math.pow(2, 24)) + (b[2] * Math.pow(2, 16)) + (b[1] * Math.pow(2, 8)) + b[0];

		if (exponent === 1024) {
			if (mantissa !== 0) {
				return NaN;
			} else {
				return sign * Infinity;
			}
		}

		if (exponent === -1023) { // Denormalized
			return sign * mantissa * Math.pow(2, -1022 - 52);
		}

		return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);
	},

	_getFloat32: function (byteOffset, littleEndian) {
		var b = this._getBytes(4, byteOffset, littleEndian),

			sign = 1 - (2 * (b[3] >> 7)),
			exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127,
			mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

		if (exponent === 128) {
			if (mantissa !== 0) {
				return NaN;
			} else {
				return sign * Infinity;
			}
		}

		if (exponent === -127) { // Denormalized
			return sign * mantissa * Math.pow(2, -126 - 23);
		}

		return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
	},

	_getInt32: function (byteOffset, littleEndian) {
		var b = this._getBytes(4, byteOffset, littleEndian);
		return (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
	},

	_getUint32: function (byteOffset, littleEndian) {
		return this._getInt32(byteOffset, littleEndian) >>> 0;
	},

	_getInt16: function (byteOffset, littleEndian) {
		return (this._getUint16(byteOffset, littleEndian) << 16) >> 16;
	},

	_getUint16: function (byteOffset, littleEndian) {
		var b = this._getBytes(2, byteOffset, littleEndian);
		return (b[1] << 8) | b[0];
	},

	_getInt8: function (byteOffset) {
		return (this._getUint8(byteOffset) << 24) >> 24;
	},

	_getUint8: function (byteOffset) {
		return this._getBytes(1, byteOffset)[0];
	},

	_setBinaryFloat: function (byteOffset, value, mantSize, expSize, littleEndian) {
		var signBit = value < 0 ? 1 : 0,
			exponent,
			mantissa,
			eMax = ~(-1 << (expSize - 1)),
			eMin = 1 - eMax;

		if (value < 0) {
			value = -value;
		}

		if (value === 0) {
			exponent = eMin - 1;
			mantissa = 0;
		} else
		if (isNaN(value)) {
			exponent = eMax + 1;
			mantissa = 1;
		} else
		if (value === Infinity) {
			exponent = eMax + 1;
			mantissa = 0;
		} else {
			exponent = Math.floor(Math.log(value) / Math.LN2);
			if (exponent > eMin && exponent <= eMax) {
				mantissa = Math.floor((value * Math.pow(2, -exponent) - 1) * Math.pow(2, mantSize));
			} else {
				mantissa = Math.floor(value * Math.pow(2, mantSize - eMin));
				exponent = eMin - 1;
			}
		}

		exponent += eMax;

		var b = [];
		while (mantSize >= 8) {
			b.push(mantissa % 256);
			mantissa = Math.floor(mantissa / 256);
			mantSize -= 8;
		}
		exponent = (exponent << mantSize) | mantissa;
		expSize += mantSize;
		while (expSize >= 8) {
			b.push(exponent & 0xff);
			exponent >>>= 8;
			expSize -= 8;
		}
		b.push((signBit << expSize) | exponent);

		this.setBytes(byteOffset, b, littleEndian);
	},

	_setFloat32: function (byteOffset, value, littleEndian) {
		this._setBinaryFloat(byteOffset, value, 23, 8, littleEndian);
	},

	_setFloat64: function (byteOffset, value, littleEndian) {
		this._setBinaryFloat(byteOffset, value ,52, 11, littleEndian);
	},

	_setInt32: function (byteOffset, value, littleEndian) {
		this.setBytes(byteOffset, [
			value & 0xff,
			(value >>> 8) & 0xff,
			(value >>> 16) & 0xff,
			value >>> 24
		], littleEndian);
	},

	_setInt16: function (byteOffset, value, littleEndian) {
		this.setBytes(byteOffset, [
			value & 0xff,
			value >>> 8
		], littleEndian);
	},

	_setInt8: function (byteOffset, value) {
		this.setBytes(byteOffset, [value]);
	}
};

if (typeof module !== 'undefined' && exports === module.exports) {
	module.exports = jDataView;
} else {
	exports.jDataView = jDataView;
}

})(this);