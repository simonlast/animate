var mori            = require("mori");

var WindowResize    = require("../../mixins/WindowResize.jsx");

var PureRenderMixin = React.addons.PureRenderMixin;


var Paths = React.createClass({

	mixins: [PureRenderMixin, WindowResize],


	render: function() {
		return (
			<div className="Paths">
				<canvas ref="canvas"></canvas>
			</div>
		);
	},


	componentDidMount: function() {
		this.sizeCanvas();
  },


  componentDidUpdate: function() {
    this.redraw();
  },


	/**
	* Events
	*/

	handleWindowResize: function() {
		this.sizeCanvas();
	},


	/**
	* Helpers
	*/

	redraw: function(){
    var context = this.refs.canvas.getDOMNode().getContext('2d');

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    mori.each(this.props.paths, function(pathData){
    	this.drawPath(context, pathData);
    }.bind(this));
	},


	/*
	* Adapted from http://stackoverflow.com/a/7058606
	*/
	drawPath: function(context, pathData) {
		var points    = pathData.get("points");
		var numPoints = mori.count(points);

		if(numPoints < 3){
			return
		}

		context.beginPath();

		// Move to start
		var firstPoint = mori.nth(points, 0);
		context.moveTo(firstPoint.get("x"), firstPoint.get("y"));

		for (var i = 1; i < numPoints - 2; i ++){
			var currentPoint = mori.nth(points, i);
			var nextPoint    = mori.nth(points, i + 1);
			var averageX     = (currentPoint.get("x") + nextPoint.get("x")) / 2;
			var averageY     = (currentPoint.get("y") + nextPoint.get("y")) / 2;

			// Create quadratic curve from current to the average of the current and next.
		  context.quadraticCurveTo(currentPoint.get("x"), currentPoint.get("y"), averageX, averageY);
		}

		// Create a curve to the last two points.
		var lastPoint = mori.nth(points, numPoints - 1);
		var secondToLastPoint = mori.nth(points, numPoints - 2);
		context.quadraticCurveTo(secondToLastPoint.get("x"), secondToLastPoint.get("y"), lastPoint.get("x"), lastPoint.get("y"));

		context.lineWidth   = pathData.get("width");
		context.lineCap     = "round";
		context.strokeStyle = pathData.get("color");
	  context.stroke();
	},


	sizeCanvas: function() {
		var thisRect  = this.getDOMNode().getBoundingClientRect();
		var canvas    = this.refs.canvas.getDOMNode();
		canvas.width  = thisRect.width;
		canvas.height = thisRect.height;

    this.redraw();
  }

});


module.exports = Paths;