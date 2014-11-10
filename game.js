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

var ships = [
  {
    position: [100, 100],
    direction: 0,
    vector: [0, 0]
  },
  {
    position: [100, 130],
    direction: Math.PI,
    vector: [0, 0]
  }
];


// Apply forces
function applyForces() {
  ships.forEach(function(ship, i) {
    // Thruster
    if ((i === 0 && keymap[83]) || (i === 1 && keymap[40])) {
      var force = 0.00001 * frameDuration;
      ship.vector[0] += force * Math.cos(ship.direction);
      ship.vector[1] += force * Math.sin(ship.direction);
    }
    // Rotate left
    if ((i === 0 && keymap[65]) || (i === 1 && keymap[37])) {
      ship.direction -= (0.001 * frameDuration);
    }
    // Rotate right
    if ((i === 0 && keymap[68]) || (i === 1 && keymap[39])) {
      ship.direction += (0.001 * frameDuration);
    }
  });
}

// Tick motion
function moveBodies() {
  ships.forEach(function(ship) {
    ship.position[0] += (ship.vector[0] * frameDuration);
    ship.position[1] += (ship.vector[1] * frameDuration);
  });
}

// Render bodies on the screen
function render() {
  $(".game").empty();
  // Render ship
  ships.forEach(function(ship) {
    var $ship = $("<div class='ship'>&#x27a4;</div>");
    $(".game").append($ship);
    $ship.css({
      left: Math.floor(ship.position[0]),
      top: Math.floor(ship.position[1]),
      transform: 'rotate(' + ship.direction + 'rad)'
    });
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
