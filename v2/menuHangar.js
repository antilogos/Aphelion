/* Menu 3 - Hangar */
var MARGIN_TOP=15;
var MARGIN_LEFT=5;
var menuHangar = new Menu();

var button_Hangar_back = new Button("Back", 450, 350, 100, 30, function toBack() { screenStack.shift(); });
menuHangar.button.push(button_Hangar_back);

var buttonListLayout_hangar_hull = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonList_hangar_hull = HULL_LIST.filter(function techlevelReq(hull) { return hull.techlevel == 1;
}).map( function(element, index) {
  return [element, buttonListLayout_hangar_hull[index]];
}).forEach( function hullButton(hullAndLayout) {
  var hullData = hullAndLayout[0];
  var layoutData = hullAndLayout[1];
  var b = new Button(hullData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectHull() {
    cursor.hull = hullData;
  });
  menuHangar.button.push(b);
});

var buttonListLayout_hangar_engine = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonList_hangar_engine = ENGINE_LIST.filter(function techlevelReq(engine) { return engine.techlevel == 1;
}).map( function(element, index) {
  return [element, buttonListLayout_hangar_engine[index]];
}).forEach( function engineButton(engineAndLayout) {
  var engineData = engineAndLayout[0];
  var layoutData = engineAndLayout[1];
  var b = new Button(engineData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectEngine() {
    cursor.engine = engineData;
  });
  menuHangar.button.push(b);
});

var buttonListLayout_hangar_shield = [{x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+0*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 0*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 1*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 2*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8},
  {x: 3*CANVAS_WIDTH/3/4+MARGIN_LEFT, y: 4+MARGIN_TOP+2*GLOBAL_TEXT_SIZE+2*CANVAS_HEIGHT/3, width: CANVAS_WIDTH/3/4-MARGIN_LEFT*2, height: GLOBAL_TEXT_SIZE*2-8}];

var buttonList_hangar_shield = SHIELD_LIST.filter(function techlevelReq(shield) { return shield.techlevel == 1;
}).map( function(element, index) {
  return [element, buttonListLayout_hangar_shield[index]];
}).forEach( function shieldButton(shieldAndLayout) {
  var shieldData = shieldAndLayout[0];
  var layoutData = shieldAndLayout[1];
  var b = new Button(shieldData.code, layoutData.x, layoutData.y, layoutData.width, layoutData.height, function selectShield() {
    cursor.generator = shieldData;
  });
  menuHangar.button.push(b);
});

var button_hangar_display = new Button("", CANVAS_WIDTH/3+MARGIN_LEFT, MARGIN_TOP, CANVAS_WIDTH/3-MARGIN_LEFT*2, CANVAS_HEIGHT-MARGIN_TOP*2, null);
button_hangar_display.context = CANVAS_MENU.getContext('2d');
button_hangar_display.draw = function draw() {
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
      var gradient = this.context.createLinearGradient(this.x+MARGIN_LEFT, 0, this.x+CANVAS_WIDTH/3-2*MARGIN_LEFT, 0);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.1, "#990000");
      gradient.addColorStop(0.5, "#CCCC33");
      gradient.addColorStop(0.9, "#009900");
      gradient.addColorStop(1, "#33CCCC");

      this.context.fillStyle = "black";
      this.context.fillText("Velocity: " + cursor.hull.velocity, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+7*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+7.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*cursor.hull.velocity/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Thrust: " + cursor.engine.thrust, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+9*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+9.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*cursor.engine.thrust/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Shield capacity: " + (cursor.hull.shieldCapacity*cursor.generator.capacity/100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+11*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+11.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*(cursor.hull.shieldCapacity*cursor.generator.capacity/100)/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Shield absorption: " + (cursor.hull.absorption*cursor.generator.absorption*100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+13*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+13.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*(cursor.hull.absorption*cursor.generator.absorption/100)/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Shield repair: " + (cursor.engine.repair*cursor.generator.repair/100), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+15*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+15.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*(cursor.engine.repair*cursor.generator.repair/100)/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Heat tolerance: " + cursor.hull.heatTolerance, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+17*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+17.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*cursor.hull.heatTolerance/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

      this.context.fillStyle = "black";
      this.context.fillText("Heat dissipation: " + cursor.engine.dissipation, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+19*GLOBAL_TEXT_SIZE);
      this.context.fillStyle = gradient;
      this.context.fillRect(this.x+MARGIN_LEFT, this.y+MARGIN_TOP+19.2*GLOBAL_TEXT_SIZE, CANVAS_WIDTH/3*cursor.engine.dissipation/250-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

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
