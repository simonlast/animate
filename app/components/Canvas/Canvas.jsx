var Paths     = require("../Paths/Paths.jsx");
var Draggable = require("../../mixins/Draggable.jsx");


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
		this.props.onCreatePath([e.currentX, e.currentY]);
	},


	handleDragMove: function(e) {
		this.props.onAppendPath([e.currentX, e.currentY]);
	},


	handleDragEnd: function(e) {
		this.props.onAppendPath([e.currentX, e.currentY]);
		this.props.onFinishPath();
	}


});


module.exports = Canvas;