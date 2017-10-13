/*
 * @author Joshua Koo http://joshuakoo.com
 */

var undo = require('./util_undo'),
	Dispatcher = require('./util_dispatcher'),
	Theme = require('./theme'),
	UndoManager = undo.UndoManager,
	UndoState = undo.UndoState,
	Settings = require('./settings'),
	utils = require('./utils'),
	LayerCabinet = require('./view_layer_cabinet'),
	TimelinePanel = require('./view_panel'),
	package_json = require('../package.json'),
	IconButton = require('./ui_icon_button'),
	style = utils.style,
	saveToFile = utils.saveToFile,
	openAs = utils.openAs,
	STORAGE_PREFIX = utils.STORAGE_PREFIX,
	ScrollBar = require('./ui_scrollbar'),
	DataStore = require('./util_datastore')
	;

var Z_INDEX = 999;

function LayerProp(name) {
	this.name = name;
	this.values = [];

	this._value = 0;

	this._color = '#' + (Math.random() * 0xffffff | 0).toString(16);
	/*
	this.max
	this.min
	this.step
	*/
}

function Timeliner(target) {
	// Dispatcher for coordination
	var dispatcher = new Dispatcher();

	// Data
	var data = new DataStore();
	var layer_store = data.get('layers');
	var layers = layer_store.value;

	window._data = data; // expose it for debugging

	// Undo manager
	var undo_manager = new UndoManager(dispatcher);

	// Views
	var timeline = new TimelinePanel(data, dispatcher);
	var layer_panel = new LayerCabinet(data, dispatcher);

	setTimeout(function() {
		// hack!
		undo_manager.save(new UndoState(data, 'Loaded'), true);
	});

	dispatcher.on('keyframe', function(layer, value) {
		var index = layers.indexOf(layer);

		var t = data.get('ui:currentTime').value;
		var v = utils.findTimeinLayer(layer, t);

		// console.log(v, '...keyframe index', index, utils.format_friendly_seconds(t), typeof(v));
		// console.log('layer', layer, value);

		if (typeof(v) === 'number') {
			layer.values.splice(v, 0, {
				time: t,
				value: value,
				_color: '#' + (Math.random() * 0xffffff | 0).toString(16)
			});

			undo_manager.save(new UndoState(data, 'Add Keyframe'));
		} else {
			console.log('remove from index', v);
			layer.values.splice(v.index, 1);

			undo_manager.save(new UndoState(data, 'Remove Keyframe'));
		}

		repaintAll();

	});

	dispatcher.on('keyframe.move', function(layer, value) {
		undo_manager.save(new UndoState(data, 'Move Keyframe'));
	});

	// dispatcher.fire('value.change', layer, me.value);
	dispatcher.on('value.change', function(layer, value, dont_save) {
		if (layer._mute) return;

		var t = data.get('ui:currentTime').value;
		var v = utils.findTimeinLayer(layer, t);

		// console.log(v, 'value.change', layer, value, utils.format_friendly_seconds(t), typeof(v));
		if (typeof(v) === 'number') {
			layer.values.splice(v, 0, {
				time: t,
				value: value,
				_color: '#' + (Math.random() * 0xffffff | 0).toString(16)
			});
			if (!dont_save) undo_manager.save(new UndoState(data, 'Add value'));
		} else {
			v.object.value = value;
			if (!dont_save) undo_manager.save(new UndoState(data, 'Update value'));
		}

		repaintAll();
	});

	dispatcher.on('action:solo', function(layer, solo) {
		layer._solo = solo;

		console.log(layer, solo);

		// When a track is solo-ed, playback only changes values
		// of that layer.
	});

	dispatcher.on('action:mute', function(layer, mute) {
		layer._mute = mute;

		// When a track is mute, playback does not play
		// frames of those muted layers.

		// also feels like hidden feature in photoshop

		// when values are updated, eg. from slider,
		// no tweens will be created.
		// we can decide also to "lock in" layers
		// no changes to tween will be made etc.
	});

	dispatcher.on('ease', function(layer, ease_type) {
		var t = data.get('ui:currentTime').value;
		var v = utils.timeAtLayer(layer, t);
		// console.log('Ease Change > ', layer, value, v);
		if (v && v.entry) {
			v.entry.tween  = ease_type;
		}

		undo_manager.save(new UndoState(data, 'Add Ease'));

		repaintAll();
	});

	var start_play = null,
		played_from = 0; // requires some more tweaking

	dispatcher.on('controls.toggle_play', function() {
		if (start_play) {
			pausePlaying();
		} else {
			startPlaying();
		}
	});

	dispatcher.on('controls.restart_play', function() {
		if (!start_play) {
			startPlaying();
		}

		setCurrentTime(played_from);
	});

	dispatcher.on('controls.play', startPlaying);
	dispatcher.on('controls.pause', pausePlaying);

	function startPlaying() {
		// played_from = timeline.current_frame;
		start_play = performance.now() - data.get('ui:currentTime').value * 1000;
		layer_panel.setControlStatus(true);
		// dispatcher.fire('controls.status', true);
	}

	function pausePlaying() {
		start_play = null;
		layer_panel.setControlStatus(false);
		// dispatcher.fire('controls.status', false);
	}

	dispatcher.on('controls.stop', function() {
		if (start_play !== null) pausePlaying();
		setCurrentTime(0);
	});

	var currentTimeStore = data.get('ui:currentTime');
	dispatcher.on('time.update', setCurrentTime);

	dispatcher.on('update.scrollTime', function(v) {
		v = Math.max(0, v);
		data.get('ui:scrollTime').value = v;
		repaintAll();
	});


	function setCurrentTime(value) {
		value = Math.max(0, value);
		currentTimeStore.value = value;

		if (start_play) start_play = performance.now() - value * 1000;
		repaintAll();
		// layer_panel.repaint(s);
	}

	dispatcher.on('target.notify', function(name, value) {
		if (target) target[name] = value;
	});

	dispatcher.on('update.scale', function(v) {
		console.log('range', v);
		data.get('ui:timeScale').value = v;

		timeline.repaint();
	});

	// handle undo / redo
	dispatcher.on('controls.undo', function() {
		var history = undo_manager.undo();
		data.setJSONString(history.state);

		updateState();
	});

	dispatcher.on('controls.redo', function() {
		var history = undo_manager.redo();
		data.setJSONString(history.state);

		updateState();
	});

	/*
		Paint Routines
	*/

	function paint() {
		requestAnimationFrame(paint);

		if (start_play) {
			var t = (performance.now() - start_play) / 1000;
			setCurrentTime(t);


			if (t > data.get('ui:totalTime').value) {
				// simple loop
				start_play = performance.now();
			}
		}

		if (needsResize) {
			div.style.width = width + 'px';
			div.style.height = height + 'px';

			restyle(layer_panel.dom, timeline.dom);

			timeline.resize();
			repaintAll();
			needsResize = false;

			dispatcher.fire('resize');
		}

		timeline._paint();
	}

	paint();

	/*
		End Paint Routines
	*/

	function save(name) {
		if (!name) name = 'autosave';

		var json = data.getJSONString();

		try {
			localStorage[STORAGE_PREFIX + name] = json;
			dispatcher.fire('save:done');
		} catch (e) {
			console.log('Cannot save', name, json);
		}
	}

	function saveAs(name) {
		if (!name) name = data.get('name').value;
		name = prompt('Pick a name to save to (localStorage)', name);
		if (name) {
			data.data.name = name;
			save(name);
		}
	}

	function saveSimply() {
		var name = data.get('name').value;
		if (name) {
			save(name);
		} else {
			saveAs(name);
		}
	}

	function exportJSON() {
		var json = data.getJSONString();
		var ret = prompt('Hit OK to download otherwise Copy and Paste JSON', json);

		console.log(JSON.stringify(data.data, null, '\t'));
		if (!ret) return;

		// make json downloadable
		json = data.getJSONString('\t');
		var fileName = 'timeliner-test' + '.json';

		saveToFile(json, fileName);
	}

	function loadJSONString(o) {
		// should catch and check errors here
		var json = JSON.parse(o);
		load(json);
	}

	function load(o) {
		data.setJSON(o);
		//
		if (data.getValue('ui') === undefined) {
			data.setValue('ui', {
				currentTime: 0,
				totalTime: Settings.default_length,
				scrollTime: 0,
				timeScale: Settings.time_scale
			});
		}

		undo_manager.clear();
		undo_manager.save(new UndoState(data, 'Loaded'), true);

		updateState();
	}

	function updateState() {
		layers = layer_store.value; // FIXME: support Arrays
		layer_panel.setState(layer_store);
		timeline.setState(layer_store);

		repaintAll();
	}

	function repaintAll() {
		var content_height = layers.length * Settings.LINE_HEIGHT;
		scrollbar.setLength(Settings.TIMELINE_SCROLL_HEIGHT / content_height);

		layer_panel.repaint();
		timeline.repaint();
	}

	function promptImport() {
		var json = prompt('Paste JSON in here to Load');
		if (!json) return;
		console.log('Loading.. ', json);
		loadJSONString(json);
	}

	function open(title) {
		if (title) {
			loadJSONString(localStorage[STORAGE_PREFIX + title]);
		}
	}

	this.openLocalSave = open;

	dispatcher.on('import', function() {
		promptImport();
	}.bind(this));

	dispatcher.on('new', function() {
		data.blank();
		updateState();
	});

	dispatcher.on('openfile', function() {
		openAs(function(data) {
			// console.log('loaded ' + data);
			loadJSONString(data);
		}, div);
	});

	dispatcher.on('open', open);
	dispatcher.on('export', exportJSON);

	dispatcher.on('save', saveSimply);
	dispatcher.on('save_as', saveAs);

	// Expose API
	this.save = save;
	this.load = load;

	/*
		Start DOM Stuff (should separate file)
	*/

	var div = document.createElement('div');
	div.style.cssText = 'position: absolute;';
	div.style.top = '22px';

	var pane = document.createElement('div');

	style(pane, {
		position: 'fixed',
		top: '20px',
		left: '20px',
		margin: 0,
		border: '1px solid ' + Theme.a,
		padding: 0,
		overflow: 'hidden',
		backgroundColor: Theme.a,
		color: Theme.d,
		zIndex: Z_INDEX,
		fontFamily: 'monospace',
		fontSize: '12px'
	});


	var header_styles = {
		position: 'absolute',
		top: '0px',
		width: '100%',
		height: '22px',
		lineHeight: '22px',
		overflow: 'hidden'
	};

	var button_styles = {
		width: '20px',
		height: '20px',
		padding: '2px',
		marginRight: '2px'
	};

	var pane_title = document.createElement('div');
	style(pane_title, header_styles, {
		borderBottom: '1px solid ' + Theme.b,
		textAlign: 'center'
	});

	var title_bar = document.createElement('span');
	pane_title.appendChild(title_bar);

	title_bar.innerHTML = 'Timeliner ' + package_json.version;
	pane_title.appendChild(title_bar);

	var top_right_bar = document.createElement('div');
	style(top_right_bar, header_styles, {
		textAlign: 'right'
	});

	pane_title.appendChild(top_right_bar);

	// resize minimize
	// var resize_small = new IconButton(10, 'resize_small', 'minimize', dispatcher);
	// top_right_bar.appendChild(resize_small.dom);

	// resize full
	var resize_full = new IconButton(10, 'resize_full', 'maximize', dispatcher);
	style(resize_full.dom, button_styles, { marginRight: '2px' });
	top_right_bar.appendChild(resize_full.dom);

	var pane_status = document.createElement('div');

	var footer_styles = {
		position: 'absolute',
		width: '100%',
		height: '22px',
		lineHeight: '22px',
		bottom: '0',
		// padding: '2px',
		background: Theme.a,
		fontSize: '11px'
	};

	style(pane_status, footer_styles, {
		borderTop: '1px solid ' + Theme.b,
	});

	pane.appendChild(div);
	pane.appendChild(pane_status);
	pane.appendChild(pane_title);

	var label_status = document.createElement('span');
	label_status.textContent = 'hello!';
	label_status.style.marginLeft = '10px';

	this.setStatus = function(text) {
		label_status.textContent = text;
	};

	dispatcher.on('state:save', function(description) {
		dispatcher.fire('status', description);
		save('autosave');
	});

	dispatcher.on('status', this.setStatus);

	var bottom_right = document.createElement('div');
	style(bottom_right, footer_styles, {
		textAlign: 'right'
	});


	// var button_save = document.createElement('button');
	// style(button_save, button_styles);
	// button_save.textContent = 'Save';
	// button_save.onclick = function() {
	// 	save();
	// };

	// var button_load = document.createElement('button');
	// style(button_load, button_styles);
	// button_load.textContent = 'Import';
	// button_load.onclick = this.promptLoad;

	// var button_open = document.createElement('button');
	// style(button_open, button_styles);
	// button_open.textContent = 'Open';
	// button_open.onclick = this.promptOpen;


	// bottom_right.appendChild(button_load);
	// bottom_right.appendChild(button_save);
	// bottom_right.appendChild(button_open);

	pane_status.appendChild(label_status);
	pane_status.appendChild(bottom_right);


	/**/
	// zoom in
	var zoom_in = new IconButton(12, 'zoom_in', 'zoom in', dispatcher);
	// zoom out
	var zoom_out = new IconButton(12, 'zoom_out', 'zoom out', dispatcher);
	// settings
	var cog = new IconButton(12, 'cog', 'settings', dispatcher);

	// bottom_right.appendChild(zoom_in.dom);
	// bottom_right.appendChild(zoom_out.dom);
	// bottom_right.appendChild(cog.dom);

	// add layer
	var plus = new IconButton(12, 'plus', 'New Layer', dispatcher);
	plus.onClick(function() {
		var name = prompt('Layer name?');
		addLayer(name);

		undo_manager.save(new UndoState(data, 'Layer added'));

		repaintAll();
	});
	style(plus.dom, button_styles);
	bottom_right.appendChild(plus.dom);


	// trash
	var trash = new IconButton(12, 'trash', 'Delete save', dispatcher);
	trash.onClick(function() {
		var name = data.get('name').value;
		if (name && localStorage[STORAGE_PREFIX + name]) {
			var ok = confirm('Are you sure you wish to delete ' + name + '?');
			if (ok) {
				delete localStorage[STORAGE_PREFIX + name];
				dispatcher.fire('status', name + ' deleted');
				dispatcher.fire('save:done');
			}
		}
	});
	style(trash.dom, button_styles, { marginRight: '2px' });
	bottom_right.appendChild(trash.dom);


	// pane_status.appendChild(document.createTextNode(' | TODO <Dock Full | Dock Botton | Snap Window Edges | zoom in | zoom out | Settings | help>'));

	/*
			End DOM Stuff
	*/

	var ghostpane = document.createElement('div');
	ghostpane.id = 'ghostpane';
	style(ghostpane, {
		background: '#999',
		opacity: 0.2,
		position: 'fixed',
		margin: 0,
		padding: 0,
		zIndex: (Z_INDEX - 1),
		// transition: 'all 0.25s ease-in-out',
		transitionProperty: 'top, left, width, height, opacity',
 		transitionDuration: '0.25s',
		transitionTimingFunction: 'ease-in-out'
	});


	//
	// Handle DOM Views
	//

	// Shadow Root
	var root = document.createElement('timeliner');
	document.body.appendChild(root);
	if (root.createShadowRoot) root = root.createShadowRoot();

	window.r = root;

	// var iframe = document.createElement('iframe');
	// document.body.appendChild(iframe);
	// root = iframe.contentDocument.body;

	root.appendChild(pane);
	root.appendChild(ghostpane);

	div.appendChild(layer_panel.dom);
	div.appendChild(timeline.dom);

	var scrollbar = new ScrollBar(200, 10);
	div.appendChild(scrollbar.dom);

	// percentages
	scrollbar.onScroll.do(function(type, scrollTo) {
		switch(type) {
			case 'scrollto':
				layer_panel.scrollTo(scrollTo);
				timeline.scrollTo(scrollTo);
				break;
	//		case 'pageup':
	// 			scrollTop -= pageOffset;
	// 			me.draw();
	// 			me.updateScrollbar();
	// 			break;
	// 		case 'pagedown':
	// 			scrollTop += pageOffset;
	// 			me.draw();
	// 			me.updateScrollbar();
	// 			break;
		}
	});



	// document.addEventListener('keypress', function(e) {
	// 	console.log('kp', e);
	// });
	// document.addEventListener('keyup', function(e) {
	// 	if (undo) console.log('UNDO');

	// 	console.log('kd', e);
	// });

	// TODO: Keyboard Shortcuts
	// Esc - Stop and review to last played from / to the start?
	// Space - play / pause from current position
	// Enter - play all
	// k - keyframe

	document.addEventListener('keydown', function(e) {
		var play = e.keyCode == 32; // space
		var enter = e.keyCode == 13; //
		var undo = e.metaKey && e.keyCode == 91 && !e.shiftKey;

		var active = document.activeElement;
		// console.log( active.nodeName );

		if (active.nodeName.match(/(INPUT|BUTTON|SELECT|TIMELINER)/)) {
			active.blur();
		}

		if (play) {
			dispatcher.fire('controls.toggle_play');
		}
		else if (enter) {
			// FIXME: Return should play from the start or last played from?
			dispatcher.fire('controls.restart_play');
			// dispatcher.fire('controls.undo');
		}
		else if (e.keyCode == 27) {
			// Esc = stop. FIXME: should rewind head to last played from or Last pointed from?
			dispatcher.fire('controls.pause');
		}
		else console.log('keydown', e.keyCode);
	});

	var needsResize = true;

	function resize(width, height) {
		// data.get('ui:bounds').value = {
		// 	width: width,
		// 	height: height
		// };
		// TODO: remove ugly hardcodes
		width -= 4;
		height -= 44;

		Settings.width = width - Settings.LEFT_PANE_WIDTH;
		Settings.height = height;

		Settings.TIMELINE_SCROLL_HEIGHT = height - Settings.MARKER_TRACK_HEIGHT;
		var scrollable_height = Settings.TIMELINE_SCROLL_HEIGHT;

		scrollbar.setHeight(scrollable_height - 2);
		// scrollbar.setThumb

		style(scrollbar.dom, {
			top: Settings.MARKER_TRACK_HEIGHT + 'px',
			left: (width - 16) + 'px',
		});

		needsResize = true;
	}

	function restyle(left, right) {
		left.style.cssText = 'position: absolute; left: 0px; top: 0px; height: ' + Settings.height + 'px;';
		style(left, {
			// background: Theme.a,
			overflow: 'hidden'
		});
		left.style.width = Settings.LEFT_PANE_WIDTH + 'px';

		// right.style.cssText = 'position: absolute; top: 0px;';
		right.style.position = 'absolute';
		right.style.top = '0px';
		right.style.left = Settings.LEFT_PANE_WIDTH + 'px';
	}

	function addLayer(name) {
		var layer = new LayerProp(name);

		layers = layer_store.value;
		layers.push(layer);

		layer_panel.setState(layer_store);
	}

	this.addLayer = addLayer;

	this.setTarget = function(t) {
		timeline = t;
	};

	function getValueRanges(ranges, interval) {
		interval = interval ? interval : 0.15;
		ranges = ranges ? ranges : 2;

		// not optimized!
		var t = data.get('ui:currentTime').value;

		var values = [];

		for (var u = -ranges; u <= ranges; u++) {
			// if (u == 0) continue;
			var o = {};

			for (var l = 0; l < layers.length; l++) {
				var layer = layers[l];
				var m = utils.timeAtLayer(layer, t + u * interval);
				o[layer.name] = m.value;
			}

			values.push(o);

		}

		return values;
	}

	this.getValues = getValueRanges;

	(function DockingWindow() {
		"use strict";

		// Minimum resizable area
		var minWidth = 100;
		var minHeight = 80;

		// Thresholds
		var FULLSCREEN_MARGINS = 2;
		var SNAP_MARGINS = 8;
		var MARGINS = 2;

		// End of what's configurable.

		var clicked = null;
		var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

		var preSnapped;

		var b, x, y;

		var redraw = false;

		// var pane = document.getElementById('pane');
		// var ghostpane = document.getElementById('ghostpane');

		var mouseOnTitle = false;
		var snapType;

		pane_title.addEventListener('mouseover', function() {
			mouseOnTitle = true;
		});

		pane_title.addEventListener('mouseout', function() {
			mouseOnTitle = false;
		});

		resize_full.onClick(function() {
			// TOOD toggle back to restored size
			if (!preSnapped) preSnapped = {
				width: b.width,
				height: b.height
			};

			snapType = 'full-screen';
			resizeEdges();
		});

		// pane_status.addEventListener('mouseover', function() {
		// 	mouseOnTitle = true;
		// });

		// pane_status.addEventListener('mouseout', function() {
		// 	mouseOnTitle = false;
		// });

		window.addEventListener('resize', function() {
			if (snapType)
				resizeEdges();
			else
				needsResize = true;
		});

		// utils
		function setBounds(element, x, y, w, h) {
			element.style.left = x + 'px';
			element.style.top = y + 'px';
			element.style.width = w + 'px';
			element.style.height = h + 'px';

			if (element === pane) {
				resize(w, h);
			}
		}

		function hintHide() {
			setBounds(ghostpane, b.left, b.top, b.width, b.height);
			ghostpane.style.opacity = 0;
		}

		setBounds(pane, 0, 0, Settings.width, Settings.height);
		setBounds(ghostpane, 0, 0, Settings.width, Settings.height);

		// Mouse events
		pane.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);

		// Touch events
		pane.addEventListener('touchstart', onTouchDown);
		document.addEventListener('touchmove', onTouchMove);
		document.addEventListener('touchend', onTouchEnd);


		function onTouchDown(e) {
			onDown(e.touches[0]);
			e.preventDefault();
		}

		function onTouchMove(e) {
			onMove(e.touches[0]);
		}

		function onTouchEnd(e) {
			if (e.touches.length == 0) onUp(e.changedTouches[0]);
		}

		function onMouseDown(e) {
			onDown(e);
		}

		function onDown(e) {
			calc(e);

			var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
			var isMoving = !isResizing && canMove();

			clicked = {
				x: x,
				y: y,
				cx: e.clientX,
				cy: e.clientY,
				w: b.width,
				h: b.height,
				isResizing: isResizing,
				isMoving: isMoving,
				onTopEdge: onTopEdge,
				onLeftEdge: onLeftEdge,
				onRightEdge: onRightEdge,
				onBottomEdge: onBottomEdge
			};

			if (isResizing || isMoving) {
				e.preventDefault();
				e.stopPropagation();
			}
		}

		function canMove() {
			return mouseOnTitle;
			// return x > 0 && x < b.width && y > 0 && y < b.height
			// && y < 18;
		}

		function calc(e) {
			b = pane.getBoundingClientRect();
			x = e.clientX - b.left;
			y = e.clientY - b.top;

			onTopEdge = y < MARGINS;
			onLeftEdge = x < MARGINS;
			onRightEdge = x >= b.width - MARGINS;
			onBottomEdge = y >= b.height - MARGINS;
		}

		var e; // current mousemove event

		function onMove(ee) {
			e = ee;
			calc(e);

			redraw = true;
		}

		function animate() {

			requestAnimationFrame(animate);

			if (!redraw) return;

			redraw = false;

			if (clicked && clicked.isResizing) {

				if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
				if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

				if (clicked.onLeftEdge) {
					var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
					if (currentWidth > minWidth) {
						pane.style.width = currentWidth + 'px';
						pane.style.left = e.clientX + 'px';
					}
				}

				if (clicked.onTopEdge) {
					var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
					if (currentHeight > minHeight) {
						pane.style.height = currentHeight + 'px';
						pane.style.top = e.clientY + 'px';
					}
				}

				hintHide();

				resize(b.width, b.height);

				return;
			}

			if (clicked && clicked.isMoving) {

				switch(checks()) {
					case 'full-screen':
						setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-top-edge':
						setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight / 2);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-left-edge':
						setBounds(ghostpane, 0, 0, window.innerWidth / 2, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-right-edge':
						setBounds(ghostpane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-bottom-edge':
						setBounds(ghostpane, 0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2);
						ghostpane.style.opacity = 0.2;
						break;
					default:
						hintHide();
				}

				if (preSnapped) {
					setBounds(pane,
						e.clientX - preSnapped.width / 2,
						e.clientY - Math.min(clicked.y, preSnapped.height),
						preSnapped.width,
						preSnapped.height
					);
					return;
				}

				// moving
				pane.style.top = (e.clientY - clicked.y) + 'px';
				pane.style.left = (e.clientX - clicked.x) + 'px';

				return;
			}

			// This code executes when mouse moves without clicking

			// style cursor
			if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
				pane.style.cursor = 'nwse-resize';
			} else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
				pane.style.cursor = 'nesw-resize';
			} else if (onRightEdge || onLeftEdge) {
				pane.style.cursor = 'ew-resize';
			} else if (onBottomEdge || onTopEdge) {
				pane.style.cursor = 'ns-resize';
			} else if (canMove()) {
				pane.style.cursor = 'move';
			} else {
				pane.style.cursor = 'default';
			}
		}

		function checks() {
			/*
			var rightScreenEdge, bottomScreenEdge;

			rightScreenEdge = window.innerWidth - MARGINS;
			bottomScreenEdge = window.innerHeight - MARGINS;

			// Edge Checkings
			// hintFull();
			if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS)
				return 'full-screen';

			// hintTop();
			if (b.top < MARGINS) return 'snap-top-edge';

			// hintLeft();
			if (b.left < MARGINS) return 'snap-left-edge';

			// hintRight();
			if (b.right > rightScreenEdge) return 'snap-right-edge';

			// hintBottom();
			if (b.bottom > bottomScreenEdge) return 'snap-bottom-edge';
			*/

			if (e.clientY < FULLSCREEN_MARGINS) return 'full-screen';

			if (e.clientY < SNAP_MARGINS) return 'snap-top-edge';

			// hintLeft();
			if (e.clientX < SNAP_MARGINS) return 'snap-left-edge';

			// hintRight();
			if (window.innerWidth - e.clientX < SNAP_MARGINS) return 'snap-right-edge';

			// hintBottom();
			if (window.innerHeight- e.clientY < SNAP_MARGINS) return 'snap-bottom-edge';

		}

		animate();

		function resizeEdges() {
			switch(snapType) {
				case 'full-screen':
					// hintFull();
					setBounds(pane, 0, 0, window.innerWidth, window.innerHeight);
					break;
				case 'snap-top-edge':
					// hintTop();
					setBounds(pane, 0, 0, window.innerWidth, window.innerHeight / 2);
					break;
				case 'snap-left-edge':
					// hintLeft();
					setBounds(pane, 0, 0, window.innerWidth / 2, window.innerHeight);
					break;
				case 'snap-right-edge':
					setBounds(pane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
					break;
				case 'snap-bottom-edge':
					setBounds(pane, 0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2);
					break;
			}
		}

		function onUp(e) {
			calc(e);

			if (clicked && clicked.isMoving) {
				// Snap
				snapType = checks();
				if (snapType) {
					preSnapped = {
						width: b.width,
						height: b.height
					};
					resizeEdges();
				} else {
					preSnapped = null;
				}

				hintHide();

			}

			clicked = null;

		}
	})();

}

window.Timeliner = Timeliner;
