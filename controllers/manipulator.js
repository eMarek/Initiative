exports.install = function (framework) {
	framework.route('/manipulator/password/{pass}', password);
	framework.route('/manipulator/decrypt_cookie/{encrypted_cookie}', decrypt_cookie);
	framework.route('/manipulator/encrypt_cookie/', encrypt_cookie);
};

function password (pass) {
	var self = this;

	var encoded_password = pass.sha256(self.config.secret);

	self.plain(encoded_password);
}

function decrypt_cookie (encrypted_cookie) {

	var self = this;

	var decrypted_cookie = self.decrypt(encrypted_cookie);

	self.plain(JSON.stringify(decrypted_cookie));
}

function encrypt_cookie () {

	var self = this;

	var cookie = {
		_id: self.user._id,
		username: self.user.username,
		ip: self.req.ip,
		user_agent: self.req.headers['user-agent'],
		secret: self.config.secret,
		time_stamp: self.module('helper').time_stamp()
	};

	var encrypted_cookie = self.encrypt(cookie);

	self.plain(encrypted_cookie);
}