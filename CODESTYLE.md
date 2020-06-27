# Code Guidelines

- This document defines JavaScript ES5, GLSL and HTML coding rules for booth style and functionality.
  - [ECMAScript Specification 5.1 Edition](http://ecma-international.org/ecma-262/5.1/#sec-4.3.13)
  - [ECMAScript Specification 9th Edition](http://ecma-international.org/ecma-262/9.0/index.html#Title)
- Even tough these guidelines are targeted at ES5 development there may some scenarios where more recent features (e.g. Maps) may be useful to improve performance. Some of these features are also in considered guidelines.
- The statements in this document should be followed as strictly as possible.
- If any undefined code situation arises it should be discussed by the development team and the document should be updated.
- Format files with \n as the line ending (Unix line endings). Do not use \r\n (Windows line endings) or \r (Apple OS's). 



# JavaScript

### Formatting

- Code should be indented using tabs (don't use spaces for indentation).
  - Allows each development to configure its IDE to display spacing as preferred.

### Naming

##### Definitions

- **PascalCase** names capitalize the first letter of each word, including the first.
- **lowerCamelCase** names capitalize the first letter of each word, except the first which is always lowercase, even if it’s an acronym.
- **SCREAMING_CAPS** use only uppercase letters, even for acronyms, and separate words with _.
- Avoid using big names, if a name if composed for more than 3 words simplify it.
- Try to keep names in context but perceptible.
  - E.g. If key belong to module there is no need to call it ModuleKey, Key should be enough.

##### Classes, Interfaces, Types

- Classes, typedefs, and types should use `PascalCase`

##### Namespaces

- Module  namespaces should use `PascalCase` but could in some cases use `SCREAMING_CAPS`

##### Variables, Functions

- Variables and methods should use `camelCase`

- When a function is intended to be called as a constructor function (e.g. with the `new` keyword), apply the same rule used for Classes. 

- Avoid `_` prefixes as much as possible, only used for private attributes of `Classes` if necessary.

- With the exception of temporary variables, such as the occasional `i` and `j` that you might use as the iterator index in a for loop, avoid abbreviating or otherwise obfuscating your variable and function names.

- Avoid prefixing or suffixing variables names with the types that they contain.

  - Instead of `studentArray` or `studentArr`, simply use `students` instead.


##### Static constant attributes

- Static constant attributes of a Class/Interface should use `SCREAMING_CAPS` 

##### Files

- Code files should use `PascalCase` in their name, if a file defines a class is should have the same name as the class that is defines.
- Markdown files use `SCREAMING_CAPS` in their name.
- All folders use `camelCase` in their name.



### Imports

- Place external imports before project file imports.
- Separate import categories using a empty line and try to keep modules from the same package/library together.

```javascript
include("lib/abcdef.js");
include("lib/something.min.js");

include("source/module/Derp.js");
include("source/module/Foo.js");

include("source/anothermodule/Thing.js");
include("source/anothermodule/AnotherThing.js");
```



### Comments

##### Comments

- Comments should always use `//`  when they are single line.
- Multiline comments should be written between `/**/`, without any `*` on the beginning of new lines.
- Never place your comments on the same line as code. Try to place the comment above the code witch the comment refers to.
- All comments should use the same indentation as the code block where they are placed.

```javascript
// This is a single line comment.
var a = 2;

/*
This is a multi line comment.
That does not represent documentation.
*/
```

- Comments should never occupy more than 3 lines.
- References to future tasks, (tasks / functionality that will be implemented later and merger on another PR) should start with the `TODO` word and surrounded by `<>`.

```javascript
// TODO <Add new functionality later here>
```



### Documentation

- Documentation is done using `JSDoc` format.
- JSDoc supports many HTML tags, like `<code>, <pre>, <tt>, <strong>, <ul>, <ol>, <li>, <a>`,  this means that plaintext formatting is not respected. So, don't rely on whitespace to format JSDoc.
- Every methods, properties and attributes of Classes, Types, Enums, Interfaces, etc. public or private needs to be documented.
- The only exception is for getters, setters that don't have any code logic associated and inherited properties.
- Local variables should never be documented, they should instead if necessary use simple comments.
- Always use explicitly the JSDoc tags, not all code generators are able to parse code and identify patterns properly (@class, @method, @attribute, @property, @static, @constructor, @extends etc).
- Always leave a empty line between the documentation description the the documentation tags.
- Classes must be documented with a description and a type tag that identifies the constructor.

```javascript
/**
 * Attribute meta is used to indicate information about a object attribute.
 *
 * It is used to create automatically forms to edit the object attributes.
 *
 * @constructor
 * @class AttributeMeta
 * @param {String} name Name of the attribute.
 * ...
 */
function AttributeMeta(name, type, units, editable)
{
	/**
	 * Name of the attribute.
	 *
	 * @attribute name
	 * @type {String}
	 */
	this.name = name;

	/** 
	 * Indicates if the attribute is editable.
	 *
	 * @attribute editable
	 * @type {Boolean}
	 */
	this.editable = editable !== undefined ? editable : true;
}

/**
 * Attribute defines a distance value.
 *
 * The base unit for all distances is meter.
 *
 * @static
 * @type {Number}
 * @attribute DISTANCE
 */
AttributeMeta.DISTANCE = 201;
```



### Exceptions

- Exceptions may cause the current execution thread to stop if not handled properly (using a `try...catch` statement).
- Empty exception handlers should be avoided as much as possible. Use only when strictly necessary to avoid top level code crashes.
- If a method requires a error to be handled externally it should throw an Error.
- Error situations should never come as a returned value. Throw a Error object to be handled externally instead.
- Always threat exceptions at some level, exceptions can cause the program to stop unnecessarily.
- Always assume that the program is running on strict mode. Some errors regarding syntax and reference access are only thrown in this mode.

```javascript
//Unknown variables are created on use if not running on strict mode.
z = 2;
console.log("Ok");

//Access to unknown variables throws a ReferenceError exception.
"use strict";
z = 2;
console.log("Ok");
```

- Be careful some data related problems in JavaScript might or might not throw an error. If there is a possibility of one of these scenarios use defensive programming to avoid them.

```javascript
//Division by 0 does not generate a error result is Infinity.
var a = 2;
var b = 0;
a = a / b; << Infinity

//Access to undefined attributes of an object does returns undefined.
var b = {};
var c = null;
c = b.abc; >> undefined

//Access to attributes of a null or undefined values throws a TypeError exception.
var b = null; //or var b = undefined;
var c = null;
c = b.abc;
```



### Brackets

- Always use curly brackets even when the code inside the condition only has one statement.
  - Should avoid later on breaking down code when adding new lines.
- Curly brackets should always be placed after the statement on the same line.

```javascript
if(isWeekDay)
{
	print("Bike to work!");
}
```



### Control Statements

- Never place a space between the `if, for, while` and the condition being defined.
- On `if...else` chained control statements the following statement should start on a new line.
- Prefer to explicitly check the `Boolean` value stored in variables.

```javascript
if(isWeekDay === true)
{
  console.log("Bike to work!");
}
else
{
  console.log("Go dancing or read a book!");
}

```

- On loop statements never store the length of the array up ahead, unless it is necessary.
- Avoid for loops with empty statement use a while loop instead.
- Place brackets on for every `switch` case, even when it only have a single line.
- Only use `switch` where there are multiple cases that can be true from a single value, avoid single options case switches.
- Avoid attributions on control statements, they may not be obvious to every programmer.
- In JavaScript condition checks are accepted 



### Variable Scopes

- Avoid declaring variables within blocks inside of functions, and instead declare them at the top of each function.
- Avoid creating unnecessary blocks. An non-control structure block, such as the one above, should be avoided. Sometimes blocks are necessary, such as when there is a control structure that requires it.
- If necessary store the reference to `this` in a variable called `self`. Declared on top of the code block that requires it.



### Variables

- Never create local copies of constant values, use the constant values directly.
- Never create single use variables
  - e.g `var a = 2; abc(a);` write `abc(2);` instead.
- Variables should be always explicitly declared.
- Always declare variables on their own line unless they are being declared in a control statement.

```javascript
var text = "abc";
var counter = 0;

for(var i = 0, j= 0;  i < x && j < y; i++; j++)
{
    counter++;
}
```



### Functions

- If a portion of code is used more than once it must be declared into a function.
  - Never create functions that are specific to a single use scenario. (Except for public API).
- Function should be always declared using the keyword `function`.
- For functions assigned to variables, place a `;` after the closing `}`, for functions that are *not* assigned to variables, do not place a `;` after the closing `}`.

```javascript
var doStuff = function(param, param2)
{
};

function doStuff(param, param2)
{
}
```

- Anonymous function are functions without a name, and named function are those with a name.
  - Assigning an anonymous function to a variable does not make that function a named function.
- Avoid nesting functions unnecessarily, if two functions that can each other can be swapped by a single function, use a single function.

- Functions can use encapsulation to define function private variables (e.g for temporary objects).

```javascript
var exampleFunction = function()
{
	var tempA = 0;
	var tempB = "abc";

	return function(parameter)
	{
		something(tempA);
		
		return tempB;
	};
}();
```

- Getter and setter functions that contain an attribution and a single statement may be written on the same line to improve readability.

```javascript
Object.defineProperties(this,
{
	foo: 
	{
		get: function(){return this.object.foo;},
		set: function(value){this.object.foo = value; this.updateStuff();}
	},
	derp:
	{
		get: function(){return this.object.derp;},
		set: function(value){this.object.derp = value; this.updateStuff();}
	}
}
```



### Recursive functions

- For most JavaScript engines there is a reasonable low depth (usually less than 100000 calls) allowed for recursion.
- Too much recursion may lead to [InternalError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError) being thrown.
- Always place proper stopping condition on recursive methods and test them carefully. Use counter and big datasets to check the recursive depth of the function.

```javascript
function a()
{
	a();
}

//Throws an exception
a();
```



### Classes

- Classes should be declared from constructor functions.
- Objects should always be created using the `new` keyword.
- Each constructor is a function that has a property named “prototype” that is used to implement prototype-based inheritance and shared properties
- Static attributes of the class should be attached to a Class defining function.
- Always store the class constructor in the prototype.

```javascript
function ThisIsAClass(parameter)
{
	this.attribute = "something";
}

ThisIsAClass.prototype.constructor = ThisIsAClass;

ThisIsAClass.prototype.methodXPTO = function()
{
	return false;
};

var a = new ThisIsAClass();
a.methodXPTO();
a.attribute = "something else";
```

- When there are static elements in the class the prototype of the class should be the class itself in order to make the static methods and properties available from the object context.

```javascript
function ThisIsAClass(parameter){}

ThisIsAClass.prototype = ThisIsAClass;
ThisIsAClass.prototype.constructor = ThisIsAClass;

ThisIsAClass.STATIC_CONST = 2;
ThisIsAClass.staticMethod = function()
{
    console.log("Static method");
}

var a = new ThisIsAClass();
a.staticMethod();
console.log(a.STATIC_CONST);
```

- Inheritance is achieved by calling the base class constructor on the new class constructor and by copying the base class prototype.

```javascript
function OtherClass(parameter)
{
	BaseClass.call(this, parameter);
}

OtherClass.prototype = Object.create(BaseClass.prototype);

OtherClass.prototype.newMethod = function(mode)
{
    return "abc";
};
```

- Static classes should be built from empty `Functions`.
- Multi type inheritance can be used when necessary but only the first type is actually inherited. (only the first type can be checked using the `instanceof` statement).

```javascript
function OtherClass()
{
	BaseClassA.call(this);
	BaseClassB.call(this);
}

OtherClass.prototype = Object.create(BaseClassA.prototype);
Object.assign(OtherClass.prototype, BaseClassB.prototype);

//"a instanceof BaseClassA" returns true
//"a instanceof BaseClassB" returns false
var a = new OtherClass();
```



### Maps

- Maps were introduced in ES6 but are a useful feature to improve performance of the application.
  - The Map object holds key-value pairs and remembers the original insertion order of the keys.
- They should always be used when indexing objects by another objects.
- Never use objects attribute name to index data, always use a map instead.

```javascript
//Bad
var a = {};
a["abc"] = new Abc();
a["dfg"] = new Dfg();
var b = a["abc"];

//Good
var a = new Map();
a.set("abc", new Abc());
a.set("dfg", new Dfg());
var b = a.get("abc");
```



### Arrays

- Array declaration should be done using the `[]` syntax.
- If the array size is known use the `new Array(length)` constructor.
- For object that need a explicit type declaration always use a typed array (e.g `Float64Array`, `Int8Array`). Unless strictly necessary to use a normal array (e.g array size is unknown).
- Arrays can be pre-initialized in a single line when they fit (up to 300 characters).

```javascript
var arr = [1, 2, 3];
```



### Objects

- Objects should be created from classes when their format is used in more than one place.
- Object declaration can be done in a single line up to 3 attributes, more than 3 attributes and the object declarations should always be spitted into lines.
- Use `{key: "val1", key2: "val2"}` never declare objects as `new Object()`.
- There should never be any space between the curly brackets and the attribute name when writing inline.
- Always access object attributes as `obj.attribute`, only use `obj["attribute"]` when using a string stored in a variable.
- Never write attribute names as strings on declaration, neve declare objects as `{"attribute": 2}` declare as `{attribute: 2}` instead.
```javascript
methodXPTO({a: 123, b: "abc", c: new Abc()});

var b =
{
    a: 123,
    b: "abc",
    c: new Abc(),
    d: 123
};

var c = {};
```



### Operations

- Place spaces between your operations. Use parenthesis as much as possible to explicitly indicate the operation order and make the code more readable.

```javascript
var a = ((b * c) + (d * f)) / e;
var b = Math.pow(a * b, c * d);
```

- Avoid mixed type operations. The result may not be clear to every programmer, making the code hard to understand. As an example some mixed operation type results.

```javascript
//In arithmetic operations (+, -, *, /, &, |, etc) boolean true is treated as 1 and false as a 0
false * 2; //returns 0
true * 2; //returns 2
true + 2; //returns 3
true * false // returns 0

//In arithmetic operations Strings may be represented as NaN if not empty, 0 if empty, or concatenated if the operation is +
2 * ""; //returns 0
2 * "something"; //return nAn
true * "something"; //returns nAn

//In logic operations the last value checked is returned (the value that succeded or the one that failed)
2 || true; //returns 2
true || 2; //returns true
2 && true && "abc" && 0 && false; //returns 0
```

- Avoid splitting binary and ternary operations into multiple lines. If doesn't fit in a single line probably its better/cleaner to use a if statement.

```javascript
var x = a ? b : c;
```



### Strings

- Always declare strings using the  `"` character except when using Template Strings or writing multi line strings.
  - [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- Never build multi line strings by concatenation, use template strings or the `\` char on line splits.



### Semicolons

- Always place semicolons after your code statements.
- Missing ASI (automatic semicolon insertion) can trip new devs e.g. `foo() \n (function(){})` will be a single statement (not two). Recommended by TC39 as well.



### Regular Expressions

- Regular expressions should always be written in their literal form between slashes for known expressions.
- For expressions built as strings during runtime use the RegExp object constructor.

```javascript
//Literal form
/ab+c/;

//Object constructor
new RegExp("ab+c");
```



### Null vs Undefined

- Always use and check them explicitly. They have different meaning.
- Avoid initializing or manually setting a value or attribute as `undefined`. Instead of setting as `undefined` use the `delete` to actually remove the value.

- Use `null` where its a part of the API or conventional. Never return an `undefined` value, if the output expects an object return a `null` instead in case of error or missing data.

```javascript
//Bad
return undefined;

//Good
return null;
return;
```

- Always explicitly check if objects are `null` or `undefined`.

```javascript
//Bad
if (error == null)
    
//Good
if (error === null || error === undefined)
```



# GLSL

- Declare all the GLSL code inline on your JavaScript code. Use multiline strings to write the code. Keep the GLSL at the same block level as your JavaScript code.
- Be careful when writing your strings. Always place line breaks between statements they are necessary for pre-processing code and may lead to compile errors if not placed properly.

```javascript
var vertex = "\n\
varying vec2 vUv;\n\
\n\
void main()\n\
{\n\
	vUv = uv;\n\
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\
}",
    
var fragment = `
precision highp float;
precision highp int;

` + fragmentShaderXPTO + `

uniform mat4 viewMatrix;
uniform mat4 uViewInv;
uniform mat4 uProjInv;
uniform vec3 cameraPosition;

...`;
```

- Use precision hints whenever its possible.
  - Colors in the `0.0` to `1.0` range can usually be represented using low precision variables.
  - Position data should usually be stored as high precision.

```c
//Defines precision for float and float-derived (vector/matrix) types.
precision highp float;
//Texture2D() result is lowp.
uniform lowp sampler2D sampler; 
varying lowp vec4 color;
//Uses default highp precision.
varying vec2 texCoord;
```

- Avoid branching instructions when possible
  - Branches are discouraged in shaders, as they can reduce the ability to execute operations in parallel.
  - Use pre-processing for branching in all constant values.
- Avoid and/or eliminate loop instructions as much as possible.
- Be careful when performing vectorial operations. Not all graphics processors include vector processors.

```c
highp float f0, f1;
highp vec4 v0, v1;

//Poor use of vector operators
v0 = (v1 * f0) * f1;

//Proper use of vector operations, run the float multiplications first
v0 = v1 * (f0 * f1);
```

- Avoid Computing Array Indices in shaders
  - Using indices computed in the shader is more expensive than a constant or uniform array index.



# HTML

- All HTML code must be valid and well formed.
- You must validate it against the HTML specification pertaining to the project you are working on.

- Element and attribute names must be in all lower case:

```html
<!-- Good -->
<input name="name" type="text" />

<!-- Bad -->
<input NAME="name" TYPE="text" />
```

- Non-empty elements must have corresponding closing tags.

```html
<h1>My title</h1>
<p>Some text</p>
```

- Empty elements must be followed by a corresponding closing tag:

```html
<span></span>
```

- Elements with a single tag, such as HR, BR, INPUT, IMG must end with `>`:

```html
<br>
<hr>
<img src="john.jpg" alt="John Doe" width="200" height="100">
```

- Nested elements must be nested appropriately - for example:

```html
<div>
  <p>Some text</p>
</div>
```

- The `<p>` tag and its corresponding closing tag, `</p>`, are both nested inside the `<div>` and `</div>` tags.

- Attribute values, even numeric attributes should be quoted.

```html
<!-- Good -->
<input name="age" type="text" size="3" />

<!-- Bad -->
<input name=age type=text size=3 />
```

- Use tabs for code indentation. Use indentation consistently to enhance the readability of the code.
- When elements carry over more than one line of code, indent the contents of elements between the start tag and the end tag. This will make it easy to see where the element begins and ends.

```html
<div class="container">
  <header class="header">
    <h1>Site Name<span></span></h1>
  </header>
  <!-- / header -->
  <hr>
  <nav class="navigation">
    <ul>
      <li><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
    </ul>
  </nav>
  <!-- / navigation -->
</div>
<!-- / container -->
```

- Set encoding of HTML document and its charset to UTF-8 Normalization Form C (NFC):

```html
<meta charset="utf-8" />
```

- Use comments when necessary to explain portion of the document. Comments booth are written always between `<!-- something -->` and should be indented to the same level of the HTML block.

``` html
<!-- / name-of-class-or-id -->
```



# References

- Here are a couple of references that may be useful. Some of them were used as base for the style described in this document.
- Couple of articles regarding JavaScript ES5 patterns
  - [ECMAScript 5.1 and ECMAScript 6](http://bguiz.github.io/js-standards/intro/)
  - [Classical inheritance in JavaScript ES5](https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5)
- [Google Javascript Guide](https://google.github.io/styleguide/javascriptguide.xml)
- [Khronos OpenGL GLSL recommendations](https://www.khronos.org/opengl/wiki/GLSL_:_recommendations)
- [Apple OpenGL ES Best Practices for Shaders](https://developer.apple.com/library/archive/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/BestPracticesforShaders/BestPracticesforShaders.html)
- [W3School HTML style guide](https://www.w3schools.com/html/html5_syntax.asp)

