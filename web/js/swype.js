
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

var dragging = false;
var windowWidth = $(window).width();
var slideThreshold = 100;
var startX = 0;
var curX = 0;
var startTouchTime = 0;
var eachElement = $('#swyper .swype-panel:first-child').outerWidth(true);
var currentSlide = 0;
var currentPosition = 0;
var newPosition = 0;
var noElement = 5;
var totalWidth = noElement*eachElement;
var maxWidth = 500;
var outerMargin = 20;
var maxSlideLeft = -totalWidth-eachElement;
var maxSlideRight = 0;
var slideThreshold = eachElement/2;

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
                    startX = e.touches[0].pageX;
                    startTouchTime = Number(new Date());
                }
            });
            $('#swyper').on('touchstop', function(event){
                var e = event.originalEvent;
                if(dragging)
                {
                    dragging = false;

                    //slide into place
                    var posX = event.pageX;
                    if(posX < slideThreshold)
                    {
                        //slide to next if exist, if not slide back
                    }else if(posX > windowWidth-slideThreshold)
                    {
                        //slide to previous if exist, if not slide back
                    }else
                    {
                        //slide back
                    }

                }

            });
            $('#swyper').on('touchmove', function(event){
                event.preventDefault();
                var e = event.originalEvent;
                if(dragging)
                {
                    //drag the swype-body
                    curX = curX-(startX-e.touches[0].pageX);
                    $('#swyper').css(transformEventName, 'translate('+curX+'px, 0px)');
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
                    var leftSlide = (event.pageX>startX);
                    var rightSlide = (event.pageX<startX);
                    var fastOne = (mouseDistanceAbs>100 && touchTime<500);
                    var bigOne = (mouseDistanceAbs>slideThreshold);
                    //was it a swype?
                    var toSlide = currentSlide;
                    if(rightSlide && (fastOne || bigOne) && toSlide<noElement-1)
                    {
                        toSlide = Math.abs(Math.floor(currentPosition/eachElement));                        
                    }else if(leftSlide && (fastOne || bigOne) && toSlide>0)
                    {
                        toSlide = Math.abs(Math.ceil(currentPosition/eachElement));                        
                    }
                    slide(toSlide);                        
                }
            });
            $('#swyper').on('mousemove', function(event){
                event.preventDefault();
                if(dragging)
                {
                    var mouseDistance = event.pageX-startX;
                    newPosition = mouseDistance+currentPosition;
                    //$("#debug").val( "mouseDistance: "+ mouseDistance+" currentPosition: "+currentPosition+" newPosition: "+newPosition+"\n"+ $("#debug").val());
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
    currentPosition = -index*eachElement;
    $('#swyper').css(transformEventName, 'translateX('+currentPosition+'px)');
    $('#swyper').css(transitionDurationName, '0.8s');
}
function resize()
{
    var goodWidth = (maxWidth < 1 || $(document).width() < maxWidth) ? $(document).width() : maxWidth;
    var goodMargin = (($(document).width()-goodWidth)/2);
    //resize
    $('#swyper .swype-panel').each(function() {
        $(this).css('width', goodWidth);
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
    $('#swyper').css('width', totalWidth);
    slide(currentSlide);
}