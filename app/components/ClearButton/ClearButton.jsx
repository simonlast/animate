var AppStore = require("../../stores/AppStore.js");


var classSet  = React.addons.classSet;


var ClearButton = React.createClass({

	render: function() {

		return (
			<div className="ClearButton" onMouseDown={this.handleMouseDown}>
				<i className="fa fa-refresh"></i>
			</div>
		);
	},


	/**
	* Events
	*/

	handleMouseDown: function(e) {
		e.preventDefault();
		AppStore.clear();
	}

});


module.exports = ClearButton;