
var InputListener = function() {

  this.readMouseInput = function() {

    if(!inputListener.mouseMoveListener) {
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mousemove', function(evt) {
        inputListener.mouseX = evt.clientX - document.getElementById('viewport').getBoundingClientRect().left;
        inputListener.mouseY = evt.clientY - document.getElementById('viewport').getBoundingClientRect().top;
      }, false);
    }
    if(!inputListener.mouseDownListener) {
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mousedown', function(evt) {
        inputListener.mouseHasClicked = true;
        inputListener.mouseB = true;
      }, false);
    }
    if(!inputListener.mouseUpListener) {
      inputListener.mouseMoveListener = document.getElementById('viewport').addEventListener('mouseup', function(evt) {
        inputListener.mouseHasRealeased = true;
        inputListener.mouseB = false;
      }, false);
    }
  };
};

var inputListener = new InputListener();
