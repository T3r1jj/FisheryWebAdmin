package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

import io.gitlab.druzyna_a.fisherywebadmin.Application;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Created by Damian Terlecki on 04.05.17.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@ContextConfiguration(classes = Application.class)
public class CrudRestControllerTest {
    @Autowired
    private ArticleCrudRestController articleController;
    @Autowired
    private FishCrudRestController fishController;
    @Autowired
    private FisheryCrudRestController fisheryController;

    @Test
    public void getAllArticles() {
        String articles = articleController.findAll();
        Assert.assertTrue(articles.contains("["));
        Assert.assertTrue(articles.contains("]"));
    }

    @Test
    public void getAllFishes() {
        String fishes = fishController.findAll();
        Assert.assertTrue(fishes.contains("["));
        Assert.assertTrue(fishes.contains("]"));
    }

    @Test
    public void getAllFisheries() {
        String fisheries = fisheryController.findAll();
        Assert.assertTrue(fisheries.contains("["));
        Assert.assertTrue(fisheries.contains("]"));
    }

}
