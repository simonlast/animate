var mori         = require("mori");
var EventEmitter = require("wolfy87-eventemitter");


var RevisionStore = function(){
  this.undoStack = mori.vector();
  this.redoStack = mori.vector();
  this.lastState = null;
  this.events    = new EventEmitter();
};


/**
* Event API
*/

RevisionStore.prototype.on = function(eventType, callback) {
  this.events.on(eventType, callback);
};


RevisionStore.prototype.triggerChange = function(value) {
  this.events.emitEvent("value", [value]);
};


/**
* Public
*/

RevisionStore.prototype.checkpoint = function(state) {
  if(this.lastState){
    this.undoStack = mori.conj(this.undoStack, this.lastState);
  }

  this.lastState = state;
  this.redoStack = mori.vector();
};


RevisionStore.prototype.undo = function() {
  if(!mori.is_empty(this.undoStack)){
    var lastUndo   = mori.last(this.undoStack);
    this.undoStack = mori.pop(this.undoStack);
    this.redoStack = mori.conj(this.redoStack, this.lastState);

    this.lastState = lastUndo;
    this.triggerChange(lastUndo);
    this.events.emitEvent("undo");
  }
};


RevisionStore.prototype.redo = function() {
  if(!mori.is_empty(this.redoStack)){
    var lastRedo = mori.last(this.redoStack);
    this.redoStack = mori.pop(this.redoStack);
    this.undoStack = mori.conj(this.undoStack, this.lastState);

    this.lastState = lastRedo;
    this.triggerChange(lastRedo);
    this.events.emitEvent("redo");
  }
};


module.exports = new RevisionStore();