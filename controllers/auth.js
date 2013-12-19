exports.install = function(framework) {
	framework.route('/auth/login', auth_login, ['post', 'json']);
	framework.route('/auth/logout', auth_logout, ['get']);
	framework.route('/auth/expiry', auth_expiry);
};

function auth_login() {
	var self = this;

	var username = self.post.username;
	var password = self.post.password;

	if (!username) {
		self.json({
			status: 'error',
			text: self.resource('sl', 'enter_username')
		}); return;
	}

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

		var cookie = {
			username: user.username,
			ip: self.req.ip,
			user_agent: self.req.headers['user-agent'],
			secret: self.config.secret,
			time_stamp: self.module('helper').time_stamp()
		};

		var encrypted_cookie = self.encrypt(cookie);

		// save cookie
		self.res.cookie(self.config.cookie, encrypted_cookie, new Date().add('m', 3));

		self.json({
			status: 'okay',
			text: self.resource('sl', 'login_succeeded_hellow') + ' ' + user.first_name + '!'
		}); return;
	});
}

function auth_logout() {
	var self = this;

	// expire cookie
	self.res.cookie(self.config.cookie, '', new Date().add('y', -1));

	self.json({
		status: 'okay',
		text: 'Bye bye!'
	}); return;
}

function auth_expiry() {
	var self = this;

	self.json({
		status: 'error',
		text: self.resource('sl', 'expired_session')
	}); return;
}