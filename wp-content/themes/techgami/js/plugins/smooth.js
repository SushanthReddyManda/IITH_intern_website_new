// Smooth Scroll

function smoothScroll(that) {
    var windowW = $(window).width();
    if (location.pathname.replace(/^\//,'') == that.pathname.replace(/^\//,'') && location.hostname == that.hostname) {
      var target = $(that.hash);
      target = target.length ? target : $('[name=' + that.hash.slice(1) +']');
      if ((target.length) && (windowW > 321)) {
        $('html, body').animate({
          scrollTop: (target.offset().top) + 2
        }, 450);
        return false;
      } else {
        $('html, body').animate({
          scrollTop: (target.offset().top) - 86
        }, 450);
        return false;
      }
    }
  };
  
  $('a.scroll-down').on('click', function() {
    var windowW = $(window).width();
      if (windowW >= 940) {
        smoothScroll(this);
      } else {
        $('html, body').animate({scrollTop: $('#outreach').offset().top }, 450);
        return false;
      }
  
   });
  
  $('a[href*="#"]:not([href="#"])').on('click', function() {
    var windowW = $(window).width();
    if (windowW >= 321) {
      smoothScroll(this);
    }
  
  });