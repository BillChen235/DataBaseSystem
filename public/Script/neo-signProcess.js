document.write("<script src='\/Script\/moment.min.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");

//Version: 1.8
//Creator: Neo Su
//1.1: 簽核流程產生
//1.2 Json .NET 更新後傳回的格式變為ISOString(2013-10-01T17:40.00)
//1.3 移除dateFormat與stringFunction的js引用更改引入moment可讓ie8 parse isostring格式
//1.4 更改url屬性為相對路徑 2014/08/07 By Neo Su
//1.5 增加平行會簽，更改顯示方式 2014/10/30 By Neo Su
//1.6 將結案改為核準 2014/11/06 By Neo Su
//1.7 於Pending區塊不顯示簽核日期與簽核結果 2015/03/24 By Neo Su
//1.8 目前簽核者後的階層均不顯示簽核日期與結果 2015/4/14 By Neo Su

(function ($) {
    $.fn.signProcess = function (settings) {
        //預設屬性
        var _defaultSettings = {
            url: "/Program/WaitingTask/SignAjaxRequest.aspx",
            docNO: null,
            formID: null,
            systemID: null,
            jsonObj: null,
            defaultLanguage: "Chinese"
        };

        //若無自行設定屬性則繼承預設屬性
        var _settings = $.extend(_defaultSettings, settings);

        return this.each(function () {
            var me = $(this);
            $(me).html("");
            $(me).css("overflow","inherit");
            var arrowHtml = "<table style='width:50px;height:100px;float:left;margin-top:20px;'>";
            arrowHtml += "<tr><td style='text-align:center'>";
            arrowHtml += "<img src='/Resources/Images/icon_item_prog.gif' style='border:0px;' alt='' align='AbsMiddle'/>";
            arrowHtml += "</td></tr></table>";

            if (_settings.jsonObj != null) {
                setSignProcess(_settings.jsonObj);
            } else {
                $.ajax({
                    url: _settings.url,
                    data: { key: "getsignlist", docNO: _settings.docNO, systemID: _settings.systemID, formID: _settings.formID },
                    dataType: "json",
                    cache: false,
                    success: function (json) {

                        setSignProcess(json.signlist);

                    } //end of success
                }); //end of ajax
            } //end of else


            function setSignProcess(json) {
                var index = 0;
                var stage = 1;
                var currentSignLeve = jlinq.from(json).equals("manageStatus", "WAIT").any() ?
                    jlinq.from(json).equals("manageStatus", "WAIT").first().signLevel : -1;

                json = jlinq.from(json).sort("signLevel").select();
                var completedLevel = null;
                var coSign = "";
                for (var item in json) {
                    coSign = jlinq.from(json).equals("signLevel", json[item].signLevel).select().length > 1 ?
                            _settings.defaultLanguage.toLowerCase() == "chinese" ? "(會簽)" : "(Countersign)" : "";
                    if (index != 0 && completedLevel !== json[item].signLevel) {
                        $(arrowHtml).appendTo($(me));
                        stage++;                        
                    } //end of if(index....
                    

                    index++;
                    completedLevel = json[item].signLevel;

                    var signedDate = json[item].signedDate != null && "WAIT" !== json[item].manageStatus  && (json[item].signLevel < currentSignLeve || currentSignLeve == -1) ?
                                        moment(json[item].signedDate).format("YYYY-MM-DD HH:mm:ss") : "";
                    var signedResult = json[item].signedResult != null && "WAIT" !== json[item].manageStatus && (json[item].signLevel < currentSignLeve || currentSignLeve == -1) ?
                                        json[item].signedResult : "";

                    var processTable = "";
                    if ("WAIT" == json[item].manageStatus) {
                        processTable = "<table class='signProcessing'><tr><th>";
                    } else {
                        processTable = "<table class='signProcess'><tr><th>";
                    }
                    if (index == 1) {
                        processTable += _settings.defaultLanguage.toLowerCase() == "chinese" ?
                                         "建立" : "OPEN";
                    } else if (index == json.length) {
                        processTable += _settings.defaultLanguage.toLowerCase() == "chinese" ?
                                         "核準" : "Finally Approved";
                    } else {
                        processTable += _settings.defaultLanguage.toLowerCase() == "chinese" ?
                                         "第 " + stage + " 階" + coSign : "Stage" + stage + coSign;
                    }
                    processTable += "</th></tr><tr><td>";
                    processTable += _settings.defaultLanguage.toLowerCase() == "chinese" ?
                                    "<font color='Blue' title="+json[item].userID+">" + json[item].userName + "</font>" :
                                    "<font color='Blue' title="+json[item].userID+">" + json[item].userForeignName + "</font>";
                    processTable += "</td></tr><tr><td>";
                    processTable += "<font color='#8B2323'>" + signedDate + "</font>";
                    processTable += "</td></tr><tr><td>";
                    processTable += "<font color='Green'>" + signedResult + "</font>";
                    processTable += "</td></tr></table>";

                    $(processTable).appendTo($(me));

                } //end of for(var item...
            } //end of function setSignProcess...
        }); //end of return this.each(function ()...

    } //end of $.fn.signProcess

})(jQuery);