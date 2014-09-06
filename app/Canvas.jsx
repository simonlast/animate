var Paths     = require("./Paths.jsx");
var Draggable = require("./Draggable.jsx");


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
	}

});


module.exports = Canvas;