package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Damian Terlecki on 09.05.17.
 */
@RestController
@RequestMapping("/api/fisheries")
public class FisheryCrudRestController implements CrudRestApi {

    private static final String FISH_BASE_URL = "https://druzyna-a-crud.herokuapp.com/fishery";

    @Override
    public String getAll() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(FISH_BASE_URL + "/list", String.class);
    }

    @Override
    public String add(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(FISH_BASE_URL + "/create", entity, String.class);
    }

    @Override
    public String update(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(FISH_BASE_URL + "/update", HttpMethod.PUT, entity, String.class).getBody();
    }

    @Override
    public String delete(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(FISH_BASE_URL + "/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

}
