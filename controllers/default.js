exports.install = function (framework) {
    framework.route('/', index);
    framework.route('/usage/', framework_usage);
};

function index () {
    var self = this;
    self.layout('');
    self.view('index');
}

function framework_usage () {
    var self = this;
    self.plain(self.framework.usage(true));
}