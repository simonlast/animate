var Undoable = {

  UNDO_CHECKPOINT_INTERVAL: 200,


  componentDidMount: function() {
    this.undoStack = [];
    this.redoStack = [];
    this.lastState = null;

    Mousetrap.bind("command+z", this.handleUndo);
    Mousetrap.bind("command+shift+z", this.handleRedo);
  },


  componentWillUnmount: function() {
    Mousetrap.unbind("command+z", this.handleUndo);
    Mousetrap.unbind("command+shift+z", this.handleRedo);
  },


  /**
  * Public
  */

  checkpoint: function() {
    var currentState = this.cloneCurrentState();

    if(this.lastState){
      this.undoStack.push(this.lastState);
    }

    this.lastState = currentState;
    this.redoStack = [];

  },


  /**
  * Events
  */

  handleUndo: function(e) {
    e.preventDefault();

    var lastUndo = this.undoStack.pop();

    if(lastUndo) {
      this.redoStack.push(this.lastState);
      this.setState(lastUndo);
      this.lastState = lastUndo;
    }

  },


  handleRedo: function(e) {
    e.preventDefault();

    var lastRedo = this.redoStack.pop();

    if(lastRedo) {
      this.undoStack.push(this.lastState);
      this.setState(lastRedo);
      this.lastState = lastRedo;
    }

  },


  /**
  * Helpers
  */

  cloneCurrentState: function() {
    return _.cloneDeep(this.state);
  }


};


module.exports = Undoable