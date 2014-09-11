var Draggable = require("../../mixins/Draggable.jsx");


var Slider = React.createClass({

	mixins: [Draggable],

	render: function() {
		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		};

		return (
			<div className="Slider">
				<div className="button" style={buttonStyle} ref="button"></div>
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

	updateSlider: function(screenX) {
		var thisRect   = this.getDOMNode().getBoundingClientRect();
		var buttonRect = this.refs.button.getDOMNode().getBoundingClientRect();
		var thisLeft   = thisRect.left + buttonRect.width / 2;
		var thisWidth  = thisRect.width - buttonRect.width;
		var ratio      = (screenX - thisLeft) / thisWidth	;
		var newValue   = Math.floor(ratio * this.props.max);

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