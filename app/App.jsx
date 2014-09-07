var Canvas     = require("./Canvas.jsx");
var Timeline   = require("./Timeline.jsx");
var Paths      = require("./Paths.jsx");
var Undoable   = require("./Undoable.jsx");
var PlayButton = require("./PlayButton.jsx");

var classSet   = React.addons.classSet;


var App = React.createClass({

	mixins: [Undoable],


	PLAY_INTERVAL: 100,
	MAX_FRAME_COUNT: 100,


	componentDidMount: function() {
		this.checkpoint();
		this.playInterval = setInterval(this.play, this.PLAY_INTERVAL);

		Mousetrap.bind("space", this.togglePlayState);
		Mousetrap.bind("right", this.advanceFrame);
		Mousetrap.bind("left", this.retractFrame);
	},


	getInitialState: function() {
		return {
			frames: [],
			currentFrame: 0,
			playing: false
		}
	},


	render: function() {
		var currentPaths = this.generateCurrentPaths();
		var lastFrame    = this.findLastFrameToCurrent();
		var lastPaths    = [];

		if(lastFrame){
			lastPaths = lastFrame.paths;
		}

		var appClassSet = classSet({
			"playing": this.state.playing,
			"App": true
		});

		return (
			<div className={appClassSet}>
				<div className="canvas-container">
					<Paths paths={lastPaths} />
					<Canvas paths={currentPaths}
						onCreatePath={this.handleCreatePath}
						onAppendPath={this.handleAppendPath}
						onFinishPath={this.handleFinishPath} />
					</div>
				<div className="timeline-container">
					<PlayButton playing={this.state.playing} onPlayStateChange={this.setPlayState} />
					<Timeline
						currentFrame={this.state.currentFrame}
						maxFrameCount={this.MAX_FRAME_COUNT}
						frames={this.state.frames}
						playing={this.state.playing}
						onCurrentFrameChange={this.handleCurrentFrameChange}
						onPlayStateChange={this.setPlayState} />
					</div>
			</div>
		);
	},


	/**
	* Events
	*/

	play: function() {
		if(!this.state.playing){
			return;
		}

		this.advanceFrameWithGuard();
	},


	handleCreatePath: function(point) {
		this.setPlayState(false);

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
		this.setState({currentFrame: newValue});
	},


	handleFinishPath: function() {
		this.checkpoint();
	},


	setPlayState: function(isPlaying){
		this.setState({playing: isPlaying});
	},


	togglePlayState: function(e){
		e.preventDefault();
		this.setPlayState(!this.state.playing)
	},


	/**
	* Helpers
	*/

	advanceFrameWithGuard: function(){
		var newFrame  = this.state.currentFrame += 1;
		var lastFrame = this.findLastFrame();

		if(lastFrame) {
			// Restart at 4 frames past the last frame.
			if(newFrame > lastFrame.frameNumber + 4){
				newFrame = 0;
			}
		}

		this.setState({currentFrame: newFrame});
	},


	advanceFrame: function() {
		var newFrame = this.state.currentFrame + 1;

		if(newFrame >= this.MAX_FRAME_COUNT) {
			newFrame = 0;
		}

		this.setState({currentFrame: newFrame});
	},


	retractFrame: function() {
		var newFrame = this.state.currentFrame - 1;

		if(newFrame < 0) {
			newFrame = this.MAX_FRAME_COUNT - 1;
		}

		this.setState({currentFrame: newFrame});
	},


	createPathInFrame: function(key, point) {
		var currentFrames = _.cloneDeep(this.state);

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
			return frameData.frameNumber < this.state.currentFrame;
		}).bind(this));
	},


	findLastFrame: function() {
		return _.max(this.state.frames, (function(frameData){
			return frameData.frameNumber;
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