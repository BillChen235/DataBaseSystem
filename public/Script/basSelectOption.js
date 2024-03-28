// basSelectOption Plugin
//
// Version 1.0
//
// Cory Hugh,FIT IT
// 01 Oct 2013
//
// for 站台 Admin , Other資料夾底下程式
// 設定所有select , chosen選項取得
//
// Usage:
//
// History:
//
//      1.00 - Released (01 Oct 2013)
//      20150902 修改load資料方式，減少code，提高效率
// License:
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2013 FIT IT, FOXCONN.
//
//-------------------------------------------------------------------------------------------------------------
////判斷語言
////var browserLang = navigator.language || navigator.userLanguage;
//function judgeLang(chName, enName){
//    //中文
//    if(defaultLanguage !== "Chinese")
//        return enName;
//    return chName;
//}
function LoadBasInitOption(){
	var cboSingleAry = [];
	cboSingleAry.push($.parseJSON('{"name":"cbodataAuthorityCode", "src":"Aut_DataAuthority","key":"dataAuthorityCode","desc":"dataAuthorityDesc","Fdesc":"dataAuthorityForeignDesc"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboactionProgram", "src":"autprogramid","key":"programID","desc":"programName","Fdesc":"programForeignName"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboprogramType", "src":"Aut_ProgramType","key":"programType","desc":"typeDesc","Fdesc":"typeForeignDesc"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboprogramClassCode", "src":"Aut_ProgramClass","key":"programClassCode","desc":"programClassDesc","Fdesc":"programClassForeignDesc"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbomenuGroupID", "src":"Aut_MenuGroup","key":"groupID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboformID", "src":"Aut_FormName","key":"formID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbochildProgID", "src":"autprogramid","key":"programID","desc":"programName","Fdesc":"programForeignName"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboparentProgID", "src":"getparentprogid","key":"programID","desc":"programName","Fdesc":"programForeignName"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocontrolMode", "src":"Aut_DataControlMode","key":"controlMode","desc":"modeDesc","Fdesc":"modeForeignDesc"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocountryID", "src":"Bas_Country","key":"countryID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboareaID", "src":"Bas_Area","key":"areaID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocontitentID", "src":"Bas_Contitent","key":"contitentID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboBUIndustry", "src":"Bas_BUIndustry","key":"BUIndustry","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosBUIndustry", "src":"Bas_BUIndustry","key":"BUIndustry","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboBU", "src":"Bas_BU","key":"BU","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosearchBU", "src":"Bas_BU","key":"BU","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboSBU", "src":"Bas_SBU","key":"SBU","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosSBU", "src":"Bas_SBU","key":"SBU","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbofactoryID", "src":"Bas_Factory","key":"factoryID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosfactoryID", "src":"Bas_Factory","key":"factoryID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocityID", "src":"Bas_City","key":"cityID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboscustClassification", "src":"Bas_CustomerClass","key":"classID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocustClassification", "src":"Bas_CustomerClass","key":"classID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboicustClassification", "src":"Bas_CustomerClass","key":"classID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbobcustClassification", "src":"Bas_CustomerClass","key":"classID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboscustType", "src":"Bas_CustomerType","key":"typeID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocustType", "src":"Bas_CustomerType","key":"typeID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboicustType", "src":"Bas_CustomerType","key":"typeID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbobcustType", "src":"Bas_CustomerType","key":"typeID","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboscustIndustry", "src":"getcustindustry","key":"id","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocustIndustry", "src":"getcustindustry","key":"id","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboscustSubIndustry", "src":"getcustsubindustry","key":"id","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbocustSubIndustry", "src":"getcustsubindustry","key":"id","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboproductIndustry", "src":"Bas_ProductIndustry","key":"productIndustry","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboproductType", "src":"Bas_ProductType","key":"productType","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosproductType", "src":"Bas_ProductType","key":"productType","desc":"description","Fdesc":"foreignDescription"}'));
	cboSingleAry.push($.parseJSON('{"name":"cboproductFamily", "src":"Bas_ProductFamily","key":"id","desc":"","Fdesc":""}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosproductFamily", "src":"Bas_ProductFamily","key":"id","desc":"","Fdesc":""}'));
	cboSingleAry.push($.parseJSON('{"name":"cbosproductSeries", "src":"Bas_ProductSeries","key":"id","desc":"","Fdesc":""}'));
	cboSingleAry.push($.parseJSON('{"name":"cboproductSeries", "src":"Bas_ProductSeries","key":"id","desc":"","Fdesc":""}'));
	cboSingleAry.push($.parseJSON('{"name":"cboUploadFolder", "src":"getuploadfolder","key":"id","desc":"","Fdesc":""}'));

	$("select").each(function(){
		//console.log(this.id);
		if(jlinq.from(cboSingleAry).equals("name", this.id).any()){
			//console.log(this.id);
			var cbo = jlinq.from(cboSingleAry).equals("name", this.id);
			//console.log(cbo.first().name);
			//console.log(cbo.first().src);
			SetSingleCombo(cbo.first().name, cbo.first().src, cbo.first().key, cbo.first().desc, cbo.first().Fdesc);
		}
	});

	if($("#cboscustIndustry").length > 0 && $("#cboscustSubIndustry").length > 0)
		$("#cboscustIndustry").change(function(){
			SetSingleCombo("cboscustSubIndustry", "getcustsubindustry","id","description","foreignDescription");
		});
	if($("#cbocustIndustry").length > 0 && $("#cbocustSubIndustry").length > 0)
		$("#cbocustIndustry").change(function(){
			SetSingleCombo("cbocustSubIndustry", "getcustsubindustry", "id", "description", "foreignDescription");
		});
	//if($("#cboUploadFolder").length > 0)
	//	SetSingleCombo("cboUploadFolder", "getuploadfolder");
	if($("#cboauthorityClassCode").length > 0)
		SetChosen("cboauthorityClassCode", "Aut_AuthorityClass");
	if($("#selAuthority").length > 0)
		SetChosenByOneKey("selAuthority", "Aut_AuthorityClass", $.cookie("authorityClassCode"), false);
	if($("#selAuthorityWithoutAdmin").length > 0)
		SetChosenByOneKey("selAuthorityWithoutAdmin", "Aut_AuthorityClassWithoutAdmin", parent.$("#selIndexLocation").val(), false);
		//SetChosenByOneKey("selAuthority", "Aut_AuthorityClass", $.cookie("authorityClassCode"), false);
	if($("#selClassType").length > 0)
		SetChosen("selClassType", "Ma_MachineClassType");
	if($("#selMainClass").length > 0)
		SetChosen("selMainClass", "Ma_MainClass");
	if($("#selClassType2").length > 0)
		SetChosen("selClassType2", "Ma_MachineClassType");
	if($("#selMUID").length > 0)
		SetChosen("selMUID", "GetEquipment");
	if($("#selMUIDByHealthy").length > 0)
		SetChosen("selMUIDByHealthy", "GetHealthyEquipment");
	if($("#selLocation").length > 0)
		SetChosen("selLocation", "Sys_Location");
	if($("#selLocation2").length > 0)
		SetChosen("selLocation2", "Sys_Location");
	if($("#selIndexLocation").length > 0)
		SetIndexChosen("selIndexLocation", "Sys_Location");
	if($("#selIndexLocation2").length > 0)
		SetIndexChosen("selIndexLocation2", "Sys_Location");
	if($("#selLocationSubToBook").length > 0)
		SetChosen("selLocationSubToBook", "GetLocationSubToBook");
	if($("#selHealthyRecordKind").length > 0)
		SetChosen("selHealthyRecordKind", "GetHealthyRecordKind");
	if($("#selHealthyMUIDKind").length > 0)
		SetChosen("selHealthyMUIDKind", "GetHealthyMUIDKind");
	if($("#selAllGroupID").length > 0)
		SetChosen("selAllGroupID", "GetAllGroupID");
	if($("#selCompany").length > 0)
		SetChosen("selCompany", "Sys_Company");
	if($("#selUser").length > 0)
		SetChosen("selUser", "Per_UserBasicData");
	if($("#selPlacfeCategoryID").length > 0)
		SetChosenByMultiKey("selPlacfeCategoryID", "Sys_LocationSubCategory", parent.$("#selIndexCompany").val(), parent.$("#selIndexLocation").val());
	if($("#selCourseCategoryID").length > 0)
		SetChosen("selCourseCategoryID", "Co_CourseCategory");
	if($("#selIndexCompany").length > 0)
		SetIndexChosen("selIndexCompany", "Sys_CompanyByUser");
	if($("#selIndexCompanyLogin").length > 0)
		SetIndexChosen("selIndexCompanyLogin", "Sys_Company");
	if($("#selIndexCompany2").length > 0)
		SetIndexChosen("selIndexCompany2", "Sys_Company");
	if($("#selAutCompanyMgt").length > 0)
		SetIndexChosen("selAutCompanyMgt", "Sys_Company");
	if($("#selCompanySearch").length > 0)
		SetIndexChosen("selCompanySearch", "Sys_Company");
	if($("#selCompanySearchN").length > 0)
		SetIndexChosen("selCompanySearchN", "Sys_Company");
	if($("#selRetDataToTable").length > 0)
		SetChosen("selRetDataToTable", "getRetDataToTableType");
}
//設定單選項
function SetSingleCombo(id, name, key, desc, Fdesc){
	$.ajax({
		url: "/Program/BasicData/AjaxOptionRequest.aspx",
		data: { key: name, cboscustIndustry: $("#cboscustIndustry").val(), cbocustIndustry: $("#cbocustIndustry").val() },
		cache: false,
		async: true,
		dataType: "json",
		success: function(json){
			var optionHTML = '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
			for(var s in json){
				var obj = json[s];
				var key = obj.key;
				if(key){
					var desc = obj.desc;
					if(desc)
						optionHTML += '<option value="' + key + '">' + key + ":" + judgeLang(desc, obj.Fdesc) + "</option>";
					else optionHTML += '<option value="' + key + '">' + key + "</option>";
				}
			}
			//加入選項
			$("#" + id).html(optionHTML);
		},
		error: function(xhr){ }
	});
}

/*function SetSingleComboOption(id, name, showPlease){
	var optionHTML = "";
	if(showPlease)
		optionHTML = '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";

	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			switch(name){
				case "GetGroupIDNotInAccessed":
					for(var s in json){
						var obj = json[s];
						var groupID = obj.groupID;
						if(groupID)
							optionHTML += '<option value=' + groupID + ">" + groupID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}
*/
//設定Chosen
function SetIndexChosen(id, name){
	$.ajax({
		url: "../../Program/AdminUser/AjaxOptionRequest.aspx",
		data: { key: name },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = "";
			switch(name){
				case "Sys_Location":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + obj.Description + ":" + obj.ForeignDescription + "</option>";
					}
					break;
				case "Sys_Company":
					if(id == "selCompanySearch")
						optionHTML = '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
					for(var s in json){
						var obj = json[s];
						var coid = obj.COID;
						if(coid)
							optionHTML += '<option value="' + RTrim(coid) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetIndexChosenByOneKey(strUrl, id, name, key1){
	$.ajax({
		url: strUrl ,
		data: { key: name, keyvalue1: key1 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = "";
			switch(name){
				case "GetLocationByCompany":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + obj.Description + ":" + obj.ForeignDescription + "</option>";
					}
					if(json.length == 0)
						optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
					break;
				case "GetClassTypeByCompany":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + "</option>";
					}
					break;
				case "Sys_CompanyByUser":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">(' + RTrim(Id) + ")" + obj.description + "</option>";
					}
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetIndexChosenByTwoKey(strUrl, id, name, key1, key2){
	$.ajax({
		url: strUrl,
		data: { key: name, keyvalue1: key1, keyvalue2: key2 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = "";
			switch(name){
				case "GetLocationByAuthority":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + obj.Description + ":" + obj.ForeignDescription + "</option>";
					}
					if(json.length == 0)
						optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
					break;
				case "GetLimLocationByCompany":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + obj.Description + ":" + obj.ForeignDescription + "</option>";
					}
					if(json.length == 0)
						optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
					break;
				case "GetAllLocationSubCategoryToBook":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + obj.description + "</option>";
					}
					optionHTML += '<option value="">' + GetResource("WEBResource", "Unclassified") + "</option>";
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetMultiChosen(id, name){
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = "";
			switch(name){
				case "Bas_AREA":
					for(var s in json){
						var obj = json[s];
						var areaID = obj.areaID;
						if(areaID)
							optionHTML += '<option value=' + areaID + '>' + areaID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_BU":
					for(var s in json){
						var obj = json[s];
						var BU = obj.BU;
						if(BU)
							optionHTML += '<option value=' + BU + ">" + BU + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_BUINDUSTRY":
					for(var s in json){
						var obj = json[s];
						var BUIndustry = obj.BUIndustry;
						if(BUIndustry)
							optionHTML += '<option value=' + BUIndustry + ">" + BUIndustry + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_FACTORY":
					for(var s in json){
						var obj = json[s];
						var factoryID = obj.factoryID;
						if(factoryID)
							optionHTML += "<option value=" + factoryID + ">" + factoryID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_Country":
					for(var s in json){
						var obj = json[s];
						var countryID = obj.countryID;
						if(countryID)
							optionHTML += "<option value=" + countryID + ">" + countryID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_Contitent":
					for(var s in json){
						var obj = json[s];
						var contitentID = obj.contitentID;
						if(contitentID)
							optionHTML += "<option value=" + contitentID + ">" + contitentID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_SBU":
					for(var s in json){
						var obj = json[s];
						var SBU = obj.SBU;
						if(SBU)
							optionHTML += "<option value=" + SBU + ">" + SBU + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Bas_City":
					for(var s in json){
						var obj = json[s];
						var cityID = obj.cityID;
						if(cityID)
							optionHTML += "<option value=" + cityID + ">" + cityID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				default:
					break;
			}
			$("#" + id).html(optionHTML).chosen({//加入選項
				no_results_text: GetResource("Resource", "noSuch") + ":"
			});
		},
		error: function(xhr){ }
	});
}
function SetChosen(id, name){
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = "";
			switch(name){
				case "Sys_LocationSubCategory":
					optionHTML += '<option value="">' + GetResource("WEBResource", "None") + "</option>";
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "Co_CourseCategory":
					optionHTML += '<option value="">' + GetResource("WEBResource", "None") + "</option>";
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + judgeLang(obj.Name, ID) + "</option>";
					}
					break;

				case "Ma_MachineClassType":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + obj.id + "</option>";
					}
					break;

				case "Ma_MainClass":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "GetHealthyEquipment":
					for(var s in json){
						var obj = json[s];
						var MUID = obj.MUID;
						if(MUID)
							optionHTML += '<option value="' + RTrim(MUID) + '">' + judgeLang(obj.Name, obj.ForeignName) + "</option>";
					}
					break;

				case "GetEquipment":
					for(var s in json){
						var obj = json[s];
						var MUID = obj.MUID;
						if(MUID)
							optionHTML += '<option value="' + RTrim(MUID) + '">' + judgeLang(obj.Name, obj.ForeignName) + "</option>";
					}
					break;

				case "Sys_Location":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "GetLocationSubToBook":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + RTrim(obj.description) + "(" + RTrim(obj.display) + ")" + "</option>";
					}
					break;

				case "GetHealthyRecordKind":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + RTrim(obj.Name) + "</option>";
					}
					break;

				case "GetHealthyMUIDKind":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + RTrim(obj.description) + "</option>";
					}
					break;

				case "GetAllGroupID":
					for(var s in json){
						var obj = json[s];
						var GID = obj.GID;
						if(GID)
							optionHTML += '<option value="' + RTrim(GID) + '">' + RTrim(obj.Title) + "</option>";
					}
					break;

				case "Sys_Company":
					for(var s in json){
						var obj = json[s];
						var coid = obj.COID;
						if(coid)
							optionHTML += '<option value="' + RTrim(coid) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "GetNotAttachedMUID":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Per_UserBasicData":
					for(var s in json){
						var obj = json[s];
						var UPID = obj.UPID;
						if(UPID)
							optionHTML += "<option value=" + Trim(UPID) + ">" + Trim(obj.userName) + "(" + Trim(obj.ID) + ")</option>";
					}
					break;

				case "getRetDataToTableType":
					optionHTML += '<option value="">' + GetResource("WEBResource", "NoGeneratingData") + "</option>";
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}
function SetChosenByOneKey(id, name, key1, Plz){
	var optionHTML = "";
	if(Plz)
		optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			switch(name){
				case "ProgramIdAuthorityCoidNotDefined":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += "<option value=" + Id + ">" + Id + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "GetGroupIDNotInAccessed":
					for(var s in json){
						var obj = json[s];
						var groupID = obj.groupID;
						if(groupID)
							optionHTML += "<option value=" + groupID + ">" + groupID + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "Aut_AuthorityClass":
					for(var s in json){
						var obj = json[s];
						var authorityClassCode = obj.authorityClassCode;
						if(authorityClassCode)
							optionHTML += '<option value="' + RTrim(authorityClassCode) + '">' + authorityClassCode + ":" + judgeLang(obj.authorityClassDesc, obj.authorityClassForeignDesc) + "</option>";
					}
					break;
				case "Aut_AuthorityClassWithoutAdmin":
					for(var s in json){
						var obj = json[s];
						var authorityClassCode = obj.authorityClassCode;
						if(authorityClassCode)
							optionHTML += '<option value="' + RTrim(authorityClassCode) + '">' + authorityClassCode + ":" + judgeLang(obj.authorityClassDesc, obj.authorityClassForeignDesc) + "</option>";
					}
					break;

				case "GetMUIDFormulaByType":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + Id + '">' + obj.description + "</option>";
					}
					break;

				case "GetNotInAttachedClassType":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + "</option>";
					}
					break;

				case "GetAttachedClassType":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + "</option>";
					}
					break;

				case "GetClassTypeByCompany":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + "</option>";
					}
					break;

				case "GetEquipmentByCompany":
					for(var s in json){
						var obj = json[s];
						var MUID = obj.MUID;
						if(MUID)
							optionHTML += '<option value="' + RTrim(MUID) + '">' + judgeLang(obj.Name, obj.ForeignName) + "</option>";
					}
					break;

				case "Sys_CompanyByUser":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">(' + RTrim(Id) + ")" + obj.description + "</option>";
					}
					break;

				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetChosenByTwoKey(id, name, key1, key2, Plz){
	var optionHTML = "";
	if(Plz)
		optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1, keyvalue2: key2 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			switch(name){
				case "GetHisWeightTrainingEq":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + ID + '">' + obj.Name + "</option>";
					}
					break;

				case "GetHisRelaxEq":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + ID + '">' + obj.Name + "</option>";
					}
					break;

				case "GetMUIDByRecordTable":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + ID + '">' + ID + "</option>";
					}
					break;

				case "GetHisBikeEq":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + ID + '">' + obj.Name + "</option>";
					}
					break;

				case "GetHisTreadmillEq":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + ID + '">' + obj.Name + "</option>";
					}
					break;

				case "getLocationEventByClassType":
					for(var s in json){
						var obj = json[s];
						var EventID = obj.EventID;
						if(EventID)
							optionHTML += '<option value="' + EventID + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetMultiChosenByTwoKey(id, name, key1, key2, Plz){
	var optionHTML = "";
	if(Plz)
		optionHTML += '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1, keyvalue2: key2 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			switch(name){
				case "GetAllUserExceptMe":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + Id + '"> ' + obj.description + "</option>";
					}
					break;
				default:
					break;
			}

			var $id = $("#" + id);
			$id.html(optionHTML).chosen({//加入選項
				no_results_text: GetResource("Resource", "noSuch") + ":"
			});
			$id.trigger("chosen:updated");
		},
		error: function(xhr){ }
	});
}

function SetChosenByMultiKey(id, name, key1, key2, async, plzSelect, fn){
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1, keyvalue2: key2 },
		cache: false,
		async: async || false,
		dataType: "json",
		success: function(json){
			var optionHTML = '<option value="">' + (plzSelect || GetResource("Resource", "plzSelect")) + "</option>";
			switch(name){
				case "Sys_LocationSubCategory":
					optionHTML += '<option value="">' + GetResource("WEBResource", "None") + "</option>";
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "GetMUIDByClassType":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "GetMUIDByClassTypeAndCompany":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + judgeLang(obj.description, obj.foreignDescription) + "</option>";
					}
					break;

				case "GetLocationSubByLocation":
					for(var s in json){
						var obj = json[s];
						var LSID = obj.LSID;
						if(LSID)
							optionHTML += '<option value="' + RTrim(LSID) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "GetLocationSubByLocationWithoutClasstype45":
					for(var s in json){
						var obj = json[s];
						var LSID = obj.LSID;
						if(LSID)
							optionHTML += '<option value="' + RTrim(LSID) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;

				case "GetLocationSubToBookByArea":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + RTrim(obj.description)  + "</option>";
					}
					break;
				case "GetCategoryNameByMSCID":
					for(var s in json){
						var obj = json[s];
						var MSCID = obj.MSCID;
						if(MSCID)
							optionHTML += '<option value="' + RTrim(MSCID) + '">' + obj.Name_Key + "</option>";
					}
					break;
				case "GetCategoryNameByArea":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;
				case "GetLocationByAuthority":
					for(var s in json){
						var obj = json[s];
						var lid = obj.LID;
						if(lid)
							optionHTML += '<option value="' + RTrim(lid) + '">' + judgeLang(obj.Description, obj.ForeignDescription) + "</option>";
					}
					break;
				case "GetCoLocationIdList":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + Id + '">' + obj.description + "</option>";
					}
					break;
				case "GetCoLocationShareFreeIdList":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + Id + '">' + obj.description + "</option>";
					}
					break;
				case "GetSalaryCategoryNameList":
					for(var s in json){
						var obj = json[s];
						var SSCID = obj.SSCID;
						if(SSCID)
							optionHTML += '<option value="'+ SSCID + '">' + obj.CategoryName + "</option>";
					}
					break;
				case "GetCourseCategoryByCOIDLID":
					for(var s in json){
					var obj = json[s];
					var CCategoryID = obj.id;
					if(CCategoryID)
						optionHTML += '<option value="'+ CCategoryID + '">' + obj.description + "</option>";
					}
					break;
				default:
					break;
			}
			$("#" + id).html(optionHTML)/*.chosen({//加入選項
				no_results_text: GetResource("Resource", "noSuch") + ":"
			})*/;
			if(fn)
				fn();
		},
		error: function(xhr){ }
	});
}

function SetChosenByThreeKey(id, name, key1, key2, key3){
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1, keyvalue2: key2, keyvalue3: key3 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
			switch(name){

				case "GetAvailableTID":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + obj.description + "</option>";
					}
					break;

				case "GetBookingEquipmentByArea":
					for(var s in json){
						var obj = json[s];
						var MSSID = obj.MSSID;
						if(MSSID)
							optionHTML += '<option value="' + RTrim(MSSID) + '">' + obj.MUIDName + ":" + obj.Description + "</option>";
					}
					break;

				case "GetSensorsByLocationSub":
					for(var s in json){
						var obj = json[s];
						var ID = obj.ID;
						if(ID)
							optionHTML += '<option value="' + RTrim(ID) + '">' + ID + '(' + obj.Name + ')</option>';
					}
					break;

				case 'GetLimMSSIDByMUID':
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + obj.description + "</option>";
					}
					break;

				case "GetLocationSubToBookByAreaAfterPos":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + RTrim(obj.description) + "</option>";
					}
					break;

				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

function SetChosenByFourKey(id, name, key1, key2, key3, key4){
	$.ajax({
		url: "AjaxOptionRequest.aspx",
		data: { key: name, keyvalue1: key1, keyvalue2: key2, keyvalue3: key3, keyvalue4: key4 },
		cache: false,
		async: false,
		dataType: "json",
		success: function(json){
			var optionHTML = '<option value="">' + GetResource("Resource", "plzSelect") + "</option>";
			switch(name){
				case "GetAvailableTag":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + obj.description + "</option>";
					}
					break;
				case "GetAvailableWearHRMac":
					for(var s in json){
						var obj = json[s];
						var Id = obj.id;
						if(Id)
							optionHTML += '<option value="' + RTrim(Id) + '">' + Id + ":" + obj.description + "</option>";
					}
					break;

				default:
					break;
			}
			$("#" + id).html(optionHTML);//加入選項
		},
		error: function(xhr){ }
	});
}

//設定多選項
function SetMultiCombo(id, name){
	var optionHTML = "";
	optionHTML = GetComboOptions(name);
	$("#" + id).html(optionHTML).multiselect({//加入選項
		checkAllText: GetResource("Resource", "selectAll"),
		uncheckAllText: GetResource("Resource", "selectNothing"),
		noneSelectedText: GetResource("Resource", "noneSelectedText"),
		selectedText: GetResource("Resource", "hasSelected")
	}).multiselectfilter({ label: GetResource("Resource", "textFilter"), width: 70 });
}
//Set hideSelected
function GetCombo(name){
	var str = $("#cbo" + name).val();
	$("#hideSelected" + name).val(str);
}
