//document.write("<link href='\/Resources\/css\/WEB.css' rel='stylesheet' type='text\/css' \/>");
document.write("<link href='\/Resources\/css\/jquery.wysiwyg.css' rel='stylesheet' type='text\/css' \/>");
document.write("<link href='\/Resources\/css\/uploadify3\/uploadify.css' rel='stylesheet' type='text\/css' \/>");

document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.wysiwyg.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.uploadify.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/swfobject.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/neo-url-encode.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/neo-validator-extend.js' type='text\/javascript'><\/script>");

//version: 2.5
//Creator: Neo Su
//Modified Date:2014-03-10
//1.0 HTML編輯器
//1.1 修改關閉HTML編輯器不載入Tab
//1.2 修改各Control ID自動給值
//1.3 新增屬性userID,uploadFolder與上傳元件升級至3.1版
//1.4 取消預設Selected Tab為1時，將Control Disable
//1.5 新增enable function
//1.6 開放自訂功能,增加屬性addControl,可使用陣列或物件{name,icon,tooltip,exec}
//1.7 修正jquery-ui-1.10後tab屬性改變
//1.8 加入get,getEncode,set,clearThenSet,clear,disable,enable,validator 方法
//1.9 Bug fix : 修正頁面上載入多個editor control時，上傳內容錯置問題
//2.0 新增修改屬性mehtod
//2.1 新增屬性fileSizeLimit 並調整上傳附件最大為5MB。
//2.2 新增rows,cols兩個屬性，用來控制editor的列高與欄寬 2014-07-11 By Neo Su
//2.3 新增previewHeight,previewWidth 兩個屬性，用來控制editor preview的列高與欄寬 2014-07-15 By Neo Su
//2.4 更改引入的uploadify版本 2014-09-20 By Neo Su
//2.5 修正set與clearThenSet方法。如值為null時不填入目前的editor content中 2015-03-09 By Neo Su

(function ($) {  

    //預設屬性
    var _defaultSettings = {
        url: '/Program/Public/AjaxRequestUploadAttachment.aspx',
        editorTab: 'Editor',
        privewTab: 'Preview',
        initialContent: '',
        enableEditor: true,
        enableUpload: true,
        dialogTitle: 'File Upload',
        selectTabIndex: 0,
        fileSizeLimit: "5MB",
        rows: '10',
        cols: '60',
        previewHeight: '300px',
        previewWidth: '90%',
        userID: '',
        uploadFolder: '',//使用相對路徑方式(~/Upload/Doc/)
        addControl: null,//要增加自訂元件時的物件,name,icon,tooltip,exec
        tabID: 'editorTabs',
        tab1ID: 'editor',
        tab2ID: 'show',
        editorID: 'editorMemo',
        dialogUploadID: 'uploadManager',
        uploadID: 'fileUpload',
        queueID: 'fileQueue',
        uploadMsgID: 'uploadMsg',
        btnUploadID: 'btnUpload',
        events: null,
	    interruptUpload: function () {
            return false;
        }
    };


    //紀錄覆寫後的屬性
    var optionsAry = [];


    var methods = {
        init: function (settings) {

            //若無自行設定屬性則繼承預設屬性
            var _settings = $.extend(_defaultSettings, settings);

            //將繼承後的屬性指定為全域變數

            var id = $(this).attr("id");
            _settings.tabID = id + "_editorTabs";
            _settings.tab1ID = id + "_editor";
            _settings.tab2ID = id + "_show";
            _settings.editorID = id + "_editorMemo";
            _settings.dialogUploadID = id + "_uploadManager";
            _settings.uploadID = id + "_fileUpload";
            _settings.queueID = id + "_fileQueue";
            _settings.uploadMsgID = id + "_uploadMsg";
            _settings.btnUploadID = id + "_btnUpload";

            optionsAry[$(this).attr("id")] = {
                url: _settings.url,
                editorTab: _settings.editorTab,
                privewTab: _settings.privewTab,
                initialContent: _settings.initialContent,
                enableEditor: _settings.enableEditor,
                enableUpload: _settings.enableUpload,
                dialogTitle: _settings.dialogTitle,
                selectTabIndex: _settings.selectTabIndex,
                fileSizeLimit: _settings.fileSizeLimit,
                rows: _settings.rows,
                cols: _settings.cols,
                previewHeight: _settings.previewHeight,
                previewWidth: _settings.previewWidth,
                userID: _settings.userID,
                uploadFolder: _settings.uploadFolder,
                addControl: _settings.addControl,
                tabID: _settings.tabID,
                tab1ID: _settings.tab1ID,
                tab2ID: _settings.tab2ID,
                editorID: _settings.editorID,
                dialogUploadID: _settings.dialogUploadID,
                uploadID: _settings.uploadID,
                queueID: _settings.queueID,
                uploadMsgID: _settings.uploadMsgID,
                btnUploadID: _settings.btnUploadID,
		interruptUpload: _settings.interruptUpload
            };

            return this.each(function () {               

                var me = $(this);
                if (optionsAry[$(me).attr("id")].enableEditor || optionsAry[$(me).attr("id")].enableUpload) {
                    //動態產生相關Control
                    var editorHtml = "<div name='tab' id='" + optionsAry[$(me).attr("id")].tabID + "' style='width:100%;'>";
                    editorHtml += "<ul> <li><a href='#" + optionsAry[$(me).attr("id")].tab1ID + "'></a></li>";
                    editorHtml += "<li><a href='#" + optionsAry[$(me).attr("id")].tab2ID + "'></a></li></ul>";
                    editorHtml += "<div name='tab1' id='" + optionsAry[$(me).attr("id")].tab1ID + "'>";
                    editorHtml += "<textarea id='" + optionsAry[$(me).attr("id")].editorID + "' rows='" + optionsAry[$(me).attr("id")].rows + "' cols='" + optionsAry[$(me).attr("id")].cols + "' style='width:100%;'></textarea></div>";
                    editorHtml += "<div name='tab2' id='" + optionsAry[$(me).attr("id")].tab2ID + "' style='width:" + optionsAry[$(me).attr("id")].previewWidth + "; height:" + optionsAry[$(me).attr("id")].previewHeight + ";border: 1px solid #808080; margin:10px 10px 10px 10px;overflow:auto;'></div></div>";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].dialogUploadID + "'>";
                    editorHtml += "<table width='100%' class='t01'>";
                    editorHtml += "<tr class='altrow'>";
                    editorHtml += "<td style='width: 15%; text-align: right'>Step 1:</td>";
                    editorHtml += "<td><input type='file' id='" + optionsAry[$(me).attr("id")].uploadID + "' />";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].queueID + "'></div>";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].uploadMsgID + "'></div></td></tr><tr class='altrow'>";
                    editorHtml += "<td style='text-align: right;'>Step 2:</td>";
                    editorHtml += "<td><input id='" + optionsAry[$(me).attr("id")].btnUploadID + "' type='button' value='Upload' class='upload_bt' /></td></tr></table></div>";

                    //將動態產生之html append 進div裡
                    $(editorHtml).appendTo($(this));

                    //更改Tab名稱
                    $('#' + optionsAry[$(me).attr("id")].tabID).find('ul:first li:first a').html(optionsAry[$(me).attr("id")].editorTab);
                    $('#' + optionsAry[$(me).attr("id")].tabID).find('ul:first li:last a').html(optionsAry[$(me).attr("id")].privewTab);


                    //初始化Tab
                    $('#' + optionsAry[$(me).attr("id")].tabID).tabs({
                        active: optionsAry[$(me).attr("id")].selectTabIndex,
                        activate: function (event, ui) {
                            //console.log(ui);
                            //if (ui.index == 1)
                            $('#' + optionsAry[$(me).attr("id")].tab2ID).html($('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg('getContent'));
                        }
                    }); //end of tab

                    ////如將tab預設為預覽時,將編輯Tab Disable
                    //if (_settings.selectTabIndex == 1) {
                    //    $('#' + _settings.tabID).tabs('option', 'disabled', [0]);
                    //} //end of if index                 


                    $(this).find('div[name=tab1]  div:first').css('width', '90%');
                    $(this).find('div[name=tab1]  div:first iframe').css('width', '98%');


                } //end of   if (_settings.enableEditor || _settings.enableUpload) 
                else {
                    //動態產生相關Control
                    var editorHtml = "<textarea id='" + optionsAry[$(me).attr("id")].editorID + "' rows='" + optionsAry[$(me).attr("id")].rows + "' cols='" + optionsAry[$(me).attr("id")].cols + "' style='width:100%;'></textarea>";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].dialogUploadID + "'>";
                    editorHtml += "<table width='100%' class='t01'>";
                    editorHtml += "<tr class='altrow'>";
                    editorHtml += "<td style='width: 15%; text-align: right'>Step 1:</td>";
                    editorHtml += "<td><input type='file' id='" + optionsAry[$(me).attr("id")].uploadID + "' />";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].queueID + "'></div>";
                    editorHtml += "<div id='" + optionsAry[$(me).attr("id")].uploadMsgID + "'></div></td></tr><tr class='altrow'>";
                    editorHtml += "<td style='text-align: right;'>Step 2:</td>";
                    editorHtml += "<td><input id='" + optionsAry[$(me).attr("id")].btnUploadID + "' type='button' value='Upload' class='upload_bt' /></td></tr></table></div>";

                    //將動態產生之html append 進div裡
                    $(editorHtml).appendTo($(this));
                } //end of else

                //初始化Editor
                $('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg({
                    //resizeOptions: {},
                    initialContent: optionsAry[$(me).attr("id")].initialContent,
                    rmUnusedControls: true,
                    controls: {
                        bold: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        italic: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        strikeThrough: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        underline: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        justifyLeft: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        justifyCenter: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        justifyRight: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        justifyFull: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        indent: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        outdent: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        undo: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        redo: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        insertOrderedList: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        insertUnorderedList: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        //insertTable: { visible: _settings.enableEditor },
                        html: { visible: optionsAry[$(me).attr("id")].enableEditor },
                        //cut: { visible: _settings.enableEditor },
                        //copy: { visible: _settings.enableEditor },
                        //paste: { visible: _settings.enableEditor },
                        removeFormat: { visible: optionsAry[$(me).attr("id")].enableEditor }
                    }
                }); //end of editor

                //如將tab預設為預覽時,將編輯的Content秀至預覽內
                if (optionsAry[$(me).attr("id")].selectTabIndex == 1 && (optionsAry[$(me).attr("id")].enableEditor || optionsAry[$(me).attr("id")].enableUpload)) {
                    $('#' + optionsAry[$(me).attr("id")].tab2ID).html($('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg('getContent'));
                }//end of if index  

                if (optionsAry[$(me).attr("id")].enableUpload) {
                    //將新增Editor上傳按扭
                    $('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg("addControl",
                                "upload", {
                                    icon: '/Resources/Images/icon_attachment.gif',
                                    tooltip: optionsAry[$(me).attr("id")].dialogTitle,
                                    visible: true,
                                    exec: function () { $('#' + optionsAry[$(me).attr("id")].dialogUploadID).dialog('open'); }
                                }); //end of addControl
                } //end of if enableEditor

                if (optionsAry[$(me).attr("id")].addControl != null) {
                    if (optionsAry[$(me).attr("id")].addControl.length > 0) {
                        for (var i in optionsAry[$(me).attr("id")].addControl) {
                            //將新增Editor上傳按扭
                            $('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg("addControl",
                                         optionsAry[$(me).attr("id")].addControl[i].name, {
                                             icon: optionsAry[$(me).attr("id")].addControl[i].icon,
                                             tooltip: optionsAry[$(me).attr("id")].addControl[i].tooltip,
                                             visible: true,
                                             exec: optionsAry[$(me).attr("id")].addControl[i].exec
                                         }); //end of addControl   
                        }
                    } else {
                        //將新增Editor上傳按扭
                        $('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg("addControl",
                                    optionsAry[$(me).attr("id")].addControl.name, {
                                        icon: optionsAry[$(me).attr("id")].addControl.icon,
                                        tooltip: optionsAry[$(me).attr("id")].addControl.tooltip,
                                        visible: true,
                                        exec: optionsAry[$(me).attr("id")].addControl.exec
                                    }); //end of addControl   
                    }
                } //end of if addControl

                //初始化Dialog預設為隱藏
                $('#' + optionsAry[$(me).attr("id")].dialogUploadID).dialog({
                    title: optionsAry[$(me).attr("id")].dialogTitle,
                    autoOpen: false,
                    width: 500,
                    //modal: true,
                    buttons: { 'Close': function () { $('#' + optionsAry[$(me).attr("id")].dialogUploadID).dialog('close'); } }
                }); //end of dialog



                $("#" + optionsAry[$(me).attr("id")].uploadID).uploadify({
                    swf: "/Resources/css/uploadify3/uploadify.swf",
                    uploader: optionsAry[$(me).attr("id")].url,
                    cancelImg: "/Resources/Images/cancel.png",
                    successTimeout: 500,
                    formData: { key: "uploadattachment", userID: optionsAry[$(me).attr("id")].userID, uploadFolder: optionsAry[$(me).attr("id")].uploadFolder },
                    queueID: optionsAry[$(me).attr("id")].queueID,
                    auto: false,
                    multi: true,
                    fileSizeLimit: optionsAry[$(me).attr("id")].fileSizeLimit,
                    //queueSizeLimit: 1,
                    //fileTypeDesc: "Excel Files",
                    //fileTypeExts: "*.xls",
                    buttonText: "Select File",
                    removeCompleted: true,
                    overrideEvents: ["onSelectError", "onDialogClose"],
                    onSelect: function (file) {

                    },
                    onCancel: function (file) {

                    },
                    onSelectError: function (file, errorCode, errorMsg) {
                        if (errorCode == "-110")
                            jAlert("所選擇檔案 " + file.name + " 超過限制上傳大小" + optionsAry[$(me).attr("id")].fileSizeLimit + "!", "錯誤");
                    },
                    onUploadError: function (file, errorCode, errorMsg, errorString) {
                        if (errorCode != "-280")
                            jAlert(file.name + " 上傳失敗 : " + errorString, "錯誤");
                    },
                    onUploadSuccess: function (file, data, response) {
                        var span = '<span id="' + optionsAry[$(me).attr("id")].queueID + '_file" style="display:none">' + file.name + '</span>';
                        $(span).appendTo($('#' + optionsAry[$(me).attr("id")].uploadMsgID));
                        $('#' + optionsAry[$(me).attr("id")].editorID).wysiwyg('insertHtml', data);
                    },
                    onUploadComplete: function (file) {
                        var uploadFile = '';
                        $('#' + optionsAry[$(me).attr("id")].uploadMsgID).find('span').each(function () {
                            var href = optionsAry[$(me).attr("id")].uploadFolder != "" ?
                                optionsAry[$(me).attr("id")].uploadFolder.replace("~/", "/") : "/Upload/Doc/";
                            uploadFile += '<a href="' + href + $(this).html() + '"><font color=blue>' + $(this).html() + '</font></a><br/>';
                            //uploadFile += '<img src=Upload/Doc/' + $(this).html() + ' alt=pic/><br/>';
                            $(this).remove();
                        });
                    }
                }); //end of fileUpload

                //繫結上傳按鈕事件
                $('#' + optionsAry[$(me).attr("id")].btnUploadID).click(function () {
                      if (!optionsAry[$(me).attr("id")].interruptUpload()) {
                        $('#' + optionsAry[$(me).attr("id")].uploadID).uploadify("settings", "formData",
                             { key: "uploadattachment", userID: optionsAry[$(me).attr("id")].userID, uploadFolder: optionsAry[$(me).attr("id")].uploadFolder });
                        $('#' + optionsAry[$(me).attr("id")].uploadID).uploadify("upload", "*");
                    }
                }); //end of btnUpload

            }); //end of return each
        },
        get: function () {
            return $(this).find("textarea").wysiwyg("getContent");
        },
        getEncode: function () {
            return Url.encode($(this).find("textarea").wysiwyg("getContent"));
        },
        set: function (content) {
            if (content != null) {
                $(this).find("textarea").wysiwyg("setContent", $(this).find("textarea").wysiwyg("getContent") +
                    content);
                if (optionsAry[$(this).attr("id")].enableEditor || optionsAry[$(this).attr("id")].enableUpload)
                    $(this).find("div[name=tab2]").html($(this).find("textarea").wysiwyg("getContent"));
            }
        },
        clearThenSet: function (content) {
            if (content != null && content != "null") {
                $(this).find("textarea").wysiwyg("setContent", content);
                if (optionsAry[$(this).attr("id")].enableEditor || optionsAry[$(this).attr("id")].enableUpload)
                    $(this).find("div[name=tab2]").html($(this).find("textarea").wysiwyg("getContent"));
            }
        },
        clear: function () {
            $(this).find("textarea").wysiwyg("setContent", "");
            if (optionsAry[$(this).attr("id")].enableEditor || optionsAry[$(this).attr("id")].enableUpload)
                $(this).find("div[name=tab2]").html($(this).find("textarea").wysiwyg("getContent"));
        },        
        disable: function () {
            if (optionsAry[$(this).attr("id")].enableEditor || optionsAry[$(this).attr("id")].enableUpload) {
                $(this).find("div[name=tab]").tabs("option", "active", 1);
                $(this).find("div[name=tab]").tabs("disable", 0);
                $(this).find("div[name=tab2]").html($(this).find("textarea").wysiwyg("getContent"));
            }
            else {
                var html = $(this).find('textarea').wysiwyg('getContent');
                var id = $(this).attr("id") + "_viewShow";
                $(this).next($("#" + id)).remove();
                var div = "<div name='tab2' id='" + id + "'style='width:100%; min-height:150px;max-heigh:100%;border:1px solid #808080;margin:10px 10px 10px 10px;overflow:auto;'>" + html + "</div>";
                $(this).hide();
                $(this).after(div);
            }            
        },
        enable: function () {
            if (optionsAry[$(this).attr("id")].enableEditor || optionsAry[$(this).attr("id")].enableUpload) {
                $(this).find("div[name=tab]").tabs("enable", 0);
                $(this).find("div[name=tab]").tabs("option", "active", 0);
                $(this).find("div[name=tab2]").html($(this).find('textarea').wysiwyg('getContent'));
            } else {
                var id = $(this).attr("id") + "_viewShow";
                $(this).next($("#" + id)).remove();
                $(this).show();
            }
        },
        validator: function () {            
            return $(this).validatorHtmlTag($(this).find("textarea").wysiwyg("getContent"));
        },
        clearValidator: function () {
            $(this).removeClass('input_text_error');
            $(this).prev('div').remove();
        },
        settings: function (property, value) {
            for (var p in optionsAry[$(this).attr("id")]) {
                if (property === p)
                    optionsAry[$(this).attr("id")][p] = value;
            }
        }
    };//end of methods

    $.fn.editorControl = function (method) {

        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {            
            return methods.init.apply(this, arguments);
        }
    };//end of editorControl

})(jQuery);