/* Menu 4 - Research */
var menuResearch = new Menu();

var MARGIN_TOP=15;
var MARGIN_LEFT=5;
var HEXAGON_SIZE=30;

var button_Research_back = new Button("Back", 450, 350, 100, 30, function toBack() {
  CANVAS_BACKGROUND.getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  check_buttonList_hangar_hull();
  check_buttonList_hangar_engine();
  check_buttonList_hangar_shield();
  screenStack.shift();
});
menuResearch.button.push(button_Research_back);

var button_Research_launch = new Button("Develop", 450, 265, 100, 30, function developResearch() {
  CurrentResearchLevel[current_research_node.code] = 1;
});

var layoutTranspose = function(slide, mount) {
  return {x: CANVAS_WIDTH/2-CANVAS_WIDTH/6 - ((slide-mount)*3/4*HEXAGON_SIZE), y: CANVAS_HEIGHT/2 + ((slide/2+mount/2)*HEXAGON_SIZE) - MARGIN_TOP*2};
}

var buttonList_research = RESEARCH_LIST.forEach( function researchButton(researchData) {
  var layoutData = layoutTranspose(researchData.slide, researchData.mount);
  var b = new Button(researchData.code, layoutData.x, layoutData.y, HEXAGON_SIZE*3/4, HEXAGON_SIZE, function selectResearch() {
    current_research_node = researchData;
  });
  menuResearch.button.push(b);
});

var current_research_node = null;

var button_research_leveldisplay = new Button("", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, null);
button_research_leveldisplay.context = CANVAS_BACKGROUND.getContext('2d');
button_research_leveldisplay.draw = function draw() {
  this.context.clearRect(this.x, this.y, this.width, this.height);
  if(screenStack[0] == menuResearch) {
    this.context.beginPath();
    var colourContext = this.context;
    var lockedColour = 'rgba(0,0,0,0.1)';
    var colourCode = {"INF": 'rgba(0,0,159,0.1)', "ENE":'rgba(0,159,0,0.1)', "PHY":'rgba(159,0,0,0.1)',
    "CYM":'rgba(0,127,127,0.1)', "KNM":'rgba(127,0,127,0.1)', "CHM":'rgba(127,127,0,0.1)'};
    RESEARCH_LIST.forEach( function colourResearchTree(researchData) {
      var layoutData = layoutTranspose(researchData.slide, researchData.mount);
      var unlocked = isUnlocked(researchData);
      var colour = colourCode[researchData.subCategory];
      if(isUnlocked(researchData)) colourContext.fillStyle = colour;
      else colourContext.fillStyle = lockedColour;
      colourContext.fillRect(layoutData.x, layoutData.y, HEXAGON_SIZE*3/4, HEXAGON_SIZE);
    });
  }
}

menuResearch.button.push(button_research_leveldisplay);

var button_research_display = new Button("", CANVAS_WIDTH*2/3+MARGIN_LEFT, MARGIN_TOP, CANVAS_WIDTH/3-MARGIN_LEFT*2, CANVAS_HEIGHT*4/5-MARGIN_TOP*2, null);
button_research_display.context = CANVAS_MENU.getContext('2d');
button_research_display.draw = function draw() {
      this.context.clearRect(this.x, this.y, this.width, this.height);
      this.context.beginPath();
      this.context.lineWidth = 2;
      this.context.strokeStyle = "black";
      this.context.strokeRect(this.x, this.y, this.width, this.height);

      if(current_research_node != null) {
        this.context.textAlign = "left";
        this.context.fillStyle = "black";
        this.context.font = GLOBAL_TEXT_SIZE.toString() + "px Times New Roman";

        // Name and characteristics
        this.context.fillText("Domain: " + current_research_node.name, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+GLOBAL_TEXT_SIZE);
        this.context.fillText("Topic: " + current_research_node.code, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+2*GLOBAL_TEXT_SIZE);
        this.context.fillText("Cost: " + current_research_node.cost, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+3*GLOBAL_TEXT_SIZE);
        textWrapping(this.context, "Requirement: " + current_research_node.requirement.join(', '), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+4*GLOBAL_TEXT_SIZE, this.width-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);
        this.context.fillText("Bonus: ", this.x+MARGIN_LEFT, this.y+MARGIN_TOP+6*GLOBAL_TEXT_SIZE);
        textWrapping(this.context, current_research_node.bonus, this.x+MARGIN_LEFT, this.y+MARGIN_TOP+7*GLOBAL_TEXT_SIZE, this.width-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);
        this.context.fillText("Unlock: ", this.x+MARGIN_LEFT, this.y+MARGIN_TOP+12*GLOBAL_TEXT_SIZE);
        textWrapping(this.context, thisUnlockPart(current_research_node), this.x+MARGIN_LEFT, this.y+MARGIN_TOP+13*GLOBAL_TEXT_SIZE, this.width-2*MARGIN_LEFT, GLOBAL_TEXT_SIZE);

        var indexOfButton = menuResearch.button.indexOf(button_Research_launch);

        // Add or remove the button to launch research
        if(isUnlocked(current_research_node) && indexOfButton < 0) {
          menuResearch.button.push(button_Research_launch);
        } else if(!isUnlocked(current_research_node) && indexOfButton > -1) {
          menuResearch.button.splice(indexOfButton, 1);
        }
      }
      /*
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
      */
  };

menuResearch.button.push(button_research_display);
