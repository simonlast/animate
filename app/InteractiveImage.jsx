Draggable = require("./Draggable.jsx");
Image     = require("./Image.jsx");


var InteractiveImage = React.createClass({

	mixins: [Draggable],

  getInitialState: function() {
    return {
    	left: this.props.left,
    	top: this.props.top
    };
  },

  handleDragStart: function(e){
  	console.log(e);
  },

  handleDragMove: function(e){
  	this.setState({
  		left: e.currentX,
  		top: e.currentY,
  	})
  },

  handleDragEnd: function(e){
  	console.log(e);
  },

	render: function(){
		return (
      <div className="InteractiveImage">
				<Image left={this.state.left} top={this.state.top} src={this.props.src} />
      </div>
		);
	}

});


module.exports = InteractiveImage
