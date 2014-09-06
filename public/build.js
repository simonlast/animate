(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/App.jsx":[function(require,module,exports){
/** @jsx React.DOM */Canvas   = require("./Canvas.jsx");
Timeline = require("./Timeline.jsx");


var initialState = {
	frames: [
		{
			key: "x",
			time: 0,
			paths: [
				{
					key: "y",
					points: [
						[0, 0]
					]
				},
				{
					key: "z",
					points: [
						[400, 0],
						[400, 200],
						[300, 300]
					]
				}
			]
		}
	],

	currentTime: 0,

	currentPaths: [
		{
			key: "y",
			points: [
				[0, 0],
				[100, 100],
				[200, 100],
				[100, 200]
			]
		},
		{
			key: "z",
			points: [
				[400, 0],
				[400, 200],
				[300, 300]
			]
		}
	]
}

var App = React.createClass({displayName: 'App',

	getInitialState: function() {
		return initialState
	},

	render: function() {
		return (
			React.DOM.div({className: "App"}, 
				Canvas({paths: this.state.currentPaths}), 
				Timeline({time: this.state.currentTime, frames: this.state.frames})
			)
		);
	}

});


module.exports = App;
},{"./Canvas.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx","./Timeline.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Timeline.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Canvas.jsx":[function(require,module,exports){
/** @jsx React.DOM */Paths = require("./Paths.jsx");


var Canvas = React.createClass({displayName: 'Canvas',

	render: function() {
		return (
			React.DOM.div({className: "Canvas"}, 
				Paths({paths: this.props.paths})
			)
		);
	}

});


module.exports = Canvas;
},{"./Paths.jsx":"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Paths.jsx"}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/FramePreview.jsx":[function(require,module,exports){
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

  dFromPointArray: function(arr){
    var d = "";
    d += "M" + arr[0][0] + " " + arr[0][1];

    for(var i=1; i<arr.length; i++){
      var curr = arr[i];
      d += " L" + curr[0] + " " + curr[1];
    }
    return d;
  },

	render: function() {
		var paths = _.map(this.props.paths, (function(pathData){
			console.log(pathData.points);
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
	}

});


module.exports = Paths;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Slider.jsx":[function(require,module,exports){
/** @jsx React.DOM */
var Slider = React.createClass({displayName: 'Slider',

	render: function() {

		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		}

		return (
			React.DOM.div({className: "Slider"}, 
				React.DOM.div({className: "button", style: buttonStyle})
			)
		);
	}

});


module.exports = Slider;
},{}],"/Users/simonlast/Dropbox/Docs/Projects/react-animate/app/Timeline.jsx":[function(require,module,exports){
/** @jsx React.DOM */Slider       = require("./Slider.jsx");
FramePreview = require("./FramePreview.jsx");


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
				Slider({current: this.props.time, max: maxTime}), 
				React.DOM.div({className: "previews"}, 
					previews
				)
			)
		);
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
