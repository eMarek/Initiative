exports.install = function (framework, name) {

	// Initialize function (is executed automatically one time)

}

// exports.myProperty = 'Property';
 
exports.time_stamp = function () {

	var date = new Date();
	var time_stamp = date.format('yyyy-MM-dd HH:mm:ss');

	return time_stamp;
}