document.addEventListener('DOMContentLoaded', function() {
	var startingWeight = 2
	var endWeight = 1
	var totalRecordedPoints = 13
	var canvas = document.getElementById("myChart")

	var force = [2.0, 7.8, 23.5, 37.3, 42.2, 40.2, 34.3, 27.5, 19.6, 13.7, 7.8, 3.9, 1.0];
	var recordedTimes = [0, 0.099, 0.199, 0.298, 0.397, 0.496 ,0.596 ,0.695 ,0.794, 0.894, 0.993, 1.092, 1.191]


	// These will be gathered from the data obtained from the sensor

	var someLables = [];
	for (var i = 0; i < totalRecordedPoints; i++) {
		someLables.push(i);
	}

	var deltaWeight = startingWeight - endWeight
	var sumOfForce = 0;

	for(var num of force) {
		sumOfForce += num;
	}

	console.log(sumOfForce)


	var currentThrust;
	var thrustGraphArray = [];
	var weightArray = [];
	var currentWeight = null;
	
	// Gives how much percentage of the total force is the current data point
	function givePercentageOfTotal(current, total) {
		var percentage = current / total;
		return percentage;
	}

	// Converts the previous percentage to estimated current weight
	function convertPercentToCurrentWeight(currentWeight, percentage) {
		var weight = currentWeight - percentage * deltaWeight;
		return weight;
	}

	// Estimates the thurst graph points (Blue graph)

	function convertWeigthAndYIntoThrustGraph(weight, pointY) {
		var approximateThrust;
		approximateThrust = pointY - weight;
		return approximateThrust;
	}

	function calculateImpulseFromThrust(thrustPoint, deltaTime) {
		var impulse = thrustPoint * deltaTime
		return impulse
	}

	//Creating the estimated weight array (Yellow graph) 

	for (var y of force) {
		if (currentWeight == null) {
			currentWeight = startingWeight;
			weightArray.push(currentWeight);
		} else {
			currentWeight = convertPercentToCurrentWeight(currentWeight, givePercentageOfTotal(y, sumOfForce));
			weightArray.push(currentWeight);
		}
	}

	console.log(weightArray);

	// Estimating thrust graph (Blue)

	for (var i = 0; i < totalRecordedPoints; i++) {
		thrustGraphArray.push(convertWeigthAndYIntoThrustGraph(weightArray[i], force[i]));
	}

	console.log(thrustGraphArray);

	//Making impulse array
	var impulseGraphArray = []
	var totalImpulse = 0;
	for (var i = 0; i < recordedTimes.length - 1; i++) {
		var currentImpulse = calculateImpulseFromThrust(thrustGraphArray[i], recordedTimes[i+1]-recordedTimes[i])
		impulseGraphArray.push(currentImpulse);
		totalImpulse += currentImpulse
	}

	console.log(impulseGraphArray)
	console.log(totalImpulse)

	// Drawing the chart

	var chart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: recordedTimes,
			datasets: [
	            {
	                label: 'Thrust Force (N)',
	                data: thrustGraphArray,
	                borderColor: 'blue',
	                fill: false
	            },
	            {
	                label: 'Force (N)',
	                data: force,
	                borderColor: 'red',
	                fill: false
	            },
	            {
	            	label: 'Estimated weight of rocket (N)',
	            	data: weightArray,
	            	borderColor: 'yellow',
	            	fill: false
	            },
	            {
	            	label: 'Estimated impulse (N.s)',
	            	data: impulseGraphArray,
	            	borderColor: 'purple'
	            }
            ]
		},
		options: {
			responsive: true
		}
	});
});