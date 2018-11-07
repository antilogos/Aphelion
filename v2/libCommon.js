function stillAlive(o) { return o.state.alive || o.state.lifespan != 0; };
function checkDeath(o) { if(!o.state.alive && o.state.lifespan < Date.now()) o.state.lifespan = 0; };

function textWrapping(context, text, x, y, maxWidth, lineHeight) {
  text.split('\n').forEach(function lineDelimiter(paragraph) {
    paragraph.split(' ').reduce(function wordDelimiter(currentLine, currentWord) {
     if(context.measureText(currentLine+' '+currentWord).width > maxWidth) {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine, x, y);
       y += lineHeight;
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentWord, x, y);
       return currentWord;
     } else {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine+' '+currentWord, x, y);
       return currentLine+' '+currentWord;
     }
   });
   y += lineHeight;
 });
};
