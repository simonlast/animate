(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/App.jsx":[function(require,module,exports){
/** @jsx React.DOM */var Canvas   = require("./Canvas.jsx");
var Timeline = require("./Timeline.jsx");


var App = React.createClass({displayName: 'App',

	getInitialState: function() {
		return {
			frames: [],
			currentFrame: 0
		}
	},


	render: function() {
		var currentPaths = this.generateCurrentPaths();

		return (
			React.DOM.div({className: "App"}, 
				Canvas({paths: currentPaths, 
					onCreatePath: this.handleCreatePath, 
					onAppendPath: this.handleAppendPath}	), 
				Timeline({
					currentFrame: this.state.currentFrame, 
					frames: this.state.frames, 
					onCurrentFrameChange: this.handleCurrentFrameChange})
			)
		);
	},


	/**
	* Events
	*/

	handleCreatePath: function(point) {
		var currentFrame = this.findCurrentFrame();

		if(currentFrame){
			this.createPathInFrame(currentFrame.key, point);
		} else {
			this.createFrameAtCurrentTime(point)
		}
	},


	handleAppendPath: function(point) {
		var currentFrame = this.findCurrentFrame();
		this.appendPointToFrame(currentFrame.key, point);
	},


	handleCurrentFrameChange: function(newValue) {
		var state = _.cloneDeep(this.state);
		state.currentFrame = newValue;
		this.setState(state);
	},


	/**
	* Helpers
	*/

	createPathInFrame: function(key, point) {
		var state = _.cloneDeep(this.state);

		var frameWithKey = _.find(state.frames, (function(frameData){
			return frameData.key === key;
		}).bind(this));

		var newPath = {
			key: uuid.v4(),
			points: [point]
		};

		frameWithKey.paths.push(newPath);
		this.setState(state)
	},


	appendPointToFrame: function(key, point) {
		var state = _.cloneDeep(this.state);

		var frameWithKey = _.find(state.frames, (function(frameData){
			return frameData.key === key;
		}).bind(this));

		lastPath = frameWithKey.paths[frameWithKey.paths.length - 1];
		lastPath.points.push(point);
		this.setState(state)
	},


	createFrameAtCurrentTime: function(initialPoint) {
		newFrame = {
			key: uuid.v4(),
			frameNumber: this.state.currentFrame,
			paths: [
				{
					key: uuid.v4(),
					points: [initialPoint]
				}
			]
		};

		var state = _.cloneDeep(this.state);
		state.frames.push(newFrame);
		this.setState(state);
	},


	findLastFrameToCurrent: function() {
		return _.findLast(this.state.frames, (function(frameData){
			return frameData.frameNumber <= this.state.currentFrame;
		}).bind(this));
	},


	findCurrentFrame: function() {
		return _.find(this.state.frames, (function(frameData){
			return frameData.frameNumber === this.state.currentFrame;
		}).bind(this));
	},


	generateCurrentPaths: function() {
		var currentFrame = this.findCurrentFrame();

		if(currentFrame){
			return currentFrame.paths;

		} else {

			// Empty frame.
			return [
				{
					key: uuid.v4(),
					points: []
				}
			];

		}

	}

});


module.exports = App;
},{"./Canvas.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx","./Timeline.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Timeline.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx":[function(require,module,exports){
/** @jsx React.DOM */var Paths     = require("./Paths.jsx");
var Draggable = require("./Draggable.jsx");


var Canvas = React.createClass({displayName: 'Canvas',

	mixins: [Draggable],

	render: function() {
		return (
			React.DOM.div({className: "Canvas"}, 
				Paths({paths: this.props.paths})
			)
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		this.props.onCreatePath([e.currentX, e.currentY]);
	},


	handleDragMove: function(e) {
		this.props.onAppendPath([e.currentX, e.currentY]);
	}

});


module.exports = Canvas;
},{"./Draggable.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx","./Paths.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Paths.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx":[function(require,module,exports){
/** @jsx React.DOM */

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
  	return {
  		currentTarget: e.target,
  		startX: this.startX,
  		startY: this.startY,
  		currentX: e.clientX,
  		currentY: e.clientY
  	};
  },

};


module.exports = Draggable
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/FramePreview.jsx":[function(require,module,exports){
/** @jsx React.DOM */
var FramePreview = React.createClass({displayName: 'FramePreview',

	render: function() {
		return (
			React.DOM.div({className: "FramePreview"}
			)
		);
	}

});


module.exports = FramePreview;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Paths.jsx":[function(require,module,exports){
/** @jsx React.DOM */
var Paths = React.createClass({displayName: 'Paths',

	render: function() {
		var paths = _.map(this.props.paths, (function(pathData){
			var d = this.dFromPointArray(pathData.points);
			return (
				React.DOM.path({key: pathData.key, d: d})
			);
		}).bind(this));

		return (
			React.DOM.div({className: "Paths"}, 
				React.DOM.svg({xmlns: "http://www.w3.org/2000/svg"}, 
					paths
				)
			)
		);
	},


	/**
	* Helpers
	*/

  dFromPointArray: function(arr){
  	if(arr.length === 0){
  		return ""
  	}

    var d = "";
    d += "M" + arr[0][0] + " " + arr[0][1];

    for(var i=1; i<arr.length; i++){
      var curr = arr[i];
      d += " L" + curr[0] + " " + curr[1];
    }
    return d;
  }

});


module.exports = Paths;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Slider.jsx":[function(require,module,exports){
/** @jsx React.DOM */var Draggable = require("./Draggable.jsx");

var classSet  = React.addons.classSet;


var Slider = React.createClass({displayName: 'Slider',

	mixins: [Draggable],

	render: function() {
		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		};

		return (
			React.DOM.div({className: "Slider"}, 
				React.DOM.div({className: "button", style: buttonStyle})
			)
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		this.updateSlider(e.currentX);
	},


	handleDragMove: function(e) {
		this.updateSlider(e.currentX);
	},


	handleDragEnd: function(e) {
		this.updateSlider(e.currentX);
	},


	/**
	* Helpers
	*/

	updateSlider: function(screenX) {
		var thisRect = this.getDOMNode().getBoundingClientRect();
		var ratio = (screenX - thisRect.left) / thisRect.width;
		var newValue = Math.floor(ratio * this.props.max)
		this.props.onChange(newValue);
	}

});


module.exports = Slider;
},{"./Draggable.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Draggable.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Timeline.jsx":[function(require,module,exports){
/** @jsx React.DOM */var Slider       = require("./Slider.jsx");
var FramePreview = require("./FramePreview.jsx");


var Timeline = React.createClass({displayName: 'Timeline',

	render: function() {
		var previews = _.map(this.props.frames, (function(frameData){
			return (
				FramePreview({key: frameData.key, time: frameData.time, paths: frameData.paths})
			);
		}).bind(this));

		var maxTime = 100;

		return (
			React.DOM.div({className: "Timeline"}, 
				Slider({current: this.props.currentFrame, max: maxTime, onChange: this.sliderChanged}), 
				React.DOM.div({className: "previews"}, 
					previews
				)
			)
		);
	},


	/**
	* Events
	*/

	sliderChanged: function(newValue) {
		this.props.onCurrentFrameChange(newValue);
	}

});


module.exports = Timeline;
},{"./FramePreview.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/FramePreview.jsx","./Slider.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Slider.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/main.jsx":[function(require,module,exports){
/** @jsx React.DOM */App = require("./App.jsx")


React.renderComponent(
  App(null),
  document.getElementById("root")
);

},{"./App.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/App.jsx"}]},{},["/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/main.jsx"]);
