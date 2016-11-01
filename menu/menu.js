
function openMenu(menu) {
  if(screenStack.length > 0) {
    screenStack[0].unfocus();
  }
  if(menu == -1) {
    screenStack.shift();
    if(screenStack.length > 0) {
      screenStack[0].focus();
    } else {
      // Close
      console.log("THE END");
    }
  } else {
    screenStack.unshift(menu);
    menu.focus();
  }
};

var mainMenu = null;
var optionMenu = null;
var settingMenu = null;
var researchMenu = null;
var hangarMenu = null;
var missionMenu = null;
var pauseMenu = null;


function initMenu() {
  console.log("initMenu...");

  // Création des différents menus
  mainMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Main");
  optionMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Option");
  settingMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Setting");
  researchMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Research");
  hangarMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Hangar");
  missionMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Missions");
  pauseMenu = new MenuObject(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, document.getElementById('menu'), "Pause");
  mainMenu.items.unshift(new ButtonObject(20,20,50,50,mainMenu.canvas,"testButton", function() {
    openMenu(optionMenu);
  } ));
  optionMenu.items.unshift(new ButtonObject(20,20,300,50,mainMenu.canvas,"test 1", function() {
    openMenu(-1);
  } ));
  optionMenu.items.unshift(new ButtonObject(20,70,300,50,mainMenu.canvas,"test 2", function() {
    openMenu(-1);
  } ));
  // Open the main menu
  openMenu(mainMenu);
  // Launch the animation
  animate();

  console.log("initMenu: DONE");
};
