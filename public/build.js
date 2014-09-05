(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx":[function(require,module,exports){
/** @jsx React.DOM */

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
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Image.jsx":[function(require,module,exports){
/** @jsx React.DOM */

var Image = React.createClass({displayName: 'Image',
  render: function() {
  	var imageStyle = {
  		transform: "translate(" + this.props.left + "px, " + this.props.top + "px)"
  	};

    return (
      React.DOM.div({className: "Image"}, 
      	React.DOM.img({src: this.props.src, style: imageStyle})
      )
    );
  }
});


module.exports = Image;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/InteractiveImage.jsx":[function(require,module,exports){
/** @jsx React.DOM */Draggable = require("./Draggable.jsx");
Image     = require("./Image.jsx");


var InteractiveImage = React.createClass({displayName: 'InteractiveImage',

	mixins: [Draggable],

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
      React.DOM.div({className: "InteractiveImage"}, 
				Image({left: this.state.left, top: this.state.top, src: this.props.src})
      )
		);
	}

});


module.exports = InteractiveImage

},{"./Draggable.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx","./Image.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Image.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/app.jsx":[function(require,module,exports){
/** @jsx React.DOM */InteractiveImage = require("./InteractiveImage.jsx")


React.renderComponent(
  InteractiveImage({left: "100", top: "200", src: "http://i68.photobucket.com/albums/i28/aquizero/GIF/MegaMan%20Gifs/Megaman.png"}),
  document.getElementById("container")
);


},{"./InteractiveImage.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/InteractiveImage.jsx"}]},{},["/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/app.jsx"]);
