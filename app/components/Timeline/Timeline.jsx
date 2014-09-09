var Slider       = require("../Slider/Slider.jsx");
var FramePreview = require("../FramePreview/FramePreview.jsx");
var PlayButton   = require("../PlayButton/PlayButton.jsx");
var AppStore     = require("../../stores/AppStore.js");


var Timeline = React.createClass({

	render: function() {
		var previews = _.map(this.props.frames, (function(frameData){
			return (
				<FramePreview
					key={frameData.key}
					time={frameData.frameNumber}
					max={this.props.maxFrameCount}
					onSelect={this.previewSelected} />
			);
		}).bind(this));

		return (
			<div className="Timeline">
				<Slider current={this.props.currentFrame} max={this.props.maxFrameCount} onChange={this.sliderChanged} />
				<div className="previews">
					{previews}
				</div>
			</div>
		);
	},


	/**
	* Events
	*/

	sliderChanged: function(newValue) {
		AppStore.updateFrame(newValue);
	},


	previewSelected: function(previewTime) {
		AppStore.updateFrame(previewTime);
	}

});


module.exports = Timeline;