var Paths = React.createClass({

	render: function() {
		return (
			<div className="Paths">
				<canvas ref="canvas"></canvas>
			</div>
		);
	},


	componentDidMount: function() {
		var thisRect  = this.getDOMNode().getBoundingClientRect();
		var canvas    = this.refs.canvas.getDOMNode();
		canvas.width  = thisRect.width;
		canvas.height = thisRect.height;

    this.redraw();
  },


  componentDidUpdate: function() {
    this.redraw();
  },


	/**
	* Helpers
	*/

	redraw: function(){
    var context = this.refs.canvas.getDOMNode().getContext('2d');

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    _.each(this.props.paths, function(pathData){
    	this.drawPath(context, pathData);
    }.bind(this));
	},


	drawPath: function(context, pathData) {
		if(pathData.points.length === 0){
			return
		}

		context.beginPath();

		var firstPoint = pathData.points[0]
		context.moveTo(firstPoint[0], firstPoint[1]);

		_.each(pathData.points, function(point){
			context.lineTo(point[0], point[1])
		});

    context.lineWidth = 10;
    context.lineCap = "round";
	  context.strokeStyle = pathData.color;
	  context.stroke();
	}

});


module.exports = Paths;