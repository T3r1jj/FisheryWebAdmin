angular.module('app', ['ngMaterial', 'ngMdIcons'])
    .controller('IndexController', function ($http, $location, $timeout, $window) {
        function redirectWithDelay() {
            $timeout(function () {
                if (self.authenticated) {
                    if (self.redirectSec === 1) {
                        $window.location.href = '/dashboard';
                    } else {
                        --self.redirectSec;
                        redirectWithDelay();
                    }
                }
            }, 1000);
        }

        var self = this;
        $http.get('/user').then(function (response) {
            self.user = response.data.userAuthentication.name;
            self.authenticated = true;
            self.redirectSec = 3;
            redirectWithDelay();
        }, function (result) {
            self.user = 'N/A';
            self.authenticated = false;
        });

        self.logout = function () {
            $http.post('/logout', {}).then(function () {
                self.authenticated = false;
                $location.path('/');
            }, function (data) {
                console.log('Logout failed');
                self.authenticated = false;
            });
        }
    });