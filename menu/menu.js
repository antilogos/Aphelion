
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
var fieldMenu = null;

var engine = null;

function initMenu() {
  console.log("initMenu...");

  // Création des différents menus
  mainMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Main");
  optionMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Option");
  hallMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Hall");
  settingMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Setting");
  researchMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Research");
  hangarMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Hangar");
  missionMenu = new MenuObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Missions");
  pauseMenu = new MenuObject(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, document.getElementById('menu'), "Pause");
  fieldMenu = new EngineObject(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('menu'), "Aphelion");

  mainMenu.items.unshift(new ButtonObject(20,20,50,50,mainMenu.canvas,"Hall", function() { openMenu(hallMenu); } ));
  mainMenu.items.unshift(new ButtonObject(20,70,50,50,mainMenu.canvas,"*Save", function() { openMenu(optionMenu); } ));
  mainMenu.items.unshift(new ButtonObject(220,70,50,50,mainMenu.canvas,"*Load", function() { openMenu(optionMenu); } ));
  mainMenu.items.unshift(new ButtonObject(20,120,50,50,mainMenu.canvas,"*Option", function() { openMenu(optionMenu); } ));

  optionMenu.items.unshift(new ButtonObject(20,70,300,50,mainMenu.canvas,"Back", function() { openMenu(-1); } ));

  hallMenu.items.unshift(new ButtonObject(20,20,300,50,mainMenu.canvas,"Headquarter", function() { openMenu(missionMenu); } ));
  hallMenu.items.unshift(new ButtonObject(20,70,300,50,mainMenu.canvas,"*Hangar", function() { openMenu(-1); } ));
  hallMenu.items.unshift(new ButtonObject(20,120,300,50,mainMenu.canvas,"*Research", function() { openMenu(-1); } ));
  hallMenu.items.unshift(new ButtonObject(20,170,300,50,mainMenu.canvas,"*Setting", function() { openMenu(-1); } ));
  hallMenu.items.unshift(new ButtonObject(20,220,70,50,mainMenu.canvas,"*Save", function() { openMenu(-1); } ));
  hallMenu.items.unshift(new ButtonObject(220,220,70,50,mainMenu.canvas,"*Load", function() { openMenu(-1); } ));
  hallMenu.items.unshift(new ButtonObject(20,270,300,50,mainMenu.canvas,"Back", function() { openMenu(-1); } ));

  //settingMenu

  //researchMenu

  //hangarMenu

  missionMenu.items.unshift(new ButtonObject(20,20,300,50,mainMenu.canvas,"*Start", function() { openMenu(fieldMenu);
    fieldMenu.init();
  } ));
  missionMenu.items.unshift(new ButtonObject(20,270,300,50,mainMenu.canvas,"Back", function() { openMenu(-1); } ));

  //pauseMenu

  // Open the main menu
  openMenu(mainMenu);
  // Launch the animation
  animate();

  console.log("initMenu: DONE");
};
