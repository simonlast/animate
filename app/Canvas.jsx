Paths = require("./Paths.jsx");


var Canvas = React.createClass({

	render: function() {
		return (
			<div className="Canvas">
				<Paths paths={this.props.paths} />
			</div>
		);
	}

});


module.exports = Canvas;