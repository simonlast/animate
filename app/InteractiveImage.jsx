Draggable = require("./Draggable.jsx");
Image     = require("./Image.jsx");

classSet  = React.addons.classSet;


var InteractiveImage = React.createClass({

	mixins: [Draggable],

  getInitialState: function() {
    return {
      active: false
    };
  },

  handleDragStart: function(e){
    this.startLeft = this.props.left;
    this.startTop = this.props.top;
    this.setState({active: true});
  },

  handleDragMove: function(e){
    var newPosition = {
      left: this.startLeft + (e.currentX - e.startX),
      top: this.startTop + (e.currentY - e.startY)
    };

    this.props.onMove(this.props.key, newPosition);
  },

  handleDragEnd: function(e){
    this.offsetX = null
    this.offsetY = null
    this.setState({active: false});
  },

	render: function(){
    var containerStyle = {
      transform: "translate(" + this.props.left + "px, " + this.props.top + "px)"
    };

    var containerClasses = classSet({
      "InteractiveImage": true,
      "active": this.state.active
    });

		return (
      <div className={containerClasses} style={containerStyle} >
				<Image src={this.props.src} />
      </div>
		);
	}

});


module.exports = InteractiveImage
