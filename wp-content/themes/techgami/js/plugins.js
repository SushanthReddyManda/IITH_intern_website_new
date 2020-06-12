"use strict";

// https://codepen.io/resource/pen/KMzqWM

var resizeTimer;

var polybg = {
  init: function () {
    this.scalepercent = .6;
    this.ishome = $('body').hasClass('home');

    if ($('#about').length) {
      this.scrolloffset = $('#about').offset().top;
    }

    this.scrolloffset = $('#about').length ? $('#about').offset().top : 0;
    
    this.calculatewindowsize();
    this.initcanvas();
    this.animate();
    this.initeventhandlers();
  },
  initcanvas: function () {
    var mat2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide
    });
    var planet = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 1), mat2);
    var geometry = new THREE.TetrahedronGeometry(2, 0);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    // create renderer and apply it to the DOM
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x404040, 0.0);
    this.renderer.setSize(this.canvaswidth, this.canvasheight);
    this.renderer.setViewport(0, 0, (this.canvaswidth), this.canvasheight);

    document.getElementById('canvas').appendChild(this.renderer.domElement);

    // the scene holds all of the 3d elments
    this.scene = new THREE.Scene();

    // the camera determines the perspective from which the user views the scene
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(-70,0,475); //Alex Changed This
    // this.camera.lookAt(0,0,0);
    this.scene.add(this.camera);

    // create a container for the particles and generate them, then add to scene
    this.particle = new THREE.Object3D();
    for (var i = 0; i < 1000; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.position.multiplyScalar(75 + (Math.random() * 700));
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      this.particle.add();
    }
    this.scene.add(this.particle);

    // create the globe-shaped polyhedron
    this.skelet = new THREE.Object3D();
    this.skelet.name = 'skelet';
    planet.scale.x = 14;
    planet.scale.y = 14;
    planet.scale.z = 14;
    this.skelet.add(planet);  // .add(planet)
    this.skelet.position.set(0, 0, 0);

    
    // only add the skelet if user is on the homepage and the screen width is at least "medium"
    if (this.ishome && this.canvaswidth>= 1000) {
      this.scene.add(this.skelet);  // changed the add to remove here
    } else {
      this.scene.remove(this.skelet); // remove on other pages
    }

    // create some lights and add them to the scene
    var ambientLight = new THREE.AmbientLight(0x404040 );
    this.scene.add(ambientLight);
    
    var lights = [];
    lights[0] = new THREE.DirectionalLight( 0x404040, 1 );
    lights[0].position.set( 1, 0, 0 );
    lights[1] = new THREE.DirectionalLight( 0x404040, 1 );
    lights[1].position.set( 0.75, 1, 0.5 );
    lights[2] = new THREE.DirectionalLight( 0x404040, 1 );
    lights[2].position.set( -0.75, -1, 0.5 );
    this.scene.add( lights[0] );
    this.scene.add( lights[1] );
    this.scene.add( lights[2] );    
  },
  initeventhandlers: function () {
    var that = this;
    var resizeTimer;

    if (this.ishome) {
      window.addEventListener('scroll', function (ev) {
        that.onscroll(ev, that);
      });
    }
    window.addEventListener('resize', function (ev) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function (ev) {
        that.windowresize(ev, that);
      }, 50);
    }, false);
  },
  windowresize: function (ev, that) {
    var that = this;
    
    that.camera.aspect = window.innerWidth / window.innerHeight;
    that.camera.updateProjectionMatrix();
    
    // if (that.ishome) {
    //   that.canvaswidth = window.innerWidth*1.5;
    //   that.canvasheight = window.innerHeight*1.5;

    //   if (window.matchMedia('screen and (max-width:1000px)').matches) {
    //     that.ismedium = false;
    //     if (that.scene.getObjectByName('skelet')) {
    //       that.scene.remove(that.skelet);
    //     }
    //   } else {
    //     that.ismedium = true;
    //     if (!that.scene.getObjectByName('skelet')) {
    //       that.scene.add(that.skelet);
    //     }
    //   }
    // } else {
    //   that.canvaswidth = window.innerWidth;
    //   that.canvasheight = window.innerHeight;
    // }

    that.calculatewindowsize();
    if (that.canvaswidth < 1000 || (!this.ishome)) {
      if (that.scene.getObjectByName('skelet')) {
        that.scene.remove(that.skelet);
      }
    } else {
      that.scene.add(that.skelet);
    }

    that.renderer.setSize(that.canvaswidth, that.canvasheight);
    that.renderer.setViewport(0, 0, that.canvaswidth, that.canvasheight);
  },
  onscroll: function (ev, that) {
    if (that.canvaswidth >= 1000) {
      var scrollpercent = window.scrollY / that.scrolloffset;
      var scale = 1 + scrollpercent * that.scalepercent;
      that.skelet.scale.set(scale, scale, scale);
      that.skelet.children[0].material.opacity = 1 - (scrollpercent);
    }
  },
  calculatewindowsize: function () {
    // if (this.ishome) {
    //   this.canvaswidth = window.innerWidth*1.5;
    //   this.canvasheight = window.innerHeight*1.5;
    // } else {
      this.canvaswidth = window.innerWidth;
      this.canvasheight = window.innerHeight;  
    // }
  },
  animate: function () {
    var that = this;
    requestAnimationFrame(function () {
      that.animate();
    });

    this.particle.rotation.x += 0.0000;
    this.particle.rotation.y -= 0.00040;
    this.skelet.rotation.x -= 0.00010;
    this.skelet.rotation.y += 0.00120;
    this.renderer.clear();
    this.renderer.render( this.scene, this.camera );
  }
};

$(document).ready(function () {

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
    // Scroll Reveal
    
    ScrollReveal({ reset: true });
    
    function isVisible (el) {
        el.classList.remove('isnt-visible');
        el.classList.add('is-visible');
    }
    
    function isntVisible (el) {
        el.classList.remove('is-visible');
        el.classList.add('isnt-visible');
    }
    
    ScrollReveal().reveal('footer', {
        interval: 300,
        distance: '0',
        reset: false,
        delay: 250,
        easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
        beforeReveal: isVisible,
        afterReveal: isVisible,
        afterReset: isntVisible,
        viewOffset: {
          top: 0
        }
    });
    
    ScrollReveal().reveal('.scrollwipe-header', {
        interval: 300,
        distance: '10%',
        reset: false,
        delay: 175,
        easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
        beforeReveal: isntVisible,
        afterReveal: isVisible,
        afterReset: isntVisible,
        viewOffset: {
          top: 50
        }
    });
    
    ScrollReveal().reveal('.scrollwipe-block', {
        interval: 300,
        distance: '0',
        reset: false,
        delay: 175,
        easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
        beforeReveal: isntVisible,
        afterReveal: isVisible,
        afterReset: isntVisible,
        viewOffset: {
          top: 50
        }
    });
    
    ScrollReveal().reveal('.scrollwipe-v-header', {
        interval: 300,
        distance: '10%',
        reset: false,
        delay: 175,
        easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
        beforeReveal: isntVisible,
        afterReveal: isVisible,
        afterReset: isntVisible,
        viewOffset: {
          top: 50
        }
    });
    
    ScrollReveal().reveal('.sw-b-l', {
        interval: 300,
        distance: '5%',
        reset: false,
        mobile: false,
        origin: 'right',
        delay: 175,
        easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
        // beforeReveal: isntVisible,
        // afterReveal: isVisible,
        // afterReset: isntVisible,
        viewOffset: {
          top: 150
        }
    });
    
    // ScrollReveal().reveal('.sw-b-learn', {
    //     interval: 300,
    //     distance: '100%',
    //     reset: false,
    //     mobile: false,
    //     origin: 'right',
    //     delay: 175,
    //     easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
    //     // beforeReveal: isntVisible,
    //     // afterReveal: isVisible,
    //     // afterReset: isntVisible,
    //     viewOffset: {
    //       top: 250
    //     }
    // });
    
    ScrollReveal().reveal('.sr-c', {
        interval: 300,
        distance: '10%',
        reset: false,
        delay: 175,
        viewOffset: {
          top: 75
        }
    });
    
    ScrollReveal().reveal('.sr-c-l', {
        interval: 75,
        distance: '10%',
        reset: false,
        delay: 175,
        viewOffset: {
          top: 75
        }
    });
    
    ScrollReveal().reveal('.sr-c-h', {
        interval: 300,
        distance: '10%',
        reset: false,
        delay: 175,
        viewOffset: {
          top: 350
        }
    });
    /* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
    this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
    function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
    function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
    A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
    f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
    g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
    z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());
    
    /**
    * jquery-match-height 0.7.2 by @liabru
    * http://brm.io/jquery-match-height/
    * License: MIT
    */
    
    ;(function(factory) { // eslint-disable-line no-extra-semi
        'use strict';
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if (typeof module !== 'undefined' && module.exports) {
            // CommonJS
            module.exports = factory(require('jquery'));
        } else {
            // Global
            factory(jQuery);
        }
    })(function($) {
        /*
        *  internal
        */
    
        var _previousResizeWidth = -1,
            _updateTimeout = -1;
    
        /*
        *  _parse
        *  value parse utility function
        */
    
        var _parse = function(value) {
            // parse value and convert NaN to 0
            return parseFloat(value) || 0;
        };
    
        /*
        *  _rows
        *  utility function returns array of jQuery selections representing each row
        *  (as displayed after float wrapping applied by browser)
        */
    
        var _rows = function(elements) {
            var tolerance = 1,
                $elements = $(elements),
                lastTop = null,
                rows = [];
    
            // group elements by their top position
            $elements.each(function(){
                var $that = $(this),
                    top = $that.offset().top - _parse($that.css('margin-top')),
                    lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
    
                if (lastRow === null) {
                    // first item on the row, so just push it
                    rows.push($that);
                } else {
                    // if the row top is the same, add to the row group
                    if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                        rows[rows.length - 1] = lastRow.add($that);
                    } else {
                        // otherwise start a new row group
                        rows.push($that);
                    }
                }
    
                // keep track of the last row top
                lastTop = top;
            });
    
            return rows;
        };
    
        /*
        *  _parseOptions
        *  handle plugin options
        */
    
        var _parseOptions = function(options) {
            var opts = {
                byRow: true,
                property: 'height',
                target: null,
                remove: false
            };
    
            if (typeof options === 'object') {
                return $.extend(opts, options);
            }
    
            if (typeof options === 'boolean') {
                opts.byRow = options;
            } else if (options === 'remove') {
                opts.remove = true;
            }
    
            return opts;
        };
    
        /*
        *  matchHeight
        *  plugin definition
        */
    
        var matchHeight = $.fn.matchHeight = function(options) {
            var opts = _parseOptions(options);
    
            // handle remove
            if (opts.remove) {
                var that = this;
    
                // remove fixed height from all selected elements
                this.css(opts.property, '');
    
                // remove selected elements from all groups
                $.each(matchHeight._groups, function(key, group) {
                    group.elements = group.elements.not(that);
                });
    
                // TODO: cleanup empty groups
    
                return this;
            }
    
            if (this.length <= 1 && !opts.target) {
                return this;
            }
    
            // keep track of this group so we can re-apply later on load and resize events
            matchHeight._groups.push({
                elements: this,
                options: opts
            });
    
            // match each element's height to the tallest element in the selection
            matchHeight._apply(this, opts);
    
            return this;
        };
    
        /*
        *  plugin global options
        */
    
        matchHeight.version = '0.7.2';
        matchHeight._groups = [];
        matchHeight._throttle = 80;
        matchHeight._maintainScroll = false;
        matchHeight._beforeUpdate = null;
        matchHeight._afterUpdate = null;
        matchHeight._rows = _rows;
        matchHeight._parse = _parse;
        matchHeight._parseOptions = _parseOptions;
    
        /*
        *  matchHeight._apply
        *  apply matchHeight to given elements
        */
    
        matchHeight._apply = function(elements, options) {
            var opts = _parseOptions(options),
                $elements = $(elements),
                rows = [$elements];
    
            // take note of scroll position
            var scrollTop = $(window).scrollTop(),
                htmlHeight = $('html').outerHeight(true);
    
            // get hidden parents
            var $hiddenParents = $elements.parents().filter(':hidden');
    
            // cache the original inline style
            $hiddenParents.each(function() {
                var $that = $(this);
                $that.data('style-cache', $that.attr('style'));
            });
    
            // temporarily must force hidden parents visible
            $hiddenParents.css('display', 'block');
    
            // get rows if using byRow, otherwise assume one row
            if (opts.byRow && !opts.target) {
    
                // must first force an arbitrary equal height so floating elements break evenly
                $elements.each(function() {
                    var $that = $(this),
                        display = $that.css('display');
    
                    // temporarily force a usable display value
                    if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                        display = 'block';
                    }
    
                    // cache the original inline style
                    $that.data('style-cache', $that.attr('style'));
    
                    $that.css({
                        'display': display,
                        'padding-top': '0',
                        'padding-bottom': '0',
                        'margin-top': '0',
                        'margin-bottom': '0',
                        'border-top-width': '0',
                        'border-bottom-width': '0',
                        'height': '100px',
                        'overflow': 'hidden'
                    });
                });
    
                // get the array of rows (based on element top position)
                rows = _rows($elements);
    
                // revert original inline styles
                $elements.each(function() {
                    var $that = $(this);
                    $that.attr('style', $that.data('style-cache') || '');
                });
            }
    
            $.each(rows, function(key, row) {
                var $row = $(row),
                    targetHeight = 0;
    
                if (!opts.target) {
                    // skip apply to rows with only one item
                    if (opts.byRow && $row.length <= 1) {
                        $row.css(opts.property, '');
                        return;
                    }
    
                    // iterate the row and find the max height
                    $row.each(function(){
                        var $that = $(this),
                            style = $that.attr('style'),
                            display = $that.css('display');
    
                        // temporarily force a usable display value
                        if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                            display = 'block';
                        }
    
                        // ensure we get the correct actual height (and not a previously set height value)
                        var css = { 'display': display };
                        css[opts.property] = '';
                        $that.css(css);
    
                        // find the max height (including padding, but not margin)
                        if ($that.outerHeight(false) > targetHeight) {
                            targetHeight = $that.outerHeight(false);
                        }
    
                        // revert styles
                        if (style) {
                            $that.attr('style', style);
                        } else {
                            $that.css('display', '');
                        }
                    });
                } else {
                    // if target set, use the height of the target element
                    targetHeight = opts.target.outerHeight(false);
                }
    
                // iterate the row and apply the height to all elements
                $row.each(function(){
                    var $that = $(this),
                        verticalPadding = 0;
    
                    // don't apply to a target
                    if (opts.target && $that.is(opts.target)) {
                        return;
                    }
    
                    // handle padding and border correctly (required when not using border-box)
                    if ($that.css('box-sizing') !== 'border-box') {
                        verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                        verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                    }
    
                    // set the height (accounting for padding and border)
                    $that.css(opts.property, (targetHeight - verticalPadding) + 'px');
                });
            });
    
            // revert hidden parents
            $hiddenParents.each(function() {
                var $that = $(this);
                $that.attr('style', $that.data('style-cache') || null);
            });
    
            // restore scroll position if enabled
            if (matchHeight._maintainScroll) {
                $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
            }
    
            return this;
        };
    
        /*
        *  matchHeight._applyDataApi
        *  applies matchHeight to all elements with a data-match-height attribute
        */
    
        matchHeight._applyDataApi = function() {
            var groups = {};
    
            // generate groups by their groupId set by elements using data-match-height
            $('[data-match-height], [data-mh]').each(function() {
                var $this = $(this),
                    groupId = $this.attr('data-mh') || $this.attr('data-match-height');
    
                if (groupId in groups) {
                    groups[groupId] = groups[groupId].add($this);
                } else {
                    groups[groupId] = $this;
                }
            });
    
            // apply matchHeight to each group
            $.each(groups, function() {
                this.matchHeight(true);
            });
        };
    
        /*
        *  matchHeight._update
        *  updates matchHeight on all current groups with their correct options
        */
    
        var _update = function(event) {
            if (matchHeight._beforeUpdate) {
                matchHeight._beforeUpdate(event, matchHeight._groups);
            }
    
            $.each(matchHeight._groups, function() {
                matchHeight._apply(this.elements, this.options);
            });
    
            if (matchHeight._afterUpdate) {
                matchHeight._afterUpdate(event, matchHeight._groups);
            }
        };
    
        matchHeight._update = function(throttle, event) {
            // prevent update if fired from a resize event
            // where the viewport width hasn't actually changed
            // fixes an event looping bug in IE8
            if (event && event.type === 'resize') {
                var windowWidth = $(window).width();
                if (windowWidth === _previousResizeWidth) {
                    return;
                }
                _previousResizeWidth = windowWidth;
            }
    
            // throttle updates
            if (!throttle) {
                _update(event);
            } else if (_updateTimeout === -1) {
                _updateTimeout = setTimeout(function() {
                    _update(event);
                    _updateTimeout = -1;
                }, matchHeight._throttle);
            }
        };
    
        /*
        *  bind events
        */
    
        // apply on DOM ready event
        $(matchHeight._applyDataApi);
    
        // use on or bind where supported
        var on = $.fn.on ? 'on' : 'bind';
    
        // update heights on load and resize events
        $(window)[on]('load', function(event) {
            matchHeight._update(false, event);
        });
    
        // throttled update heights on resize events
        $(window)[on]('resize orientationchange', function(event) {
            matchHeight._update(true, event);
        });
    
    });
    

});
//# sourceMappingURL=plugins.js.map
