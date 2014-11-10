var keymap = {};
document.addEventListener('keydown', function(e) {
  keymap[e.which] = true;
  switch(e.which) {
    case 87: // w
      break;
    case 65: // a
      break;
    case 83: // s
      break;
    case 68: // d
      break;
  }
});
document.addEventListener('keyup', function(e) {
  keymap[e.which] = false;
});

var lastRenderTime = Date.now();
var frameDuration;

var ship = {
  position: [10, 10],
  direction: 90,
  vector: [0, 0]
};

function loop() {
  var d = Date.now();
  frameDuration = d - lastRenderTime;
  if (d - lastRenderTime > 1000/30) {
    applyForces();
    moveBodies();
    render();
    lastRenderTime = d;
  }
  requestAnimationFrame(loop);
}
loop();

// Apply forces
function applyForces() {
  if (keymap[83]) {
    var force = 0.00001 * frameDuration;
    var direction = 2*Math.PI * (ship.direction - 90) / 360;
    ship.vector[0] += force * Math.cos(direction);
    ship.vector[1] += force * Math.sin(direction);
  }
  if (keymap[65]) {
    ship.direction -= (0.1 * frameDuration);
  }
  if (keymap[68]) {
    ship.direction += (0.1 * frameDuration);
  }
}

// Tick motion
function moveBodies() {
  ship.position[0] += (ship.vector[0] * frameDuration);
  ship.position[1] += (ship.vector[1] * frameDuration);
}

// Render bodies on the screen
function render() {
  $("body").empty();
  $("body").append("<div class='ship'></div>");
  var $ship = $(".ship");
  $ship.css({
    left: Math.floor(ship.position[0]),
    top: Math.floor(ship.position[1]),
    transform: 'rotate(' + ship.direction + 'deg)'
  });
}

