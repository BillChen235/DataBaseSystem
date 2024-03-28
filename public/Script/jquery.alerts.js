// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function ($) {

    $.alerts = {

        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true,           // re-centers the dialog on window resize
        overlayOpacity: .01,                // transparency level of overlay
        overlayColor: '#FFF',               // base color of overlay
        draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;確定&nbsp;',         // text for the OK button
        cancelButton: '&nbsp;取消&nbsp;', // text for the Cancel button
        dialogClass: null,                  // if specified, this class will be applied to all dialogs

        // Public methods

        alert: function (message, title, callback, cfg, dontHide){
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', callback/*function(result){
                if (callback) callback(result);
            }*/, cfg, dontHide);
        },

        confirm: function(message, title, callback, cfg, dontHide){
            if (title == null) title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', callback/*function(result){
                if (callback) callback(result);
            }*/, cfg, dontHide);
        },

        prompt: function(message, value, title, callback, cfg, dontHide){
            if (title == null) title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', callback/*function(result){
                if (callback) callback(result);
            }*/, cfg, dontHide);
        },

        // Private methods

        _show: function(title, msg, value, type, callback, cfg, dontHide){
			if(!dontHide){
				$.alerts._hide();
				$.alerts._overlay('show');

				$("BODY").append(
					'<div id="popup_container">' +
						'<h1 id="popup_title"></h1>' +
						'<div id="popup_content">' +
							'<div id="popup_message"></div>' +
						'</div>' +
					'</div>');

				if($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);

				// IE6 Fix
				//var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';

				$("#popup_container").css({
					position: 'fixed',
					zIndex: 99999,
					padding: 0,
					margin: 0
				});

				$("#popup_title").text(title);
				$("#popup_content").addClass(type);
				$("#popup_message").text(msg);
				$("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));

				$("#popup_container").css({
					minWidth: $("#popup_container").outerWidth(),
					maxWidth: $("#popup_container").outerWidth()
				});

				$.alerts._reposition();
				$.alerts._maintainPosition(true);
			}

            switch (type) {
                case 'alert':
                    $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        if(callback) callback(true);
                    });
                    $("#popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
                    });
                    break;
                case 'confirm':
                	if(!cfg){
                		$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                		$("#popup_ok").click(function() {
                			$.alerts._hide();
                			if(callback) callback(true);
                		});
                		$("#popup_cancel").click(function() {
                			$.alerts._hide();
                			if(callback) callback(false);
                		});
                		$("#popup_ok").focus();
                		$("#popup_ok, #popup_cancel").keypress(function(e) {
                			if(e.keyCode == 13) $("#popup_ok").trigger('click');
                			if(e.keyCode == 27) $("#popup_cancel").trigger('click');
                		});
                	}
					else{
                		if(cfg.width)
                			$("#popup_container").css({ "max-width": "initial", "width": cfg.width });
                		if(cfg.icon)
                			$("#popup_content").css("background-image", "url(" + cfg.icon + ")");
                		if(cfg.iconSize)
                			$("#popup_content").css("background-size", cfg.iconSize);
                		$("#popup_message").after('<div id="popup_panel">' + (cfg.confirm1 ? '<input type="button" value="' + cfg.confirm1 + '" id="popup_confirm1" />' : "") + (cfg.confirm2 ? '<input type="button" value="' + cfg.confirm2 + '" id="popup_confirm2" style="margin-left: 10px;" />' : "") + '<input type="button" value="' + (cfg.cancel ? cfg.cancel : $.alerts.cancelButton) + '" id="popup_cancel" /></div>');
                		$("#popup_confirm1").click(function() {
                			$.alerts._hide();
                			if(callback) callback(1);
                		});
                		$("#popup_confirm2").click(function() {
                			$.alerts._hide();
                			if(callback) callback(2);
                		});
                		$("#popup_cancel").click(function() {
                			$.alerts._hide();
                			if(callback) callback(0);
                		});
                		$("#popup_cancel").keypress(function(e) {
                			if(e.keyCode == 27) $("#popup_cancel").trigger('click');
                		});
                		if(cfg.afterrender)
                			cfg.afterrender();
                	}
                    break;
                case 'prompt':
                	if(!cfg){
                		$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                		$("#popup_prompt").width($("#popup_message").width());
                		$("#popup_ok").click(function() {
                			var val = $("#popup_prompt").val();
                			$.alerts._hide();
                			if(callback) callback(val);
                		});
                		$("#popup_cancel").click(function() {
                			$.alerts._hide();
                			if(callback) callback(null);
                		});
                		$("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e) {
                			if(e.keyCode == 13) $("#popup_ok").trigger('click');
                			if(e.keyCode == 27) $("#popup_cancel").trigger('click');
                		});
                		if(value) $("#popup_prompt").val(value);
                		$("#popup_prompt").focus().select();
                	}
					else{
						if(!cfg.customized){
							if(!cfg.inputHtml)
								$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
							else $("#popup_message").append('<br />').append(cfg.inputHtml).after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
							$("#popup_prompt").width($("#popup_message").width());
							$("#popup_ok").click(function(){
								var val = $("#popup_prompt").val();
								$.alerts._hide();
								if(callback) callback(val);
							});
							$("#popup_cancel").click(function(){
								$.alerts._hide();
								if(callback) callback(null);
							});
							$("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e){
								if(e.keyCode == 13) $("#popup_ok").trigger('click');
								if(e.keyCode == 27) $("#popup_cancel").trigger('click');
							});
							if(value) $("#popup_prompt").val(value);
							$("#popup_prompt").focus().select();

							if(cfg.afterrender)
								cfg.afterrender();
						}
						else{
							if(cfg.afterrender)
								cfg.afterrender(value, callback);
						}
					}
					break;
			}

            // Make draggable
            if ($.alerts.draggable && !dontHide){
                try {
                    $("#popup_container").draggable({ handle: $("#popup_title") });
                    $("#popup_title").css({ cursor: 'move' });
                } catch (e) { /* requires jQuery UI draggables */ }
            }
        },

        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
        },

        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },

        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            // IE6 fix
            //if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },

        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }

    }

    // Shortuct functions
    jAlert = function(message, title, callback, cfg, dontHide){
    	$.alerts.alert(message, title, callback, cfg, dontHide);
    };

    jConfirm = function(message, title, callback, cfg, dontHide){
    	$.alerts.confirm(message, title, callback, cfg, dontHide);
    };

    jPrompt = function(message, value, title, callback, cfg, dontHide){
    	$.alerts.prompt(message, value, title, callback, cfg, dontHide);
    };

})(jQuery);