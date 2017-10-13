var SimpleEvent = require('do.js');
var utils = require('./utils');

// ********** class: ScrollBar ****************** //
/*
	Simple UI widget that displays a scrolltrack 
	and slider, that fires some scroll events
*/
// ***********************************************

var scrolltrack_style = {
	// float: 'right',
	position: 'absolute',
	// right: '0',
	// top: '0',
	// bottom: '0',
	background: '-webkit-gradient(linear, left top, right top, color-stop(0, rgb(29,29,29)), color-stop(0.6, rgb(50,50,50)) )',
	border: '1px solid rgb(29, 29, 29)',
	// zIndex: '1000',
	textAlign: 'center',
	cursor: 'pointer'
};

var scrollbar_style = {
	background: '-webkit-gradient(linear, left top, right top, color-stop(0.2, rgb(88,88,88)), color-stop(0.6, rgb(64,64,64)) )',
	border: '1px solid rgb(25,25,25)',
	// position: 'absolute',
	position: 'relative',
	borderRadius: '6px'
};

function ScrollBar(h, w, dispatcher) {

	var SCROLLBAR_WIDTH = w ? w : 12;
	var SCROLLBAR_MARGIN = 3;
	var SCROLL_WIDTH = SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2;
	var MIN_BAR_LENGTH = 25;

	var scrolltrack = document.createElement('div');
	utils.style(scrolltrack, scrolltrack_style);

	var scrolltrackHeight = h - 2;
	scrolltrack.style.height = scrolltrackHeight + 'px';
	scrolltrack.style.width = SCROLL_WIDTH + 'px';;

	// var scrollTop = 0;
	var scrollbar = document.createElement('div');
	// scrollbar.className = 'scrollbar';
	utils.style(scrollbar, scrollbar_style);
	scrollbar.style.width = SCROLLBAR_WIDTH + 'px';
	scrollbar.style.height = h / 2;
	scrollbar.style.top = 0;
	scrollbar.style.left = SCROLLBAR_MARGIN + 'px'; // 0; //S

	scrolltrack.appendChild(scrollbar);

	var me = this;

	var bar_length, bar_y;

	// Sets lengths of scrollbar by percentage
	this.setLength = function(l) {
		// limit 0..1
		l = Math.max(Math.min(1, l), 0);
		l *= scrolltrackHeight;
		bar_length = Math.max(l, MIN_BAR_LENGTH);
		scrollbar.style.height = bar_length + 'px';
	};

	this.setHeight = function(height) {
		h = height;

		scrolltrackHeight = h - 2;
		scrolltrack.style.height = scrolltrackHeight + 'px' ;
	};

	// Moves scrollbar to position by Percentage
	this.setPosition = function(p) {
		p = Math.max(Math.min(1, p), 0);
		var emptyTrack = scrolltrackHeight - bar_length;
		bar_y = p * emptyTrack;
		scrollbar.style.top = bar_y + 'px';
	};

	this.setLength(1);
	this.setPosition(0);
	this.onScroll = new SimpleEvent();

	var mouse_down_grip;

	function onDown(event) {
		event.preventDefault();

		if (event.target == scrollbar) {
			mouse_down_grip = event.clientY;
			document.addEventListener('mousemove', onMove, false);
			document.addEventListener('mouseup', onUp, false);
		} else {
			if (event.clientY < bar_y) {
				me.onScroll.fire('pageup');
			} else if (event.clientY > (bar_y + bar_length)) {
				me.onScroll.fire('pagedown');
			}
			// if want to drag scroller to empty track instead
			// me.setPosition(event.clientY / (scrolltrackHeight - 1));
		}
	}

	function onMove(event) {
		event.preventDefault();

		// event.target == scrollbar
		var emptyTrack = scrolltrackHeight - bar_length;
		var scrollto = (event.clientY - mouse_down_grip) / emptyTrack;

		// clamp limits to 0..1
		if (scrollto > 1) scrollto = 1;
		if (scrollto < 0) scrollto = 0;
		me.setPosition(scrollto);
		me.onScroll.fire('scrollto', scrollto);
	}

	function onUp(event) {
		onMove(event);
		document.removeEventListener('mousemove', onMove, false);
		document.removeEventListener('mouseup', onUp, false);
	}

	scrolltrack.addEventListener('mousedown', onDown, false);
	this.dom = scrolltrack;

}

module.exports = ScrollBar;