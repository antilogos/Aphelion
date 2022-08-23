/* Menu 3 - Hangar */
var MARGIN_TOP=15;
var MARGIN_LEFT=5;
var menuHangar = new Menu();
var cursorPreview = Object.assign({}, cursor);

var button_Hangar_back = new Button("Back", 450, 350, 100, 30, function toBack() { screenStack.shift(); }, null);
menuHangar.button.push(button_Hangar_back);

menuHangar.draw = function draw() {
  var context = CANVAS_MENU.getContext('2d');
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.button.forEach(function draw(b) { b.draw(); });
  // Display cursor
  context.beginPath();
  context.strokeStyle = '#009900';
  context.arc(inputListener.mouseX, inputListener.mouseY, 2, 0, Math.PI*2, true);
  context.stroke();
  cursorPreview.hull = cursor.hull;
  cursorPreview.engine = cursor.engine;
  cursorPreview.shield = cursor.shield;
};

// Left part ///////////////////////////////////////////////////////////////////

// Hull //

var buttonListLayout_hangar_hull = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonListResearch_hull = [];

// Check technology requirement and add button to menu
var check_buttonList_hangar_hull = function() {
  // Remove the button
  buttonListResearch_hull.forEach( function removeOld(b) {
    menuHangar.button.splice(menuHangar.button.indexOf(b), 1);
  });
  buttonListResearch_hull = [];
  // Add the button with the correct requirement
  topOfResearch(HULL_LIST.filter(function techlevelReq(hull) {
    return isUnlocked(hull);
  })).map( function(element, index) {
    return [element, buttonListLayout_hangar_hull[index]];
  }).forEach( function hullButton(hullAndLayout) {
    var hullData = hullAndLayout[0];
    var layoutData = hullAndLayout[1];
    var b = new Button(hullData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectHull() {
      cursor.hull = hullData;
    }, function previewHull() {
      cursorPreview.hull = hullData;
    });
    buttonListResearch_hull.push(b);
  });
  // Add the button
  buttonListResearch_hull.forEach( function inserNew(b) {
    menuHangar.button.push(b);
  });
}
check_buttonList_hangar_hull();

// Engine //

var buttonListLayout_hangar_engine = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonListResearch_engine = [];

// Check technology requirement and add button to menu
var check_buttonList_hangar_engine = function() {
  // Remove the button
  buttonListResearch_engine.forEach( function removeOld(b) {
    menuHangar.button.splice(menuHangar.button.indexOf(b), 1);
  });
  buttonListResearch_engine = [];
  // Add the button with the correct requirement
  topOfResearch(ENGINE_LIST.filter(function techlevelReq(engine) {
    return isUnlocked(engine);
  })).map( function(element, index) {
    return [element, buttonListLayout_hangar_engine[index]];
  }).forEach( function engineButton(engineAndLayout) {
    var engineData = engineAndLayout[0];
    var layoutData = engineAndLayout[1];
    var b = new Button(engineData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectEngine() {
      cursor.engine = engineData;
    }, function previewEngine() {
      cursorPreview.engine = engineData;
    });
    buttonListResearch_engine.push(b);
  });
  // Add the button
  buttonListResearch_engine.forEach( function inserNew(b) {
    menuHangar.button.push(b);
  });
}
check_buttonList_hangar_engine();

// Shield //

var buttonListLayout_hangar_shield = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonListResearch_shield = [];

// Check technology requirement and add button to menu
var check_buttonList_hangar_shield = function() {
  // Remove the button
  buttonListResearch_shield.forEach( function removeOld(b) {
    menuHangar.button.splice(menuHangar.button.indexOf(b), 1);
  });
  buttonListResearch_shield = [];
  // Add the button with the correct requirement
  topOfResearch(SHIELD_LIST.filter(function techlevelReq(shield) {
    return isUnlocked(shield);
  })).map( function(element, index) {
    return [element, buttonListLayout_hangar_shield[index]];
  }).forEach( function shieldButton(shieldAndLayout) {
    var shieldData = shieldAndLayout[0];
    var layoutData = shieldAndLayout[1];
    var b = new Button(shieldData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectShield() {
      cursor.generator = shieldData;
    }, null);
    buttonListResearch_shield.push(b);
  });
  // Add the button
  buttonListResearch_shield.forEach( function inserNew(b) {
    menuHangar.button.push(b);
  });
}
check_buttonList_hangar_shield();

// Middle part /////////////////////////////////////////////////////////////////

function createGradient(context, from, to) {
  var gradient = context.createLinearGradient(from, 0, to, 0);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(0.1, "#990000");
  gradient.addColorStop(0.5, "#CCCC33");
  gradient.addColorStop(1, "#33CCCC");
  gradient.addColorStop(0.9, "#009900");
  return gradient
};

function displayInformation(displayContext, displayText, displayData, baseX, baseY, previewData, scale) {
  if(displayData != previewData) {
    var gradientPreview = displayContext.createLinearGradient(baseX, 0, baseX+CANVAS_WIDTH/3-2*MARGIN_LEFT, 0);
    gradientPreview.addColorStop(0, "#000000");
    gradientPreview.addColorStop(0.1, "#990000");
    gradientPreview.addColorStop(0.5, "#CCCC33");
    gradientPreview.addColorStop(0.9, "#009900");
    gradientPreview.addColorStop(1, "#33CCCC");
    if(displayData > previewData) displayContext.fillStyle = "orange"
    else displayContext.fillStyle = "blue";
    displayContext.fillText(displayText + ": " + previewData, baseX, baseY);
    displayContext.fillStyle = gradientPreview;
    displayContext.fillRect(baseX, baseY+0.4*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*previewData*scale-2*MARGIN_LEFT, 0.6*GLOBAL_TEXT_SIZE);
  } else {
    displayContext.fillStyle = "black";
    displayContext.fillText(displayText + ": " + displayData, baseX, baseY);
  }
  var gradient = createGradient(displayContext, baseX, baseX+CANVAS_WIDTH/3-2*MARGIN_LEFT);
  displayContext.fillStyle = gradient;
  displayContext.fillRect(baseX, baseY+0.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*displayData*scale-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);
};

var button_hangar_display = new Button("", CANVAS_WIDTH/3+MARGIN_LEFT, MARGIN_TOP, CANVAS_WIDTH/3-MARGIN_LEFT*2, CANVAS_HEIGHT-MARGIN_TOP*2, null, null);
button_hangar_display.context = CANVAS_MENU.getContext('2d');
button_hangar_display.draw = function draw() {
      //cursorPreview = Object.assign({}, cursor);
      // Clear and set font
      this.context.clearRect(this.x, this.y, this.width, this.height);
      this.context.beginPath();
      this.context.lineWidth = 2;
      this.context.strokeStyle = "black";
      this.context.strokeRect(this.x, this.y, this.width, this.height);

      this.context.textAlign = "left";
      this.context.fillStyle = "black";
      this.context.font = GLOBAL_TEXT_SIZE.toString() + "px Times New Roman";

      // Hull, Engine and Shield name
      this.context.fillText("Hull: " + cursor.hull.code + " " +cursor.hull.name, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+GLOBAL_TEXT_SIZE);
      this.context.fillText("Engine: " + cursor.engine.code + " " +cursor.engine.name, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+3*GLOBAL_TEXT_SIZE);
      this.context.fillText("Generator: " + cursor.generator.code + " " +cursor.generator.name, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+5*GLOBAL_TEXT_SIZE);

      // Stats
      displayInformation(this.context, "Terminal velocity", cursor.hull.terminalVelocity, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+7*GLOBAL_TEXT_SIZE, cursorPreview.hull.terminalVelocity, 1/250);
      displayInformation(this.context, "Thrust", cursor.engine.thrust, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+9*GLOBAL_TEXT_SIZE, cursorPreview.engine.thrust, 1/250);
      displayInformation(this.context, "Shield capacity", (cursor.hull.shieldCapacity*cursor.generator.capacity/100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+11*GLOBAL_TEXT_SIZE, (cursorPreview.hull.shieldCapacity*cursorPreview.generator.capacity/100), 1/250);
      displayInformation(this.context, "Shield absorption", (cursor.hull.absorption*cursor.generator.absorption/100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+13*GLOBAL_TEXT_SIZE, (cursorPreview.hull.absorption*cursorPreview.generator.absorption/100), 1/250);
      displayInformation(this.context, "Shield repair", (cursor.engine.repair*cursor.generator.repair/100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+15*GLOBAL_TEXT_SIZE, (cursorPreview.engine.repair*cursorPreview.generator.repair/100), 1/250);
      displayInformation(this.context, "Heat tolerance", cursor.hull.heatTolerance, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+17*GLOBAL_TEXT_SIZE, cursorPreview.hull.heatTolerance, 1/250);
      displayInformation(this.context, "Heat dissipation", cursor.engine.dissipation, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+19*GLOBAL_TEXT_SIZE, cursorPreview.engine.dissipation, 1/250);

      // Space consumption
      this.context.fillStyle = "black";
      this.context.fillText("Space: ", this.x+MARGIN_LEFT, this.y+MARGIN_TOP+21*GLOBAL_TEXT_SIZE);
      var totalCargo = cursor.hull.cargo*4;
      var usedCargo = cursor.engine.space + cursor.generator.space;
      if(totalCargo > usedCargo*2) {
        this.context.fillStyle = "green";
      } else if(totalCargo >= usedCargo) {
        this.context.fillStyle = "orange";
      } else if(totalCargo < usedCargo) {
        this.context.fillStyle = "brown";
      }
      this.context.fillText(usedCargo + " / " + totalCargo, this.x+MARGIN_LEFT+GLOBAL_TEXT_SIZE*4, this.y+MARGIN_TOP+21*GLOBAL_TEXT_SIZE);
  };

menuHangar.button.push(button_hangar_display);

// Right part /////////////////////////////////////////////////////////////////

// Weapon //

var buttonListLayout_hangar_weapon = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+4*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+4*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+4*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT+CANVAS_WIDTH*3/4, y: 4+MARGIN_TOP+4*GLOBAL_TEXT_SIZE+0*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonListResearch_weapon = [];

// Check technology requirement and add button to menu
var check_buttonList_hangar_weapon = function() {
  // Remove the button
  buttonListResearch_weapon.forEach( function removeOld(b) {
    menuHangar.button.splice(menuHangar.button.indexOf(b), 1);
  });
  buttonListResearch_weapon = [];
  // Add the button with the correct requirement
  topOfResearch(WEAPON_LIST.filter(function techlevelReq(weapon) {
    return isUnlocked(weapon);
  })).map( function(element, index) {
    return [element, buttonListLayout_hangar_weapon[index]];
  }).forEach( function weaponButton(weaponAndLayout) {
    var weaponData = weaponAndLayout[0];
    var layoutData = weaponAndLayout[1];
    var b = new Button(weaponData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectWeapon() {
      //TODO list of weapon
      cursor.weaponData = [weaponData];
    }, null);
    buttonListResearch_weapon.push(b);
  });
  // Add the button
  buttonListResearch_weapon.forEach( function inserNew(b) {
    menuHangar.button.push(b);
  });
}
check_buttonList_hangar_weapon();
// MODULE_LIST
// SUBSYSTEM_LIST
