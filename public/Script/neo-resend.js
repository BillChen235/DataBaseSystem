//document.write("<link href='\/Resources\/css\/jquery-ui.css' rel='stylesheet' type='text\/css' />");
/*document.write("<link href='\/Resources\/css\/token-input.css' rel='stylesheet' type='text/css' \/>");*/



//document.write("<script src='\/Script\/jLibrary.js' type='text\/javascript'><\/script>");
//document.write("<script src='\/Script\/jquery-ui.js' type='text\/javascript'><\/script>");
//document.write("<script src='\/Script\/jquery.json-2.2.min.js' type='text\/javascript'><\/script>");
//document.write("<script src='\/Script\/jquery.blockUI.js' type='text\/javascript'><\/script>");
//document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
//document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");

//document.write("<script src='\/Script/jquery.tokeninput.js' type='text/javascript'></script>");
document.write("<script src='\/Script\/neo-url-encode.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script/neo-validator-extend.js' type='text/javascript'></script>");


//Version: 1.3
//Creator: Neo Su
//Create Date: 2014-05-28
//Modified Date: 2014-05-28
//Used Table: Sys_DocSigning
//1.0: 重送簽核表單
//1.1: 重送通知時增加提示下階Email 2014-09-09 By Neo Su
//1.2: 拿掉引入token-input.css 2014-09-20 By Neo Su
//1.3: 修改待簽核人超過一位的相關程式碼 2014-11-04 By Neo Su

(function ($) {

    //預設屬性
    var _defaultSettings = {
        ajaxUrl: "/Program//WaitingTask/SignAjaxRequest.aspx",       
        systemID: null,
        formID: null,
        docNO: null,
        userID: null,
        changeSigner: false,
        programID: "FIT_WaitingTask",
        url: "/Program/WaitingTask/FIT_WaitingTask.aspx",
        controlLoaded: function () { },//控件讀取完成
        resendSuccessfully: function (signer) { },//回傳此次簽核者資料
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
                systemID: _settings.systemID,
                formID: _settings.formID,
                docNO: _settings.docNO,
                userID: _settings.userID,
                changeSigner: _settings.changeSigner,
                programID: _settings.programID,
                url: _settings.url,
                controlLoaded: _settings.controlLoaded,
                resendSuccessfully: _settings.resendSuccessfully,
                error: _settings.error,
                signAry: []
            };

            return this.each(function () {
                var me = $(this);
                $(me).html("");

                var table = "<table id='tableResend' class='fbTable' style='width:100%'>";
                table += "<tr><td style='text-align:right;vertical-align:top;'>" + GetResource("SignResource", "signer") + ":</td>";
                table += "<td><text type='text' id='txtSigner' /></td></tr></table>";
                //table += "<tr><td></td><td><input type='button' id='btnApproved' class='fbB01' value='" + GetResource("SignResource", "approved") + "'/></td></tr>";
                //table += "<tr><td></td><td><input type='button' id='btnRejected' class='fbB01' value='" + GetResource("SignResource", "rejectedTo") + "'/>&nbsp;";
                //table += "<input type='radio' name='rbtnRejectFlow' value='0' />" + GetResource("SignResource", "rejectToCreator");
                //table += "<input type='radio' name='rbtnRejectFlow' value='1' />" + GetResource("SignResource", "rejectToPrevious") + "</td></tr>";

                $(table).appendTo($(me));

                $("#txtSigner").tokenInput(_settings.ajaxUrl + "?key=getuser", {
                    queryParam: "typeId",
                    hintText: GetResource("resource", "plzInputSearchTerm"),
                    noResultsText: "No Matche",
                    prePopulate: null,
                    searchingText: "<img src=\"/Resources/Images/spinner.gif\" /> Searching...",
                    animateDropdown: true,
                    preventDuplicates: true,
                    tokenValue: "userID",
                    theme: 'facebook',
                    //tokenLimit: 1,
                    propertyToSearch: "display",                    
                    tokenFormatter: function (item) {
                        return "<li><p>" + item.userName + "(" + item.userID + ")</p></li>";
                    }
                });

                $(me).dialog({
                    title: GetResource("SignResource", "resend"),
                    autoOpen: false,
                    show: 'blind',
                    hide: 'blind',
                    resizable: true,
                    draggable: true,
                    height: 200,
                    width: 500,
                    modal: true,
                    buttons: {
                        "Resend": function () {
                            var clientSignLength = jlinq.from($("#txtSigner").tokenInput("get")).select().length;
                            var serverSignLength = optionsAry[$(me).attr("id")].signAry.length;
                            validator = $("#txtSigner").validatorTokenInput();
                            if (validator <= 0 && clientSignLength === serverSignLength) {
                                $(me).block({ message: GetResource("resource", "dataProcess") });                                
                                resend($(me), jlinq.from($("#txtSigner").tokenInput("get")).select());
                            } else if (clientSignLength !== serverSignLength) {
                                $("#txtSigner" + "_vfont").remove();
                                $("#txtSigner").before('<font id=txtSigner' + '_vfont color=\"red\">&nbsp;' + GetResource('SignResource', 'errMsg') + ':' + serverSignLength + '</font>');
                            }
                        },                    
                        "Close": function () { $(this).dialog("close"); }
                    }
                }); //end of dialog

                function resend(obj, signer) {
                    $.ajax({
                        url: optionsAry[$(obj).attr("id")].ajaxUrl,
                        type: "POST",
                        data: {
                            key: "resend",
                            jsonStr: $.toJSON(signer),
                            systemID: optionsAry[$(obj).attr("id")].systemID,
                            formID: optionsAry[$(obj).attr("id")].formID,
                            docNO: optionsAry[$(obj).attr("id")].docNO,
                            userID: optionsAry[$(obj).attr("id")].userID,
                            programID: optionsAry[$(obj).attr("id")].programID,
                            url: optionsAry[$(obj).attr("id")].url
                        },
                        cache: false,
                        dataType: "json",
                        success: function (json) {
                            $(obj).unblock();
                            if (json.status === "OK") {
                                var userName = "";
                                var userEmail = "";
                                for (var i in json.signer) {
                                    userName += json.signer[i].userName + ",";
                                    userEmail += json.signer[i].userEmail + ",";
                                }
                                userName = userName.substr(0, userName.length - 1);
                                userEmail = userEmail.substr(0, userEmail.length - 1);
                                jAlert(GetResource("signresource", "resendTo") + userName + "(" + userEmail + ")", GetResource("resource", "msg"), function () {
                                    optionsAry[$(obj).attr("id")].resendSuccessfully(json.signer);
                                    $(obj).dialog("close");
                                });
                            } else {
                                jAlert(json.status, GetResource("resource", "msg"), function () {
                                    $(obj).dialog("close");                                    
                                });
                            }
                        },
                        error: function (xhr) {
                            jAlert(GetResource("resource", "operationFailed"), GetResource("resource", "msg"), function () {
                                $(obj).unblock();
                                $(obj).dialog("close");
                                optionsAry[$(obj).attr("id")].error(xhr);
                            });


                        }
                    });
                }//end of batchAcceptOrReject

                

            }); //end of return this.each(function ()...
        },
        settings: function (property, value) {
            for (var p in optionsAry[$(this).attr("id")]) {
                if (property === p)
                    optionsAry[$(this).attr("id")][p] = value;
            }
        },
        open: function () {
            var me = $(this);
            $("#txtSigner" + "_vfont").remove();
            $("#txtSigner").tokenInput("clear");
            $("#txtSigner").tokenInput("toggleDisabled", !optionsAry[$(me).attr("id")].changeSigner);
            $.ajax({
                url: optionsAry[$(this).attr("id")].ajaxUrl,
                data: {
                    key: "getcurrentsigner",
                    systemID: optionsAry[$(me).attr("id")].systemID,
                    formID: optionsAry[$(me).attr("id")].formID,
                    docNO: optionsAry[$(me).attr("id")].docNO
                },
                cache: false,
                dataType: "json",
                success: function (json) {
                    if (json != null) {
                        optionsAry[$(me).attr("id")].signAry = json;
                        for (var i in json) {
                            var obj = {
                                userID: json[i].userID,
                                userName: json[i].userName,
                                userForeignName: json[i].userForeignName,
                                userEmail: json[i].userEmail
                            };
                            $("#txtSigner").tokenInput("add", obj);
                        }

                        $(me).dialog("open");
                    } else {
                        jAlert(GetResource("signresource", "cannotResend"), GetResource("resource", "msg"));
                    }
                },
                error: function (xhr) { optionsAry[$(obj).attr("id")].error(xhr); }
            });
           
        }
    }


    $.fn.resend = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.signFlowByOpen

})(jQuery);