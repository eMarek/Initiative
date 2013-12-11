exports.install = function(framework) {
	framework.route('/manipulator/password/{pass}', password);
};

function password(pass) {
	var self = this;

	var encoded_password = self.framework.encode(pass);
	this.plain(encoded_password);
}