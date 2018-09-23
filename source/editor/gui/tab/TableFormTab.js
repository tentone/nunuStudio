"use strict";

function TableFormTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "About", Editor.filePath + "icons/misc/about.png");

}

TableFormTab.prototype = Object.create(TabElement.prototype);
