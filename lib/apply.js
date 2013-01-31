"use strict"; "use restrict";

var rle               = require("rle");
var repair            = require("rle-repair");
var VolumeBuilder     = rle.VolumeBuilder;
var beginStencil      = rle.beginStencil;
var removeDuplicates  = repair.removeDuplicates;

//Applies a function to the volume
module.exports = function(volume, stencil, func) {
  var distances = new Array(stencil.length)
    , phases    = new Array(stencil.length)
    , nvolume   = new VolumeBuilder()
    , retval    = [ 0, 1.0 ];
  nvolume.pop()
  for(var iter=createStencil(volume, stencil); iter.hasNext(); iter.next()) {
    func(iter.phases(phases), iter.distances(distances), retval);
    var c = iter.coord;
    nvolume.push(c[0], c[1], c[2], retval[1], retval[0]);
  }
  removeDuplicates(nvolume);
  return nvolume.makeVolume();
}