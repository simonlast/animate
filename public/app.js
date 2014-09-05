/**
 * @jsx React.DOM
 */

var DraggableMixin = {

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


var Image = React.createClass({
  render: function() {
  	var imageStyle = {
  		transform: "translate(" + this.props.left + "px, " + this.props.top + "px)"
  	};

    return (
      <div className="Image">
      	<img src={this.props.src} style={imageStyle} />
      </div>
    );
  }
});


var InteractiveImage = React.createClass({

	mixins: [DraggableMixin],

  getInitialState: function() {
    return {
    	left: this.props.left,
    	top: this.props.top
    };
  },

  handleDragStart: function(e){
  	console.log(e);
  },

  handleDragMove: function(e){
  	this.setState({
  		left: e.currentX,
  		top: e.currentY,
  	})
  },

  handleDragEnd: function(e){
  	console.log(e);
  },

	render: function(){
		return (
      <div className="InteractiveImage">
				<Image left={this.state.left} top={this.state.top} src={this.props.src} />
      </div>
		);
	}

});

React.renderComponent(
  <InteractiveImage left="100" top="200" src="http://i68.photobucket.com/albums/i28/aquizero/GIF/MegaMan%20Gifs/Megaman.png"/>,
  document.getElementById("container")
);

