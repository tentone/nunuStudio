(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\tentone\Documents\Git\nunuStudio\source\page\src\main.ts */"zUnb");


/***/ }),

/***/ "0onX":
/*!*******************************************************!*\
  !*** ./src/page/learn/basics/physics/physics.page.ts ***!
  \*******************************************************/
/*! exports provided: PhysicsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PhysicsPage", function() { return PhysicsPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class PhysicsPage {
}
PhysicsPage.ɵfac = function PhysicsPage_Factory(t) { return new (t || PhysicsPage)(); };
PhysicsPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PhysicsPage, selectors: [["physics-page"]], decls: 51, vars: 14, consts: [[1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/physics/video.mp4", "controls", "", 2, "width", "60%", "margin-left", "20%"], ["fname", "assets/learn/basics/physics/modes.nsp"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/physics/physics.nsp"]], template: function PhysicsPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Physics");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "In this tutorial we will experiment how physics work inside nunuStudio, physics are represented as objects in the editor, physics object dont have a visual representation they are just used for physics simulations.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Physics in nunuStudio are powered by cannon.js developed by schteppe, for more information about the physics engine please consult http://www.cannonjs.org/.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "nunuStudio encapsulates the physics bodies in objects, these bodies are managed and updated on a scene basis, physics configuration is managed by scene.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Physics object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "To add physics object select the desired physics object in the left toolbar and add it to the scene, after that add a mesh object as children of the newly created physics object to make it visible in the scene. Dont forget to add a ground object so that other physics object don't fall out of the screen.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Physics object can be configured as dynamic, static or kinematic objects. Dynamic objects are updated dynamically and detect collisions, kinematic objects are updated only based on their speed, and static objects are not updated at all. Static objects behave likes walls or the floor.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "video", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Object positioning");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "There is a mode property that indicates how the physics coordinates are transformed from the physics world to the scene, the physics world does not consider the parental transformations applied to objects, ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "World");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " positioning is used to just copy world coordinates from physics to the object is fast and the coordinates will match the values stored in the physics body. Sometimes it is usefull to store physics object in the hierarchy, ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Local");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " positioning can be used to adapt the physics world coordinates to match the scene, it has a small performance impact and the physics coordinates will not match the local transformation of the object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Bellow we have a comparison between world and local positioned physics objects inside a object hierarchy. As we can obvserve the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Local");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, " positioned object behaves as we would expect.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "app-viewer", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Physics object control");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "To interact with physics objects using scrips we need to get the physics body attached to that object. Then we can access the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "i");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "body");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, " property that exists in every physics object and change the forces, acceleration and velocity values to make it move around the scene.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "The following code gets an physics object body and using the keyboard WASD keys and the space bar we add velocity to that body forcing the cube to move around.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "The code shown above can be seen running bellow for a physics cube, use the WASD keys to control the cube, and the spacebar to make the cube jump. Even when we dont specify rotation for the cube the physics engine automatically calculates it based on the friction beween the surface of the cube and floor. As we can observe the cube tumbles around the scene naturally.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](50, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var body;\n\nthis.initialize = function()\n", "{", "\n\tbody = scene.getObjectByName(\"physics\").body;\n", "}", ";\n\nthis.update = function()\n", "{", "\n\tif(Keyboard.keyPressed(Keyboard.A))\n\t", "{", "\n\t\tbody.velocity.x -= 0.2;\n\t", "}", "\n\tif(Keyboard.keyPressed(Keyboard.D))\n\t", "{", "\n\t\tbody.velocity.x += 0.2;\n\t", "}", "\n\tif(Keyboard.keyPressed(Keyboard.W))\n\t", "{", "\n\t\tbody.velocity.z -= 0.2;\n\t", "}", "\n\tif(Keyboard.keyPressed(Keyboard.S))\n\t", "{", "\n\t\tbody.velocity.z += 0.2;\n\t", "}", "\n\n\tif(Keyboard.keyJustPressed(Keyboard.SPACEBAR))\n\t", "{", "\n\t\tbody.velocity.y += 5;\n\t", "}", "\n", "}", ";"]);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PhysicsPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'physics-page',
                templateUrl: './physics.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "1LOU":
/*!***********************************************************!*\
  !*** ./src/page/learn/basics/gyroscope/gyroscope.page.ts ***!
  \***********************************************************/
/*! exports provided: GyroscopePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GyroscopePage", function() { return GyroscopePage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class GyroscopePage {
}
GyroscopePage.ɵfac = function GyroscopePage_Factory(t) { return new (t || GyroscopePage)(); };
GyroscopePage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: GyroscopePage, selectors: [["gyroscope-page"]], decls: 54, vars: 6, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/gyroscope/gyro.png", 1, "img-normal"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/gyroscope/gyro.nsp"], ["href", "http://www.humus.name"], ["src", "assets/learn/basics/gyroscope/preview.jpg", 1, "img-normal"], ["src", "assets/learn/basics/gyroscope/editor.jpg", 1, "img-normal"], ["fname", "assets/learn/basics/gyroscope/pano.nsp"]], template: function GyroscopePage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Gyroscope");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Gyroscope");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "The gyroscope can be usefull booth to control objects in the scene as a controller or as a viewport controller for cameras. Gyroscopes are present in pretty much every recent mobile device out there. In this tutorial we will explore how to use it inside nunuStudio and explore some of its use cases.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "The device gyroscope provides information about rotation of the device represented as an euler rotation.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "The code bellow demonstrates how to create a Gyroscope input object, the gyroscope object its not a normal a nunuSutio object is exists only as a programming API, and has the following attributes, each representing a rotation axis relative to the device:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Alpha - Rotation on the Z axis");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Beta - Rotation on the X axis");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Gamma - Rotation on the Y axis");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Orientation - Indicates the orientation of the device");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "If everything works as expected you should see something similar to the example running bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Panorama");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "The gyroscope can be used to easily create interactive panoramic visualizations for mobile devices, we can do this very simply using a cubemap.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "A cubemap is a representation of a 360 scene using 6 images each one representing the face of a cube. For this example we will use the following images.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "The picture used in this example was taken by Emil Persson and its available for download ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, " (licensed under a Creative Commons Attribution 3.0).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](47, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "To create a new cube map select Import, Texture, CubeMap in Asset Explorer a new asset will be created, double click the new asset and a cube map editor tab will open, now simply drag the sides of your cube map to the correct position in the editor.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](50, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "To set this cubemap as the scene background, select the scene object in the object explorer and drag the cubemap asset to the background texture box.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "app-viewer", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("var camera, gyro;\n\nfunction initialize()\n", "{", "\n\tcamera = scene.getObjectByName(\"camera\");\n\tgyro = new Gyroscope();\n", "}", "\n\nfunction update()\n", "{", "\n\tgyro.setObjectQuaternion(camera);\n", "}", "\n\nfunction dispose()\n", "{", "\n\tgyro.dispose();\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](GyroscopePage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'gyroscope-page',
                templateUrl: './gyroscope.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "2/ro":
/*!*************************************************!*\
  !*** ./src/page/learn/basics/text/text.page.ts ***!
  \*************************************************/
/*! exports provided: TextPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextPage", function() { return TextPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class TextPage {
}
TextPage.ɵfac = function TextPage_Factory(t) { return new (t || TextPage)(); };
TextPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TextPage, selectors: [["text-page"]], decls: 33, vars: 4, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/text/editor.jpg", 2, "width", "60%", "margin-left", "20%"], ["src", "assets/learn/basics/text/bad.jpg", 2, "width", "40%", "margin-left", "10%"], ["src", "assets/learn/basics/text/good.jpg", 2, "width", "40%"], [1, "hljs", "javascript"]], template: function TextPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Text");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "nunuStudio has support for 3D text, to create a 3D text object select it from the tool bar. The 3D text object is based on the mesh object, it has a material and a font attached. By default all 3D text objects create use the default font provided with nunuStudio.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Load fonts");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "To load new fonts into nunuStudio select font on the import menu inside the asset explorer division or drag a compatible file into the asset explorer or directly into the 3D text object on the scene editor.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "nunuStudio has support for true type fonts and opentype JSON fonts.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Some fonts migth have some problems due to their shape path being declared CCW, to solve this problem, right click on the font asset and select the option Reverse as shown bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Change text and font");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Its possible to edit the text of a 3D Text object on the object panel, but its also possible to do this programmatically using a script object and the following code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "The code above will get the 3D Text object named \"text\" and changes it text to \"123\", its also possible to change the font using the code bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("var text;\n\nthis.initialize = function()\n", "{", "\ntext = scene.getObjectByName(\"text\");\ntext.setText(\"123\");\n", "}", ";");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("var text, font;\n\nthis.initialize = function()\n", "{", "\nfont = program.getFontByName(\"font\");\ntext = scene.getObjectByName(\"text\");\ntext.setFont(font);\n", "}", ";");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TextPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'text-page',
                templateUrl: './text.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "3RJ4":
/*!***********************************************************!*\
  !*** ./src/page/learn/basics/particles/particles.page.ts ***!
  \***********************************************************/
/*! exports provided: ParticlesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticlesPage", function() { return ParticlesPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class ParticlesPage {
}
ParticlesPage.ɵfac = function ParticlesPage_Factory(t) { return new (t || ParticlesPage)(); };
ParticlesPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ParticlesPage, selectors: [["particles-page"]], decls: 60, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/particles/select.png", 2, "width", "20%", "margin-left", "40%"], ["src", "assets/learn/basics/particles/editor.png", 2, "width", "60%", "margin-left", "20%"], ["fname", "assets/learn/basics/particles/particle.nsp"]], template: function ParticlesPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Particles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "nunuStudio has a dedicated particle engine, the particle object encapsulates a Emitter and a Group that can be easily edited in the Particle Editor, but more Emitters can be added programmatically during runtime.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "To add a new particle object select it from the tool bar. All new particle objects are created with the default template.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Particle Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "The particle editor can be used to customize the particle object. To open the particle editor, double click on the particle object in the object explorer, a new tab with the particle editor will open.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Here are some of the basic attributes of a particle emitter. Its possible to control these attributes using scripts as well.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Particle Count - Maximum number of particles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Texture - Particle emitter have a texture attached to them this texture to them.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Direction - If set backwards the particle starts at its endind position.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Particle Rate - How many particles to emitt relative to the age of a particle.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Emitter Type - Shape of the emitter (Box, Circle or Sphere).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Max Age - Age of the particles created.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Position - Position of the particle on creation relative to the emitter.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "Velocity - Velocity of the particle on creation.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Acceleration - Acceleration of the particle.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "Rotation - Rotation of the particle along its lifespan.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "Color - Color of the particle along its lifespan.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, "Example");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "In the demo bellow we can see a particle emitter object in action.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](59, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ParticlesPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'particles-page',
                templateUrl: './particles.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "3Yih":
/*!***********************************************************!*\
  !*** ./src/page/learn/basics/raycaster/raycaster.page.ts ***!
  \***********************************************************/
/*! exports provided: RaycasterPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RaycasterPage", function() { return RaycasterPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class RaycasterPage {
}
RaycasterPage.ɵfac = function RaycasterPage_Factory(t) { return new (t || RaycasterPage)(); };
RaycasterPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RaycasterPage, selectors: [["raycaster-page"]], decls: 52, vars: 12, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/raycaster/raycasting.png", 1, "img-normal"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/raycaster/raycaster.nsp"]], template: function RaycasterPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Raycaster");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "A raycaster (or raypicking) is used to interact with 3D objects from the camera point of view. The raycaster achieves this by casting a line that follows the camera frustum checking for collisions with 3D meshes along the way.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "In nunuStudio every scene has a raycaster by default using the first camera to render. The raycaster attached to the scene is updated everyframe with the mouse coordinates.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "The code bellow can be used to test the raycaster object, we start by getting the red and blue materials from the program. On the update method we use the raycaster intersectObjects method to check if the mouse is on top of some object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "After we get the list of intersected objectes we loop though them and change their material depending on which mouse button is currently pressed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "The intersectObjects method returns a list of intersection objects, each intersection object has the following attributes. To raycast a single object is also possible to use the intersectObject method that only returns a single intersection object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "distance \u2013 distance between the origin of the ray and the intersection");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "point \u2013 point of intersection, in world coordinates");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "face \u2013 intersected face");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "faceIndex \u2013 index of the intersected face");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "indices \u2013 indices of vertices comprising the intersected face");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "object \u2013 the intersected object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "uv - U,V coordinates at point of intersection");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "Intersections are sorted by distance, the first object in the intesection list is always the one closer to the camera. If everything worked as expected you should have something similar to the demo bellow. Use the left mouse button to paint the cubes blue and the right mouse button to paint them red.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "A simpler way to use the raycaster is to declare a onMouseOver(intersects) method in the script. This method is automatically called when the mouse is over one of the children of that script.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var red, blue;\n\nfunction initialize()\n", "{", "\n\tred = program.getMaterialByName(\"red\");\n\tblue = program.getMaterialByName(\"blue\");\n", "}", "\n\nfunction update()\n", "{", "\n\t//Check interseted objects\n\tvar intersects = scene.raycaster.intersectObjects(scene.children);\n\n\t//Intersections list contains object, point of intersection, distance, uv and face\n\tfor(var i = 0; i < intersects.length; i++)\n\t", "{", "\n\t\tif(Mouse.buttonPressed(Mouse.LEFT))\n\t\t", "{", "\n\t\t\tintersects[i].object.material = red;\n\t\t", "}", "\n\t\telse if(Mouse.buttonPressed(Mouse.RIGHT))\n\t\t", "{", "\n\t\t\tintersects[i].object.material = blue;\n\t\t", "}", "\n\t", "}", "\n", "}", "\n"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("function onMouseOver(intersects)\n", "{", "\n\tconsole.log(intersects);\n", "}", "\n");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](RaycasterPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'raycaster-page',
                templateUrl: './raycaster.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "41eV":
/*!*****************************************************!*\
  !*** ./src/page/learn/basics/basics/basics.page.ts ***!
  \*****************************************************/
/*! exports provided: BasicsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasicsPage", function() { return BasicsPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class BasicsPage {
}
BasicsPage.ɵfac = function BasicsPage_Factory(t) { return new (t || BasicsPage)(); };
BasicsPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: BasicsPage, selectors: [["basics-page"]], decls: 81, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/basics/layout.png", 1, "img-big"], ["src", "assets/learn/basics/basics/tools.png", 1, "img-small"], ["src", "assets/learn/basics/basics/add.png", 1, "img-big"], ["src", "assets/learn/basics/basics/panel.png", 1, "img-small"], ["src", "assets/learn/basics/basics/resources.png", 1, "img-normal"]], template: function BasicsPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Editor basics");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Editor UI Layout");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "The nunuStudio editor is where nunu applications are developed it provides tools for creating and editing objects inside the 3D world. If you have ever worked with another similar frameworks (unity, playcanvas, godot, etc) or with 3D modeling software (blender, maya, cinema4d, etc) some of the concepts bellow might be already familiar to you.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Objects are organized in a tree structure (visible on the red area bellow), each object has childrens, that inherit the parent object position, scale and rotation. If a parent object is moved the children object is moved with it.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Objects can be selected on the object explorer with mouse left click, when a object is selected the object panel (in blue), is filled with data regarding that object. In the object panel its possible to manually change every attribute of an object (position, name, color, etc).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "The left side of the window is used to choose tools and add objects to the scene, tools are used to change objects attributes using the mouse, the following tools are available");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Selection tool, selects objects with mouse left click, objects can also be selected by double clicking on then (even if the selection tool is not active)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Move tool, used to move objects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Resize tool, used to resize objects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Rotate tool, used to rotate objects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Bellow the tool selection, there is the object add zone, where its possible to select and add objects to the scene currently selected on the object explorer. When dragging the mouse over each option a new box appears showing objects for each category available.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "The resource explorer zone (in green), is used to manage all available resources (images, videos, fonts, etc), import new resources into the project (clicking on the import menu or simply by dragging them into the resource explorer) or even export resources from the project to the host system.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Navigating inside the scene");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "The mouse is used to move the camera inside the scene editor. There are two modes of navigation available, by default the Free navigation mode is enabled.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "To rotate the camera press the mouse left button and move the mouse around (the camera moves similarly to how a camera moves in a FPS game).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "To move the camera press the mouse right button and move the mouse");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "To move vertically press the mouse middle button and move the mouse up and down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "To approach the camera use the mouse scrolling wheel, or pinch with your fingers if you are using a trackpad.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Adding a object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "To add your first object to the scene (lets use as example a sphere) move the mouse to the 5th icon in left side bar, and select the sphere icon using the mouse left button.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Now select the added object with the selection tool and after that choose the move tool and try to move the added object aroud.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](60, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Editing objects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "After adding an object to the editor we can change its attributes, all objects in nunuStudio have a name, position, rotation and scale.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, "To select an object you can select the Selection tool in the right side bar and click on top of the object in the scene editor area, alternatively you can also click on the object in the object explorer.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "When an object is selected, on the bottom left of there is a list of attributes that can be changed. Different types of object will have different attributes.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](69, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Resources");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Objects can have resources attached to them, resources can be images, video, textures, animations, etc. On the bottom of the screen we have the resource explorer than can be used to manage resources in our project.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](75, "Also on the resource explorer there is a menu to create and import external resources into the project. Resources can also be imported from external sources during runtime, as we will see later on next tutorials.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](76, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, "Runnning the program");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](80, "To test the program press the run button on the top bar, or press the F5 key, to stop it press the stop button or press the F5 again.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](BasicsPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'basics-page',
                templateUrl: './basics.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "4JuM":
/*!************************************************************************!*\
  !*** ./src/page/learn/integration/communication/communication.page.ts ***!
  \************************************************************************/
/*! exports provided: CommunicationPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommunicationPage", function() { return CommunicationPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class CommunicationPage {
}
CommunicationPage.ɵfac = function CommunicationPage_Factory(t) { return new (t || CommunicationPage)(); };
CommunicationPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CommunicationPage, selectors: [["communication-page"]], decls: 35, vars: 10, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/integration/communication/scheme.png", 1, "img-big"], [1, "hljs", "javascript"]], template: function CommunicationPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Communication");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will learn how to communicate with nunu applications embedded inside a webpage using messages and how to use DOM elements to control app content.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "To communicate with the host webpage nunuStudio uses a message model system, where the host can send messages to the nunuStudio app and vice-versa, the messages are received using callback functions. To explore more about communication check the App API documentation.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Message communication");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "To comunicate with the running application a message communication model is used. The app or the page can send messages to each other that will be catched by callbacks used to process the information sent between them.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Its also possible to communicate between apps running on the same page, to achieve this we can pass the app objects from the page to the apps.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Page to app");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "To send a message from the webpage to the nunuStudio application running the use the app.sendData(data) method. Data can be anything, assuming that the nunuApp is on the same JS context as the sender its possible send even object references.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "To receive these messages inside the app we need to create a onAppData callback and to send data we use the sendDataApp function stored in the program object. The code bellow is a simple example when the nunuStudio app receives data is shows the data on the text object, and every time the key P is pressed the nunuStudio app send a test message to the host webpage.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "App to page");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Before sending data from the nunu app to the webpage we need to define a onMessageReceive callback to process received messages. This callback can be defined as shown bellow, every time a message is send from the nunuStudio app to the webpage this function will be called.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("var text, counter;\nfunction initialize()\n", "{", "\n\ttext = scene.getObjectByName(\"text\");\n\tcounter = 0;\n", "}", "\n\nfunction update()\n", "{", "\n\tif(Keyboard.keyJustPressed(Keyboard.P))\n\t", "{", "\n\t\tprogram.sendDataApp(\"test\" + counter);\n\t", "}", "\n", "}", "\n\nfunction onAppData(data)\n", "{", "\n\ttext.setText(data);\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("//Send data to app\napp.sendData(\"test text\");\n\n//Callback to receive data sent from the app\napp.setOnDataReceived(function(data)\n", "{", "\n\tconsole.log(\"Received message from nunuStudio app\", data);\n", "}", ");");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CommunicationPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'communication-page',
                templateUrl: './communication.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "5IiC":
/*!*******************************************************!*\
  !*** ./src/page/learn/basics/terrain/terrain.page.ts ***!
  \*******************************************************/
/*! exports provided: TerrainPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TerrainPage", function() { return TerrainPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class TerrainPage {
}
TerrainPage.ɵfac = function TerrainPage_Factory(t) { return new (t || TerrainPage)(); };
TerrainPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TerrainPage, selectors: [["terrain-page"]], decls: 28, vars: 4, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://github.com/IceCreamYou/THREE.Terrain"], [1, "hljs", "javascript"], ["src", "assets/learn/basics/terrain/notexture.png", 1, "img-normal"], ["fname", "assets/learn/basics/terrain/terrain.nsp"]], template: function TerrainPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Terrain");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Since nunuStudio is built on top of three.js it is possible to use libraries that were designed to work with three. Most of base nunuStudio objects (e.g. Scene, Lights, Meshes etc) are directly based off three.js objects.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "But some parts of the library were rewritten/override and from time to time you may encounter situations where external libraries made for three.js are not compatible with nunuStudio (e.g Post-processing, Renderers etc).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "In this tutorial we will build a simple program using the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "THREE.Terrain");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " library for procedurely generated terrain mesh.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "It is important to understand that nunuStudio has its own resource management solution, but some resource types are based off three.js types, you should use the Material, Texture, Image, etc types available in nunuStudio. These should work for all external libraries (unless these libraries need a specific variant, in this scenario you should use the library specific types programatically).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "To import external libraries into your project drag the JS file to the resource explorer then import them into your script using the import('library.js'); method after importing the file the library can be used normally.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Now that we got the library working we can create proper materials and textures to be attached to the library.These resource can be obtained using their name in the script object. Check previous guides for more details on the resource system and how to use them inside of scripts. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "app-viewer", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("include(\"THREE.Terrain.min.js\");\n\nfunction initialize()\n", "{", "\nvar terrain = THREE.Terrain(", "{", "\n\tsteps: 1,\n\tuseBufferGeometry: false,\n\teasing: THREE.Terrain.Linear,\n\tscattering: \"SimplexLayers\"\n", "}", ");\nscene.add(terrain);\n", "}", "\n");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TerrainPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'terrain-page',
                templateUrl: './terrain.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "BKks":
/*!***********************!*\
  !*** ./src/global.ts ***!
  \***********************/
/*! exports provided: Global */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Global", function() { return Global; });
class Global {
    static openEditor(fname) {
        window.open(fname ? Global.editor + '?nsp=' + fname : Global.editor);
    }
}
Global.editor = 'https://www.nunustudio.org/build/editor/index.html';


/***/ }),

/***/ "HrDq":
/*!*************************!*\
  !*** ./src/app.page.ts ***!
  \*************************/
/*! exports provided: AppPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppPage", function() { return AppPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class AppPage {
}
AppPage.ɵfac = function AppPage_Factory(t) { return new (t || AppPage)(); };
AppPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppPage, selectors: [["app-page"]], decls: 1, vars: 0, template: function AppPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-page',
                template: '<router-outlet></router-outlet>'
            }]
    }], null, null); })();


/***/ }),

/***/ "KMvE":
/*!*******************************!*\
  !*** ./src/page/menu.page.ts ***!
  \*******************************/
/*! exports provided: MenuPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuPage", function() { return MenuPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");




function MenuPage_li_8_a_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", option_r1.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](option_r1.label);
} }
function MenuPage_li_8_a_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("href", option_r1.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](option_r1.label);
} }
function MenuPage_li_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "li", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, MenuPage_li_8_a_1_Template, 2, 2, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, MenuPage_li_8_a_2_Template, 2, 2, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", option_r1.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", option_r1.url);
} }
class MenuPage {
    constructor() {
        this.options = [
            {
                label: 'Home',
                route: 'home',
                url: undefined
            },
            {
                label: 'Learn',
                route: 'learn',
                url: undefined
            },
            {
                label: 'Documentation',
                route: undefined,
                url: 'docs'
            },
            {
                label: 'Download',
                route: 'download',
                url: undefined
            },
            {
                label: 'Github',
                route: undefined,
                url: 'https://www.github.com/tentone/nunuStudio'
            },
        ];
    }
}
MenuPage.ɵfac = function MenuPage_Factory(t) { return new (t || MenuPage)(); };
MenuPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MenuPage, selectors: [["menu-page"]], decls: 16, vars: 1, consts: [[1, "navbar", "navbar-fixed-top", "navbar-expand-lg", "navbar-dark", "bg-dark"], [1, "container"], ["routerLink", "/", 1, "navbar-brand"], ["src", "assets/logo.png", "width", "230", "alt", "Logo"], ["type", "button", "data-toggle", "collapse", "data-target", "#navbarSupportedContent", "aria-controls", "navbarSupportedContent", "aria-expanded", "true", "aria-label", "Toggle navigation", 1, "navbar-toggler"], [1, "navbar-toggler-icon"], ["id", "navbarSupportedContent", 1, "collapse", "navbar-collapse"], [1, "navbar-nav", "mr-auto", "text-right"], ["class", "nav-item", 4, "ngFor", "ngForOf"], [2, "background", "var(--dark)", "color", "var(--light)", "padding-bottom", "10px", "padding-top", "20px"], [1, "container", "text-right"], ["src", "assets/logo.png", 2, "height", "28px"], [1, "nav-item"], ["class", "nav-link", 3, "routerLink", 4, "ngIf"], ["class", "nav-link", 3, "href", 4, "ngIf"], [1, "nav-link", 3, "routerLink"], [1, "nav-link", 3, "href"]], template: function MenuPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "ul", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, MenuPage_li_8_Template, 3, 2, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "small");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Distributed under MIT license, ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.options);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MenuPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'menu-page',
                templateUrl: './menu.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "LbC5":
/*!******************************************!*\
  !*** ./src/page/example/example.page.ts ***!
  \******************************************/
/*! exports provided: ExamplePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExamplePage", function() { return ExamplePage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");



const _c0 = ["canvas"];
const _c1 = ["bar"];
function ExamplePage_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ExamplePage_div_3_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r4.app.toggleVR(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ExamplePage_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ExamplePage_div_4_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r6.app.toggleAR(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class ExamplePage {
    ngOnInit() {
        try {
            const parameters = location.search.substring(1).split("&");
            if (parameters.length > 0) {
                let entry = unescape(parameters[0].split("=")[1]).replace(new RegExp("\"", "g"), "");
                // @ts-ignore
                this.app = new Nunu.App(this.canvas.nativeElement);
                this.app.loadRunProgram(entry, undefined, (progress, event) => {
                    this.bar.nativeElement.style.width = progress + "%";
                });
            }
        }
        catch (e) {
            alert("Error loading the application, check the file path.");
        }
    }
    ngAfterViewChecked() {
        this.app.resize();
    }
    ngOnDestroy() {
        this.app.exit();
    }
    toggleVR() {
        if (this.app.vrAvailable()) {
            this.app.toggleVR();
        }
    }
    toggleFullscreen() {
        this.app.toggleFullscreen();
    }
}
ExamplePage.ɵfac = function ExamplePage_Factory(t) { return new (t || ExamplePage)(); };
ExamplePage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ExamplePage, selectors: [["example-page"]], viewQuery: function ExamplePage_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c1, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.bar = _t.first);
    } }, decls: 11, vars: 2, consts: [["oncontextmenu", "return false;"], [2, "visibility", "hidden", "position", "absolute", "z-index", "10000", "right", "30px", "bottom", "30px", 3, "click"], ["src", "assets/icons/fullscreen.png", "onmouseenter", "this.style.opacity = 1.0;", "onmouseleave", "this.style.opacity=0.4;", 2, "position", "absolute", "cursor", "pointer", "opacity", "0.4", "width", "25px", "height", "25px"], ["style", "visibility:hidden; position:absolute; z-index:10000; right:70px; bottom:30px", 3, "click", 4, "ngIf"], ["style", "visibility:hidden; position:absolute; z-index:10000; right:110px; bottom:30px", 3, "click", 4, "ngIf"], [2, "position", "absolute", "width", "50%", "left", "25%", "top", "35%"], [2, "position", "absolute", "width", "100%", "height", "7%", "left", "0%", "top", "120%", "border-style", "solid", "border-color", "#FFFFFF", "border-width", "2px"], ["bar", ""], ["id", "bar", 2, "position", "absolute", "width", "0%", "height", "100%", "left", "0%", "top", "0%", "background-color", "#FFFFFF"], [2, "position", "absolute", "width", "100%", "height", "100%", "top", "0px", "left", "0px"], ["canvas", ""], [2, "visibility", "hidden", "position", "absolute", "z-index", "10000", "right", "70px", "bottom", "30px", 3, "click"], ["src", "assets/icons/vr.png", "onmouseenter", "this.style.opacity = 1.0;", "onmouseleave", "this.style.opacity=0.4;", 2, "position", "absolute", "cursor", "pointer", "opacity", "0.4", "width", "25px", "height", "25px"], [2, "visibility", "hidden", "position", "absolute", "z-index", "10000", "right", "110px", "bottom", "30px", 3, "click"], ["src", "assets/icons/ar.png", "onmouseenter", "this.style.opacity = 1.0;", "onmouseleave", "this.style.opacity=0.4;", 2, "position", "absolute", "cursor", "pointer", "opacity", "0.4", "width", "25px", "height", "25px"]], template: function ExamplePage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ExamplePage_Template_div_click_1_listener() { return ctx.app.toggleFullscreen(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, ExamplePage_div_3_Template, 2, 0, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, ExamplePage_div_4_Template, 2, 0, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "canvas", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.app.vrAvailable());
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.app.arAvailable());
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ExamplePage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'example-page',
                templateUrl: './example.page.html'
            }]
    }], null, { canvas: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['canvas', { static: true }]
        }], bar: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['bar', { static: true }]
        }] }); })();


/***/ }),

/***/ "LlGS":
/*!*********************************************!*\
  !*** ./src/page/learn/basics/vr/vr.page.ts ***!
  \*********************************************/
/*! exports provided: VrPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VrPage", function() { return VrPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class VrPage {
}
VrPage.ɵfac = function VrPage_Factory(t) { return new (t || VrPage)(); };
VrPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: VrPage, selectors: [["vr-page"]], decls: 38, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://webvr.info/", 1, "underline"], ["src", "assets/learn/basics/vr/editor.jpg", 2, "margin-left", "20%", "width", "60%"], ["fname", "assets/learn/basics/vr/vr.nsp"], [1, "hljs", "javascript"]], template: function VrPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Virtual Reality");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "WebVR");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "WebVR is an open standard that makes it possible to experience VR in your browser. The goal is to make it easier for everyone to get into VR experiences, no matter what device you have.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "You need two things to experience WebVR a headset and a compatible browser. The easiest way to get started is with a basic headset like Google Cardboard. Just drop your phone in and you\u2019re ready to go. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "For more information about WebVR go to ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "webvr.info");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " webpage.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Creating a VR project");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "To enable vr support on your project, click the program object on the object explorer, and select enable vr in the program panel as shown on the image bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Enabling webVR will allow for the user to request vr rendering when the device has webvr support, when in VR the camera in use will be repositioned automatically to match the HMD position and rotation in the real world. This means that the original camera position is lost when the vr mode is enabled.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "To prevent losing the camera position its recomended for vr applications to place the camera inside a container that can be used as reference and its able to keep it position attributed when rendering in vr mode.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "If everything works as expected you should see something similar to the example running bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Using VR Controllers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "It's possible to acesss VR controllers from the renderer object directly attached to the program in the script objects. The controller object is automatically updated to match the physics controller position its coordinates can be used for interaction with objects in the scene. Its a regular Object3D object where other objects (e.g. Physics colliders, meshes) can be attached as children.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "var controller = renderer.xr.getController(0);\ncontroller.addEventListener(\"selectstart\", (...));\ncontroller.addEventListener(\"selectend\", (...));\nscene.add(controller);");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](VrPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'vr-page',
                templateUrl: './vr.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "NJxU":
/*!***************************************************!*\
  !*** ./src/page/learn/basics/video/video.page.ts ***!
  \***************************************************/
/*! exports provided: VideoPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoPage", function() { return VideoPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class VideoPage {
}
VideoPage.ɵfac = function VideoPage_Factory(t) { return new (t || VideoPage)(); };
VideoPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: VideoPage, selectors: [["video-page"]], decls: 22, vars: 2, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/video/video.nsp"]], template: function VideoPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Video");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will explore how to import and use video files in nunuStudio. Video files can be used as textures for objects.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "To load a new video file select Texture and then Video texture, this will create two thing first a video resource that contains the video file select, and a Video texture that uses the video resource to display the file. Alternatively you can drag and drop a video file to the explorer or directly to an object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "External files");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "It is possible to load external files from their URL. When using external files if they are a diferent domain don't forget to make sure that the server has the appropiate CORS configuration. The code bellow demonstrates how to create a VideoTexture from an external URL and to use it as a texture for the default material.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "You can choose between a Video resource and a VideoStream resource, the main difference is that Video preloads the whole video files into memory and VideoStream loads the video as it goes.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "app-viewer", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", "{", "\nvar texture = new VideoTexture(new VideoStream(\"sample.mp4\"));\nvar material = program.getMaterialByName(\"default\");\nmaterial.emissiveMap = texture;\nmaterial.emissive.setHex(0xFFFFFF);\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](VideoPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'video-page',
                templateUrl: './video.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "OQvh":
/*!********************************************!*\
  !*** ./src/page/download/download.page.ts ***!
  \********************************************/
/*! exports provided: DownloadPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadPage", function() { return DownloadPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class DownloadPage {
}
DownloadPage.ɵfac = function DownloadPage_Factory(t) { return new (t || DownloadPage)(); };
DownloadPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DownloadPage, selectors: [["download-page"]], decls: 71, vars: 0, consts: [[1, "container", 2, "padding-bottom", "30px", "padding-top", "30px"], [1, "row"], [2, "width", "100%"], ["src", "assets/web.png", 2, "position", "relative", "left", "25%", "width", "50%"], [2, "position", "relative", "width", "50%", "left", "25%"], ["href", "https://www.nunustudio.org/build/editor/index.html", 1, "btn", "btn-dark", 2, "position", "relative", "width", "100%"], [1, "col-sm-4"], ["src", "assets/os/windows.png", 2, "position", "relative", "left", "25%", "width", "50%"], ["href", "https://github.com/tentone/nunuStudio/releases/download/v0.9.6/nunuStudio_0.9.6_win_x64.zip", 1, "btn", "btn-dark", 2, "position", "relative", "width", "100%"], ["src", "assets/os/linux.png", 2, "position", "relative", "left", "25%", "width", "50%"], ["href", "https://github.com/tentone/nunuStudio/releases/download/v0.9.6/nunuStudio_0.9.6_linux_x64.7z", 1, "btn", "btn-dark", 2, "position", "relative", "width", "100%"], ["src", "assets/os/osx.png", 2, "position", "relative", "left", "25%", "width", "50%"], ["href", "https://github.com/tentone/nunuStudio/releases/download/v0.9.6/nunuStudio_0.9.6_mac_x64.7z", 1, "btn", "btn-dark", 2, "position", "relative", "width", "100%"], [2, "background", "var(--dark)", "color", "var(--light)", "padding-bottom", "30px", "padding-top", "30px"], [1, "container"], [2, "padding-bottom", "30px", "padding-top", "30px"], ["href", "https://github.com/tentone/nunuStudio/releases/", 1, "btn", "btn-dark", 2, "position", "relative", "width", "100%"]], template: function DownloadPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Web Version");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "There is a web version of nunuStudio available, it was tested with Google Chrome, Firefox and Microsoft Edge, it is not compatible with mobile browsers.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "The web version of nunuStudio its always updated and has all the features present in the desktop version, but there are some limitations regarding file access in the web environment.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "This version is always updated with every experimental feature, if you find anything wrong please report in the issue page on GitHub.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Web Version");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Windows");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Compatible with Windows Vista, 7, 8 and 10.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Windows");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Linux");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Tested with ubuntu based distributions, compatible with x86 based machines.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Linux");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "MacOS");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "MacOS is not tested regularly, looking for developers/testers.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "img", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "MacOS");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Still under development");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "nunuStudio is still under development, all suggestions are welcome, use the Github issues page to leave your suggestions.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "The sourcecode is available on Github. Everybody is welcome to help and contribute to the project.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Bug reports and features request can be done in the Issues section on GitHub.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Old Releases");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Old versions of nunuStudio can be found in the releases page in Github alongside with their source code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "Please avoid using these unless strictly required for some special reason.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](70, "Old releases");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DownloadPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'download-page',
                templateUrl: './download.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "S8hu":
/*!***********************!*\
  !*** ./src/module.ts ***!
  \***********************/
/*! exports provided: Module */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Module", function() { return Module; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./router */ "X4a2");
/* harmony import */ var _app_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.page */ "HrDq");
/* harmony import */ var _page_home_home_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./page/home/home.page */ "qqey");
/* harmony import */ var _page_download_download_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page/download/download.page */ "OQvh");
/* harmony import */ var _page_menu_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page/menu.page */ "KMvE");
/* harmony import */ var _page_learn_learn_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page/learn/learn.page */ "zFIy");
/* harmony import */ var _page_learn_learn_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./page/learn/learn.module */ "tx3l");
/* harmony import */ var _page_example_example_page__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./page/example/example.page */ "LbC5");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/components.module */ "xOzl");












class Module {
}
Module.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: Module, bootstrap: [_app_page__WEBPACK_IMPORTED_MODULE_3__["AppPage"]] });
Module.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function Module_Factory(t) { return new (t || Module)(); }, imports: [[
            _components_components_module__WEBPACK_IMPORTED_MODULE_10__["ComponentsModule"],
            _page_learn_learn_module__WEBPACK_IMPORTED_MODULE_8__["LearnModule"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _router__WEBPACK_IMPORTED_MODULE_2__["Router"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](Module, { declarations: [_app_page__WEBPACK_IMPORTED_MODULE_3__["AppPage"],
        _page_menu_page__WEBPACK_IMPORTED_MODULE_6__["MenuPage"],
        _page_home_home_page__WEBPACK_IMPORTED_MODULE_4__["HomePage"],
        _page_download_download_page__WEBPACK_IMPORTED_MODULE_5__["DownloadPage"],
        _page_example_example_page__WEBPACK_IMPORTED_MODULE_9__["ExamplePage"],
        _page_learn_learn_page__WEBPACK_IMPORTED_MODULE_7__["LearnPage"]], imports: [_components_components_module__WEBPACK_IMPORTED_MODULE_10__["ComponentsModule"],
        _page_learn_learn_module__WEBPACK_IMPORTED_MODULE_8__["LearnModule"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _router__WEBPACK_IMPORTED_MODULE_2__["Router"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Module, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_page__WEBPACK_IMPORTED_MODULE_3__["AppPage"],
                    _page_menu_page__WEBPACK_IMPORTED_MODULE_6__["MenuPage"],
                    _page_home_home_page__WEBPACK_IMPORTED_MODULE_4__["HomePage"],
                    _page_download_download_page__WEBPACK_IMPORTED_MODULE_5__["DownloadPage"],
                    _page_example_example_page__WEBPACK_IMPORTED_MODULE_9__["ExamplePage"],
                    _page_learn_learn_page__WEBPACK_IMPORTED_MODULE_7__["LearnPage"]
                ],
                imports: [
                    _components_components_module__WEBPACK_IMPORTED_MODULE_10__["ComponentsModule"],
                    _page_learn_learn_module__WEBPACK_IMPORTED_MODULE_8__["LearnModule"],
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _router__WEBPACK_IMPORTED_MODULE_2__["Router"]
                ],
                bootstrap: [_app_page__WEBPACK_IMPORTED_MODULE_3__["AppPage"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "UGhw":
/*!***************************************************************!*\
  !*** ./src/page/learn/tutorial/networking/networking.page.ts ***!
  \***************************************************************/
/*! exports provided: NetworkingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkingPage", function() { return NetworkingPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class NetworkingPage {
}
NetworkingPage.ɵfac = function NetworkingPage_Factory(t) { return new (t || NetworkingPage)(); };
NetworkingPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NetworkingPage, selectors: [["networking-page"]], decls: 108, vars: 110, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/tutorial/networking/chat.png", 1, "img-normal"], [1, "hljs", "javascript"], ["src", "assets/learn/tutorial/networking/level.jpg", 1, "img-normal"], ["src", "assets/learn/tutorial/networking/player.jpg", 1, "img-small"], ["src", "assets/learn/tutorial/networking/connected.png", 1, "img-big"], ["href", "assets/learn/tutorial/networking/files.zip", 1, "underline"], ["src", "assets/learn/tutorial/networking/game.jpg", 1, "img-big"]], template: function NetworkingPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Mutiplayer Shooter");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will experimet with networking using WebSockets and we will create a simple networked multiplayer game. For this tutorial node.js will be used to develop the server aplication. I have decided to use node.js simply because it uses the same language (javascript) used inside nunuStudio, but you can choose another framework/language to implement the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Lets start by covering the basics about WebSockets, what they are and how can we use them to create a web based multiplayer game, websockets are an technology that makes it possible to open an interactive communication session between the user's browser and a server, using them its possible to send messages to a server and receive event-driven responses without having to poll the server for a reply.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "A single websocket server can be used to interconnect multiple clients, the server works as an intermediary in data exchange, lets take a message chat as an example, each clients connects to the server and tells the server who he is, when sending a message the client tells the server for who the message is destinated and the server redirects that message to its destination, that is also is a client connected to the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Lets start by installing the required nodejs dependencies for this tutorial, we will only need the websocket dependency use the command bellow to install it using your computer terminal/command.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "npm -g install websocket");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "To set up our server code, we will start by importing the required node modules, after that a http server instance is created and configured with the correct port (we can use any port we want to), after that we create a WebSocketServer that will allow us to send and receive messages to the clients connected to the server. During the tutorial for convenience we will only use JSON messages but we can send any type of data.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "The code bellow will be used as a base for our server, it takes care of all the steps necessary to establish connection with a client, from now on we will only focus on messages exchange. For the tutorial we will be using the port 1111 and localhost for communication make sure that you change this to the correct IP and configure port access if you are using an external server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "The code bellow is the client part that we will write inside nunuStudio, as we can see the code to connect to a WebSocket is really simple and actually similar to the one used to create the server itself, when starting the client part in nunuStudio you should be able to see a \"Connected to server\" message in the console.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Now lets send a simple message to the server and create a response to the message we sent, we will include in every message sent a type value to allow the server to differentiate message and a uuid to allow the server to distinguish clients. To send a message we will use the WebSocket send method, all of our message will be JSON encoded so we have to call JSON.stringify on our client to transform our objects to text format and JSON.parse to recreate the object on the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "The code bellow is the the client side.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "The code bellow is the server side.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "If everything is working as expected we should now be able to exchange messages between the client and the server, we can use the serialization method provided by nunuStudio to send and update states of objects in our scene between multiple clients.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "Let\u2019s now start creating our level, let\u2019s start with a couple of walls preferably in a defined position in my case I have placed my walls exactly at position 20 on the X axis and 12 on the Z axis, knowing the wall position will be helpful later for manual collision checking.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](48, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "After creating the level lets now create our player, i started by just using a cube, and programmed the movement of the player, the player will move using WASD keys and will always be rotated in the mouse direction, when the mouse button is pressed the player will shoot a bullet.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "To make the player always look at the mouse position we need to get world coordinates for where our mouse is pointing, for that we can use the ray caster object available in our scene and use it to check mouse intersection with the ground object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "The code bellow implements all the player initialization and movement. After the player status is updated an \"update\" message will be sent to the server, when the server receives this message it will redistribute it to all other clients so that they can update the remote player instance status.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "If you want to you can customize your player to look a bit better, i added a couple eyes to mine and a stick that will act as its weapon.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](60, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Now let\u2019s synchronize the position between multiple clients, let\u2019s create a simple data structure to store Players in our server and in our clients. The code bellow implements the base data structures required in the server, the server will store Players and Connections in a list and redistribute the player status to all other players in the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "When the player connects to the server it needs to send a \"connected\" message with initial data about the player like its UUID and the color used to represent it in the world. When the server receives this message the player is added to the players and connections arrays. When the player updates its state the \"update\" message is send, this message contains the player actual position and rotation and when it disconnects or dies a \"disconnected\" message is sent.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "When the client receives an \"update\" message from the server (the server only redistributes these messages), the client needs to check if the player is already known if thats the case its position and rotation is updated, otherwise the player is created with the color and uuid indicated in the message, when a \"disconnected\" message is received the player indicated is destroyed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "The code bellow is the client part, with all code necessary to add, update and remove players from the game.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "The code bellow is the server part, for the server two arrays are maintaned one with connections and one with players.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "If everything is working as expected you should be able to connect multiple clients to the server and see them move around, to test with multiple clients you can export a web version of the project and open inside your browser of choice.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](82, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "We are almost finished, just need to add the bullets and we are ready for the bullets we will do something similar to the player movement but instead of having the bullet position being updated by the client who sent it each client will update the bullets position and check collision locally, this should allow to reduce the amount of data transferred trough the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, "The code bellow implements the bullet creation and update, all bullets are store in an array and updated every frame, when a player shoots a bullet a \"bullet\" message is sent to the server and redistributed to all clients. If the bullets hits the player the player dies and a \"disconnected\" message is sent to the server.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "In the server side the \"bullet\" message is only distributed to all connected clients.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](96, "The game is pretty much ready now, we just need to add some code to make sure that the clients sends a disconnected message when the user closes the window, this can be easily done by adding a dispose function to the script. The dispose message is called automatically when the application terminates.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](98, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](101, "If you were able to follow all the steps congratulations, the mechanism explain in this tutorial for message exchange using websockets can easily adapted for other type of applications and used outside of nunuStudio.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, "I hope this tutorial was helpful, you can donwload the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](105, "project files here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](106, ". Any question feel free to email me or open an issue in GitHub.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](107, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("var WebSocketServer = require(\"websocket\").server;\nvar http = require(\"http\");\n\nvar port = 1111;\n\nvar server = http.createServer();\nserver.listen(port);\n\nconsole.log(\"Server running at port \" + port);\n\nvar wsServer = new WebSocketServer(", "{", "httpServer: server", "}", ");\nwsServer.on(\"request\", function(request)\n", "{", "\nvar connection = request.accept(null, request.origin);\n\nconnection.on(\"message\", function(message)\n", "{", "\n\t//Message handling code here\n", "}", ");\n\nconnection.on(\"close\", function(connection)\n", "{", "\n\t//User disconnected code here\n", "}", ");\n", "}", ");");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var connection, connected = false;\n\nfunction initialize()\n", "{", "\nconnection = new WebSocket(\"ws://127.0.0.1:1337\");\n\nconnection.onopen = function()\n", "{", "\n\tconnected = true;\n\tconsole.log(\"Connected to server\");\n", "}", ";\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("uuid = THREE.Math.generateUUID();\n...\nconnection.onopen = function()\n", "{", "\nconsole.log(\"Connected to server\");\nconnection.send(JSON.stringify(\n", "{", "\n\ttype:\"connected\",\n\tuuid:uuid\n", "}", "));\n", "}", ";");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("connection.on(\"message\", function(message)\n", "{", "\nconsole.log(\"Message received\");\nvar data = JSON.parse(message.utf8Data);\n", "}", ");");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["function initialize()\n", "{", "\n//Player\nplayer = scene.getObjectByName(\"player\");\nplayer.material.color.setHex(Math.random() * 0xFFFFFF);\nplayer.uuid = THREE.Math.generateUUID();\nplayer.canFire = true;\nplayer.alive = true;\n\n//Ground\nground = scene.getObjectByName(\"ground\");\n\n//Clock\nclock = new Clock();\nclock.start();\n\n...\n", "}", "\n\nfunction update()\n", "{", "\nvar delta = clock.getDelta();\n\nif(connected)\n", "{", "\n\tif(player.alive)\n\t", "{", "\n\t\t//Move player\n\t\tvar speed = delta * 10;\n\t\tif(Keyboard.keyPressed(Keyboard.W)) player.position.z -= speed;\n\t\tif(Keyboard.keyPressed(Keyboard.S)) player.position.z += speed;\n\t\tif(Keyboard.keyPressed(Keyboard.A)) player.position.x -= speed;\n\t\tif(Keyboard.keyPressed(Keyboard.D)) player.position.x += speed;\n\n\t\t//Limit player movement\n\t\tif(player.position.x > 19) player.position.x = 19;\n\t\tif(player.position.x < -19) player.position.x = -19;\n\t\tif(player.position.z > 11) player.position.z = 11;\n\t\tif(player.position.z < -11) player.position.z = -11;\n\n\t\t//Mouse rotation\n\t\tvar intersect = scene.raycaster.intersectObject(ground);\n\t\tif(intersect.length > 0)\n\t\t", "{", "\n\t\t\tvar point = intersect[0].point;\n\t\t\tpoint.y = player.position.y;\n\t\t\tplayer.lookAt(point);\n\n\t\t\t//Fire bullet\n\t\t\tif(player.canFire && Mouse.buttonJustPressed(Mouse.LEFT))\n\t\t\t", "{", "\n\t\t\t\t//TODO Create bullet\n\n\t\t\t\tplayer.canFire = false;\n\t\t\t\tsetTimeout(function()\n\t\t\t\t", "{", "\n\t\t\t\t\tplayer.canFire = true;\n\t\t\t\t", "}", ", 500);\n\t\t\t", "}", "\n\t\t", "}", "\n\t", "}", "\n", "}", "\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var players = [], clients = [];\n\nfunction Player(uuid, color)\n", "{", "\nthis.uuid = uuid;\nthis.color = color;\nthis.position = null;\nthis.rotation = null;\n", "}", "\n\nfunction Client(uuid, connection)\n", "{", "\nthis.uuid = uuid;\nthis.connection = connection;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var players = [];\n\nfunction initialize()\n", "{", "\n...\n\nwebsocket.onopen = function()\n", "{", "\n\twebsocket.send(JSON.stringify(\n\t", "{", "\n\t\ttype: \"connected\",\n\t\tuuid: player.uuid,\n\t\tcolor: player.material.color.getHex()\n\t", "}", "));\n\t...\n", "}", ";\n\nwebsocket.onmessage = function(message)\n", "{", "\n\tvar data = JSON.parse(message.data);\n\n\tif(data.type === \"update\")\n\t", "{", "\n\t\tvar uuid = data.uuid;\n\n\t\tif(data.uuid !== player.uuid)\n\t\t", "{", "\n\t\t\tvar object = players[data.uuid];\n\n\t\t\tif(object === undefined)\n\t\t\t", "{", "\n\t\t\t\tvar material = new MeshPhongMaterial(", "{", "color: data.color", "}", ");\n\t\t\t\tvar object = player.clone();\n\t\t\t\tobject.material = material;\n\t\t\t\tobject.uuid = data.uuid;\n\t\t\t\tobject.color = data.color;\n\t\t\t\tscene.add(object);\n\t\t\t\tplayers[uuid] = object;\n\t\t\t", "}", "\n\n\t\t\tobject.position.fromArray(data.position);\n\t\t\tobject.rotation.fromArray(data.rotation);\n\t\t", "}", "\n\t", "}", "\n\telse if(data.type === \"disconnect\")\n\t", "{", "\n\t\tif(players[data.uuid] !== undefined)\n\t\t", "{", "\n\t\t\tplayers[data.uuid].destroy();\n\t\t\tdelete players[data.uuid];\n\t\t", "}", "\n\t", "}", "\n", "}", ";\n", "}", "\n\nfunction update()\n", "{", "\n...\n\nif(connected)\n", "{", "\n\t...\n\n\t//Update message\n\twebsocket.send(JSON.stringify(\n\t", "{", "\n\t\ttype: \"update\",\n\t\tuuid: player.uuid,\n\t\tposition: player.position.toArray(),\n\t\trotation: player.rotation.toArray()\n\t", "}", "));\n", "}", "\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["server.on(\"request\", function(request)\n", "{", "\nvar connection = request.accept(null, request.origin);\n\n//Message\nconnection.on(\"message\", function(message)\n", "{", "\n\tvar data = JSON.parse(message.utf8Data);\n\n\t//Connected\n\tif(data.type === \"connected\")\n\t", "{", "\n\t\tplayers.push(new Player(data.uuid, data.color));\n\t\tclients.push(new Client(data.uuid, connection));\n\n\t\tconsole.log(\"Player \" + data.uuid + \" connected\");\n\t", "}", "\n\t//Update\n\telse if(data.type === \"update\")\n\t", "{", "\n\t\tvar player = getPlayer(data.uuid);\n\n\t\tif(player !== null)\n\t\t", "{", "\n\t\t\tplayer.position = data.position;\n\t\t\tplayer.rotation = data.rotation;\n\t\t", "}", "\n\n\t\tfor(var i = 0; i < clients.length; i++)\n\t\t", "{", "\n\t\t\tclients[i].connection.sendUTF(message.utf8Data);\n\t\t", "}", "\n\t", "}", "\n\t//Disconnected\n\telse if(data.type === \"disconnect\")\n\t", "{", "\n\t\tremovePlayer(data.uuid);\n\n\t\tfor(var i = 0; i < clients.length; i++)\n\t\t", "{", "\n\t\t\tclients[i].connection.sendUTF(message.utf8Data);\n\t\t", "}", "\n\n\t\tconsole.log(\"Player \" + data.uuid + \" disconnected\");\n\t", "}", "\n", "}", ");\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["function update()\n", "{", "\n...\n\n", "{", "\n\t...\n\t", "{", "\n\t\t...\n\t\t//Mouse rotation\n\t\tvar intersect = scene.raycaster.intersectObject(ground);\n\t\tif(intersect.length > 0)\n\t\t", "{", "\n\t\t\tvar point = intersect[0].point;\n\t\t\tpoint.y = player.position.y;\n\t\t\tplayer.lookAt(point);\n\n\t\t\t//Fire bullet\n\t\t\tif(player.canFire && Mouse.buttonJustPressed(Mouse.LEFT))\n\t\t\t", "{", "\n\t\t\t\tvar bullet = new Mesh(bulletGeometry, bulletMaterial);\n\t\t\t\tbullet.owner = player.uuid;\n\t\t\t\tbullet.velocity = point;\n\t\t\t\tbullet.velocity.sub(player.position);\n\t\t\t\tbullet.velocity.normalize();\n\t\t\t\tbullet.velocity.multiplyScalar(20);\n\t\t\t\tbullet.position.copy(player.position);\n\t\t\t\tbullets.push(bullet);\n\t\t\t\tscene.add(bullet);\n\n\t\t\t\tplayer.canFire = false;\n\t\t\t\tsetTimeout(function()\n\t\t\t\t", "{", "\n\t\t\t\t\tplayer.canFire = true;\n\t\t\t\t", "}", ", 500);\n\n\t\t\t\twebsocket.send(JSON.stringify(\n\t\t\t\t", "{", "\n\t\t\t\t\ttype: \"bullet\",\n\t\t\t\t\tuuid: player.uuid,\n\t\t\t\t\tposition: bullet.position.toArray(),\n\t\t\t\t\tvelocity: bullet.velocity.toArray()\n\t\t\t\t", "}", "));\n\t\t\t", "}", "\n\t\t", "}", "\n\t", "}", "\n\n\t//Update bullets\n\tfor(var i = 0; i < bullets.length; i++)\n\t", "{", "\n\t\tvar bullet = bullets[i];\n\n\t\tbullet.position.x += bullet.velocity.x * delta;\n\t\tbullet.position.y += bullet.velocity.y * delta;\n\t\tbullet.position.z += bullet.velocity.z * delta;\n\n\t\t//Check bullet out of arena\n\t\tif(bullet.position.x > 20 || bullet.position.x < -20 || bullet.position.z > 12 || bullet.position.z < -12)\n\t\t", "{", "\n\t\t\tbullet.destroy();\n\t\t\tbullets.splice(i, 1);\n\t\t\tcontinue;\n\t\t", "}", "\n\n\t\t//Check collision with players\n\t\tif(bullet.owner !== player.uuid && bullet.position.distanceTo(player.position) < 0.8)\n\t\t", "{", "\n\t\t\tbullet.destroy();\n\t\t\tbullets.splice(i, 1);\n\n\t\t\tplayer.destroy();\n\t\t\tplayer.alive = false;\n\n\t\t\twebsocket.send(JSON.stringify(\n\t\t\t", "{", "\n\t\t\t\ttype: \"disconnect\",\n\t\t\t\tuuid: player.uuid\n\t\t\t", "}", "));\n\t\t\tbreak;\n\t\t", "}", "\n\t", "}", "\n\n\t...\n", "}", "\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("connection.on(\"message\", function(message)\n", "{", "\n...\nelse if(data.type === \"bullet\")\n", "{", "\n\tfor(var i = 0; i < clients.length; i++)\n\t", "{", "\n\t\tclients[i].connection.sendUTF(message.utf8Data);\n\t", "}", "\n\n\tconsole.log(\"Player \" + data.uuid + \" fired bullet!\");\n", "}", "\n...\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("function dispose()\n", "{", "\nwebsocket.send(JSON.stringify(\n", "{", "\n\ttype: \"disconnect\",\n\tuuid: player.uuid\n", "}", "));\n\nwebsocket.close();\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NetworkingPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'networking-page',
                templateUrl: './networking.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "UrOq":
/*!***************************************************!*\
  !*** ./src/page/learn/basics/audio/audio.page.ts ***!
  \***************************************************/
/*! exports provided: AudioPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioPage", function() { return AudioPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class AudioPage {
}
AudioPage.ɵfac = function AudioPage_Factory(t) { return new (t || AudioPage)(); };
AudioPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AudioPage, selectors: [["audio-page"]], decls: 111, vars: 10, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://webaudio.github.io/web-audio-api/"], [1, "table"], ["src", "assets/learn/basics/audio/select.jpg", 2, "width", "20%", "margin-left", "40%"], [1, "hljs", "javascript"], ["href", "audio.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/06_audio/audio.nsp", 1, "underline"], ["fname", "assets/learn/basics/audio/audio.nsp"]], template: function AudioPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Audio");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "nunuStudio uses WebAdio to provide a fully featured audio engine, with support for effects, positional audio, analysis tools etc. To use audio elements the host must support WebAudio since there is no fallback for hosts without this API available.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "More information about the WebAudio API can be found ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Audio file format support depends on the host, but the following table can be used as a reference.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "table", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Format");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Chorme");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Firefox");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Edge");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Safari");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "MP3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "FLAC");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "OGG");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "WAV");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](70, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](75, "WMA");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](83, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "Load Audio Files");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](87, "Its possible to load Audio files by selecting the import options in the asset explorer or by dragging audio files into the asset explorer directly.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "Creating a audio emitter");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "To create a new audio emitter simply select the desired type of emitter from the toolbar, or drag the audio file to the scene editor, this will create a normal audio emitter by default.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, "There are 2 types of audio emitters in nunuStudio, normal emitters that play 2D stereo audio, and positional audio emitters that simulate positional audio relative to the camera position to create a 3D audio effect.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](94, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](96, "Controlling a audio emitter");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, "Its possible to control a audio emitter using a script, the example bellow gets the audio emitter object, plays it on initialization and after 5 starts lowering its volume, after 10 seconds plays the audio again.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](99, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](101);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, "The example bellow shows how to control a positional audio object. When the mouse left button is pressed the sound starts playing, and when it is pressed again it stops. To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](105, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](106, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](108, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](109, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](110, "app-viewer", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](101);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var audio;\nvar time, clock;\n\nfunction initialize()\n", "{", "\naudio = scene.getObjectByName(\"test\");\n\nclock = new Clock();\nclock.start();\n\ntime = 0;\n", "}", "\n\nfunction update()\n", "{", "\ntime += clock.getDelta();\n\nif(time > 5)\n", "{", "\n\taudio.setVolume(audio.volume - 0.01);\n", "}", "\nif(audio.volume < 0.1)\n", "{", "\n\taudio.pause();\n", "}", "\n\nif(time > 10)\n", "{", "\n\taudio.setVolume(1.0);\n\taudio.play();\n", "}", "\n", "}", ""]);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AudioPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'audio-page',
                templateUrl: './audio.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "X4a2":
/*!***********************!*\
  !*** ./src/router.ts ***!
  \***********************/
/*! exports provided: Router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _page_home_home_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./page/home/home.page */ "qqey");
/* harmony import */ var _page_download_download_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page/download/download.page */ "OQvh");
/* harmony import */ var _page_menu_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./page/menu.page */ "KMvE");
/* harmony import */ var _page_learn_learn_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page/learn/learn.page */ "zFIy");
/* harmony import */ var _page_learn_learn_routes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page/learn/learn.routes */ "xoFZ");
/* harmony import */ var _page_example_example_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page/example/example.page */ "LbC5");










const routes = [
    {
        path: 'example',
        component: _page_example_example_page__WEBPACK_IMPORTED_MODULE_7__["ExamplePage"],
    },
    {
        path: '',
        component: _page_menu_page__WEBPACK_IMPORTED_MODULE_4__["MenuPage"],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: _page_home_home_page__WEBPACK_IMPORTED_MODULE_2__["HomePage"]
            },
            {
                path: 'download',
                component: _page_download_download_page__WEBPACK_IMPORTED_MODULE_3__["DownloadPage"]
            },
            {
                path: 'learn',
                component: _page_learn_learn_page__WEBPACK_IMPORTED_MODULE_5__["LearnPage"],
            }
            // @ts-ignore
        ].concat(_page_learn_learn_routes__WEBPACK_IMPORTED_MODULE_6__["LearnRoutes"])
    }
];
class Router {
}
Router.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: Router });
Router.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function Router_Factory(t) { return new (t || Router)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](Router, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](Router, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "aTom":
/*!*********************************************!*\
  !*** ./src/page/learn/basics/ar/ar.page.ts ***!
  \*********************************************/
/*! exports provided: ArPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArPage", function() { return ArPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class ArPage {
}
ArPage.ɵfac = function ArPage_Factory(t) { return new (t || ArPage)(); };
ArPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ArPage, selectors: [["ar-page"]], decls: 12, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"]], template: function ArPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "AR.js");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will learn how to use ar.js and nunuStudio to create augmented reality experiences directly in the browser.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Under work!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ArPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ar-page',
                templateUrl: './ar.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "brmB":
/*!****************************************************************!*\
  !*** ./src/page/learn/integration/embedding/embedding.page.ts ***!
  \****************************************************************/
/*! exports provided: EmbeddingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmbeddingPage", function() { return EmbeddingPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class EmbeddingPage {
}
EmbeddingPage.ɵfac = function EmbeddingPage_Factory(t) { return new (t || EmbeddingPage)(); };
EmbeddingPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: EmbeddingPage, selectors: [["embedding-page"]], decls: 70, vars: 18, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], [1, "hljs", "xml"], [1, "hljs", "javascript"]], template: function EmbeddingPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Embedding");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will learn how to embedd a application created inside nunuStudio in a webpage. nunuStudio applications are meant to be used inside web pages, nunuStudio editor can export web pages with the application already embedded in it and with fullscreen and vr buttons by default.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "There are two options for embedding applications in your webpage, the first one can be used to fast embed application with a single line of code, the second one can be used for a more flexible approach, with page communication support or more advanced controls.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "The fast way");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "This is the fastest way to get a nunuStudio app running on your webpage, simple include the the nunu.min.js file in your webpage, and create a canvas with an id. Add the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "NunuApp.loadApp('pong.nsp', 'canvas')");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " line to your body element onload and you are done, \"pong.nsp\" is the name of our project file and \"canvas\" is the id of our canvas element.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "<html>\n<head>\n\t<script src=\"nunu.min.js\"></script>\n</head>\n<body onload=\"Nunu.App.loadApp('pong.nsp', 'canvas')\">\n\t<canvas width=\"800\" height=\"480\" id=\"canvas\"></canvas>\n</body>\n</html>");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "If everything worked as expected you should be able to see a window with the pong application running. You can also import external aplication, they dont need to be stored locally. As an example if you change to ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "NunuApp.loadApp('http://nunustudio.org/examples/files/nunu.nsp', 'canvas')");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " the nunu homepage demo will be loaded instead.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Using javascript");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "First we need to import the nunu.min.js file to the webpage, this javascript file includes all the code required to run a nunuStudio aplication. After including the runtime file a canvas to display the application is needed, add a canvas to your html code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "<!--Import nunuStudio runtime-->\n<script type=\"text/javascript\" src=\"nunu.min.js\"></script>\n\n<!--Canvas used to draw content-->\n<canvas id=\"canvas\"></canvas>");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "App object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Now lets create a new javascript script with the code bellow, this code creates a new App instance that will use the provided canvas to render the application.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "If you dont want to start running the application immediately you can use the loadProgramAsync() or loadProgram() (not recommended, this blocks the page until all files are loaded), these will load the application files and decode them but will not start running the application immediately, this can be used for preloading applications into an webpage, after the app gets loaded the run() method can be used to start it and the exit() method can be used to kill the application and dispose all resources used.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "To finish we need to call the initialize method after the page loads, and the resize method every time the canvas is resized. To do this we can add the code bellow to the document body declaration.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "<body onload=\"initialize();\" onresize=\"resize();\">\n...\n</body>");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Toggle Fullscreen and VR");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "To toggle fullscreen its possible to use the toggleFullscreen method present in the app object, for VR its recomended to check if the browser supports WebVR and if there is a VRDisplay available before creating a button to toggle vr mode. To check for VR support use the following code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Adding a loading bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Booth the loadRunProgram() and the loadProgramAsync() methods provide a onProgress callback field, this callback returns a value from 0.0 to 1.0 that indicates loading progress, this value can be used to control a loading bar.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "A simple way to create a loading bar is by adding a couple of divisions, the code bellow is used for the default loading bar created when exporting web projects directly from the nunuStudio editor.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "<!--Loading bar frame-->\n<div style=\"position:absolute; width:100%; height:7%; left:0%; top:120%; border-style:solid; border-color:#FFFFFF; border-width:2px\">\n<!--Loading bar-->\n<div id=\"bar\" style=\"position:absolute; width:0%; height:100%; left:0%; top:0%; background-color:#FFFFFF\">\n</div>");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, "To control the created bar the following code can be used.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](43);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var app, canvas;\n\n//Should be called after page load\nfunction initialize()\n", "{", "\n//Get the canvas that will be used to draw content\ncanvas = document.getElementById(\"canvas\");\n\n//Create new app intance\napp = new Nunu.App(canvas);\n\n//Load and run the \"app.nsp\" file\napp.loadRunProgram(\"app.nsp\");\n", "}", "\n\n//Should be called every time the window is resized\nfunction resize()\n", "{", "\n//Update canvas width and height attributes\ncanvas.width = canvas.offsetWidth;\ncanvas.height = canvas.offsetHeight;\n\n//Resize app\napp.resize();\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("//Toggle fullscreen mode\nfunction toggleFullscreen()\n", "{", "\napp.toggleFullscreen(document.body);\n", "}", "\n\n//Toggle VR mode\nfunction toggleVR()\n", "{", "\napp.toggleVR();\n", "}", "\n\n//Check if VR is available\nif(app.vrAvailable())\n", "{", "\n//Check if there are displays available add button\nNunu.getVRDisplays(function(display)\n", "{", "\n\tbutton = document.getElementById(\"vr\");\n\tbutton.style.visibility = \"visible\";\n", "}", ");\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("//onProgress callback\nvar bar = document.getElementById(\"bar\");\nvar onProgress = function(event)\n", "{", "\nif(event.lengthComputable)\n", "{", "\n\tvar progress = event.loaded / event.total * 100;\n\tbar.style.width = progress + \"%\";\n", "}", "\n", "}", ";\n\n//onLoad callback\nvar onLoad = function()", "{", "", "}", ";\n\n//Load and run nunu app\napp.loadRunProgram(\"app.nsp\", onLoad, onProgress);");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EmbeddingPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'embedding-page',
                templateUrl: './embedding.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "d+mn":
/*!***********************************************************!*\
  !*** ./src/components/app-viewer/app-viewer.component.ts ***!
  \***********************************************************/
/*! exports provided: AppViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppViewerComponent", function() { return AppViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");



const _c0 = ["canvas"];
function AppViewerComponent_p_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "To try this example in the editor you can download the ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "project file");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " or open it on the ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Web Editor");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("href", ctx_r0.fname, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("href", "https://www.nunustudio.org/", ctx_r0.fname, "", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function AppViewerComponent_a_7_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppViewerComponent_a_7_Template_a_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r4.app.toggleVR(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Enter VR");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function AppViewerComponent_a_8_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppViewerComponent_a_8_Template_a_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r6.app.toggleAR(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Enter VR");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class AppViewerComponent {
    constructor() {
        this.style = {
            width: "70%",
            minWidth: "400px",
            height: "360px"
        };
    }
    ngOnInit() {
        // @ts-ignore
        this.app = new Nunu.App(this.canvas.nativeElement);
        this.app.loadRunProgram(this.fname);
    }
    ngAfterViewChecked() {
        this.app.resize();
    }
    ngOnDestroy() {
        this.app.exit();
    }
    toggleVR() {
        if (this.app.vrAvailable()) {
            this.app.toggleVR();
        }
    }
    toggleFullscreen() {
        this.app.toggleFullscreen();
    }
}
AppViewerComponent.ɵfac = function AppViewerComponent_Factory(t) { return new (t || AppViewerComponent)(); };
AppViewerComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppViewerComponent, selectors: [["app-viewer"]], viewQuery: function AppViewerComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
    } }, inputs: { fname: "fname", hideLink: "hideLink" }, decls: 9, vars: 4, consts: [[4, "ngIf"], [2, "margin-left", "auto", "margin-right", "auto", "display", "block", 3, "ngStyle"], [2, "width", "100%", "height", "100%"], ["canvas", ""], [2, "margin-top", "5px", "margin-left", "auto", "margin-right", "auto", "display", "block", "text-align", "center"], [1, "btn", "btn-dark", 3, "click"], ["class", "btn btn-dark", 3, "click", 4, "ngIf"], [1, "underline", 3, "href"]], template: function AppViewerComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, AppViewerComponent_p_0_Template, 8, 2, "p", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "canvas", 2, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppViewerComponent_Template_a_click_5_listener() { return ctx.app.toggleFullscreen(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Fullscreen");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, AppViewerComponent_a_7_Template, 2, 0, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, AppViewerComponent_a_8_Template, 2, 0, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hideLink !== true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", ctx.style);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.app.vrAvailable());
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.app.arAvailable());
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgStyle"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppViewerComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-viewer',
                templateUrl: 'app-viewer.component.html',
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
            }]
    }], null, { canvas: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['canvas', { static: true }]
        }], fname: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], hideLink: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "dnth":
/*!***************************************************!*\
  !*** ./src/page/learn/basics/water/water.page.ts ***!
  \***************************************************/
/*! exports provided: WaterPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WaterPage", function() { return WaterPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class WaterPage {
}
WaterPage.ɵfac = function WaterPage_Factory(t) { return new (t || WaterPage)(); };
WaterPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: WaterPage, selectors: [["water-page"]], decls: 31, vars: 6, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/water/material.jpg", 1, "img-normal"], ["src", "assets/learn/basics/water/normal.jpeg", 1, "img-small"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/water/water.nsp"]], template: function WaterPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Water");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will experiment a bit more with materials and learn how to create a simple 3D water effect using textures and a cubecamera object (to create reflections)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Lets start by creating a basic scene with some objects and a plane that we will use to create our water, we have to configure our plane geometry to have multiple subdivision, we will need it later to create a wave effect with the material.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "After we have our scene lets create a new material, we can use a standard, physical or phong material for this tutorial. Lets name this material water, this material will be used for our water surface. You can add some color and transparency if you want to.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "To create a water effect we can use a water surface normal map, we can find some of these around the web, here is the one that i have used for this tutorial. We can use our normal map as booth normal map and displacement map, by attaching our normal map as displacement map the only one color channel will be used to create displacement in the surface of our geometry creating a wavy effect that should make our water look even better.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "The texture we added above is static, the following code can be used to animate the texture, it moves our water normal map in the x and y axis. For it to work properly we have to set our texture repetition to \"Repeat\" mode, otherwise this will not work. To enable vertex animation we could set the needsUpdate attribute of our material and texture to true.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "code", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Now we have a water like surface but it still does not reflect the environment around it, to add this we can create a cubecamera object. After adding the object to the scene we have to check auto update on, so that we don't have to manually update the cubecamera.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "code", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Our water its much ready right now, i have added a cubemap to make our scene look more complete and a OrbitControl object for camera movement.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "app-viewer", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var normal;\n\nfunction initialize()\n", "{", "\nnormal = program.getTextureByName(\"normal\");\n", "}", "\n\nfunction update()\n", "{", "\nnormal.offset.x += 0.002;\nnormal.offset.y += 0.002;\n", "}", "\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("var water, cube;\n\nfunction initialize()\n", "{", "\n...\n\nwater = program.getMaterialByName(\"water\");\ncube = scene.getObjectByName(\"cubecamera\");\nwater.envMap = cube.cube;\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](WaterPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'water-page',
                templateUrl: './water.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "f8at":
/*!*********************************************************************!*\
  !*** ./src/page/learn/basics/postprocessing/postprocessing.page.ts ***!
  \*********************************************************************/
/*! exports provided: PostProcessingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostProcessingPage", function() { return PostProcessingPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class PostProcessingPage {
}
PostProcessingPage.ɵfac = function PostProcessingPage_Factory(t) { return new (t || PostProcessingPage)(); };
PostProcessingPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PostProcessingPage, selectors: [["postprocessing-page"]], decls: 28, vars: 14, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/postprocessing/editor.png", 1, "img-normal"], ["fname", "assets/learn/basics/postprocessing/blur.nsp"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/postprocessing/sepia.nsp"]], template: function PostProcessingPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Post-Processing");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will learn how to use postprocessing effects inside of nunuStudio, postprocessing effects are applied after the base image was rendered. These effects can be used to give a totally different atmosphere to a scene.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "The Post-processing pipeline is composed of a series of steps used to produce the final image, each step is performed by order (changing its order produces a different results). The pipeline is attached to the camera object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "To open the postprocessing pipeline editor double click the camera object on the explorer.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Each postprocessing step has its own custom set of attributes that can be adjusted in the editor and during runtime. Post-processing steps can be enabled/disabled and used as an output for the final image. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "app-viewer", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Custom effects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "It is possible to create custom postprocessing effects using GLSL shaders. This can be achieved using a script object that creates a custom shader pass and attaches is to the camera object as shown bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "The programmer has to be carefull and manage its own uniform values passed to the shader. If the effects craeted need to render to the screen dont forget to set the renderToScreen variable true.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "code", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "app-viewer", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["include(\"SepiaShader.js\");\n\nfunction initialize()\n", "{", "\ncamera = scene.getObjectByName(\"camera\");\n\n//custom shader pass\nvar effect =\n", "{", "\nuniforms:\n\t", "{", "\n\t\t\"tDiffuse\": ", "{", " value: null ", "}", ",\n\t\t\"amount\":   ", "{", " value: 1.0 ", "}", "\n\t", "}", ",\n\tvertexShader: [\n\t\t\"varying vec2 vUv;\",\n\t\t\"void main() ", "{", "\",\n\t\t\t\"vUv = uv;\",\n\t\t\t\"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\",\n\t\t\"", "}", "\"\n\t].join(\"\\n\"),\n\tfragmentShader: [\n\t\t\"uniform float amount;\",\n\t\t\"uniform sampler2D tDiffuse;\",\n\t\t\"varying vec2 vUv;\",\n\t\t\"void main() ", "{", "\",\n\t\t\t\"vec4 color = texture2D(tDiffuse, vUv);\",\n\t\t\t\"vec3 c = color.rgb;\",\n\t\t\t\"color.r = c.r * 2.0;\",\n\t\t\t\"color.g = c.g / 1.2;\",\n\t\t\t\"color.b = c.b;\",\n\t\t\t\"gl_FragColor = vec4(color.rgb , color.a);\",\n\t\t\"", "}", "\"\n\t].join(\"\\n\")\n", "}", "\n\ncamera.composer.passes[0].renderToScreen = false;\n\nvar sepia = new ShaderPass(THREE.SepiaShader);\ncamera.composer.addPass(sepia);\nsepia.renderToScreen = true;\n", "}", ""]);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PostProcessingPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'postprocessing-page',
                templateUrl: './postprocessing.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "gQ30":
/*!***********************************************************!*\
  !*** ./src/page/learn/basics/materials/materials.page.ts ***!
  \***********************************************************/
/*! exports provided: MaterialsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialsPage", function() { return MaterialsPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class MaterialsPage {
}
MaterialsPage.ɵfac = function MaterialsPage_Factory(t) { return new (t || MaterialsPage)(); };
MaterialsPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MaterialsPage, selectors: [["materials-page"]], decls: 91, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://threejs.org/docs/index.html#Reference/Materials/Material"], ["href", "https://www.marmoset.co/posts/basic-theory-of-physically-based-rendering/"], ["fname", "assets/learn/basics/materials/materials.nsp"], ["src", "assets/learn/basics/materials/selector.png", 1, "img-normal"], ["src", "assets/learn/basics/materials/editor.jpg", 1, "img-big"], ["src", "assets/learn/basics/materials/textures/albedo.jpg", 2, "width", "20%", "margin", "0", "float", "left"], ["src", "assets/learn/basics/materials/textures/normal.jpg", 2, "width", "20%", "margin", "0", "float", "left"], ["src", "assets/learn/basics/materials/textures/height.jpg", 2, "width", "20%", "margin", "0", "float", "left"], ["src", "assets/learn/basics/materials/textures/metallic.jpg", 2, "width", "20%", "margin", "0", "float", "left"], ["src", "assets/learn/basics/materials/textures/roughness.jpg", 2, "width", "20%", "margin", "0", "float", "left"], ["fname", "assets/learn/basics/materials/rock.nsp"], ["src", "assets/learn/basics/materials/apply.jpg", 1, "img-big"]], template: function MaterialsPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Materials");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Materials describe the appearance of objects. Materials define how the object superficie is renderer and can have attached to them textures, colors, videos, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Material types");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "There are various types of materials available inside nunuStudio and there is even the possibility of creating customized materials using GLSL shaders, more information about material types can be found ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, ". Here is a list of some of the most used material types:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Standard material - A standard physically based material. Physically based rendering (PBR) has recently become the standard in many 3D applications, such as Unity, Unreal and 3D Studio Max. More infomation abou PBR ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Phong material - A material for shiny surfaces with specular highlight.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Lambert material - A material for non-shiny surfaces, without specular highlights.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Basic material - A material for drawing geometries in a simple shaded way. This material is not affected by lights.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Sprite material - Special type of material to be used with sprite objects.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Shader material - Shader materials can be customized using GLSL code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "The example bellow shows 4 different material types running, from the left to the right we have a Standard material, Phong material, Lambert material and a Basic Material, as we can se the Standard (PBR) and Phong materials are more detailed, the lambert material has basic light support (per vertex light calculation) and the basic material does not react to light.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Creating materials");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "Materials can be crated by clicking on the Material menu in the resource explorer, and selecting the type of material desired, materials are also created when a image or video file is dragged to a mesh object or to the resource explorer.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "After creating a material its possible edit its attributes double clicking on top of it on the resource explorer, this will open a new material editor tab.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Inside the material editor its possible to change every material parameter, add textures, change colors, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "On the left side of the material editor there is a real time preview of the material applied to an object that can be moved using the mouse left button, its also possible to change the preview settings on the bottom section of the left side.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Textures");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Materials can have textures attached to them, textures can be used to define the color of the material surface, but can also be used to define other attributes of the material, like the roughness, metalness, normal vectors, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "To add a texture to a material its possible to drag a texture from the resource explorer or drag directly a image or video file from the host to the desired place in the material editor. This will automatically create a new texture object and attach it to the material.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "In this example we will explore a PBR based texturing set (using a StandardMaterial) to demonstrate how each type of texture affects the material. The following textures will be used:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Color texture - Defines the color of the object surface.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Normal texture - Defines how the surface of the object reacts to light (encode the normal vector of the object in rgb color).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Height texture - Used to increase detail on the object by applying deformations to it to match the material shape.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, "Metalness texture - Defines how metallic is the surface of the object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77, "Roughness texture - Defines how rough is the surface of the object.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](78, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](79, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](80, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](81, "img", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](82, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "The example bellow demonstrates how this different textures influence the material appearance.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](85, "app-viewer", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](87, "Applying materials");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "To apply a material to an object select the scene editor and drag the material from the resource explorer to the desired object. Another way to create materials is by dragging an external image or video file direcly to a object in the scene explorer, this will create a Standard or Sprite material (depending on the object) automatically using the provided file as a texture.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](90, "img", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MaterialsPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'materials-page',
                templateUrl: './materials.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "hAjc":
/*!***********************************************************!*\
  !*** ./src/page/learn/basics/animation/animation.page.ts ***!
  \***********************************************************/
/*! exports provided: AnimationPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationPage", function() { return AnimationPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class AnimationPage {
}
AnimationPage.ɵfac = function AnimationPage_Factory(t) { return new (t || AnimationPage)(); };
AnimationPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AnimationPage, selectors: [["animation-page"]], decls: 86, vars: 10, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "skinning.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/12_animation/skinning.nsp", 1, "underline"], ["fname", "assets/learn/basics/animation/skinning.nsp"], [1, "hljs", "javascript"], ["src", "assets/learn/basics/animation/spritesheet.png", 1, "img-small"], ["href", "spritesheet.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/12_animation/spritesheet.nsp", 1, "underline"], ["fname", "assets/learn/basics/animation/spritesheet.nsp"], ["href", "https://github.com/EsotericSoftware/spine-runtimes", 1, "underline"], ["src", "assets/learn/basics/animation/skin.jpg", 1, "img-normal"], ["fname", "assets/learn/basics/animation/spine.nsp"], ["href", "code.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/12_animation/code.nsp", 1, "underline"], ["fname", "assets/learn/basics/animation/code.nsp"]], template: function AnimationPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Animation");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Animations are a essencial part of every game, sometimes it can be quite hard to get them right, in this tutorial we will explore the multiple options for 2D and 3D animations in nunuStudio.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Skinning");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Skeletal animation is a technique in computer animation in which a character is represented in two parts, a surface representation used to draw the character (called skin or mesh) and a hierarchical set of interconnected bones (called the skeleton or rig) used to animate (pose and keyframe) the mesh.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "While this technique is often used to animate humans or more generally for organic modeling, it only serves to make the animation process more intuitive and the same technique can be used to control the deformation of any object, a door, a spoon, a building, or a galaxy. When the animated object is more general than, for example, a humanoid character the set of bones may not be hierarchical or interconnected, but it just represents a higher level description of the motion of the part of mesh or skin it is influencing.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "When importing a 3D model that contains a SkinnedMesh with bones attached will be created automatically, its possible to check the animations available for that 3D model in the object panel, its also possible to select one initial animation for that model that will be automatically player on start. The animation bellow was imported from a .x 3D model, to try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Its also possible to play animations using a script object, the code bellow shows how to display available animations using a script and how to play the first one available in the list. Multiple animations can be played at the same time, the result of multiple animations is the interpolation of bone position for all the animations playing.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "The playAnimation method received the animation index as a parameter, every time a animation is player a new action element is created in the actions array in the SkinnedMesh object, we can use action object to controll how much that animation track weigths on the final animation, this can be usefull to interpolate between multiple animations.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Spritesheet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "To import a new spritesheet animation into nunuStudio, we can select import/Texture/Spritesheet texture in the resource explorer. After we have selected an image a special type of texture will be created. We can open the spritesheet editor by double clicking the newly created texture.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "The image bellow shows an example of a 10x8 animation spritesheet, that spritesheet actually contains multiple animations the character moving up, down, right, left and a couple of static poses.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "We have to manually configure in the spritesheet editor its size, number of frames to be used, where to start and end the animation, and how fast do we want to play it.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "The example bellow uses three different spritesheet animations, one of them is controlled using a script object to display different parts of the animation depending on the player movement, this example also shows really well how lights can be used for 2D scenes. To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](50, "app-viewer", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Spine");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "Spine is a 2D animation software for Windows, Mac and Linux, developed by Esoteric Software. Spine is mostly targeted to people doing 2d video games, but can be used for pretty much any kind of 2D animated work.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, "For this tutorial Spine is not required, you can download some sample animations from ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Esoteric Github page");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, ", only paid versions of spine can be used to export animations.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "Spine animations can be imported into nunuStudio by selecting \"Spine animation\" on the resource explorer import menu. Spine objects can have multiple animations stored. nunuStudio provides a simple API to select and play animations. Animations can also have skins attached, the same object can use multiple skins. The image bellow shows the same Spine object using two different skins.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](62, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "The code bellow demonstrates how to change the animations programatically using the setAnimation(track, name, loop) function available in the SpineAnimation object. You can check the animations available for your animation in the object panel in the animation dropdown menu. There is also a setSkin(name) function that can be used to change the skin in use during runtime.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "The example bellow uses the spineboy animation available free on the spine runtime repository, and demonstrates how to use spine animations in a platformer style game.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](70, "app-viewer", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "Spine animations also have support for inverse kinematics, its also possible to use the mouse and keyboard import to change what would be the normal animation flow in order to adapt it to the current events.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, "Code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "Another way to animated objects is coding, scripted animations sometimes allow for a more dynamic interactiong, and can sometimes be even easier to do than using visual tools. We can easily animate the properties of objects, textures, materials, etc. Be creative a couple of lines of code can easily make good animations.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, "To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](80, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "a", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](83, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](85, "app-viewer", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("var object = scene.getObjectByName(\"animated\");\n\nfor(var i = 0; i < object.animations.length; i++)\n", "{", "\n\tconsole.log(object.animations[i].name);\n", "}", "\n\nobject.playAnimation(0);");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](38);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("var spineboy;\n\nfunction initialize()\n", "{", "\n\tspineboy = scene.getObjectByName(\"spineboy\");\n", "}", "\n\nfunction update()\n", "{", "\n\t...\n\n\tif(Keyboard.keyJustPressed(Keyboard.RIGHT) || ...)\n\t", "{", "\n\t\tspineboy.setAnimation(0, \"run\", true);\n\t", "}", "\n\tif(Keyboard.keyJustReleased(Keyboard.RIGHT) || ...)\n\t", "{", "\n\t\tspineboy.setAnimation(0, \"idle\", true);\n\t", "}", "\n", "}", "\n");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AnimationPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'animation-page',
                templateUrl: './animation.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "j47R":
/*!*********************************************************!*\
  !*** ./src/page/learn/basics/joystick/joystick.page.ts ***!
  \*********************************************************/
/*! exports provided: JoystickPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JoystickPage", function() { return JoystickPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class JoystickPage {
}
JoystickPage.ɵfac = function JoystickPage_Factory(t) { return new (t || JoystickPage)(); };
JoystickPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: JoystickPage, selectors: [["joystick-page"]], decls: 18, vars: 22, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], [1, "hljs", "javascript"], ["fname", "assets/learn/basics/joystick/joystick.nsp"]], template: function JoystickPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Joystick");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will learn how to use an external library called nipple.js to add joystick controlls for mobile platforms. First we need to download the nipple library from github and import it into the project. The library is available at https://yoannmoinet.github.io/nipplejs/.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "To import the javascript file into the editor drag it into the resource explorer. The file will appear as a javascript resource that can be imported to scripts using the import() method.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Script objects can import() files from the project resources or direclty from external URLs. Depending on the configured library mode (configured on the script object inspector panel) the files can evaluated in the context of the script, appended to the script code before compilation or included globally.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "app-viewer", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["include(\"nipplejs.min.js\");\n\nvar cube, camera;\n\nvar manager;\nvar direction, pressed;\n\nfunction initialize()\n", "{", "\ncamera = scene.getObjectByName(\"camera\");\ncube = scene.getObjectByName(\"cube\");\n\ndirection = new Vector2(0, 0);\npressed = false;\n\nmanager = nipplejs.create(\n", "{", "\n\tzone: program.division,\n\tmultitouch: false,\n\tmaxNumberOfNipples: 1,\n\tmode: \"dynamic\"\n", "}", ");\n\nmanager.on(\"added\", function(event, nipple)\n", "{", "\n\tnipple.on(\"move start end\", function(event, data)\n\t", "{", "\n\t\tif(event.type === \"move\")\n\t\t", "{", "\n\t\t\tvar force = 0.08 * data.force;\n\n\t\t\tdirection.x = Math.cos(data.angle.radian) * force;\n\t\t\tdirection.y = Math.sin(data.angle.radian) * force;\n\t\t", "}", "\n\t\telse if(event.type === \"start\")\n\t\t", "{", "\n\t\t\tpressed = true;\n\t\t", "}", "\n\t\telse if(event.type === \"end\")\n\t\t", "{", "\n\t\t\tpressed = false;\n\t\t", "}", "\n\t", "}", ");\n", "}", ");\n\nmanager.on(\"removed\", function(event, nipple)\n", "{", "\n\tnipple.off(\"move start end\");\n", "}", ");\n", "}", "\n\nfunction update()\n", "{", "\n//If the joystick is pressed update position\nif(pressed)\n", "{", "\n\tcube.position.x += direction.x;\n\tcube.position.y += direction.y;\n", "}", "\n\n//Limit the square movement\nif(cube.position.x > camera.right) cube.position.x = camera.right;\nif(cube.position.x < camera.left) cube.position.x = camera.left;\nif(cube.position.y > camera.top) cube.position.y = camera.top;\nif(cube.position.y < camera.bottom) cube.position.y = camera.bottom;\n", "}", "\n\nfunction dispose()\n", "{", "\nmanager.destroy();\n", "}", ""]);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](JoystickPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'joystick-page',
                templateUrl: './joystick.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "pHOW":
/*!*****************************************************!*\
  !*** ./src/page/learn/basics/script/script.page.ts ***!
  \*****************************************************/
/*! exports provided: ScriptPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScriptPage", function() { return ScriptPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class ScriptPage {
}
ScriptPage.ɵfac = function ScriptPage_Factory(t) { return new (t || ScriptPage)(); };
ScriptPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ScriptPage, selectors: [["script-page"]], decls: 160, vars: 36, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/script/script.png", 1, "img-big"], [1, "hljs", "javascript"], ["href", "rotate.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/02_script/rotate.nsp", 1, "underline"], ["fname", "assets/learn/basics/script/rotate.nsp"], ["href", "input.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/02_script/input.nsp", 1, "underline"], ["fname", "assets/learn/basics/script/input.nsp"], [1, "hljs", "language-javascript"], ["src", "assets/learn/basics/script/include.jpg", 1, "img-normal"], ["href", "include.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?isp=https://nunustudio.org/learn/basics/02_script/include.nsp", 1, "underline"], ["fname", "assets/learn/basics/script/include.nsp"]], template: function ScriptPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "First script");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Script object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "In nunuStudio scripts are written using the javascript language, javascript is the language used for developing web pages and its a easy language to learn, no programming knowledge is required for this tutorial. But I recommend that you learn the basics of programming in javascript before moving on to the next tutorial.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "The script object is used to control objects using javascript code, and behave in the same way any other object does, they have a position, scale and rotations, they can have children and be used as a container.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "After creating a script object its possible to open the script editor by double clicking the script object in the object explorer (right side). The script editor opens in a new tab. New scripts have a basic code template with spaces to write code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "To allow easier access to program elements, scripts also have access to the following attributes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "self - Used to access the script object attributes (position, rotation, scale, children, etc).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "program - Used to access the program instance, can be used to change the current scene, access resources (getMaterialByName, getTextureByName, etc).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "scene - Used to acess the running scene attributes.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Keyboard - provides access to keyboard input");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Mouse - provides access to mouse input");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Script functions");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "There are some reserved function names, that are used by the nunuStudio runtime to run scripts code. In this tutorial we will be working only with the initialize, update and dispose methods.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "initialize - The initialize method is called when the scene is loaded, it is normally used to create new objects programmatically, get object from the scene, initialize variables, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "update - Called each frame before drawing the scene into the screen, it can be used to control object, get input values, change object attributes, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "dispose - Called when the program is being closed, should be used to cleanup objects, disconnect from data streams, etc.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "onMouseOver(objects) - Called when the mouse is over an object that is children of the script object, can be combined with Mouse functions to check if a object was clicked. Received an array of objects as parameter.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "onResize(x, y) - Called every time the program window is resized.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "onAppData(data) - Used to receive data from the host page, data is received as argument.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Moving an object");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "To move an object we start by attaching that object as a children of the script object, we can do that by dragging the desired object to the script object, in this tutorial we will use the cube object on the default scene. Lets start by testing the following code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, "This code will move the cube 2 points in the x axis when the program is started, but, after the object is moved it stays in place.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "To animate an object we can instead move our code to the update method, instead of playing with the object position lets try to change now its rotation by testing the following code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "If everything works as expected you should see the following animation. To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](75, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](80, "app-viewer", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, "Keyboard and Mouse input");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "Its possible to use the keyboard and mouse to move objects around. This can be done using the Keyboard and Mouse objects inside scripts. The code bellow rotates an object in the y axis using the mouse delta, and moves the object aroud using keyboard arrow keys.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](87);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "If everything works as expected you should be able to move the cube around using the keyboard arrow keys and rotate it using the mouse as shown bellow. To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](92, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](96, "app-viewer", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, "Getting objects");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](99, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](100, "Its possible to access other objects and resources with scripts, in the example bellow we use the scene.getObjectByName() method to get an object by its name (in this case an object named box), if multiple objects with the same name are found the first one is returned.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](102, "Resources are stored in the program, similarly the methods program.getMaterialByName(), program.getTextureByName(), etc can be used to get them, (check the ResourceManager API documentation page for more information).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "code", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](105);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](106, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](107, "Another way to access objects its by navigating the tree structure, every object has a parent and children, the parent points to the object above and children is an array of all objects bellow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](108, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](109, "In the following code we get the first object placed inside the scripts and make it rotate without rotating the script itself. Be careful when accessing children or parent objects directly since it depends on the object placement in the project a change can break the code.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](110, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](111, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](112);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](113, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](114, "Switch scenes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](115, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](116, "Its possible to create multiple scenes in the editor and switch between them using scripts. Scenes can be accessed from the program variable accessible to all scripts. The setScene() method discards the current scene and loads a new scene it receives the scene name or the scene object (stored in the program.scenes array) as argument");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](117, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](118, "The code bellow can be used to switch to the \"scene2\" after the W key is pressed on the keyboard. To return to the original scene the scene2 has to implement a similar logic there is no automatic scene navigation flow.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](119, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](120, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](121);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](122, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](123, "Object attributes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](124, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](125, "The self pointer in the script object can be used to store aditional attributes that can be accessed by other scripts. Attributes can also be stored into objects be carefull to avoid collisions with the already existing ones provided by the nunuStudio API.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](126, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](127, "In the example bellow we create a counter variable attached to the script object and a increaseCounter function that can be accessed and called by other scripts.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](128, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](129, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](130);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](131, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](132, "DOM Elements");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](133, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](134, "Its possible to attach dom elements to the program created. To do this we can use the division property of the program that gives us access to a DOM division element (parent of the canvas element used to draw content) where we can add HTML elements.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](135, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](136, "The example below demonstrates how to create a new red division with size 50 x 50 add it to the program and remove it when the program is being closed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](137, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](138, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](139);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](140, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](141, "Libraries");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](142, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](143, "To add external libraries to your script first you need to import the js file into the project, you can just simply drag the JS source file into the asset explorer or go to Import/Text and select the js file.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](144, "img", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](145, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](146, "After importing the file into the project you can now include it in your script using the include(name) method preferabily at the top of your code. There are multiple include modes available by default the script objects use Evaluate mode the library is evaluated and executed in your script context, the Append mode appends the code of your library on top of your script code, this makes compiling a bit slower but local defined code becomes available to your script. Script mode can be selected in the Script object panel.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](147, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](148, "code", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](149);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](150, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](151, "The code above demonstrates how to use moment.js to display date and time on a text object. The library is available for free at https://momentjs.com/. To try this example in the editor you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](152, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](153, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](154, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](155, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](156, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](157, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](158, "app-viewer", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](159, "|\n");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](64);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("function initialize()\n", "{", "\nself.position.x += 2;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("function update()\n", "{", "\nself.rotation.y += 0.01;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("function update()\n", "{", "\nself.rotation.y += Mouse.delta.x * 0.01;\n\nif(Keyboard.keyPressed(Keyboard.LEFT))\n", "{", "\n\tself.position.x -= 0.1;\n", "}", "\nif(Keyboard.keyPressed(Keyboard.RIGHT))\n", "{", "\n\tself.position.x += 0.1;\n", "}", "\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var object;\n\nfunction initialize()\n", "{", "\nobject = scene.getObjectByName(\"box\");\n", "}", "\n\nfunction update()\n", "{", "\nobject.rotation.y += 0.01;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var object;\n\nfunction initialize()\n", "{", "\nobject = self.children[0];\n", "}", "\n\nfunction update()\n", "{", "\nobject.rotation.y += 0.01;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("function update(delta)\n", "{", "\nif(Keyboard.keyPressed(Keyboard.W))\n", "{", "\n\tprogram.setScene(\"scene2\");\n", "}", "\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("self.counter = 0;\n\nself.increaseCounter = function()\n", "{", "\nself.counter++;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var element = document.createElement(\"div\");\nelement.style.width = \"100px\";\nelement.style.height = \"100px\";\nelement.style.position = \"absolute\";\nelement.style.top = \"0px\";\nelement.style.backgroundColor = \"#FF0000\";\n\nfunction initialize()\n", "{", "\n\tprogram.division.appendChild(element);\n", "}", "\n\nfunction dispose()\n", "{", "\n\tprogram.division.removeChild(element);\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("include(\"moment.min.js\"); //https://momentjs.com/\n// include(\"https://momentjs.com/downloads/moment.min.js\");\n\nvar date, hour;\n\nfunction initialize()\n", "{", "\ndate = program.getObjectByName(\"date\");\ndate.setText(moment().format(\"MMM Do YY\"));\n\nhour = program.getObjectByName(\"hour\");\n", "}", "\n\nfunction update()\n", "{", "\nvar text = moment().format('LTS');\nif(text !== hour.text)\n", "{", "\n\thour.setText(text);\n", "}", "\n", "}", "\n\nfunction dispose()\n", "{", "\ndelete moment;\n", "}", "\n");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ScriptPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'script-page',
                templateUrl: './script.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "q+Zp":
/*!*****************************************************!*\
  !*** ./src/page/learn/basics/camera/camera.page.ts ***!
  \*****************************************************/
/*! exports provided: CameraPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CameraPage", function() { return CameraPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class CameraPage {
}
CameraPage.ɵfac = function CameraPage_Factory(t) { return new (t || CameraPage)(); };
CameraPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CameraPage, selectors: [["camera-page"]], decls: 63, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/camera/camera.jpg", 1, "img-big"], ["fname", "assets/learn/basics/camera/cameras.nsp"], ["src", "assets/learn/basics/camera/viewport.png", 1, "img-big"], ["fname", "assets/learn/basics/camera/viewport.nsp"], ["src", "assets/learn/basics/camera/cubecamera.png", 1, "img-big"]], template: function CameraPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Cameras");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Cameras define how the scene is viewed in the screen, as every other object they have a position and rotation, and can control where to draw content on the screen and can have postprocessing effects attached.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "A scene can use multiple cameras at the same time, camera have a draw order preference attached to them, used to decide which one to render from first. Cameras can be added from the object add bar.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Perspective Camera");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "A perspective camera is used to draw objects with a perspective projection. A perspective projection is a 3D where depth can be easily perceived by the used.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "In perspective cameras the following parameters can be configured:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "FOV (Field-of-view): Angle in degrees used to control the camera field of view.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Orthographic Camera");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Orthographic cameras are used to draw object with a orthographic projection. A orthographic proection is a 2D projection where its impossible for the used to perceive distance, objects far away from the camera appear to have the same size as the ones closest to it.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "In orthographic cameras the following parameters can be configured:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Size: Used to control how much the camera can see inside the scene");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Resize mode: Defines how the camera is resized when the window size changes, if set to horizontal mode, the vertical size of the camera stays the same and the horizontal size changes on resize, if set to vertical mode, the horizontal stays locked and the vertical size changes.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Comparison");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "In the demo bellow we can see booth a perspective camera (on the left) and a orthographic camera (on the right) in action.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "app-viewer", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Viewport");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "The zone on the screen where the camera draws can be controlled using the viewport attributes. This allows for multiple cameras to be displayed at the same time on one screen.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Position: Normalized coordinates used to select where the draw zone starts (bottom left corner). Ranges from 0 to 1.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "Size: Normalized coordinates used to define the size of the draw zone. Ranges from 0 to 1.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](52, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "In the example bellow the booth cameras have a viewport of (1.0, 0.5) this means that the cameras ocupy 100% of the screen in the horizontal and half the screen in the vertical. And position for the camera on the bottom (0,0), and (0, 0.5) for the top camera. These positions are relative to the bottom left corner of the viewports. The bottom camera start on the bottom left of the screen and the top camera starts at 50% of the vertical size of the screen.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](55, "app-viewer", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Cube Camera");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Cube cameras are composed of 6 internal perspective cameras aligned to capture an entire 360 projection of the scene.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "These type of cameras are useful for material effects that require access to information of the surroundings (e.g reflections, refraction). These can be programmatically attached to the scene (as background) or to materials (as environment map).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](62, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CameraPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'camera-page',
                templateUrl: './camera.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "qqey":
/*!************************************!*\
  !*** ./src/page/home/home.page.ts ***!
  \************************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "BKks");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");





const _c0 = ["canvas"];
const _c1 = ["bar"];
function HomePage_div_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const project_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("href", project_r5.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("src", project_r5.image, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function HomePage_div_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const feature_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](feature_r6.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](feature_r6.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("src", feature_r6.image, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function HomePage_div_33_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HomePage_div_33_Template_a_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9); const example_r7 = ctx.$implicit; const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r8.global.openEditor("../../page/examples/files/" + example_r7.file); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Open in Editor");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const example_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](example_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](example_r7.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("href", "/example?nsp=examples/", example_r7.file, "", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("src", "examples/", example_r7.image, "", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
class HomePageExampleOption {
}
class HomePageFeatureOption {
}
class HomePageProject {
}
class HomePage {
    constructor() {
        this.projects = [
            {
                image: 'assets/logo/threejs.png',
                url: 'https://threejs.org/'
            },
            {
                image: 'assets/logo/codemirror.png',
                url: 'https://codemirror.net/'
            },
            {
                image: 'assets/logo/nwjs.png',
                url: 'https://nwjs.io/'
            },
            {
                image: 'assets/logo/js.jpg',
                url: 'https://www.ecma-international.org/ecma-262/'
            },
            {
                image: 'assets/logo/webgl.png',
                url: 'https://get.webgl.org/'
            },
        ];
        this.examples = [
            {
                title: 'nunuStudio',
                description: 'nunuStudio physically based rendering home screen demo.',
                file: 'nunu.nsp',
                image: 'nunu.jpg'
            },
            {
                title: 'Pong',
                description: '3D recreation of the classic pong game.',
                file: 'pong.nsp',
                image: 'pong.jpg'
            },
            {
                title: 'Flappy Birds Clone',
                description: 'Clone of the mobile game flappy birds.',
                file: 'flappy.nsp',
                image: 'flappy.jpg'
            },
            {
                title: 'Rollercoaster',
                description: 'A virtual reality rollercoaster ride.',
                file: 'rollercoaster.nsp',
                image: 'rollercoaster.jpg'
            },
            {
                title: 'Spine',
                description: 'Spineboy spine animation example',
                file: 'spine.nsp',
                image: 'spine.jpg'
            },
            {
                title: 'Portal',
                description: 'Portal clone example',
                file: 'portal.nsp',
                image: 'portal.jpg'
            },
            {
                title: 'PBR',
                description: 'Physically based rendering demo using GLTF damaged helmet model.',
                file: 'pbr.nsp',
                image: 'pbr.jpg'
            },
            {
                title: 'Webcam',
                description: 'Camera capture example using WebRTC.',
                file: 'camera.nsp',
                image: 'camera.jpg'
            },
            {
                title: 'Starwars',
                description: 'Star wars tribute with dancing stormtrooper!',
                file: 'starwars.nsp',
                image: 'starwars.jpg'
            },
            {
                title: 'Paint',
                description: '3D planet paint example, mouse to paint the planet.',
                file: 'paint.nsp',
                image: 'paint.jpg'
            },
            {
                title: 'Little Voxel Island',
                description: 'Little voxel island model made by Rick Hoppmann w/ positional audio.',
                file: 'littlevoxelisland.nsp',
                image: 'littlevoxelisland.jpg'
            },
            {
                title: 'Boids',
                description: 'Boids simulation with instanced meshes and post-processing.',
                file: 'boids.nsp',
                image: 'boids.jpg'
            },
            {
                title: 'WebXR',
                description: 'WebXR powered Virtual Reality and Augmented Reality in a single application.',
                file: 'ar.nsp',
                image: 'ar.jpg'
            }
        ];
        this.features = [
            {
                title: 'Graphical Editor',
                description: 'Familiar user interface similar to the ones you already know.',
                image: 'assets/screenshot/6.jpg'
            },
            {
                title: '3D Graphics',
                description: 'Graphics powered by three.js with dynamic ligths, shadows, post-processing, etc.',
                image: 'assets/screenshot/8.jpg'
            },
            {
                title: 'Physics',
                description: 'Fully features 3D physics engine powered by cannon.js',
                image: 'assets/screenshot/gif/1.gif'
            },
            {
                title: 'JS Scripts',
                description: 'Easy to learn language, familiar for web and game developers.',
                image: 'assets/screenshot/5.jpg'
            },
            {
                title: '2D Mode',
                description: 'Want 2D? No problem! Switch between 2D and 3D with the click of a button.',
                image: 'assets/screenshot/7.jpg'
            },
            {
                title: 'WebVR',
                description: 'Ready for web virtual reality, on mobile and desktop platforms.',
                image: 'assets/vr.jpg'
            },
            {
                title: 'Advanced materials',
                description: 'Graphical material editor similar to the ones found in 3D design tools.',
                image: 'assets/screenshot/1.jpg'
            },
            {
                title: 'Particles',
                description: 'GPU accelerated particle system powered by SPE.',
                image: 'assets/screenshot/2.jpg'
            },
            {
                title: 'Drag and drop',
                description: 'Drag and drop files into the editor, it just works.',
                image: 'assets/screenshot/gif/2.gif'
            },
            {
                title: 'Spine animations',
                description: 'Create 2D animations using Esoteric spine animation tool and import them to nunuStudio.',
                image: 'assets/screenshot/9.jpg'
            },
            {
                title: 'WebAudio',
                description: 'Audio engine built on top of web audio API with support for positional audio.',
                image: 'assets/screenshot/10.jpg'
            },
            {
                title: 'Multi-platform editor',
                description: 'nunuStudio was build on top of nwjs it works on windows, linux and OS X.',
                image: 'assets/screenshot/3.jpg'
            }
        ];
    }
    get global() { return _global__WEBPACK_IMPORTED_MODULE_1__["Global"]; }
    ngOnInit() {
        // @ts-ignore
        this.app = new Nunu.App(this.canvas.nativeElement);
        this.app.loadRunProgram("examples/nunu.nsp", () => {
            this.bar.nativeElement.parentElement.style.display = "none";
        }, (progress) => {
            this.bar.nativeElement.style.width = progress + "%";
        });
    }
    ngAfterViewChecked() {
        this.app.resize();
    }
    ngOnDestroy() {
        this.app.exit();
    }
}
HomePage.ɵfac = function HomePage_Factory(t) { return new (t || HomePage)(); };
HomePage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: HomePage, selectors: [["home-page"]], viewQuery: function HomePage_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c1, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.bar = _t.first);
    } }, decls: 34, vars: 4, consts: [[2, "height", "70vh", "width", "100%", "overflow", "hidden"], [2, "height", "100%", "width", "100%", "z-index", "-1"], ["canvas", ""], [1, "text-center", 2, "position", "absolute", "width", "100%", "height", "30px", "top", "50vh", "font-size", "21px", "line-height", "26px", "color", "var(--white)"], [2, "position", "absolute", "width", "100%", "top", "60vh"], [2, "margin-left", "auto", "margin-right", "auto", "display", "block", "text-align", "center"], [1, "btn", "btn-secondary", "btn-lg", 2, "margin", "5px", 3, "href"], ["routerLink", "/download", 1, "btn", "btn-primary", "btn-lg", 2, "margin", "5px"], [2, "position", "absolute", "width", "50%", "height", "3%", "left", "25%", "top", "50%", "border-style", "solid", "border-color", "#FFFFFF", "border-width", "2px"], [2, "position", "absolute", "width", "0%", "height", "100%", "left", "0%", "top", "0%", "background-color", "#FFFFFF"], ["bar", ""], [2, "padding-top", "150px", "padding-bottom", "150px", "background", "url(assets/editor.png) #222222 no-repeat center center fixed", "background-size", "cover"], [1, "container", "text-center"], [2, "color", "var(--white)", "margin-bottom", "20px"], ["style", "display: inline; margin: 5px;", 4, "ngFor", "ngForOf"], [1, "container", 2, "padding-top", "30px", "padding-bottom", "30px"], [2, "padding-bottom", "30px"], [1, "row"], ["class", "col-md-3", 4, "ngFor", "ngForOf"], [2, "padding-top", "30px", "background-color", "var(--dark)", "color", "var(--white)"], [1, "container"], ["height", "38", "src", "assets/logo.png"], [2, "display", "inline", "margin", "5px"], [3, "href"], [2, "height", "50px", 3, "src"], [1, "col-md-3"], [2, "border-radius", "5px", "width", "100%", 3, "src"], [2, "text-align", "center", "margin-top", "5px"], [1, "btn", "btn-outline-light", "btn-sm", 3, "click"]], template: function HomePage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "canvas", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Create interactive experiences for your webpage!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Design, edit, code, all in one place!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Web Version");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Download");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "div", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "h2", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Built on OpenSource");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, HomePage_div_21_Template, 3, 2, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "h2", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Features");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](26, HomePage_div_26_Template, 6, 3, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "h2", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Made with ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "img", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](33, HomePage_div_33_Template, 10, 4, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("href", ctx.global.editor, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.projects);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.features);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.examples);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HomePage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'home-page',
                templateUrl: './home.page.html'
            }]
    }], null, { canvas: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['canvas', { static: true }]
        }], bar: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['bar', { static: true }]
        }] }); })();


/***/ }),

/***/ "rBNf":
/*!*****************************************************!*\
  !*** ./src/page/learn/basics/python/python.page.ts ***!
  \*****************************************************/
/*! exports provided: PythonPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PythonPage", function() { return PythonPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class PythonPage {
}
PythonPage.ɵfac = function PythonPage_Factory(t) { return new (t || PythonPage)(); };
PythonPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PythonPage, selectors: [["python-page"]], decls: 14, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://brython.info/"], ["fname", "assets/learn/basics/python/python.nsp"]], template: function PythonPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Python");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will explore how we can write scripts using the python programming language inside of nunuStudio. Python support is achieved using the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Brython");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " project, that transpiles Python 3 compliant code to javascript.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "app-viewer", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PythonPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'python-page',
                templateUrl: './python.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "rl0J":
/*!*********************************************************!*\
  !*** ./src/page/learn/basics/timeline/timeline.page.ts ***!
  \*********************************************************/
/*! exports provided: TimelinePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimelinePage", function() { return TimelinePage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class TimelinePage {
}
TimelinePage.ɵfac = function TimelinePage_Factory(t) { return new (t || TimelinePage)(); };
TimelinePage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TimelinePage, selectors: [["timeline-page"]], decls: 32, vars: 10, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/basics/timeline/create.png", 1, "img-big"], ["src", "assets/learn/basics/timeline/addkeyframe.png", 1, "img-big"], ["fname", "assets/learn/basics/timeline/timeline.nsp"], [1, "hljs", "javascript"]], template: function TimelinePage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Timeline");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this guide we will learn how to use the timeline in nunuStudio. It can be used to animate any kind of object inside of nunuStudio. Timeline animations are composed of tracks and keyframes. Each track holds multiple keyframes for a specific attribute of the object, the keyframes are points of the animation that represent the value of that attribute in that specific time point.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "The animation engine interpolates the values between the known keyframes for the animation to be smooth. The animation engine suports multiple interpolation modes allowing the user to select how the value between keyframes should be interpolated.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "To create an animation select an object in the editor, select the Animation tab and click the add animation button. This will create a new default animation with the attributes position, rotation, scale and visible with a duration of three seconds.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "To create a new keyframe drag the timeline bar to the desired time, move the object to the desired position (or change the desired attribute) and click on the + button next to the attribute name that you want to create a keyframe for.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Use the play button to preview the animation. The animation can be configured repeat after it is finished, never repeat or play in ping pong. When it is configure to repeat in ping pong the animation is played forward and the backwards infinitely.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "To add new attributes to the timeline right click the animation name and select \"Add track\" this will create a window asking for the object attribute to be edited. Pretty much every attribute of an object or resource can be animated using the timeline feature.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "In the example bellow the scene has multiple resource and object being animated using the timeline editor of nunuStudio.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "app-viewer", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Animations can be controlled from scripts every object has a mixer property that is used to controll/mix animations to this object can be used to control the playback of all animations running using the play(), pause(), stop() and setTime(time) methods.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "code", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "When more than one animation is active the system automatically interpolates between the state of each attribute for all the animations available. Animations speed can be different for each animation playing simultaneously. Each animation timeline is processed indepedently. External file (e.g. fbx, dae, gltf) may contain keyframe animations that are imported with the objects and can be edited using nunuStudio timeline.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var cameraAnimation;\nvar camera;\n\nfunction initialize()\n", "{", "\ncameraAnimation = true;\ncamera = scene.getObjectByName(\"camera\");\nconsole.log(camera);\n\n", "}", "\n\nfunction update(delta)\n", "{", "\nif(Mouse.buttonJustPressed(Mouse.LEFT))\n", "{", "\n\tcameraAnimation = !cameraAnimation;\n\n\tif(cameraAnimation)\n\t", "{", "\n\t\tcamera.mixer.play();\n\t", "}", "\n\telse\n\t", "{", "\n\t\tcamera.mixer.pause();\n\t", "}", "\n", "}", "\n", "}", ""]);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TimelinePage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'timeline-page',
                templateUrl: './timeline.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "s3n1":
/*!***************************************************************!*\
  !*** ./src/page/learn/tutorial/platformer/platformer.page.ts ***!
  \***************************************************************/
/*! exports provided: PlatformerPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlatformerPage", function() { return PlatformerPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/app-viewer/app-viewer.component */ "d+mn");




class PlatformerPage {
}
PlatformerPage.ɵfac = function PlatformerPage_Factory(t) { return new (t || PlatformerPage)(); };
PlatformerPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PlatformerPage, selectors: [["platformer-page"]], decls: 216, vars: 84, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["src", "assets/learn/tutorial/platformer/images/a.png", 1, "img-normal"], ["src", "assets/learn/tutorial/platformer/images/b.png", 1, "img-small"], ["src", "assets/learn/tutorial/platformer/images/c.png", 1, "img-normal"], ["src", "assets/learn/tutorial/platformer/images/d.png", 1, "img-small"], ["src", "assets/learn/tutorial/platformer/images/e.png", 1, "img-normal"], ["src", "assets/learn/tutorial/platformer/images/f.png", 1, "img-small"], ["src", "assets/learn/tutorial/platformer/images/g.png", 1, "img-small"], ["src", "assets/learn/tutorial/platformer/images/h.png", 1, "img-normal"], ["href", "steps/a.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?nsp=https://nunustudio.org/learn/tutorial/01_platformer/steps/a.nsp", 1, "underline"], ["src", "assets/learn/tutorial/platformer/images/i.png", 1, "img-normal"], [1, "hljs", "javascript"], ["href", "../../../docs/classes/Keyboard.html", 1, "underline"], ["href", "steps/b.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?nsp=https://nunustudio.org/learn/tutorial/01_platformer/steps/b.nsp", 1, "underline"], ["src", "assets/learn/tutorial/platformer/images/j.png", 1, "img-normal"], ["src", "assets/learn/tutorial/platformer/images/k.png", 1, "img-normal"], ["src", "assets/learn/tutorial/platformer/images/l.png", 1, "img-small"], ["src", "assets/learn/tutorial/platformer/images/m.png", 1, "img-normal"], ["href", "steps/c.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?nsp=https://nunustudio.org/learn/tutorial/01_platformer/steps/c.nsp", 1, "underline"], ["href", "http://html5gamepad.com/", 1, "underline"], ["href", "../../../docs/classes/Gamepad.html", 1, "underline"], ["src", "assets/learn/tutorial/platformer/images/n.png", 1, "img-big"], ["src", "assets/learn/tutorial/platformer/images/p.png", 1, "img-normal"], ["fname", "assets/learn/tutorial/platformer/platformer.nsp"], ["src", "assets/learn/tutorial/platformer/images/t.png", 1, "img-normal"], ["href", "steps/e.nsp", 1, "underline"], ["href", "https://www.nunustudio.org/editor?nsp=https://nunustudio.org/learn/tutorial/01_platformer/steps/e.nsp", 1, "underline"]], template: function PlatformerPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Platformer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will learn how to create a simple platformer game inside nunuStudio. We will explore how to control physics elements, import external resources and use keyboard and gamepad input.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "This should take about 2 to 3 hours to complete, but its totally fine for new programmers to take longer, don't rush it take your time and try to understand every step of the tutorial.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "For this tutorial some previous programming experience is recommended but i will try to explain as much as possible every code needed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Creating a level");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Lets start by creating a simple level for our game. All interactive objects in our game should be created using the physics objects. Phyics objects are invisible, to make them visible in the game we need to attach a visual representation to them.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Start by adding a physics cube, when selected the physics cube will be shown in the editor in green, but when we press start it will becore invisible.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Lets now add a visual representation to our cube, we achieve this by creating a new cube and attaching it as children of the physics cube. To add the new cube as children of the physics cube drag it on the object explorer on top of the physics cube.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "After adding a visual representation to our cube we can see that it falls bellow the existing floor, to prevent this we need to add some additional physics elements to be used as floor for our cube.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "We can move, resize and scale our cube physics object and the children objects will be afected as well.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "The new physics elements need to be configured as static. Static physics element don't move around, they are only used as static walls. To configure the physics as static select it and set the \"Type\" in the object panel to Static.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Lets now add a camera to our project, cameras controll how the player will see the world, we will use a perspective camera, perspective cameras allow the player to perceive depth and see 3D objects, orthographic cameras are 2D cameras they don't allow the player to perceive distance.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "After adding the camera to our scene we need to make it our default camera, to achieve this select the camera object and select the \"Use camera\" option in the object panel.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](37, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Now lets create a new material to make it easier to distinguish our player and the walls we created. To create a new material open the Material menu on the asset explorer and select Standard or Phong Material. To apply the new material to our objects drag it from the asset explorer to the object. I colored mine red but you can choose whatever color you want and even add a texture if you want to.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "After adding the material to our cube that we will use as our player we are ready to move on to coding our character behavior. If everything went as expected you should have something similar to this on your computer.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "If you are having some trouble completing this part of the tutorial you can download the project fileou can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Player control");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "To move our player around we need to create a new script that will be used to controll the player using the keyboard keys. Scripts are objects, so they have a position, rotation, scale, etc, and can have objects attached as children.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "To open the code editor double click the script object on the object explorer or right click on top of it and select \"Script editor\", a new tab will be open with the code editor.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](58, "img", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "In this tutorial we will use a single script object to controll all objects in the scene, but is possible to have multiple scripts.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Lets start by getting the player object in our script, to get the player object we can use its name, lets rename our physics cube (that will be used as our player) to player. After that we can use the code bellow to get the player object and store it in a variable.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "To get keyboard input we have the Keyboard object, that offers keyPressed, keyJustPressed and keyJustRelease methods that allow us to detect when the user has pressed and released a specific key in the keyboard. For this guide we will use the WASD keys.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "To move the player around we will manipulate its body, physics bodies have position, velocity, acceleration and force attributes. We change manipulate those to make the player move around, for better control of the player movement we will manipulate the velocity attribute.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "To code bellow detects when the user has pressed the A, W and D key and sets the player velocity accordingly. But after a bit of time we can the see that the player falls of our platform, that because our body is a cube and ends up rotating a bit on its corners changing its direction. To use other keys in the Keyboard check the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "a", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Keyboard API documentation");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "To avoid our player falling down our level we need to block its movement on the Z axis we can achieve this by forcing its position and/or velocity to 0 on that axis.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "Now there is still a problem left to solve, everytime the player keeps the W key pressed the player keeps going up. We can only let our player jump when he is touching the ground. To achieve this we need to check if our player is on the ground and create a new variable that will be set true when the player is touching the ground.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, "To check if the player has touched the ground, we will create a new callback for the cannon.js world postStep event, this callback is called every time after the physics engine updates the object position, we can get a list of contact points and check if those contact points belong to our player if they do that means our player is colliding with something. Now we only need to check the orientation of the contact point, for that we will check the dot product of the contact point direction and the surface normal (we will assume a normal pointing up) is its the floor that should give us a result near 0, we will assume that any value bellow 0.1 is the floor and we will set a canJump flag to true if so.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "Now we are able to control our character and have it moving properly around our level, but our camera is still static, to make it follow our character we can simply equal its position in the X and Y coordinates to the player position.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](96, "If you are having some trouble completing this part of the tutorial you can download the project fileou can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "a", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](101, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](102, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](104, "Enemies");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](106, "We got our player moving but we still cant die, and dont have any obstacles to avoid or enemies to kill. Dont worry we will take care of that now.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](108, "Lets start by making our level a bit bigger, add more platforms some places where we can fall off, the fastest way to do this is by duplicating our already existing floor and after rotating, scaling and moving it around, be carefull we want to apply these changes to the physics object not to the visual representation.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](109, "img", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](110, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](111, "Now lets create some obstacles, first lets start with static obstacles and after we can make them move. I will add obstacles in red and change my player color to green, obstacles will also be static physics objects.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](112, "img", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](113, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](114, "After adding our enemies lets create a new group and add all enemies to that group, so that we can distinguish enemies from normal walls and other physics objects. In your object explorer you new group should look something like this.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](115, "img", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](116, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](117, "Now lets get back to our script and add code to detect collision with enemies, lets start by adding an attribute \"isEnemy\" to all our enemies that we added to the group we just created. We also need to store our player spawn position so that when we die we get back to that position.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](118, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](119, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](120);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](121, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](122, "After this we need to add the enemy collision check to the callback we created ealier in our physics world, we just need to check is there is a isEnemy true value and if so reset our character position and speed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](123, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](124, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](125);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](126, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](127, "Before moving on to moving enemies lets add a new static enemy under the floor so that the player dies when it falls off the level, this enemy doesn't need a visual representation.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](128, "img", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](129, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](130, "Now lets make our enemies move, lets choose on of our enemies, create a new script and attach that script as child of the enemy we choose. We can make our enemies move in a couple of different ways.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](131, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](132, "Bellow is the full code used for this script, it moves the object around from one position to another in looop, it can be ajusted to be easily ajusted and reused to move other objects (for example to create moving platforms).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](133, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](134, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](135);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](136, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](137, "You should have now a moving enemy in your game, duplicate the created script and attach it to other object to make them move as well, try to create a moving platform like the ones in super mario games.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](138, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](139, "If you are having some trouble completing this part of the tutorial you can download the project file you can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](140, "a", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](141, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](142, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](143, "a", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](144, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](145, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](146, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](147, "Gamepad input");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](148, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](149, "To add support for gamepad input we can create a Gamepad object in our script, the gamepad object allows us to get input from an USB gamepad, different gamepads might have different button mapping you can use ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](150, "a", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](151, "this website");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](152, " to check you gamepad button mapping. To check the name of other buttons in the Gamepad check the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](153, "a", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](154, "Gamepad API documentation");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](155, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](156, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](157, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](158);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](159, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](160, "Put the pieces together");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](161, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](162, "Now we already have all basic blocks to make a complete platformer level lets take them and build complete level with actual game assets and tweak gameplay a little bit. To make it easier to overview our level we can use the 2D editor mode (can be toggled in the top right corner of the scene explorer).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](163, "img", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](164, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](165, "Were almost done now its the time to add textures and decoration to our level, this is a good time to experiment to use some of the decoration objects like Particles, LensFlare, etc. I haven't done much regarding decoration simply added a couple of materials and colored everything up, added a LensFlare effect and some particles floating around the level.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](166, "img", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](167, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](168, "Since the player movement was also a little slow i tweaked it a bit by adding the option to run using the keyboard shift key and tweaking the movement to have an acceleration curve instead of instant move.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](169, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](170, "At the beginning of this tutorial i was planning to change the cube for a ball or lock its rotation but since i find it kinda of funny to see the cube tumbling around so i will leave it like this.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](171, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](172, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](173);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](174, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](175, "Result");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](176, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](177, "If you were able to make it this far congratulations, you have created an awseome platformer game. This should cover all the basic aspects for platformer games. If you have any doubt about any of the steps in the tutorial, feel free to ask me about it.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](178, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](179, "You can try the final result of this tutorial bellow (wasd keys to move).");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](180, "app-viewer", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](181, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](182, "Tweaking player controls");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](183, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](184, "If you wish to make the controls feel more like those in a classic platformer without the cube tumbling around the level you can add these little tweaks");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](185, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](186, "First, we need to change the player physics object to a sphere instead of a cube. This way our player will roll easily and won't get stuck to the walls. I chose to make the scale of the sphere ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](187, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](188, "(0.5, 0.5 , 0.5)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](189, " this way it fits our ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](190, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](191, "(1.0, 1.0, 1.0)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](192, " cube.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](193, "img", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](194, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](195, "As you can see in red we have also changed the angular damping value, this makes it so our ball won't roll very far after you released the button. You can tweak this value to find the one that suits you the most. I found that ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](196, "code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](197, "0.999");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](198, " works pretty good.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](199, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](200, "As you can see there is also a blue cube named 'playermesh', this mesh will represent our player. This can be a custom model if you wish, but make sure to change the sphere scale to fit your model.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](201, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](202, "We're almost done now, all we have to do is to teleport our player mesh to the physics object every frame, we can do this by copying the physics position to our player mesh in our update function.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](203, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](204, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](205);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](206, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](207, "If you followed all the steps you should now have smoother controls on your player. You can of course experiment with it as much as you want.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](208, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](209, "If you are having some trouble completing this part of the tutorial you can download the project fileou can download the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](210, "a", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](211, "project file");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](212, " or open it on the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](213, "a", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](214, "Web Editor");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](215, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](65);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("var player;\n\nfunction initialize()\n", "{", "\nplayer = scene.getObjectByName(\"player\");\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("function update()\n", "{", "\nif(Keyboard.keyPressed(Keyboard.A))\n", "{", "\n\tplayer.body.velocity.x = -5;\n", "}", "\nif(Keyboard.keyPressed(Keyboard.D))\n", "{", "\n\tplayer.body.velocity.x = 5;\n", "}", "\n\nif(Keyboard.keyJustPressed(Keyboard.W))\n", "{", "\n\tplayer.body.velocity.y = 10;\n", "}", "\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("function update()\n", "{", "\n...\n\nplayer.body.position.z = 0;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var player, world;\n\nfunction initialize()\n", "{", "\nworld = scene.world;\nplayer = scene.getObjectByName(\"player\");\nplayer.canJump = false;\n\nvar up = new Vector3(0, 1, 0);\nvar temp = new Vector3(0, 0, 0);\n\nworld.addEventListener(\"postStep\", function(e)\n", "{", "\n\tif(world.contacts.length > 0)\n\t", "{", "\n\t\tfor(var i = 0; i < world.contacts.length; i++)\n\t\t", "{", "\n\t\t\t//Get contact points\n\t\t\tvar contact = world.contacts[i];\n\n\t\t\t//Check if any of the physics elements in the contact is our player\n\t\t\tif(contact.bi.id === player.body.id || contact.bj.id === player.body.id)\n\t\t\t", "{", "\n\t\t\t\t//If our player is the first element negate direction and store in temp\n\t\t\t\tif(contact.bi.id === player.body.id)\n\t\t\t\t", "{", "\n\t\t\t\t\tcontact.ni.negate(temp);\n\t\t\t\t", "}", "\n\t\t\t\t//Else store direction in temp\n\t\t\t\telse\n\t\t\t\t", "{", "\n\t\t\t\t\tcontact.ni.copy(temp);\n\t\t\t\t", "}", "\n\n\t\t\t\t//If dot product if near 0 player is touching the floor and can jump again\n\t\t\t\tif(temp.dot(up) > 0.1)\n\t\t\t\t", "{", "\n\t\t\t\t\tplayer.canJump = true;\n\t\t\t\t", "}", "\n\t\t\t", "}", "\n\t\t", "}", "\n\t", "}", "\n", "}", ");\n", "}", "\n\nfunction update()\n", "{", "\n...\n\n\nif(player.canJump && Keyboard.keyJustPressed(Keyboard.W))\n", "{", "\n\tplayer.body.velocity.y = 10;\n\tplayer.canJump = false;\n", "}", "\n\n...\n\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var player, world, camera;\n\nfunction initialize()\n", "{", "\ncamera = scene.getObjectByName(\"camera\");\n\n...\n", "}", "\n\nfunction update()\n", "{", "\n...\n\ncamera.position.x = player.body.position.x;\ncamera.position.y = player.body.position.y + 2;\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("function initialize()\n", "{", "\n...\n\nplayer.spawn = player.position.clone();\n\nvar enemies = scene.getObjectByName(\"enemies\");\nfor(var i = 0; i < enemies.children.length; i++)\n", "{", "\n\tenemies.children[i].body.isEnemy = true;\n", "}", "\n\n...\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate8"]("function initialize()\n", "{", "\n...\n\nworld.addEventListener(\"postStep\", function(e)\n", "{", "\n\tif(world.contacts.length > 0)\n\t", "{", "\n\t\tfor(var i = 0; i < world.contacts.length; i++)\n\t\t", "{", "\n\t\t\t//Get contact points\n\t\t\tvar contact = world.contacts[i];\n\n\t\t\t//Check if any of the physics elements in the contact is our player\n\t\t\tif(contact.bi.id === player.body.id || contact.bj.id === player.body.id)\n\t\t\t", "{", "\n\t\t\t\t//Check if is an enemy\n\t\t\t\tif(contact.bi.isEnemy || contact.bj.isEnemy)\n\t\t\t\t", "{", "\n\t\t\t\t\tplayer.body.position.set(player.spawn.x, player.spawn.y, player.spawn.z);\n\t\t\t\t\tplayer.body.velocity.set(0, 0, 0);\n\t\t\t\t", "}", "\n\n...\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["var velocity = 0.05;\nvar min = -5;\nvar max = 5;\nvar direction = 1;\n\nvar enemy;\n\nfunction initialize()\n", "{", "\n//Get enemy\nenemy = self.parent;\n\n//Store a copy of original position\nenemy.spawn = enemy.position.clone();\n", "}", "\n\nfunction update()\n", "{", "\n//Position direction\nif(direction > 0)\n", "{", "\n\t//Check if position reached max\n\tif(enemy.body.position.x < enemy.spawn.x + max)\n\t", "{", "\n\t\tenemy.body.position.x += velocity;\n\t", "}", "\n\t//Invert direction\n\telse\n\t", "{", "\n\t\tdirection = -1;\n\t", "}", "\n", "}", "\n//Negative direction\nelse\n", "{", "\n\t//Check if position reached min\n\tif(enemy.body.position.x > enemy.spawn.x + min)\n\t", "{", "\n\t\tenemy.body.position.x -= velocity;\n\t", "}", "\n\t//Invert direction\n\telse\n\t", "{", "\n\t\tdirection = 1;\n\t", "}", "\n", "}", "\n", "}", "\n"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var gamepad;\n\nfunction initialize()\n", "{", "\ngamepad = new Gamepad();\n\n...\n", "}", "\n\nfunction update()\n", "{", "\ngamepad.update();\n\nif(Keyboard.keyPressed(Keyboard.A) || gamepad.buttonPressed(Gamepad.LEFT))\n\n...\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolateV"](["function update()\n", "{", "\n\n...\n\nvar velocity = 6;\nvar acceleration = 0.6;\n\nif(Keyboard.keyPressed(Keyboard.SHIFT))\n", "{", "\n\tvelocity = 8;\n\tacceleration = 1;\n", "}", "\n\nif(Keyboard.keyPressed(Keyboard.A) || gamepad.buttonPressed(Gamepad.LEFT))\n", "{", "\n\tif(player.body.velocity.x > -velocity)\n\t", "{", "\n\t\tplayer.body.velocity.x -= acceleration;\n\t", "}", "\n", "}", "\nif(Keyboard.keyPressed(Keyboard.D) || gamepad.buttonPressed(Gamepad.RIGHT))\n", "{", "\n\tif(player.body.velocity.x < velocity)\n\t", "{", "\n\t\tplayer.body.velocity.x += acceleration;\n\t", "}", "\n", "}", "\n\n...\n\n", "}", ""]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate4"]("var playermesh;\n\nfunction initialize()\n", "{", "\n...\n\nplayermesh = scene.getObjectByName(\"playermesh\");\n\n...\n", "}", ";\n\nfunction update()\n", "{", "\n...\n\n//Copy the position of our physics object to our player mesh\nplayermesh.position.copy(player.body.position);\n\n...\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _components_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_2__["AppViewerComponent"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PlatformerPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'platformer-page',
                templateUrl: './platformer.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "sExc":
/*!*************************************************************!*\
  !*** ./src/page/learn/tutorial/minecraft/minecraft.page.ts ***!
  \*************************************************************/
/*! exports provided: MinecraftPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MinecraftPage", function() { return MinecraftPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class MinecraftPage {
}
MinecraftPage.ɵfac = function MinecraftPage_Factory(t) { return new (t || MinecraftPage)(); };
MinecraftPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MinecraftPage, selectors: [["minecraft-page"]], decls: 31, vars: 12, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], [1, "hljs", "javascript"], ["src", "assets/learn/tutorial/minecraft/images/a.png", 1, "img-normal"]], template: function MinecraftPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Minecraft");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will learn how to create a minecraft clone with a simple voxel generator, basic navigation and building capabilities.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Most of this tutorial will be code based, TODO.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Creating a basic world");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Lets start by creating a simple minecraft like world using trignometric functions. The code bellow generates a wordls with size (200, 200), the block height is calculated by the coside of x plus the cosine z times the sine of x.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Feel free to experiment with the terrain generation code, until you find a configuration that you like.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "The image bellow represents the result generated by the code above. The performance of this approach will be very slow since we are updating 40000 individual objects every frame, this will be very expensive on CPU and memory resources. But don't worry about it its totally fine we will improve this by merging all the cubes into a single mesh.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "The code bellow shows how to create the world from merged geometry, by translating and merging multiple times the cube geometry into the same geometry.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Performance will be really good, but there is a problem with this approach, to remove a cube from the geometry we have to change the hole geometry.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("function initialize()\n", "{", "\nvar geometry = new BoxBufferGeometry(1, 1, 1);\nvar material = program.getMaterialByName(\"phong\");\n\nfor(var x = 0; x < 200; x++)\n", "{", "\n\tfor(var z = 0; z < 200; z++)\n\t", "{", "\n\t\tvar cube = new Mesh(geometry, material);\n\t\tcube.position.set(x, Math.floor(Math.cos(x / 25) * 5 + Math.cos(z / 20 * Math.sin(x / 100) * 2) * 3), z);\n\t\tscene.add(cube);\n\t", "}", "\n", "}", "\n", "}", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate6"]("function initialize()\n", "{", "\nvar geometry = new Geometry();\nvar cube = new BoxGeometry(1, 1, 1);\nvar matrix = new Matrix4();\n\nfor(var x = 0; x < 200; x++)\n", "{", "\n\tfor(var z = 0; z < 200; z++)\n\t", "{", "\n\t\tmatrix.makeTranslation(x, heightFunction(x, z), z);\n\t\tgeometry.merge(cube, matrix);\n\t", "}", "\n", "}", "\n\nvar material = program.getMaterialByName(\"phong\");\nvar mesh = new Mesh(geometry, material);\nscene.add(mesh);\n", "}", "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MinecraftPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'minecraft-page',
                templateUrl: './minecraft.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "t37x":
/*!*******************************************************!*\
  !*** ./src/page/learn/basics/shaders/shaders.page.ts ***!
  \*******************************************************/
/*! exports provided: ShadersPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShadersPage", function() { return ShadersPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class ShadersPage {
}
ShadersPage.ɵfac = function ShadersPage_Factory(t) { return new (t || ShadersPage)(); };
ShadersPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ShadersPage, selectors: [["shaders-page"]], decls: 20, vars: 0, consts: [[1, "pad-sm"], [1, "container"], ["routerLink", "/learn"], ["href", "https://threejs.org/docs/#api/en/materials/ShaderMaterial"], ["href", "https://threejs.org/docs/#api/en/materials/RawShaderMaterial"]], template: function ShadersPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "u");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Back");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Shaders");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "In this tutorial we will explore how we can write our own shaders code using GLSL inside of nunuStudio. Shader materials can be added to the project, there are two types of shader materials the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "ShaderMaterial");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " and ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "RawShaderMaterial");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, ".");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "ShaderMaterial should suit most use cases it is directly based on the three.js shader material and already gives access to the default attributes available in the renderer. RawShaderMaterial gives you more control over but requires a better undestending of the engine underlines.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Under work!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ShadersPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'shaders-page',
                templateUrl: './shaders.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "tx3l":
/*!****************************************!*\
  !*** ./src/page/learn/learn.module.ts ***!
  \****************************************/
/*! exports provided: LearnModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LearnModule", function() { return LearnModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _basics_basics_basics_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./basics/basics/basics.page */ "41eV");
/* harmony import */ var _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./basics/terrain/terrain.page */ "5IiC");
/* harmony import */ var _basics_shaders_shaders_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./basics/shaders/shaders.page */ "t37x");
/* harmony import */ var _basics_python_python_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./basics/python/python.page */ "rBNf");
/* harmony import */ var _basics_ar_ar_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./basics/ar/ar.page */ "aTom");
/* harmony import */ var _integration_embedding_embedding_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./integration/embedding/embedding.page */ "brmB");
/* harmony import */ var _integration_communication_communication_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./integration/communication/communication.page */ "4JuM");
/* harmony import */ var _tutorial_platformer_platformer_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tutorial/platformer/platformer.page */ "s3n1");
/* harmony import */ var _basics_script_script_page__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./basics/script/script.page */ "pHOW");
/* harmony import */ var _basics_video_video_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./basics/video/video.page */ "NJxU");
/* harmony import */ var _basics_joystick_joystick_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./basics/joystick/joystick.page */ "j47R");
/* harmony import */ var _basics_timeline_timeline_page__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./basics/timeline/timeline.page */ "rl0J");
/* harmony import */ var _basics_water_water_page__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./basics/water/water.page */ "dnth");
/* harmony import */ var _tutorial_minecraft_minecraft_page__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tutorial/minecraft/minecraft.page */ "sExc");
/* harmony import */ var _tutorial_networking_networking_page__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tutorial/networking/networking.page */ "UGhw");
/* harmony import */ var _basics_animation_animation_page__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./basics/animation/animation.page */ "hAjc");
/* harmony import */ var _basics_audio_audio_page__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./basics/audio/audio.page */ "UrOq");
/* harmony import */ var _basics_camera_camera_page__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./basics/camera/camera.page */ "q+Zp");
/* harmony import */ var _basics_gyroscope_gyroscope_page__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./basics/gyroscope/gyroscope.page */ "1LOU");
/* harmony import */ var _basics_materials_materials_page__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./basics/materials/materials.page */ "gQ30");
/* harmony import */ var _basics_particles_particles_page__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./basics/particles/particles.page */ "3RJ4");
/* harmony import */ var _basics_physics_physics_page__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./basics/physics/physics.page */ "0onX");
/* harmony import */ var _basics_postprocessing_postprocessing_page__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./basics/postprocessing/postprocessing.page */ "f8at");
/* harmony import */ var _basics_raycaster_raycaster_page__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./basics/raycaster/raycaster.page */ "3Yih");
/* harmony import */ var _basics_text_text_page__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./basics/text/text.page */ "2/ro");
/* harmony import */ var _basics_vr_vr_page__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./basics/vr/vr.page */ "LlGS");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../components/components.module */ "xOzl");






























class LearnModule {
}
LearnModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: LearnModule });
LearnModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function LearnModule_Factory(t) { return new (t || LearnModule)(); }, imports: [[
            _angular_router__WEBPACK_IMPORTED_MODULE_27__["RouterModule"],
            _components_components_module__WEBPACK_IMPORTED_MODULE_28__["ComponentsModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](LearnModule, { declarations: [
        // Basics
        _basics_basics_basics_page__WEBPACK_IMPORTED_MODULE_1__["BasicsPage"],
        _basics_shaders_shaders_page__WEBPACK_IMPORTED_MODULE_3__["ShadersPage"],
        _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_2__["TerrainPage"],
        _basics_python_python_page__WEBPACK_IMPORTED_MODULE_4__["PythonPage"],
        _basics_ar_ar_page__WEBPACK_IMPORTED_MODULE_5__["ArPage"],
        _basics_script_script_page__WEBPACK_IMPORTED_MODULE_9__["ScriptPage"],
        _basics_video_video_page__WEBPACK_IMPORTED_MODULE_10__["VideoPage"],
        _basics_joystick_joystick_page__WEBPACK_IMPORTED_MODULE_11__["JoystickPage"],
        _basics_timeline_timeline_page__WEBPACK_IMPORTED_MODULE_12__["TimelinePage"],
        _basics_water_water_page__WEBPACK_IMPORTED_MODULE_13__["WaterPage"],
        _basics_video_video_page__WEBPACK_IMPORTED_MODULE_10__["VideoPage"],
        _basics_animation_animation_page__WEBPACK_IMPORTED_MODULE_16__["AnimationPage"],
        _basics_audio_audio_page__WEBPACK_IMPORTED_MODULE_17__["AudioPage"],
        _basics_camera_camera_page__WEBPACK_IMPORTED_MODULE_18__["CameraPage"],
        _basics_gyroscope_gyroscope_page__WEBPACK_IMPORTED_MODULE_19__["GyroscopePage"],
        _basics_materials_materials_page__WEBPACK_IMPORTED_MODULE_20__["MaterialsPage"],
        _basics_particles_particles_page__WEBPACK_IMPORTED_MODULE_21__["ParticlesPage"],
        _basics_physics_physics_page__WEBPACK_IMPORTED_MODULE_22__["PhysicsPage"],
        _basics_postprocessing_postprocessing_page__WEBPACK_IMPORTED_MODULE_23__["PostProcessingPage"],
        _basics_raycaster_raycaster_page__WEBPACK_IMPORTED_MODULE_24__["RaycasterPage"],
        _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_2__["TerrainPage"],
        _basics_text_text_page__WEBPACK_IMPORTED_MODULE_25__["TextPage"],
        _basics_vr_vr_page__WEBPACK_IMPORTED_MODULE_26__["VrPage"],
        // Integration
        _integration_communication_communication_page__WEBPACK_IMPORTED_MODULE_7__["CommunicationPage"],
        _integration_embedding_embedding_page__WEBPACK_IMPORTED_MODULE_6__["EmbeddingPage"],
        // Tutorial
        _tutorial_platformer_platformer_page__WEBPACK_IMPORTED_MODULE_8__["PlatformerPage"],
        _tutorial_minecraft_minecraft_page__WEBPACK_IMPORTED_MODULE_14__["MinecraftPage"],
        _tutorial_networking_networking_page__WEBPACK_IMPORTED_MODULE_15__["NetworkingPage"]], imports: [_angular_router__WEBPACK_IMPORTED_MODULE_27__["RouterModule"],
        _components_components_module__WEBPACK_IMPORTED_MODULE_28__["ComponentsModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LearnModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _angular_router__WEBPACK_IMPORTED_MODULE_27__["RouterModule"],
                    _components_components_module__WEBPACK_IMPORTED_MODULE_28__["ComponentsModule"],
                ],
                declarations: [
                    // Basics
                    _basics_basics_basics_page__WEBPACK_IMPORTED_MODULE_1__["BasicsPage"],
                    _basics_shaders_shaders_page__WEBPACK_IMPORTED_MODULE_3__["ShadersPage"],
                    _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_2__["TerrainPage"],
                    _basics_python_python_page__WEBPACK_IMPORTED_MODULE_4__["PythonPage"],
                    _basics_ar_ar_page__WEBPACK_IMPORTED_MODULE_5__["ArPage"],
                    _basics_script_script_page__WEBPACK_IMPORTED_MODULE_9__["ScriptPage"],
                    _basics_video_video_page__WEBPACK_IMPORTED_MODULE_10__["VideoPage"],
                    _basics_joystick_joystick_page__WEBPACK_IMPORTED_MODULE_11__["JoystickPage"],
                    _basics_timeline_timeline_page__WEBPACK_IMPORTED_MODULE_12__["TimelinePage"],
                    _basics_water_water_page__WEBPACK_IMPORTED_MODULE_13__["WaterPage"],
                    _basics_video_video_page__WEBPACK_IMPORTED_MODULE_10__["VideoPage"],
                    _basics_animation_animation_page__WEBPACK_IMPORTED_MODULE_16__["AnimationPage"],
                    _basics_audio_audio_page__WEBPACK_IMPORTED_MODULE_17__["AudioPage"],
                    _basics_camera_camera_page__WEBPACK_IMPORTED_MODULE_18__["CameraPage"],
                    _basics_gyroscope_gyroscope_page__WEBPACK_IMPORTED_MODULE_19__["GyroscopePage"],
                    _basics_materials_materials_page__WEBPACK_IMPORTED_MODULE_20__["MaterialsPage"],
                    _basics_particles_particles_page__WEBPACK_IMPORTED_MODULE_21__["ParticlesPage"],
                    _basics_physics_physics_page__WEBPACK_IMPORTED_MODULE_22__["PhysicsPage"],
                    _basics_postprocessing_postprocessing_page__WEBPACK_IMPORTED_MODULE_23__["PostProcessingPage"],
                    _basics_raycaster_raycaster_page__WEBPACK_IMPORTED_MODULE_24__["RaycasterPage"],
                    _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_2__["TerrainPage"],
                    _basics_text_text_page__WEBPACK_IMPORTED_MODULE_25__["TextPage"],
                    _basics_vr_vr_page__WEBPACK_IMPORTED_MODULE_26__["VrPage"],
                    // Integration
                    _integration_communication_communication_page__WEBPACK_IMPORTED_MODULE_7__["CommunicationPage"],
                    _integration_embedding_embedding_page__WEBPACK_IMPORTED_MODULE_6__["EmbeddingPage"],
                    // Tutorial
                    _tutorial_platformer_platformer_page__WEBPACK_IMPORTED_MODULE_8__["PlatformerPage"],
                    _tutorial_minecraft_minecraft_page__WEBPACK_IMPORTED_MODULE_14__["MinecraftPage"],
                    _tutorial_networking_networking_page__WEBPACK_IMPORTED_MODULE_15__["NetworkingPage"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "xOzl":
/*!*********************************************!*\
  !*** ./src/components/components.module.ts ***!
  \*********************************************/
/*! exports provided: ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-viewer/app-viewer.component */ "d+mn");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");




class ComponentsModule {
}
ComponentsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: ComponentsModule });
ComponentsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function ComponentsModule_Factory(t) { return new (t || ComponentsModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](ComponentsModule, { declarations: [_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_1__["AppViewerComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]], exports: [_app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_1__["AppViewerComponent"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ComponentsModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                exports: [
                    _app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_1__["AppViewerComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
                ],
                declarations: [
                    _app_viewer_app_viewer_component__WEBPACK_IMPORTED_MODULE_1__["AppViewerComponent"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "xoFZ":
/*!****************************************!*\
  !*** ./src/page/learn/learn.routes.ts ***!
  \****************************************/
/*! exports provided: LearnRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LearnRoutes", function() { return LearnRoutes; });
/* harmony import */ var _basics_basics_basics_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./basics/basics/basics.page */ "41eV");
/* harmony import */ var _basics_ar_ar_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./basics/ar/ar.page */ "aTom");
/* harmony import */ var _basics_shaders_shaders_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./basics/shaders/shaders.page */ "t37x");
/* harmony import */ var _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./basics/terrain/terrain.page */ "5IiC");
/* harmony import */ var _basics_python_python_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./basics/python/python.page */ "rBNf");
/* harmony import */ var _integration_communication_communication_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./integration/communication/communication.page */ "4JuM");
/* harmony import */ var _integration_embedding_embedding_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./integration/embedding/embedding.page */ "brmB");
/* harmony import */ var _tutorial_platformer_platformer_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tutorial/platformer/platformer.page */ "s3n1");
/* harmony import */ var _tutorial_minecraft_minecraft_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tutorial/minecraft/minecraft.page */ "sExc");
/* harmony import */ var _tutorial_networking_networking_page__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tutorial/networking/networking.page */ "UGhw");
/* harmony import */ var _basics_animation_animation_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./basics/animation/animation.page */ "hAjc");
/* harmony import */ var _basics_audio_audio_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./basics/audio/audio.page */ "UrOq");
/* harmony import */ var _basics_camera_camera_page__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./basics/camera/camera.page */ "q+Zp");
/* harmony import */ var _basics_gyroscope_gyroscope_page__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./basics/gyroscope/gyroscope.page */ "1LOU");
/* harmony import */ var _basics_joystick_joystick_page__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./basics/joystick/joystick.page */ "j47R");
/* harmony import */ var _basics_materials_materials_page__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./basics/materials/materials.page */ "gQ30");
/* harmony import */ var _basics_particles_particles_page__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./basics/particles/particles.page */ "3RJ4");
/* harmony import */ var _basics_physics_physics_page__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./basics/physics/physics.page */ "0onX");
/* harmony import */ var _basics_postprocessing_postprocessing_page__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./basics/postprocessing/postprocessing.page */ "f8at");
/* harmony import */ var _basics_raycaster_raycaster_page__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./basics/raycaster/raycaster.page */ "3Yih");
/* harmony import */ var _basics_script_script_page__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./basics/script/script.page */ "pHOW");
/* harmony import */ var _basics_text_text_page__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./basics/text/text.page */ "2/ro");
/* harmony import */ var _basics_timeline_timeline_page__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./basics/timeline/timeline.page */ "rl0J");
/* harmony import */ var _basics_video_video_page__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./basics/video/video.page */ "NJxU");
/* harmony import */ var _basics_vr_vr_page__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./basics/vr/vr.page */ "LlGS");
/* harmony import */ var _basics_water_water_page__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./basics/water/water.page */ "dnth");


























const LearnRoutes = [
    {
        path: 'learn/basics/animation',
        component: _basics_animation_animation_page__WEBPACK_IMPORTED_MODULE_10__["AnimationPage"]
    },
    {
        path: 'learn/basics/ar',
        component: _basics_ar_ar_page__WEBPACK_IMPORTED_MODULE_1__["ArPage"]
    },
    {
        path: 'learn/basics/audio',
        component: _basics_audio_audio_page__WEBPACK_IMPORTED_MODULE_11__["AudioPage"]
    },
    {
        path: 'learn/basics/basics',
        component: _basics_basics_basics_page__WEBPACK_IMPORTED_MODULE_0__["BasicsPage"]
    },
    {
        path: 'learn/basics/camera',
        component: _basics_camera_camera_page__WEBPACK_IMPORTED_MODULE_12__["CameraPage"]
    },
    {
        path: 'learn/basics/gyroscope',
        component: _basics_gyroscope_gyroscope_page__WEBPACK_IMPORTED_MODULE_13__["GyroscopePage"]
    },
    {
        path: 'learn/basics/joystick',
        component: _basics_joystick_joystick_page__WEBPACK_IMPORTED_MODULE_14__["JoystickPage"]
    },
    {
        path: 'learn/basics/materials',
        component: _basics_materials_materials_page__WEBPACK_IMPORTED_MODULE_15__["MaterialsPage"]
    },
    {
        path: 'learn/basics/particles',
        component: _basics_particles_particles_page__WEBPACK_IMPORTED_MODULE_16__["ParticlesPage"]
    },
    {
        path: 'learn/basics/physics',
        component: _basics_physics_physics_page__WEBPACK_IMPORTED_MODULE_17__["PhysicsPage"]
    },
    {
        path: 'learn/basics/python',
        component: _basics_python_python_page__WEBPACK_IMPORTED_MODULE_4__["PythonPage"]
    },
    {
        path: 'learn/basics/postprocessing',
        component: _basics_postprocessing_postprocessing_page__WEBPACK_IMPORTED_MODULE_18__["PostProcessingPage"]
    },
    {
        path: 'learn/basics/raycaster',
        component: _basics_raycaster_raycaster_page__WEBPACK_IMPORTED_MODULE_19__["RaycasterPage"]
    },
    {
        path: 'learn/basics/script',
        component: _basics_script_script_page__WEBPACK_IMPORTED_MODULE_20__["ScriptPage"]
    },
    {
        path: 'learn/basics/shaders',
        component: _basics_shaders_shaders_page__WEBPACK_IMPORTED_MODULE_2__["ShadersPage"]
    },
    {
        path: 'learn/basics/terrain',
        component: _basics_terrain_terrain_page__WEBPACK_IMPORTED_MODULE_3__["TerrainPage"]
    },
    {
        path: 'learn/basics/text',
        component: _basics_text_text_page__WEBPACK_IMPORTED_MODULE_21__["TextPage"]
    },
    {
        path: 'learn/basics/timeline',
        component: _basics_timeline_timeline_page__WEBPACK_IMPORTED_MODULE_22__["TimelinePage"]
    },
    {
        path: 'learn/basics/video',
        component: _basics_video_video_page__WEBPACK_IMPORTED_MODULE_23__["VideoPage"]
    },
    {
        path: 'learn/basics/vr',
        component: _basics_vr_vr_page__WEBPACK_IMPORTED_MODULE_24__["VrPage"]
    },
    {
        path: 'learn/basics/water',
        component: _basics_water_water_page__WEBPACK_IMPORTED_MODULE_25__["WaterPage"]
    },
    // Integration
    {
        path: 'learn/integration/communication',
        component: _integration_communication_communication_page__WEBPACK_IMPORTED_MODULE_5__["CommunicationPage"],
    },
    {
        path: 'learn/integration/embedding',
        component: _integration_embedding_embedding_page__WEBPACK_IMPORTED_MODULE_6__["EmbeddingPage"]
    },
    // Tutorial
    {
        path: 'learn/tutorial/platformer',
        component: _tutorial_platformer_platformer_page__WEBPACK_IMPORTED_MODULE_7__["PlatformerPage"]
    },
    {
        path: 'learn/tutorial/networking',
        component: _tutorial_networking_networking_page__WEBPACK_IMPORTED_MODULE_9__["NetworkingPage"]
    },
    {
        path: 'learn/tutorial/minecraft',
        component: _tutorial_minecraft_minecraft_page__WEBPACK_IMPORTED_MODULE_8__["MinecraftPage"]
    },
];


/***/ }),

/***/ "zFIy":
/*!**************************************!*\
  !*** ./src/page/learn/learn.page.ts ***!
  \**************************************/
/*! exports provided: LearnPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LearnPage", function() { return LearnPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");




function LearnPage_div_11_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("routerLink", option_r3.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](option_r3.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](option_r3.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("src", option_r3.image, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function LearnPage_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, LearnPage_div_11_div_6_Template, 6, 4, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const section_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](section_r1.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](section_r1.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", section_r1.options);
} }
class LearnPageOption {
}
class LearnPageSection {
}
class LearnPage {
    constructor() {
        this.sections = [
            {
                title: 'Getting started',
                description: 'These tutorials introduce the basic contents of the platform, do not require any previous programming knowledge and explore the most basic features of the editor.',
                options: [
                    {
                        title: 'Editor Basics',
                        description: 'This tutorials introduces the editor UI and some basic features.',
                        url: '/learn/basics/basics',
                        image: 'assets/learn/basics/basics/thumb.png'
                    },
                    {
                        title: 'First script',
                        description: 'This tutorial explains the basics about scripting inside nunuStudio.',
                        url: '/learn/basics/script',
                        image: 'assets/learn/basics/script/thumb.png'
                    },
                    {
                        title: 'Cameras',
                        description: 'This tutorial introduces the different camera types available and how to use them',
                        url: '/learn/basics/camera',
                        image: 'assets/learn/basics/camera/thumb.png'
                    },
                    {
                        title: 'Materials',
                        description: 'This tutorials explains what a material is and what types of materials are available.',
                        url: '/learn/basics/materials',
                        image: 'assets/learn/basics/materials/thumb.png'
                    },
                    {
                        title: 'Particles',
                        description: 'This tutorials introduces particles and the particle editor.',
                        url: '/learn/basics/particles',
                        image: 'assets/learn/basics/particles/thumb.png'
                    },
                    {
                        title: 'Audio',
                        description: 'Audio inside nunuStudio. Effects, positional audio and basic scripting.',
                        url: '/learn/basics/audio',
                        image: 'assets/learn/basics/audio/thumb.png'
                    },
                    {
                        title: 'Text',
                        description: 'Text basics inside nunu, create text objects, import external fonts, control text.',
                        url: '/learn/basics/text',
                        image: 'assets/learn/basics/text/thumb.png'
                    },
                    {
                        title: 'Physics',
                        description: 'How to add, use and control physics objects inside nunuStudio.',
                        url: '/learn/basics/physics',
                        image: 'assets/learn/basics/physics/thumb.png'
                    },
                    {
                        title: 'Gyroscope',
                        description: 'Use gyroscope to control objects and create panoramic visualizations.',
                        url: '/learn/basics/gyroscope',
                        image: 'assets/learn/basics/gyroscope/thumb.png'
                    },
                    {
                        title: 'Virtual Reality',
                        description: 'Create a virtual reality project using nunuStudio.',
                        url: '/learn/basics/vr',
                        image: 'assets/learn/basics/vr/thumb.png'
                    },
                    {
                        title: 'Raycasting',
                        description: 'Use a raycaster to interact with 3D objects using the mouse.',
                        url: '/learn/basics/raycaster',
                        image: 'assets/learn/basics/raycaster/thumb.png'
                    },
                    {
                        title: 'Animation',
                        description: 'Guide to create and import 2D and 3D animations into the editor.',
                        url: '/learn/basics/animation',
                        image: 'assets/learn/basics/animation/thumb.png'
                    },
                    {
                        title: 'Water',
                        description: 'Create a 3D water effect using materials and textures.',
                        url: '/learn/basics/water',
                        image: 'assets/learn/basics/water/thumb.png'
                    },
                    {
                        title: 'Joystick',
                        description: 'Use an external library to integrate a onscreen joystick.',
                        url: '/learn/basics/joystick',
                        image: 'assets/learn/basics/joystick/thumb.png'
                    },
                    {
                        title: 'Timeline',
                        description: 'Timeline editor to create animations.',
                        url: '/learn/basics/timeline',
                        image: 'assets/learn/basics/timeline/thumb.png'
                    },
                    {
                        title: 'Post-processing',
                        description: 'Post-procesing camera effects pipeline.',
                        url: '/learn/basics/postprocessing',
                        image: 'assets/learn/basics/postprocessing/thumb.png'
                    },
                    {
                        title: 'Video',
                        description: 'How to import and use video files in nunuStudio.',
                        url: '/learn/basics/video',
                        image: 'assets/learn/basics/video/thumb.png'
                    },
                    {
                        title: 'Shaders',
                        description: 'Build new materials using GLSL shader code.',
                        url: '/learn/basics/shaders',
                        image: 'assets/learn/basics/shaders/thumb.jpg'
                    },
                    {
                        title: 'Terrain',
                        description: 'Learn how to use existing three.js based libraries.',
                        url: '/learn/basics/terrain',
                        image: 'assets/learn/basics/terrain/thumb.jpg'
                    }
                ]
            },
            {
                title: 'Tutorials',
                description: 'These tutorials will help you to build your first fully functional games and experiences inside nunuStudio with step by step guides. Before starting these i recommend you to first experiment with some of the beginner guides.',
                options: [
                    {
                        title: 'Platformer Game',
                        description: 'This tutorial will teach you how to create a mario style platformer game.',
                        url: '/learn/tutorial/platformer',
                        image: 'assets/learn/tutorial/platformer/thumb.png'
                    },
                    {
                        title: 'Multiplayer Shooter',
                        description: 'In this tutorial we will explore how to create a networked multiplayer game using websockets and nodejs.',
                        url: '/learn/tutorial/networking',
                        image: 'assets/learn/tutorial/networking/thumb.png'
                    }
                ]
            },
            {
                title: 'Integration',
                description: 'These guides will help you to integrate nunuStudio applications inside you webpage, how to transfer data between the webpage and the application, etc. For these guides more advanced javascript knowledge is required.',
                options: [
                    {
                        title: 'Embedding',
                        description: 'This guide will help you to embedded nunuStudio applications inside your webpage.',
                        url: '/learn/integration/embedding',
                        image: 'assets/learn/integration/embedding/thumb.png'
                    },
                    {
                        title: 'Communication',
                        description: 'Learn how to transfer data between your running applications and you webpage.',
                        url: '/learn/integration/communication',
                        image: 'assets/learn/integration/communication/thumb.png'
                    }
                ]
            }
        ];
    }
}
LearnPage.ɵfac = function LearnPage_Factory(t) { return new (t || LearnPage)(); };
LearnPage.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LearnPage, selectors: [["learn-page"]], decls: 12, vars: 1, consts: [[1, "container", 2, "padding-bottom", "30px", "padding-top", "30px"], ["href", "docs/index.html", 1, "underline"], [1, "container"], ["style", "padding-bottom: 30px; padding-top: 30px;", 4, "ngFor", "ngForOf"], [2, "padding-bottom", "30px", "padding-top", "30px"], [1, "row"], ["style", "cursor: pointer;", "class", "col-md-3", 3, "routerLink", 4, "ngFor", "ngForOf"], [1, "col-md-3", 2, "cursor", "pointer", 3, "routerLink"], [2, "border-radius", "5px", "width", "100%", 3, "src"]], template: function LearnPage_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Learn");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "This page provides step by step tutorials for learning how to use nanoStudio, these tutorials will guide you through the editor tools and explain how they can be used to create dynamic web experiences in 3D.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "For documentation about the nunuStudio scripting API check the ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "API Documentation");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " page.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, LearnPage_div_11_Template, 7, 3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.sections);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLink"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LearnPage, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'learn-page',
                templateUrl: './learn.page.html'
            }]
    }], null, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! highlight.js/lib/core */ "ECCn");
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! highlight.js/lib/languages/javascript */ "TdF3");
/* harmony import */ var highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! highlight.js/lib/languages/python */ "lRCX");
/* harmony import */ var highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! highlight.js/lib/languages/xml */ "jctj");
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module */ "S8hu");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");






highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('javascript', highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_1___default.a);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('xml', highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_3___default.a);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('python', highlight_js_lib_languages_python__WEBPACK_IMPORTED_MODULE_2___default.a);
highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0___default.a.initHighlightingOnLoad();
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["platformBrowser"]().bootstrapModule(_module__WEBPACK_IMPORTED_MODULE_4__["Module"]);


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map