var PureRenderMixin = React.addons.PureRenderMixin;


var FramePreview = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {
		var previewStyle = {
			left: ((this.props.time / this.props.max) * 100) + "%"
		};

		return (
			<div className="FramePreview" style={previewStyle} onClick={this.handleClick}></div>
		);
	},


	/**
	* Events
	*/

	handleClick: function(){
		this.props.onSelect(this.props.time);
	}

});


module.exports = FramePreview;