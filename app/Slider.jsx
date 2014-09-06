var Draggable = require("./Draggable.jsx");

var classSet  = React.addons.classSet;


var Slider = React.createClass({

	mixins: [Draggable],

	render: function() {
		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		};

		return (
			<div className="Slider">
				<div className="button" style={buttonStyle}></div>
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
		var thisRect = this.getDOMNode().getBoundingClientRect();
		var ratio = (screenX - thisRect.left) / thisRect.width;
		var newValue = Math.floor(ratio * this.props.max)
		this.props.onChange(newValue);
	}

});


module.exports = Slider;