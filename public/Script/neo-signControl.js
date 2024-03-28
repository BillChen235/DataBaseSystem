document.write("<link href='\/Resources\/css\/Facebook.css' rel='stylesheet' type='text\/css' \/>");
//document.write("<link href='\/Resources\/css\/token-input-facebook.css' rel='stylesheet' type='text/css' \/>");
//document.write("<link href='\/Resources\/css\/token-input.css' rel='stylesheet' type='text/css' \/>");
//document.write("<link href='\/Resources\/css\/token-input-mac.css' rel='stylesheet' type='text/css' \/>");


document.write("<script src='\/Script\/jquery-ui.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.json-2.2.min.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jlinq.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/dateFormat.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.blockUI.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.alerts.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/jquery.tokeninput.js' type='text\/javascript'><\/script>");
document.write("<script src='\/Script\/neo-editorControl.js' type='text\/javascript'><\/script>");

//version: 3.6
//modifid Data: 2013-10-28
//creator: Neo Su
//1.5 畫面所有Control由javascript 新增並Append至Body中
//1.6 增加BCC屬性/功能
//1.7 簽核失敗後Reload Page
//1.8 增加中斷方法interrupted，此方法可強制中斷簽核程序
//    新增accepted,reject,changeSigner,backForward 方法皆會實作callback方法
//1.9 增加Loaded方法，此方法會回傳Control初始化後狀態為何(normal,approved,notinlist,completed)
//2.0 Loaded方法新增回傳signLevel,userID
//2.1 實作callback方法時，明確告知是何種event所驅動
//2.2 更改controlLoaded方法回傳時給目前簽核者的物件，如該文件為APPROVED則回傳null
//2.3 符合jquery 1.10 checkbox判斷勾選方式改為 $("#chk").prop("checked")
//2.4 在finshCallback前先執行$(thisControl).hide()
//2.5 新增nextSignerData屬性，預設為空陣列。如要啟動下階簽核者自選則給定階層陣列
//2.6 增加屬性isSend，由前端判定是否要立即發送信件給下階簽核者 2014/07/21 By Neo Su
//2.7 核準與退件時新增提示下階簽核人的mail為何 2014/08/07 By Neo Su
//2.8 修改給定下階簽核者的邏輯。 2014/08/18 By Neo Su
//    假設目前簽核者為2000，已有下階為3000。而陣列內如給定[4000,5000]，則因有下階3000則不會出現下階可挑選名單。
//2.9 修改跨時區簽核時寫入資料庫的時間錯誤，已更正統一從Server上取得目前時間為主 2014/09/12 By Neo Su
//3.0 新增屬性approvedUrl，核準時使用與簽核url不同的屬性使用 2014/09/12 By Neo Su
//3.1 拿掉引入token-input.css 2014-09-19 By Neo Su
//3.2 增加平行會簽邏輯，目前已有同階層多人的概念 2014-10-30 By Neo Su
//3.3 新增requiredChooseNextSigner屬性，預設為false，如nextSignerData.length > 0且此屬性為true時，則強制驗證下階簽核者必選 2015-03-17 By Neo Su
//3.4 新增rebuildSignList事件，用於在簽核前想要同步重建目前已存在的簽核列表，或是增加簽核人員 2015-04-23 By Neo Su
//3.5 新增enableOptionFlow屬性，可選擇是否顯示送至退件者選項，預設為true 2015-04-24 By Neo Su
//3.6 如enableEscalate為true 則將核準與退件按鈕隱藏 2015-05-08 By Neo Su
(function ($) {

    $.fn.signControl = function (settings) {
        var _defaultSettings = {
            docNO: '',
            systemID: '',
            formID: '',
            jsonObj: null,
            defaultLanguage: 'chinese',
            userID: '',
            programID: '',
            ajaxUrl: "/Program/WaitingTask/SignAjaxRequest.aspx",
            url: '',
            approvedUrl: '',
            specialCCTo: '',
            bcc: '',
            acceptText: '',
            nextSignerData: [],//以陣列方式表達，例 [0,1000,2000,9000]
            nextSignerFirstOptionText: "Please Select",
            isSend: true,
            requiredChooseNextSigner: false,
            enableEditor: false,
            enableCosign: false,
            enableChangeSigner: false,
            enableEscalate: false,
            enableOptionFlow: true,//是否隱藏送至退件者選項
            interrupted: function (event) { return false; },//中斷簽核Control,會明確告知目前是由何種event驅動(accepted,reject,escalate,chagesigner,forward,backward)
            controlLoaded: function (event, signer) { },//簽核Control初始化完成,會告知目前初始狀態(normal,approved,notinlist,completed)
            rebuildSignList: function (event, signer) { },//簽核前欲更動目前的簽核列表，使用類別(SignerFlow)
            callback: function (event) { },//取得頁面資訊搜集成Json回傳至此,於此Control內所有動作皆會call此方法,明確告知目前是由何種event驅動(accepted,reject,escalate,chagesigner,forward,backward)
            finshCallBack: function () { }//簽核動作完成後所執行的動作           
        }; //end of _defaultSettings

        var _settings = $.extend(_defaultSettings, settings);
        var signList;
        var levelDesc = '';
        var levelForeignDesc = '';
        var thisControl = this;

        return this.each(function () {
            var me = $(this);
            //$(this).bind(_settings.bind, _settings.callback);

            var tableSignControl = "<table id='table_signControl' width='100%' class='form_item_label'>";
            tableSignControl += "<tr><td style='text-align: right; width: 10%'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "簽核階層:</td>" : "Sign Level:</td>";
            tableSignControl += "<td><font color='green'><span id='signLevel'>N/A</span></font></td></tr>";
            tableSignControl += "<tr><td style='text-align: right'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "簽核者:</td>" : "Signer:</td>";
            tableSignControl += "<td><span id='signer'>N/A</span></td></tr>"; 
            tableSignControl += "<tr><td style='text-align: right;'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "送簽時間:</td>" : "Signed Date:</td>";
            tableSignControl += "<td><font color='green'><span id='signTimes'>N/A</span></font></td></tr>";
            tableSignControl += "<tr><td style='text-align: right; vertical-align: top;'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "意見:</td>" : "Comment:</td>";
            tableSignControl += "<td><div id='div_memo' style='width:80%;'></div></td></tr>";
            tableSignControl += "<tr><td style='text-align: right;'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "副本抄送:</td>" : "CC To:</td>";
            tableSignControl += "<td><div id='ccTo'></div></td></tr>";
            tableSignControl += "<tr style='display:none;'><td style='text-align: right;'></td><td><span id='bcc'>N/A</span></td></tr>";
            tableSignControl += "<tr><td style='text-align: right;'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "自選CC名單:</td>" : "Customer CC To:</td>";
            tableSignControl += "<td><input id='txtCustomerCCTo' type='text' class='input_text' style='width: 60%' /><div style='display: none'></div></td></tr>";
            tableSignControl += "<tr><td style='text-align: right;'></td>";
            tableSignControl += "<td><input id='chbChangeSigner' type='checkbox' /><font color='blue'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "更改簽核者</font>" : "Change Signer</font>";
            tableSignControl += "<div id='div_change'><table><tr><td><font color='green'>Step 1:</font></td>";
            tableSignControl += "<td><input id='txtSigner' type='text' class='input_text' /></td></tr>";
            tableSignControl += "<tr><td><font color='green'>Step 2:</font></td>";
            tableSignControl += "<td><input id='btnConfirm' type='button' value='";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "確定'" : "Confirm'";
            tableSignControl += " class='fbB01' /></td></tr></table></div></td></tr>";
            tableSignControl += "<tr><td style='text-align: right;'></td>";
            tableSignControl += "<td><input id='chbAddCoSign' type='checkbox' /><font color='blue'>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "是否加入會簽主管</font>" : "Add Co-Sign Mgr.</font>";
            tableSignControl += "<div id='div_coSign'><table><tr><td><font color='green'>Step 1:</font></td>";
            tableSignControl += "<td><div id='cosign'>";
            tableSignControl += "<input id='rbtnBefore' name='coSign' type='radio' value='backward' /><font>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "簽核<font color='red'>前</font>,先會簽某位簽核主管</font><br />" : 
                "<font color='red'>Before</font> you sign, please send this form first to someone.</font><br />";
            tableSignControl += "<input id='rbtnAfter' name='coSign' type='radio' value='forward' /><font>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "簽核<font color='red'>後</font>,先送至某位簽核主管</font>" :
                "<font color='red'>After</font> you sign, please send this form  to someone.</font>";
            tableSignControl += "</div></td></tr><tr><td><font color='green'>Step 2:</font></td>";
            tableSignControl += "<td><input id='txtCoSign' class='input_text' /></td></tr>";
            tableSignControl += "<tr><td><font color='green'>Step 3:</font></td>";
            tableSignControl += "<td><input id='btnCoSign' type='button' class='fbB01' value='";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "送至會簽主管' />" : "Send To Co-Sign' />";
            tableSignControl += "</td></tr></table></div></td></tr>";
            tableSignControl += "<tr><td style='text-align: right;'></td><td>";
            tableSignControl += "<table><tr><td style='width: 1px'><input id='btnApproved' type='button' class='fbB01' value='";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "核準' /></td>" : "Approved' /></td>";
            tableSignControl += "<td><font>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ? "下階簽核者:" : "Next Signer:";
            tableSignControl += "</font>&nbsp;<select id='cboNextSigner'><option value=''>" + _settings.nextSignerFirstOptionText + "</option></select>";
            tableSignControl += "<span><input id='rbtnOriginalFlow' name='flow' type='radio' value='0' checked='checked' /><font>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "原始流程</font>" : "Original Flow</font>";
            tableSignControl += "<input id='rbtnBackToRejecter' name='flow' type='radio' value='1' /><font>";
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "送至退件者</font></td></span></tr>" : "Back To Rejecter</font></span></td></tr>";
            //2013-10-25 新增區塊  -Start
            //tableSignControl += "<tr><td style='width: 1px'><input id='btnApprovedNext' type='button' class='fbB01' value='";
            //tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
            //   "核準' /></td>" : "Approved' /></td>";
            //tableSignControl += "<td><select id='cboNextSigner'><option value=''>Please Select</option></select>";
            //tableSignControl += "<input id='rbtnOriginalFlowNext' name='flowNext' type='radio' value='0' checked='checked' /><font>";
            //tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
            //    "原始流程</font></td>" : "Original Flow</font></td>";
            //tableSignControl += "<td><input id='rbtnBackToRejecterNext' name='flowNext' type='radio' value='1' /><font>";
            //tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
            //    "送至退件者</font></td></tr>" : "Back To Rejecter</font></td></tr>";
            //2013-10-25 新增區塊 -End
            tableSignControl += "<tr><td><input id='btnReject' type='button' class='fbB01' value='"
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "退件至' /></td>" : "Reject To' /></td>";
            tableSignControl += "<td><span id='rejectTo'></span></td></tr>";
            tableSignControl += "<tr><td colspan='2'><input id='btnEscalate' type='button' class='fbB01' value='"
            tableSignControl += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                "往上呈核' /><font>至: " : "Escalate' /><font>To: ";
            tableSignControl += "<font color='purple'><span id='escalate'>N/A</span></font></font></td></tr></table>";
            tableSignControl += "</td></tr></table>";

            $(tableSignControl).appendTo($(me));
            //初始化control
            initialControl();

            setControlData();

            //隱藏或秀出頁面控制項
            showOrHideControl();

            //頁面Control event
            $('#chbAddCoSign').click(function () {
                if ($(this).prop('checked')) {
                    $(this).parents('tr:first').next('tr').hide();
                    $(this).parents('tr:first').prev('tr').hide();
                    $('#div_coSign').show()
                } else {
                    $(this).parents('tr:first').next('tr').show();
                    $(this).parents('tr:first').prev('tr').show();
                    $('#div_coSign').hide();
                }
            });
            $('#chbChangeSigner').click(function () {                
                if ($(this).prop("checked")) {
                    $('#div_change').show();
                    $(this).parents('tr:first').nextAll('tr').hide();
                } else {
                    $('#div_change').hide();
                    $(this).parents('tr:first').nextAll('tr').show();
                }
            });

            //核準按鈕
            $('#btnApproved').click(function () {
                if (!_settings.interrupted("accepted")) {
                    //取得走原流程或送至退件者
                    var flow = $('input[name=flow]:checked').val();
                    //$('input[name=flow]').each(function () {
                    //    if ($(this).attr('checked') == 'checked') {
                    //        flow = $(this).val();
                    //    }
                    //});
                    removeValidator();

                    var validatorResult = 0;
                    validatorResult += validatorEditor();

                    //如開啟自由選擇下階簽核者且此文件仍有下階簽核者則執行此驗証
                    if (_settings.nextSignerData.length > 0 &&
                        (jlinq.from(signList).equals('manageStatus', 'NO').any() || requiredChooseNextSigner)) {
                        validatorResult += validatorSelect();
                    }

                    //驗証必填欄位是否有填入
                    if (validatorResult == 0) {
                        $.blockUI({
                            message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                            onBlock: acceptFlow(flow, 'ACCEPTED')
                        }); //end of blockUI 
                    }
                }
            }); //end of $('#btnApproved')
         

            //往上呈核按鈕
            $('#btnEscalate').click(function () {
                if (!_settings.interrupted("escalate")) {
                    $.blockUI({
                        message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                        onBlock: acceptFlow(1, 'ESCALATE')
                    }); //end of blockUI         
                }
            });
            //退件按鈕
            $('#btnReject').click(function () {
                if (!_settings.interrupted("reject")) {
                    removeValidator();

                    var validatorResult = validatorEditor();
                    validatorResult += validatorRbtnList($('#rejectTo'));

                    //驗証必填欄位是否有填入
                    if (validatorResult == 0) {
                        $.blockUI({
                            message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                            onBlock: rejectFlow($('#rejectTo :checked').attr('signlevel'))
                        }); //end of blockUI        
                    }

                }
            }); //end of $('#btnReject')

            //會簽按鈕
            $('#btnCoSign').click(function () {

                var option = '';
                $('input[name=coSign]').each(function () {
                    if ($(this).prop('checked'))
                        option = $(this).val(); jlinq.from(signList).notStarts('manageStatus', 'YES').notStarts('manageStatus', 'WAIT').sort('signLevel').any()
                });

                if (!_settings.interrupted(option)) {
                  
                    removeValidator();

                    var validatorResult = validatorRbtnList($('#cosign'));

                    validatorResult += validatorFbAutoComplete($('#txtCoSign'));

                    if (validatorResult == 0) {
                        //如選擇往前往簽則執行如下，反之執行else
                        if (option == 'backward') {
                            $.blockUI({
                                message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                                onBlock: backWardCosign()
                            }); //end of blockUI                   
                        }
                        else if (validatorEditor() == 0) {
                            $.blockUI({
                                message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                                onBlock: forwardCosign()
                            }); //end of blockUI                        
                        }

                    }
                }
            });

            //更變簽核者按鈕
            $('#btnConfirm').click(function () {
                if (!_settings.interrupted("chagesigner")) {
                    removeValidator();

                    if (validatorFbAutoComplete($('#txtSigner')) == 0) {
                        $.blockUI({
                            message: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                                '<div>資料處理中請稍候....</div>' :
                                '<div>Data Processing....</div>',
                            onBlock: changeSigner()
                        }); //end of blockUI
                    }
                }
            });

        });

        //移除所有驗証控制項
        function removeValidator() {
            $('#div_memo').removeClass('input_text_error');
            $('#div_memo').prev('div').remove();

            $("#cboNextSigner").next("font").remove();

            $('#rejectTo').removeClass('input_text_error');
            $('#rejectTo').prev('div').remove();

            $('#cosign').removeClass('input_text_error');
            $('#cosign').prev('div').remove();

            $('#txtCoSign').prev('ul').prev('div').remove();
            $('#txtSigner').prev('ul').prev('div').remove();
        }
        //驗証Editor控制項
        function validatorEditor() {
            if ($.trim(setContent($('#div_memo').editorControl("get"))) == '') {
                $('#div_memo').addClass('input_text_error');
                $('#div_memo').before(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<div><font color=red>此欄位為必填!</font></div>' :
                    '<div><font color=red>This field must required!</font></div>');
                return 1;
            }
            return 0;
        }
        //過慮HTML標籤
        function setContent(str) {
            str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
            str = str.replace(/&nbsp;/g, "");//去除空格
            str.value = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,’\n’); //去除多餘空行
            return str;
        }
        //驗証RadioButtonList控制項
        function validatorRbtnList(obj) {
            if (obj.find(':checked').val() == undefined) {
                $(obj).before(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<div><font color=red>為必選欄位!</font></div>' :
                    '<div><font color=red>Required field!</font></div>');
                obj.addClass('input_text_error');
                return 1;
            }
            return 0;
        }
        //驗証Facebook AutoComplete
        function validatorFbAutoComplete(obj) {
            if (obj.tokenInput('get') == '') {
                $(obj).prev('ul').before(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<div><font color=red>此欄位為必填!</font></div>' :
                    '<div><font color=red>This field must required!</font></div>');
                return 1;
            }
            return 0;
        }
        //驗証Textbox內是否有值
        function validatorTextBox(obj) {
            if (obj.val() == '') {
                $(obj).before(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<div><font color=red>此欄位為必填!</font></div>' :
                    '<div><font color=red>This field must required!</font></div>');
                $(obj).addClass('input_text_error');
                return 1;
            }
            return 0;
        }
        //驗証Select是否有選值
        function validatorSelect() {
            $("#cboNextSigner").next('font').remove();
            var value = $("#cboNextSigner").find('option:selected').attr("value");
            if (value === "" || value == undefined) {//此欄位必填
                $("#cboNextSigner").after(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<font color="red">此欄位為必填!</font>' :
                    '<font color="red">This field must required!</font>');
                return 1;
            }
            return 0;
        }
        //初始化
        function initialControl() {            
            if (!_settings.enableChangeSigner) {
                $('#chbChangeSigner').next('font').remove();
                $('#chbChangeSigner').hide();
            }
            if (!_settings.enableCosign) {
                $('#chbAddCoSign').next('font').remove();
                $('#chbAddCoSign').hide();
            }
            if (!_settings.enableEscalate) {
                $('#btnEscalate').next('font').remove();
                $('#btnEscalate').hide();
            } else {
                $('input[name=flow]').each(function () { $(this).hide(); $(this).next('font').remove(); });
                $("#rejectTo").hide();
                $("#btnApproved").hide();
                $('#btnReject').hide();
            }
            if (_settings.nextSignerData.length <= 0) {
                $("#cboNextSigner").prev("font").remove();
                $("#cboNextSigner").next("font").remove();
                $("#cboNextSigner").hide();
            }
            //html編輯器Loading
            $('#div_memo').editorControl({
                url: _settings.ajaxUrl,
                editorTab: _settings.defaultLanguage.toLowerCase() == 'chinese' ? '編輯' : 'Editor',
                privewTab: _settings.defaultLanguage.toLowerCase() == 'chinese' ? '預覽' : 'Preview',
                initialContent: '',
                enableEditor: _settings.enableEditor,
                enableUpload: _settings.enableEditor,
                //selectTabIndex: 0,
                tabID: 'sign_editorTabs',
                tab1ID: 'sign_editor',
                tab2ID: 'sign_show',
                editorID: 'sign_editorMemo',
                dialogUploadID: 'sign_uploadManager',
                uploadID: 'sign_fileUpload',
                queueID: 'sign_fileQueue',
                uploadMsgID: 'sign_uploadMsg',
                btnUploadID: 'sign_btnUpload'
            });

            setTxtAutoComplete($('#txtSigner'));
            setTxtAutoComplete($('#txtCoSign'));

            $('#txtCustomerCCTo').tokenInput(_settings.ajaxUrl +'?key=getusermail', {
                queryParam: 'typeID',
                hintText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '請輸入姓名查詢' : 'Type in a search term',
                noResultsText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '無符合' : 'No results',
                searchingText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<img src="../../Resources/Images/spinner.gif" /> 查詢中...' :
                    '<img src="../../Resources/Images/spinner.gif" /> Searching...',
                animateDropdown: true,
                preventDuplicates: true,
                theme: 'facebook',
                propertyToSearch: 'display',
                tokenFormatter: function (item) {
                    //return "<li><p>" + item.userName + " <b style='color: red'>" + item.id + "</b></p></li>"
                    return _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        "<li><p>" + item.description + "</p></li>" : "<li><p>" + item.foreignDescription + "</p></li>"
                }
            });
           
            //如有特殊CC名單則將此列隱藏
            if (_settings.specialCCTo != '') {
                 $.ajax({
                    url: _settings.ajaxUrl,
                    data: { key: 'getspecialcc', specialCC: _settings.specialCCTo },
                    cache: false,
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        var chkSpecial = '';
                        var index = 0;
                        for (var item in json) {
                            if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                  var basObj = {
                                                id: json[item].userID,
                                                description: json[item].userName,
                                                foreignDescription: json[item].userForeignName,
                                                email:json[item].userEmail,
                                                display: json[item].userName + " (" + json[item].userID + ")"
                                               };

                                  $("#txtCustomerCCTo").tokenInput("add", basObj);
                            } else {
                                 var basObj = {
                                                id: json[item].userID,
                                                description: json[item].userName,
                                                foreignDescription: json[item].userForeignName,
                                                email: json[item].userEmail,
                                                display: json[item].userForeignName + " (" + json[item].userID + ")"
                                               };
                                 $("#txtCustomerCCTo").tokenInput("add", basObj);
                            }
                        }
                    },
                    error: function (xhr) { }
                }); //end of ajax
            } //end of specialCC if

            //如有BCC則執行底下ajax
            if (_settings.bcc != '') {
                 $.ajax({
                    url: _settings.ajaxUrl,
                    data: { key: 'getspecialcc', specialCC: _settings.bcc },
                    cache: false,
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        var chkSpecial = '';
                        var index = 0;
                        for (var item in json) {
                            if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                chkSpecial += '<input id=chbBCC_' + index + ' name=chbBCC type=checkbox disabled=disabled checked=checked value='
                                    + json[item].userID + ' title=' + json[item].userEmail + '>' + json[item].userName + '</input>';
                            } else {
                                chkSpecial += '<input id=chbBCC_' + index + ' name=chbBCC type=checkbox disabled=disabled checked=checked value='
                                    + json[item].userID + ' title=' + json[item].userEmail + '>' + json[item].userForeignName + '</input>';
                            }
                            index++;
                        }

                        $('#bcc').html(chkSpecial);
                    },
                    error: function (xhr) { }
                }); //end of ajax
            } //end of specialCC if
                     
            //取得簽核資訊
            getSignData();

            //如此階還有其它簽核者未簽完，預設不開啟增加會簽者的功能
            if (jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEnds('userID', _settings.userID).any()) {
                $('#chbAddCoSign').next('font').remove();
                $('#chbAddCoSign').hide();
            }
            

        } //end of initialPage function

        function setBasObj(obj, id, desc) {

                    if (id == null || id == "") return null;
                    if (desc == null || desc == "") return null;

                    var basObj = {
                        id: id,
                        description: desc,
                        foreignDescription: desc,
                        display: desc + " (" + id + ")"
                    };

                    $(obj).tokenInput("add", basObj);
                }
        //取得簽核資料
        function getSignData() {
            //取得簽核資訊
            if (_settings.jsonObj != null) {
                signList = _settings.jsonObj;            
            } else if (_settings.docNO != '' && _settings.systemID != '' && _settings.formID != '') {
                $.ajax({
                    url: _settings.ajaxUrl,
                    data: { key: 'getsignlist', docNO: _settings.docNO, systemID: _settings.systemID, formID: _settings.formID },
                    cache: false,
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        signList = json.signlist;                
                    },
                    error: function (xhr) { }
                });
            } else {
                $(thisControl).hide();          
            }
        }

        function reloadPage() {
            var href = window.location.href;
            window.location = href;
        }
        //設定下階與退件者控件資料
        function setControlData() {
            //取得現階簽核者
            var signUserData = jlinq.from(signList).starts('manageStatus', 'WAIT').select();

            //有現階簽核者且現階簽核者於登入的人一致則執行如下
            if (signUserData.length > 0) {
                
                //if (signUser[0].userID == _settings.userID) {
                if (jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).any()) {
                    var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals('userID', _settings.userID).first();
                    levelDesc = signUser.levelDesc;;
                    levelForeignDesc = signUser.levelForeignDesc;

                    //判斷是否有下階簽核者，且是否有同階簽核者，成立則執行如下
                    if (jlinq.from(signList).equals('manageStatus', 'NO').sort('signLevel').any()) {
                        //取得下階簽核者
                        var nextSignerLevel = jlinq.from(signList).equals('manageStatus', 'NO').sort('signLevel').first().signLevel;
                        var nextSignerData = jlinq.from(signList).equals('manageStatus', 'NO').andEquals('signLevel',nextSignerLevel).select();

                        var nextUserName = "";
                        for (var i in nextSignerData) {
                            if(_settings.defaultLanguage.toLowerCase() == 'chinese')
                                nextUserName += nextSignerData[i].userName + ',';
                            else
                                nextUserName += nextSignerData[i].userForeignName + ',';
                        }
                        nextUserName = nextUserName.substr(0, nextUserName.length - 1);
                        $('#escalate').html(nextUserName);
                    } else {
                        //如無下階簽核者將彺上呈核按鈕隱藏
                        $('#btnEscalate').next('font').remove();
                        $('#btnEscalate').hide();

                    } //end of if else 有現階簽核者且現階簽核者於登入的人一致則執行如下

                    //填入主管描述
                    if ("chinese" == _settings.defaultLanguage.toLowerCase())
                        $('#signLevel').html(levelDesc != '' ? levelDesc : signUser.signLevel);
                    else
                        $('#signLevel').html(levelForeignDesc != '' ? levelForeignDesc : signUser.signLevel);


                    $('#signer').html(_settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        '<font color="green">' + signUser.userName + '</font>' :
                        '<font color="green">' + signUser.userForeignName + '</font>');
                    setInterval("$('#signTimes').html(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'))", 1000);

                    //if (signUser.comment != null)
                        //$('#div_memo').setContent(decodeURIComponent(signUser.comment));

                    //$find("EditorMemo").set_html(signUser.comment);

                    //取得非簽核者以外所有人員
                    var ccToList = jlinq.from(signList).notEquals('manageStatus', 'WAIT').sort('signLevel').select();

                    var chbCCTo = '';
                    var flages = [];
                    for (var item in ccToList) {
                        if (flages[ccToList[item].userID]) continue;
                        flages[ccToList[item].userID] = true;
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                            chbCCTo += '<input id=chbCCTo_' + item + ' name=chbCCTo type=checkbox value=' + ccToList[item].userID + ' title=' + ccToList[item].userEmail
                                        + ' signTimes=' + ccToList[item].signTimes + '>' + ccToList[item].userName + '</input>';
                        } else {
                            chbCCTo += '<input id=chbCCTo_' + item + ' name=chbCCTo type=checkbox value=' + ccToList[item].userID + ' title=' + ccToList[item].userEmail
                                        + ' signTimes=' + ccToList[item].signTimes + '>' + ccToList[item].userForeignName + '</input>';
                        }
                    } //end of for

                    $('#ccTo').html(chbCCTo);

                    //如有簽核一次以上者，則預設為勾選
                    $('input[name=chbCCTo]').each(function () {
                        if ($(this).attr('signTimes') >= 1)
                            $(this).attr('checked', 'checked');
                    }); //end of each

                    //如有開啟自選下階簽核者功能
                    if (_settings.nextSignerData.length > 0) {
                        //判斷是否本階都簽完且有下階簽核者
                        var nextSigner = jlinq.from(signList).greater("signLevel",signUser.signLevel).any() && 
                            !jlinq.from(signList).equals('manageStatus','WAIT').andNotEquals('userID',_settings.userID).any() ?
                            jlinq.from(signList).greater('signLevel', signUser.signLevel).sort('signLevel').first() : null;

                        var level = nextSigner === null ?//判斷傳入的下階簽核者陣列需比本階大且本階都簽完,則把下階的階層取出。
                            jlinq.from(_settings.nextSignerData).greater(signUser.signLevel).any() &&
                            !jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEquals('userID', _settings.userID).any() ?
                            jlinq.from(_settings.nextSignerData).greater(signUser.signLevel).sort().first() : null :
                            jlinq.from(_settings.nextSignerData).greater(signUser.signLevel).less(nextSigner.signLevel).any() ?
                            jlinq.from(_settings.nextSignerData).greater(signUser.signLevel).less(nextSigner.signLevel).sort().first() :
                            null;
                        if (level != null)
                            setNextSignerData(signUser, level);
                        else {
                            $("#cboNextSigner").prev("font").remove();
                            $("#cboNextSigner").next("font").remove();
                            $("#cboNextSigner").hide();
                            _settings.nextSignerData = [];
                        }

                    }

                    //判斷是否為退件後需重送文件
                    if (!jlinq.from(signList).notType('rejectedTo', jlinq.type.nothing).andEquals('rejectedTo', signUser.signLevel.toString()).andEquals('manageStatus', 'NO').any()) {
                        //&& !jlinq.from(signList).equals('signLevel',parseInt(signUser.rejecter)).andEquals('manageStatus','NO').any()
                        $('input[name=flow]').each(function () { $(this).hide(); $(this).next('font').remove(); });
                    }
                    //如同簽核層級未簽完則隱藏送至退件者的選項
                    if (jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEquals('userID', _settings.userID).any()) {
                        $('input[name=flow]').each(function () { $(this).hide(); $(this).next('font').remove(); });
                    }
                    //隱藏送至退件者選項
                    if (!_settings.enableOptionFlow) {
                        $('input[name=flow]').each(function () { $(this).hide(); $(this).next('font').remove(); });
                    }

                    //取得該文件退件者之資料
                    var rejectList = jlinq.from(signList).less('signLevel', signUser.signLevel).sort('signLevel').select();

                    //如無退件者資訊，則執行以下程式反之執行else程式段
                    if (rejectList.length <= 0) {
                        $('#btnReject').hide();
                    } else {
                        var rbtnReject = '';

                        var i = 1;
                        var completedLevel = null;
                        for (var item in rejectList) {
                            if (completedLevel !== rejectList[item].signLevel) {
                                completedLevel = rejectList[item].signLevel;

                                if (jlinq.from(rejectList).equals("signLevel", rejectList[item].signLevel).select().length > 1) {
                                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                        rbtnReject += '<input id=rbtnReject_' + item + ' name=rbtnReject type=radio value=' + rejectList[item].signLevel +
                                        ' signlevel=' + rejectList[item].signLevel + ' >' + rejectList[item].levelDesc +
                                        '<font style="color:blue;">(第' + i.toString() + '階)</font></input>';
                                    } else {
                                        rbtnReject += '<input id=rbtnReject_' + item + ' name=rbtnReject type=radio value=' + rejectList[item].signLevel +
                                        ' signlevel=' + rejectList[item].signLevel + ' >' + rejectList[item].levelForeignDesc +
                                        '<font style="color:blue;">(Stage ' + i.toString() + ')</font></input>';
                                    }
                                } else {
                                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                        rbtnReject += '<input id=rbtnReject_' + item + ' name=rbtnReject type=radio value=' + rejectList[item].userID +
                                        ' signlevel=' + rejectList[item].signLevel + ' title=' + rejectList[item].userEmail + '>' + rejectList[item].userName +
                                        '<font style="color:blue;">(第' + i.toString() + '階)</font></input>';
                                    } else {
                                        rbtnReject += '<input id=rbtnReject_' + item + ' name=rbtnReject type=radio value=' + rejectList[item].userID +
                                        ' signlevel=' + rejectList[item].signLevel + ' title=' + rejectList[item].userEmail + '>' + rejectList[item].userForeignName +
                                        '<font style="color:blue;">(Stage ' + i.toString() + ')</font></input>';
                                    }
                                }
                                i++
                            }                                                      
                        } //end of for

                        //將可退件人員列表出來
                        $('#rejectTo').html(rbtnReject);
                    } //end of if else 如無退件者資訊，則執行以下程式反之執行else程式段

                    //判斷是否可以往前或往後會簽
                    var previousSigner = jlinq.from(rejectList).sort('-signLevel').select();
                    var nextSigner = jlinq.from(signList).equals('manageStatus', 'NO').sort('signLevel').select();

                    var backwardMessage = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        "<font color=silver>您已無法往前會簽</font>" : "<font color=silver>You can't Backward to Co-Signer</font>";
                    var foreardMessage = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                         "<font color=silver>您已無法往後會簽</font>" : "<font color=silver>You can't Forward to Co-Signer</font>";

                    //如無上一位簽核者
                    if (previousSigner.length <= 0) {
                        $('#rbtnBefore').next('font').remove();
                        $('#rbtnBefore').after(backwardMessage);
                        $('#rbtnBefore').attr('disabled', 'disabled');
                    } else {
                        //現階簽核者簽階層 - 上階簽核者階層
                        var result = signUser.signLevel - previousSigner[0].signLevel;
                        if (result == 1) {
                            $('#rbtnBefore').next('font').remove();
                            $('#rbtnBefore').after(backwardMessage);
                            $('#rbtnBefore').attr('disabled', 'disabled');
                        }
                    }
                    //如有下位簽核者則執行如下
                    if (nextSigner.length > 0) {
                        var result = nextSigner[0].signLevel - signUser.signLevel;
                        if (result == 1) {
                            $('#rbtnAfter').next('font').remove();
                            $('#rbtnAfter').after(foreardMessage);
                            $('#rbtnAfter').attr('disabled', 'disabled');
                        }
                    }
                    _settings.controlLoaded("normal", signUser);
                } else {
                    $(thisControl).hide();
                    if(jlinq.from(signList).equals('userID', _settings.userID).any()) {
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese')
                            jAlert('您已簽核完成!', '訊息');
                        else
                            jAlert('You have completed!', 'Message');
                        _settings.controlLoaded("completed", signUserData[0]);
                    } else {
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese')
                            jAlert('您不在簽核列表中', '訊息');
                        else
                            jAlert('You not in the list!', 'Message');
                        _settings.controlLoaded("notinlist", signUserData[0]);
                    }
                } //end of if else現階簽核者等於登入者                             
            } else {
                $(thisControl).hide();
                if (_settings.defaultLanguage.toLowerCase() == 'chinese')
                    jAlert('此文件已簽核完成!', '訊息');
                else
                    jAlert('This document has been completed', 'Message');
                _settings.controlLoaded("approved",null);
            } //end of if  有現階簽核者且現階簽核者於登入的人一致則執行如下
        } //end of function setControlData
        //設定下階簽核者資料(Option)
        function setNextSignerData(signUser,level) {
            $.ajax({
                url: _settings.ajaxUrl,
                data: { key: "getnextsignerdata", jsonStr: $.toJSON(signUser), defaultLanguage: _settings.defaultLanguage, level: level },
                cache: false,
                dataType: "json",
                success: function (json) {
                    if (json == null || json === "") {
                        $("#cboNextSigner").prev("font").remove();
                        $("#cboNextSigner").next("font").remove();
                        $("#cboNextSigner").hide();
                        _settings.nextSignerData = [];
                    }
                    else {
                        $("#cboNextSigner").show();
                        $("#cboNextSigner option").not("option:first").remove();
                        $(json).appendTo($("#cboNextSigner"));
                        //if ($("#cboNextSigner option").length == 2)
                            //$("#cboNextSigner option:last").prop("selected", true);
                    }
                },
                error: function (xhr) { alert(xhr.responseText); }
            });
        }

        //頁面autoComplete初始化
        function setTxtAutoComplete(obj) {

            obj.tokenInput(_settings.ajaxUrl + '?key=getuser', {
                queryParam: 'typeID',
                hintText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '請輸入文字進行查詢' : 'Type in a search term',
                noResultsText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '無符合' : 'No results',
                searchingText: _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    '<img src="../../Resources/Images/spinner.gif" /> 查詢中...' :
                    '<img src="../../Resources/Images/spinner.gif" /> Searching...',
                animateDropdown: true,
                preventDuplicates: true,
                //theme: 'facebook',
                tokenLimit: 1,
                propertyToSearch: 'display',
                tokenFormatter: function (item) {
                    //return "<li><p>" + item.userName + " <b style='color: red'>" + item.id + "</b></p></li>"
                    return _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        "<li><p>" + item.userName + " (" + item.userID + ")</p></li>" :
                        "<li><p>" + item.userForeignName + " (" + item.userID + ")</p></li>"
                }
            });
        } //end of setTxtAutoComplete

        //隱藏或秀出頁面控制項
        function showOrHideControl() {
            if ($('#chbAddCoSign').prop('checked')) {
                $('#chbAddCoSign').parents('tr:first').next('tr').hide();
                $('#chbAddCoSign').parents('tr:first').prev('tr').hide();
                $('#div_coSign').show()
            } else {
                $('#chbAddCoSign').parents('tr:first').next('tr').show();
                $('#chbAddCoSign').parents('tr:first').prev('tr').show();
                $('#div_coSign').hide();
            }

            if ($('#chbChangeSigner').prop('checked')) {
                $('#div_change').show();
                $('#chbChangeSigner').parents('tr:first').nextAll('tr').hide();
            } else {
                $('#div_change').hide();
                $('#chbChangeSigner').parents('tr:first').nextAll('tr').show();
            }
        } //end of function showOrHideCoSign

        //重建簽核陣列
        function rebuildSignList(signerFlow) {
           
            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).first() : null;

            if (signUser !== null && signerFlow !== undefined && signerFlow !== null) {

                //將欲加入的簽核列表新增屬性signTimes
                for (var i in signerFlow) {
                    signerFlow[i].signTimes = 0;
                    signerFlow[i].manageStatus = "NO";
                    signerFlow[i].rejectedTo = null;
                    signerFlow[i].comment = null;
                    signerFlow[i].CCTo = null;
                    signerFlow[i].notifiedDate = null;
                    signerFlow[i].signedDate = null;
                    signerFlow[i].signedResult = null;
                }

                var deleteItem = jlinq.from(signList).greater("signLevel", signUser.signLevel).select();
                //先刪除比目前簽核者還要大的所有階層
                for (var i in deleteItem) {
                    var sameUserList = jlinq.from(signerFlow).equals("userID", deleteItem[i].userID).andEquals("signLevel", deleteItem[i].signLevel).select();
                    for (var j in sameUserList) {
                        sameUserList[j].signTimes = deleteItem[i].signTimes;
                        sameUserList[j].manageStatus = deleteItem[i].manageStatus;
                        sameUserList[j].rejectedTo = deleteItem[i].rejectedTo;
                        sameUserList[j].comment = deleteItem[i].comment;
                        sameUserList[j].CCTo = deleteItem[i].CCTo;
                        sameUserList[j].notifiedDate = deleteItem[i].notifiedDate;
                        sameUserList[j].signedDate = deleteItem[i].signedDate;
                        sameUserList[j].signedResult = deleteItem[i].signedResult;
                    }
                    
                    removeItems(signList, deleteItem[i]);
                }
                //找出比目前簽核階層還要大的所有簽核者
                var rebuildFlow = jlinq.from(signerFlow).greater("signLevel", signUser.signLevel).select();

                for (var i in rebuildFlow) {
                    var newSigner = {
                        systemID: signUser.systemID,
                        formID: signUser.formID,
                        docNO: signUser.docNO,
                        version: signUser.version,
                        signTimes: rebuildFlow[i].signTimes,
                        signLevel: parseInt(rebuildFlow[i].signLevel, 10),
                        userID: rebuildFlow[i].userID,
                        userName: rebuildFlow[i].userName,
                        userForeignName: rebuildFlow[i].userForeignName,
                        userEmail: rebuildFlow[i].userEmail,
                        manageStatus: rebuildFlow[i].manageStatus,
                        rejectedTo: rebuildFlow[i].rejectedTo,
                        comment: rebuildFlow[i].comment,
                        CCTo: rebuildFlow[i].CCTo,
                        notifiedDate: rebuildFlow[i].notifiedDate,
                        signedDate: rebuildFlow[i].signedDate,
                        signedResult: rebuildFlow[i].signedResult
                    };

                    addItems(signList, newSigner);
                }
            }
        }
        //按下核準或是往上呈核時動作
        function acceptFlow(optionFlow, signResult) {

            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).first() : null;

            //重建簽核陣列
            rebuildSignList(_settings.rebuildSignList(signResult.toLowerCase(), signUser));

            //如選擇原流程則先執行如下
            if (optionFlow == 0 && !jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEquals("userID",_settings.userID).any()) {
                var orignFlowSignList = jlinq.from(signList).greater('signLevel', signUser.signLevel).select();                
                for (var item in orignFlowSignList) {
                    orignFlowSignList[item].manageStatus = 'NO';
                }
            } //end of if 選擇原流程

            var nextSigner = null;
            if (!jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEquals('userID', _settings.userID).any() &&
                jlinq.from(signList).equals('manageStatus', 'NO').sort('signLevel').any()) {
                var nextSignLevel = jlinq.from(signList).equals('manageStatus', 'NO').sort('signLevel').first().signLevel;
                nextSigner = jlinq.from(signList).equals('signLevel', nextSignLevel).select();
            }
            

            var chooseSigner = null;
            //如可挑選下階簽核者且可挑選下階的Select有出現，則執行如下(有進行過驗証所可直接取得Select的值)
            if (_settings.nextSignerData.length > 0 && nextSigner != null) {
                chooseSigner = {
                    systemID: signUser.systemID,
                    formID: signUser.formID,
                    docNO: signUser.docNO,
                    version: signUser.version,
                    signTimes: 0,
                    signLevel: parseInt($("#cboNextSigner option:selected").attr("signLevel"), 10),
                    userID: $("#cboNextSigner option:selected").attr("userID"),
                    userName: $("#cboNextSigner option:selected").attr("userName"),
                    userForeignName: $("#cboNextSigner option:selected").attr("userForeignName"),
                    userEmail: $("#cboNextSigner option:selected").attr("userEMail"),
                    manageStatus: 'WAIT',                   
                    notifiedDate: signUser.signedDate
                };
            //如可挑選下階簽核者且可挑選下階的Select有出現，則執行如下
            } else if (_settings.nextSignerData.length > 0 && nextSigner == null) {
                var value = $("#cboNextSigner option:selected").val();
                //判斷是否有選取下階簽核者，如沒有選擇則略過此段
                if (value != "" && value != undefined) {
                    chooseSigner = {
                        systemID: signUser.systemID,
                        formID: signUser.formID,
                        docNO: signUser.docNO,
                        version: signUser.version,
                        signTimes: 0,
                        signLevel: parseInt($("#cboNextSigner option:selected").attr("signLevel"), 10),
                        userID: $("#cboNextSigner option:selected").attr("userID"),
                        userName: $("#cboNextSigner option:selected").attr("userName"),
                        userForeignName: $("#cboNextSigner option:selected").attr("userForeignName"),
                        userEmail: $("#cboNextSigner option:selected").attr("userEMail"),
                        manageStatus: 'WAIT',
                        notifiedDate: signUser.signedDate
                    };
                }//end of if(value 
            }//end of else if
         
            //如果有選擇下階簽核者則執行以下
            if (chooseSigner != null) {
                if (jlinq.from(signList).equals("signLevel", chooseSigner.signLevel).any()) {

                    if (!jlinq.from(signList).equals("signLevel", chooseSigner.signLevel).andEquals("userID", chooseSigner.userID).any()) {
                        if (nextSigner != null) {
                            nextSigner = [];
                            nextSigner[0].signTimes = 0;
                            nextSigner[0].userID = chooseSigner.userID;
                            nextSigner[0].userName = chooseSigner.userName;
                            nextSigner[0].userForeignName = chooseSigner.userForeignName;
                            nextSigner[0].userEmail = chooseSigner.userEmail;
                        }
                    }                    
                } else {
                    nextSigner = [];
                    nextSigner[0] = chooseSigner;
                    addItems(signList, chooseSigner);
                }
            } 
            

            //更改先階簽核者狀態
            signUser.signTimes += 1;
            signUser.manageStatus = 'YES';
            signUser.signedDate = getDate();
            signUser.signedResult = signResult;
            //signUser.comment = Url.encode($find('EditorMemo').get_html());
            signUser.comment = $("#div_memo").editorControl("getEncode"); //Url.encode($('#div_memo').getContent());
            signUser.rejectedTo = null;

            var ccTo = '';
            var ccToId = '';

            var bccTo = '';
            var bccToId = '';            
            //BCC名單
            $.each($('input[name=chbBCC]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    bccToId += $(item).val() + ',';
                    bccTo += $(item).attr('title') + ',';
                }
            });
            
            //原簽核流程內，欲cc人員
            $.each($('input[name=chbCCTo]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    ccToId += $(item).val() + ',';
                    ccTo += $(item).attr('title') + ',';
                }
            });
            //填入自選CCTo名單
            var obj = $('#txtCustomerCCTo').tokenInput('get');

            if (obj != '') {
                for (var item in obj) {
                    ccTo += $.trim(obj[item].email) + ',';
                    ccToId += $.trim(obj[item].id) + ',';
                }
            }

            signUser.CCTo = ccToId != '' ? ccToId : null;

            //欲更新主表之文件狀態變數
            var docStatus = '';

            //下階簽核者名字
            var nextSignerName = "";
            var nextSignerEmail = "";

            //判斷下階簽核者是否存在
            if (nextSigner != null) {
                docStatus = nextSigner[0].signLevel + '_VRY';

                for(var i in nextSigner){
                    nextSigner[i].manageStatus = 'WAIT';
                    nextSigner[i].notifiedDate = signUser.signedDate;
                    nextSignerName += _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        nextSigner[i].userName + ',' : nextSigner[i].userForeignName + ',';
                    nextSignerEmail += nextSigner[i].userEmail + ',';
                }
                nextSignerName = nextSignerName.substr(0, nextSignerName.length - 1);
                nextSignerEmail = nextSignerEmail.substr(0, nextSignerEmail.length - 1);
                //如為往上呈核執行如下
                if (signResult == 'ESCALATE') {
                    var comment = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                        "往上呈核至" + nextSignerName : "Escalate to " + nextSignerName;

                    signUser.comment = signUser.comment == '' ? comment : signUser.comment;
                }

            } else if (jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEnds('userID', _settings.userID).any()) {
                //如目前仍有簽核者Pending，則不變更文件狀態
                docStatus = signUser.signLevel + '_VRY';
            } else {
                //如無下階，則將主表docStatus欄位更新為(APPROVED)
                docStatus = 'APPROVED';
            }
            
            var jsonObj = _settings.callback("accepted");

            //ajax集合至Server端
            $.ajax({
                url: _settings.ajaxUrl,
                data: {
                    key: 'acceptflow',
                    jsonStr: $.toJSON(signList),
                    formJson: jsonObj == undefined ? '' : $.toJSON(jsonObj),
                    userID: _settings.userID,
                    docStatus: docStatus,
                    ccTo: ccTo,
                    bccTo: bccTo,
                    url: _settings.url,
                    approvedUrl: _settings.approvedUrl,
                    formID: _settings.formID,
                    isSend: _settings.isSend,
                    addSigner: chooseSigner != null
                },
                type: 'POST',
                cache: false,
                success: function (result) {
                    if (result == 'OK') {
                        $.unblockUI();
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                            if (nextSigner != null) {
                                jAlert('下階簽核者:' + nextSignerName + '(' + nextSignerEmail + ')', '訊息', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else if (jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEnds('userID', _settings.userID).any()) {
                                jAlert('您已簽核完畢!', '訊息', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else {
                                jAlert('此份文件已核準!', '訊息', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } //end of if else (nextSigner)
                        } else {
                            if (nextSigner != null) {
                                jAlert('Next Signer:' + nextSignerName + '(' + nextSignerEmail + ')', 'Message', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else if (jlinq.from(signList).equals('manageStatus', 'WAIT').andNotEnds('userID', _settings.userID).any()) {
                                jAlert('You have completed signoff!', 'Message', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else {
                                jAlert('This document have approved!', 'Message', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } //end of if else (nextSigner)

                        } //end of if else defaultLanguage
                    } //end of if(result == OK)
                },
                error: function (xhr) {
                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                        jAlert('作業失敗!', '錯誤',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    } else {
                        jAlert('Operation failed!', 'Error',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    }
                    
                    $.unblockUI();
                }
            }); //end of ajax

        } //end of  function acceptFlow
        //退件流程
        function rejectFlow(rejectToSignLevel) {
            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).first() : null;
            //取得欲退件給何主管
            var rejectTo = jlinq.from(signList).greaterEquals('signLevel', rejectToSignLevel).lessEquals('signLevel', rejectToSignLevel).any() ?
                    jlinq.from(signList).greaterEquals('signLevel', rejectToSignLevel).lessEquals('signLevel', rejectToSignLevel).select() : null;


            //如選擇欲退件至開單者先執行如下
            if (rejectTo[0].signLevel == 0) {
                var version = signUser.version + 1;
                for (var item in signList) {
                    signList[item].version = version;
                }
            } //end of if 選擇原流程

            //如目前簽核者同階層仍有其它簽核主管，則將狀態都改為NO
            var currentLevelUsers = jlinq.from(signList).equals("signLevel", signUser.signLevel).andNotEquals("userID", _settings.userID).select();
            for (var i in currentLevelUsers) {
                currentLevelUsers[i].manageStatus = 'NO';
            }

            //更改先階簽核者狀態
            signUser.signTimes += 1;
            signUser.manageStatus = 'NO';
            signUser.signedDate = getDate();
            signUser.signedResult = 'REJECTED';
            signUser.comment = $("#div_memo").editorControl("getEncode");//Url.encode($('#div_memo').getContent());
            signUser.rejectedTo = rejectTo[0].signLevel;

            var ccTo = '';
            var ccToId = '';

            var bccTo = '';
            var bccToId = '';

            //BCC名單
            $.each($('input[name=chbBCC]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    bccToId += $(item).val() + ',';
                    bccTo += $(item).attr('title') + ',';
                }
            });

            //原簽核流程內，欲cc人員
            $.each($('input[name=chbCCTo]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    ccToId += $(item).val() + ',';
                    ccTo += $(item).attr('title') + ',';
                }
            });
           

            //填入自選CCTo名單
            var obj = $('#txtCustomerCCTo').tokenInput('get');

            if (obj != '') {
                for (var item in obj) {
                    ccTo += $.trim(obj[item].email) + ',';
                    ccToId += $.trim(obj[item].id) + ',';
                }
            }

            signUser.CCTo = ccToId != '' ? ccToId : null;

            //更改欲退件者資訊
            for (var i in rejectTo) {
                rejectTo[i].manageStatus = 'WAIT';
                rejectTo[i].notifiedDate = signUser.signedDate;
            }

            //欲更新主表之文件狀態變數
            var docStatus = '';

            docStatus = signUser.signLevel + '_RJD';
            
            var jsonObj = _settings.callback("reject");
            //ajax集合至Server端
            $.ajax({
                url: _settings.ajaxUrl,
                data: {
                    key: 'rejectflow',
                    jsonStr: $.toJSON(signList),
                    formJson: jsonObj == undefined ? '' : $.toJSON(jsonObj),
                    userID: _settings.userID,
                    docStatus: docStatus,
                    ccTo: ccTo,
                    bccTo:bccTo,
                    url: _settings.url,
                    formID: _settings.formID,
                    isSend: _settings.isSend
                },
                type: 'POST',
                cache: false,
                success: function (result) {
                    if (result == 'OK') {
                        $.unblockUI();
                        if (rejectTo.length === 1) {
                            if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                jAlert('退件至:' + rejectTo[0].userName + '(' + rejectTo[0].userEmail + ')', '訊息', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else {
                                jAlert('Reject To:' + rejectTo[0].userForeignName + '(' + rejectTo[0].userEmail + ')', 'Message', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } //end of if else defaultLanguage
                        } else {
                            if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                                jAlert('退件至: ' + rejectTo[0].levelDesc, '訊息', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } else {
                                jAlert('Reject To:' + rejectTo[0].levelForeignDesc, 'Message', function (result) {
                                    $(thisControl).hide();
                                    _settings.finshCallBack();
                                });
                            } //end of if else defaultLanguage
                        }
                    } //end of if(OK)
                },
                error: function (xhr) {
                    //console.log(xhr.responseText); 
                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                        jAlert('作業失敗!', '錯誤',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    } else {
                         jAlert('Operation failed!', 'Error',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    }                    
                    $.unblockUI();
                }
            }); //end of ajax

        } //end of function rejectFlow

        //往後會簽 (例: 原來為 1000 => 2000 =>3000 2000後面插入一階變為 1000 => 2000 => 2500 =>3000)
        function forwardCosign() {
            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').first() : null;


            var nextLevelSigner = jlinq.from(signList).greater('signLevel', signUser.signLevel).any() ?
                jlinq.from(signList).greater('signLevel', signUser.signLevel).sort('signLevel').first() : null;


            //更改先階簽核者狀態
            signUser.signTimes += 1;
            signUser.manageStatus = 'YES';
            signUser.signedDate = getDate();
            signUser.signedResult = 'ACCEPTED';
            signUser.comment = $("#div_memo").editorControl("getEncode"); //Url.encode($('#div_memo').getContent());

            var ccTo = '';
            var ccToId = '';

            var bccTo = '';
            var bccToId = '';

            //BCC名單
            $.each($('input[name=chbBCC]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    bccToId += $(item).val() + ',';
                    bccTo += $(item).attr('title') + ',';
                }
            });

            //原簽核流程內，欲cc人員
            $.each($('input[name=chbCCTo]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    ccToId += $(item).val() + ',';
                    ccTo += $(item).attr('title') + ',';
                }
            });          

            //填入自選CCTo名單
            var obj = $('#txtCustomerCCTo').tokenInput('get');

            if (obj != '') {
                for (var item in obj) {
                    ccTo += $.trim(obj[item].email) + ',';
                    ccToId += $.trim(obj[item].id) + ',';
                }
            }

            signUser.CCTo = ccToId != '' ? ccToId : null;

            var coSignLevel;
            //如無下階簽核者
            if (nextLevelSigner == null)
                coSignLevel = signUser.signLevel + 100;
            else
                coSignLevel = parseInt(signUser.signLevel + ((nextLevelSigner.signLevel - signUser.signLevel) / 2));

            var user = jlinq.from($('#txtCoSign').tokenInput('get')).first();

            var coSigner = {
                systemID: signUser.systemID,
                formID: signUser.formID,
                docNO: signUser.docNO,
                version: signUser.version,
                signTimes: 0,
                signLevel: coSignLevel,
                userID: user.userID,
                userName: user.userName,
                userForeignName: user.userForeignName,
                userEmail: user.userEmail,
                manageStatus: 'WAIT',
                rejecter: jlinq.from(signList).equals('rejectedTo', signUser.signLevel.toString()).any() ?
                    jlinq.from(signList).equals('rejectedTo', signUser.signLevel.toString()).sort('signLevel').first().signLevel : null,
                notifiedDate: signUser.signedDate
            };

            //欲更新主表之文件狀態變數
            var docStatus = coSignLevel.toString() + '_VRY';
            
            addItems(signList, coSigner);

            var jsonObj = _settings.callback("forward");

            //ajax集合至Server端
            $.ajax({
                url: _settings.ajaxUrl,
                data: {
                    key: 'acceptflow',
                    coSign: 'forward',
                    jsonStr: $.toJSON(signList),
                    formJson: jsonObj == undefined ? '' : $.toJSON(jsonObj),
                    userID: _settings.userID,
                    docStatus: docStatus,
                    ccTo: ccTo,
                    bccTo: bccTo,
                    url: _settings.url,
                    formID: _settings.formID,
                    isSend: _settings.isSend
                },
                type: 'POST',
                cache: false,
                success: function (result) {
                    if (result == 'OK') {
                        $.unblockUI();
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                            jAlert('下階簽核者:' + coSigner.userName + '(' + coSigner.userEmail + ')', '訊息', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } else {
                            jAlert('Next Signer:' + coSigner.userForeignName + '(' + coSigner.userEmail + ')', 'Message', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } //end of if else defaultLanguage
                    }
                },
                error: function (xhr) {
                    //console.log(xhr.responseText); 
                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                        jAlert('作業失敗!', '錯誤',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    } else {
                        jAlert('Operation failed!', 'Error',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    }
                    $.unblockUI();
                }
            }); //end of ajax
        }

        //往前會簽方法 (例: 原來為 1000 => 2000 中間插入一階變為 1000 => 1500 => 2000)
        function backWardCosign() {
            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').first() : null;


            var prevLevelSigner = jlinq.from(signList).less('signLevel', signUser.signLevel).any() ?
                jlinq.from(signList).less('signLevel', signUser.signLevel).sort('-signLevel').first() : null;

            var user = jlinq.from($('#txtCoSign').tokenInput('get')).first();

            //更改先階簽核者狀態
            signUser.signTimes += 1;
            signUser.manageStatus = 'NO';
            signUser.rejectedTo = null;
            signUser.signedDate = getDate();
            signUser.signedResult = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                '簽核前會簽至' + user.userName :
                'Before signed,Send To :' + user.userForeignName;

            signUser.comment = $("#div_memo").editorControl("getEncode"); //Url.encode($('#div_memo').getContent());

            var ccTo = '';
            var ccToId = '';

            var bccTo = '';
            var bccToId = '';

            //BCC名單
            $.each($('input[name=chbBCC]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    bccToId += $(item).val() + ',';
                    bccTo += $(item).attr('title') + ',';
                }
            });

            //原簽核流程內，欲cc人員
            $.each($('input[name=chbCCTo]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    ccToId += $(item).val() + ',';
                    ccTo += $(item).attr('title') + ',';
                }
            });

            //填入自選CCTo名單
            var obj = $('#txtCustomerCCTo').tokenInput('get');

            if (obj != '') {
                for (var item in obj) {
                    ccTo += $.trim(obj[item].email) + ',';
                    ccToId += $.trim(obj[item].id) + ',';
                }
            }

            signUser.CCTo = ccToId != '' ? ccToId : null;

            var coSignLevel = parseInt(prevLevelSigner.signLevel + ((signUser.signLevel - prevLevelSigner.signLevel) / 2));

            var coSigner = {
                systemID: signUser.systemID,
                formID: signUser.formID,
                docNO: signUser.docNO,
                version: signUser.version,
                signTimes: 0,
                signLevel: coSignLevel,
                userID: user.userID,
                userName: user.userName,
                userForeignName: user.userForeignName,
                userEmail: user.userEmail,
                manageStatus: 'WAIT',
                notifiedDate: signUser.signedDate
            };

            //欲更新主表之文件狀態變數
            var docStatus = coSignLevel.toString() + '_VRY';

            addItems(signList, coSigner);
            
            var jsonObj = _settings.callback("backward");

            //ajax集合至Server端
            $.ajax({
                url: _settings.ajaxUrl,
                data: {
                    key: 'acceptflow',
                    coSign: 'backward',
                    jsonStr: $.toJSON(signList),
                    formJson: jsonObj == undefined ? '' : $.toJSON(jsonObj),
                    userID: _settings.userID,
                    docStatus: docStatus,
                    ccTo: ccTo,
                    bccTo: bccTo,
                    url: _settings.url,
                    formID: _settings.formID,
                    isSend: _settings.isSend
                },
                type: 'POST',
                cache: false,
                success: function (result) {
                    if (result == 'OK') {
                        $.unblockUI();
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                            jAlert('退件至:' + coSigner.userName + '(' + coSigner.userEmail + ')', '訊息', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } else {
                            jAlert('Reject To:' + coSigner.userForeignName + '(' + coSigner.userEmail + ')', 'Message', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } //end of if else defaultLanguage
                    }
                },
                error: function (xhr) {
                    //console.log(xhr.responseText); 
                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                        jAlert('作業失敗!', '錯誤',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    } else {
                        jAlert('Operation failed!', 'Error',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    }
                    $.unblockUI();
                }
            }); //end of ajax
        }
        //更改簽核者
        function changeSigner() {
            //取得現階簽核者
            var signUser = jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID",_settings.userID).any() ?
                    jlinq.from(signList).equals('manageStatus', 'WAIT').andEquals("userID", _settings.userID).first() : null;

            var user = jlinq.from($('#txtSigner').tokenInput('get')).first();

            if (signUser != null) {
                var originalUserID = signUser.userID;
                var originalUserName = signUser.userName;
                var originalUserForeignName = signUser.userForeignName;
                signUser.signTimes = 0;
                signUser.userID = user.userID;
                signUser.userName = user.userName;
                signUser.userForeignName = user.userForeignName;
                signUser.userEmail = user.userEmail;
                signUser.signedDate = getDate();
                signUser.comment = null;
                signUser.signedResult = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                    "更改簽核者:" + originalUserName + ' 至: ' + user.userName :
                    "Change Signer:" + originalUserForeignName + ' to: ' + user.userForeignName;
                //signUser.signedResult = originalUserID + ' Change Sign to:' + user.userID;
            }

            var status = _settings.defaultLanguage.toLowerCase() == 'chinese' ?
                '更改簽核者至: ' + signUser.userName : " Change Signer To: " + signUser.userForeignName;

            var ccTo = '';
            var ccToId = '';

            var bccTo = '';
            var bccToId = '';

            //BCC名單
            $.each($('input[name=chbBCC]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    bccToId += $(item).val() + ',';
                    bccTo += $(item).attr('title') + ',';
                }
            });

            //原簽核流程內，欲cc人員
            $.each($('input[name=chbCCTo]:checked'), function (index, item) {
                if ($(item).attr("title") !== "undefined" && $(item).attr("title") != "null" && $(this).attr("title") != "") {
                    ccToId += $(item).val() + ',';
                    ccTo += $(item).attr('title') + ',';
                }
            });           

            //填入自選CCTo名單
            var obj = $('#txtCustomerCCTo').tokenInput('get');

            if (obj != '') {
                for (var item in obj) {
                    ccTo += $.trim(obj[item].email) + ',';
                    ccToId += $.trim(obj[item].id) + ',';
                }
            }
            
            var jsonObj = _settings.callback("chagesigner");
            //ajax集合至Server端
            $.ajax({
                url: _settings.ajaxUrl,
                data: {
                    key: 'changesigner',
                    jsonStr: $.toJSON(signList),
                    formJson: jsonObj == undefined ? '' : $.toJSON(jsonObj),
                    userID: _settings.userID,
                    docStatus: status,
                    ccTo: ccTo,
                    bccTo: bccTo,
                    url: _settings.url,
                    formID: _settings.formID,
                    isSend: _settings.isSend
                },
                type: 'POST',
                cache: false,
                success: function (result) {
                    if (result == 'OK') {
                        $.unblockUI();
                        if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                            jAlert(status, '訊息', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } else {
                            jAlert(status, 'Message', function (result) {
                                $(thisControl).hide();
                                _settings.finshCallBack();
                            });
                        } //end of if else defaultLanguage
                    }
                },
                error: function (xhr) {
                    //console.log(xhr.responseText); 
                    $.unblockUI();
                    if (_settings.defaultLanguage.toLowerCase() == 'chinese') {
                        jAlert('作業失敗!', '錯誤',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    } else {
                        jAlert('Operation failed!', 'Error',function(confirm) {
                            if(confirm){
                                reloadPage();
                            }
                        });
                    }
                }
            }); //end of ajax
        }

        //移除陣列 
        function removeItems(ary, items) {
            var j = 0;
            while (j < ary.length) {
                if (ary[j].signLevel == items.signLevel) {
                    ary.splice(j, 1);
                } else {
                    j++;
                }
            }

        }

        //加入陣列 
        function addItems(ary, items) { ary.push(items); }

        function getDate() {
            return $.ajax({
                url: _settings.ajaxUrl,
                data: { key: "getdate" },
                cache: false,
                async: false
            }).responseText;
        }
    }; //end of signControl

})(jQuery);







