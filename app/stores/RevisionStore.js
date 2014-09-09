var RevisionStore = function(){
  this.undoStack = [];
  this.redoStack = [];
  this.lastState = null;

  this.events_ = new EventEmitter();
};


/**
* Event API
*/

RevisionStore.prototype.onValue = function(callback) {
  this.events_.on("value", callback);
};


RevisionStore.prototype.triggerChange = function(value) {
  this.events_.emitEvent("value", [_.cloneDeep(value)]);
};


/**
* Public
*/

RevisionStore.prototype.checkpoint = function(state) {
  var currentState = _.cloneDeep(state);

  if(this.lastState){
    this.undoStack.push(this.lastState);
  }

  this.lastState = currentState;
  this.redoStack = [];
};


RevisionStore.prototype.undo = function() {
  var lastUndo = this.undoStack.pop();

  if(lastUndo) {
    this.redoStack.push(this.lastState);
    this.lastState = lastUndo;
    this.triggerChange(lastUndo);
  }
};


RevisionStore.prototype.redo = function() {
  var lastRedo = this.redoStack.pop();

  if(lastRedo) {
    this.undoStack.push(this.lastState);
    this.lastState = lastRedo;
    this.triggerChange(lastRedo);
  }
};


module.exports = new RevisionStore();