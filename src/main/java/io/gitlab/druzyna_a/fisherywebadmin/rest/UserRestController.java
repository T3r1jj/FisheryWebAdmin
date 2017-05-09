package io.gitlab.druzyna_a.fisherywebadmin.rest;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
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
    public @ResponseBody
    String user(OAuth2Authentication oauth2) {
        Authentication userAuthentication = oauth2.getUserAuthentication();
        String name = userAuthentication.getPrincipal().toString();
        Map<String, Object> details = (Map<String, Object>) userAuthentication.getDetails();
        String email = details.get("email").toString();
        String picture = null;
        if (details.containsKey("picture")) {
            picture = details.get("picture").toString();
        }
        if (details.containsKey("avatar_url")) {
            picture = details.get("avatar_url").toString();
        }
        return "{\"user\":{\"name\":\"" + name + "\", \"email\": \"" + email + "\", \"picture\": \"" + picture + "\"}}";
    }

    @RequestMapping(path = "/api/admins/count")
    public @ResponseBody
    String getUsers() {
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
