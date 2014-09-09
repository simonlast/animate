var AppStore = require("../../stores/AppStore.js");


var classSet  = React.addons.classSet;


var PlayButton = React.createClass({

	render: function() {
		var iClassSet = classSet({
			"fa": true,
			"fa-play": !this.props.playing,
			"fa-pause": this.props.playing
		});

		return (
			<div className="PlayButton" onMouseDown={this.handleMouseDown}>
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