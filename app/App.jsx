var Canvas   = require("./Canvas.jsx");
var Timeline = require("./Timeline.jsx");
var Paths    = require("./Paths.jsx");
var Undoable = require("./Undoable.jsx");


var App = React.createClass({

	mixins: [Undoable],


	componentDidMount: function() {
		this.checkpoint();
	},


	getInitialState: function() {
		return {
			frames: [],
			currentFrame: 0
		}
	},


	render: function() {
		var currentPaths = this.generateCurrentPaths();
		var lastFrame    = this.findLastFrame();
		var lastPaths    = [];

		if(lastFrame){
			lastPaths = lastFrame.paths;
		}

		return (
			<div className="App">
				<div className="canvas-container">
					<Paths paths={lastPaths} />
					<Canvas paths={currentPaths}
						onCreatePath={this.handleCreatePath}
						onAppendPath={this.handleAppendPath}
						onFinishPath={this.handleFinishPath} />
					</div>
				<Timeline
					currentFrame={this.state.currentFrame}
					frames={this.state.frames}
					onCurrentFrameChange={this.handleCurrentFrameChange} />
			</div>
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


	handleFinishPath: function() {
		this.checkpoint();
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


	findLastFrame: function() {
		return _.findLast(this.state.frames, (function(frameData){
			return frameData.frameNumber < this.state.currentFrame;
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