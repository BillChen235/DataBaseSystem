document.write("<link href='\/Resources\/css\/Admin_text.css' rel='stylesheet' type='text\/css' \/>");
document.write("<link href='\/Resources\/css\/MyStyleSheet.css' rel='stylesheet' type='text\/css' \/>");
document.write("<link href='\/Resources\/css\/Facebook.css' rel='stylesheet' type='text\/css' \/>");


//Version: 1.0
//Creator: Neo Su
//Create Date: 2013-10-08
//Modified Date: 2013-10-08
//1.0: 頁面Dock Panel自動收闔

(function ($) {

    //預設屬性
    var _defaultSettings = {
        title: "",
        controlDefault: "open",
        contorlLoaded: function () { },//DockPanel Loaded手叫的event
        open: function () { },//DockPanel展開時所呼叫的event
        close: function () { }//DockPanel收起時所呼叫的event
    };

    //紀錄覆寫後的屬性
    var optionAry = [];


    // Additional public (exposed) methods
    var methods = {
        init: function (settings) {
            //若無自行設定屬性則繼承預設屬性
            var _settings = $.extend(_defaultSettings, settings);

            //將繼承後的屬性指定為全域變數
            optionAry[$(this).attr("id")] = {
                title: _settings.title,
                controlDefault: _settings.controlDefault,
                contorlLoaded: _settings.contorlLoaded,
                tableID: $(this).attr("id") + "_table",
                titleID: $(this).attr("id") + "_title",
                open: _settings.open,
                close: _settings.close
            };

            return this.each(function () {
                var me = $(this);
                var content = $(me).html();
               
                var tableID = $(me).attr("id") + "_table";
                var title = optionAry[$(me).attr("id")].title != "" ?
                    optionAry[$(me).attr("id")].title :
                    $(me).attr("titleDesc") != "" ? $(me).attr("titleDesc") : "";
                $(me).html("");

                var table = "<table id='" + tableID + "' class='dock'>";
                table += "<tr><th><span id='" + $(me).attr("id") + "_title' style='float:left'>";
                table+= title +"</span><span style='float:right'>";
                table += "<a href=''>";
                if (optionAry[$(me).attr("id")].controlDefault == "open")
                    table += "<img name='arrow' alt='up' src='/Resources/Images/arrow_up.png' /></a></span>";
                else
                    table += "<img name='arrow' alt='down' src='/Resources/Images/arrow_down.png' /></a></span>";

                table += "</th></tr><tr><td>" + content + "</td></tr></table>";

                $(table).appendTo($(me));

                //頁面收闔動作
                $(me).find($('span img[name=arrow]')).click(function () {
                    if ($(this).attr('alt') == 'up') {
                        $(this).parents('tr:first').next('tr').hide();
                        $(this).attr('src', '/Resources/Images/arrow_down.png');
                        $(this).attr('alt', 'down');
                        optionAry[$(me).attr("id")].open();
                    } else {
                        $(this).parents('tr:first').next('tr').show();
                        $(this).attr('src', '/Resources/Images/arrow_up.png');
                        $(this).attr('alt', 'up');
                        optionAry[$(me).attr("id")].close();
                    }
                    return false;
                });

                $(me).find($(".dock tr th")).dblclick(function () {
                    $(this).find("img[name=arrow]").click();
                });

                optionAry[$(me).attr("id")].contorlLoaded.apply(me);

            }); //end of return this.each(function ()...
        },
        setTitle: function (title) {
            $("#" + optionAry[$(this).attr("id")].titleID).html(title);
        },
        getTitle: function () {
            return $("#" + optionAry[$(this).attr("id")].titleID).html();
        },
    }


    $.fn.docPanel = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.docPanel

})(jQuery);

   
