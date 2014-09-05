InteractiveImage = require("./InteractiveImage.jsx")


var initialState = {
	images: [
	  {
	  	key: "xxx",
	  	left: 100,
	  	top: 100,
	    src: "http://i68.photobucket.com/albums/i28/aquizero/GIF/MegaMan%20Gifs/Megaman.png"
	  },
	  {
	  	key: "yyy",
	  	left: 400,
	  	top: 100,
	    src: "http://fc00.deviantart.net/fs71/f/2012/051/3/9/charlotte_sprite_by_valdrec-d4qdkk6.png"
	  },
	  {
	  	key: "zzz",
	  	left: 200,
	  	top: 300,
	    src: "http://www.hipsterwave.com/wp-content/uploads/2012/04/8_bit_yoshi_by_toshirofrog-d4ijgaj.png"
	  }
	]
};

var Canvas = React.createClass({

  getInitialState: function() {
    return initialState
  },

  handleMove: function(key, newPosition){
  	var state = _.cloneDeep(this.state);
  	var imageData = _.find(state.images, function(imageData){
  		return imageData.key === key;
  	});

  	imageData.left = newPosition.left;
  	imageData.top = newPosition.top;
  	this.setState(state);
  },

  render: function() {
  	var images = _.map(this.state.images, function(imageData) {
  		return (
  			<InteractiveImage
  				top={imageData.top}
  				left={imageData.left}
  				src={imageData.src}
  				key={imageData.key}
  				onMove={this.handleMove}/>
			);
  	}.bind(this));

    return (
      <div className="Canvas">
      	{images}
      </div>
    );
  }

});


module.exports = Canvas;