/* Menu 1 - Main */
var menuMain = new Menu();

var button_Main_Headquarter = new Button("To Headquarter", 50, 50, 100, 30, function toHeadquarter() { screenStack.unshift(menuHeadquarter); });
menuMain.button.push(button_Main_Headquarter);
var button_Main_Hangar = new Button("To Hangar", 250, 50, 100, 30, function toHangar() { screenStack.unshift(menuHangar); });
menuMain.button.push(button_Main_Hangar);
var button_Main_Research = new Button("To Research", 450, 50, 100, 30, function toField() { screenStack.unshift(menuResearch); });
menuMain.button.push(button_Main_Research);
var button_Main_Field = new Button("To Field", 250, 250, 100, 30, function toField() { screenStack.unshift(menuField); });
menuMain.button.push(button_Main_Field);
