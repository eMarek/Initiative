exports.install = function(framework) {
	framework.route('/manipulator/password/{pass}', password);
	framework.route('/manipulator/cookie/{encrypted_cookie}', cookie);
};

function password(pass) {
	var self = this;

	var encoded_password = pass.sha256(self.config.secret);

	self.plain(encoded_password);
}

function cookie(encrypted_cookie) {

	var self = this;

	/*
	var time_stamp = self.module('helper').time_stamp();

	var cookie = {
		username: 'testis',
		user_agent: self.req.headers['user-agent'],
		secret: self.config.secret,
		time_stamp: time_stamp
	};

	var encrypted_cookie = self.encrypt(cookie);
	console.log(encrypted_cookie);
	*/


	var decrypted_cookie = self.decrypt(encrypted_cookie);

	self.plain(JSON.stringify(decrypted_cookie));
}