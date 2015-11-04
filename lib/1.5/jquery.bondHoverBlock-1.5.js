/*
 bondHoverBlock - jQuery plugin
 Author: Bondarenko Aleksey
 Homepage: http://www.alexbond.ru
 */
(function ($) {
    $.fn.bondHoverBlock = function (options) {
        var defaults = {
            topPosblock : 0, /*отступ блока от верхней кромки браузера*/
            topPosWindow : 0,  /*момент, в который будет скрываться блок и показываться*/
            isCopy : !0,
            showSpeed : 400,  /*время показа блока*/
            hideSpeed : 0,    /*время скрытия блока*/
            opacityMouseOver : !1,  /*реакция на курсор*/
            opacityFree: null,  /*прозрачность блока при инициализации*/
            opacityShow : null, /*прозрачность блока, когда курсор находится на блоке*/
            opacityHide : 0.4, /*прозрачность блока, когда курсор не находится на блоке*/
            opacityShowSpeed : 400,  /*время увеличения прозрачности блока при наведении курсора на блок*/
            opacityHideSpeed : 400,  /*время уменьшения прозрачности блока при отведении курсора с блока*/
            //showEasing:"linear",
            //hideEasing:"linear",
            toggleClass:"bondFix",
            wrapClass:"bondWrap"
        }
        var options = $.extend(defaults, options);
        options.effect = "linear";
        var this$ = this;
        var positionBlock = getOffset(this.get(0));
        var memory = {
            isFix:null
        };
        bindEvent();
        init();

        function init() {
            this$.data({"top":(this$.css("top") == "auto") ? "" : this$.css("top") });
            this$.data({"opacity": (this$.css("opacity")==1)? 1: this$.css("opacity") });
            if (options.opacityMouseOver) {
                if (options.opacityShow != null) {
                    this$.data({"opacity": options.opacityShow });
                }
                if ( this$.data("opacity") < options.opacityHide )
                    options.opacityHide = this$.data("opacity");
            }
            if (options.isCopy) {
                var wrapEl$ = $(document.createElement('div'));
                wrapEl$.css({
                    width:this$.outerWidth(true),
                    height:this$.outerHeight(true)
                });
                wrapEl$.addClass(options.wrapClass);
                this$.data({"wrap":wrapEl$ });
            }
            $(window).scroll(); /*програмный вызов события scroll*/
        }

        function bindEvent() {
            $(window).scroll(function (e) {
                var windowScrollTop = $(window).scrollTop();
                if (windowScrollTop - options.topPosWindow >= positionBlock.top - options.topPosblock) {
                    /* проскролили и надо показывать блок */
                    if (!memory.isFix) {
                        this$.css({opacity:0});
                        //this$.stop().animate({opacity:0}, 0, "linear");
                        this$.css({top:options.topPosblock});
                        this$.toggleClass(options.toggleClass);
                        memory.isFix = true;
                        var localOpacity = (options.opacityMouseOver) ? options.opacityHide : this$.data("opacity");
                        if (options.isCopy) {
                            this$.wrap(this$.data("wrap"));
                        }
                        this$.stop().animate({opacity:localOpacity}, options.showSpeed, "linear");
                    }
                }
                else {
                    /* возвращаем все в исходное положение */
                    if (memory.isFix) {
                        memory.isFix = false;
                        this$.stop().animate({opacity:0}, options.hideSpeed, "linear", function () {
                            anyfunc();
                            //this$.stop().animate({opacity:this$.data("opacity")}, 0, "linear");
                            this$.css({opacity:this$.data("opacity")});
                            if (options.isCopy) {
                                this$.unwrap();
                            }
                        });
                    }
                }
                function anyfunc(){
                    this$.toggleClass(options.toggleClass);
                    this$.css({top:this$.data("top") });

                }
            });
            if (options.opacityMouseOver) {
                this$.mouseenter(function (e) {
                    if (memory.isFix) {
                        this$.stop().animate({opacity:this$.data("opacity")}, options.opacityShowSpeed, "linear");
                    }
                });
                this$.mouseleave(function (e) {
                    if (memory.isFix) {
                        this$.stop().animate({opacity:options.opacityHide }, options.opacityHideSpeed, "linear");
                    }
                });
            }
        }

        function getOffset(elem) {
            if (elem.getBoundingClientRect) {
                // "правильный" вариант
                return getOffsetRect(elem)
            } else {
                // пусть работает хоть как-то
                return getOffsetSum(elem)
            }
        }

        function getOffsetSum(elem/*,isMargin*/) {
            var top = 0, left = 0
            while (elem) {
                top = top + parseInt(elem.offsetTop)
                left = left + parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }
            return {top:top, left:left}
        }

        function getOffsetRect(elem) {
            // (1)
            var box = elem.getBoundingClientRect()

            // (2)
            var body = document.body
            var docElem = document.documentElement

            // (3)
            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

            // (4)
            var clientTop = docElem.clientTop || body.clientTop || 0
            var clientLeft = docElem.clientLeft || body.clientLeft || 0

            // (5)
            var top = box.top + scrollTop - clientTop
            var left = box.left + scrollLeft - clientLeft

            return { top:Math.round(top), left:Math.round(left) }
        }


    }
})(jQuery);
