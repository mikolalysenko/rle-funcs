"use strict"; "use restrict";

var core              = require("rle-core");
var saturateAbs       = core.saturateAbs;
var removeDuplicates  = require("rle-repair").removeDuplicates;

//Most general function: Performs a k-way merge on a collection of volumes
exports.merge = function(volumes, stencil, merge_func) {
  var result      = new core.DynamicVolume()
    , iter        = core.beginMulti(volumes, stencil)
    , coord       = iter.coord
    , phases      = new Int32Array(iter.ptrs.length)
    , distances   = new Float64Array(iter.ptrs.length)
    , retval      = [ 0, 1.0 ];
  while(iter.hasNext()) {
    iter.getValues(phases, distances);
    merge_func(phases, distances, retval);
    result.push(coord[0], coord[1], coord[2], saturateAbs(retval[1]), retval[0]);
    iter.next();
  }
  return removeDuplicates(result);
}

//Optimization: merge for a point stencil
exports.mergePoint = function(volumes, merge_func) {
  return exports.merge(volumes, new Int32Array(3), merge_func);
}

//Optimization:  merge for a sungle volume
exports.apply = function(volume, stencil, func) {
  var result      = new core.DynamicVolume()
    , iter        = core.beginStencil(volume, stencil)
    , coord       = iter.coord
    , phases      = new Int32Array(iter.ptrs.length)
    , distances   = new Float64Array(iter.ptrs.length)
    , retval      = [ 0, 1.0 ];
  while(iter.hasNext()) {
    iter.getValues(phases, distances);
    func(phases, distances, retval);
    result.push(coord[0], coord[1], coord[2], saturateAbs(retval[1]), retval[0]);
    iter.next();
  }
  return removeDuplicates(result);
}

//Optimization: apply for a point stencil
exports.applyPoint = function(volume, func) {
  var nvolume = volume.clone()
    , nruns   = volume.length()
    , retval  = [0,1.0]
  for(var i=0; i<nruns; ++i) {
    func(nvolume.phases[i], nvolume.distances[i], retval)
    nvolume.phases[i]     = retval[0];
    nvolume.distances[i]  = saturateAbs(retval[1]);
  }
  return removeDuplicates(nvolume);
}

