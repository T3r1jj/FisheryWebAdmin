/**
 * Created by Damian Terlecki on 05.05.17.
 */
app.service('manageService', function () {
    var fishery = null;
    var fish = null;
    var operation = null;
    var articles = null;
    var article = null;
    var tags = null;

    var setOperation = function (manageOperation) {
        operation = manageOperation;
    };

    var getOperation = function () {
        return operation;
    };

    var setFishery = function (managedFishery) {
        fishery = managedFishery;
    };

    var getFishery = function () {
        return fishery;
    };

    var setArticles = function (scrapedArticles) {
        articles = scrapedArticles;
    };

    var getArticles = function () {
        return articles;
    };

    var setArticle = function (managedArticle) {
        article = managedArticle;
    };

    var getArticle = function () {
        return article;
    };

    var setTags = function (fetchedTags) {
        tags = fetchedTags;
    };

    var getTags = function () {
        return tags;
    };

    var getFish = function () {
        return fish;
    };

    var setFish = function (managedFish) {
        fish = managedFish;
    };

    return {
        setOperation: setOperation,
        getOperation: getOperation,
        setFish: setFish,
        getFish: getFish,
        setFishery: setFishery,
        getFishery: getFishery,
        setArticles: setArticles,
        getArticles: getArticles,
        setArticle: setArticle,
        getArticle: getArticle,
        setTags: setTags,
        getTags: getTags
    };
});
app.factory('$articleService', ['$resource', function ($resource) {
    'use strict';
    return {
        articlesRequests: $resource('/api/articlesRequests'),
        scrapedArticles: $resource('/api/scrapedArticles'),
        articles: $resource('/api/articles'),
        addArticle: $resource('/api/articles/add'),
        updateArticle: $resource('/api/articles/update'),
        deleteArticle: $resource('/api/articles/delete'),
        addArticlesRequest: $resource('/api/articlesRequests/add'),
        getTags: $resource('https://fishery-knowledge-base.herokuapp.com/article/tags/All')
    };
}]);


app.factory('$fishService', ['$resource', function ($resource) {
    'use strict';
    return {
        fishes: $resource('/api/fishes'),
        fish: $resource('https://fishery-knowledge-base.herokuapp.com/fish/:name', {id: "@name"}),
        fishNames: $resource('https://fishery-knowledge-base.herokuapp.com/fish'),
        fishProtection: $resource('https://fishery-knowledge-base.herokuapp.com/fish/protection'),
        fishImages: $resource('https://fishery-knowledge-base.herokuapp.com/fish/images'),
        addFish: $resource('/api/fishes/add'),
        updateFish: $resource('/api/fishes/update'),
        deleteFish: $resource('/api/fishes/delete')
    };
}]);

app.factory('$fisheryService', ['$resource', function ($resource) {
    'use strict';
    return {
        fisheries: $resource('https://fishery-knowledge-base.herokuapp.com/fishery'),
        managedFisheries: $resource('https://druzyna-a-crud.herokuapp.com/fishery/list'),
        addRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/create'),
        deleteRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/:id', {id: "@id"}),
        updateRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/update', {}, {
            put: {method: 'PUT'}
        })
    };
}]);

app.factory('$statusService', ['$resource', function ($resource) {
    'use strict';
    return {
        crud: $resource('/api/status/crud'),
        knowledgeBase: $resource('/api/status/knowledge_base'),
        client: $resource('/api/status/client'),
        user: $resource('/api/status/user')
    };
}]);

app.factory('$userService', ['$resource', function ($resource) {
    'use strict';
    return {
        adminsCount: $resource('/api/admins/count')
    };
}]);