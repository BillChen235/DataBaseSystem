// jQuery My Basic Plugin
//
// Version 1.1
//

(function ($) {
    jQuery.fn.setfocus = function()
    {
        return this.each(function()
        {
            var dom = this;
            setTimeout(function()
            {
                try { dom.focus(); } catch (e) { } 
            }, 0);
        });
    };

})(jQuery);