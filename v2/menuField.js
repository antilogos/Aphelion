/* Menu 6 - Field */
var background = new Background();

var menuField = new MainLoop();

function MainLoop() {
  this.button = [];

  this.draw = function draw() {
    // Get focus back
    if(!document.hidden && inputListener.lastActive == -1) {
      console.log("get Focus back");
      inputListener.lastActive = Date.now();
    }
    CANVAS_MENU.getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.button.forEach(function draw(b) { b.draw() });

    // Manage Logic
    cursor.update();
    background.update();
    passerbyFactory.update();
    projectileFactory.update();
    quadTree.update();
    animationFactory.update();
    stationFactory.update();
    // Manage Display
    cursor.draw();
    background.draw();
    passerbyFactory.draw();
    projectileFactory.draw();
    animationFactory.draw();
    stationFactory.draw();
    //DEBUG
    quadTree.draw();

    if(inputListener.keyup.indexOf(27) > -1) {
      screenStack.unshift(menuOption);
    }
    inputListener.keyup = [];
  }

  this.iddle = function iddle() {
    if(inputListener.lastActive != -1) {
      console.log("losing Focus");
      inputListener.lastIddle = new Date();
      inputListener.lastActive = -1;
    }
  }
}
