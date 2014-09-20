var mori            = require("mori");

var Canvas          = require("../Canvas/Canvas.jsx");
var Timeline        = require("../Timeline/Timeline.jsx");
var Paths           = require("../Paths/Paths.jsx");
var PlayButton      = require("../PlayButton/PlayButton.jsx");
var ColorPicker     = require("../ColorPicker/ColorPicker.jsx");
var WidthPicker     = require("../WidthPicker/WidthPicker.jsx");
var ClearButton     = require("../ClearButton/ClearButton.jsx");
var AppStore        = require("../../stores/AppStore.js");
var RevisionStore   = require("../../stores/RevisionStore.js");

var classSet        = React.addons.classSet;
var PureRenderMixin = React.addons.PureRenderMixin;


var App = React.createClass({

	mixins: [PureRenderMixin],


	componentDidMount: function() {
		AppStore.onValue(this.storeChanged);

		Mousetrap.bind("space", this.togglePlayState);
		Mousetrap.bind("right", this.advanceFrame);
		Mousetrap.bind("left", this.retractFrame);
		Mousetrap.bind("command+z", this.handleUndo);
		Mousetrap.bind("command+shift+z", this.handleRedo);
	},


	getInitialState: function() {
		return {
			app: AppStore.getValue()
		};
	},


	storeChanged: function(newValue){
		this.setState({
			app: newValue
		});
	},


	render: function() {
		var state = this.state.app;

		var appClassSet = classSet({
			"playing": state.get("playing"),
			"App": true
		});

		return (
			<div className={appClassSet}>
				<div className="timeline-container">
					<PlayButton playing={state.get("playing")} />
					<ColorPicker
						currentColor={state.get("currentColor")}
						colorOptions={state.get("colorOptions")} />
					<WidthPicker
						currentWidth={state.get("currentWidth")}
						minWidth={state.get("minWidth")}
						maxWidth={state.get("maxWidth")} />
					<Timeline
						currentFrame={state.get("currentFrame")}
						maxFrameCount={state.get("maxFrameCount")}
						frames={state.get("frames")}
						playing={state.get("playing")} />
					<ClearButton />
				</div>
				<div className="canvas-container">
					<Paths paths={state.get("lastPaths")} />
					<Canvas paths={state.get("currentPaths")} />
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