//css3 transformations
var transformEventNames = {
    'WebkitTransform' : '-webkit-transform',
    'MozTransform'    : '-moz-transform',
    'OTransform'      : '-o-transform',
    'MsTransform'     : '-ms-transform',
    'Transform'     : 'transform'
},
transformEventName = transformEventNames[ Modernizr.prefixed('transform') ];
var transitionNames = {
    'WebkitTransition' : '-webkit-transition',
    'OTransition'      : '-o-transition',
    'MozTransition'    : '-moz-transition',
    'MsTransition'     : '-ms-transition',
    'Transition'     : 'transition'
},
transitionName = transitionNames[ Modernizr.prefixed('transition') ];
//helpers
var startX = 0;
var startTouchTime = 0;
var dragging = false;
var currentSlide = 0;
var currentPosition = 0;
var newPosition = 0;
var touchDistance = 0;
//inits
var noElement = 5;
//to be recalculated
var eachElement = $('#swyper .swype-panel:first-child').outerWidth(true);
var totalWidth = noElement*eachElement;
var maxWidth = 500;
var outerMargin = 20;
var maxSlideLeft = -totalWidth-eachElement;
var maxSlideRight = 0;
//detector
var fastDistance = (Modernizr.touch) ? 50 : 100;
var fastTime = (Modernizr.touch) ? 500 : 500;
var bigThreshold = (Modernizr.touch) ? eachElement/4 : eachElement/2;

(function($) {
    //no need to use pageinit here, we are not using any ajax request
    $(document).ready(function() {
        //initiate widths and x-positions of the panel
        resize();
        $(window).on('resize', function(e)
        {
            resize();
        });
        
        //dragging of swype-body within swype-container
        if(Modernizr.touch)
        {
            $('#swyper').on('touchstart', function(event){
                var e = event.originalEvent;
                if(!dragging)
                {
                    dragging = true;
                    startX = getTouchX(e);
                    startTouchTime = Number(new Date());
                }
            });
            $('#swyper').on('touchend', function(event){
                var e = event.originalEvent;
                if(dragging)
                {
                    dragging = false;
                    currentPosition = newPosition;
                    var touchTime = Number(new Date())-startTouchTime;
                    var touchDistanceAbs = Math.abs(touchDistance);
                    var rightSlide = touchDistance>0;
                    var leftSlide = touchDistance<0;
                    var fastOne = (touchDistanceAbs>fastDistance && touchTime<fastTime);
                    var bigOne = (touchDistanceAbs>bigThreshold);
                    //was it a swype?
                    var toSlide = currentSlide;
                    if(leftSlide && (fastOne || bigOne) && toSlide<noElement-1)
                    {
                        toSlide++
                    }else if(rightSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide--;
                    }
                    slide(toSlide);
                }
            });
            $('#swyper').on('touchmove', function(event){
                var e = event.originalEvent;
                e.preventDefault();
                if(dragging)
                {
                    touchDistance = getTouchX(e)-startX;
                    newPosition = touchDistance+currentPosition;
                    if(newPosition>maxSlideLeft && newPosition<maxSlideRight)
                    {
                        $('#swyper').css(transitionName, 'all 0s linear');
                        if(Modernizr.csstransforms3d)
                        {
                            $('#swyper').css(transformEventName, 'translate3d('+newPosition+'px,0,0)');
                        }else
                        {
                            $('#swyper').css(transformEventName, 'translateX('+newPosition+'px)');
                        }
                        //was it too much already?
                    }
                }
            });
        }else
        {
            //show next and prev button

            //bind click event
            $('#swyper').on('mousedown', function(event){
                if(!dragging)
                {
                    dragging = true;
                    startX = event.pageX;
                    startTouchTime = Number(new Date());
                }
            });
            $('#swyper').on('mouseup', function(event){
                if(dragging)
                {
                    dragging = false;
                    currentPosition = newPosition;
                    var touchTime = Number(new Date())-startTouchTime;
                    var touchDistanceAbs = Math.abs(touchDistance);
                    var rightSlide = touchDistance>0;
                    var leftSlide = touchDistance<0;
                    var fastOne = (touchDistanceAbs>fastDistance && touchTime<fastTime);
                    var bigOne = (touchDistanceAbs>bigThreshold);
                    //was it a swype?
                    var toSlide = currentSlide;
                    if(leftSlide && (fastOne || bigOne) && toSlide<noElement-1)
                    {
                        toSlide++
                    }else if(rightSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide--;
                    }
                    slide(toSlide);
                }
            });
            $('#swyper').on('mousemove', function(event){
                event.preventDefault();
                if(dragging)
                {
                    touchDistance = event.pageX-startX;
                    newPosition = touchDistance+currentPosition;
                    if(newPosition>maxSlideLeft && newPosition<maxSlideRight)
                    {
                        $('#swyper').css(transitionName, 'all 0s linear');
                        if(Modernizr.csstransforms3d)
                        {
                            $('#swyper').css(transformEventName, 'translate3d('+newPosition+'px,0,0)');
                        }else
                        {
                            $('#swyper').css(transformEventName, 'translateX('+newPosition+'px)');
                        }
                        //was it too much already?                        
                    }
                }
            });
        }
    });
})(jQuery)

function slide(index)
{
    currentSlide = index;
    currentPosition = -((index*eachElement)+outerMargin);
    $('#swyper').css(transformEventName, 'translateX('+currentPosition+'px)');
    $('#swyper').css(transitionName, 'all 0.5s ease-in');
}
function resize()
{
    var goodWidth = (maxWidth < 1 || $(document).width() < maxWidth) ? $(document).width() : maxWidth;
    var goodMargin = (($(document).width()-goodWidth)/2);
    //resize
    $('#swyper .swype-panel').each(function() {
        $(this).css('width', goodWidth-20);
        $(this).css('margin-left', goodMargin);
        $(this).css('margin-right', goodMargin);
    });
    //recalculate
    eachElement = $('#swyper .swype-panel:first-child').outerWidth(true);
    outerMargin = $(document).width()/2;
    totalWidth = (2*outerMargin)+(noElement*eachElement);
    maxSlideLeft = -((totalWidth-eachElement)+outerMargin);
    maxSlideRight = outerMargin;
    bigThreshold = eachElement/4;
    //slide back
    $('#swyper').css({'width':totalWidth, 'padding-left':outerMargin, 'padding-right':outerMargin });
    slide(currentSlide);
}
function getTouchX(e)
{
    if(e.touches)
    {
        return e.touches[0].clientX;
    }else
    {
        return e.clientX;
    }
}