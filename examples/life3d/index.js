var $         = require("jquery-browserify")
  , core      = require("rle-core")
  , mesh      = require("rle-mesh")
  , stencils  = require("rle-stencils")
  , funcs     = require("../../index.js");

var INITIAL_RADIUS  = 16;
var CENTER_INDEX    = 1 + 3 + 9;
var neighborhood    = stencils.moore(1);

//Bounds for birth
var SURVIVE_LO      = 4;
var SURVIVE_HI      = 5;
var BIRTH_LO        = 5;
var BIRTH_HI        = 5;

//Initial density
var INITIAL_DENSITY = 0.2;

//Advance game of life one tick
function step(volume) {
  return funcs.apply(volume, neighborhood, function(phases, distances, retval) {
    retval[1] = 1.0;
    //Count neighbors
    var neighbors = 0;
    for(var i=0; i<27; ++i) {
      if(i !== CENTER_INDEX && phases[i]) {
        ++neighbors;
      }
    }
    //Compute next state
    if(phases[CENTER_INDEX]) {
      if(SURVIVE_LO <= neighbors && neighbors <= SURVIVE_HI) {
        retval[0] = 1;
        return;
      }
    } else if(BIRTH_LO <= neighbors && neighbors <= BIRTH_HI) {
      retval[0] = 1;
      return;
    }
    retval[0] = 0;
    return;
  });
}

$(document).ready(function() {
  //Create viewer
  var viewer = require("gl-shells").makeViewer();
  //Create random table
  var table = new Array(8*INITIAL_RADIUS*INITIAL_RADIUS*INITIAL_RADIUS);
  for(var i=0; i<table.length; ++i) {
    table[i] = Math.random() < INITIAL_DENSITY ? 1 : 0;
  }
  //Initialize volume with random stuff
  var state = core.sample(
    [-INITIAL_RADIUS,-INITIAL_RADIUS,-INITIAL_RADIUS],
    [ INITIAL_RADIUS, INITIAL_RADIUS, INITIAL_RADIUS], function(x) {
    for(var i=0; i<3; ++i) {
      if(x[i] <= -INITIAL_RADIUS || x[i] >= INITIAL_RADIUS-1) {
        return -1;
      }
    }
    var n = x[0] + INITIAL_RADIUS +
          2 * INITIAL_RADIUS * ( x[1] + INITIAL_RADIUS +
            2 * INITIAL_RADIUS * ( x[2] + INITIAL_RADIUS ));
    return table[n%table.length];
  });
  //Set up interval to tick state
  setInterval(function() {
    state = step(state);
    viewer.updateMesh(mesh(state));
  }, 500);
  //Draw initial mesh
  viewer.updateMesh(mesh(state));
});