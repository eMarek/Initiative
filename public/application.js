var app = angular.module('app', ['ngRoute', 'ngCookies']);

app.config(function ($routeProvider) {

	$routeProvider.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'loginController'
	});

	$routeProvider.when('/edit', {
		templateUrl: 'templates/edit.html',
		controller: 'simpleController'
	});

	$routeProvider.when('/search', {
		templateUrl: 'templates/search.html',
		controller: 'simpleController'
	});

	$routeProvider.when('/books', {
		templateUrl: 'templates/books.html',
		controller: 'booksController',
		resolve: {
			books: function (bookFactory) {
				return bookFactory.get();
			}
		}
	});

	$routeProvider.otherwise({ redirectTo: '/login' } );
});

app.run(function ($rootScope, $location, authenticationFactory, flashFactory) {

	$rootScope.$on('$routeChangeStart', function (event, next, current) {

		if ($location.path() != '/login' && !authenticationFactory.isLoggedIn()) {

			$location.path('/login');
			flashFactory.show('Za nadaljevanje se moraš prijaviti!');
		}
	});

});

app.controller('loginController', function ($scope, $location, authenticationFactory) {

	$scope.credentials = {
		username: '',
		password: ''
	};

	$scope.login = function () {
		authenticationFactory.login($scope.credentials);
	}
});

app.controller('simpleController', function ($scope, $location, simpleFactory, authenticationFactory) {

	$scope.users = simpleFactory.getUsers();

	$scope.addUser = function () {

		if (!$scope.newUser) {
			return;
		}
		
		var user = {
			name: $scope.newUser.name,
			city: $scope.newUser.city
		};

		simpleFactory.addUser(user);

		$scope.newUser.name = '';
		$scope.newUser.city = '';
	};

	$scope.logout = function () {
		authenticationFactory.logout()
	}
});

app.controller('booksController', function ($scope) {
});

app.factory('authenticationFactory', function ($http, $location, $cookies, flashFactory) {

	return {
		login: function (credentials) {
			flashFactory.clear();

			var login = $http.post('/auth/login', credentials);

			login.success(function (server) {

				if (server.status == 'okay') {
					flashFactory.clear();
					$cookies.__user = server.cookie;
					$location.path('/edit');
					return;
				}

				if (server.status == 'error') {
					flashFactory.show(server.text);
					return;
				}
			});
		},

		logout: function () {
			var logout = $http.get('/auth/logout');
			delete $cookies.__user
			$location.path('/login');
		},

		isLoggedIn: function () {
			return $cookies.__user;
		}
	};
});

app.factory('sessionFactory', function () {
	return {
		get: function (key) {
			return sessionStorage.getItem(key);
		},
		set: function (key, val) {
			return sessionStorage.setItem(key, val);
		},
		remove: function (key) {
			return sessionStorage.removeItem(key);
		}
	};
});

app.factory('localFactory', function () {
	return {
		get: function (key) {
			return localStorage.getItem(key);
		},
		set: function (key, val) {
			return localStorage.setItem(key, val);
		},
		remove: function (key) {
			return localStorage.removeItem(key);
		}
	};
});

app.factory('simpleFactory', function () {

	var users = [
		{ name: 'Marko', city: 'Mokronog' },
		{ name: 'Tina', city: 'Cerovec' },
		{ name: 'Gašper', city: 'Radovljica' },
		{ name: 'Kaja', city: 'Bled' }
	];

	var factory = {};

	factory.getUsers = function () {
		return users;
	}

	factory.addUser = function (user) {
		users.push(user);
	}

	return factory;
});

app.factory('flashFactory', function ($rootScope) {
	return {
		show: function (message) {
			$rootScope.flash = message;
		},

		clear: function () {
			$rootScope.flash = '';
		}
	};
});

app.factory('bookFactory', function ($rootScope) {
	return {
		get: function (message) {
			return [{
				name: 'Mož, ki je računal',
				author: 'Malka Tahan'
			}];
		}
	};
});