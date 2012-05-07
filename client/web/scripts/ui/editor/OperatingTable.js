/*
@author Matt Crinklaw-Vogt
*/
define(["vendor/backbone", "./Templates", "./components/ComponentViewFactory", "css!./res/css/OperatingTable.css"], function(Backbone, Templates, ComponentViewFactory, empty) {
  return Backbone.View.extend({
    className: "operatingTable",
    events: {
      "click": "clicked"
    },
    initialize: function() {},
    setModel: function(slide) {
      var prevModel;
      prevModel = this.model;
      if (this.model != null) {
        this.model.off("change:components.add", this._componentAdded, this);
      }
      this.model = slide;
      if (this.model != null) {
        this.model.on("change:components.add", this._componentAdded, this);
      }
      return this.render(prevModel);
    },
    clicked: function(e) {
      if (this.model != null) {
        this.model.get("components").forEach(function(component) {
          if (component.get("selected")) return component.set("selected", false);
        });
        return this.$el.find(".editable").removeClass("editable").attr("contenteditable", false).trigger("editComplete");
      }
    },
    _componentAdded: function(model, component) {
      var view;
      view = ComponentViewFactory.createView(component);
      return this.$el.append(view.render());
    },
    render: function(prevModel) {
      var components,
        _this = this;
      if (prevModel != null) prevModel.trigger("unrender", true);
      if (this.model != null) {
        components = this.model.get("components");
        components.forEach(function(component) {
          var view;
          view = ComponentViewFactory.createView(component);
          return _this.$el.append(view.render());
        });
      }
      return this.$el;
    }
  });
});
