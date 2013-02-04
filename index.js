"use strict"; "use restrict";

var core              = require("rle-core");
var removeDuplicates  = require("rle-repair").removeDuplicates;

//Most general function: Performs a k-way merge on a collection of volumes
exports.merge = function(volumes, stencil, merge_func) {
  var result      = new core.DynamicVolume()
    , iter        = core.beginMulti(volumes, stencil)
    , ptrs        = iter.ptrs
    , stencil_len = iter.stencil_len
    , coord       = iter.coord
    , phases      = new Int32Array(ptrs.length)
    , distances   = new Float64Array(ptrs.length)
    , retval      = [0, 1.0];
  while(iter.hasNext()) {
    for(var i=0, idx=0; i<volumes.length; ++i) {
      var vphases     = volumes[i].phases
        , vdistances  = volumes[i].distances;
      for(var j=0; j<stencil_len; ++j, ++idx) {
        var p = ptrs[idx];
        phases[idx]     = vphases[p];
        distances[idx]  = vdistances[p];
      }
    }
    merge_func(phases, distances, retval);
    result.push(coord[0], coord[1], coord[2], retval[1], retval[0]);
    iter.next();
  }
  return removeDuplicates(result);
}

//Optimization: merge for a trivial stencil
exports.mergePoint = function(volumes, merge_func) {
  return exports.merge(volumes, new Int32Array(3), merge_func);
}

//Optimization:  merge for a sungle volume
exports.apply = function(volume, stencil, func) {
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

//Optimization merge for a pointwise function
exports.applyPoint = function(volume, func) {
  var nvolume = volume.clone()
    , nruns   = volume.length()
    , retval  = [0,1.0]
  for(var i=0; i<nruns; ++i) {
    func(nvolume.phases[i], nvolume.distances[i], retval)
    nvolume.phases[i]     = retval[0];
    nvolume.distances[i]  = retval[1];
  }
  return removeDuplicates(nvolume);
}

