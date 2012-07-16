
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
var leftPadding = 450;
var eachElement = $('#swyper .swype-panel:first-child').outerWidth(true);
var currentSlide = 0;
var noElement = 3;
var totalWidth = noElement*eachElement;

(function($) {
    //no need to use pageinit here, we are not using any ajax request
    $(document).ready(function() {
        //initiate widths and x-positions of the panel
        resize();
        $(window).on('resize', function(e)
        {
            resize();
        });
        /*
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
                }
            });
            $('#swyper').on('mousemove', function(event){
                event.preventDefault();
                if(dragging)
                {
                    distance = event.pageX-startX;
                    curX = (distance)/(Math.abs(distance)/eachElement+1);
                    $('#swyper').css(transformEventName, 'translateX('+(leftPadding+curX-2*eachElement)+'px)');
                }
            });
        }*/
    });
})(jQuery)

function slide(index)
{
    $('#swyper').css(transformEventName, 'translateX('+(-index*eachElement)+'px)');
    $('#swyper').css(transitionDurationName, '0.8s');
    currentSlide = index;
}
function resize()
{
    $('#swyper .swype-panel').each(function() {
        $(this).css('width', $(document).width()-40);
    });
    eachElement = $('#swyper .swype-panel:first-child').outerWidth(true);
    slide(currentSlide);
}