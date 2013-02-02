var core              = require("rle-core");
var DynamicVolume     = core.DynamicVolume;
var beginMulti        = core.beginMulti;
var removeDuplicates  = require("rle-repair").removeDuplicates;

//Performs a k-way merge on a collection of volumes
module.exports = function(volumes, stencil, merge_func) {
  var result      = new DynamicVolume()
    , iter        = beginMulti(volumes, stencil)
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
