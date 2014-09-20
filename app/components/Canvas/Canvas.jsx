var mori      = require("mori");
var Paths     = require("../Paths/Paths.jsx");
var Draggable = require("../../mixins/Draggable.jsx");
var AppStore  = require("../../stores/AppStore.js");


var Canvas = React.createClass({

	mixins: [Draggable],

	render: function() {
		return (
			<div className="Canvas">
				<Paths paths={this.props.paths} />
			</div>
		);
	},


	/**
	* Events
	*/

	handleDragStart: function(e) {
		AppStore.createPathInCurrentFrame(mori.hash_map("x", e.currentX, "y", e.currentY));
	},


	handleDragMove: function(e) {
		AppStore.appendPathToCurrentFrame(mori.hash_map("x", e.currentX, "y", e.currentY));
	},


	handleDragEnd: function() {
		AppStore.finishCurrentPath();
	}


});


module.exports = Canvas;