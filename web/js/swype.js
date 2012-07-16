(function($) {
    var dragging = false;
    var windowWidth = $(window).width();
    var slideThreshold = 100;
    var current = 0;
    var startX = 0;
    //no need to use pageinit here, we are not using any ajax request
    $(document).ready(function() {
        //dragging of swype-body within swype-container
        if(Modernizr.touch)
        {
            $('#swyper').on('touchstart', function(event){
                var e = event.originalEvent;
                if(!dragging && e.touches.length == 1)
                {
                    dragging = true;
                    startX = e.touches[0].pageX;
                    lastBodyPosition = $('#swyper').position().left;
                }
            });
            $('#swyper').on('touchstop', function(event){
                var e = event.originalEvent;
                if(dragging)
                {
                    dragging = false;
                     /*
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
                    */
                }

            });
            $('#swyper').on('touchmove', function(event){
                event.preventDefault();
                var e = event.originalEvent;
                if(dragging)
                {
                    //drag the swype-body
                    var distance = e.touches[0].pageX - startX;
                    $('#swyper').css('-webkit-transform', 'translate('+distance+'px, 0px)');
                }
            });
        }else
        {
            //show next and prev button

            //bind click event
        }
    });
})(jQuery);