var mori            = require("mori");

var Slider          = require("../Slider/Slider.jsx");
var FramePreview    = require("../FramePreview/FramePreview.jsx");
var PlayButton      = require("../PlayButton/PlayButton.jsx");
var AppStore        = require("../../stores/AppStore.js");

var PureRenderMixin = React.addons.PureRenderMixin;


var Timeline = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {
		var previews = mori.map(this.createFramePreview, this.props.frames);

		return (
			<div className="Timeline">
				<Slider
					current={this.props.currentFrame}
					max={this.props.maxFrameCount}
					playing={this.props.playing}
					onChange={this.sliderChanged} />
				<div className="previews">
					{mori.clj_to_js(previews)}
				</div>
			</div>
		);
	},


	/**
	* Events
	*/

	sliderChanged: function(newValue) {
		AppStore.setCurrentFrame(newValue);
	},


	previewSelected: function(previewTime) {
		AppStore.setCurrentFrame(previewTime);
	},


	/**
	* Helpers
	*/

	createFramePreview: function(frameData) {
		return (
			<FramePreview
				key={frameData.get("key")}
				time={frameData.get("frameNumber")}
				max={this.props.maxFrameCount}
				onSelect={this.previewSelected} />
		);
	}

});


module.exports = Timeline;