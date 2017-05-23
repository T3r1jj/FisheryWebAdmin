package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Damian Terlecki on 04.05.17.
 */
@RestController
@RequestMapping("/api/fishes")
public class FishCrudRestController extends CrudRestController {

    private static final String FISH_RESOURCE = "/fish";

    @Override
    public String findAll() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(crudRootUrl + FISH_RESOURCE + "/list", String.class);
    }

    @Override
    public String add(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(crudRootUrl + FISH_RESOURCE + "/create", entity, String.class);
    }

    @Override
    public String update(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(crudRootUrl + FISH_RESOURCE + "/update", HttpMethod.PUT, entity, String.class).getBody();
    }

    @Override
    public String delete(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(crudRootUrl + FISH_RESOURCE + "/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

}
