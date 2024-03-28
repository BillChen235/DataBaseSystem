/*
*NTable Plugin
*version 1.0
*Cory Hugh,FIT IT
*13 July 2015
*自訂分頁Table，搭配node.js使用socket.io

Usage:

$("#NtableRes1").NTable({
   //沒設定的話，default 20
   rows:20
   //指定的搜尋method
   searchFunc:search
});
 */

; (function ($) {
    var _defaultProperties = {
        //每頁筆數
        rows: 20,
        //目前頁
        currentPage: 1,
        //目前頁檢視筆數第一筆row NO
        currentRow: 0,
        //總筆數
        totalRecords: 0,
        //th array
        Th: [],
        //sort column
        sortCol: "",
        //指定的搜尋method
        searchFunc: null
    };

    //紀錄覆寫後的屬性
    var objAry = [];

    var methods = {
        init: function (settings) {

            //若無自行設定屬性則繼承預設屬性
            var _settings = $.extend(_defaultProperties, settings);

            //將繼承後的屬性指定為全域變數
            var id = $(this).attr("id");
            //pager table
            _settings.NpagerID = id + "_Npager";
            //每頁筆數
            _settings.NrowNumID = id + "_NrowNum";
            //第一頁
            _settings.NseekFirstID = id + "_NseekFirst";
            //上一頁
            _settings.NseekPrevID = id + "_NseekPrev";
            //目前頁
            _settings.NcurrentPageID = id + "_NcurrentPage";
            //共幾頁
            _settings.NpagesID = id + "_Npages";
            //下一頁
            _settings.NseekNextID = id + "_NseekNext";
            //最後頁
            _settings.NseekLastID = id + "_NseekLast";
            //目前檢視rows
            _settings.NnowRecordsID = id + "_NnowRecords";
            //Total rows
            _settings.NtotalRecordsID = id + "_NtotalRecords";

            objAry[$(this).attr("id")] = {
                rows: _settings.rows,
                currentPage: _settings.currentPage,
                currentRow: _settings.currentRow,
                totalRecords: _settings.totalRecords,
                Th: _settings.Th,
                sortCol: _settings.sortCol,
                searchFunc: _settings.searchFunc,

                NpagerID: _settings.NpagerID,
                NrowNumID: _settings.NrowNumID,
                NseekFirstID: _settings.NseekFirstID,
                NseekPrevID: _settings.NseekPrevID,
                NcurrentPageID: _settings.NcurrentPageID,
                NpagesID: _settings.NpagesID,
                NseekNextID: _settings.NseekNextID,
                NseekLastID: _settings.NseekLastID,
                NnowRecordsID: _settings.NnowRecordsID,
                NtotalRecordsID: _settings.NtotalRecordsID
            };

            return this.each(function () {

                var me = $(this);
                me.next().remove();
                var mainHtml = "";
                //set pager table
                var pagerHtml = "<table id='" + objAry[me.attr("id")].NpagerID + "' class='NTable_pager'><tr>";
                pagerHtml += "<th style='width:30%;text-align:left;'>&nbsp;<input type='text' id='" + objAry[me.attr("id")].NrowNumID + "' title=" + GetResource("Resource", "pressEnterChange") + " class='Ninput_text' style='width:30px;' value='" + objAry[me.attr("id")].rows + "' />&nbsp;<span>rows per page</span></th>";
                pagerHtml += "<th style='width:40%;text-align:center;'>";
                pagerHtml += "<span id='" + objAry[me.attr("id")].NseekFirstID + "' class='span-seek-first' title=" + GetResource("Resource", "firstPage") + "></span>";
                pagerHtml += "&nbsp;<span id='" + objAry[me.attr("id")].NseekPrevID + "' class='span-seek-prev' title=" + GetResource("Resource", "prevPage") + "></span>";
                pagerHtml += "&nbsp;<input type='text' id='" + objAry[me.attr("id")].NcurrentPageID + "' class='Ninput_text' style='width:30px;' value='" + objAry[me.attr("id")].currentPage + "' title=" + GetResource("Resource", "pressEnterChange") + " />&nbsp;/";
                pagerHtml += "&nbsp;<span id='" + objAry[me.attr("id")].NpagesID + "' style='vertical-align: middle;'></span>&nbsp;";
                pagerHtml += "<span id='" + objAry[me.attr("id")].NseekNextID + "' class='span-seek-next' title=" + GetResource("Resource", "nextPage") + "></span>";
                pagerHtml += "&nbsp;<span id='" + objAry[me.attr("id")].NseekLastID + "' class='span-seek-last' title=" + GetResource("Resource", "lastPage") + "></span></th>";
                pagerHtml += "<th style='width:30%;text-align:right;'>";
                pagerHtml += "<span id='" + objAry[me.attr("id")].NnowRecordsID + "'></span>";
                pagerHtml += "&nbsp;<span id='" + objAry[me.attr("id")].NtotalRecordsID + "'> of " + objAry[me.attr("id")].totalRecords + " records</span>&nbsp;";
                pagerHtml += "</th>";
                pagerHtml += "</tr></table>";

                //將pager table寫在NTable
                me.after(pagerHtml);

                //目前檢視rows
                //rocords > 0
                if (_defaultProperties.totalRecords > 0) {
                    _defaultProperties.currentRow = (_defaultProperties.currentPage * _defaultProperties.rows) - (_defaultProperties.rows) + 1;
                    $('#' + objAry[me.attr("id")].NnowRecordsID).html(_defaultProperties.currentRow + " - " + ((_defaultProperties.currentPage * _defaultProperties.rows) <= _defaultProperties.totalRecords ? (_defaultProperties.currentPage * _defaultProperties.rows) : _defaultProperties.totalRecords));
                    $('#' + objAry[me.attr("id")].NpagesID).html(Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows));

                    /*th html--------------------------------------------------------------------------------------------------*/
                    var htm = "<tr><th>No</th>";
                    //sort col and order
                    var arry1 = _defaultProperties.sortCol.split(",");
                    for (var s in _defaultProperties.Th) {
                        //欄位名稱及對應欄位
                        var array = _defaultProperties.Th[s].split(":");
                        if (array[0] !== "") {
                            htm += '<th class="sort" title="' + array[1] + '" >' + array[0] + '<img class="';
                            if ($.inArray(array[1] + ":asc", arry1) > -1) {
                                htm += 'sort_asc';
                            } else if ($.inArray(array[1] + ":desc", arry1) > -1) {
                                htm += 'sort_desc';
                            } else {
                                htm += 'sort';
                            }
                            htm += '"/></th>';
                        } else {
                            htm += '<th>' + array[0] + "</th>";
                        }
                    }
                    htm += "</tr>";
                    //append to NTable
                    $('#' + me.attr("id")).append(htm);
                    /*end th html--------------------------------------------------------------------------------------------------*/

                    /*column sort event-------------------------------------------------------------------------------------------*/
                    $('#' + me.attr("id")).find("th[title]").each(function () {
                        //th click
                        $(this).click(function () {
                            if ($(this).find("img").hasClass("sort") || $(this).find("img").hasClass("sort_desc")) {
                                $(this).find("img").attr('class', 'sort_asc');
                                _defaultProperties.sortCol = $(this).attr("title") + ":asc";
                                //回到第一頁
                                _defaultProperties.currentPage = 1;
                            } else if ($(this).find("img").hasClass("sort_asc")) {
                                $(this).find("img").attr('class', 'sort_desc');
                                _defaultProperties.sortCol = $(this).attr("title") + ":desc";
                                //回到第一頁
                                _defaultProperties.currentPage = 1;
                            }
                            _defaultProperties.searchFunc();
                        });
                    })
                    /*end column sort event-------------------------------------------------------------------------------------------*/
                } else {
                    $('#' + objAry[me.attr("id")].NpagesID).html("0");
                    $('#' + objAry[me.attr("id")].NnowRecordsID).html("");
                    $('#' + objAry[me.attr("id")].NtotalRecordsID).html("no record");
                }
                /* 分頁 -------------------------------------------------------------------------------------------------------------*/
                //next page
                $('#' + objAry[me.attr("id")].NseekNextID).click(function () {
                    //目前頁<總頁數
                    if (_defaultProperties.currentPage < Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows)) {
                        _defaultProperties.currentPage = _defaultProperties.currentPage + 1;

                        _defaultProperties.searchFunc();
                    }
                });
                //previous page
                $('#' + objAry[me.attr("id")].NseekPrevID).click(function () {
                    //頁數大於一才作動
                    if (_defaultProperties.currentPage > 1) {
                        _defaultProperties.currentPage = _defaultProperties.currentPage - 1;

                        _defaultProperties.searchFunc();
                    }
                });
                //first page
                $('#' + objAry[me.attr("id")].NseekFirstID).click(function () {
                    if (_defaultProperties.currentPage > 1) {
                        _defaultProperties.currentPage = 1;

                        _defaultProperties.searchFunc();
                    }
                });
                //last page
                $('#' + objAry[me.attr("id")].NseekLastID).click(function () {
                    //目前頁<總頁數
                    if (_defaultProperties.currentPage < Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows)) {
                        _defaultProperties.currentPage = Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows);

                        _defaultProperties.searchFunc();
                    }
                });
                //每頁筆數enter event
                $('#' + objAry[me.attr("id")].NrowNumID).keyup(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        if ($(this).val() !== '') {
                            var patrn = /^\+?([1-9]|[1-9][0-9]|[1-9][0-9][0-9])*$/;
                            if (patrn.exec($(this).val())) {
                                if (parseInt($(this).val()) < _defaultProperties.totalRecords) {
                                    _defaultProperties.rows = parseInt($(this).val());
                                } else {
                                    _defaultProperties.rows = _defaultProperties.totalRecords;
                                    $(this).val(_defaultProperties.totalRecords);
                                }
                                _defaultProperties.currentPage = 1;

                                _defaultProperties.searchFunc();
                            } else {
                                $('#' + objAry[me.attr("id")].NrowNumID).val(_defaultProperties.rows);
                            }
                        }
                    }
                });
                //目前頁enter event
                $('#' + objAry[me.attr("id")].NcurrentPageID).keyup(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        if ($(this).val() !== '') {
                            var patrn = /^\+?([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])*$/;
                            if (patrn.exec($(this).val())) {
                                if (parseInt($(this).val()) < Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows)) {
                                    _defaultProperties.currentPage = parseInt($(this).val());
                                } else {
                                    _defaultProperties.currentPage = Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows);
                                }
                                _defaultProperties.searchFunc();
                            } else {
                                $('#' + objAry[me.attr("id")].NcurrentPageID).val(_defaultProperties.currentPage);
                            }
                        }

                    }
                });
                /*end 分頁 -------------------------------------------------------------------------------------------------------------*/
                /*pull to pager--------------------------------------------------------------------------------------------------------*/
                var startTop = 0;
                var stopTop = 0;
                var pullPosition = "";
                $('#' + me.attr("id")).mousedown(function (e) {
                    //console.log(e.pageY);
                    startTop = e.pageY;
                });
                $('#' + me.attr("id")).mouseup(function (e) {
                    //console.log(e.pageY);
                    stopTop = e.pageY;
                    if (stopTop - startTop > 0) {
                        pullPosition = "down";
                    } else {
                        pullPosition = "up";
                    }
                });
                $('#' + me.attr("id")).draggable({
                    //只能上下拉
                    axis: "y",
                    //drag後返回原位
                    revert: function (event, ui) {
                        $(this).data("uiDraggable").originalPosition = {
                            top: 0,
                            left: 0
                        };
                        // return boolean
                        return !event;
                    },
                    stop: function () {
                        //console.log(pullPosition);
                        //下一頁
                        if (pullPosition === "up") {
                            //目前頁<總頁數
                            if (_defaultProperties.currentPage < Math.ceil(_defaultProperties.totalRecords / _defaultProperties.rows)) {
                                _defaultProperties.currentPage = _defaultProperties.currentPage + 1;

                                _defaultProperties.searchFunc();
                            }
                        } else {//上一頁
                            //頁數大於一才作動
                            if (_defaultProperties.currentPage > 1) {
                                _defaultProperties.currentPage = _defaultProperties.currentPage - 1;

                                _defaultProperties.searchFunc();
                            }
                        }
                    }
                });
                /*end pull to pager--------------------------------------------------------------------------------------------------------*/
            });

        },
        //sort column
        sortCol: function () {
            return _defaultProperties.sortCol;
        },
        //目前頁檢視筆數第一筆row NO
        currentRow: function () {
            return _defaultProperties.currentRow;
        },
        //略過幾筆
        skip: function () {
            return ((_defaultProperties.currentPage - 1) * (_defaultProperties.rows));
        },
        //一頁筆數
        limit: function () {
            _defaultProperties.rows = parseInt($('#' + objAry[$(this).attr("id")].NrowNumID).val());
            //console.log(_defaultProperties.rows);
            return (_defaultProperties.rows);
        }
    };

    $.fn.NTable = function (method) {
        // Method calling and initialization logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);