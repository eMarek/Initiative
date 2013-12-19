exports.install = function (framework, name) {

	// Initialize function (is executed automatically one time)

}

// exports.myProperty = 'Property';
 
exports.time_stamp = function () {

	var d = new Date();

	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();

	var time_stamp = [ year, month, date ].join('-') + ' ' + [ hours, minutes, seconds ].join(':');

	return time_stamp;
}