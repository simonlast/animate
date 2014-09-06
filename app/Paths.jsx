
var Paths = React.createClass({

  dFromPointArray: function(arr){
    var d = "";
    d += "M" + arr[0][0] + " " + arr[0][1];

    for(var i=1; i<arr.length; i++){
      var curr = arr[i];
      d += " L" + curr[0] + " " + curr[1];
    }
    return d;
  },

	render: function() {
		var paths = _.map(this.props.paths, (function(pathData){
			console.log(pathData.points);
			var d = this.dFromPointArray(pathData.points);
			return (
				<path key={pathData.key} d={d}></path>
			);
		}).bind(this));

		return (
			<div className="Paths">
				<svg xmlns="http://www.w3.org/2000/svg">
					{paths}
				</svg>
			</div>
		);
	}

});


module.exports = Paths;