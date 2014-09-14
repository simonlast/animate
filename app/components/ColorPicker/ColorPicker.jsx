var Draggable = require("../../mixins/Draggable.jsx");
var AppStore  = require("../../stores/AppStore.js");

var classSet  = React.addons.classSet;


var ColorPicker = React.createClass({

	mixins: [Draggable],


	getInitialState: function() {
		return {
			dragging: false,
			activeColor: null
		};
	},

	render: function() {
		var currentColorStyle = {
			"background-color": this.props.currentColor
		};

		var colorOptions = _.map(this.props.colorOptions, function(color){
			var colorOptionStyle = {
				"background-color": color
			};

			var colorOptionClasses = classSet({
				"color-option": true,
				"active": this.state.activeColor === color
			})

			return (
				<div className={colorOptionClasses} data-color={color} key={color} style={colorOptionStyle}></div>
			);
		}.bind(this));

		var classes = classSet({
			"ColorPicker": true,
			"dragging": this.state.dragging
		})

		return (
			<div className={classes}>
				<div className="color-options">
					{colorOptions}
				</div>
				<div className="current-color" style={currentColorStyle}></div>
			</div>
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		this.updateActiveColor(e.currentTarget);
	},


	handleDragMove: function(e) {
		this.updateActiveColor(e.currentTarget);
	},


	handleDragEnd: function() {
		if(this.state.activeColor){
			AppStore.setCurrentColor(this.state.activeColor);
		}

		this.setState({activeColor: null});
	},


	/**
	* Helpers
	*/

	updateActiveColor: function(currentTarget){
		var overColor = currentTarget.getAttribute("data-color");
		this.setState({activeColor: overColor});
	}

});


module.exports = ColorPicker;