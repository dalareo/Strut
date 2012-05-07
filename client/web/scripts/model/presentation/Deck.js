/*
@author Matt Crinklaw-Vogt
*/
define(["vendor/backbone", "./SlideCollection", "./Slide", "model/common_application/UndoHistory"], function(Backbone, SlideCollection, Slide, UndoHistory) {
  var NewSlideAction, RemoveSlideAction;
  NewSlideAction = function(deck) {
    this.deck = deck;
    return this;
  };
  NewSlideAction.prototype = {
    "do": function() {
      var slides;
      slides = this.deck.get("slides");
      if (!(this.slide != null)) {
        this.slide = new Slide({
          num: slides.length
        });
      }
      slides.add(this.slide);
      return this.slide;
    },
    undo: function() {
      return this.deck.get("slides").remove(this.slide);
    },
    name: "Create Slide"
  };
  RemoveSlideAction = function(deck, slide) {
    this.deck = deck;
    this.slide = slide;
    return this;
  };
  RemoveSlideAction.prototype = {
    "do": function() {
      var slides;
      slides = this.deck.get("slides");
      slides.remove(this.slide);
      return this.slide;
    },
    undo: function() {
      return this.deck.get("slides").add(this.slide);
    },
    name: "Remove Slide"
  };
  return Backbone.Model.extend({
    initialize: function() {
      var slides;
      this.undoHistory = new UndoHistory(20);
      this.set("slides", new SlideCollection());
      slides = this.get("slides");
      slides.on("add", this._slideAdded, this);
      return slides.on("remove", this._slideRemoved, this);
    },
    newSlide: function() {
      var action, slide;
      action = new NewSlideAction(this);
      slide = action["do"]();
      this.undoHistory.push(action);
      return slide;
    },
    set: function(key, value) {
      if (key === "activeSlide") this._activeSlideChanging(value);
      return Backbone.Model.prototype.set.apply(this, arguments);
    },
    _activeSlideChanging: function(newActive) {
      var lastActive;
      lastActive = this.get("activeSlide");
      if (lastActive != null) return lastActive.unselectComponents();
    },
    _slideAdded: function(slide, collection) {
      return this.set("activeSlide", slide);
    },
    _slideRemoved: function(slide, collection, options) {
      console.log("Slide removed");
      if (this.get("activeSlide") === slide) {
        if (options.index < collection.length) {
          this.set("activeSlide", collection.at(options.index));
        } else if (options.index > 0) {
          this.set("activeSlide", collection.at(options.index - 1));
        } else {
          this.set("activeSlide", null);
        }
      }
      console.log(this);
      return console.log(this.get("activeSlide"));
    },
    removeSlide: function(slide) {
      var action;
      action = new RemoveSlideAction(this, slide);
      slide = action["do"]();
      this.undoHistory.push(action);
      return slide;
    },
    undo: function() {
      return this.undoHistory.undo();
    },
    redo: function() {
      return this.undoHistory.redo();
    }
  });
});
