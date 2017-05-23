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
 * Created by Damian Terlecki on 09.05.17.
 */
@RestController
@RequestMapping("/api/fisheries")
public class FisheryCrudRestController extends CrudRestController {

    private static final String FISHERY_RESOURCE = "/fishery";

    @Override
    public String findAll() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(crudRootUrl + FISHERY_RESOURCE + "/list", String.class);
    }

    @Override
    public String add(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(crudRootUrl + FISHERY_RESOURCE + "/create", entity, String.class);
    }

    @Override
    public String update(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(crudRootUrl + FISHERY_RESOURCE + "/update", HttpMethod.PUT, entity, String.class).getBody();
    }

    @Override
    public String delete(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(crudRootUrl + FISHERY_RESOURCE + "/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

}
