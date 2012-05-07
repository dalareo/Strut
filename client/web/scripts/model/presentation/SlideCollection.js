/*
@author Matt Crinklaw-Vogt
*/
define(["vendor/backbone", "./Slide"], function(Backbone, Slide) {
  return Backbone.Collection.extend({
    model: Slide,
    initialize: function() {
      this.on("add", this._updateNumbers, this);
      return this.on("remove", this._updateNumbers, this);
    },
    _updateNumbers: function() {
      return this.models.forEach(function(model, idx) {
        return model.set("num", idx);
      });
    }
  });
});
