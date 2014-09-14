var Draggable = require("../../mixins/Draggable.jsx");
var AppStore  = require("../../stores/AppStore.js");

var classSet  = React.addons.classSet;


var WidthPicker = React.createClass({

	mixins: [Draggable],


	currentWidthMinRatio: .1,
	currentWidthMaxRatio: .85,


	getInitialState: function() {
		return {
			dragging: false,
			activeColor: null
		};
	},

	render: function() {
		var classes = classSet({
			"WidthPicker": true,
			"dragging": this.state.dragging
		});

		var currentWidthRatio =
			(this.props.currentWidth - this.props.minWidth) /
			(this.props.maxWidth - this.props.minWidth);

		// Constrain ratio.
		currentWidthRatio *= this.currentWidthMaxRatio - this.currentWidthMinRatio;
		currentWidthRatio += this.currentWidthMinRatio;

		var currentWidthStyle = {
			"width": (currentWidthRatio * 100) + "%",
			"height": (currentWidthRatio * 100) + "%",
			"top": (50 - (currentWidthRatio * 100) / 2) + "%",
			"left": (50 - (currentWidthRatio * 100) / 2) + "%"
		};

		var sliderButtonStyle = {
			"top": ((1 - currentWidthRatio) * 100) + "%"
		};

		return (
			<div className={classes}>
				<div className="width-slider">
					<div className="slider-background" ref="sliderBackground">
						<div className="slider-button" style={sliderButtonStyle}></div>
					</div>
				</div>
				<div className="current-width">
					<div className="current-width-inner" style={currentWidthStyle}></div>
				</div>
			</div>
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		this.updateCurrentWidth(e.currentY);
	},


	handleDragMove: function(e) {
		this.updateCurrentWidth(e.currentY);
	},


	/**
	* Helpers
	*/

	updateCurrentWidth: function(currentY) {
		var sliderBackground        = this.refs.sliderBackground.getDOMNode();
		var sliderBackgroundRect    = sliderBackground.getBoundingClientRect();
		var thisRect                = this.getDOMNode().getBoundingClientRect();
		var sliderBackgroundOffsetY = sliderBackgroundRect.top - thisRect.top;
		var currentOffsetY          = currentY - sliderBackgroundOffsetY;
		var currentRatio            = currentOffsetY / sliderBackgroundRect.height;

		// Constrain ratio.
		if(currentRatio < 0){
			currentRatio = 0;
		}
		else if (currentRatio > 1){
			currentRatio = 1;
		}

		// Invert ratio
		currentRatio = 1 - currentRatio;

		var currentWidth = (currentRatio * (this.props.maxWidth - this.props.minWidth)) + this.props.minWidth;
		AppStore.setCurrentWidth(currentWidth);
	}

});


module.exports = WidthPicker;