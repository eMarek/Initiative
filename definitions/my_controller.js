framework.on('controller', function(controller, name) {
	var self = controller;

	/*
	// example
	if (controller.user.isExpired && controller.url !== 'you-must-login') {

		// This cancel an action
		controller.cancel();
		controller.redirect('/you-must-login/');
		return;
	}
	*/

	if (self.url == '/auth/cache_read/') {
		self.plain('ne dela');
		self.cancel();
	}
});