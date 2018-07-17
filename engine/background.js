
function Background() {
	this.init = function() {
		// Default variables
		this.x = 0;
		this.y = 0;
		this.width = fieldMenu.canvas.clientWidth*100;
		this.height = fieldMenu.canvas.clientHeight*100;
	}

	this.draw = function () {
		// Get the scrolling positive step for grid calculation
		var cornerX = (Math.floor(fieldMenu.cursor.positionH - fieldMenu.canvas.clientWidth/2)%100+100)%100;
		var cornerY = (Math.floor(fieldMenu.cursor.positionV - fieldMenu.canvas.clientHeight/2)%100+100)%100;
		// Deduce corners relative positions
		var relX = Math.floor(fieldMenu.cursor.positionH - fieldMenu.canvas.clientWidth/2);
		var relY = Math.floor(fieldMenu.cursor.positionV - fieldMenu.canvas.clientHeight/2);
		this.context = fieldMenu.bgCanvas.getContext('2d');
	    this.context.clearRect(0, 0, this.width, this.height);
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
	}
}