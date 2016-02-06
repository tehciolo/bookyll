var $ = require('jquery');
var Vue = require('vue');
var remodal = require('remodal');
var howler = require('howler');
// var dragula = require('dragula');
var siteData = require('./siteData.js');
var pageData = require('./pageData.js');

require('jquery-ui/draggable');
require('jquery-ui/droppable');
require('jquery-ui/position');

Vue.config.debug = true;

function blurAll(){
 var tmp = document.createElement("input");
 document.body.appendChild(tmp);
 tmp.focus();
 document.body.removeChild(tmp);
}

window.staticSound = new Howl({
  urls: ['assets/audio/img_zoom.mp3'],
  loop: true,
  volume: 0.1
});

window.staticSoundTrue = new Howl({
  urls: ['assets/audio/true.mp3'],
  volume: 0.2
});

window.staticSoundFalse = new Howl({
  urls: ['assets/audio/false.mp3'],
  volume: 0.2
});

new Vue({
  el: '#app',

  data: {
    jumpPage: '',
    leftpage: -2,
    rightpage: -1,
    staticpage: false,
    currentModalContent: '',
    pages: pageData(),
    site: siteData(),
    selectedPageObject: {},
    selected: '',
    sandboxContent: '',
    dropzoneContent: '',
    staticSound: ''
  },

  computed: {
    canGoBack: function() {
      if (this.leftpage.length != 0) {
        if (this.leftpage - 2 > -3) {
          return true
        } else {
          return false
        }
      }
    },

    canGoForward: function() {
      if (this.rightpage.length != 0) {
        if (this.rightpage + 2 < 86) {
          return true
        } else {
          return false
        }
      }
    },

    leftPageObject: function() {
      for (var i = 0; i < this.pages.length; i++) {
        if (this.pages[i].no == this.leftpage) {
          // Check to see if there is media on the page
          if (!this.pages[i].video && !this.pages[i].static && !this.pages[i].ex && !this.pages[i].ex2) {
            this.pages[i].hasMedia = false;
          } else {
            this.pages[i].hasMedia = true;
          }
          // Return page object with added info ^
          return this.pages[i];
        }
      }
    },

    rightPageObject: function() {
      for (var i = 0; i < this.pages.length; i++) {
        if (this.pages[i].no == this.rightpage) {
          // Check to see if there is media on the page
          if (!this.pages[i].video && !this.pages[i].static && !this.pages[i].ex && !this.pages[i].ex2) {
            this.pages[i].hasMedia = false;
          } else {
            this.pages[i].hasMedia = true;
          }
          // Return page object with added info ^
          return this.pages[i];
        }
      }
    },

    typerTrue: function(a, b) {
      var parsedA = a.replace(/\s+/g, '').toLowerCase();

      if (parsedA.length == b.length && parsedA == b) {
        window.staticSoundTrue.play();
        console.log('true');
        return true;
      }
    },

    typerFalse: function(a, b) {
      var parsedA = a.replace(/\s+/g, '').toLowerCase();

      if (parsedA.length == b.length && parsedA != b) {
        window.staticSoundFalse.play();
        console.log('false');
        return true;
      }
    }
  },

  methods: {
    prevPages: function() {
      this.leftpage = this.leftpage - 2;
      this.rightpage = this.rightpage - 2;
      blurAll();
    },
    nextPages: function() {
      this.leftpage = this.leftpage + 2;
      this.rightpage = this.rightpage + 2;
      blurAll();
    },
    showLeftModal: function(order) {
      this.selectedPageObject = this.leftPageObject;
      if (this.selectedPageObject[order].audio) {
        window[order + this.selectedPageObject.no] = new Howl({
          urls: ['assets/audio/'+ this.selectedPageObject[order].audioSrc +'.mp3'],
          volume: 0.3
        });
        console.log('Left Page: Loaded ' + order + ' audio - ' + this.selectedPageObject[order].audioSrc);
      }
      this.selectModalContent();
    },
    showLeftStaticModal: function(order) {
      this.selectedPageObject = this.leftPageObject;
      if (this.selectedPageObject[order + 'AudioSrc']) {
        window[order + this.selectedPageObject.no] = new Howl({
          urls: ['assets/audio/'+ this.selectedPageObject[order + 'AudioSrc'] +'.mp3'],
          volume: 0.3
        }).play();
        console.log('Left Page: Loaded ' + order + ' audio - ' + this.selectedPageObject[order + 'AudioSrc']);
      } else {
        window.staticSound.play();
      }
      this.selectModalContent();
    },
    showRightModal: function(order) {
      this.selectedPageObject = this.rightPageObject;
      if (this.selectedPageObject[order].audio) {
        window[order + this.selectedPageObject.no] = new Howl({
          urls: ['assets/audio/'+ this.selectedPageObject[order].audioSrc +'.mp3'],
          volume: 0.3
        });
        console.log('Right Page: Loaded ' + order + ' audio - ' + this.selectedPageObject[order].audioSrc);
      }
      this.selectModalContent();
    },
    showRightStaticModal: function(order) {
      this.selectedPageObject = this.rightPageObject;
      if (this.selectedPageObject[order + 'AudioSrc']) {
        window[order + this.selectedPageObject.no] = new Howl({
          urls: ['assets/audio/'+ this.selectedPageObject[order + 'AudioSrc'] +'.mp3'],
          volume: 0.3
        }).play();
        console.log('Right Page: Loaded ' + order + ' audio - ' + this.selectedPageObject[order + 'AudioSrc']);
      } else {
        window.staticSound.play();
      }
      this.selectModalContent();
    },
    muteStaticSound: function(order) {
      if (this.selectedPageObject[order + 'AudioSrc']) {
        window[order + this.selectedPageObject.no].stop();
      } else {
        window.staticSound.stop();
      }
    },
    jumpToPage: function(event) {
      event.preventDefault();

      if (! this.jumpPage) {
        return false;
      } else {
        this.staticpage = false;
        if (this.jumpPage > 1 && this.jumpPage < 85) {
          if (this.jumpPage % 2 == 0) {
            this.leftpage = parseInt(this.jumpPage);
            this.rightpage = parseInt(this.jumpPage) + 1;
          } else {
            this.leftpage = parseInt(this.jumpPage) - 1;
            this.rightpage = parseInt(this.jumpPage);
          }
        } else {
          return false;
        }
      }
    },
    jumpToToc: function(page) {
      if (page % 2 == 0) {
        this.leftpage = page;
        this.rightpage = page + 1;
      } else {
        this.leftpage = page - 1;
        this.rightpage = page;
      }
    },
    selectModalContent: function() {
      if (this.selectedPageObject.hasMedia) {
        if (this.selectedPageObject.video) {
          this.currentModalContent = 'video';
        } else if (this.selectedPageObject.static) {
          this.currentModalContent = 'static';
          this.selected = this.selectedPageObject.static[0];
        } else if (this.selectedPageObject.ex) {
          this.currentModalContent = 'ex';
        } else {
          this.currentModalContent = 'ex2';
        }
      }
    },
    resetForm: function() {
      for (var i = 0; i < this.selectedPageObject.ex.data.length; i++) {
        this.selectedPageObject.ex.data[i].model = ''
      }
      for (var i = 0; i < this.selectedPageObject.ex2.data.length; i++) {
        this.selectedPageObject.ex2.data[i].model = ''
      }
    },
    solveForm: function() {
      if (this.selectedPageObject.ex.name != 'mediumselect' && this.selectedPageObject.ex.name != 'circleselect') {
        for (var i = 0; i < this.selectedPageObject.ex.data.length; i++) {
          this.selectedPageObject.ex.data[i].model = this.selectedPageObject.ex.data[i].solution;
        }
      }
      if (this.selectedPageObject.ex2.name != 'mediumselect' && this.selectedPageObject.ex.name != 'circleselect') {
        for (var i = 0; i < this.selectedPageObject.ex2.data.length; i++) {
          this.selectedPageObject.ex2.data[i].model = this.selectedPageObject.ex2.data[i].solution;
        }
      }
      if (this.selectedPageObject.ex3.name != 'mediumselect' && this.selectedPageObject.ex.name != 'circleselect') {
        for (var i = 0; i < this.selectedPageObject.ex3.data.length; i++) {
          this.selectedPageObject.ex3.data[i].model = this.selectedPageObject.ex3.data[i].solution;
        }
      }
    },
    solveCheck: function() {
      if (this.selectedPageObject.ex.name == 'mediumselect' || this.selectedPageObject.ex.name == 'circleselect') {
        for (var i = 0; i < this.selectedPageObject.ex.data.length; i++) {
          this.selectedPageObject.ex.data[i].model = 'true';
        }
      } else if (this.selectedPageObject.ex2.name == 'mediumselect' || this.selectedPageObject.ex2.name == 'circleselect') {
        for (var i = 0; i < this.selectedPageObject.ex2.data.length; i++) {
          this.selectedPageObject.ex2.data[i].model = 'true';
        }
      }
    },
    interactNow: function() {
      this.sandboxContent = this.$$.sandbox.innerHTML;
      this.dropzoneContent = this.$$.dropzone.innerHTML;
      this.$$.startButton.setAttribute('disabled', 'disabled');
      for (var i = 0; i < this.selectedPageObject.ex.data.length; i++) {
        // dragula([document.querySelector('.launch--' + this.selectedPageObject.ex.data[i].rowID), document.querySelector('.target--' + this.selectedPageObject.ex.data[i].rowID)]);
        var launch = '.launch--' + this.selectedPageObject.ex.data[i].rowID;console.log(launch);
        var target = '.target--' + this.selectedPageObject.ex.data[i].rowID;console.log(target);
        var targetScope = this.selectedPageObject.ex.data[i].rowID;

        $(launch).addClass('hvr-wobble-horizontal-custom');

        $(launch).draggable({
          stack: '.dnd__answer-container',
          scope: targetScope,
          revert: true,
          start: function( event, ui ) {
            if ($(this).hasClass('hvr-wobble-horizontal-custom')) {
              $(this).removeClass('hvr-wobble-horizontal-custom');
            }
            ui.helper.addClass('on-drag');
          },
          stop: function( event, ui ) {
            ui.helper.removeClass('on-drag');
          }
        });

        $(target).droppable({
          accept: launch,
          scope: targetScope,
          hoverClass: 'drop-hover',
          drop: function( event, ui ) {
            var self = $(this);
            self.addClass( "dropped");
            ui.draggable.draggable( 'disable' );
            $(this).droppable( 'disable' );
            ui.draggable.position( { of: self, my: 'center', at: 'center' } );
            ui.draggable.draggable( 'option', 'revert', false );
            window.staticSoundTrue.play();
          }
        });

      }
    },
    resetDnd: function() {
      if (this.sandboxContent) {
        this.$$.sandbox.innerHTML = this.sandboxContent;
      }
      if (this.dropzoneContent) {
        this.$$.dropzone.innerHTML = this.dropzoneContent;
      }

      this.$$.startButton.removeAttribute('disabled');
    },
    goStatic: function(page) {
      this.leftpage = '';
      this.rightpage = '';
      this.staticpage = page;
    },
    goToPage: function(page) {
      this.staticpage = false;

      if (page % 2 == 0) {
        this.leftpage = parseInt(page);
        this.rightpage = parseInt(page) + 1;
      } else {
        this.leftpage = parseInt(page) - 1;
        this.rightpage = parseInt(page);
      }
    },
    checkSolution: function(model, solution) {
      if (model.length == solution.length && model.toLowerCase() == solution) {
        window.staticSoundTrue.play();
      }
      if (model.length == solution.length && model.toLowerCase() != solution) {
        window.staticSoundFalse.play();
      }
    },
    playStaticSound: function(bool) {
      if (bool == 'true') {
        window.staticSoundTrue.play();
      } else if (bool == 'false') {
        window.staticSoundFalse.play();
      }
    },
    playExSound: function(pageNo, order) {
      var soundName = order + pageNo;
      this.selectedPageObject[order].audio = 'playing';
      console.log(this.selectedPageObject[order].audio);
      window[soundName].play();
    },
    pauseExSound: function(pageNo, order) {
      var soundName = order + pageNo;
      this.selectedPageObject[order].audio = 'paused';
      console.log(this.selectedPageObject[order].audio);
      window[soundName].pause();
    },
    stopExSound: function(pageNo, order) {
      var soundName = order + pageNo;
      this.selectedPageObject[order].audio = 'stopped';
      console.log(this.selectedPageObject[order].audio);
      window[soundName].stop();
    },
    stopVideo: function(id) {
      console.log(id);
      $('#' + id).trigger('pause');
      $('#' + id).prop("currentTime", 0);
    }
  }
});
