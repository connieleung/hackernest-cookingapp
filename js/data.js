
var motionData = [
	{
		name: 'knead',
		threshold: 36,
		bufferSize: 30,
		greaterThan: false,
		timeBetweenMotions: 500,
		sumA: [],
		sumG: [1,1]
	},
	{
		name: 'roll',
		threshold: 0,
		bufferSize: 0,
		greaterThan: true,
		timeBetweenMotions: 500,
		sumA: [],
		sumG: []
	},
	{
		name: 'whisk',
		threshold: 9,
		bufferSize: 10,
		greaterThan: true,
		timeBetweenMotions: 500,
		sumA: [],
		sumG: []
	},
	{
		name: 'chop',
		threshold: 2.5,
		bufferSize: 10,
		greaterThan: true,
		timeBetweenMotions: 500,
		sumA: [],
		sumG: []
	},
	{
		name: 'sift',
		threshold: 0,
		bufferSize: 0,
		greaterThan: true,
		timeBetweenMotions: 500,
		sumA: [],
		sumG: []
	}
];
