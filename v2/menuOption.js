/* Menu 5 - Option */
var menuOption = new Menu();

var button_Option_back = new Button("Back", 450, 250, 100, 30, function toBack() { screenStack.shift(); });
menuOption.button.push(button_Option_back);
