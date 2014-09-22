var mori          = require("mori");
var EventEmitter  = require("wolfy87-eventemitter");
var uuid          = require("node-uuid");

var moriHelpers   = require("../helpers/moriHelpers.js");
var RevisionStore = require("./RevisionStore.js");


var PLAY_INTERVAL           = 100;
var	DEFAULT_MAX_FRAME_COUNT = 50;
var STROKE_MIN_WIDTH        = 2;
var STROKE_MAX_WIDTH        = 32;
var STROKE_DEFAULT_WIDTH    = 12;


var defaultColors = mori.vector(
	"rgb(85,98,112)",
	"rgb(78,205,196)",
	"rgb(199,244,100)",
	"rgb(255,107,107)",
	"rgb(196,77,88)",
	"rgb(255, 255, 255)"
);


var AppStore = function(){
	this.events_ = new EventEmitter();
	this.loadFromStorage();
	RevisionStore.checkpoint(this.data);

	this.playInterval = setInterval(this.play.bind(this), PLAY_INTERVAL);

	RevisionStore.on("value", this.onRevisionStoreChange.bind(this));
	RevisionStore.on("undo", this.onRevisionStoreGesture.bind(this));
	RevisionStore.on("redo", this.onRevisionStoreGesture.bind(this));
};


/**
* Events
*/

AppStore.prototype.play = function() {
	if(!this.data.get("playing")){
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
	var value = mori.hash_map(
		"frames", this.data.get("frames"),
		"currentFrame", this.data.get("currentFrame"),
		"playing", this.data.get("playing"),
		"maxFrameCount", this.getMaxFrameCount(),
		"currentColor", this.data.get("currentColor"),
		"colorOptions", this.data.get("colorOptions"),
		"minWidth", this.data.get("minWidth"),
		"maxWidth", this.data.get("maxWidth"),
		"currentWidth", this.data.get("currentWidth"),
		"currentPaths", this.generateCurrentPaths()
	);

	var lastFrame = this.findLastFrameToCurrent();
	var lastPaths = mori.vector();

	if(lastFrame){
		lastPaths = lastFrame.get("paths");
	}

	value = mori.assoc(value, "lastPaths", lastPaths);

	return value;
};


AppStore.prototype.triggerChange = function() {
	this.events_.emitEvent("value", [this.getValue()]);
};


/**
* Public API
*/

AppStore.prototype.clear = function(){
	this.setInitialData();
	this.checkpoint();
	this.triggerChange();
};


AppStore.prototype.createPathInCurrentFrame = function(point) {
	this.setPlayState(false);

	var currentFrame = this.findCurrentFrame();

	if(currentFrame){
		this.createPathInFrame(currentFrame.get("key"), point);
	} else {
		this.createFrameAtCurrentTime(point);
	}

};


AppStore.prototype.appendPathToCurrentFrame = function(point) {
	var currentFrame = this.findCurrentFrame();

	if(currentFrame){
		this.appendPointToFrame(currentFrame.get("key"), point);
	}
};


AppStore.prototype.setCurrentFrame = function(newValue) {
	this.data = mori.assoc(this.data, "currentFrame", newValue);
	this.data = mori.assoc(this.data, "playing", false);
	this.triggerChange();
};


AppStore.prototype.setCurrentColor = function(newValue) {
	this.data = mori.assoc(this.data, "currentColor", newValue);
	this.triggerChange();
};


AppStore.prototype.setCurrentWidth = function(newValue) {
	this.data = mori.assoc(this.data, "currentWidth", newValue);
	this.triggerChange();
};


AppStore.prototype.finishCurrentPath = function() {
	this.checkpoint();
};


AppStore.prototype.setPlayState = function(isPlaying){
	this.data = mori.assoc(this.data, "playing", isPlaying);
	this.triggerChange();
};


AppStore.prototype.togglePlayState = function(){
	this.setPlayState(!this.data.get("playing"));
};


AppStore.prototype.advanceFrameWithGuard = function(){
	var newFrame  = this.data.get("currentFrame") + 1;
	var lastFrame = this.findLastFrame();

	if(lastFrame) {
		// Restart at 4 frames past the last frame.
		if(newFrame > lastFrame.get("frameNumber") + 4){
			newFrame = 0;
		}
	}

	if(newFrame > this.getMaxFrameCount()){
		newFrame = 0;
	}

	this.data = mori.assoc(this.data, "currentFrame", newFrame);
	this.triggerChange();
};


AppStore.prototype.advanceFrame = function() {
	var newFrame  = this.data.get("currentFrame") + 1;

	if(newFrame > this.getMaxFrameCount()) {
		newFrame = 0;
	}

	this.setCurrentFrame(newFrame);
};


AppStore.prototype.retractFrame = function() {
	var newFrame = this.data.get("currentFrame") - 1;

	if(newFrame < 0) {
		newFrame = this.getMaxFrameCount();
	}

	this.setCurrentFrame(newFrame);
};


AppStore.prototype.createPathInFrame = function(key, point) {
	var frameWithKeyIndex = moriHelpers.findIndex(this.data.get("frames"), function(frameData){
		return frameData.get("key") === key;
	});

	var newPath = mori.hash_map(
		"key", uuid.v4(),
		"points", mori.vector(point),
		"color", this.data.get("currentColor"),
		"width", this.data.get("currentWidth")
	);

	this.data = mori.update_in(this.data, ["frames", frameWithKeyIndex, "paths"], function(paths){
		return mori.conj(paths, newPath);
	});
	this.triggerChange();
};


AppStore.prototype.appendPointToFrame = function(key, point) {
	var frameWithKeyIndex = moriHelpers.findIndex(this.data.get("frames"), function(frameData){
		return frameData.get("key") === key;
	});

	var frameWithIndex = mori.nth(this.data.get("frames"), frameWithKeyIndex);
	var lastPathIndex = mori.count(frameWithIndex.get("paths")) - 1;

	this.data = mori.update_in(this.data, ["frames", frameWithKeyIndex, "paths", lastPathIndex, "points"], function(points){
		return mori.conj(points, point);
	});

	this.triggerChange();
};


AppStore.prototype.createFrameAtCurrentTime = function(initialPoint) {
	newFrame = mori.hash_map(
		"key", uuid.v4(),
		"frameNumber", this.data.get("currentFrame"),
		"paths", mori.vector(
			mori.hash_map(
				"key", uuid.v4(),
				"points", mori.vector(initialPoint),
				"color", this.data.get("currentColor"),
				"width", this.data.get("currentWidth")
			)
		)
	);

	var frames = this.data.get("frames");
	frames = mori.conj(frames, newFrame);
	this.data = mori.assoc(this.data, "frames", frames)

	this.triggerChange();
};


AppStore.prototype.findLastFrameToCurrent = function() {
	var frames       = this.data.get("frames");
	var currentFrame = this.data.get("currentFrame");

	var framesLessThanCurrent = mori.filter(function(frameData){
		return frameData.get("frameNumber") < currentFrame;
	}, frames);

	return moriHelpers.max(framesLessThanCurrent, function(frameData){
		return frameData.get("frameNumber");
	});
};


AppStore.prototype.findLastFrame = function() {
	return moriHelpers.max(this.data.get("frames"), function(frameData){
		return frameData.get("frameNumber");
	});
};


AppStore.prototype.findCurrentFrame = function() {
	var currentFrame = this.data.get("currentFrame");

	return moriHelpers.find(this.data.get("frames"), function(frameData){
		return frameData.get("frameNumber") === currentFrame;
	});
};


AppStore.prototype.generateCurrentPaths = function() {
	var currentFrame = this.findCurrentFrame();

	if(currentFrame){
		return currentFrame.get("paths");

	} else {
		// Empty frame.
		return mori.vector(
			mori.hash_map(
				"key", uuid.v4(),
				"points", [],
				"color", this.data.get("currentColor"),
				"width", this.data.get("currentWidth")
			)
		);
	}

};


AppStore.prototype.getMaxFrameCount = function(){
	var lastFrame = this.findLastFrame();

	if(!lastFrame || lastFrame.get("frameNumber") < DEFAULT_MAX_FRAME_COUNT - 10) {
		return DEFAULT_MAX_FRAME_COUNT;
	}
	else {
		return lastFrame.get("frameNumber") + 10;
	}
};


/**
* Private
*/

AppStore.prototype.onRevisionStoreChange = function(value) {
	this.data = value;
	this.triggerChange();
};


AppStore.prototype.onRevisionStoreGesture = function(value) {
	this.persist();
};


AppStore.prototype.checkpoint = function(){
	this.persist();
	RevisionStore.checkpoint(this.data);
};


AppStore.prototype.persist = function(){
	var serialized = JSON.stringify(mori.clj_to_js(this.data));
	localStorage.setItem("animate", serialized);
};


AppStore.prototype.loadFromStorage = function(){
	var serialized = localStorage.getItem("animate");
	var value = JSON.parse(serialized);

	if(value){
		// Reset defaults
		value.currentFrame = 0;
		value.colorOptions = mori.clj_to_js(defaultColors);
		value.currentColor = mori.nth(defaultColors, 0);
		value.currentWidth = STROKE_DEFAULT_WIDTH;

		this.data = mori.js_to_clj(value);
	}
	else {
		this.setInitialData();
	}
};


AppStore.prototype.setInitialData = function() {
	this.data = mori.hash_map(
		"frames", mori.vector(),
		"currentFrame", 0,
		"colorOptions", defaultColors,
		"currentColor", mori.nth(defaultColors, 0),
		"playing", false,
		"minWidth", STROKE_MIN_WIDTH,
		"maxWidth", STROKE_MAX_WIDTH,
		"currentWidth", STROKE_DEFAULT_WIDTH
	);
};


module.exports = new AppStore();