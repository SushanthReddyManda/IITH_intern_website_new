$( document ).ready(function() {

    var App = {
        init: function () {
            var font = new FontFaceObserver('druk-heavy');
            var that = this;

            this.initslider();
            this.initheaders();
            this.initaccordion();
            this.setactivenav();
            this.matchHeightStart();

            // Loader
            font.load().then(function () {
                $('.loader').animate({ opacity: 0 },
                0, 
                function (ev) {   that.onloadcomplete(ev);
                });
            });
        },
        initslider: function () {
            var sliderbuttons = $('.slider-toggles li'),
                activeslide = 0,
                btnprevious = $('.services-button-up'),
                btnnext = $('.services-button-down');

            sliderbuttons.bind('click', function (ev) {
                var target = $(ev.currentTarget),
                    targetindex = target.index(),
                    destination = $('.slider-content'),
                    contentitems = $('.slider-content-inner'),
                    arrowup = $('.services-buttons .arrow-up-long'),
                    arrowdown = $('.services-buttons .arrow-down-long');
                
                // activate the correct button
                sliderbuttons.removeClass('active');
                target.addClass('active');

                // update the paginate buttons
                if (targetindex === 0) {
                    arrowup.toggleClass('opacity-50', true);
                    arrowdown.toggleClass('opacity-50', false);
                } else if (targetindex === sliderbuttons.length - 1) {
                    arrowup.toggleClass('opacity-50', false);
                    arrowdown.toggleClass('opacity-50', true);
                } else {
                    arrowup.toggleClass('opacity-50', false);
                    arrowdown.toggleClass('opacity-50', false);
                }

                // toggle the content of the selected item
                $.each(contentitems, function (ind, val) {
                    $(val).toggleClass('inactive', ind !== targetindex);
                });

                activeslide = targetindex;
            });

            btnprevious.bind('click', function (ev) {
                // if the current slide is not the first one, advance the slideshow back 1
                if (activeslide > 0) {
                    activeslide--;
                    sliderbuttons.eq(activeslide).click();
                } else {
                    // do nothing
                }
            });

            btnnext.bind('click', function (ev) {
                // if the current slide is not the last one, rewind the slideshow 
                if (activeslide < sliderbuttons.length - 1) {
                    activeslide++;
                    sliderbuttons.eq(activeslide).click();
                } else {
                    // do nothing
                }
            });
        },
        initheaders: function () {
            // Animate lead text

            // var text = $('#lead').html();
            // var strarray = text.split('<br>');
            // var newstr = '';

            // for (var i = 0; i < strarray.length; i++) {
            //     newstr += '<span class="textline">' + strarray[i] + '</span>';
            // }

            // $('#lead').html(newstr);
        },
        initaccordion: function () {
            //Accordian
            $('.accordion-tab').click(function() {
                $(this).toggleClass('content-reveal');
            });
        },

        matchHeightStart: function () {
          $(function() {
            $('.text-card .card-content').matchHeight();
            $('.icon-card .card-content').matchHeight();
            $('.icon-card .icon-card-content').matchHeight();
          });
        },
        setactivenav: function () {
            // Active Nav Item
            // get current URL path and assign 'active' class
            var pathname = window.location.pathname;
            $('#navigation > ul > li > a[href="'+pathname+'"]').parent().addClass('active');
        },
        onloadcomplete: function (ev) {
            window.setTimeout(function () {
                $('.loader').css('display', 'none');
                $('.loader img').css('display', 'none');
            }, 3000);
            
            $('body').addClass('loaded');

            polybg.init();
        }
    };

    
    // Kick everything off!!
    App.init();

});