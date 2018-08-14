function stillAlive(o) { return o.state.alive || o.state.lifespan != 0; };
function checkDeath(o) { if(!o.state.alive && o.state.lifespan < Date.now()) o.state.lifespan = 0; };
