/*
 bondHoverBlock - jQuery plugin
 Author: Bondarenko Aleksey
 Homepage: http://www.alexbond.ru
 */
(function ($) {
    $.fn.bondHoverBlock = function (options) {
        /*var constants = {
         fade : {fast:"fast", normal:"normal", slow:"slow"},
         direct:{next:"next",prev:"prev"}
         }*/
        var defaults = {
            topPosblock : 0,
            topPosWindow : 0,
            isCopy : !0,
            showSpeed : 400,
            hideSpeed : 0,
            opacityMouseOver : !1,
            opacityShow : null,
            opacityHide : 0.4,
            opacityShowSpeed : 400,
            opacityHideSpeed : 400,
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
            //effectShow: (jQuery.easing[options.showEasing] == null) ? "linear" : options.showEasing,
            //effectHide: (jQuery.easing[options.hideEasing] == null) ? "linear" : options.hideEasing
        };
        init();
        bindEvent();

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
                //this$.data({"opacity": (this$.css("opacity")==1)? "": this$.css("opacity") });
                var wrapEl$ = $(document.createElement('div'));
                wrapEl$.css({
                    width:this$.outerWidth(true),
                    height:this$.outerHeight(true)
                });
                wrapEl$.addClass(options.wrapClass);
                this$.data({"wrap":wrapEl$ });
            }
        }

        function bindEvent() {
            $(window).scroll(function (e) {
                var windowScrollTop = $(window).scrollTop();
                if (windowScrollTop - options.topPosWindow >= positionBlock.top - options.topPosblock) {
                    if (!memory.isFix) {
                        this$.css({opacity:0});
                        this$.css({top:options.topPosblock});
                        this$.toggleClass(options.toggleClass);
                        memory.isFix = true;
                        if (options.isCopy) {
                            this$.wrap(this$.data("wrap"));
                            var localOpacity = null;
                            localOpacity = (options.opacityMouseOver) ? options.opacityHide : this$.data("opacity");
                            this$.stop().animate({opacity:localOpacity}, options.showSpeed, memory.effect);
                        }
                        else {
                            this$.css({opacity:this$.data("opacity")});
                        }
                    }
                }
                else {
                    if (memory.isFix) {
                        memory.isFix = false;
                        if (options.isCopy) {
                            this$.stop().animate({opacity:0}, options.hideSpeed, memory.effect, function () {
                                anyfunc();
                                this$.css({opacity:this$.data("opacity")});
                                this$.unwrap();
                            });
                        }
                        else
                            anyfunc();

                    }
                }
                function anyfunc(){
                    this$.toggleClass(options.toggleClass);
                    this$.css({top:this$.data("top") });
                }
            });
            if (options.opacityMouseOver) {
                this$.mouseenter(function (e) {
                    this$.stop().animate({opacity:this$.data("opacity")}, options.opacityShowSpeed, memory.effect);
                });
                this$.mouseleave(function (e) {
                    this$.stop().animate({opacity:options.opacityHide }, options.opacityHideSpeed, memory.effect);
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
            /*if (isMargin){
                top = top - (elem.outerHeight(true)-elem.height())/2 //!!!Opsss;
                left = left - (elem.outerWidth(true)-elem.width())/2;
            }*/
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
