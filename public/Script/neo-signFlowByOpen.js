document.write("<script src='\/Script\/jquery.json-2.2.min.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.blockUI.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");


//Version: 1.0
//Creator: Neo Su
//Create Date: 2013-10-09
//Modified Date: 2013-10-09
//Used Table: Sys_SignerFlow(主),Sys_SignerLevel(副)
//1.0: 送簽流程畫面產生By開單者(xxxx => bbb => ccc)


(function ($) {

    //預設屬性
    var _defaultSettings = {
        ajaxUrl: "/Program/WaitingTask/SignAjaxRequest.aspx",
        systemID: null,
        formID: null,
        userID: null,
        defaultLanguage: "Chinese",
        programID: "",
        url: "",
        controlLoaded: function () { },//控制項初始化完成時回傳的event
        getDocNO: function () { },//取的單號
        getFormData: function () { },//取得表單資訊
        toSignClicked: function () { }//送簽完成資訊
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
                systemID: _settings.systemID,
                formID: _settings.formID,
                userID: _settings.userID,
                defaultLanguage: _settings.defaultLanguage,
                programID: _settings.programID,
                url: _settings.url,
                controlLoaded: _settings.controlLoaded,
                getDocNO: _settings.getDocNO,
                getFormData: _settings.getFormData,
                toSignClicked: _settings.toSignClicked
            };

            return this.each(function () {
                var me = $(this);
                $(me).html("");

                $(me).dialog({
                    title: "chinese" == optionsAry[$(me).attr("id")].defaultLanguage.toLowerCase() ? "請選擇簽核流程" : "Please Choose Sign-Flow",
                    autoOpen: false,
                    show: 'blind',
                    hide: 'blind',
                    resizable: true,
                    draggable: true,
                    height: 298,
                    width: 450,
                    modal: true,
                    buttons: {
                        "Submit": function () {
                            var formJson = optionsAry[$(this).attr("id")].getFormData();

                            var docNO = optionsAry[$(this).attr("id")].getDocNO();
                            var signAry = methods.get.apply(this);

                            if (signAry.length > 0) {

                                var msg = optionsAry[$(me).attr("id")].defaultLanguage.toLowerCase() == "chinese" ?
                                    "<div>資料處理中請稍候.....<img src='/Resources/Images/spinner.gif' align='AbsMiddle'/></div>" :
                                    "<div>Data Processing.....<img src='/Resources/Images/spinner.gif' align='AbsMiddle'/></div>";

                                $(me).block({
                                    message: msg
                                });

                                $.ajax({
                                    url: optionsAry[$(me).attr("id")].ajaxUrl,
                                    data: {
                                        key: "tosignoff",
                                        jsonStr: $.toJSON(signAry),
                                        formJson: typeof (formJson) == "undefined" ? "" : $.toJSON(formJson),
                                        docNO: docNO,
                                        programID: optionsAry[$(this).attr("id")].programID,
                                        url: optionsAry[$(this).attr("id")].url
                                    },
                                    cache: false,
                                    type: "POST",
                                    success: function (result) {
                                        $(me).unblock();
                                        jAlert(result, "message");
                                        optionsAry[$(me).attr("id")].toSignClicked();
                                    },
                                    error: function (xhr) {
                                        $(me).unblock();
                                        alert(xhr.responseText);
                                        $(me).dialog("close");
                                    }
                                });
                            }
                        },
                        "Close": function () { $(this).dialog("close"); }
                    }
                }); //end of dialog

                $.ajax({
                    url: optionsAry[$(me).attr("id")].ajaxUrl,
                    data: {
                        key: "getsignflowbyopen",
                        systemID: optionsAry[$(me).attr("id")].systemID,
                        formID: optionsAry[$(me).attr("id")].formID,
                        defaultLanguage: optionsAry[$(me).attr("id")].defaultLanguage,
                        userID: optionsAry[$(me).attr("id")].userID
                    },
                    dataType: "json",
                    cache: false,
                    success: function (json) {
                        setSignFlow(json);
                        optionsAry[$(me).attr("id")].controlLoaded();
                    },//end of success
                    error: function (xhr) {
                        alert(xhr.responseText);
                    }
                }); //end of ajax


                function setSignFlow(json) {
                    $(me).html("");
                    optionsAry[$(me).attr("id")].signerlist = json.signerlist;
                    if (jlinq.from(json.signerlist).notEquals("signLevel", 0).select().length == 0) {
                        if (optionsAry[$(me).attr("id")].defaultLanguage.toLowerCase() == "chinese")
                            $(me).html("<font color='red'>未設定簽核流程!請洽系統維護相關人員設定</font");
                        else
                            $(me).html("<font color='red'>Please contact the IT to set signoff!</font");
                    }
                    else { $(json.signerflow).appendTo($(me)); }

                     
                    
                } //end of function setSignFlow...
            }); //end of return this.each(function ()...
        },
        open: function () {
            $(this).dialog("open");
        },
        get: function () {
            var ary = [];
            if ($("input[name=rbtnSign]:checked").length >= 1) {
                var signID = parseInt($("input[name=rbtnSign]:checked").val(), 10);
                ary = jlinq.from(optionsAry[$(this).attr("id")].signerlist).equals("signID", signID).select();
            } else
                jAlert("chinese" == optionsAry[$(this).attr("id")].defaultLanguage.toLowerCase() ? "請選擇簽核流程" : "Please Choose Sign-Flow", "message");

            return ary;
        },
        toSignoff: function (docNO, formJson) {

            var msg = optionsAry[$(this).attr("id")].defaultLanguage.toLowerCase() == "chinese" ?
                "<div>資料處理中請稍候.....<img src='/Resources/Images/spinner.gif' align='AbsMiddle'/></div>" :
                "<div>Data Processing.....<img src='/Resources/Images/spinner.gif' align='AbsMiddle'/></div>";

            var signAry = $.toJSON(methods.get.apply(this));

            if (signAry.length > 0) {

                $(me).block({
                    message: msg
                });

                $.ajax({
                    url: optionsAry[$(this).attr("id")].ajaxUrl,
                    type: "POST",
                    data: {
                        key: "tosignoff",
                        jsonstr: $.toJSON(methods.get.apply(this)),
                        formJson: typeof (formJson) == "undefined" ? "" : $.toJson(formJson),
                        docNO: docNO,
                        programID: optionsAry[$(this).attr("id")].programID,
                        url: optionsAry[$(this).attr("id")].url
                    },
                    cache: false,
                    success: function (result) {
                        $(me).unblock();
                        jAlert(result, "message");
                    },
                    error: function (xhr) {
                        $(me).unblock();
                        alert(xhr.responseText);
                    }
                });
            }
        }
    }


    $.fn.signFlowByOpen = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.signFlowByOpen

})(jQuery);
