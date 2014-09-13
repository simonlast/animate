var Draggable = require("../../mixins/Draggable.jsx");


var Slider = React.createClass({

	mixins: [Draggable],

	render: function() {
		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		};

		return (
			<div className="Slider">
				<div className="slider-cap left"></div>
				<div className="slider-background" ref="background">
					<div className="button" style={buttonStyle} ref="button"></div>
				</div>
				<div className="slider-cap right"></div>
			</div>
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		this.updateSlider(e.currentX);
	},


	handleDragMove: function(e) {
		this.updateSlider(e.currentX);
	},


	handleDragEnd: function(e) {
		this.updateSlider(e.currentX);
	},


	/**
	* Helpers
	*/

	updateSlider: function(offsetX) {
		var thisRect       = this.getDOMNode().getBoundingClientRect();
		var backgroundRect = this.refs.background.getDOMNode().getBoundingClientRect();
		var fixedOffsetX   = offsetX - (backgroundRect.left - thisRect.left);
		var ratio          = fixedOffsetX / backgroundRect.width;
		var newValue       = Math.floor(ratio * this.props.max);

		if(newValue < 0){
			newValue = 0;
		}

		if(newValue > this.props.max){
			newValue = this.props.max;
		}

		this.props.onChange(newValue);
	}

});


module.exports = Slider;