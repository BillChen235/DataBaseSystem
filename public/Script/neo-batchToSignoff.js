document.write("<script src='\/Script\/jLibrary.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery-ui.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.json-2.2.min.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.blockUI.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/neo-url-encode.js' type='text\/javascript'><\/script>");



//Version: 1.3
//Creator: Neo Su
//Create Date: 2014-03-18
//Modified Date: 2014-08-15
//Used Table: Sys_DocSigning,Sys_DocSignLog
//1.0: 批次送出簽出簽核至下階
//1.1: 增加屬性isSend，由前端判定是否要立即發送信件給下階簽核者 2014/07/21 By Neo Su
//1.2: 增加屬性rejectToOpen，預設為false為退件至上一階。如欲退至開單者則給true 2014/08/15 By Neo Su
//     增加屬性approvedUrl，給批次簽核時最終結案的連結 2014/08/15 By Neo Su
//1.3: Bug Fix  將comment 改用val()方式取 //2014/11/02 By Neo Su

(function ($) {

    //預設屬性
    var _defaultSettings = {
        ajaxUrl: "/Program/WaitingTask/SignAjaxRequest.aspx",
        isSend: true,
        userID: null,
        rejectToOpen: false,
        programID: "FIT_WaitingTask",
        url: "/Program/WaitingTask/FIT_WaitingTask.aspx",
        approvedUrl: "/Program/WaitingTask/FIT_WaitingTask.aspx",
        //rejectedUrl: "/Program/WaitingTask/FIT_WaitingTask.aspx",
        approvedOrRejected: function (event) { },//回傳此次為同意或退件
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
                isSend: _settings.isSend,
                signAry: null,
                userID: _settings.userID,
                rejectToOpen: _settings.rejectToOpen,
                programID: _settings.programID,
                url: _settings.url,
                approvedUrl: _settings.approvedUrl,
                //rejectedUrl: _settings.rejectedUrl,
                controlLoaded: _settings.controlLoaded,
                approvedOrRejected: _settings.approvedOrRejected,
                error: _settings.error
            };

            return this.each(function () {
                var me = $(this);
                $(me).html("");

                var table = "<table id='tableBatchSign' class='fbTable' style='width:100%'>";
                table += "<tr><td style='text-align:right;vertical-align:top;'>" + GetResource("SignResource", "comment") + ":</td>";
                table += "<td><textarea id='txtComment' style='width:99%;height:200px;'></textarea></td></tr></table>";
                //table += "<tr><td></td><td><input type='button' id='btnApproved' class='fbB01' value='" + GetResource("SignResource", "approved") + "'/></td></tr>";
                //table += "<tr><td></td><td><input type='button' id='btnRejected' class='fbB01' value='" + GetResource("SignResource", "rejectedTo") + "'/>&nbsp;";
                //table += "<input type='radio' name='rbtnRejectFlow' value='0' />" + GetResource("SignResource", "rejectToCreator");
                //table += "<input type='radio' name='rbtnRejectFlow' value='1' />" + GetResource("SignResource", "rejectToPrevious") + "</td></tr>";

                $(table).appendTo($(me));

                $(me).dialog({
                    title: GetResource("SignResource", "batchSign"),
                    autoOpen: false,
                    show: 'blind',
                    hide: 'blind',
                    resizable: true,
                    draggable: true,
                    height: 390,
                    width: 450,
                    modal: true,
                    buttons: {
                        "Approved": function () {
                            
                            if (validatorTextarea() <= 0) {
                                var signAry = optionsAry[$(me).attr("id")].signAry;

                                $(me).block({ message: GetResource("resource", "dataProcess") });

                                batchAcceptOrReject($(me), "batchaccept", signAry);
                            }
                        },
                        "Rejected": function () {
                            if (validatorTextarea() <= 0) {
                                var signAry = optionsAry[$(me).attr("id")].signAry;

                                $(me).block({ message: GetResource("resource", "dataProcess") });

                                batchAcceptOrReject($(me), "batchreject", signAry);
                            }
                        },
                        "Close": function () { $(this).dialog("close"); }
                    }
                }); //end of dialog

                function batchAcceptOrReject(obj, key, signAry) {
                    $.ajax({
                        url: optionsAry[$(me).attr("id")].ajaxUrl,
                        type: "POST",
                        data: {
                            key: key,
                            jsonStr: $.toJSON(signAry),
                            rejectFlow: optionsAry[$(obj).attr("id")].rejectToOpen ? "0" : "1",
                            isSend: optionsAry[$(obj).attr("id")].isSend,
                            programID: optionsAry[$(obj).attr("id")].programID,
                            url: optionsAry[$(obj).attr("id")].url,
                            approvedUrl: optionsAry[$(obj).attr("id")].approvedUrl,
                            comment: Url.encode($("#txtComment").val())
                        },
                        cache: false,
                        success: function (result) {
                            $(obj).unblock();
                            if (result === "OK") {
                                jAlert(GetResource("resource", "successfulOperation"), GetResource("resource", "msg"), function () {
                                    $(obj).dialog("close");
                                    optionsAry[$(obj).attr("id")].approvedOrRejected(key == "batchaccept" ? "approved" : "rejected");
                                });
                            } else {
                                jAlert(result, GetResource("resource", "msg"), function () {
                                    $(obj).dialog("close");
                                    optionsAry[$(obj).attr("id")].approvedOrRejected(key == "batchaccept" ? "approved" : "rejected");
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

                function validatorTextarea() {
                    $("#txtComment").next('font').remove();

                    if ($("#txtComment").val() === "") {//此欄位必填
                        $("#txtComment").after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
                        return 1;
                    } 
                    return 0;
                }
          
            }); //end of return this.each(function ()...
        },
        open: function (ary) {
            if (ary.length == 0 || ary == null || typeof (ary) == undefined) {
                jAlert(GetResource("SignResource", "plzChooseDocToSigned"), GetResource('resource', 'msg'));
            } else {
                optionsAry[$(this).attr("id")].signAry = ary;
                $(this).dialog("open");
            }
        }
    }


    $.fn.batchToSignoff = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.signFlowByOpen

})(jQuery);