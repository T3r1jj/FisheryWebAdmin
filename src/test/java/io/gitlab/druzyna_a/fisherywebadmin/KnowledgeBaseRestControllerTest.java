package io.gitlab.druzyna_a.fisherywebadmin;

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
public class KnowledgeBaseRestControllerTest {
    @Autowired
    private KnowledgeBaseRestController restController;

    @Test
    public void getAllArticles() throws Exception {
        String articlesRequests = restController.getArticlesRequests();
        Assert.assertTrue(articlesRequests.contains("["));
        Assert.assertTrue(articlesRequests.contains("]"));
    }

}
