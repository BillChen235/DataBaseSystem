// jBlock Block Page Plugin
//
// Version 1.0
//
// Cory Hugh,NWInG IT
// 14 September 2011
//
// Usage:
//		jBlock( message )
//		jUnBlock()
// 
// History:
//
//		1.00 - Released (14 September 2011)
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2011 NWInG IT, FOXCONN. 
//
(function ($) {
    
    $.blocks = {
        // Public methods
        onBlock: function (elementID,message) {
            $.blocks._show(elementID,message);
        },
        unBlock: function (elementID) {
            $.blocks._hide(elementID);
        },
        _show: function (elementID, msg) {
            elemHeight = $(elementID).height();
            elemWidth = $(elementID).width();
            elemTop = $(elementID).position().top;
            elemLeft = $(elementID).position().left;
            //console.log($(elementID).position().left);
            $(elementID).append(
			  '<div id="divBlock" class="blockDiv" style="width:' + elemWidth + 'px;height:' + elemHeight + 'px;top:' + elemTop + 'px;left:' + elemLeft + 'px;"></div>' +
			    '<div id="divMsg" class="blockMsg" style="width:' + elemWidth + 'px;top:' + ((elemHeight / 2) - ($("#divMsg").outerHeight() / 2)) + 'px;left:' + elemLeft + 'px;">' +
                '<div id="msgContent" class="msgCss"></div></div>');

            $("#msgContent").html(msg);

            $('#divBlock').show();
            $('#divMsg').show();

            //$.blocks._reposition();
        },
        _hide: function () {
            $('#divBlock').remove();
            $('#divMsg').remove();
        },
        //set position
        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#divMsg").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#divMsg").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            // IE6 fix
            //if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

            $("#divMsg").css({
                top: top + 'px',
                left: left + 'px'
            });
            //$("#popup_overlay").height($(document).height());
        }
    };
    // Shortuct functions
    //jBlock = function (elementID,message) {
    //    $.blocks.onBlock(elementID, message);
    //};
    //jUnBlock = function (elementID) {
    //    $.blocks.unBlock(elementID);
    //};
    // plugin method for blocking element content
    $.fn.jBlock = function (message) {
        $.blocks.onBlock(this, message);
    };
    $.fn.jUnBlock = function (message) {
        $.blocks.unBlock(this, message);
    };
})(jQuery);