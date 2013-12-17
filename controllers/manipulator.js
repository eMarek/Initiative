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

	/*
	var d = new Date();

	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();

	var time_stamp = [ year, month, date ].join('-') + ' ' + [ hours, minutes, seconds ].join(':');

	var cookie = {
		username: 'testis',
		user_agent: self.req.headers['user-agent'],
		secret: self.config.secret,
		time_stamp: time_stamp
	};

	var encrypted_cookie = self.encrypt(cookie);
	*/

	var self = this;

	var decrypted_cookie = self.decrypt(encrypted_cookie);

	self.plain(JSON.stringify(decrypted_cookie));
}