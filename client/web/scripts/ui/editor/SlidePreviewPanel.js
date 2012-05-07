/*
@author Matt Crinklaw-Vogt
*/
define(["vendor/backbone", "./SlideSnapshot", "css!./res/css/slidePreviewPanel.css"], function(Backbone, SlideSnapshot) {
  return Backbone.View.extend({
    className: "slidePreviewPanel",
    initialize: function() {
      var slideCollection;
      slideCollection = this.model.get("slides");
      slideCollection.on("add", this.slideCreated, this);
      slideCollection.on("remove", this.slideRemoved, this);
      this.snapshots = [];
      return this.model.on("change:activeSlide", this.activeSlideChanged, this);
    },
    slideCreated: function(slide) {
      var snapshot;
      snapshot = new SlideSnapshot({
        model: slide
      });
      snapshot.on("clicked", this.slideClicked, this);
      snapshot.on("removeClicked", this.slideRemoveClicked, this);
      this.snapshots.push(snapshot);
      this.$el.append(snapshot.render());
      if (slide === this.model.get("activeSlide")) {
        return this.activeSlideChanged(this.model, slide);
      }
    },
    slideRemoved: function(slide, collection, options) {
      this.snapshots[options.index].remove();
      return this.snapshots.splice(options.index, 1);
    },
    slideClicked: function(snapshot) {
      return this.model.set("activeSlide", snapshot.model);
    },
    slideRemoveClicked: function(snapshot) {
      return this.model.removeSlide(snapshot.model);
    },
    activeSlideChanged: function(model, slide) {
      var newActive;
      if (!slide) return null;
      newActive = this.snapshots[slide.get("num")];
      if (newActive && this.previousActive !== newActive) {
        if (this.previousActive != null) {
          this.previousActive.$el.removeClass("active");
        }
        this.previousActive = newActive;
        return this.previousActive.$el.addClass("active");
      }
    },
    render: function() {
      var slides,
        _this = this;
      slides = this.model.get("slides");
      if (slides != null) {
        slides.each(function(slide) {
          return _this.slideCreated(slide);
        });
      }
      return this.$el;
    },
    remove: function() {
      Backbone.View.prototype.remove.apply(this, arguments);
      return this.dispose();
    },
    dispose: function() {
      return this.snapshots.forEach(function(snapshot) {
        return snapshot.dispose();
      });
    }
  });
});
