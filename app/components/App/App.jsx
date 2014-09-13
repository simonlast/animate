var Canvas        = require("../Canvas/Canvas.jsx");
var Timeline      = require("../Timeline/Timeline.jsx");
var Paths         = require("../Paths/Paths.jsx");
var PlayButton    = require("../PlayButton/PlayButton.jsx");
var ColorPicker   = require("../ColorPicker/ColorPicker.jsx");
var AppStore      = require("../../stores/AppStore.js");
var RevisionStore = require("../../stores/RevisionStore.js");

var classSet   = React.addons.classSet;


var App = React.createClass({

	componentDidMount: function() {
		AppStore.onValue(this.storeChanged);

		Mousetrap.bind("space", this.togglePlayState);
		Mousetrap.bind("right", this.advanceFrame);
		Mousetrap.bind("left", this.retractFrame);
    Mousetrap.bind("command+z", this.handleUndo);
    Mousetrap.bind("command+shift+z", this.handleRedo);
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
				<div className="timeline-container">
					<PlayButton playing={this.state.playing} />
					<ColorPicker
						currentColor={this.state.currentColor}
						colorOptions={this.state.colorOptions} />
					<Timeline
						currentFrame={this.state.currentFrame}
						maxFrameCount={this.state.maxFrameCount}
						frames={this.state.frames}
						playing={this.state.playing} />
				</div>
				<div className="canvas-container">
					<Paths paths={this.state.lastPaths} />
					<Canvas paths={this.state.currentPaths} />
					</div>
			</div>
		);
	},


	/**
	* Events
	*/

	togglePlayState: function(e) {
		e.preventDefault();
		AppStore.togglePlayState();
	},


	advanceFrame: function(e) {
		e.preventDefault();
		AppStore.advanceFrame();
	},


	retractFrame: function(e) {
		e.preventDefault();
		AppStore.retractFrame();
	},


	handleUndo: function(e) {
		e.preventDefault();
		RevisionStore.undo();
	},


	handleRedo: function(e) {
		e.preventDefault();
		RevisionStore.redo();
	}

});


module.exports = App;