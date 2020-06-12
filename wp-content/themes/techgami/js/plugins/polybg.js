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
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.setSize(this.canvaswidth, this.canvasheight);
    this.renderer.setViewport(0, 0, (this.canvaswidth), this.canvasheight);

    document.getElementById('canvas').appendChild(this.renderer.domElement);

    // the scene holds all of the 3d elments
    this.scene = new THREE.Scene();

    // the camera determines the perspective from which the user views the scene
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0,0,45); //Alex Changed This
    // this.camera.lookAt(0,0,0);
    this.scene.add(this.camera);

    // create a container for the particles and generate them, then add to scene
    this.particle = new THREE.Object3D();
    for (var i = 0; i < 1000; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.position.multiplyScalar(75 + (Math.random() * 700));
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      this.particle.add(mesh);
    }
    this.scene.add(this.particle);

    // create the globe-shaped polyhedron
    this.skelet = new THREE.Object3D();
    this.skelet.name = 'skelet';
    planet.scale.x = planet.scale.y = planet.scale.z = 16;
    this.skelet.add(planet);
    this.skelet.position.set(0, 0, 0);

    
    // only add the skelet if user is on the homepage and the screen width is at least "medium"
    if (this.ishome && this.canvaswidth>= 1000) {
      this.scene.add(this.skelet);
    } else {
      this.scene.remove(this.skelet); // remove on other pages
    }

    // create some lights and add them to the scene
    var ambientLight = new THREE.AmbientLight(0x004AFF );
    this.scene.add(ambientLight);
    
    var lights = [];
    lights[0] = new THREE.DirectionalLight( 0x004AFF, 1 );
    lights[0].position.set( 1, 0, 0 );
    lights[1] = new THREE.DirectionalLight( 0x004AFF, 1 );
    lights[1].position.set( 0.75, 1, 0.5 );
    lights[2] = new THREE.DirectionalLight( 0x004AFF, 1 );
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