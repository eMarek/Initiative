framework.onAuthorization = function (req, res, flags, callback) {

	var self = this;

	// do i have cookie
	var encypted_cookie = req.cookie(self.config.cookie);
	if (encypted_cookie === null || encypted_cookie.length < 200) {
		callback(false);
		return;
	}

	// decrypt cookie
	var cookie = self.decrypt(encypted_cookie);

	if (cookie === null || cookie === '' || cookie.ip !== req.ip || cookie.user_agent !== req.headers['user-agent'] || cookie.secret !== self.config.secret) {
		callback(false);
		return;
	}

	// check user
	var db_users = self.database('users');

	db_users.view.one('users', 'by_username', cookie.username, function (err, doc) {

		if (err) {
			callback(false);
			return;
		}

		if (!doc) {
			callback(false);
			return;
		}

		var user = doc.value;
		req.user = user;
		callback(true);
	});
};