var elemGetSet = {
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
        if (value === "" || value === "--Select--") {//此欄位必填
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
            $(this).before('<font id=' + $(this).attr("id") + '_vfont color="red">&nbsp;' + GetResource('Resource', 'requiredField') + '</font>');
            return 1;
        }
        return 0;
    },
    setTokenInputErrMsg: function (msg) {

        if (msg == "")
            $("#" + $(this).attr("id") + "_vfont").remove();
        else
            $(this).before("<font id=" + $(this).attr("id") + "_vfont color='red'>&nbsp;" + msg + "</font>");
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
            $(this).before('<div><font color=red>' + GetResource('Resource', 'requiredField') + '</font></div>');
            return 1;
        }
        return 0;
    }
};//end of validator

jQuery.fn.extend(elemGetSet);