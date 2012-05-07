/*
@author Tantaman
*/
define(["./Component"], function(Component) {
  return Component.extend({
    initialize: function() {
      if (!(this.get("text") != null)) return this.set("text", "Text");
    },
    constructor: function TextBox() {
			Component.prototype.constructor.apply(this, arguments);
		}
  });
});
