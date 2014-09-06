var Slider       = require("./Slider.jsx");
var FramePreview = require("./FramePreview.jsx");


var Timeline = React.createClass({

	render: function() {
		var maxTime = 100;

		var previews = _.map(this.props.frames, (function(frameData){
			return (
				<FramePreview
					key={frameData.key}
					time={frameData.frameNumber}
					max={maxTime}
					onSelect={this.previewSelected} />
			);
		}).bind(this));

		return (
			<div className="Timeline">
				<Slider current={this.props.currentFrame} max={maxTime} onChange={this.sliderChanged} />
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