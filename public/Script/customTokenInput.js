$.fn.getBaseTokenInputCfg = function(){
	return {
		config: {
			//原生屬性：
			queryParam: "typeID",
			hintText: GetResource("Resource", "inputSearch"),
			noResultsText: "Data not found",
			prePopulate: null,
			searchingText: "Searching... <img src=\"/Resources/Images/spinner.gif\" />",
			animateDropdown: true,
			preventDuplicates: true,
			tokenValue: "id",
			theme: "facebook",
			tokenLimit: 1,
			minChars: 2,
			propertyToSearch: "display",
			onResult: function(results){
				setTimeout('$(".token-input-dropdown").css("z-index", "99999")', 400);
				setTimeout('$(".token-input-dropdown-facebook").css("z-index", "99999")', 400);
				return results;
			},//從後台取回資料後觸發的事件(撈一次多筆只觸發一次)
			tokenFormatter: function(item){
				return "<li><p>" + item.description + "(" + item.id + ")" + "</p></li>";
			},//選定項目後觸發的事件
			//onAdd: function(){},//項目加上後觸發的事件(在tokenFormatter事件之後觸發)
			//onDelete: function(){},//項目刪除後觸發的事件

			//自定屬性：
			tokenId: null,//this.id
			itemKey: "UID",//item取值的key
			fieldStoreId: "hideUID",//item選取後取得識別值存放處
			defaultPlaceholder: "",//預設顯示文字
			useDefaultListener: true,
			useDefaultChangeListener: false,
			afterFn: null,
			fontSize: "",//border-radius
			inputWidth: "",
			inputHeight: "",
			borderRadius: "",//input圓角半徑
			textOverflow: "ellipsis",//item太長的css
			displayCss: "inline-flex",//因為有兩處element可能經常會需要修改css，為避免混淆，暫時不提供css物件大包傳入
			shortWidth: undefined
		},
		addDefaultListenerFn: function(){
			$(".token-input-input-token").focus(function() {
				$(".token-input-dropdown").css("z-index", "9999");
			});
			$(".token-input-list-facebook").focus(function() {
				$(".token-input-dropdown-facebook").css("z-index", "9999");
			});
			$(".token-input-list-facebook input:first").blur(function() {
				$(".token-input-list-facebook input:first").css("width", "100%");
			});
			$(".token-input-input-token input:first").keyup(function() {
				setTimeout('$(".token-input-dropdown").css("z-index", "9999")', 400);
			});
			$(".token-input-list-facebook input:first").keyup(function() {
				setTimeout('$(".token-input-dropdown-facebook").css("z-index", "9999")', 400);
			});
		},
		addDefaultChangeListenerFn: function(baseCfg){
			$("#" + baseCfg.tokenId).change(function(){
				var obj = $(this).tokenInput("get");
				if(obj.length > 0)
					$("#" + baseCfg.fieldStoreId).val(obj[0][baseCfg.itemKey]);
				else $("#" + baseCfg.fieldStoreId).val("");
			});
		},
		useInputCssFn: function(inputElId, baseCfg){
			var $Input = $("#" + inputElId);
			if(baseCfg.fontSize || baseCfg.inputWidth){//input
				var css = {};
				if(baseCfg.fontSize)
					css["font-size"] = baseCfg.fontSize;
				if(baseCfg.inputWidth)
					css["width"] = baseCfg.inputWidth;
				if(baseCfg.inputHeight)
					css["height"] = baseCfg.inputHeight;
				$Input.css(css);
			}
			if(baseCfg.borderRadius || baseCfg.displayCss || baseCfg.inputWidth || baseCfg.borderRadius){//ul
				var css = {};
				if(baseCfg.borderRadius)
					css["border-radius"] = baseCfg.borderRadius;
				if(baseCfg.displayCss)
					css["display"] = baseCfg.displayCss;
				if(baseCfg.inputWidth)
					css["width"] = baseCfg.inputWidth;
				if(baseCfg.borderRadius)
					css["border-radius"] = baseCfg.borderRadius;
				$Input.parent().parent().css(css);
			}
		},
		delayResetInputCssFn: function(cfgObj, baseCfg){
			setTimeout(function(){
				cfgObj.useInputCssFn($("#token-input-" + baseCfg.tokenId).attr("id"), baseCfg);
			}, 20);
		},
		doItemEllipsisFn: function($li, shortWidth){
			if(!$li || $li.length == 0)
				return;
			var $p = $li.find("p");
			if(!$p || $p.length == 0 || !$p.text())
				return;
			$li.attr("title", $p.text()).find("span").css("display", "contents");
			var $ul = $li.parent();
			var hasCut = false;
			var widthLimit = shortWidth || 40;
			while($ul.width() - $p.width() < widthLimit){
				var pText = $p.text();
				if(pText)
					$p.text(pText.substring(0, pText.length - 1));
				hasCut = true;
			}
			if(hasCut)
				$p.text($p.text() + "...");
		},//若需載入資料後整理item，可透過$(#tokenId).change()來觸發
		doDefaultItemChangeFn: function(baseCfg, $this, cfgObj){
			var textOverflow = baseCfg.textOverflow;
			if(textOverflow){
				var css = {};
				css["text-overflow"] = textOverflow;
				var $ul = $this.prev();
				var $li = $ul.find(".token-input-token-facebook").css(css);
				if($li.length > 0 && textOverflow == "ellipsis")
					cfgObj.doItemEllipsisFn($li, baseCfg.shortWidth);
			}
		}
	};
};

$.fn.sampleTokenInput = function(extCfg){
	var cfgObj = this.getBaseTokenInputCfg();
	var baseCfg = cfgObj.config;
	var defaultCfg = {
		//原生屬性：
		tokenValue: "display",
		tokenFormatter: function(item){
			return "<li><p>" + item.display + "</p></li>";
		},

		//自定屬性：
		tokenUrl: ""
	};
	$.extend(baseCfg, defaultCfg);
	if(extCfg)
		$.extend(baseCfg, extCfg);
	if(!baseCfg.tokenId)
		baseCfg.tokenId = this.attr("id");
	this.tokenInput(baseCfg.tokenUrl, baseCfg);
	var $this = this;
	var $input = this.prev().find("li input");
	var inputElId = $input.attr("id");
	cfgObj.useInputCssFn(inputElId, baseCfg);
	if(baseCfg.defaultPlaceholder)
		$input.attr("placeholder", baseCfg.defaultPlaceholder);
	$this.change(function(){
		cfgObj.doDefaultItemChangeFn(baseCfg, $this, cfgObj);
	});
	$input.blur(function(){
		cfgObj.delayResetInputCssFn(cfgObj, baseCfg);
	});
	if(!baseCfg.afterFn && baseCfg.useDefaultChangeListener)
		baseCfg.afterFn = function(){
			cfgObj.addDefaultChangeListenerFn(baseCfg);
		};
	if(baseCfg.useDefaultListener)
		cfgObj.addDefaultListenerFn();
	if(baseCfg.afterFn)
		baseCfg.afterFn();
	return this;
};

$.fn.selectTokenInput = function(extCfg){
	var cfgObj = this.getBaseTokenInputCfg();
	var baseCfg = cfgObj.config;
	var defaultCfg = {
		//原生屬性：

		//自定屬性：
		placeholders: undefined,//string[]→可支援兩組以上的placeholder
		selectElId: "",
		tokenUrlFn: undefined,//因應selector切換而需變更url的function
		afterChangeSlcFn: undefined//因應selector切換而導致過程中刪除的事件需要補回的function
	};
	$.extend(baseCfg, defaultCfg);
	if(extCfg)
		$.extend(baseCfg, extCfg);
	if(!baseCfg.tokenId)
		baseCfg.tokenId = this.attr("id");
	this.tokenInput(baseCfg.tokenUrlFn(baseCfg.selectElId), baseCfg);
	var $this = this;
	var $input = this.prev().find("li input");
	var inputElId = $input.attr("id");
	if(baseCfg.selectElId && inputElId){
		var selectElId = baseCfg.selectElId;
		$("#" + selectElId).change(function(e){
			var num = $("#" + selectElId + " option:selected").val();
			//var $Input = $("#" + inputElId);因為下面會刪除，所以不能用變數取代
			$("#" + inputElId).parent().parent().remove();//刪除後重建（因url需要改變）
			$this.tokenInput(baseCfg.tokenUrlFn(selectElId), baseCfg);
			var $Input = $("#" + inputElId);
			if(baseCfg.placeholders && baseCfg.placeholders.length > 0){
				if(!num && baseCfg.tokenType == "USER")
					$Input.attr("placeholder", baseCfg.placeholders[1]);//以 電話or姓名 為預設值
				else $Input.attr("placeholder", baseCfg.placeholders[$("#" + selectElId).prop("selectedIndex") || 0]);
			}
			cfgObj.useInputCssFn(inputElId, baseCfg);
			baseCfg.tokenUrlFn(selectElId);
			if(baseCfg.afterChangeSlcFn)
				baseCfg.afterChangeSlcFn();
		});
	}
	cfgObj.useInputCssFn(inputElId, baseCfg);
	if(baseCfg.defaultPlaceholder)
		$input.attr("placeholder", baseCfg.defaultPlaceholder);
	$this.change(function(){
		cfgObj.doDefaultItemChangeFn(baseCfg, $this, cfgObj);
	});
	$input.blur(function(){
		cfgObj.delayResetInputCssFn(cfgObj, baseCfg);
	});
	if(!baseCfg.afterFn && baseCfg.useDefaultChangeListener)
		baseCfg.afterFn = function(){
			cfgObj.addDefaultChangeListenerFn(baseCfg);
		};
	if(baseCfg.useDefaultListener)
		cfgObj.addDefaultListenerFn();
	if(baseCfg.afterFn)
		baseCfg.afterFn();
	if(baseCfg.afterChangeSlcFn)
		baseCfg.afterChangeSlcFn();
	return this;
};

$.fn.userTokenInput = function(extCfg){
	var cfgObj = this.getBaseTokenInputCfg();
	var baseCfg = cfgObj.config;
	var defaultCfg = {
		//原生屬性：
		tokenFormatter: function(item){
			var num = $("#" + this.selectElId + " option:selected").val();
			if(!num || $("#" + this.selectElId).prop("selectedIndex") == 1)//以 電話or姓名 為預設值
				return "<li><p>" + item.description + "(" + item.description2 + ")" + "</p></li>";
			else if($("#" + this.selectElId).prop("selectedIndex") == 2 || $("#" + this.selectElId).prop("selectedIndex") == 0)
				return "<li><p>" + item.description + "(" + item.id + ")" + "</p></li>";
		},

		//自定屬性：
		tokenType: "USER",
		placeholders: ["請輸入ID or 姓名", "請輸入電話 or 姓名", "請輸入QRCode or 姓名"],
		tokenUrlFn: getUserTokenInputUrl,
		useDefaultChangeListener: true
	};
	defaultCfg.defaultPlaceholder = defaultCfg.placeholders[1],//自定屬性
	$.extend(baseCfg, defaultCfg);
	if(extCfg)
		$.extend(baseCfg, extCfg);
	if(!baseCfg.tokenId)
		baseCfg.tokenId = this.attr("id");
	if(!baseCfg.afterFn && baseCfg.useDefaultChangeListener)
		baseCfg.afterFn = function(){
			cfgObj.addDefaultChangeListenerFn(baseCfg);
			$("#" + baseCfg.tokenId).prev().find("li input").attr("placeholder", baseCfg.placeholders[1]);
		};
	return this.selectTokenInput(baseCfg);
};

$.fn.courseTokenInput = function(extCfg){//請不要只會複製貼上，然後可以用就好
	var cfgObj = this.getBaseTokenInputCfg();
	var baseCfg = cfgObj.config;
	var defaultCfg = {
		//自定屬性：
		placeholder: "請輸入課程、教師名稱",
		tokenUrl: getCourseRelationship,
		tokenFormatter: function(item){
			return "<li><p>" + item.display + "</p></li>";
		},
		onAdd: function(){
			cfgObj.doItemEllipsisFn(this.prev().find(".token-input-token-facebook"));
		},
		shortWidth: undefined//45
	};
	defaultCfg.defaultPlaceholder = defaultCfg.placeholder,//自定屬性
	$.extend(baseCfg, defaultCfg);
	if(extCfg)
		$.extend(baseCfg, extCfg);
	//return this.selectTokenInput(baseCfg);//繼承錯誤
	return this.sampleTokenInput(baseCfg);
};

function getUserTokenInputUrlWithTemp(selId){
	var num = $("#" + selId + " option:selected").val();
	if(!num || $("#" + selId).prop("selectedIndex") == 1)//以SearchUserAndTelByCompany為預設值
		return "../../Program/AdminUser/AjaxOptionRequest.aspx?key=SearchUserAndTelByCompany&keyvalue1=" + window.parent.$("#selIndexCompany").val();
	return "../../Program/AdminUser/AjaxOptionRequest.aspx?key=SearchUserAndIDByCompany&keyvalue1=" + window.parent.$("#selIndexCompany").val();
}
function getUserTokenInputUrl(selId){
	var num = $("#" + selId + " option:selected").val();
	return "../../Program/AdminUser/AjaxOptionRequest.aspx?key=SearchUserWithoutTemp&keyvalue1=" + window.parent.$("#selIndexCompany").val() + "&keyvalue2=" + (!num || $("#" + selId).prop("selectedIndex") == 1 ? "NameAndPhoneNumber" : ( $("#" + selId).prop("selectedIndex") == 0?"IdAndName":"QRCodeAndName"));//以NameAndPhoneNumber為預設值
}
//function getCourseRelationship(LID, selId){//輸入LID然後再被覆蓋掉？
function getCourseRelationship(selId){
	var COID = window.parent.$("#selIndexCompany").val();
	var LID = window.parent.$("#selIndexLocation").val();
	return "../../Program/AdminUser/AjaxOptionRequest.aspx?key=SearchCourseCodeByCourseNameNCodeNTeacherWithoutSelf&keyvalue1=" + COID + "&keyvalue2=" + LID + "&keyvalue3=" + selId;
}
