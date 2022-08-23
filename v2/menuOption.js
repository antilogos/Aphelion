/* Menu 5 - Option */
var menuOption = new Menu();

var button_option_display = new Button("", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, null, null);
button_option_display.context = CANVAS_MENU.getContext('2d');
button_option_display.draw = function draw() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.fillStyle = 'rgba(255,255,255,0.9)';
    this.context.fillRect(this.x, this.y, this.width, this.height);
}

menuOption.button.push(button_option_display);

var button_option_back = new Button("Back", CANVAS_WIDTH/2-50, CANVAS_HEIGHT/2-15, 100, 30, function toBack() { screenStack.shift(); }, null);
menuOption.button.push(button_option_back);
