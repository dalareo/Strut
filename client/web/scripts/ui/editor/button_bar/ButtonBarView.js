/*
@author Tantaman
*/
define(["vendor/backbone", "model/editor/button_bar/ButtonBarModel", "model/presentation/components/ComponentFactory"], function(Backbone, ButtonBarModel, ComponentFactory) {
  var buttonBarOptions, fontSettings;
  fontSettings = ["size", "family", "weight", "style", "decoration"];
  buttonBarOptions = {
    _extractValue: function(e) {
      var $target, value;
      value = e.target.dataset.value;
      if (!(value != null)) {
        $target = $(e.target);
        value = $target.parent()[0].dataset.value;
      }
      return value;
    },
    createSlide: function() {
      return this.deck.newSlide();
    },
    textBox: function() {
      var activeSlide;
      activeSlide = this.deck.get("activeSlide");
      if (activeSlide != null) {
        return activeSlide.add(ComponentFactory.createTextBox(this.model.fontConfig()));
      }
    },
    picture: function() {
      var activeSlide,
        _this = this;
      activeSlide = this.deck.get("activeSlide");
      if (activeSlide != null) {
        return this.options.pictureGrabber.show(function(src) {
          return activeSlide.add(ComponentFactory.createImage(_this.model.imgConfig(src)));
        });
      }
    },
    table: function() {},
    shapes: function() {},
    chart: function() {},
    transitionEditor: function() {}
  };
  fontSettings.forEach(function(setting) {
    var longSetting;
    longSetting = "font" + setting.substr(0, 1).toUpperCase() + setting.substr(1);
    return buttonBarOptions[longSetting] = (function() {
      var _longSetting;
      _longSetting = longSetting;
      return function(e) {
        var value;
        value = buttonBarOptions._extractValue(e);
        return this.model[_longSetting](value);
      };
    })();
  });
  return Backbone.View.extend({
    events: {
      "click *[data-option]": "buttonBarOptionChosen"
    },
    initialize: function() {
      this.deck = this.options.deck;
      this.deck.on("change:activeSlide", this.activeSlideChanged, this);
      this.model = new ButtonBarModel();
      this.model.on("change:fontSize", this._fontSizeChanged, this);
      return this.model.on("change:fontFamily", this._fontFamilyChanged, this);
    },
    _fontFamilyChanged: function(model, value) {
      return this.$el.find(".fontFamilyBtn .text").text(value);
    },
    _fontSizeChanged: function(model, value) {
      return this.$el.find(".fontSizeBtn .text").text(value);
    },
    activeSlideChanged: function(mode, newSlide) {
      if (this.currentSlide) {
        this.currentSlide.off("change:activeSlide", this.activeSlideChanged, this);
      }
      this.currentSlide = newSlide;
      if (newSlide) {
        return newSlide.on("change:activeComponent", this.activeComponentChanged, this);
      }
    },
    activeComponentChanged: function(slide, newComponent) {
      this.model.activeComponentChanged(newComponent);
      if (newComponent) {
        return this.$el.find(".fontButton").removeClass("disabled");
      } else {
        return this.$el.find(".fontButton").addClass("disabled");
      }
    },
    buttonBarOptionChosen: function(e) {
      var option;
      option = $(e.currentTarget).attr("data-option");
      return buttonBarOptions[option].call(this, e);
    },
    dispose: function() {
      if (this.currentSlide) {
        this.currentSlide.off("change:activeSlide", this.activeSlideChanged, this);
      }
      return this.deck.off("change:activeSlide", this.activeSlideChanged, this);
    },
    render: function() {
      var $colorChooser,
        _this = this;
      $colorChooser = this.$el.find(".color-chooser");
      $colorChooser.ColorPicker({
        onChange: function(hsb, hex, rgb) {
          $colorChooser.find("div").css("backgroundColor", "#" + hex);
          return _this.model.colorSelected(hex);
        }
      });
      return this.$el;
    }
  });
});
