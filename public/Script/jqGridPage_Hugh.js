// jqGrid Page Plugin
//
// Version 1.0
//
// Cory Hugh,FIT IT
// 03 Jan 2013
//
// for 所有使用jqGrid頁面自訂方法
//
//
// Usage:
//
//
// History:
//
//      1.00 - Released (03 Jan 2013)
//      1.01 - Released (03 Mar 2014)   jqGrid 嵌入每頁筆數，並調整
//      1.02 - Released (11 Mar 2014)   EXCEL上傳整入維護頁面
// License:
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2013 FIT IT, FOXCONN.
//
//-------------------------------------------------------------------------------------------------------------
//$.fn.exists = function (){ return this.length > 0; }
//User權限
//var funcStr;
//User語言
//var defaultLanguage;
//重新整理
function doRefresh(){
	if($('input[subtype="sType"]').length > 0)
		$('input[subtype="sType"][type="text"]').val("");
	var $tType = $('textarea[subtype="sType"]');
	if($tType.length > 0)
		$tType.val("");
	var $sType = $('select[subtype="sType"]');
	if($sType.length > 0)
		$sType.each(function(){
			var $this = $(this);
			if($this.prop("multiple"))
				$this.val("").multiselect("refresh");
			else $this.find('option:eq(0)').attr("selected", "selected");
		});
	var $idp = $('input[subtype="dp"][id^="txts"]');
	if($idp.length > 0)
		$idp.val("");
	var $dpSE = $('input[subtype="dpSE"][id^="txts"]');
	if($dpSE.length > 0){
		$dpSE.val("");
		$('input[subtype="dpSE"][id$="StartDate"]').datepicker("option", "maxDate", null)
	}
	//每頁顯示筆數，這裡只預設第一個Grid的動作
	var $txtRowNum_1 = $("#txtRowNum_1");
	if($txtRowNum_1.length > 0){
		$txtRowNum_1.val($txtRowNum_1.attr("defaultRows"));
		$("#grid_1").setGridParam({ rowNum: $txtRowNum_1.attr("defaultRows") })
		//attach "Enter" keyup
		//var e = jQuery.Event("keyup");
		//e.which = 13;
		//$txtRowNum_1.trigger(e);
	}
	refreshGrid();
}//重新整理
//將Url轉成Json格式
function getJsonFromUrl(url){
	var query = url;
	var data = query.split("&");
	var result = {};
	for(var i = 0; i < data.length; i++){
		var item = data[i].split("=");
		result[item[0]] = item[1];
	}
	return result;
}
//設定jqGrid
function setGrid(gridID, setUrl){
	var gridNum = gridID.split("_");
	var pagerID = "pager_" + gridNum[1];
	var gridWrapperID = "#gridWrapper_" + gridNum[1];
	//IE 與 Chrome對中文字編碼不同，需重新Encode Url
	var postUrlData = getJsonFromUrl(setUrl);
	var postUrl = "";
	/*
	for (var k in postUrlData){
		if(k.indexOf("?tableName") > -1)
			postUrl = k + "=" + postUrlData[k];
		//else postUrl += "&" + k + "=" + encodeURIComponent(postUrlData[k]);
	}
	*/
	$("#grid_" + gridNum[1]).setGridParam({ url: setUrl/*postUrl*/ }).trigger("reloadGrid", [{ page: 1 }]);//.navGrid(pagerID, { edit: false, add: false, del: false, search: false, refresh: false });

	//建立每頁筆數功能，置放pager中
	$("#pager_" + gridNum[1] + "_left").html("&nbsp;<span>"  + '</span>&nbsp;<input type="text" id="txtRowNum_' + gridNum[1] + '" title=' + " defaultRows=" + $("#grid_" + gridNum[1]).getGridParam("rowNum") + ' class="input_text" style="width: 25px;" value=' + $("#grid_" + gridNum[1]).getGridParam("rowNum") + " />");

	$("#txtRowNum_" + gridNum[1]).keyup(function(e){
		if((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)){
			var $this = $(this);
			if($this.val() !== ""){
				var patrn = /[1-9]|[1-9][0-9]/;
				if(!patrn.exec($this.val()))
					$this.val($("#txtRowNum_" + gridNum[1]).attr("defaultRows")); 
			}
			else $this.val($("#txtRowNum_" + gridNum[1]).attr("defaultRows"));
			$("#grid_" + gridNum[1]).setGridParam({ rowNum: $this.val() }).trigger("reloadGrid", [{ page: 1 }]);
		}
	});
	//視窗大小改變時，自動調整Width
	$(window).bind("resize", function(){
		var $grid_ = $("#grid_" + gridNum[1]);
		//set to 0 so grid does not continually grow
		$grid_.setGridWidth(0);
		//resize to our container's width
		$grid_.setGridWidth($(gridWrapperID).width());
	}).trigger('resize');
}//設定jqGrid

//搜尋
function search(){
	//搜尋動作發生時，恢復預設每頁筆數
	var $txtsRowNum = $('input[id^="txtsRowNum_"]');
	if($txtsRowNum.length > 0){
		$txtsRowNum.each(function(){
			var $this = $(this);
			$this.val($this.attr("defaultRows"));
			var gridNum = $this.attr("id").split("_");
			var gridID = 'grid_' + gridNum[1];
			$("#" + gridID).setGridParam({ rowNum: $this.attr("defaultRows") })
		});
	}$()
	refreshGrid();
	return false;
}
//初始化 Add
function initAdd(){
	$("#hideUID").val("");
	//set text empty and enabled all text
	$("#divMgt").each(function(){
		var $this = $(this);
		$this.find('input[subtype="txt"]').val("").prop("readonly", false).next("font").remove();
		$this.find('textarea[subtype="txt"]').val("").prop("readonly", false).next("font").remove();
		$this.find('div[subtype="txt"]').prop("readonly", false).next("font").remove();
		$this.find('input[subtype="dp"]').val("").prop("readonly", true).next("font").remove();
		$this.find('input[subtype="dpSE"]').val("").prop("readonly", true).next("font").remove();
		$this.find('input[type="radio"]').prop("disabled", false);
		$this.find('input[type="checkbox"]').prop("disabled", false);
		$this.find(":text").next("font").remove();
		//set select initial
		var $select = $this.find("select");
		$select.prop("disabled", false).next("font").remove();
		$select.find("option:eq(0)").prop("selected", true);
		//chosen
		$select.next().next("font").remove();
		//set input Token
		var $token = $this.find('input[subtype="token"]');
		if($token.length > 0)
			$token.tokenInput("clear").prop("readonly", false);
		//set datepicker initial
		$this.find('input[subtype="dp"]').datepicker("enable");
		$this.find('input[subtype="dpSE"]').datepicker("enable");
		//set autocomplete
		var $autocomp = $this.find('input[subtype="autocomp"]');
		if($autocomp.length > 0){
			$autocomp.val("").prop("readonly", false).next().next("font").remove();
			var $autocompSelected = $autocomp.next().find("span.span-autocomplete-selected");
			$autocompSelected.next("br").remove();
			$autocompSelected.remove();
			$autocomp.prop("readonly", false);
		}
		//set combo initial
		//$this.find('div[id^="cbo"]').next("font").remove();
		//set RadComboBox disabled
		/*$this.find(".RadComboBox_Default").each(function(){
			var $this = $(this);
			$this.find('input[id$="_Input"]').prop("disabled", false);
			$this.find('a[id$="_Arrow"]').show();
			setLoadonDemandValue($this.attr("id"), "");//設空值
		});*/
		var $buttonpaneButton = $this.siblings(".ui-dialog-buttonpane").find("button");
		$buttonpaneButton.eq(0).show();
		$buttonpaneButton.eq(1).show();
	});
	$('input:checkbox').next("label").css({ color: "" });

	//Set dialog title , 這樣才會吃到html code
	//$("span.ui-dialog-title").html(programName + " <font color=yellow>" + GetResource("Resource", "statusAdd") + "</font>");
	//$("#divMgt").dialog("option", "title", programName + " <font color=yellow>" + GetResource("Resource", "statusAdd") + "</font>");
	//設定維護頁面(dialog) Title
	setMgtDialogTitle("statusAdd");
	$("#divMgt").dialog("open");
}

//初始化 View
function initView(rowID){
	//$(".ui-dialog-buttonset").hide();
	//disabled all text
	$("#divMgt").each(function(){
		var $this = $(this);
		$this.find('input[id^="txt"]').prop("readonly", true);
		$this.find('textarea[subtype="txt"]').prop("readonly", true);
		$this.find('input[subtype="dp"]').prop("readonly", true);
		$this.find('input[subtype="dpSE"]').prop("readonly", true);
		$this.find('textarea[id^="txt"]').prop("readonly", true);
		$this.find('input[type="radio"]').prop("disabled", true);
		$this.find('input[type="checkbox"]').prop("disabled", true);
		$this.find(":text").next("font").remove();
		//set select disabled
		var $select = $this.find("select");
		$select.prop("disabled", true).next("font").remove();
		//chosen
		$select.next().next("font").remove();
		//set datepicker initial
		$this.find('input[subtype="dp"]').datepicker("disable");
		$this.find('input[subtype="dpSE"]').datepicker("disable");
		//set input Token
		var $token = $this.find('input[subtype="token"]');
		if($token.length > 0)
			$token.tokenInput("clear").prop("readonly", true);
		//set autocomplete
		var $autocomp = $this.find('input[subtype="autocomp"]');
		if($autocomp.length > 0){
			$autocomp.val("").prop("readonly", false).next().next("font").remove();
			var $autocompSelected = $autocomp.next().find("span.span-autocomplete-selected");
			$autocompSelected.next("br").remove();
			$autocompSelected.remove();
			$autocomp.prop("readonly", true);
		}
		//set combo initial
		//$this.find('div[id^="cbo"]').next("font").remove();
		//set RadComboBox disabled
		/*$this.find(".RadComboBox_Default").each(function(){
			var $this = $(this);
			$this.find('input[id$="_Input"]').prop("disabled", true);
			$this.find('a[id$="_Arrow"]').hide();
		});*/
		var $buttonpaneButton = $this.siblings(".ui-dialog-buttonpane").find("button");
		$buttonpaneButton.eq(0).hide();
		$buttonpaneButton.eq(1).hide();
	});
	//設定維護頁面(dialog) Title
	setMgtDialogTitle("statusView");
	//回傳row值
	return $("#grid_1").jqGrid("getRowData", rowID);
}

//初始化 Edit
function initUpdate(rowID){
	//$(".ui-dialog-buttonset").show();
	//enabled all text
	console.log("initUpdate1: " + new Date());
	var i = 0;
	console.log("initUpdate1: $(\"#divMgt\").length=" + $("#divMgt").length);
	$("#divMgt").each(function(){
	i++;
		console.log("initUpdate-" + i + "'1: " + new Date());
		var $this = $(this);
		$this.find('input[subtype="txt"]').prop("readonly", false);
		$this.find('textarea[subtype="txt"]').prop("readonly", false).next("font").remove();
		$this.find('input[subtype="dp"]').prop("readonly", true).next("font").remove();
		$this.find('input[subtype="dpSE"]').prop("readonly", true).next("font").remove();
		$this.find('input[type="radio"]').prop("disabled", false);
		$this.find('input[type="checkbox"]').prop("disabled", false);
		$this.find(":text").next("font").remove();
		//set select enable
		var $select = $this.find("select");
		$select.prop("disabled", false).next("font").remove();
		//chosen
		$select.next().next("font").remove();
		//set datepicker initial
		console.log("initUpdate-" + i + "'2: " + new Date());
		$this.find('input[subtype="dp"]').datepicker("enable");
		$this.find('input[subtype="dpSE"]').datepicker("enable");
		//set input Token
		var $token = $this.find('input[subtype="token"]');
		if($token.length > 0)
			$token.tokenInput("clear");
		//set autocomplete
		console.log("initUpdate-" + i + "'3: " + new Date());
		var $autocomp = $this.find('input[subtype="autocomp"]');
		if($autocomp.length > 0){
			$autocomp.val("").prop("readonly", false).next().next("font").remove();
			var $autocompSelected = $autocomp.next().find("span.span-autocomplete-selected");
			$autocompSelected.next("br").remove();
			$autocompSelected.remove();
			$autocomp.prop("readonly", false);
		}
		//set combo initial
		//$this.find('div[id^="cbo"]').next("font").remove();
		//set RadComboBox disabled
		/*$this.find(".RadComboBox_Default").each(function(){
			var $this = $(this);
			$this.find('input[id$="_Input"]').prop("disabled", false);
			$this.find('a[id$="_Arrow"]').show();
		});*/
		console.log("initUpdate-" + i + "'4: " + new Date());
		var $buttonpaneButton = $this.siblings(".ui-dialog-buttonpane").find("button");
		$buttonpaneButton.eq(0).show();
		$buttonpaneButton.eq(1).show();
		console.log("initUpdate-" + i + "'5: " + new Date());
	});
	console.log("initUpdate2: " + new Date());
	setMgtDialogTitle("statusEdit");//設定維護頁面(dialog) Title
	console.log("initUpdate3: " + new Date());
	return $("#grid_1").jqGrid("getRowData", rowID);//回傳row值
}

//初始化 Copy
function initCopy(rowID){
	//$(".ui-dialog-buttonset").show();
	//enabled all text
	$("#divMgt").each(function(){
		var $this = $(this);
		$this.find('input[subtype="txt"]').prop("readonly", false);
		$this.find('textarea[subtype="txt"]').prop("readonly", false).next("font").remove();
		$this.find('input[subtype="dp"]').prop("readonly", true).next("font").remove();
		$this.find('input[subtype="dpSE"]').prop("readonly", true).next("font").remove();
		$this.find('input[type="radio"]').prop("disabled", false);
		$this.find('input[type="checkbox"]').prop("disabled", false);
		$this.find(':text').next("font").remove();
		//set select enable
		$this.find("select").prop("disabled", false).next("font").remove();
		//set datepicker initial
		$this.find('input[subtype="dp"]').datepicker("enable");
		$this.find('input[subtype="dpSE"]').datepicker("enable");
		//set input Token
		var $token = $this.find('input[subtype="token"]');
		if($token.length > 0)
			$token.tokenInput("clear");
		//set combo initial
		//$this.find('div[id^="cbo"]').next("font").remove();
		//set RadComboBox disabled
		/*$this.find(".RadComboBox_Default").each(function(){
			var $this = $(this);
			$this.find('input[id$="_Input"]').prop("disabled", false);
			$this.find('a[id$="_Arrow"]').show();
		});*/
		var $buttonpaneButton = $this.siblings(".ui-dialog-buttonpane").find("button");
		$buttonpaneButton.eq(0).show();
		$buttonpaneButton.eq(1).show();
	});
	//設定維護頁面(dialog) Title
	setMgtDialogTitle("statusCopy");

	//回傳row值
	return $("#grid_1").jqGrid("getRowData", rowID);
}

//上傳EXCEL按鈕啟動事件
function uploadEXCEL(){
	$("#btnAdd").hide();
	$("#gridWrapper_1").hide();
	$("#divUpload").show();

	//$("#divUpload").dialog("open");
	//設定維護頁面(dialog) Title
	//setMgtDialogTitle("uploadExcel");
}

//設定維護頁面(dialog) Title
function setMgtDialogTitle(titleStatus){
	$(".ui-dialog-title").html("").append(" <font id=\"mgtTitle\" type=\"" + titleStatus + "\" color=yellow> </font>");
	//$("span.ui-dialog-title").html(programName + "   <font color=yellow>" + GetResource('Resource', titleStatus) + "</font>");
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//change jqGrid row num color
/*function changRownumColor(dayColor){
	$(".ui-dialog").css({ "border": "1px solid " + dayColor });
	$(".ui-dialog-buttonpane").css({ "border-top": "1px solid " + dayColor });
	var ss = document.styleSheets;
	for(var i = 0; i < ss.length - 1; i++){
		if(ss[i].href.substring(ss[i].href.lastIndexOf("/") + 1) === "Facebook.css"){
			var rules = ss[i].cssRules || ss[i].rules;
			for(var j = 70; j < rules.length; j++){
				if(rules[j].selectorText === ".ui-jqgrid .jqgrid-rownum"){
					rules[j].style.color = dayColor;
					//console.log(j);
					break;
				}
			}
		}
	}
}*/
