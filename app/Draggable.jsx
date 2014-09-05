

var Draggable = {

  componentDidMount: function() {
  	this.dragging = false;
  	this.startX = null;
  	this.startY = null;

  	var domNode = this.getDOMNode();
  	domNode.addEventListener("mousedown", this._draggableMouseDown);
  	document.addEventListener("mousemove", this._draggableMouseMove);
  	document.addEventListener("mouseup", this._draggableMouseUp);
  },

  _draggableMouseDown: function(e) {
  	e.preventDefault();
  	this.startX = e.clientX;
  	this.startY = e.clientY;
  	this.dragging = true;
  	this.handleDragStart(this._getEventDetail(e));
  },

  _draggableMouseMove: function(e) {
  	if(this.dragging){
	  	e.preventDefault();
  		this.handleDragMove(this._getEventDetail(e));
  	}
  },

  _draggableMouseUp: function(e) {
  	e.preventDefault();
  	if(this.dragging){
	  	this.handleDragEnd(this._getEventDetail(e));

	  	this.dragging = false;
	  	this.startX = null;
	  	this.startY = null;
  	}
  },

  _getEventDetail: function(e) {
  	return {
  		currentTarget: e.target,
  		startX: this.startX,
  		startY: this.startY,
  		currentX: e.clientX,
  		currentY: e.clientY
  	};
  },

  componentWillUnmount: function() {
  	var domNode = this.getDOMNode();
  	domNode.removeEventListener("mousedown", this._draggableMouseDown);
  	document.removeEventListener("mousemove", this._draggableMouseMove);
  	document.removeEventListener("mouseup", this._draggableMouseUp);
  }

};


module.exports = Draggable