// From "sweet-justice", http://github.com/aristus/sweet-justice/

// The shy-phen character is an odd duck. On copy/paste
// most apps other than browsers treat them as printable
// instead of a hyphenation hint, which is usually not what
// you want. So on copy we take 'em out. The selection APIs
// are very different across browsers so there is a lot of
// browser-specific jazzhands in this function. The basic
// idea is to grab the data being copied, make a "shadow"
// element of it, remove the shy-phens, select and copy
// that, then reinstate the original selection.
//
// More than you ever wanted to know:
// http://www.cs.tut.fi/~jkorpela/shy.html
function copy_protect(e) {
	var body = document.getElementsByTagName('body')[0];
	var shyphen = /(?:\u00AD|\&#173;|\&shy;)/g;
	var shadow = document.createElement('div');
	shadow.style.overflow = 'hidden';
	shadow.style.position = 'absolute';
	shadow.style.top = '-5000px';
	shadow.style.height = '1px';
	body.appendChild(shadow);

	// FF3, WebKit
	if (typeof window.getSelection !== 'undefined') {
		sel = window.getSelection();
		var range = sel.getRangeAt(0);
		shadow.appendChild(range.cloneContents());
		shadow.innerHTML = shadow.innerHTML.replace(shyphen, '');
		sel.selectAllChildren(shadow);
		window.setTimeout(function() {
			shadow.parentNode.removeChild(shadow);
			if (typeof window.getSelection().setBaseAndExtent !== 'undefined') {
				sel.setBaseAndExtent(
					range.startContainer,
					range.startOffset,
					range.endContainer,
					range.endOffset
				);
			}
		},0);

	// Internet Explorer
	} else {
		sel = document.selection;
		var range = sel.createRange();
		shadow.innerHTML = range.htmlText.replace(shyphen, '');
		var range2 = body.createTextRange();
		range2.moveToElementText(shadow);
		range2.select();
		window.setTimeout(function() {
			shadow.parentNode.removeChild(shadow);
			if (range.text !== '') {
				range.select();
			}
		},0);
	}
	return;
}

// jQuery
function no_justice_jq() {
	jQuery('body').bind('copy', copy_protect);
}

// YUI3
function no_justice_yui(Y) {
	Y.Node.DOM_EVENTS.copy = 1; // make sure copy event is enabled in YUI
	Y.one('body').on('copy', copy_protect);
}

// dispatch on library
if (window.jQuery) {
	jQuery(window).load(no_justice_jq);
} else if (window.YUI) {
	YUI().use('node', function(Y) {
			no_justice_yui(Y);
	});
}
