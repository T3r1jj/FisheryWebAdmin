/**
 * Created by Damian Terlecki on 05.05.17.
 */
app.FISHERY_KNOWLEDGE_BASE_URL = 'https://fishery-knowledge-base.herokuapp.com';
app.service('manageService', function () {
    var fishery = null;
    var fish = null;
    var operation = null;
    var articles = null;
    var article = null;
    var tags = null;
    var users = null;

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

    var setUsers = function (usersWithEmail) {
        users = usersWithEmail;
    };

    var getUsers = function () {
        return users;
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
        getTags: getTags,
        setUsers: setUsers,
        getUsers: getUsers
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
        getTags: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/article/tags/All')
    };
}]);


app.factory('$fishService', ['$resource', function ($resource) {
    'use strict';
    return {
        fishes: $resource('/api/fishes'),
        fish: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/fish/:name', {id: "@name"}),
        fishNames: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/fish'),
        fishProtection: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/fish/protection'),
        fishImages: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/fish/images'),
        addFish: $resource('/api/fishes/add'),
        updateFish: $resource('/api/fishes/update'),
        deleteFish: $resource('/api/fishes/delete')
    };
}]);

app.factory('$fisheryService', ['$resource', function ($resource) {
    'use strict';
    return {
        scrapedFisheries: $resource(app.FISHERY_KNOWLEDGE_BASE_URL + '/fishery'),
        fisheries: $resource('/api/fisheries'),
        addFishery: $resource('/api/fisheries/add'),
        deleteFishery: $resource('/api/fisheries/delete'),
        updateFishery: $resource('/api/fisheries/update')
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
        adminsCount: $resource('/api/admins/count'),
        usersCount: $resource('/api/users/count'),
        users: $resource('/api/users'),
        sendEmail: $resource('/api/emails/add'),
        reservations: $resource('/api/reservations'),
        cancelReservation: $resource('/api/reservations/delete')
    };
}]);

app.config(function ($provide) {
    $provide.decorator('taTools', ['$delegate', function (taTools) {
        delete taTools.quote.iconclass;
        taTools.quote.display = '<button><md-icon ng-md-icon icon="format_quote"></md-icon></button>';
        delete taTools.bold.iconclass;
        taTools.bold.display = '<button><md-icon ng-md-icon icon="format_bold"></md-icon></button>';
        delete taTools.italics.iconclass;
        taTools.italics.display = '<button><md-icon ng-md-icon icon="format_italic"></md-icon></button>';
        delete taTools.justifyLeft.iconclass;
        taTools.justifyLeft.display = '<button><md-icon ng-md-icon icon="format_align_left"></md-icon></button>';
        delete taTools.justifyCenter.iconclass;
        taTools.justifyCenter.display = '<button><md-icon ng-md-icon icon="format_align_center"></md-icon></button>';
        delete taTools.justifyFull.iconclass;
        taTools.justifyFull.display = '<button><md-icon ng-md-icon icon="format_align_justify"></md-icon></button>';
        delete taTools.insertLink.iconclass;
        taTools.insertLink.display = '<button><md-icon ng-md-icon icon="insert_link"></md-icon></button>';
        delete taTools.insertVideo.iconclass;
        taTools.insertVideo.display = '<button><md-icon ng-md-icon icon="video_library"></md-icon></button>';
        delete taTools.insertImage.iconclass;
        taTools.insertImage.display = '<button><md-icon ng-md-icon icon="insert_photo"></md-icon></button>';
        delete taTools.html.iconclass;
        taTools.html.display = '<button><md-icon ng-md-icon icon="code"></md-icon></button>';
        return taTools;
    }]);
});