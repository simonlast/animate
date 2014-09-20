var AppStore        = require("../../stores/AppStore.js");

var classSet        = React.addons.classSet;
var PureRenderMixin = React.addons.PureRenderMixin;


var ClearButton = React.createClass({

	mixins: [PureRenderMixin],


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