
var InputListener = function() {

  var listenerAttached = false;

  this.readMouseInput = function() {
    if(!inputListener.listenerAttached) {
    console.log("create listener ")
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mousemove', function(evt) {
        inputListener.mouseX = evt.clientX - document.getElementById('viewport').getBoundingClientRect().left;
        inputListener.mouseY = evt.clientY - document.getElementById('viewport').getBoundingClientRect().top;
      }, false);
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mousedown', function(evt) {
        inputListener.mouseHasClicked = true;
        inputListener.mouseB = true;
      }, false);
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mouseup', function(evt) {
        inputListener.mouseHasRealeased = true;
        inputListener.mouseB = false;
      }, false);
      inputListener.listenerAttached = true;
    }
  };
};

var inputListener = new InputListener();
