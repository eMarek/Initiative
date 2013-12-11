exports.install = function(framework) {
	framework.route('/manipulator/password/{pass}', password);
};

function password(pass) {
	var self = this;

	var encoded_password = pass.sha256(self.config.secret);

	this.plain(encoded_password);
}