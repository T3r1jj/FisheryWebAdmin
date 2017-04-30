angular.module('app', ['ngMaterial', 'ngMdIcons'])
    .controller("IndexController", function ($http, $location) {
        var self = this;
        $http.get("/user").then(function (response) {
            console.log(response);
            self.user = response.data.userAuthentication.name;
            self.authenticated = true;
        }, function (result) {
            self.user = "N/A";
            self.authenticated = false;
        });

        self.logout = function () {
            $http.post('/logout', {}).then(function () {
                self.authenticated = false;
                $location.path("/");
            }, function (data) {
                console.log("Logout failed");
                self.authenticated = false;
            });
        }
    });