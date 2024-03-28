//jQuery擴充方法(用來驗証input type=text),在有使用input.hint時使用,此方法暫時放在此頁使用不加入擴充類別中
jQuery.prototype.validatorTextBox = function () {
    jQuery(this).css('border', '');
    jQuery(this).next('font').remove();

    if (jQuery(this).val() == null) {
        jQuery(this).css('border', 'solid 1px red');
        jQuery(this).after('<font color="red">&nbsp;'+ GetResource('Resource', 'requiredField') +'</font');
        return 1;
    }
    return 0;
}; //end of validatorTextbox

var validator = {
    validatorText: function (allowEmpty, maxLen) {
        $(this).next('font').remove();

        if (!allowEmpty && $(this).val() === '') {//此欄位必填
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        } else if ($(this).val().length > maxLen) {//文字個數不可超過 
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'maxLenMustLessThan') + maxLen + '</font>');
            return 1;
        }
        return 0;
    },
    // jquery autocomplete
    validatorAutoComp: function (allowEmpty, maxLen) {
        $(this).next().next('font').remove();

        if (!allowEmpty && getAutocompVal($(this).attr("id")) === '') {//此欄位必填
            $(this).next().after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        } else if (getAutocompVal($(this).attr("id")).length > maxLen) {//文字個數不可超過 
            $(this).next().after('<font color="red">&nbsp;' + GetResource('Resource', 'maxLenMustLessThan') + maxLen + '</font>');
            return 1;
        }
        return 0;
    },
    validatorChosen: function (allowEmpty) {
        var id = $(this).attr("id");
        $("#"+id+"_chzn").next('font').remove();
        if (!allowEmpty && $(this).val() === null) {//此欄位必填
            $("#" + id + "_chzn").after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        } 
        return 0;
    },
    validatorSelect: function () {
        $(this).next('font').remove();
        var value = $(this).find('option:selected').attr("value");
        if (value === "" || value == undefined) {//此欄位必填
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    validatorRadio: function () {
       
        if ($(this).length > 1)
            me = this[0];
        else
            me = this;

        $(me).prev("font").remove();
        var value = 0;

        $(this).each(function () {
            if ($(this).prop("checked"))
                value++;
        });

        if (value <= 0) {//此欄位必填
            $(me).before('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    validatorCheck: function () {

        if ($(this).length > 1)
            me = this[0];
        else
            me = this;

        $(me).prev("font").remove();
        var value = 0;

        $(this).each(function () {
            if ($(this).prop("checked"))
                value++;
        });

        if (value <= 0) {//此欄位必填
            $(me).before('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    validatorMultiSelect: function () {
        $(this).next("button").next("font").remove();
        if ($(this).find("option:selected").length <= 0) {//此欄位必填
            $(this).next("button").after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    getSelectedValue: function () {
        var value = $(this).find('option:selected').val();
        if (value === "" || value == undefined)
            return null;
        return value;
    },
    //20140820 Hugh
    getSelectValue: function () {
        if ($(this).val() === null)
            return "";
        return $(this).val();
    },
    getRadioValue: function () {
        var value = null;

        $(this).each(function () {
            if ($(this).prop("checked"))
                value = $(this).val();
        });

        if (value === "" || value == undefined)
            return null;
        return value;
    },
    getCheckValueAry: function () {
        var ary = [];

        var i = 0;
        $(this).each(function () {
            if ($(this).prop("checked")) {
                ary[i] = $(this).val();
                i++;
            }
        });

        if (ary.length <= 0)
            return null;
        return ary;
    },
    getCheckValueStr: function (symbol) {
        symbol = symbol == undefined ? "," : symbol;
        var value = "";
        $(this).each(function () {
            if ($(this).prop("checked")) {
                value += $(this).val() + symbol;
            }
        });

        if (value === "")
            return null;
        return value.substring(0, value.length - 1);
    },
    validatorCombo: function () {
        $(this).next('font').remove();

        var value = $(this).getComboVal();
        if (value === "" || value==="--Select--") {//此欄位必填
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    //DropDownList , RadComboBox get value
    //id: ComboBox ID
    getComboVal: function () {
        var id = $(this).attr('id');
        var cboVal = '';

        if ($("#" + id + " > input").length > 0) {

            //            find control
            //            var elements = $("#" + id + " > input");
            //            var cbo = elements[0].value;
            //            cboVal = cbo.substring(cbo.indexOf('value":"') + 8, cbo.indexOf('",'));

            //            cboVal = cboVal.replace(':"', '');
            //            cboVal = $("#" + id + " > input").attr('realValue');
            //            console.log($('div[id="' + id + '"]').find('input').attr('value'));
            //get only value
            var valList = $('div[id="' + id + '"]').find('input').attr('value').split(':');
            cboVal = valList[0];
        }
        else {
            var cbo = $("#" + id);
            cboVal = cbo.val();
        }
        return cboVal;
    },
    validatorTokenInput: function () {

        $("#" + $(this).attr("id") + "_vfont").remove();

        if ($(this).tokenInput("get").length == 0) {//此欄位必填
            $(this).before('<font id=' + $(this).attr("id") + '_vfont color=\"red\">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    setTokenInputErrMsg: function (msg) {

        if (msg == "")
            $("#" + $(this).attr("id") + "_vfont").remove();
        else
            $(this).before("<font id=" + $(this).attr("id") + "_vfont color=\"red\">&nbsp;" + msg + "</font>");
    },
    getFirstTokenInputValue: function () {
        var obj = $(this).tokenInput("get");
        if (obj.length > 0) {
            return obj[0].id;
        }
        return null;
    },
    getFirstTokenInputDesc: function () {
        var obj = $(this).tokenInput("get");
        if (obj.length > 0) {
            return obj[0].description;
        }
        return null;
    },
    validatorAutoComplete: function () {
        $(this).css('border', '');
        $(this).next('font').remove();
        if ($(this).val() == null) {//此欄位必填
            $(this).css('border', 'solid 1px red');
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    getAutoCompleteValue: function () {
        return $(this).next('div').html();
    },
    validatorDigital: function (allowEmpty) {
        var patrn = /^(-)?(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)|([0-9]*))$/;

        $(this).next('font').remove();
        if ($(this).val() === "" && !allowEmpty) {
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        else if ($(this).val() !== null && $(this).val() !== "") {
            if (!patrn.exec($(this).val())) {
                $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredDigital') + '</font>');
                return 1;
            }
        }
        return 0;
    },
    validatorDate: function (allowEmpty) {
        //var patrn1 = /\d{4}\/\d{2}\/\d{2}/;
        //var patrn2 = /\d{4}\-\d{2}\-\d{2}/;
        var patrn1 = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
        $(this).siblings('font').remove();
        if ($(this).val() === "" && !allowEmpty) {
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        else if ($(this).val() !== null && $(this).val() !== "") {
            if (!patrn1.exec($(this).val())) {
                $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredDate') + '</font>');
                return 1;
            }
        }
        return 0;
    },
    isDigital: function () {
        var patrn = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)|([0-9]*))$/;

        $(this).next('font').remove();

        if ($(this).val() != null && $(this).val() != "") {
            if (!patrn.exec($(this).val())) {
                $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredDigital') + '</font>');
                return 1;
            }
        }
        return 0;
    },
    isDate: function (requiredField) {
        var patrn = /\d{4}-\d{2}-\d{2}/;

        //$(this).css('border', '');
        $(this).next('font').remove();

        if ($(this).val() != null && $(this).val() != "") {
            if (!patrn.exec($(this).val())) {
                $(this).after('<font color="red">&nbsp;必需為日期格式(例:2012-01-01)</font>');
                return 1;
            }
        } else if (requiredField && ($(this).val() == null || $(this).val() == "")) {//此欄位必填
            $(this).after('<font color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    validatorHtmlTag: function (str) {
        //alert(str);
        //alert(str.indexOf("<IMG"));
        //if (str.indexOf("<IMG") === -1) {
            //<[^img][^>]*>
        str = str.replace(/<[^IMG^img]\/?[^>]*>/g, ""); //去除HTML tag
        //}
        str = str.replace(/&nbsp;/g, "");//去除空格
        str.value = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,’\n’); //去除多餘空行
        

        $(this).removeClass('input_text_error');
        $(this).prev('div').remove();

        if ($.trim(str) == "") {
            $(this).addClass('input_text_error');
            $(this).before('<div><font color=red>'+ GetResource('Resource', 'requiredField') +'</font></div>') ;
            return 1;
        }
        return 0;
    }
};//end of validator

jQuery.fn.extend(validator);
