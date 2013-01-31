rle-funcs
=========
Functional programming primitives and abstractions for narrowband level sets.  This library gives you tools for combining and iterating over volumes.

Installation
============
You can install it via rle-funcs:

    npm install rle-funcs
    
Or else just include rle-all which has it as a subcomponent:

    npm install rle

Usage
=====

`apply(volume, stencil, update_func)`
------------------------------
This applies a function to the volume pointwise.  Useful for implementing cellular automata and other local differential equations.

* `volume`: The volume we are applying the stencil operator to.
* `stencil`: The neighborhood stencil that we are using on the volume.
* `update_func(phases, distances, retval)`: A function that takes three arguments:

  * `phases`: An array of length `stencil.length` of material phases.
  * `distances`: An array of length `stencil.length` of distances to the material boundary
  * `retval`: A length two array for the return value of the function.  The first item is the new phase and the second item is the distance to the phase boundary.

Returns: A new run length encoded volume, which is the result of applying `update_func` at every point in the volume.

`merge(volumes, merge_func)`
----------------------------
This merges a collection of volumes together.  This acts like a generalized boolean operation amongst the volumes.

* `volumes`: An array of volumes:
* `merge_func(phases, distances, retval)`

Returns:  The result of calling merge_func at every point in the volumes.


Credits
=======
(c) 2013 Mikola Lysenko