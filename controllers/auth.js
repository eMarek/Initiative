exports.install = function (framework) {
	framework.route('/auth/login', auth_login, ['post', 'json']);
	framework.route('/auth/logout', auth_logout, ['get']);
	framework.route('/auth/cache_add', cache_add, ['post']);
	framework.route('/auth/cache_read', cache_read, ['post']);
};

function auth_login () {
	var self = this;

	var username = self.post.username;
	var password = self.post.password;

	// check username
	if (!username) {
		self.json({
			status: 'error',
			text: self.resource('sl', 'enter_username')
		}); return;
	}

	// check password
	if (!password) {
		self.json({
			status: 'error',
			text: self.resource('sl', 'enter_password') 
		}); return;
	}

	var db_users = self.database('users');

	db_users.view.one('users', 'by_username', username, function (err, doc) {

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

		if (password.sha256(self.config.secret) != doc.value.password) {
			self.json({
				status: 'error',
				text: self.resource('sl', 'wrong_password')
			}); return;
		}

		var user = doc.value;

		// cookie data
		var cookie = {
			_id: user._id,
			username: user.username,
			ip: self.req.ip,
			user_agent: self.req.headers['user-agent'],
			secret: self.config.secret,
			time_stamp: self.module('helper').time_stamp()
		};

		// encrypt cookie
		var encrypted_cookie = self.encrypt(cookie);

		// adding cookie in cache
		self.cache.add(user._id + '_cookie', encrypted_cookie, new Date().add('minute', 3));

		// save cookie
		// self.res.cookie(self.config.cookie, encrypted_cookie);

		self.json({
			status: 'okay',
			text: self.resource('sl', 'login_succeeded_hellow') + ' ' + user.first_name + '!',
			cookie: encrypted_cookie
		}); return;
	});
}

function auth_logout () {
	var self = this;

	// expire cookie
	// self.res.cookie(self.config.cookie, '', new Date().add('y', -1));

	self.json({
		status: 'okay',
		text: self.resource('sl', 'bye_bye') 
	}); return;
}

function cache_add () {
	var self = this;

	self.cache.add(self.user._id + '_testing', self.resource('sl', 'session_dafaq'));

	self.json({
		status: 'okay',
		text: self.resource('sl', 'cache_has_been_successfully_set')
	}); return;
}

function cache_read () {
	var self = this;

	var cache = self.cache.read(self.user._id + '_testing');

	self.json({
		status: 'okay',
		text: cache ? self.resource('sl', 'cache_has_been_successfully_read') : self.resource('sl', 'cache_not_set'), 
		cache: cache
	}); return;
}