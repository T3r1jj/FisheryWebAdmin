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

    @Value("${service.crud}")
    protected String crudRootUrl;
    @Value("${service.knowledge_base}")
    protected String knowledgeBaseRootUrl;
    @Value("${service.client}")
    protected String clientRootUrl;
    @Value("${service.user}")
    protected String userRootUrl;
    @Value("${build.version}")
    private String buildVersion;

    @RequestMapping(value = MAPPING_BASE_URL + "/crud", method = RequestMethod.GET)
    public @ResponseBody
    String isCrudUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(crudRootUrl + "/swagger-ui.html", String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/client", method = RequestMethod.GET)
    public @ResponseBody
    String isClientUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(clientRootUrl + "/swagger/ui/index", String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/knowledge_base", method = RequestMethod.GET)
    public @ResponseBody
    String isKnowledgeBaseUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(knowledgeBaseRootUrl, String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL + "/user", method = RequestMethod.GET)
    public @ResponseBody
    String isUserUp() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(userRootUrl, String.class);
        return "{\"status\": \"up\"}";
    }

    @RequestMapping(value = MAPPING_BASE_URL, method = RequestMethod.GET)
    public @ResponseBody
    String getVersion() {
        return "{\"version\": \"" + buildVersion + "\"}";
    }

}
