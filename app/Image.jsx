

var Image = React.createClass({
  render: function() {
  	var imageStyle = {
  		transform: "translate(" + this.props.left + "px, " + this.props.top + "px)"
  	};

    return (
      <div className="Image">
      	<img src={this.props.src} style={imageStyle} />
      </div>
    );
  }
});


module.exports = Image;