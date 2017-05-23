/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.controller('AddArticlesRequestController', ['$mdDialog', '$articleService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $articleService, $scope, $mdToast, manageService) {
        'use strict';

        var self = this;
        self.cancel = $mdDialog.cancel;
        self.tags = manageService.getTags();
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.numberChips = [];
        self.transformChip = transformChip;

        $scope.articlesRequest = {quick: true, tagsCount: 1, tags: []};

        function querySearch(query) {
            return query ? self.tags ? self.tags.filter(function (el) {
                return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }) : [] : [];
        }

        function transformChip(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return {name: chip, type: 'new'}
        }

        function success(articlesRequest) {
            $mdDialog.hide(articlesRequest);
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(5000)
            );
        }

        this.addItem = function () {
            $scope.form.$setSubmitted();

            if ($scope.form.$valid) {
                $articleService.addArticlesRequest.get($scope.articlesRequest, success, failure);
            }
        };
    }]);
app.controller('ManageArticleController', ['$mdDialog', '$articleService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $articleService, $scope, $mdToast, manageService) {
        'use strict';

        this.cancel = $mdDialog.cancel;

        $scope.operation = manageService.getOperation() + " article";
        $scope.operationConfirm = manageService.getOperation() + " item";
        $scope.articles = manageService.getArticles();
        $scope.selected = {};
        $scope.selected.article = ($scope.articles != null && $scope.articles.length !== 0 ? $scope.articles[0] : {});
        if ($scope.selected.article.image) {
            $scope.selected.article.imgUrl = $scope.selected.article.image;
            delete $scope.selected.article.image;
        }

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

        this.manageItem = function () {
            $scope.form.$setSubmitted();

            if ($scope.form.$valid) {
                if (manageService.getOperation() === "Update") {
                    $articleService.updateArticle.save($scope.selected.article, success, failure);
                } else {
                    var article = $scope.selected.article;
                    delete article.$$mdSelectId;
                    delete article.id;
                    delete article.empty;
                    $articleService.addArticle.save(article, success, failure);
                }
            }
        };
    }]);
app.controller('ArticlesController', ['$mdDialog', '$q', '$scope', '$timeout', '$articleService', '$mdToast', 'manageService',
    function ($mdDialog, $q, $scope, $timeout, $articleService, $mdToast, manageService) {
        'use strict';

        $scope.data = {selectedIndex: 0};
        $scope.tooltipAutohide = false;
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.$watch('data.selectedIndex', function (now, then, scope) {
            $scope.selected = [];
            if ($scope.data.selectedIndex === 1 && manageService.getTags() == null) {
                manageService.setTags([]);
                $articleService.getTags.query(tagsSuccessFetch, failure);
            }
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
                $scope.crudPromise = $articleService.articles.query(articlesSuccess, failure).$promise;
            } else {
                $scope.knowledgeBasePromise = $articleService.articlesRequests.query(articlesRequestsSuccess, failure).$promise;
            }
        };

        $scope.openRequest = function (id) {
            $scope.knowledgeBasePromise = $articleService.scrapedArticles.query({id: id}, scrapedArticlesSuccess, failure).$promise;
        };

        $scope.addItem = function (event) {
            if ($scope.data.selectedIndex === 0) {
                manageService.setOperation("Add");
                manageService.setArticles([{}]);
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'ManageArticleController',
                    controllerAs: 'ctrl',
                    targetEvent: event,
                    templateUrl: 'templates/dialogs/manage-article-dialog.html'
                }).then($scope.loadData);
            } else {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'AddArticlesRequestController',
                    controllerAs: 'ctrl',
                    targetEvent: event,
                    templateUrl: 'templates/dialogs/add-article-request-dialog.html'
                }).then($scope.loadData);
            }
        };
        $scope.updateItem = function (event) {
            if ($scope.data.selectedIndex === 0) {
                manageService.setOperation("Update");
                manageService.setArticles([JSON.parse(JSON.stringify($scope.selected[0]))]);
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'ManageArticleController',
                    controllerAs: 'ctrl',
                    targetEvent: event,
                    templateUrl: 'templates/dialogs/manage-article-dialog.html'
                }).then($scope.loadData);
            }
        };
        $scope.deleteItem = function (event) {
            var confirm = $mdDialog.confirm()
                .title('Deletion confirmation')
                .textContent('Are you sure you want to delete selected article?')
                .ariaLabel('Deletion confirmation')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                $articleService.deleteArticle.get({id: $scope.selected[0].id}, loadManagedData, failure);
            });
        };

        function scrapedArticlesSuccess(scrapedArticles) {
            manageService.setOperation("Add managed");
            manageService.setArticles(scrapedArticles);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ManageArticleController',
                controllerAs: 'ctrl',
                templateUrl: 'templates/dialogs/manage-article-dialog.html'
            }).then(loadManagedData);
        }

        function loadManagedData() {
            $scope.crudPromise = $articleService.articles.query(articlesSuccess, failure).$promise;
        }

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

        function tagsSuccessFetch(tags) {
            manageService.setTags(tags);
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(3000)
            );
        }

        loadManagedData();
        $scope.knowledgeBasePromise = $articleService.articlesRequests.query(articlesRequestsSuccess, failure).$promise;
    }]);