// keymap holds current status of keys
var keymap = {};
document.addEventListener('keydown', function(e) {
  keymap[e.which] = true;
});
document.addEventListener('keyup', function(e) {
  keymap[e.which] = false;
});

// Timestamp for last render.
var lastRenderTime = Date.now();
// Duration of current frame.
var frameDuration;

var ship = {
  position: [10, 10],
  direction: 0,
  vector: [0, 0]
};


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
  $(".game").append("<div class='ship'>&#x27a4;</div>");
  var $ship = $(".ship");
  $ship.css({
    left: Math.floor(ship.position[0]),
    top: Math.floor(ship.position[1]),
    transform: 'rotate(' + ship.direction + 'rad)'
  });
}

/** Loop that runs the game
 *
 */
function loop() {
  var d = Date.now();
  frameDuration = d - lastRenderTime;
  if (d - lastRenderTime > 50) {
    applyForces();
    moveBodies();
    render();
    lastRenderTime = d;
  }
  requestAnimationFrame(loop);
}

// Init.
loop();
