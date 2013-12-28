framework.on('load', function() {

	// this partial content will be executed on every request to the controller
	this.partial(function(controller) {
		var self = this;

		// public paths
		var publicPaths = ['/', '/auth/login'];

		if (publicPaths.indexOf(self.uri.path) >= 0) {
			controller(); return;
		}

		// do i have cookie
		var encypted_cookie = self.req.cookie(self.config.cookie);
		if (!encypted_cookie) {
			self.json({
				status: 'error',
				text: self.resource('sl', 'authentication_required')
			}); return;
		}

		// decrypt cookie
		var cookie = self.decrypt(encypted_cookie);
		if (encypted_cookie.length < 200 || !cookie || utils.isEmpty(cookie)) {
			self.json({
				status: 'error',
				text: self.resource('sl', 'authentication_failed') + ' ' + self.resource('sl', 'cookie_is_corrupted')
			}); return;
		}

		// check cookie data
		if (!cookie._id || !cookie.username || !cookie.ip || !cookie.user_agent || !cookie.secret || !cookie.time_stamp) {
			self.json({
				status: 'error',
				text: self.resource('sl', 'authentication_failed') + ' ' + self.resource('sl', 'cookie_does_not_contain')
			}); return;
		}

		// check cookie adequacy
		if (cookie.ip != self.req.ip || cookie.user_agent != self.req.headers['user-agent'] || cookie.secret != self.config.secret) {
			self.json({
				status: 'error',
				text: self.resource('sl', 'authentication_failed') + ' ' + self.resource('sl', 'cookie_does_not_fit')
			}); return;
		}

		// reading cookie from cache
		var cache = self.cache.read(cookie._id + '_cookie');
		if (!cache || cache !== encypted_cookie) {
			self.json({
				status: 'logout',
				text: self.resource('sl', 're_authentication_required')
			}); return;
		}

		// extend cookie session
		self.cache.setExpire(cookie._id + '_cookie', new Date().add('minute', 3));

		// check user
		var db_users = self.database('users');

		db_users.view.one('users', 'by_username', cookie.username, function (err, doc) {

			if (err) {
				self.json({
					status: 'error',
					text: self.resource('sl', 'db_error') 
				}); return;
			}

			if (!doc) {
				self.json({
					status: 'error',
					text: self.resource('sl', 'user_not_exists') 
				}); return;
			}

			var user = doc.value;
			self.user = user;
			controller();
		});
	});
});