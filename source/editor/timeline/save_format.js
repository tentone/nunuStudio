/* Layer Schema */
/*
var layer_1 = [
	{
		name: 'abc',
		props: {
			min:
			max:
			step:
			real_step:
		},
		values: [
			[t, v, ''],
			{time: t, value: v, tween: bla, _color: 'red'},
			{time: t, value: v, tween: bla},
			{time: t, value: v, tween: bla},
			{time: t, value: v, tween: bla},
			{time: t, value: v},
		],
		ui: {
			mute: true, // mute
			solo: true,

		},
		tmp: {
			value: value,
			_color:
		}
	}
	,...
] currently_playing, scale.
*/

/* Timeline Data Schema */

var sample = {
	version: '1.2.0',
	modified: new Date,

	name: 'sample',
	title: 'Sample Title',

	ui: {
		current_time: 1,
		duration: 100,

		position: '0:0:0',
		bounds: '10 10 100 100',
		snap: 'full | left-half | top-half | right-half | bottom-half'
	},

	layers: [{

	}]
};