document.write("<link href='\/Resources\/css\/Facebook.css' rel='stylesheet' type='text\/css' \/>");
document.write("<script src='\/Script\/neo-url-encode.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");


//Version: 1.1
//Creator: Neo Su
//Create Date: 2014-06-09
//Used Table: Sys_SignerSeal
//1.0: 挑選簽名檔 2014-06-09 By Neo
//1.1: 增加systemID,formID 屬性 2014-06-13 By Neo



(function ($) {

    //預設屬性
    var _defaultSettings = {
        ajaxUrl: "/Program/Public/AjaxRequestSignerSeal.aspx",
        msg: "",
        systemID: "",
        formID: "",
        userID: null,        
        controlLoaded: function (htmltable, data) { },//控件讀取完成
        error: function (xhr) { }//回傳錯誤至前端
    };


    //紀錄覆寫後的屬性
    var optionsAry = []

    // Additional public (exposed) methods
    var methods = {
        init: function (settings) {
            //若無自行設定屬性則繼承預設屬性
            var _settings = $.extend(_defaultSettings, settings);

            //將繼承後的屬性指定為全域變數
            optionsAry[$(this).attr("id")] = {
                ajaxUrl: _settings.ajaxUrl,
                msg: _settings.msg,
                systemID: _settings.systemID,
                formID: _settings.formID,
                userID: _settings.userID,
                controlLoaded: _settings.controlLoaded,
                tableSeal: null,
                sealData: null,
                error: _settings.error
            };

            return this.each(function () {
                var me = $(this);
                $(me).html("");




                $.ajax({
                    url: optionsAry[$(me).attr("id")].ajaxUrl,
                    data: {
                        key: "getsignerseal",
                        systemID: optionsAry[$(me).attr("id")].systemID,
                        formID: optionsAry[$(me).attr("id")].formID,
                        userID: optionsAry[$(me).attr("id")].userID,
                        msg: Url.encode(optionsAry[$(me).attr("id")].msg)
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {
                        optionsAry[$(me).attr("id")].tableSeal = json.tableSeal;
                        optionsAry[$(me).attr("id")].sealData = json.data;
                        $(json.tableSeal).appendTo($(me));
                        $(me).find($("input[name=chbSeal]")).unbind("click").click(function () {
                            $(me).find($("input[name=chbSeal]")).not($(this)).prop("checked", false);
                        });

                        if (json.data.length == 1)
                            $(me).find($("input[name=chbSeal]")).prop("checked", true);

                        optionsAry[$(me).attr("id")].controlLoaded(json.tableSeal, json.data);
                    },
                    error: function (xhr) { optionsAry[$(me).attr("id")].error(xhr); }
                });
                



            }); //end of return this.each(function ()...
        },
        get: function () {
            var me = $(this);
            if ($(me).find($("input[name=chbSeal]:checked")).length > 0) {
                if (jlinq.from(optionsAry[$(me).attr("id")].sealData).equals("UID", $(me).find($("input[name=chbSeal]:checked")).attr("uid")).any())
                    return jlinq.from(optionsAry[$(me).attr("id")].sealData).equals("UID", $(me).find($("input[name=chbSeal]:checked")).attr("uid")).first();
                else
                    return null;
            } else
                return null;
        },
        settings: function (property, value) {
            for (var p in optionsAry[$(this).attr("id")]) {
                if (property === p)
                    optionsAry[$(this).attr("id")][p] = value;
            }
        }
    }


    $.fn.seal = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.signFlowByOpen

})(jQuery);
