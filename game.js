var keymap = {};
document.addEventListener('keydown', function(e) {
  keymap[e.which] = true;
});
document.addEventListener('keyup', function(e) {
  keymap[e.which] = false;
});

var lastRenderTime = Date.now();
var frameDuration;

var ship = {
  position: [10, 10],
  direction: 0,
  vector: [0, 0],
  mass: 1
};

var sun = {
  position: [200, 200],
  mass: 100
};

function loop() {
  var d = Date.now();
  frameDuration = d - lastRenderTime;
  if (d - lastRenderTime > 1000/60) {
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
  // Thruster
  if (keymap[83]) {
    var force = 0.00001 * frameDuration;
    ship.vector[0] += force * Math.cos(ship.direction);
    ship.vector[1] += force * Math.sin(ship.direction);
  }
  // Rotate left
  if (keymap[65]) {
    ship.direction -= (0.001 * frameDuration);
  }
  // Rotate right
  if (keymap[68]) {
    ship.direction += (0.001 * frameDuration);
  }

  // Handle sun
  var xDist = sun.position[0] - ship.position[0];
  var yDist = sun.position[1] - ship.position[1];
  var distance = Math.sqrt(Math.pow(Math.abs(xDist),2) + Math.pow(Math.abs(yDist),2));
  var G = 1;
  var force = G * sun.mass * ship.mass / Math.pow(distance,2);
}

// Tick motion
function moveBodies() {
  ship.position[0] += (ship.vector[0] * frameDuration);
  ship.position[1] += (ship.vector[1] * frameDuration);
}

// Render bodies on the screen
function render() {
  $(".game").empty();

  // Render ship
  $(".game").append("<div class='ship'></div>");
  var $ship = $(".ship");
  $ship.css({
    left: Math.floor(ship.position[0]),
    top: Math.floor(ship.position[1]),
    transform: 'rotate(' + ship.direction + 'rad)'
  });

  // Render sun
  $(".game").append("<div class='sun'></div>");
  var $sun = $(".sun");
  $sun.css({
    left: Math.floor(sun.position[0]),
    top: Math.floor(sun.position[1]),
  });
}

