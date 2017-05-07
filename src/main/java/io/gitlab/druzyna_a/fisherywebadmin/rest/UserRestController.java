package io.gitlab.druzyna_a.fisherywebadmin.rest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Damian Terlecki on 06.05.17.
 */
@RestController
public class UserRestController {

    @RequestMapping("/user")
    public Principal user(Principal principal) {
        return principal;
    }

    @RequestMapping(path = "/api/admins/count")
    public String getUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
        Map<String, String> args = new HashMap<>();
        args.put("access_token", details.getTokenValue());
        RestTemplate restTemplate = new RestTemplate();
        String users = restTemplate.getForObject("https://gitlab.com/api/v4/groups/Druzyna-A/members?access_token={access_token}", String.class, args);
        int count = 0;
        while (users.contains("\"id\":")) {
            users = users.replaceFirst("\"id\":", "");
            count++;
        }
        return "{\"count\": " + count + "}";
    }
}
