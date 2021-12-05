<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/logo.png">

[![GitHub version](https://badge.fury.io/gh/tentone%2FnunuStudio.svg)](https://badge.fury.io/gh/tentone%2FnunuStudio)[![npm version](https://badge.fury.io/js/nunu-studio.svg)](https://badge.fury.io/js/nunu-studio)[![GitHub issues](https://img.shields.io/github/issues/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/issues) [![GitHub stars](https://img.shields.io/github/stars/tentone/nunuStudio.svg)](https://github.com/tentone/nunuStudio/stargazers)

- nunuStudio is an open source  game engine for the web it allows designers and web developers to easily develop 3D experiences for the web.
- Powered by [three.js](https://github.com/mrdoob/three.js) can run directly in the web or be exported as desktop application trough [nwjs.io](https://nwjs.io).
- Fully featured visual editor, supports a wide range of file formats, the tools are open source and completely free to use for both personal and commercial usage.
- Visual scene editor, code editor, visual tools to edit textures, materials, particle emitters and a powerful scripting API that allows the creation of complex applications using [JavaScript](https://www.javascript.com/) or [Python](https://www.python.org/).
- Fully featured [web version](https://www.nunustudio.org/build/editor/index.html) of the editor is available on the project page.
- The web version is tested with [Firefox](https://www.mozilla.org/en-US/firefox/new/), [Chrome](https://www.google.com/chrome/) and [Microsoft Edge](https://www.microsoft.com/en-us/edge), mobile browsers are supported as well.

<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/web.png">



### Getting Started

- [API Documentation](https://nunustudio.org/docs) with full details about the inner working of every module are available. These can also be generated from the project source code by running `npm run docs`.
- Basic tutorials are available on the [project page](https://www.nunustudio.org/learn). The basic tutorials explain step-by-step how to use the editor.
- To build the project first install [Node.js LTS](https://nodejs.org/en/) and NPM:
  - The building system generates minified builds for the runtime and for the editor
  - Documentation generation uses [YuiDocs](https://yui.github.io/yuidoc/)
  - Install dependencies from npm by running `npm install --legacy-peer-deps` and additional non-npm packages using `npm run napa`
  - Build  editor, runtime and documentation, run `npm run build`
- Webpage of the project is built using [Angular](https://angular.io/) and is hosted on [GitHub Pages](https://pages.github.com/)



### Screenshots

<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/2.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/3.png">
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/4.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/1.png">
<img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/5.png"><img src="https://raw.githubusercontent.com/tentone/nunuStudio/master/source/page/src/assets/github/6.png">



### Features

- Visual application editor
  - Drag and drop files directly into the project (images, video, models, ...)
  - Manage project resources.
  - Edit material, textures, shaders, code, ...
- Built on [three.js](https://threejs.org/) library w/ physics by [cannon.js](https://schteppe.github.io/cannon.js/)
  - Real time lighting and shadow map support
  - three.js libraries can be imported into the editor
  - Wide range of file formats supported (gltf, dae, obj, fbx, 3ds, ...)
- [NW.js](https://nwjs.io/) and [Cordova](https://cordova.apache.org/) exports for desktop and mobile deployment
- Compatible with [WebXR](https://www.w3.org/TR/webxr/) for Virtual Reality and Augmented Reality



#### Embedding Application

- Application developed with can be embedded into already existing web pages, and are compatible with frameworks like [Angular](https://angular.io/) or [React](https://reactjs.org/).
- To embed applications in HTML pages the following code can be used, the application is bootstrapped using the `loadApp(file, id)` method.

```html
<html>
    <head>
        <script src="nunu.min.js"></script>
    </head>
    <body onload="Nunu.App.loadApp('pong.nsp', 'canvas')">
        <canvas width="800" height="480" id="canvas"></canvas>
    </body>
</html>
```

### License

- The project is distributed under a MIT license that allow for commercial usage of the platform without any cost.
- The license is available on the project GitHub page
