package io.gitlab.druzyna_a.fisherywebadmin.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * Created by Damian Terlecki on 06.05.17.
 */
@RestController
public class StatusRestController {

    private static final String MAPPING_BASE_URL = "/api/status";

    @Value("${build.version}")
    private String buildVersion;

    @RequestMapping(value = MAPPING_BASE_URL + "/crud", method = RequestMethod.GET)
    public @ResponseBody
    String isCrudUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject("https://druzyna-a-crud.herokuapp.com/swagger-ui.html", String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/client", method = RequestMethod.GET)
    public @ResponseBody
    String isClientUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject("http://andrzej1993-001-site1.itempurl.com/swagger/ui/index", String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/knowledge_base", method = RequestMethod.GET)
    public @ResponseBody
    String isKnowledgeBaseUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject("https://fishery-knowledge-base.herokuapp.com", String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/user", method = RequestMethod.GET)
    public @ResponseBody
    String isUserUp() {
        return "{\"status\": \"down\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL, method = RequestMethod.GET)
    public @ResponseBody
    String getVersion() {
        return "{\"version\": \"" + buildVersion + "\"}";
    }

}
