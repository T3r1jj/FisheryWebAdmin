/**
 * Created by Damian Terlecki on 05.05.17.
 */
app.service('manageService', function () {
    var fishery = null;
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

    return {
        setOperation: setOperation,
        getOperation: getOperation,
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