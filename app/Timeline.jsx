var Slider       = require("./Slider.jsx");
var FramePreview = require("./FramePreview.jsx");
var PlayButton   = require("./PlayButton.jsx");


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
		this.props.onCurrentFrameChange(newValue);
	},


	previewSelected: function(previewTime) {
		this.props.onCurrentFrameChange(previewTime);
	}

});


module.exports = Timeline;