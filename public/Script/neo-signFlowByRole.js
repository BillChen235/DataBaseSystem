document.write("<script src='\/Script\/jLibrary.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.json-2.2.min.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.blockUI.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/neo-validator-extend.js' type='text\/javascript'><\/script>");

//Version: 1.5
//Creator: Neo Su
//Create Date: 2013-10-04
//Modified Date: 2014-10-22
//Used Table: Sys_SignerList(主),Sys_SignerLevel(副)
//1.0: 送簽流程畫面產生By機能(PM,BU Head,經管,人資...等)
/*1.1 送簽成功回傳下階簽核者資訊
      增加送簽失敗event*/
/*1.2: 增加batchToSignoff方法
       將toSignFailed 的Error Handle拋至前端，尤前端決定如何處置*/
//1.3: 更改get方法，新增屬性取得 empID: $(this).find("option:selected").attr("empID") 2014-10-13 By Neo Su
//1.4: 新增compareSignAry屬性 2014-10-14 By Neo Su
//1.5: 增加非必選欄位的提示訊息 2014-10-22 By Neo Su
(function ($) {   
        
    //預設屬性
    var _defaultSettings = {
        ajaxUrl: "/Program/WaitingTask/SignAjaxRequest.aspx",
        systemID: null,
        formID: null,
        userID: null,
        paramterJsonStr: null,
        requiredLevel: null,//default為NULL，如該層級如欲驗給值請給予陣列(例:[1000,2000]),如全階層都要驗證則可給ALL屬性
        compareSignAry: null,//default為NULL，如該層級有誰要預選可預先給陣列 (例: List<SignerFlow>())
        readOnly: false,
        defaultLanguage: "Chinese",
        programID: "",
        url: "",
        controlLoaded: function () { },//控制項初始化完成時回傳的event
        toSignClicked: function (signer) { },//送簽完成資訊
        toSignFailed: function (xhr) { }//送簽失敗回Call,將Error往上拋至前端
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
                paramterObj: _settings.paramterObj,
                requiredLevel: _settings.requiredLevel,
                compareSignAry: _settings.compareSignAry,
                readOnly: _settings.readOnly,
                defaultLanguage: _settings.defaultLanguage,
                programID: _settings.programID,
                url: _settings.url,
                controlLoaded: _settings.controlLoaded,
                toSignClicked: _settings.toSignClicked,
                toSignFailed: _settings.toSignFailed
            };

            return this.each(function () {
                var me = $(this);
                $(me).html("");
                $.ajax({
                    url: _settings.ajaxUrl,
                    data: {
                        key: "getsignflowbyrole",
                        systemID: optionsAry[$(this).attr("id")].systemID,
                        formID: optionsAry[$(this).attr("id")].formID,
                        defaultLanguage: optionsAry[$(this).attr("id")].defaultLanguage,
                        userID: optionsAry[$(this).attr("id")].userID,
                        jsonStr: optionsAry[$(this).attr("id")].compareSignAry === null ? "" : $.toJSON(optionsAry[$(this).attr("id")].compareSignAry),
                        requiredLevel: optionsAry[$(this).attr("id")].requiredLevel === null ? "" : $.toJSON(optionsAry[$(this).attr("id")].requiredLevel),
                        paramterJsonStr: optionsAry[$(this).attr("id")].paramterObj === null ? "" : $.toJSON(optionsAry[$(this).attr("id")].paramterObj)
                    },
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    success: function (json) {
                        setSignFlow(json);
                        $.each($(me).find("select"),function(i,select){
                            $(select).prop("disabled", optionsAry[$(me).attr("id")].readOnly);
                        });
                            
                        optionsAry[$(me).attr("id")].controlLoaded();
                    },//end of success
                    error: function (xhr) {
                        //alert(xhr.responseText);
                    }
                }); //end of ajax


                function setSignFlow(json) {
                    $(me).html("");
                    if (jlinq.from(json.signerlist).notEquals("signLevel", 0).select().length == 0) {
                        $(me).html(GetResource("SignResource", "plzContactAdmin"));
                        //if (_settings.defaultLanguage.toLowerCase() == "chinese")
                        //    $(me).html("<font color='red'>未設定簽核流程!請洽系統維護相關人員設定</font>");
                        //else
                        //    $(me).html("<font color='red'>Please contact the IT to set signoff!</font>");
                    }
                    else
                        $(json.signerflow).appendTo($(me));
                } //end of function setSignFlow...
            }); //end of return this.each(function ()...
        },
        get: function () {
            var i = 0;
            var ary = [];
            $(this).find("select[id^=cboLevel_]").each(function () {                
                if ($(this).find("option:selected").val() != "") {
                    ary[i] = {
                        systemID: $(this).find("option:selected").attr("systemID"),
                        formID: $(this).find("option:selected").attr("formID"),
                        signLevel: $(this).find("option:selected").attr("signLevel"),
                        levelDesc: $(this).find("option:selected").attr("levelDesc"),
                        levelForeignDesc: $(this).find("option:selected").attr("levelForeignDesc"),
                        empID: $(this).find("option:selected").attr("empID"),
                        userID: $(this).find("option:selected").attr("userID"),
                        userName: $(this).find("option:selected").attr("userName"),
                        userForeignName: $(this).find("option:selected").attr("userForeignName"),
                        userEmail: $(this).find("option:selected").attr("userEmail")
                    };
                    i++;
                }
            });
            return ary;
        },
        toSignoff: function (docNO, formJson) {
            var me = $(this);
                                  
            if (methods.validator.apply(this) <= 0) {

                $.blockUI({ message: GetResource("resource", "dataProcess") });                

                $.ajax({
                    url: optionsAry[$(this).attr("id")].ajaxUrl,
                    type: "POST",
                    data: {
                        key: "tosignoff",
                        jsonstr: $.toJSON(methods.get.apply(this)),
                        formJson: typeof (formJson) == "undefined" ? "" : $.toJSON(formJson),
                        docNO: docNO,
                        programID: optionsAry[$(this).attr("id")].programID,
                        url: optionsAry[$(this).attr("id")].url
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {
                        $.unblockUI();
                        jAlert(json.msg, "message");
                        optionsAry[$(me).attr("id")].toSignClicked(json.signer);
                    },
                    error: function (xhr) {
                        $.unblockUI();
                        //alert(xhr.responseText);
                        optionsAry[$(me).attr("id")].toSignFailed(xhr);
                    }
                });
            }
        },
        toBatchSignoff: function (docNOAry) {
            var me = $(this);            

            if (methods.validator.apply(this) <= 0) {

                $.blockUI({ message: GetResource("resource", "dataProcess") });
                var ary = {
                    listDocNO:docNOAry,
                    listSignFlow: methods.get.apply(this)
                }
                $.ajax({
                    url: optionsAry[$(this).attr("id")].ajaxUrl,
                    type: "POST",
                    data: {
                        key: "batchtosignoff",
                        jsonstr: $.toJSON(ary),
                        programID: optionsAry[$(this).attr("id")].programID,
                        url: optionsAry[$(this).attr("id")].url
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {
                        $.unblockUI();
                        jAlert(json.msg, "message");
                        optionsAry[$(me).attr("id")].toSignClicked(json.signer);
                    },
                    error: function (xhr) {
                        $.unblockUI();
                        //alert(xhr.responseText);
                        optionsAry[$(me).attr("id")].toSignFailed(xhr);
                    }
                });
            }
        },
        validator: function () {
            var validator = 0;
            if (optionsAry[$(this).attr("id")].requiredLevel != null) {
                if (optionsAry[$(this).attr("id")].requiredLevel == "ALL") {
                    $("select[id^=cboLevel_]").each(function () {
                        if($(this).find("option").length >= 2)
                            validator += $(this).validatorSelect();
                    });                    
                }
                else {
                    for (var i in optionsAry[$(this).attr("id")].requiredLevel) {
                        if ($("select[id=cboLevel_" + optionsAry[$(this).attr("id")].requiredLevel[i] + "]").find("option").length >= 2)
                            validator += $("select[id=cboLevel_" + optionsAry[$(this).attr("id")].requiredLevel[i] + "]").validatorSelect();
                    }
                }
            }

            return validator;
        }
    }
   

    $.fn.signFlowByRole = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    } //end of $.fn.signFlowByRole
  
})(jQuery);