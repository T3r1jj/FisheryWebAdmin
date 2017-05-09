angular.module('app', ['ngMaterial', 'ngMdIcons'])
    .config(['ngMdIconServiceProvider', function (ngMdIconServiceProvider) {
        ngMdIconServiceProvider
            .addShape('gitlab', '<path id="tanuki-right-ear" class="tanuki-shape" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"/><path id="tanuki-left-ear" class="tanuki-shape" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"/><path id="tanuki-nose" class="tanuki-shape" fill="#e24329" d="M18,34.38 3,14 33,14 Z"/><path id="tanuki-right-eye" class="tanuki-shape" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"/><path id="tanuki-left-eye" class="tanuki-shape" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"/><path id="tanuki-right-cheek" class="tanuki-shape" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"/><path id="tanuki-left-cheek" class="tanuki-shape" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"/>')
            .addViewBox('gitlab', '0 0 36 36');
    }])
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
            function wakeUpServices() {
                $http.get('/api/status/crud');
                $http.get('/api/status/knowledge_base');
                $http.get('/api/status/client');
                $http.get('/api/status/user');
            }

            self.user = response.data.user.name;
            self.authenticated = true;
            self.redirectSec = 5;
            wakeUpServices();
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