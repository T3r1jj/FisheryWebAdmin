/**
 * Created by Damian Terlecki on 17.05.17.
 */
app.controller('CreateEmailController', ['$mdDialog', '$userService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $userService, $scope, $mdToast, manageService) {
        'use strict';

        this.cancel = $mdDialog.cancel;

        $scope.email = {};
        $scope.email.title = (manageService.getOperation() === 'Cancel' ? 'Reservation cancel' : '');
        $scope.users = manageService.getUsers();

        function success(article) {
            $mdDialog.hide(article);
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(5000)
            );
        }

        this.sendEmail = function () {
            $scope.form.$setSubmitted();

            if ($scope.form.$valid) {
                for (var i = 0; i < $scope.users.length; i++) {
                    $userService.sendEmail.save({
                        email: $scope.users[i].email,
                        title: $scope.email.title,
                        body: $scope.email.body
                    }, success, failure);
                }
            }
        };
    }]);
app.controller('UsersController', ['$mdDialog', '$q', '$scope', '$timeout', '$userService', '$mdToast', 'manageService',
    function ($mdDialog, $q, $scope, $timeout, $userService, $mdToast, manageService) {
        'use strict';

        $scope.data = {selectedIndex: 0};
        $scope.tooltipAutohide = false;
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.options = {
            rowSelection: false,
            multiSelect: true,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            filter: '',
            order: 'name',
            limit: 10,
            page: 1
        };

        $scope.removeFilter = function () {
            $scope.query.filter = '';
        };

        $scope.users = [];
        $scope.reservations = [];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadData = function () {
            if ($scope.data.selectedIndex === 0) {
                $scope.usersPromise = $userService.users.query(usersRequestSuccess, failure).$promise;
            } else {
                $scope.reservationsPromise = $userService.reservations.query(reservationsRequestSuccess, failure).$promise;
            }
        };

        $scope.addItem = function (event) {
            manageService.setUsers($scope.selected);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'CreateEmailController',
                controllerAs: 'ctrl',
                targetEvent: event,
                templateUrl: 'templates/dialogs/create-email-dialog.html'
            });
        };
        $scope.deleteItem = function (event) {
            var confirm = $mdDialog.confirm()
                .title('Cancel confirmation')
                .textContent('Are you sure you want to cancel reservation?')
                .ariaLabel('Cancel confirmation')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                for (var i = 0; i < $scope.selected.length; i++) {
                    $articleService.cancelReservation.get({id: $scope.selected[i].id}, $scope.loadData, failure);
                }
            });
        };

        function loadAllData() {
            $scope.usersPromise = $userService.users.query(usersRequestSuccess, failure).$promise;
            $scope.reservationsPromise = $userService.reservations.query(reservationsRequestSuccess, failure).$promise;
        }

        function reservationsRequestSuccess(reservations) {
            $scope.reservations = reservations;
        }

        function usersRequestSuccess(users) {
            $scope.users = users;
            $scope.selected = [];
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(3000)
            );
        }

        loadAllData();
    }]);