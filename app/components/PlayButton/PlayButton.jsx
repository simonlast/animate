var AppStore        = require("../../stores/AppStore.js");


var PureRenderMixin = React.addons.PureRenderMixin;
var classSet        = React.addons.classSet;


var PlayButton = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {
		var buttonClassSet = classSet({
			"PlayButton": true,
			"playing": this.props.playing
		});

		var iClassSet = classSet({
			"fa": true,
			"fa-play": !this.props.playing,
			"fa-pause": this.props.playing
		});

		return (
			<div className={buttonClassSet} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
				<i className={iClassSet}></i>
			</div>
		);
	},


	/**
	* Events
	*/

	handleMouseDown: function(e) {
		e.preventDefault();
		AppStore.togglePlayState();
	}

});


module.exports = PlayButton;