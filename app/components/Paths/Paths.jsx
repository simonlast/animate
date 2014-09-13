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


	/*
	* Adapted from http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
	*/
	drawPath: function(context, pathData) {
		var points = pathData.points;

		if(points.length < 3){
			return
		}

		context.beginPath();

		// Move to start
		context.moveTo(points[0][0], points[0][1]);

		for (var i = 1; i < points.length - 2; i ++){
			var currentPoint = points[i];
			var nextPoint    = points[i + 1];
			var averageX     = (currentPoint[0] + nextPoint[0]) / 2;
			var averageY     = (currentPoint[1] + nextPoint[1]) / 2;

			// Create quadratic curve from current to the average of the current and next.
		  context.quadraticCurveTo(currentPoint[0], currentPoint[1], averageX, averageY);
		}

		// Create a curve to the last two points.
		var lastPoint = points[points.length - 1];
		var secondToLastPoint = points[points.length - 2];
		context.quadraticCurveTo(secondToLastPoint[0], secondToLastPoint[1], lastPoint[0], lastPoint[1]);

		context.lineWidth   = 10;
		context.lineCap     = "round";
		context.strokeStyle = pathData.color;
	  context.stroke();
	}

});


module.exports = Paths;