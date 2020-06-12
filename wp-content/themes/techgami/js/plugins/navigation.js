// Sticky Header

var $body = $("body");
var $wrapperTop = $("#header");
var lastScrollTop = 0;
var st = $(this).scrollTop();
var windowW = $(window).width();

$(window).resize(function () {
  windowW = $(window).width();
});

$(window).scroll(function(event){
   st = $(this).scrollTop();
   if(st < 3){
       $body.removeClass("header--fixed-up header--fixed");
       $wrapperTop.removeClass("animated fadeInDown fadeOutUp");
   }
   if((st < lastScrollTop) && (st > 100) && (windowW > 770)) {
       $body.addClass("header--fixed-up header--fixed");
       $wrapperTop.removeClass('fadeOutUp').addClass("animated fadeInDown");
   } else if((st > lastScrollTop) && (st > 100) && (windowW > 770)) {
       $wrapperTop.removeClass('fadeInDown').addClass("animated fadeOutUp");
   }
   lastScrollTop = st;
});

// Mobile Menu

$('.hamburger').click(function(e){
  e.preventDefault();
  $body.toggleClass('nav-open');
});