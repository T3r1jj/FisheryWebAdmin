package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

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
public class FishCrudRestController {

    private static final String ARTICLES_BASE_URL = "https://druzyna-a-crud.herokuapp.com/fish";
    private static final String MAPPING_BASE_URL = "/api/fishes";

    @RequestMapping(value = MAPPING_BASE_URL, method = RequestMethod.GET)
    public @ResponseBody
    String getFishes() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(ARTICLES_BASE_URL + "/list", String.class);
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/add", method = RequestMethod.POST)
    public @ResponseBody
    String addFish(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(ARTICLES_BASE_URL + "/create", entity, String.class);
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/update", method = RequestMethod.POST)
    public @ResponseBody
    String updateFish(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(ARTICLES_BASE_URL + "/update", HttpMethod.PUT, entity, String.class).getBody();
    }

    private HttpEntity<String> prepareJsonEntity(@RequestBody String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(data, headers);
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/delete", method = RequestMethod.GET)
    public @ResponseBody
    String deleteFish(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(ARTICLES_BASE_URL + "/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

}
