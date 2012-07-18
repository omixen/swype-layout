//css3 transformations
var transformEventNames = {
    'WebkitTransform' : '-webkit-transform',
    'MozTransform'    : '-moz-transform',
    'OTransform'      : '-o-transform',
    'MsTransform'     : '-ms-transform',
    'Transform'     : 'transform'
},
transformEventName = transformEventNames[ Modernizr.prefixed('transform') ];
var transitionDurationNames = {
    'WebkitTransition-duration' : '-webkit-transition-duration',
    'MozTransition-duration'    : '-moz-transition-duration',
    'OTransition-duration'      : '-o-transition-duration',
    'MsTransition-duration'     : '-ms-transition-duration',
    'Transition-duration'     : 'transition-duration'
},
transitionDurationName = transitionDurationNames[ Modernizr.prefixed('transition-duration') ];
//helpers
var startX = 0;
var startTouchTime = 0;
var dragging = false;
var currentSlide = 0;
var currentPosition = 0;
var newPosition = 0;
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
                if(!dragging && e.touches.length)
                {
                    dragging = true;
                    startX = getTouchX(e);
                    startTouchTime = Number(new Date());
                }
            });
            $('#swyper').on('touchend', function(event){
                var e = event.originalEvent;
                if(dragging && e.touches.length)
                {
                    dragging = false;
                    currentPosition = newPosition;
                    var touchTime = Number(new Date())-startTouchTime;
                    var mouseDistanceAbs = Math.abs(getTouchX(e)-startX);
                    var rightSlide = (getTouchX(e)>startX);
                    var leftSlide = (getTouchX(e)<startX);
                    var fastOne = (mouseDistanceAbs>fastDistance && touchTime<fastTime);
                    var bigOne = (mouseDistanceAbs>bigThreshold);
                    //was it a swype?
                    var toSlide = currentSlide;
                    if(leftSlide && (fastOne || bigOne) && toSlide<noElement-1)
                    {
                        toSlide++
                    }else if(rightSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide--;
                    }
                    var which = leftSlide ? 'left' : (rightSlide ? 'right' : 'none');
                    slide(toSlide);
                }
            });
            $('#swyper').on('touchmove', function(event){
                var e = event.originalEvent;
                e.preventDefault();
                if(dragging && e.touches.length)
                {
                    var mouseDistance = getTouchX(e)-startX;
                    newPosition = mouseDistance+currentPosition;
                    if(newPosition>maxSlideLeft && newPosition<maxSlideRight)
                    {
                        $('#swyper').css(transitionDurationName, '0s');
                        $('#swyper').css(transformEventName, 'translateX('+newPosition+'px)');
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
                    var mouseDistanceAbs = Math.abs(event.pageX-startX);
                    var rightSlide = (event.pageX>startX);
                    var leftSlide = (event.pageX<startX);
                    var fastOne = (mouseDistanceAbs>fastDistance && touchTime<fastTime);
                    var bigOne = (mouseDistanceAbs>bigThreshold);
                    //was it a swype?
                    var toSlide = currentSlide;
                    if(leftSlide && (fastOne || bigOne) && toSlide<noElement-1)
                    {
                        toSlide++
                    }else if(rightSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide--;
                    }
                    var which = leftSlide ? 'left' : (rightSlide ? 'right' : 'none');
                    slide(toSlide);
                }
            });
            $('#swyper').on('mousemove', function(event){
                event.preventDefault();
                if(dragging)
                {
                    var mouseDistance = event.pageX-startX;
                    newPosition = mouseDistance+currentPosition;
                    if(newPosition>maxSlideLeft && newPosition<maxSlideRight)
                    {
                        $('#swyper').css(transitionDurationName, '0s');
                        $('#swyper').css(transformEventName, 'translateX('+newPosition+'px)');
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
    $('#swyper').css(transitionDurationName, '0.8s');
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
    slideThreshold = eachElement/4;
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