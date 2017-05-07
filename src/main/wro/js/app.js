const MENU_ITEMS = [{
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
var app = angular.module('Application', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngResource', 'ngMessages', 'ngAnimate', 'md.data.table', 'textAngular', 'ui-leaflet']);
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('search', 'default')
        .primaryPalette('pink')
});
app.config(['ngMdIconServiceProvider', function (ngMdIconServiceProvider) {
    ngMdIconServiceProvider
        .addShape('fish', '<path d="M98.5,47.5C96.5,45.5,81,35,62,35c-2.1,0-4.2,0.1-6.2,0.3L39,26c0,4.5,1.3,9,2.4,12.1C31.7,40.7,23.3,44,16,44L0,34 c0,8,4,16,4,16s-4,8-4,16l16-10c7.3,0,15.7,3.3,25.4,5.9C40.3,65,39,69.5,39,74l16.8-9.3c2,0.2,4.1,0.3,6.2,0.3 c19,0,34.5-10.5,36.5-12.5S100.5,49.5,98.5,47.5z M85.5,50c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5 C88,48.9,86.9,50,85.5,50z"/>')
        .addViewBox('fish', '0 26 100 48');
}]);
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
            $scope.user.name = response.data.userAuthentication.name;
            $scope.user.email = response.data.userAuthentication.details.email;
            $scope.user.picture = (response.data.userAuthentication.details.picture == null) ? response.data.userAuthentication.details.avatar_url :
                response.data.userAuthentication.details.picture;
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
        $scope.menu = [{
            link: MENU_ITEMS[0].link,
            title: MENU_ITEMS[0].title,
            icon: MENU_ITEMS[0].icon,
            index: MENU_ITEMS[0].index
        }];

        $scope.admin = [];
        for (var i = 1; i < MENU_ITEMS.length; i++) {
            $scope.admin.push({
                link: MENU_ITEMS[i].link,
                title: MENU_ITEMS[i].title,
                icon: MENU_ITEMS[i].icon,
                index: MENU_ITEMS[i].index
            });
        }
    }]);