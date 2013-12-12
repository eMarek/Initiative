exports.install = function(framework) {
	framework.route('/auth/login', auth_login, ['json']);
	framework.route('/auth/logout', auth_logout);
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

		var auth = self.module('authorization');
		var user = doc.value;
		
		auth.login(self, user._id, user);

		self.json({
			status: 'okay',
			text: self.resource('sl', 'login_succeeded_hellow') + ' ' + user.first_name + '!'
		}); return;
	});
}

function auth_logout() {
	var self = this;

	var auth = self.module('authorization');
	var user = self.user;

	auth.logoff(self, user.id);

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