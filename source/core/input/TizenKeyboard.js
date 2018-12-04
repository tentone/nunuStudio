"use strict";

/**
 * Tizen keyboard contains codes of multiple tizen specific key codes.
 *
 * These key codes are used in Samsung Tizen TV, more infomration available
 *  - https://developer.samsung.com/stream-code101/tv/using-the-remote-control
 *
 * @static
 * @class TizenKeyboard
 * @module Input
 */
function TizenKeyboard(){}

/**
 * Left key.
 * @attribute ARROW_LEFT
 * @type {Number}
 */
TizenKeyboard.ARROW_LEFT = 37;

/**
 * Up key.
 * @attribute ARROW_UP
 * @type {Number}
 */
TizenKeyboard.ARROW_UP = 38;

/**
 * Right key.
 * @attribute ARROW_RIGHT
 * @type {Number}
 */
TizenKeyboard.ARROW_RIGHT = 39;

/**
 * Down key.
 * @attribute ARROW_DOWN
 * @type {Number}
 */
TizenKeyboard.ARROW_DOWN = 40;

/**
 * Tizen specific enter key.
 * @attribute ENTER
 * @type {Number}
 */
TizenKeyboard.ENTER = 13;

/**
 * Tizen specific back key.
 * @attribute BACK
 * @type {Number}
 */
TizenKeyboard.BACK = 10009;

/**
 * Volume up key.
 * @attribute VOLUME_UP
 * @type {Number}
 */
TizenKeyboard.VOLUME_UP = 447;

/**
 * Volume down key.
 * @attribute VOLUME_DOWN
 * @type {Number}
 */
TizenKeyboard.VOLUME_DOWN = 448;

/**
 * Volume mute key.
 * @attribute VOLUME_MUTE
 * @type {Number}
 */
TizenKeyboard.VOLUME_MUTE = 449;

/**
 * Channel up key.
 * @attribute CHANNEL_UP
 * @type {Number}
 */
TizenKeyboard.CHANNEL_UP = 427;

/**
 * Channel down key.
 * @attribute CHANNEL_DOWN
 * @type {Number}
 */
TizenKeyboard.CHANNEL_DOWN = 428;

/**
 * Red/F0 key.
 * @attribute F0_RED
 * @type {Number}
 */
TizenKeyboard.F0_RED = 403;

/**
 * Green/F1 key.
 * @attribute F1_GREEN
 * @type {Number}
 */
TizenKeyboard.F1_GREEN = 404;

/**
 * Yellow/F2 key.
 * @attribute F2_YELLOW
 * @type {Number}
 */
TizenKeyboard.F2_YELLOW = 405;

/**
 * Blue/F3 key.
 * @attribute F3_BLUE
 * @type {Number}
 */
TizenKeyboard.F3_BLUE = 406;

/**
 * Number 0 key.
 * @attribute NUM_0
 * @type {Number}
 */
TizenKeyboard.NUM_0 = 48;

/**
 * Number 1 key.
 * @attribute NUM_1
 * @type {Number}
 */
TizenKeyboard.NUM_1 = 49;

/**
 * Number 2 key.
 * @attribute NUM_2
 * @type {Number}
 */
TizenKeyboard.NUM_2 = 50;

/**
 * Number 3 key.
 * @attribute NUM_3
 * @type {Number}
 */
TizenKeyboard.NUM_3 = 51;

/**
 * Number 4 key.
 * @attribute NUM_4
 * @type {Number}
 */
TizenKeyboard.NUM_4 = 52;

/**
 * Number 5 key.
 * @attribute NUM_5
 * @type {Number}
 */
TizenKeyboard.NUM_5 = 53;

/**
 * Number 6 key.
 * @attribute NUM_6
 * @type {Number}
 */
TizenKeyboard.NUM_6 = 54;

/**
 * Number 7 key.
 * @attribute NUM_7
 * @type {Number}
 */
TizenKeyboard.NUM_7 = 55;

/**
 * Number 8 key.
 * @attribute NUM_8
 * @type {Number}
 */
TizenKeyboard.NUM_8 = 56;

/**
 * Number 9 key.
 * @attribute NUM_9
 * @type {Number}
 */
TizenKeyboard.NUM_9 = 57;

/**
 * Minus key.
 * @attribute MINUS
 * @type {Number}
 */
TizenKeyboard.MINUS = 189;

/**
 * E-manual key.
 * @attribute E_MANUAL
 * @type {Number}
 */
TizenKeyboard.E_MANUAL = 10146;

/**
 * Previous channel key.
 * @attribute PREVIOUS_CHANNEL
 * @type {Number}
 */
TizenKeyboard.PREVIOUS_CHANNEL = 10190;

/**
 * Picture size key.
 * @attribute PICTURE_SIZE
 * @type {Number}
 */
TizenKeyboard.PICTURE_SIZE = 10140;

/**
 * Soccer key.
 * @attribute SOCCER
 * @type {Number}
 */
TizenKeyboard.SOCCER = 10228;

/**
 * Teletext key.
 * @attribute TELETEXT
 * @type {Number}
 */
TizenKeyboard.TELETEXT = 10200;

/**
 * Search key.
 * @attribute SEARCH
 * @type {Number}
 */
TizenKeyboard.SEARCH = 10225;

/**
 * Guide key.
 * @attribute GUIDE
 * @type {Number}
 */
TizenKeyboard.GUIDE = 458;

/**
 * Source selection key.
 * @attribute SOURCE
 * @type {Number}
 */
TizenKeyboard.SOURCE = 10072;

/**
 * Extra key.
 * @attribute EXTRA
 * @type {Number}
 */
TizenKeyboard.EXTRA = 10253;

/**
 * MTS key.
 * @attribute MTS
 * @type {Number}
 */
TizenKeyboard.MTS = 10195;

/**
 * Tizen specific media play and pause key.
 * @attribute MEDIA_PLAY_PAUSE
 * @type {Number}
 */
TizenKeyboard.MEDIA_PLAY_PAUSE = 10252;

/**
 * Tizen specific menu key.
 * @attribute MENU
 * @type {Number}
 */
TizenKeyboard.MENU = 18;

/**
 * Tizen specific media rewind key.
 * @attribute MEDIA_REWIND
 * @type {Number}
 */
TizenKeyboard.MEDIA_REWIND = 412;

/**
 * Tizen specific media rewind key.
 * @attribute MEDIA_REWIND
 * @type {Number}
 */
TizenKeyboard.TOOLS = 10135;

/**
 * Tizen specific media fast forward key.
 * @attribute MEDIA_FAST_FORWARD
 * @type {Number}
 */
TizenKeyboard.MEDIA_FAST_FORWARD = 417;

/**
 * Tizen specific info key.
 * @attribute INFO
 * @type {Number}
 */
TizenKeyboard.INFO = 457;

/**
 * Tizen specific media play key.
 * @attribute MEDIA_PLAY
 * @type {Number}
 */
TizenKeyboard.MEDIA_PLAY = 415;

/**
 * Tizen specific exit key.
 * @attribute EXIT
 * @type {Number}
 */
TizenKeyboard.EXIT = 10182;

/**
 * Tizen specific media pause key.
 * @attribute MEDIA_PAUSE
 * @type {Number}
 */
TizenKeyboard.MEDIA_PAUSE = 19;

/**
 * Tizen specific media stop key.
 * @attribute MEDIA_STOP
 * @type {Number}
 */
TizenKeyboard.MEDIA_STOP = 413;

/**
 * Tizen specific caption key.
 * @attribute CAPTION
 * @type {Number}
 */
TizenKeyboard.CAPTION = 10221;

/**
 * Tizen specific media record key.
 * @attribute MEDIA_RECORD
 * @type {Number}
 */
TizenKeyboard.MEDIA_RECORD = 416;

/**
 * Tizen specific channel list key.
 * @attribute CHANNEL_LIST
 * @type {Number}
 */
TizenKeyboard.CHANNEL_LIST = 10073;

/**
 * Tizen specific media track previous key.
 * @attribute MEDIA_TRACK_PREVIOUS
 * @type {Number}
 */
TizenKeyboard.MEDIA_TRACK_PREVIOUS = 10232;

/**
 * Tizen specific media next track key.
 * @attribute MEDIA_TRACK_NEXT
 * @type {Number}
 */
TizenKeyboard.MEDIA_TRACK_NEXT = 10233;

/**
 * Tizen specific 3D key.
 * @attribute MEDIA_3D
 * @type {Number}
 */
TizenKeyboard.MEDIA_3D = 10199;
