(function(){
d = document;
D = function() { return Date.now(); };
d.c = d.createElement;
d.b = d.body;
var s = d.c('style');
var M = Math;
s.innerHTML =  'html,body{height:100%;width:100%;overflow:hidden;}body{background-color:#000;}div{position:absolute;}.s{width:1em;height:1em;color:#ddd;}.dead{color:red;}.m{width:1em;height:1em;color:#ddd;}';
d.head.appendChild(s);
game = document.c('div');
game.className = 'game';
game.a = game.appendChild;
d.b.appendChild(game);
// keymap holds current status of keys
var keymap = {};
d.addEventListener('keydown', function(e) {
  keymap[e.which] = true;
});
d.addEventListener('keyup', function(e) {
  keymap[e.which] = false;
});

// Timestamp for last render.
var lR = D();
// Duration of current frame.
var fD;

var height = d.b.offsetHeight;
var width = d.b.offsetWidth;

var bodies = [
  {
    t: 's',
    id: 0,
    p: [ width/2 - 150, height/2],
    d: M.PI,
    v: [0, 0],
    l: D()
  },
  {
    t: 's',
    id: 1,
    p: [width/2 + 150, height/2],
    d: 0,
    v: [0, 0],
    l: D()
  },
];
bodies.e = bodies.forEach


// Apply forces
function applyForces() {
  bodies.e(function(body, i) {
    if (body.t === 's') {
      var ship = body;
      // Thruster
      if ((ship.id === 0 && keymap[83]) || (ship.id === 1 && keymap[40])) {
        var force = 0.00001 * fD;
        ship.v[0] += force * M.cos(ship.d);
        ship.v[1] += force * M.sin(ship.d);
      }
      // Rotate left
      if ((ship.id === 0 && keymap[65]) || (ship.id === 1 && keymap[37])) {
        ship.d -= (0.001 * fD);
      }
      // Rotate right
      if ((ship.id === 0 && keymap[68]) || (ship.id === 1 && keymap[39])) {
        ship.d += (0.001 * fD);
      }
    }
  });
}

// Tick motion
function moveBodies() {
  bodies.e(function(body) {
    body.p[0] += (body.v[0] * fD);
    body.p[1] += (body.v[1] * fD);
  });
}

// Render bodies on the screen
function render() {
  game.innerHTML = '';
  // Render ship
  bodies.e(function(body) {
    if (body.t === 's') {
      var ship = body;
      var $ship = $("<div class='s'>&#x27a4;</div>");
      game.a($ship[0]);
      $ship.css({
        left: ship.p[0],
        top: ship.p[1],
        transform: 'rotate(' + ship.d + 'rad)'
      });
      if (ship.dead) {
        $ship.addClass('dead');
      }
    } else if (body.t === 'm') {
      var missile = body;
      var $missile = $("<div class='m'>&middot;</div>");
      game.a($missile[0]);
      $missile.css({
        left: missile.p[0],
        top: missile.p[1],
        transform: 'rotate(' + missile.d + 'rad)'
      });
    }
  });
}

// Remove missiles that are out of range
function cullBodies() {
  bodies.e(function(body, i) {
    if (body.t === 'm') {
      var x = body.p[0],
        y = body.p[1];
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
  var d = D()
  if (d - ship.l > 500) {
    var force = 0.1;
    ship.l = d;
    var missile = {
      t: 'm',
      d: ship.d,
      p: clone(ship.p),
      v: clone(ship.v),
      time: d
    };
    // Add some initial thrust in direction of ship
    missile.v[0] += force * M.cos(ship.d);
    missile.v[1] += force * M.sin(ship.d);
    bodies.push(missile);
  }
}

// Identify collisions
function triggerCollisions() {
  bodies.e(function(ship, i) {
    if (ship.t !== 's') return;
    bodies.e(function(missile, j) {
      if (D() - missile.time > 1000) {
        if (missile.t !== 'm') return;
        var x = M.abs(missile.p[0] - ship.p[0]);
        var y = M.abs(missile.p[1] - ship.p[1]);
        var distance = M.sqrt(x * x + y * y);
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
    var d = D()
    fD = d - lR;
    if (d - lR > 1000/48) {
      cullBodies();
      triggerCollisions();
      launchMissiles();
      applyForces();
      moveBodies();
      render();
      lR = d;
    }
    requestAnimationFrame(loop);
  } else {
    render();
  }
}

// Init.
loop();

})();
