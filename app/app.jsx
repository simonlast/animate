Canvas   = require("./Canvas.jsx");
Timeline = require("./Timeline.jsx");


var initialState = {
	frames: [
		{
			key: "x",
			time: 0,
			paths: [
				{
					key: "y",
					points: [
						[0, 0]
					]
				},
				{
					key: "z",
					points: [
						[400, 0],
						[400, 200],
						[300, 300]
					]
				}
			]
		}
	],

	currentTime: 0,

	currentPaths: [
		{
			key: "y",
			points: [
				[0, 0],
				[100, 100],
				[200, 100],
				[100, 200]
			]
		},
		{
			key: "z",
			points: [
				[400, 0],
				[400, 200],
				[300, 300]
			]
		}
	]
}

var App = React.createClass({

	getInitialState: function() {
		return initialState
	},

	render: function() {
		return (
			<div className="App">
				<Canvas paths={this.state.currentPaths} />
				<Timeline time={this.state.currentTime} frames={this.state.frames} />
			</div>
		);
	}

});


module.exports = App;