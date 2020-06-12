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
    distance: '5%',
    reset: false,
    delay: 250,
    easing: 'cubic-bezier(0.105, 0.265, 0.17, 0.975)',
    beforeReveal: isntVisible,
    afterReveal: isVisible,
    afterReset: isntVisible,
    viewOffset: {
      top: 50
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