var Canvas     = require("../Canvas/Canvas.jsx");
var Timeline   = require("../Timeline/Timeline.jsx");
var Paths      = require("../Paths/Paths.jsx");
var Undoable   = require("../../mixins/Undoable.jsx");
var PlayButton = require("../PlayButton/PlayButton.jsx");
var AppStore   = require("../../stores/AppStore.js");

var classSet   = React.addons.classSet;


var App = React.createClass({

	componentDidMount: function() {
		AppStore.onValue(this.storeChanged);
		Mousetrap.bind("space", this.togglePlayState);
		Mousetrap.bind("right", this.advanceFrame);
		Mousetrap.bind("left", this.retractFrame);
	},


	getInitialState: function() {
		return AppStore.getValue();
	},


	storeChanged: function(newValue){
		this.setState(newValue);
	},


	render: function() {
		var appClassSet = classSet({
			"playing": this.state.playing,
			"App": true
		});

		return (
			<div className={appClassSet}>
				<div className="canvas-container">
					<Paths paths={this.state.lastPaths} />
					<Canvas paths={this.state.currentPaths} />
					</div>
				<div className="timeline-container">
					<PlayButton playing={this.state.playing} />
					<Timeline
						currentFrame={this.state.currentFrame}
						maxFrameCount={this.state.maxFrameCount}
						frames={this.state.frames}
						playing={this.state.playing} />
					</div>
			</div>
		);
	},


	/**
	* Events
	*/

	togglePlayState: function(newValue) {
		AppStore.togglePlayState();
	},


	advanceFrame: function() {
		AppStore.advanceFrame();
	},


	retractFrame: function() {
		AppStore.retractFrame();
	}

});


module.exports = App;