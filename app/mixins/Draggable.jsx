var Draggable = {

  componentDidMount: function() {
  	this.dragging = false;
  	this.startX = null;
  	this.startY = null;

  	var domNode = this.getDOMNode();

    if(this._isTouchBrowser()){
      domNode.addEventListener("touchstart", this.draggableTouchStart);
      document.addEventListener("touchmove", this.draggableTouchMove);
      document.addEventListener("touchend", this.draggableTouchEnd);
    }
    else {
      domNode.addEventListener("mousedown", this.draggableMouseDown);
      document.addEventListener("mousemove", this.draggableMouseMove);
      document.addEventListener("mouseup", this.draggableMouseUp);
    }
  },


  componentWillUnmount: function() {
    var domNode = this.getDOMNode();

    if(this._isTouchBrowser()){
      domNode.removeEventListener("touchstart", this.draggableTouchStart);
      document.removeEventListener("touchmove", this.draggableTouchMove);
      document.removeEventListener("touchend", this.draggableTouchEnd);
    }
    else {
      domNode.removeEventListener("mousedown", this.draggableMouseDown);
      document.removeEventListener("mousemove", this.draggableMouseMove);
      document.removeEventListener("mouseup", this.draggableMouseUp);
    }
  },


  /**
  * Mouse Events
  */

  draggableMouseDown: function(e) {
  	e.preventDefault();
  	this.startX = e.clientX;
  	this.startY = e.clientY;
  	this.dragging = true;

    this.setState({dragging: true});

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
  	if(this.dragging){
      e.preventDefault();

      this.setState({dragging: false});

      if(_.isFunction(this.handleDragEnd)){
        this.handleDragEnd(null);
      }

	  	this.dragging = false;
	  	this.startX = null;
	  	this.startY = null;

  	}
  },


  /**
  * Touch Events
  */

  draggableTouchStart: function(e) {
    e.preventDefault();

    var firstTargetTouch = e.targetTouches[0];

    this.startX          = firstTargetTouch.clientX;
    this.startY          = firstTargetTouch.clientY;
    this.touchIdentifier = firstTargetTouch.identifier;
    this.dragging        = true;

    this.setState({dragging: true});

    if(_.isFunction(this.handleDragStart)){
      this.handleDragStart(this._getEventDetail(firstTargetTouch));
    }
  },


  draggableTouchMove: function(e) {
    if (this.dragging) {
      e.preventDefault();

      var touchWithIdentifier = _.find(e.touches, function(touch){
        return touch.identifier === this.touchIdentifier;
      }.bind(this));

      if(touchWithIdentifier && _.isFunction(this.handleDragMove)){
        var elementOverTouch = document.elementFromPoint(
          touchWithIdentifier.clientX,
          touchWithIdentifier.clientY
        );

        var detail = {
          clientX: touchWithIdentifier.clientX,
          clientY: touchWithIdentifier.clientY,
          target: elementOverTouch
        };

        this.handleDragMove(this._getEventDetail(detail));
      }
    }
  },


  draggableTouchEnd: function(e) {
    if (this.dragging) {
      e.preventDefault();

      this.setState({dragging: false});

      if(_.isFunction(this.handleDragEnd)){
        this.handleDragEnd(null);
      }

      this.dragging        = false;
      this.startX          = null;
      this.startY          = null;
      this.touchIdentifier = null;
    }
  },


  /**
  * Helpers
  */

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
  },


  _isTouchBrowser: function(){
    return ("ontouchstart" in window)
  }

};


module.exports = Draggable