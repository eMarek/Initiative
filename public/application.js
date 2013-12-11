var app = angular.module('app', ['ngRoute']);

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

/*
app.config(function ($httpProvider) {

	var logsOutUserOn401 = function ($location, $q, sessionFactory, flashFactory) {
		var success = function (response) {
			return response;
		};
		var error = function (response) {

			if (response.status === 401) {
				sessionFactory.unset('authenticated');
				flashFactory.show(response.msg);
				$location.path('/login');
				return $q.reject(response);
			}
			else {
				return $q.reject(response);
			}
		};

		return function (promise) {
			return promise.then(success, error);
		}
	};
});
*/

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

app.factory('authenticationFactory', function ($http, $location, sessionFactory, flashFactory) {

	return {
		login: function (credentials) {
			var login = $http.post('/auth/login', credentials);

			login.success(function (server) {
				sessionFactory.set('authenticated', true);
				flashFactory.clear();
				$location.path('/edit');
			});

			login.error(function (server) {
				flashFactory.show(server.msg);
			});
		},

		logout: function () {
			var logout = $http.get('/auth/logout');
			sessionFactory.unset('authenticated');
			$location.path('/logout');
		},

		isLoggedIn: function () {
			return sessionFactory.get('authenticated');
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
		unset: function (key) {
			return sessionStorage.removeItem(key);
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