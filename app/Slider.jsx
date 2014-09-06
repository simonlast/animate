
var Slider = React.createClass({

	render: function() {

		var buttonStyle = {
			left: ((this.props.current / this.props.max) * 100) + "%"
		}

		return (
			<div className="Slider">
				<div className="button" style={buttonStyle}></div>
			</div>
		);
	}

});


module.exports = Slider;