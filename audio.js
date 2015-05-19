var app = angular.module('angular-html5-audio', []);

app.controller('MainCtrl', function($scope, $sce, $rootScope) {

  if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
      alert('You might be viewing this on a mobile device. Unfortunately, AudioContext is not supported on this browser. Analyser will not be rendered.');
    }
    window.AudioContext = window.webkitAudioContext;
  }

  window.requestAnimFrame = function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function */ callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }();

  $scope.songList = [
    { title : 'Waiting for Superman - Daughtry', filename : 'daughtry.mp3'},
    { title : 'Plush - Stone Temple Pilots', filename : 'plush.mp3'},
    { title : 'Jeremy - Pearl Jam', filename : 'jeremy.mp3'},
    { title : 'All of Me - John Legend', filename : 'allofme.mp3'},
    { title : 'Beautiful Day - U2', filename : 'beautifulday.mp3'},
    { title : 'You and Me - Lifehouse', filename : 'youandme.mp3'},
    { title : 'Counting Stars - One Republic', filename : 'countingstars.mp3'},
    { title : 'Crash Into Me - Dave Matthews', filename : 'crashintome.mp3'}
  ];

  // Audio controls
  $scope.playAudio = function(songTitle) {
    $scope.songTitle = $sce.trustAsResourceUrl(songTitle);
     $scope.myAudio.play();
  };

  $scope.pauseAudio = function() {
    $scope.myAudio.pause();
  };

  $scope.stopAudio = function() {
    $scope.myAudio.pause();
    $scope.myAudio.currentTime = 0;
  };

  $scope.initMp3Player = function() {
    $scope.myAudio = document.querySelector('audio');

    window.AudioContext = AudioContext || window.webkitAudioContext;
    $scope.context = new AudioContext();

    $scope.analyser = $scope.context.createAnalyser();
    $scope.source = $scope.context.createMediaElementSource($scope.myAudio);

    $scope.fbc_array = new Uint8Array($scope.analyser.frequencyBinCount);
    $scope.analyser.smoothingTimeConstant = 0.8;
    // $scope.analyser.fftSize = 512;

    $scope.canvas = document.getElementById('analyser_render');
    $scope.ctx = $scope.canvas.getContext('2d');
    $rootScope.$emit('startAudio', {
      message: 'start audio'
    });

  };

  $rootScope.$on('startAudio', function(event, args) {
    $scope.source.connect($scope.analyser);
    $scope.source.connect($scope.context.destination);
    $scope.analyser.connect($scope.context.destination);
    frameLooper();
  });

  function frameLooper() {
    requestAnimFrame(frameLooper);
    renderSpectrum();
  }

  function renderSpectrum() {
    $scope.analyser.getByteFrequencyData($scope.fbc_array);
    $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height); // Clear the canvas
    $scope.ctx.fillStyle = '#00CCFF'; // Color of the bars
    bars = 1024;
    for (var i = 0; i < bars; i++) {
      bar_x = i * 2;
      bar_width = 1;
      bar_height = -($scope.fbc_array[i] / 2);
      var spectrumColors = $scope.ctx.createLinearGradient(0, 0, 0, 200);
      spectrumColors.addColorStop(0, "black");
      spectrumColors.addColorStop(0.5, "#FFA000");
      spectrumColors.addColorStop(0.3, "yellow");
      spectrumColors.addColorStop(0.8, "red");
      spectrumColors.addColorStop(1, "white");
      $scope.ctx.fillStyle = spectrumColors;
      $scope.ctx.fillRect(bar_x, $scope.canvas.height, bar_width, bar_height);
    }
  }

  window.addEventListener('load', $scope.initMp3Player, false);

});
