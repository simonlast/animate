var Slider       = require("./Slider.jsx");
var FramePreview = require("./FramePreview.jsx");


var Timeline = React.createClass({

	render: function() {
		var previews = _.map(this.props.frames, (function(frameData){
			return (
				<FramePreview key={frameData.key} time={frameData.time} paths={frameData.paths} />
			);
		}).bind(this));

		var maxTime = 100;

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
	}

});


module.exports = Timeline;