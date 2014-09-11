var Draggable = {

  componentDidMount: function() {
  	this.dragging = false;
  	this.startX = null;
  	this.startY = null;

  	var domNode = this.getDOMNode();
  	domNode.addEventListener("mousedown", this.draggableMouseDown);
  	document.addEventListener("mousemove", this.draggableMouseMove);
  	document.addEventListener("mouseup", this.draggableMouseUp);
  },


  componentWillUnmount: function() {
    var domNode = this.getDOMNode();
    domNode.removeEventListener("mousedown", this.draggableMouseDown);
    document.removeEventListener("mousemove", this.draggableMouseMove);
    document.removeEventListener("mouseup", this.draggableMouseUp);
  },


  /**
  * Events
  */

  draggableMouseDown: function(e) {
  	e.preventDefault();
  	this.startX = e.clientX;
  	this.startY = e.clientY;
  	this.dragging = true;

    if(_.isFunction(this.handleDragStart)){
      this.handleDragStart(this._getEventDetail(e));
    }
  },


  draggableMouseMove: function(e) {
  	if(this.dragging){
	  	e.preventDefault();

      if(_.isFunction(this.handleDragMove)){
        this.handleDragMove(this._getEventDetail(e));
      }
    }
  },


  draggableMouseUp: function(e) {
  	e.preventDefault();
  	if(this.dragging){
      if(_.isFunction(this.handleDragEnd)){
        this.handleDragEnd(this._getEventDetail(e));
      }

	  	this.dragging = false;
	  	this.startX = null;
	  	this.startY = null;
  	}
  },


  _getEventDetail: function(e) {
    var thisRect = this.getDOMNode().getBoundingClientRect();

  	return {
  		currentTarget: e.target,
  		startX: this.startX,
  		startY: this.startY,
  		currentX: this._offsetX(e.clientX, thisRect),
  		currentY: this._offsetY(e.clientY, thisRect)
  	};
  },


  _offsetX: function(x, thisRect){
    return x - thisRect.left;
  },


  _offsetY: function(y, thisRect){
    return y - thisRect.top;
  }

};


module.exports = Draggable