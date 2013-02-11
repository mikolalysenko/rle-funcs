rle-funcs
=========
Functional programming primitives and abstractions for the [rle narrowband level set library](https://github.com/mikolalysenko/rle-all).  This library gives you tools for combining and iterating over volumes.

Installation
============
You can install it via rle-funcs:

    npm install rle-funcs
    
Or else just include rle-all which has it as a subcomponent:

    npm install rle


Example
=======
Here is an example showing how to implement the update rule for a 3D version of the Game of Life using narrowband level sets:

    next_state = funcs.apply(state, require("rle-stencils").moore(1), function(phases, distances, retval) {
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

If you want to see it in the 


Usage
=====

`merge(volumes, stencil, merge_func)`
----------------------------
This merges a collection of volumes together.  This acts like a generalized boolean operation amongst the volumes.  It is a very flexible, and very general function

* `volumes`: An array of volumes
* `stencil`: A stencil
* `merge_func(phases, distances, retval)`: A function that takes 3 arguments:
  * `phases`: An array of length `volumes.length * stencil.length` of material phases.
  * `distances`: An array of length `volumes.length * stencil.length` of distances to the material boundary
  * `retval`: A length two array for the return value of the function.  The first item is the new phase and the second item is the distance to the phase boundary.

Returns:  A new volume which is the result of calling merge_func at every point in the volumes.

`mergePoint(volumes, merge_func)`
---------------------------------
This is an optimized version of merge where the stencil is a single point.

`apply(volume, stencil, merge_func)`
------------------------------
This is an optimized version of `merge` that takes only a single volume as input, instead of an array.  Useful for implementing cellular automata and other local differential equations.

`applyPoint(volume, merge_func)`
---------------------------------
Optimized version `apply` that assumes `stencil` is a single point.


Credits
=======
(c) 2013 Mikola Lysenko