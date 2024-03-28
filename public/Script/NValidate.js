/*
*NValidate Plugin
*version 1.0
*Cory Hugh,FIT IT
*06 Aug 2015
*自訂驗證
1.在各元件中加入識別屬性加以驗證
2.指定存在哪個Table中(避免全域驗證，互相影響)

目前驗證元件:
input 
textarea
select
tokenInput
chosen
autocomplete
checkbox

Usage:
文字:         <input type="text" id="txt1" subtype="txt" valid="y" allowEmpty="false" validType="text" maxlength="10"  />
日期:         <input type="text" id="dpdateNeeded" class="input_date"  style="width: 80px;" valid="y" allowEmpty="false" validType="date"  />
正整數:       <input type="text" id="txt3" subtype="txt" valid="y" allowEmpty="false" validType="positInt" /></td>
整數:         <input type="text" id="txt4" subtype="txt" valid="y" allowEmpty="false" validType="int" /></td>
正浮點數:     <input type="text" id="txt5" subtype="txt" valid="y" allowEmpty="false" validType="positFloat" /></td>
浮點數:       <input type="text" id="txt6" subtype="txt" valid="y" allowEmpty="false" validType="float" /></td>
textarea:    <textarea valid="y" maxlength="10"></textarea></td>
select:      <select id="cboBU" class="input_text" valid="y"/>
tokenInput:  <input type="text" id="txtcustomerID" subtype="token" valid="y"/></td>
chosen:      <select id="cboauthorityClassCode"  multiple="multiple" subtype="chosen" valid="y" />
autocomplete:<input type="text" id="txtuserID" subtype="autocomp" valid="y"/></td>
checkbox:    <div id="divFC"  subtype="checkbox" valid="y"></div>

 */
//載入jquery.poshytip.js
document.write("<script src='\/Script\/jquery.poshytip.js'><\/script>");

function validate(tableId) {
    var valiResult = 0;
    $('div.tip-yellow').remove();
    //console.log(tableId);

    //無tableId預設全域驗證
    if (tableId !== "" && tableId !== undefined) {
        tableId = "#" + tableId + ' ';
    } else {
        tableId = "";
    }
    //input
    $('' + tableId + 'input[valid="y"][subtype!="token"][subtype!="autocomp"]').each(function () {
        //不能為空
        if ($(this).attr('allowEmpty') === "false") {
            if ($(this).val() === "") {
                validateFail(this, GetResource('Resource', 'requiredField'));
                valiResult++;
            } else {
                valiResult += validateType(this)
            }
        } else {//為空，驗證格式
            if ($(this).val() !== "") {
                valiResult += validateType(this)
            }
        }
    });
    //textarea 
    $('' + tableId + 'textarea[valid="y"]').each(function () {
        //有驗證就是必填
        if ($(this).val() === "") {
            validateFail(this, GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //select 
    $('' + tableId + 'select[valid="y"][subtype!="chosen"]').each(function () {
        //有驗證就是必選
        if ($(this).val() === "") {
            validateFail(this, GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //multiple select 
    $('' + tableId + 'select[valid="y"][multiple="multiple"][subtype!="chosen"]').each(function () {
        //有驗證就是必選
        if ($(this).find("option:selected").length <= 0) {
            validateFail($(this).next(), GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //tokenInput
    $('' + tableId + 'input[valid="y"][subtype="token"]').each(function () {
        //有驗證就是必填
        if ($(this).val() === "") {
            validateFail($(this).parent(), GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //chosen 
    $('' + tableId + 'select[valid="y"][subtype="chosen"]').each(function () {
        //有驗證就是必選
        if ($(this).val() === null) {
            validateFail($("#" + $(this).attr('id') + "_chzn"), GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //autocomplete
    $('' + tableId + 'input[valid="y"][subtype="autocomp"]').each(function () {
        //有驗證就是必填
        if (getAutocompVal($(this).attr("id")) === "") {
            validateFail(this, GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //checkbox
    $('' + tableId + 'div[valid="y"][subtype="checkbox"]').each(function () {
        //有驗證就是必填
        if ($('input:checkbox[name=' + $('#' + $(this).attr('id') + ' :input').attr('name') + ']:checked').length === 0) {
            validateFail(this, GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //editorControl
    $('' + tableId + 'div[valid="y"][subtype="editor"]').each(function () {
        //console.log($(this).find("textarea").wysiwyg("getContent"));
        //有驗證就是必填
        if ($(this).find("textarea").wysiwyg("getContent") === "" || $(this).find("textarea").wysiwyg("getContent") === "<br>") {
            validateFail(this, GetResource('Resource', 'requiredField'));
            valiResult++;
        }
    });
    //console.log(valiResult);
    return valiResult;
}
function validateType(elem) {
    var valiResult = 0;
    switch ($(elem).attr('validType')) {
        //日期
        case 'date':
            var patern1 = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
            var patern2 = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
            if (!patern1.exec($(elem).val()) && !patern2.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'requiredDate'));
                valiResult++;
            }
            break;
            //正整數
        case 'positInt':
            var patern1 = /^\+?[1-9][0-9]*$/;
            if ($(elem).val() !== "") {
                if (!patern1.exec($(elem).val())) {
                    validateFail(elem, GetResource('Resource', 'requiredPositiveInteger'));
                    valiResult++;
                }
            }
            break;
            //整數
        case 'int':
            var patern1 = /^-?\d+$/;
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'requiredInteger'));
                valiResult++;
            }
            break;
            //正浮點數
        case 'positFloat':
            var patern1 = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'requiredPositiveNumber'));
                valiResult++;
            }
            break;
            //浮點數
        case 'float':
            var patern1 = /^(-?\d+)(\.\d+)?$/;
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'requiredNumber'));
                valiResult++;
            }
            break;
            //須8位英數以上混合
        case 'is8EnAndInt':
            var patern1 = /^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/;            
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'required8EnAndInt'));
                valiResult++;
            }
            break;
            //需Mail格式
        case 'mail':
            var patern1 = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'requiredMail'));
                valiResult++;
            }
            break;
            //  
        case 'LetterOrInt':
            var patern1 = /^.[A-Za-z0-9]+$/;
            if (!patern1.exec($(elem).val())) {
                validateFail(elem, GetResource('Resource', 'onlyLetterOrInt'));
                valiResult++;
            }
            break;
            //文字
        default:
            //console.log('text');
            //validateFail(elem, GetResource('Resource', 'requiredField'));
            //valiResult++;
            break;
    }
    if (valiResult === 0) {
        if ($(elem).data('poshytip')) // See if it is initialized 
        {
            $(elem).poshytip('hide');
        }
    }
    return valiResult;
}
function validateFail(elem, errtext) {
    //console.log("has erro");
    //console.log($(elem));
    //console.log(errtext);
    //if (!$(elem).data('poshytip')) // See if it is initialized 
    //{
        $(elem).poshytip({
            showOn: 'none',
            content: errtext,
            //className: 'tip-FB',
            alignTo: 'target',
            alignX: 'right',
            alignY: 'center',
            offsetX: 5
        });
        $(elem).poshytip('show');
    //} else {
        
    //    $(elem).poshytip({
    //        showOn: 'none',
    //        content: errtext,
    //        className: 'tip-FB',
    //        alignTo: 'target',
    //        alignX: 'right',
    //        alignY: 'center',
    //        offsetX: 5
    //    });
    //    $(elem).poshytip('show');
    //}
    $(elem).on('click', function () {
        if ($(this).data('poshytip')) // See if it is initialized 
        {
            $(this).poshytip('hide');
			$(this).unbind('click');
        }
    });
    $(elem).on('keyup', function () {
        if ($(this).data('poshytip')) // See if it is initialized 
        {
            $(this).poshytip('hide');
			$(this).unbind('keyup');
        }
    });
}
