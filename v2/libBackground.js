/*
 * Background animation
 * XXX just some debug drawing for the moment
 * TODO fx factory
 */
function Background() {
  this.context = CANVAS_BACKGROUND.getContext('2d');
  this.width = CANVAS_WIDTH;
  this.height = CANVAS_HEIGHT;

  this.draw = function draw() {
    // Get the scrolling positive step for grid calculation
    var cornerX = (Math.floor(cursor.position.h - CANVAS_WIDTH/2)%100+100)%100;
    var cornerY = (Math.floor(cursor.position.v - CANVAS_HEIGHT/2)%100+100)%100;
    // Deduce corners relative positions
    var relX = Math.floor(cursor.position.h - CANVAS_WIDTH/2);
    var relY = Math.floor(cursor.position.v - CANVAS_HEIGHT/2);

    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Horizontal landmark
    for (var i=100-cornerX ; i<this.width ; i+= 100) {
      this.context.beginPath();
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.height);
      this.context.lineWidth = 1;
      this.context.strokeStyle = 'black';
      this.context.stroke();
      this.context.font = '8pt Calibri';
      this.context.fillStyle = 'black';
      this.context.fillText(""+(relX+i), i+10, 10);
    }
    // Vertical landmark
    for (var i=100-cornerY ; i<this.height ; i+= 100) {
      this.context.beginPath();
      this.context.moveTo(0, i);
      this.context.lineTo(this.width, i);
      this.context.lineWidth = 1;
      this.context.strokeStyle = 'black';
      this.context.stroke();
      this.context.font = '8pt Calibri';
      this.context.fillStyle = 'black';
      this.context.fillText(""+(relY+i), 10, 10+i);
    }
    // Display mouse pointer
    this.context.beginPath();
    this.context.strokeStyle = '#009900';
    this.context.arc(inputListener.mouseX, inputListener.mouseY, 2, 0, Math.PI*2, true);
    this.context.stroke();
  }
}
