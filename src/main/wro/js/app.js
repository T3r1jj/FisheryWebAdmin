const MENU_ITEMS = [
    {
        link: '/about',
        title: 'About',
        icon: 'info',
        templateUrl: 'templates/pages/about.html',
        controller: 'AboutController',
        index: -2
    },
    {
        link: '/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        templateUrl: 'templates/pages/dashboard.html',
        controller: 'DashboardController',
        index: -1
    }, {
        link: '/articles',
        title: 'Articles',
        icon: 'description',
        templateUrl: 'templates/pages/articles.html',
        controller: 'ArticlesController',
        index: 0
    }, {
        link: '/fishes',
        title: 'Fishes',
        icon: 'fish',
        templateUrl: 'templates/pages/fishes.html',
        controller: 'FishesController',
        index: 1
    }, {
        link: '/fisheries',
        title: 'Fisheries',
        icon: 'place',
        templateUrl: 'templates/pages/fisheries.html',
        controller: 'FisheriesController',
        index: 2
    }];
var app = angular.module('Application', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngResource', 'ngMessages', 'ngAnimate', 'md.data.table', 'textAngular', 'ui-leaflet', 'angular-joyride']);
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('search', 'default')
        .primaryPalette('pink')
});
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    for (var i = 0; i < MENU_ITEMS.length; i++) {
        $routeProvider.when(MENU_ITEMS[i].link, {
            title: MENU_ITEMS[i].title,
            index: MENU_ITEMS[i].index,
            templateUrl: MENU_ITEMS[i].templateUrl,
            controller: MENU_ITEMS[i].controller
        });
    }
    $locationProvider.html5Mode(true);
}]);
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('input', 'default')
        .dark()
        .primaryPalette('pink')
});
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        $rootScope.selectedIndex = current.$$route.index;
    });
}]);
app.controller('ApplicationController', ['$scope', '$mdSidenav', '$http', '$location', '$window',
    function ($scope, $mdSidenav, $http, $location, $window) {
        $scope.user = {};
        $scope.user.picture = "assets/fish.png";
        $http.get("/user").then(function (response) {
            $scope.user.name = response.data.user.name;
            $scope.user.email = response.data.user.email;
            $scope.user.picture = response.data.user.picture;
        }, function (result) {
            $scope.user.name = "N/A";
            $scope.user.email = "N/A";
        });

        $scope.go = function (item) {
            $location.path(item.link);
            $scope.selectedIndex = item.index;
        };

        $scope.logout = function () {
            $http.post('/logout', {}).then(function () {
                self.authenticated = false;
                $window.location.href = "/";
            }, function (data) {
                console.log("Logout failed");
                self.authenticated = false;
            });
        };

        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.openSidenav = function (menuId) {
            $mdSidenav(menuId || 'left').open();
        };
        $scope.closeSidenav = function (menuId) {
            $mdSidenav(menuId || 'left').close();
        };
        $scope.menu = [{
            link: MENU_ITEMS[1].link,
            title: MENU_ITEMS[1].title,
            icon: MENU_ITEMS[1].icon,
            index: MENU_ITEMS[1].index
        }];
        $scope.admin = [];
        $scope.about = MENU_ITEMS[0];
        for (var i = 2; i < MENU_ITEMS.length; i++) {
            $scope.admin.push({
                link: MENU_ITEMS[i].link,
                title: MENU_ITEMS[i].title,
                icon: MENU_ITEMS[i].icon,
                index: MENU_ITEMS[i].index
            });
        }
    }]);