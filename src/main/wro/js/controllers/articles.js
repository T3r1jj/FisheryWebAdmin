/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.factory('$articleService', ['$resource', function ($resource) {
    'use strict';
    return {
        articlesRequests: $resource('/api/articlesRequests'),
        articles: $resource('/api/articles')
    };
}]);
app.controller('ArticlesController', ['$mdDialog', '$q', '$scope', '$timeout', '$articleService', '$mdToast',
    function ($mdDialog, $q, $scope, $timeout, $articleService, $mdToast) {
        'use strict';

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.$watch('data.selectedIndex', function (now, then, scope) {
            $scope.selected = [];
        });

        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            filter: '',
            order: {articles: "title", articlesRequests: '-time'},
            limit: 10,
            page: 1
        };

        $scope.removeFilter = function () {
            $scope.query.filter = '';
        };

        $scope.articlesRequests = [];
        $scope.articles = [];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadData = function () {
            if ($scope.data.selectedIndex === 0) {
                $scope.promise = $articleService.articles.query(articlesSuccess, failure).$promise;
            } else {
                $scope.promise = $articleService.articlesRequests.query(articlesRequestsSuccess, failure).$promise;
            }
        };

        function articlesRequestsSuccess(articlesRequests) {
            $scope.articlesRequests = articlesRequests;
            $scope.selected = [];
            for (var i = 0; i < articlesRequests.length; i++) {
                articlesRequests[i].estimatedTime = -Math.round((new Date().getTime() / 1000 - articlesRequests[i].estimatedTime) / 60);
                articlesRequests[i].tags = articlesRequests[i].tags.join(", ");
                articlesRequests[i].formattedTime = new Date(articlesRequests[i].time * 1000).toLocaleString();
            }
        }

        function articlesSuccess(articles) {
            $scope.articles = articles;
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

    }]);