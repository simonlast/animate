var RevisionStore = require("./RevisionStore.js");


var PLAY_INTERVAL   = 100;
var	MAX_FRAME_COUNT = 100;


var STROKE_MIN_WIDTH     = 2;
var STROKE_MAX_WIDTH     = 32;
var STROKE_DEFAULT_WIDTH = 12;


var defaultColors = [
	"rgb(85,98,112)",
	"rgb(78,205,196)",
	"rgb(199,244,100)",
	"rgb(255,107,107)",
	"rgb(196,77,88)"
];


var AppStore = function(){
	this.events_ = new EventEmitter();

	this.data_ = {
		frames: [],
		currentFrame: 0,
		colorOptions: defaultColors,
		currentColor: defaultColors[0],
		playing: false,
		maxFrameCount: MAX_FRAME_COUNT,
		minWidth: STROKE_MIN_WIDTH,
		maxWidth: STROKE_MAX_WIDTH,
		currentWidth: STROKE_DEFAULT_WIDTH
	};

	RevisionStore.checkpoint(this.data_);

	this.playInterval = setInterval(this.play.bind(this), PLAY_INTERVAL);
	RevisionStore.onValue(this.onRevisionStoreChange.bind(this));
};


/**
* Events
*/

AppStore.prototype.play = function() {
	if(!this.data_.playing){
		return;
	}

	this.advanceFrameWithGuard();
};


/**
* Event API
*/

AppStore.prototype.onValue = function(callback) {
	this.events_.on("value", callback);
};


AppStore.prototype.getValue = function(callback) {
	var value = {
		frames: this.data_.frames,
		currentFrame: this.data_.currentFrame,
		playing: this.data_.playing,
		maxFrameCount: this.data_.maxFrameCount,
		currentColor: this.data_.currentColor,
		colorOptions: this.data_.colorOptions,
		minWidth: this.data_.minWidth,
		maxWidth: this.data_.maxWidth,
		currentWidth: this.data_.currentWidth,
		currentPaths: this.generateCurrentPaths()
	};

	var lastFrame = this.findLastFrameToCurrent();
	var lastPaths = [];

	if(lastFrame){
		lastPaths = lastFrame.paths;
	}

	value.lastPaths = lastPaths

	return value;
};


AppStore.prototype.triggerChange = function() {
	this.events_.emitEvent("value", [this.getValue()]);
};


/**
* Public API
*/

AppStore.prototype.createPathInCurrentFrame = function(point) {
	this.setPlayState(false);

	var currentFrame = this.findCurrentFrame();

	if(currentFrame){
		this.createPathInFrame(currentFrame.key, point);
	} else {
		this.createFrameAtCurrentTime(point)
	}

};


AppStore.prototype.appendPathToCurrentFrame = function(point) {
	var currentFrame = this.findCurrentFrame();
	this.appendPointToFrame(currentFrame.key, point);
};


AppStore.prototype.setCurrentFrame = function(newValue) {
	this.data_.currentFrame = newValue;
	this.data_.playing = false;
	this.triggerChange();
};


AppStore.prototype.setCurrentColor = function(newValue) {
	this.data_.currentColor = newValue;
	this.triggerChange();
};


AppStore.prototype.setCurrentWidth = function(newValue) {
	this.data_.currentWidth = newValue;
	this.triggerChange();
};


AppStore.prototype.finishCurrentPath = function() {
	RevisionStore.checkpoint(this.data_);
};


AppStore.prototype.setPlayState = function(isPlaying){
	this.data_.playing = isPlaying;
	this.triggerChange();
};


AppStore.prototype.togglePlayState = function(){
	this.setPlayState(!this.data_.playing);
};


AppStore.prototype.advanceFrameWithGuard = function(){
	var newFrame  = this.data_.currentFrame + 1;
	var lastFrame = this.findLastFrame();

	if(lastFrame) {
		// Restart at 4 frames past the last frame.
		if(newFrame > lastFrame.frameNumber + 4){
			newFrame = 0;
		}
	}

	if(newFrame > this.data_.maxFrameCount){
		newFrame = 0;
	}

	this.data_.currentFrame = newFrame;
	this.triggerChange();
};


AppStore.prototype.advanceFrame = function() {
	var newFrame = this.data_.currentFrame + 1;

	if(newFrame >= this.data_.maxFrameCount) {
		newFrame = 0;
	}

	this.data_.currentFrame = newFrame;
	this.data_.playing = false;
	this.triggerChange();
};


AppStore.prototype.retractFrame = function() {
	var newFrame = this.data_.currentFrame - 1;

	if(newFrame < 0) {
		newFrame = this.data_.maxFrameCount - 1;
	}

	this.data_.currentFrame = newFrame;
	this.data_.playing = false;
	this.triggerChange();
};


AppStore.prototype.createPathInFrame = function(key, point) {
	var frameWithKey = _.find(this.data_.frames, (function(frameData){
		return frameData.key === key;
	}).bind(this));

	var newPath = {
		key: uuid.v4(),
		points: [point],
		color: this.data_.currentColor,
		width: this.data_.currentWidth
	};

	frameWithKey.paths.push(newPath);
	this.triggerChange();
};


AppStore.prototype.appendPointToFrame = function(key, point) {
	var frameWithKey = _.find(this.data_.frames, (function(frameData){
		return frameData.key === key;
	}).bind(this));

	lastPath = frameWithKey.paths[frameWithKey.paths.length - 1];
	lastPath.points.push(point);
	this.triggerChange();
};


AppStore.prototype.createFrameAtCurrentTime = function(initialPoint) {
	newFrame = {
		key: uuid.v4(),
		frameNumber: this.data_.currentFrame,
		paths: [
			{
				key: uuid.v4(),
				points: [initialPoint],
				color: this.data_.currentColor,
				width: this.data_.currentWidth
			}
		]
	};

	this.data_.frames.push(newFrame);
	this.triggerChange();
};


AppStore.prototype.findLastFrameToCurrent = function() {
	return _.findLast(this.data_.frames, (function(frameData){
		return frameData.frameNumber < this.data_.currentFrame;
	}).bind(this));
};


AppStore.prototype.findLastFrame = function() {
	return _.max(this.data_.frames, (function(frameData){
		return frameData.frameNumber;
	}).bind(this));
};


AppStore.prototype.findCurrentFrame = function() {
	return _.find(this.data_.frames, (function(frameData){
		return frameData.frameNumber === this.data_.currentFrame;
	}).bind(this));
};


AppStore.prototype.generateCurrentPaths = function() {
	var currentFrame = this.findCurrentFrame();

	if(currentFrame){
		return currentFrame.paths;

	} else {

		// Empty frame.
		return [
			{
				key: uuid.v4(),
				points: [],
				color: this.data_.currentColor,
				width: this.data_.currentWidth
			}
		];

	}

};


/**
* Private
*/

AppStore.prototype.onRevisionStoreChange = function(value) {
	this.data_ = value;
	this.triggerChange();
};


module.exports = new AppStore();