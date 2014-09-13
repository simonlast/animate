var Paths = React.createClass({

	render: function() {
		var paths = _.map(this.props.paths, (function(pathData){
			var d = this.dFromPointArray(pathData.points);

			var pathStyle = {
				stroke: pathData.color
			};

			if(d.length > 0){
				return (
					<path key={pathData.key} d={d} style={pathStyle}></path>
				);
			} else {
				return null
			}
		}).bind(this));

		paths = _.compact(paths);

		return (
			<div className="Paths">
				<svg xmlns="http://www.w3.org/2000/svg">
					{paths}
				</svg>
			</div>
		);
	},


	/**
	* Helpers
	*/

  dFromPointArray: function(arr){
  	if(arr.length === 0){
  		return ""
  	}

    var d = "";
    d += "M" + arr[0][0] + " " + arr[0][1];

    for(var i=1; i<arr.length; i++){
      var curr = arr[i];
      d += " L" + curr[0] + " " + curr[1];
    }
    return d;
  }

});


module.exports = Paths;