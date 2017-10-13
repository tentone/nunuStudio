/**************************/
// Tweens
/**************************/

var Tweens = {
	none: function(k) {
		return 0;
	},
	linear: function(k) {
		return k;
	},
	quadEaseIn: function(k) {
		return k * k;
	},
	quadEaseOut: function(k) {
		return - k * ( k - 2 );
	},
	quadEaseInOut: function(k) {
		if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
		return - 0.5 * ( --k * ( k - 2 ) - 1 );
	}
};

module.exports = Tweens;