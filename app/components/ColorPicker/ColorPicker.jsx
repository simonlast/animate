var Draggable = require("../../mixins/Draggable.jsx");


var ColorPicker = React.createClass({

	mixins: [Draggable],

	render: function() {
		var currentColorStyle = {
			"background-color": this.props.currentColor
		};

		return (
			<div className="ColorPicker">
				<div className="current-color" style={currentColorStyle}></div>
			</div>
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
	},


	handleDragMove: function(e) {
	},


	handleDragEnd: function(e) {
	}


	/**
	* Helpers
	*/

});


module.exports = ColorPicker;