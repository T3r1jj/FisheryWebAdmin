package io.gitlab.druzyna_a.knowledgebase.model.offered;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

/**
 * @author Damian Terlecki
 */
public class ArticlesRequest {

    private String id;
    private Long time;
    private Long estimatedTime;
    private boolean scraped;
    private List<String> tags;
    private int requiredTagsCount;
    private List<Article> articles;
    private boolean quick;

    public ArticlesRequest() {
    }

    public ArticlesRequest(List<String> tags, int requiredTagsCount) {
        this.tags = tags;
        this.requiredTagsCount = requiredTagsCount;
    }

    public Long getTime() {
        return time;
    }

    private void setTime(Long time) {
        this.time = time;
    }

    public Long getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Long estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public boolean isScraped() {
        return scraped;
    }

    public void setScraped(boolean scraped) {
        this.scraped = scraped;
    }

    public String getId() {
        return id;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getRequiredTagsCount() {
        return requiredTagsCount;
    }

    public void setRequiredTagsCount(int requiredTagsCount) {
        this.requiredTagsCount = requiredTagsCount;
    }

    @JsonIgnore
    public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }

    public boolean isQuick() {
        return quick;
    }

    public void setQuick(boolean quick) {
        this.quick = quick;
    }

    public static class Article {

        private String title;
        private String description;
        private String author;
        private String image;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void appendDescription(String description) {
            this.description = description;
        }

        public boolean isEmpty() {
            return description == null || description.isEmpty();
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

    }

}
