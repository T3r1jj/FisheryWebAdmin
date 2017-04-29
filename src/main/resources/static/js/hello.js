angular.module('hello', ['ngMaterial'])
        .controller('home', function ($scope) {
            $scope.greeting = {id: 'xxx', content: 'Hello World!'}
        })