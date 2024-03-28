//禮券共用工具  WEB/WebPos 

//禮券名轉譯
function TranslateType(inputtxt, lid) {
    var Translate = "";
    switch (inputtxt) {
        case "DPPD3":
            Translate = "振興三倍券"
            break;
        case "DON500":
            Translate = "動滋券"
            break;
        case "DECATHLON":
            Translate = "迪卡農"
            break;
        case "DPPD3_R":
            Translate = "振興三倍券(已退券)"
            break;
        case "DON500_R":
            Translate = "動滋券(已退券)"
            break;
        case "DECATHLON_R":
            Translate = "迪卡農(已退券)"
            break;
        case "DPPD5_R":
            Translate = "振興五倍券(已退券)"
            break;
        case "DPP200":
            Translate = "振興五倍券面額200"
            break;
        case "DPP500":
            Translate = "振興五倍券面額500"
            break;
        case "合計":
            Translate = "合計"
            break;
        case "DPP200_R":
            Translate = "振興五倍券面額200(已退券)"
            break;
        case "DPP500_R":
            Translate = "振興五倍券面額500(已退券)"
            break;
        case "DPP1000_R":
            Translate = "振興五倍券面額1000(已退券)"
            break;
        case "DPPD5":
            Translate = "振興五倍券"
            break;
        case "DPP1000":
            Translate = "振興五倍券面額1000"
            break;
        case "AreaCash":
            Translate = "地區現金券"
            break;
        case "AreaCash_R":
            Translate = "地區現金券(已退券)"
            break;
    }

    if (lid && inputtxt == "AreaCash") {
        switch (lid) {
            case "XDSC":
                Translate = "新北加倍券"
                break;
            case "ZHSC":
                Translate = "新北加倍券"
                break;
            case "LZSC":
                Translate = "好事乘雙券"
                break;
            case "HPBG":
                Translate = "台北熊好券"
                break;
        }
    }

    return Translate
}

//POS介面 啟動禮券功能
function startupVoucherOption(ForInLID) {
    var response = false;
    switch (ForInLID) {
        case "ZSLOHAS":
        case "ZHSC":
        case "LZSC":
        case "HPBG":
        case "YHSC":
        case "ZHSC":
        case "ASFC":
            response = true;
            break;
        default:
            break;
    }
    return response;
}
//設定各場館開放票券 與 票券顯示規則
function customerVoucherArr(LID) {
    var VoucherObj;
    //設定各場地顯示之禮券類別
    var ZSLOHAS = ["DPPD5", "DECATHLON", "DON500", "AreaCash"]
    var LZSC = ["DPPD5", "DON500", "AreaCash"]
    var HPBG = ["DPPD5", "DON500", "AreaCash"]
    var XDSC = ["DPPD5", "DON500", "AreaCash"]
    var ZHSC = ["DPPD5", "DON500", "AreaCash"]
    var ASFC = ["DPPD5", "DON500", "AreaCash"]
    var YHSC = ["DPPD5", "DON500", "AreaCash"]

    switch (LID) {
        case "ZSLOHAS":
            VoucherObj = ZSLOHAS
            break;
        case "LZSC":
            VoucherObj = LZSC
            break;
        case "HPBG":
            VoucherObj = HPBG
            break;
        case "XDSC":
            VoucherObj = XDSC
            break;
        case "ZHSC":
            VoucherObj = ZHSC
            break;
        case "ASFC":
            VoucherObj = ASFC
            break;
        case "YHSC":
            VoucherObj = YHSC
            break;
    }

    var Detail = {
        //單次消費僅會出現一筆
        displayOnce: ["DON500", "AreaCash"],
        voucherType: VoucherObj
    }

    return Detail;
}

//製作禮券
function customerVoucher(LID, hideArr) {
    var partOfHtml = "";
    var VoucherList = customerVoucherArr(LID)

    VoucherList.voucherType.forEach(function (value) {
        var hide = false;
        hideArr.forEach(function (data) {
            if (data == value)
                hide = true;
        })
        if (!hide) {
            var description = TranslateType(value)
            partOfHtml += '<option value="' + value + '">' + description + '</option>';
        }
    })
    return partOfHtml;
}

//禮券細節
function voucherDetailWithCss(Type) {
    var width = ""; //欄寬
    var background = ""; //背景..等 css細節
    var denomination;//面額
    var InvoiceOrNot = "";//等同現金，需開立發票 Invoice  折扣/折抵 Not

    switch (Type) {
        case "DPPD5":
            width = "width: 90px";
            denomination = ["200", "500", "1000"];
            background = "background-color: #dbdbdb; border: 1px #ced4da solid; width:90px; display:none  ;text-align: center; color: #000000; border-radius: 5px;";
            InvoiceOrNot = "Invoice";
            break;
        case "DECATHLON":
            width = "width: 90px";
            denomination = ["100", "200"];
            background = "background-color: #dbdbdb; border: 1px #ced4da solid; width:90px; display:none  ;text-align: center; color: #000000; border-radius: 5px;";
            InvoiceOrNot = "Not";
            break;
        case "DON500":
            width = "width: 90px; display:none";
            denomination = [];
            background = "background-color: #fff; border: 1px #ced4da solid; width:90px; text-align: center; color: #000000; border-radius: 5px;";
            InvoiceOrNot = "Invoice";
            break;
        case "AreaCash":
            width = "width: 90px; display:none";
            denomination = [];
            background = "background-color: #fff; border: 1px #ced4da solid; width:90px; text-align: center; color: #000000; border-radius: 5px;";
            InvoiceOrNot = "Invoice";
            break;
        //照格式自行新增新禮券
    }

    var voucherDetailData = {
        width: width,
        denomination: denomination,
        background: background,
        InvoiceOrNot: InvoiceOrNot
    }
    return voucherDetailData;
}
