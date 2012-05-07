/*
@author Matt Crinklaw-Vogt
*/
define(["common/EventEmitter", "common/collections/LinkedList"], function(EventEmitter, LinkedList) {
  var UndoHistory;
  return UndoHistory = (function() {

    function UndoHistory(size) {
      this.size = size;
      this.actions = new LinkedList();
      this.cursor = null;
      this.undoCount = 0;
      _.extend(this, new EventEmitter());
    }

    UndoHistory.prototype.push = function(action) {
      var node;
      if ((this.actions.length - this.undoCount) < this.size) {
        if (this.undoCount > 0) {
          node = {
            prev: null,
            next: null,
            value: action
          };
          if (!this.cursor) {
            this.actions.head = node;
            this.actions.tail = node;
            this.actions.length = 1;
          } else {
            node.prev = this.cursor;
            this.cursor.next.prev = null;
            this.cursor.next = node;
            this.actions.length += 1;
            this.actions.length = this.actions.length - this.undoCount;
          }
          this.undoCount = 0;
          this.cursor = null;
        } else {
          this.actions.push(action);
        }
      } else {
        this.actions.shift();
        this.actions.push(action);
      }
      this.emit("updated");
      return this;
    };

    UndoHistory.prototype.undoName = function() {
      var node;
      if (this.undoCount < this.actions.length) {
        node = this.cursor || this.actions.tail;
        if (node != null) {
          return node.value.name;
        } else {
          return "";
        }
      } else {
        return "";
      }
    };

    UndoHistory.prototype.redoName = function() {
      var node;
      if (this.undoCount > 0) {
        if (!(this.cursor != null)) {
          node = this.actions.head;
        } else {
          node = this.cursor.next;
        }
        if (node != null) {
          return node.value.name;
        } else {
          return "";
        }
      } else {
        return "";
      }
    };

    UndoHistory.prototype.undo = function() {
      if (this.undoCount < this.actions.length) {
        if (!(this.cursor != null)) this.cursor = this.actions.tail;
        this.cursor.value.undo();
        this.cursor = this.cursor.prev;
        ++this.undoCount;
        this.emit("updated");
      }
      return this;
    };

    UndoHistory.prototype.redo = function() {
      if (this.undoCount > 0) {
        if (!(this.cursor != null)) {
          this.cursor = this.actions.head;
        } else {
          this.cursor = this.cursor.next;
        }
        this.cursor.value["do"]();
        --this.undoCount;
        this.emit("updated");
      }
      return this;
    };

    return UndoHistory;

  })();
});
