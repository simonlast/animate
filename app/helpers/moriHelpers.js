var mori = require("mori");


var moriHelpers = {};


moriHelpers.find = function(collection, fn){
	var count = mori.count(collection);

	for (var i=0; i<count; i++){
		var curr = mori.nth(collection, i);

		if(fn(curr)){
			return curr;
		}
	}

	return null;
};


moriHelpers.findIndex = function(collection, fn) {
	var index = 0;

	moriHelpers.find(collection, function(current){
		if(fn(current)){
			return true;
		} else {
			index++;
			return false
		}
	});

	return index;
};


moriHelpers.max = function(collection, valueFunction) {
	var maxValue = null;
	var maxItem  = null;

	mori.each(collection, function(current){
		var value = valueFunction(current);

		if(!maxValue || value > maxValue){
			maxValue = value;
			maxItem = current;
		}
	});

	return maxItem;
};


module.exports = moriHelpers;