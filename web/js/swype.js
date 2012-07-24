


(function($) {

    var SwypeLayout = function(element, options)
    {
        //css3 transformations
        var transformEventNames = {
            'WebkitTransform'   : '-webkit-transform',
            'MozTransform'      : '-moz-transform',
            'OTransform'        : '-o-transform',
            'MsTransform'       : '-ms-transform',
            'Transform'         : 'transform'
        },
        transformEventName = transformEventNames[ Modernizr.prefixed('transform') ],
        transitionNames = {
            'WebkitTransition'  : '-webkit-transition',
            'OTransition'       : '-o-transition',
            'MozTransition'     : '-moz-transition',
            'MsTransition'      : '-ms-transition',
            'Transition'        : 'transition'
         },
        transitionName = transitionNames[ Modernizr.prefixed('transition') ],

        //calculated data
        data = {
            //helpers
            startX : 0,
            startTouchTime : 0,
            dragging : false,
            currentSlide : 0,
            currentPosition : 0,
            newPosition : 0,
            touchDistance : 0,
            //init
            noElement : 0,
            //to be recalculated
            eachElement : 0,
            totalWidth : 0,
            maxWidth : 500,
            outerMargin : 20,
            maxSlideLeft : 0,
            maxSlideRight : 0
        },

        // Create some defaults, extending them with any options that were provided
        settings = $.extend( {
            'selector'          : null,
            'enableWebSwype'    : true,
            'slideTime'         : 0.5,
            'slideEasing'       : 'ease-out',
            'fastDistance'      : (Modernizr.touch) ? 50 : 100,
            'fastTime'          : (Modernizr.touch) ? 500 : 500,
            'bigThreshold'      : (Modernizr.touch) ? data.eachElement/4 : data.eachElement/2
        }, options),

        //available methods and private methods
        methods = {
            init: function()
            {
                //set the id
                if(!settings.selector)
                {
                    settings.selector = '#'+element.attr('id');
                }
                data.noElement = $(settings.selector+' > div').length;
                methods.resize();
                $(window).on('resize', function(e)
                {
                    methods.resize();
                });

                return this.each(function() {
                    //dragging of swype-body within swype-container
                    if(Modernizr.touch)
                    {
                        $(document.body).on('touchstart', function(event){
                            var e = event.originalEvent;
                            methods._startDrag(e);
                        });
                        $(document.body).on('touchend', function(event){
                            var e = event.originalEvent;
                            methods._stopDrag(e);
                        });
                        $(document.body).on('touchmove', function(event){
                            var e = event.originalEvent;
                            e.preventDefault();
                            methods._onDrag(e);
                        });
                    }else
                    {
                        //show next and prev button

                        //bind click event
                        if(settings.enableWebSwype)
                        {
                            $(document.body).on('mousedown', function(event){
                                methods._startDrag(event);
                            });
                            $(document.body).on('mouseup', function(event){
                                methods._stopDrag(event);
                            });
                            $(document.body).on('mousemove', function(event){
                                event.preventDefault();
                                methods._onDrag(event);
                            });
                        }
                    }
                });
            },
            slide: function(index)
            {
                data.currentSlide = index;
                data.currentPosition = -((index*data.eachElement)+data.outerMargin);
                $(settings.selector).css(transformEventName, 'translateX('+data.currentPosition+'px)');
                $(settings.selector).css(transitionName, 'all '+settings.slideTime+'s '+settings.slideEasing);
            },
            resize : function()
            {
                var goodWidth = (data.maxWidth < 1 || $(document).width() < data.maxWidth) ? $(document).width() : data.maxWidth;
                var goodMargin = (($(document).width()-goodWidth)/2);
                //resize
                $(settings.selector+' > div').each(function() {
                    $(this).css('width', goodWidth-20);
                    $(this).css('margin-left', goodMargin);
                    $(this).css('margin-right', goodMargin);
                });
                //recalculate
                data.eachElement = $(settings.selector+' > div:first-child').outerWidth(true);
                data.outerMargin = $(document).width()/2;
                data.totalWidth = (2*data.outerMargin)+(data.noElement*data.eachElement);
                data.maxSlideLeft = -((data.totalWidth-data.eachElement)+data.outerMargin);
                data.maxSlideRight = data.outerMargin;
                settings.bigThreshold = data.eachElement/4;
                //slide back
                $(settings.selector).css({'width':data.totalWidth, 'padding-left':data.outerMargin, 'padding-right':data.outerMargin });
                methods.slide(data.currentSlide);
            },
            _getTouchX : function(e)
            {
                if(Modernizr.touch)
                {
                    if(e.touches)
                    {
                        return e.touches[0].clientX;
                    }else
                    {
                        return e.clientX;
                    }
                }else
                {
                    return e.pageX;
                }
            },
            _startDrag: function(e)
            {
                if(!data.dragging)
                {
                    data.dragging = true;
                    data.startX = methods._getTouchX(e);
                    data.startTouchTime = Number(new Date());
                }
            },
            _stopDrag: function(e)
            {
                if(data.dragging)
                {
                    data.dragging = false;
                    data.currentPosition = data.newPosition;
                    var touchTime = Number(new Date())-data.startTouchTime;
                    var touchDistanceAbs = Math.abs(data.touchDistance);
                    var rightSlide = data.touchDistance>0;
                    var leftSlide = data.touchDistance<0;
                    var fastOne = (touchDistanceAbs>settings.fastDistance && touchTime<settings.fastTime);
                    var bigOne = (touchDistanceAbs>settings.bigThreshold);
                    //was it a swype?
                    var toSlide = data.currentSlide;
                    if(leftSlide && (fastOne || bigOne) && toSlide<data.noElement-1)
                    {
                        toSlide++
                    }else if(rightSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide--;
                    }
                    methods.slide(toSlide);
                }
            },
            _onDrag: function(e)
            {
                if(data.dragging)
                {
                    data.touchDistance = methods._getTouchX(e)-data.startX;
                    data.newPosition = data.touchDistance+data.currentPosition;
                    if(data.newPosition>data.maxSlideLeft && data.newPosition<data.maxSlideRight)
                    {
                        $(settings.selector).css(transitionName, 'all 0s linear');
                        if(Modernizr.csstransforms3d)
                        {
                            $(settings.selector).css(transformEventName, 'translate3d('+data.newPosition+'px,0,0)');
                        }else
                        {
                            $(settings.selector).css(transformEventName, 'translateX('+data.newPosition+'px)');
                        }
                    }
                }
            }
        };
        //so that we can call the methods like instance[method]
        return methods;
    }

    $.fn.swype = function( options ) {
        var element = this,
            instance = element.data('swype');

        if ( instance && instance[options] ) {
            instance[options].apply( this, Array.prototype.slice.call( arguments, 1 ));
            return element;
        } else if ( typeof options === 'object' || ! options ) {
            //already exists
            if(instance) return;
            //create a new one
            var swypeInstance = new SwypeLayout(element, options);
            element.data('swype', swypeInstance);
            return swypeInstance.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery.swype' );
        }
    };
})(jQuery)


$(document).ready(function() {
    $('#swyper').swype();
});