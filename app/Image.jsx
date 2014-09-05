

var Image = React.createClass({
  render: function() {
    return (
      <div className="Image">
      	<img src={this.props.src} />
      </div>
    );
  }
});


module.exports = Image;