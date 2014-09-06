Slider       = require("./Slider.jsx");
FramePreview = require("./FramePreview.jsx");


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
				<Slider current={this.props.time} max={maxTime} />
				<div className="previews">
					{previews}
				</div>
			</div>
		);
	}

});


module.exports = Timeline;