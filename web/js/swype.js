(function($) {
    var dragging = false;
    var windowWidth = $(window).width();
    var slideThreshold = 100;
    var current = 0;
    var lastBodyPosition = 0;
    var lastMousePosition = 0;
    //no need to use pageinit here, we are not using any ajax request
    $(document).ready(function() {
        //dragging of swype-body within swype-container
        if(Modernizr.touch)
        {
            $('#swyper').on('touchstart', function(event){
                alert(dragging+ " " +event.touches.length+ " "+event.touches[0].x+$('#swyper').position().left);
                if(!dragging && event.touches.length == 1)
                {
                    dragging = true;
                    lastMousePosition = event.touches[0].x;
                    lastBodyPosition = $('#swyper').position().left;
                    alert(event.touches[0].x);
                }
            });
            $('#swyper').on('touchstop', function(event){
                alert(dragging+ " " +event.touches.length+ " "+event.touches[0].x+$('#swyper').position().left);
                if(dragging)
                {
                    dragging = false;
                    alert(event.touches[0].x-lastMousePosition);
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
                if(dragging)
                {
                    //drag the swype-body
                    var distance = event.touches[0].x - lastMousePosition;
                    $('#swyper').css("left", (lastBodyPosition+distance));
                }
                event.preventDefault();
            });
        }else
        {
            //show next and prev button

            //bind click event
        }
    });
})(jQuery);