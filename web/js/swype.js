(function($) {
    var dragging = false;
    var windowWidth = $(window).width();
    var slideThreshold = 100;
    var current = 0;
    var lastBodyPosition = 0;
    var lastMousePosition = 0;
    //init
    $(document).ready(function() {

    });
    //dragging of swype-body within swype-container
    if(Modernizr.touch)
    {
        $("#swyper").live('touchstart', function(event){
            if(!dragging)
            {
                dragging = true;
                lastMousePosition = event.pageX;
                lastBodyPosition = $(this).position().left;
            }
        });
        $("#swyper").live('touchstop', function(event){
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
        $("#swyper").live('touchmove', function(event){
            if(dragging)
            {
                //drag the swype-body
                var distance = event.pageX - lastMousePosition;
                $(this).css("left", (lastBodyPosition+distance));
            }
            event.preventDefault();
        });
    }else
    {
        //show next and prev button

        //bind click event
    }

})(jQuery);