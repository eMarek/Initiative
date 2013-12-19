exports.install = function (framework, name) {

	// Initialize function (is executed automatically one time)

}

// exports.myProperty = 'Property';
 
exports.time_stamp = function () {

	var d = new Date();

	var year = d.getFullYear();
	var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

	var time_stamp = [ year, month, date ].join('-') + ' ' + [ hours, minutes, seconds ].join(':');

	return time_stamp;
}