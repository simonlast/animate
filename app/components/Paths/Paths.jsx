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
	* Adapted from http://stackoverflow.com/a/7058606
	*/
	drawPath: function(context, pathData) {
		var points = pathData.points;

		if(points.length < 3){
			return
		}

		context.beginPath();

		// Move to start
		context.moveTo(points[0].x, points[0].y);

		for (var i = 1; i < points.length - 2; i ++){
			var currentPoint = points[i];
			var nextPoint    = points[i + 1];
			var averageX     = (currentPoint.x + nextPoint.x) / 2;
			var averageY     = (currentPoint.y + nextPoint.y) / 2;

			// Create quadratic curve from current to the average of the current and next.
		  context.quadraticCurveTo(currentPoint.x, currentPoint.y, averageX, averageY);
		}

		// Create a curve to the last two points.
		var lastPoint = points[points.length - 1];
		var secondToLastPoint = points[points.length - 2];
		context.quadraticCurveTo(secondToLastPoint.x, secondToLastPoint.y, lastPoint.x, lastPoint.y);

		context.lineWidth   = pathData.width;
		context.lineCap     = "round";
		context.strokeStyle = pathData.color;
	  context.stroke();
	}

});


module.exports = Paths;