function stillAlive(o) { return o.state.alive || o.state.lifespan != 0; };
function checkDeath(o) { if(!o.state.alive && o.state.lifespan < Date.now()) o.state.lifespan = 0; };

function textWrapping(context, text, x, y, maxWidth, lineHeight) {
  text.split(' ').reduce(function lineDelimiter(currentLine, currentWord) {
    if(context.measureText(currentLine+currentWord+' ').width > maxWidth) {
      context.clearRect(x, y-lineHeight, maxWidth, lineHeight);
      context.fillText(currentLine, x, y);
      y += lineHeight;
      return currentWord+' ';
    } else {
      context.clearRect(x, y-lineHeight, maxWidth, lineHeight);
      context.fillText(currentLine+currentWord+' ', x, y);
      return currentLine+currentWord+' ';
    }
  })
};
