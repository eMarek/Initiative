exports.install = function (framework) {
	framework.route('/books', books);
};

function books () {
	var self = this;
	// self.status = 402;
	self.json({ msg: "All you books belong to us!" });
	// self.json({ says: "okay", msg: "You still have session!" });
}