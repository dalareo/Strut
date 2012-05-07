/*
@author Matt Crinklaw-Vogt
*/
define(["model/geom/SpatialObject"], function(SpatialObject) {
  return SpatialObject.extend({
    initialize: function() {},
    dispose: function() {
      this.trigger("dispose", this);
      return this.off();
    },
    constructor: function Component() {
			SpatialObject.prototype.constructor.apply(this, arguments);
		}
  });
});
