// basicDataInitial Plugin
//
// Version 1.0
//
// Cory Neo,Hugh,FIT IT
// 18 Aug 2014
//
// Usage:
//      針對Basic Data所屬頁面共用基礎設定使用
//      1.Setting SBU checkbox list
// History:
//
//		1.00 - Released (18 Aug 2014)
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2012 FIT IT, FOXCONN.
//
// Attention:
//
//=============================================================================================
//記錄SBU個數
var SBUCheckedCnt = 0;
function basicDataIniti() {
    //SBU checkbox list
    if ($('#divSBUCheckList').length > 0 && $("#chkSBUAll").length > 0) {
        var optionHTML = '<ul class="ulPList">';
        var enCnt = 0;
        $.ajax({
            url: 'AjaxOptionRequest.aspx',
            data: { key: 'bas_sbu' },
            cache: false,
            async: false,
            dataType: 'json',
            success: function (json) {
                for (var s in json) {
                    if (json[s].SBU != null) {
                        SBUCheckedCnt++;
                        if (enCnt == 5) {
                            enCnt = 0;
                            optionHTML += '</ul></li>';
                        }
                        if (enCnt % 5 == 0) {
                            optionHTML += '<li><ul class="ulList">';
                        }
                        optionHTML += '<li><input type="checkbox" name="cSBU"  value=' + json[s].SBU + ' /><label for="cSBU" title="' + json[s].SBU + '">' + json[s].description + '</label></li>';

                        enCnt++;
                    }
                }
            }
        });
        $("#divSBUCheckList").html(optionHTML + "</ul>");
        $('#divSBUCheckList :checkbox').click(function () {
            judgeCheckedSBU();
        });
    }
}
//全選SBU
function checkAllSBU(element) {
    if ($(element).prop("checked")) {
        $('#divSBUCheckList :checkbox').each(function () {
            $(this).prop("checked", true);
        });
    } else {
        $('#divSBUCheckList :checkbox').each(function () {
            $(this).prop("checked", false);
        });
    }
    changeCheckBoxColor();
}
//if checked選項=全部
function judgeCheckedSBU() {
    //checked選項=全部
    if ($('#divSBUCheckList :checkbox:checked').length === SBUCheckedCnt) {
        $('#tdAllSBU :checkbox').each(function () {
            $(this).prop("checked", true);
        });
    } else {
        $('#tdAllSBU :checkbox').each(function () {
            $(this).prop("checked", false);
        });
    }
    changeCheckBoxColor();
}