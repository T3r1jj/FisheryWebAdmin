package io.gitlab.druzyna_a.fisherywebadmin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

/**
 * Created by Damian Terlecki on 04.05.17.
 */
@RestController
public class CrudRestController {

    @RequestMapping(value = "/api/articles", method = RequestMethod.GET)
    public @ResponseBody
    String getArticles() {
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForObject("https://druzyna-a-crud.herokuapp.com/article/list", String.class);
        } catch (HttpStatusCodeException exception) {
            return String.valueOf(exception.getStatusCode().value());
        }
    }

}
