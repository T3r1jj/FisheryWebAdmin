package io.gitlab.druzyna_a.fisherywebadmin;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Damian Terlecki on 04.05.17.
 */
@RestController
public class CrudRestController {

    private static final String ARTICLES_BASE_URL = "https://druzyna-a-crud.herokuapp.com/article";

    @RequestMapping(value = "/api/articles", method = RequestMethod.GET)
    public @ResponseBody
    String getArticles() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(ARTICLES_BASE_URL + "/list", String.class);
    }

    @RequestMapping(value = "/api/articles/add", method = RequestMethod.POST)
    public @ResponseBody
    String addArticle(@RequestBody String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(data, headers);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(ARTICLES_BASE_URL + "/create", entity, String.class);
    }

    @RequestMapping(value = "/api/articles/update", method = RequestMethod.POST)
    public @ResponseBody
    String updateArticle(@RequestBody String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(data, headers);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(ARTICLES_BASE_URL + "/update", HttpMethod.PUT, entity, String.class).getBody();
    }

    @RequestMapping(value = "/api/articles/delete", method = RequestMethod.GET)
    public @ResponseBody
    String deleteArticle(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(ARTICLES_BASE_URL + "/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

}
