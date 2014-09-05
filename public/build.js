(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx":[function(require,module,exports){
/** @jsx React.DOM */InteractiveImage = require("./InteractiveImage.jsx")


var initialState = {
	images: [
	  {
	  	key: "xxx",
	  	left: 100,
	  	top: 100,
	    src: "http://i68.photobucket.com/albums/i28/aquizero/GIF/MegaMan%20Gifs/Megaman.png"
	  },
	  {
	  	key: "yyy",
	  	left: 400,
	  	top: 100,
	    src: "http://fc00.deviantart.net/fs71/f/2012/051/3/9/charlotte_sprite_by_valdrec-d4qdkk6.png"
	  },
	  {
	  	key: "zzz",
	  	left: 200,
	  	top: 300,
	    src: "http://www.hipsterwave.com/wp-content/uploads/2012/04/8_bit_yoshi_by_toshirofrog-d4ijgaj.png"
	  }
	]
};

var Canvas = React.createClass({displayName: 'Canvas',

  getInitialState: function() {
    return initialState
  },

  handleMove: function(key, newPosition){
  	var state = _.cloneDeep(this.state);
  	var imageData = _.find(state.images, function(imageData){
  		return imageData.key === key;
  	});

  	imageData.left = newPosition.left;
  	imageData.top = newPosition.top;
  	this.setState(state);
  },

  render: function() {
  	var images = _.map(this.state.images, function(imageData) {
  		return (
  			InteractiveImage({
  				top: imageData.top, 
  				left: imageData.left, 
  				src: imageData.src, 
  				key: imageData.key, 
  				onMove: this.handleMove})
			);
  	}.bind(this));

    return (
      React.DOM.div({className: "Canvas"}, 
      	images
      )
    );
  }

});


module.exports = Canvas;
},{"./InteractiveImage.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/InteractiveImage.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx":[function(require,module,exports){
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
    return (
      React.DOM.div({className: "Image"}, 
      	React.DOM.img({src: this.props.src})
      )
    );
  }
});


module.exports = Image;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/InteractiveImage.jsx":[function(require,module,exports){
/** @jsx React.DOM */Draggable = require("./Draggable.jsx");
Image     = require("./Image.jsx");

classSet  = React.addons.classSet;


var InteractiveImage = React.createClass({displayName: 'InteractiveImage',

	mixins: [Draggable],

  getInitialState: function() {
    return {
      active: false
    };
  },

  handleDragStart: function(e){
    this.startLeft = this.props.left;
    this.startTop = this.props.top;
    this.setState({active: true});
  },

  handleDragMove: function(e){
    var newPosition = {
      left: this.startLeft + (e.currentX - e.startX),
      top: this.startTop + (e.currentY - e.startY)
    };

    this.props.onMove(this.props.key, newPosition);
  },

  handleDragEnd: function(e){
    this.offsetX = null
    this.offsetY = null
    this.setState({active: false});
  },

	render: function(){
    var containerStyle = {
      transform: "translate(" + this.props.left + "px, " + this.props.top + "px)"
    };

    var containerClasses = classSet({
      "InteractiveImage": true,
      "active": this.state.active
    });

		return (
      React.DOM.div({className: containerClasses, style: containerStyle}, 
				Image({src: this.props.src})
      )
		);
	}

});


module.exports = InteractiveImage

},{"./Draggable.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx","./Image.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Image.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/app.jsx":[function(require,module,exports){
/** @jsx React.DOM */Canvas = require("./Canvas.jsx")


React.renderComponent(
  Canvas(null),
  document.getElementById("container")
);


},{"./Canvas.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx"}]},{},["/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/app.jsx"]);
