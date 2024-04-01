/*
version : 1.1
author: Kevin Gaddy
*/
(function ($) {
    $.MoverBoxes = function (element, options) {
        "use strict";
        // default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {
            size: 20
        };
        var Moverhtml = function (dataleft, dataright, leftLabel, rightLabel, putP, callback) {
            //main toobar div.
            var moverDIV = document.createElement("div");
            $(moverDIV).addClass('mover-div');

            //table
            var movertable = document.createElement("table");
            var moverTableTbody = document.createElement("tbody");
            movertable.appendChild(moverTableTbody);

            var tableTR = document.createElement("tr");
            var tableTDOne = document.createElement("td");
            if (leftLabel) {

                var leftSpan = document.createElement("span");
                $(leftSpan).addClass("MoverBox-label");
                $(leftSpan).addClass("leftBox-label");
                $(leftSpan).html(leftLabel);
                tableTDOne.appendChild(leftSpan);
            }
            var tableTDSelect = document.createElement("select");
            $(tableTDSelect).attr("id", "selectorOne");
            $(tableTDSelect).attr("name", "selector");
            $(tableTDSelect).addClass("MoverBoxLeft");
            $(tableTDSelect).addClass("MoverBox");
            $(tableTDSelect).attr("multiple", "multiple");
            $(tableTDSelect).attr("size", options.size);

            //add dataleft
            if (options.dataleft != null) {
                for (var i = 0, len = options.dataleft.length; i < len; ++i) {
                    var dataObj = options.dataleft[i].split(',');
                    var optionEl = document.createElement("option");
                    $(optionEl).attr("value", dataObj[0]);
                    $(optionEl).attr("id", "optId_" + dataObj[0]);
                    $(optionEl).html(dataObj[1]);
                    tableTDSelect.appendChild(optionEl);
                }
            }
            tableTDOne.appendChild(tableTDSelect);
            tableTR.appendChild(tableTDOne);
            var tableTDTwo = document.createElement("td");
            $(tableTDTwo).attr("align", "center");
            $(tableTDTwo).addClass('buttonTD');
            $(tableTDTwo).attr("valign", "middle");
            //input buttons
            var input = document.createElement("input");
            $(input).attr("type", "button");
            $(input).attr("value", ">");
            $(input).addClass("btn btn-small");
            $(input).attr("id", "moveRight");
            var br = document.createElement("br");
            tableTDTwo.appendChild(input);
            tableTDTwo.appendChild(br);

            var inputTwo = document.createElement("input");
            $(inputTwo).attr("type", "button");
            $(inputTwo).attr("value", "<");
            $(inputTwo).addClass("btn btn-small");
            $(inputTwo).attr('id', 'moveLeft');
            tableTDTwo.appendChild(inputTwo);
            tableTR.appendChild(tableTDTwo);


            var brAllOne = document.createElement("br");
            tableTDTwo.appendChild(brAllOne);
            var inputTwoAll = document.createElement("input");
            $(inputTwoAll).attr("type", "button");
            $(inputTwoAll).attr("value", "<<");
            $(inputTwoAll).addClass("btn btn-small");
            $(inputTwoAll).attr('id', 'moveLeftAll');
            tableTDTwo.appendChild(inputTwoAll);


            var brAllTwp = document.createElement("br");
            tableTDTwo.appendChild(brAllTwp);
            var inputThreeAll = document.createElement("input");
            $(inputThreeAll).attr("type", "button");
            $(inputThreeAll).attr("value", ">>");
            $(inputThreeAll).addClass("btn btn-small");
            $(inputThreeAll).attr('id', 'moveRightAll');
            tableTDTwo.appendChild(inputThreeAll);

            var tableTDThree = document.createElement("td");
            if (rightLabel) {
                var rightSpan = document.createElement("span");
                $(rightSpan).addClass("MoverBox-label");
                $(rightSpan).addClass("rightBox-label");
                $(rightSpan).html(rightLabel);
                tableTDThree.appendChild(rightSpan);
            }
            var tableTDSelectTwo = document.createElement("select");
            $(tableTDSelectTwo).attr("id", "selectorTwo");
            $(tableTDSelectTwo).addClass("MoverBoxRight");
            $(tableTDSelectTwo).addClass("MoverBox");
            $(tableTDSelectTwo).attr("name", "selector");
            $(tableTDSelectTwo).attr("multiple", "multiple");
            $(tableTDSelectTwo).attr("size", options.size);

            //add dataright
            if (options.dataright != null) {
                for (var i = 0, lenR = options.dataright.length; i < lenR; ++i) {
                    var dataObjR = options.dataright[i].split(',');
                    var optionEl2 = document.createElement("option");
                    $(optionEl2).attr("value", dataObjR[0]);
                    $(optionEl2).attr("id", "optId_" + dataObjR[0]);
                    $(optionEl2).html(dataObjR[1]);
                    tableTDSelectTwo.appendChild(optionEl2);
                }
            }
            tableTDThree.appendChild(tableTDSelectTwo);
            tableTR.appendChild(tableTDThree);
            moverTableTbody.appendChild(tableTR);
            movertable.appendChild(moverTableTbody);
            moverDIV.appendChild(movertable);


            if (options.putP == true) {
                var tableTRPutP = document.createElement("tr");
                var tableTDPutP = document.createElement("td");
                $(tableTDPutP).attr("id", "inputP");
                $(tableTDPutP).attr('colspan', 3);

                tableTRPutP.appendChild(tableTDPutP);
                moverTableTbody.appendChild(tableTRPutP);          
            }


            if (callback !== undefined) {
                callback();
            }
            this.Moverhtml = moverDIV;
        };
        // to avoid confusions, use "plugin" to reference the current instance of the object
        var plugin = this;
        var count = 0;
        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('pluginName').settings.propertyName from outside the plugin, where "element" is the
        // element the plugin is attached to;
        plugin.settings = {};
        var $element = $(element);   // reference to the jQuery version of DOM element the plugin is attached to
        // the "constructor" method that gets called when the object is created
        plugin.init = function () {
            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
            var callBack;
            if (options.callback !== undefined) {
                callBack = options.callback;
            }
            var myMoverBox = new Moverhtml(options.dataleft, options.dataright, options.leftLabel, options.rightLabel, options.putP, callBack); 
            //add to dom
            $(element).html(myMoverBox.Moverhtml);
            
            $('#moveLeft').click(function () {
                moveLeftToright();
            });
            $('#moveRight').click(function () {
                moveRightToleft();
            });
            $('#moveRightAll').click(function () {
                movAllRightToleft();
            });
            $('#moveLeftAll').click(function () {
                moveAllLeftToRight();
            });
            countValue();
            initInput();
            /*
            $('#moveLeft').live('click', function () {
                moveLeftToright();
            });
            $('#moveRight').live('click', function () {
                moveRightToleft();
            });
            $('#moveRightAll').live('click', function () {
                movAllRightToleft();
            });
            $('#moveLeftAll').live('click', function () {
                moveAllLeftToRight();
            });
            */
        };
        //function to reset values
        plugin.resetValues = function (dataLeft, dataRight, dataOther) {
            options.dataleft = dataLeft;
            options.dataright = dataRight;
            options.dataOther = dataOther;
            plugin.init();
        };
        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
        // is the element the plugin is attached to;
        // a public method. for demonstration purposes only - remove it!
        plugin.ShowDialog = function () {
            $('#selectorOne').on('dblclick', 'option', function () {
                ShowDetialInformation($(this).attr('value'));
            });
            $('#selectorTwo').on('dblclick', 'option', function (e) {
                ShowDetialInformation($(this).attr('value'));
            });

        };
        plugin.SelectedValues = function () {
            var values = [];
            $('#selectorTwo option').each(function (index) {
                values.push($(this).attr('value'));
            });
            return values;
        };
        plugin.NotSelectedValues = function () {
            var values = [];
            $('#selectorOne option').each(function (index) {
                values.push($(this).attr('value'));
            });
            return values;
        };
        var countValue = function () {
            count = 0;
            $('#selectorTwo option').each(function (index) {
                count++;
            });
        };
        var initInput = function () {
            $('#inputP').html('');
            for (var i = 0; i < count; i++) {
                var inputSpan = document.createElement("span");
                $(inputSpan).addClass("MoverBox-label");
                $(inputSpan).addClass("leftBox-label");
                $(inputSpan).html(GetResource('WEBResource', 'Interval') + GetResource('WEBResource', 'Minute') + (i + 1));
                $('#inputP').append(inputSpan);

                var inputValue = 0;
                if ((options.dataOther != null) && (options.dataOther[i] != null))
                    inputValue = options.dataOther[i];
                var inputP = document.createElement("input");
                $(inputP).attr("type", "text");
                $(inputP).attr("value", inputValue);
                $(inputP).addClass("btn btn-small");
                $(inputP).attr('subtype', 'inputP');
                $('#inputP').append(inputP);
            }
        };
        var moveAllLeftToRight = function () {
            $('#selectorTwo option').each(function (index) {
                $(this).remove();
                var that = $(this);
                $(that).removeClass('selected');
                $('#selectorOne').append(that);
            });
            countValue();
            initInput();
        };
        var movAllRightToleft = function () {
            $('#selectorOne option').each(function (index) {
                $(this).remove();
                var that = $(this);
                $(that).removeClass('selected');
                $('#selectorTwo').append(that);
            });
            countValue();
            initInput();
        };
        var moveLeftToright = function () {
            $('#selectorTwo option').each(function (index) {
                if ($(this)[0].selected) {

                    $(this).remove();
                    var that = $(this);
                    $(that).removeClass('selected');
                    $('#selectorOne').append(that);
                }
            });
            countValue();
            initInput();
        };
        var moveRightToleft = function () {
            $('#selectorOne option').each(function (index) {
                if ($(this)[0].selected) {

                    $(this).remove();
                    var that = $(this);
                    $(that).removeClass('selected');
                    $('#selectorTwo').append(that);
                }
            });
            countValue();
            initInput();
        };
        // fire up the plugin!
        // call the "constructor" method
        plugin.init();
    };
    // add the plugin to the jQuery.fn object
    $.fn.MoverBoxes = function (options) {
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function () {
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('MoverBoxes')) {
                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.MoverBoxes(this, options);
                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('MoverBoxes', plugin);
            }
        });
    };
})(jQuery);