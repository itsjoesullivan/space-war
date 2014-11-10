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

var height = $("body").height();
var width = $("body").width();

var bodies = [
  {
    type: 'ship',
    id: 0,
    position: [ Math.floor(width/2) - 150, Math.floor(height/2)],
    direction: Math.PI,
    vector: [0, 0],
    lastFire: Date.now()
  },
  {
    type: 'ship',
    id: 1,
    position: [Math.floor(width/2) + 150, Math.floor(height/2)],
    direction: 0,
    vector: [0, 0],
    lastFire: Date.now()
  },
];


// Apply forces
function applyForces() {
  bodies.forEach(function(body, i) {
    if (body.type === 'ship') {
      var ship = body;
      // Thruster
      if ((ship.id === 0 && keymap[83]) || (ship.id === 1 && keymap[40])) {
        var force = 0.00001 * frameDuration;
        ship.vector[0] += force * Math.cos(ship.direction);
        ship.vector[1] += force * Math.sin(ship.direction);
      }
      // Rotate left
      if ((ship.id === 0 && keymap[65]) || (ship.id === 1 && keymap[37])) {
        ship.direction -= (0.001 * frameDuration);
      }
      // Rotate right
      if ((ship.id === 0 && keymap[68]) || (ship.id === 1 && keymap[39])) {
        ship.direction += (0.001 * frameDuration);
      }
    }
  });
}

// Tick motion
function moveBodies() {
  bodies.forEach(function(body) {
    body.position[0] += (body.vector[0] * frameDuration);
    body.position[1] += (body.vector[1] * frameDuration);
  });
}

// Render bodies on the screen
function render() {
  $(".game").empty();
  // Render ship
  bodies.forEach(function(body) {
    if (body.type === 'ship') {
      var ship = body;
      var $ship = $("<div class='ship'>&#x27a4;</div>");
      $(".game").append($ship);
      $ship.css({
        left: Math.floor(ship.position[0]),
        top: Math.floor(ship.position[1]),
        transform: 'rotate(' + ship.direction + 'rad)'
      });
      if (ship.dead) {
        $ship.addClass('dead');
      }
    } else if (body.type === 'missile') {
      var missile = body;
      var $missile = $("<div class='missile'>&middot;</div>");
      $(".game").append($missile);
      $missile.css({
        left: Math.floor(missile.position[0]),
        top: Math.floor(missile.position[1]),
        transform: 'rotate(' + missile.direction + 'rad)'
      });
    }
  });
}

// Remove missiles that are out of range
function cullBodies() {
  bodies.forEach(function(body, i) {
    if (body.type === 'missile') {
      var x = body.position[0],
        y = body.position[1];
      if (x < -2000 || y < -2000 || x > 2000 || y > 2000) {
        bodies.splice(i,1);
      }
    }
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function launchMissiles() {
  if (keymap[87]) {
    launchMissileFrom(bodies[0]);
  }
  if (keymap[38]) {
    launchMissileFrom(bodies[1]);
  }
}

// Launch a missile from a given ship.
function launchMissileFrom(ship) {
  var d = Date.now()
  if (d - ship.lastFire > 500) {
    var force = 0.1;
    ship.lastFire = d;
    var missile = {
      type: 'missile',
      direction: ship.direction,
      position: clone(ship.position),
      vector: clone(ship.vector),
      time: d
    };
    // Add some initial thrust in direction of ship
    missile.vector[0] += force * Math.cos(ship.direction);
    missile.vector[1] += force * Math.sin(ship.direction);
    bodies.push(missile);
  }
}

// Identify collisions
function triggerCollisions() {
  bodies.forEach(function(ship, i) {
    if (ship.type !== 'ship') return;
    bodies.forEach(function(missile, j) {
      if (Date.now() - missile.time > 1000) {
        if (missile.type !== 'missile') return;
        var xDist = Math.abs(missile.position[0] - ship.position[0]);
        var yDist = Math.abs(missile.position[1] - ship.position[1]);
        var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        if (distance < 10) {
          destroy(ship);
        }
      }
    });
  });
}

var gameOver = false;
function destroy(ship) {
  gameOver = true;
  ship.dead = true;
}


/** Loop that runs the game
 *
 */
function loop() {
  if (!gameOver) {
    var d = Date.now();
    frameDuration = d - lastRenderTime;
    if (d - lastRenderTime > 1000/48) {
      cullBodies();
      triggerCollisions();
      launchMissiles();
      applyForces();
      moveBodies();
      render();
      lastRenderTime = d;
    }
    requestAnimationFrame(loop);
  } else {
    render();
  }
}

// Init.
loop();
