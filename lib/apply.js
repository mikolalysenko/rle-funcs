"use strict"; "use restrict";

var core              = require("rle-core");
var removeDuplicates  = require("rle-repair").removeDuplicates;

//Applies a function to the volume
module.exports = function(volume, stencil, func) {
  var vdistances  = volume.distances
    , vphases     = volume.phases
    , stencil_len = (stencil.length / 3) | 0
    , distances   = new Float64Array(stencil_len)
    , phases      = new Int32Array(stencil_len)
    , nvolume     = new core.DynamicVolume()
    , retval      = [ 0, 1.0 ]
    , iter        = core.beginStencil(volume, stencil)
    , ptrs        = iter.ptrs
    , c           = iter.coord;
  nvolume.pop()
  while(iter.hasNext()) {
    for(var i=0; i<stencil_len; ++i) {
      var p = ptrs[i];
      distances[i]  = vdistances[p];
      phases[i]     = vphases[p];
    }
    func(phases, distances, retval);
    nvolume.push(c[0], c[1], c[2], retval[1], retval[0]);
    iter.next();
  }
  return removeDuplicates(nvolume);
}