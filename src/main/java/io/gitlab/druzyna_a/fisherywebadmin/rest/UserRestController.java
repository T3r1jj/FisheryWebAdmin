package io.gitlab.druzyna_a.fisherywebadmin.rest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Damian Terlecki on 06.05.17.
 */
@RestController
public class UserRestController {

    @Value("${login.enable}")
    private boolean enableLogin;

    @RequestMapping("/user")
    public @ResponseBody
    String user(OAuth2Authentication oauth2) {
        String name;
        String email;
        String picture = "";
        try {
            Authentication userAuthentication = oauth2.getUserAuthentication();
            name = userAuthentication.getPrincipal().toString();
            Map<String, Object> details = (Map<String, Object>) userAuthentication.getDetails();
            email = details.get("email").toString();
            picture = null;
            if (details.containsKey("picture")) {
                picture = details.get("picture").toString();
            }
            if (details.containsKey("avatar_url")) {
                picture = details.get("avatar_url").toString();
            }
        } catch (Exception up) {
            if (enableLogin) {
                throw up;
            }
            name = "Guest admin";
            email = "no email";
        }
        return "{\"user\":{\"name\":\"" + name + "\", \"email\": \"" + email + "\", \"picture\": \"" + picture + "\"}}";
    }

    @RequestMapping(path = "/api/admins/count")
    public @ResponseBody
    String getAdminsCount() {
        String result;
        try {
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
            result = String.valueOf(count);
        } catch (Exception e) {
            result = "\"Unauthorized\"";
        }
        return "{\"count\": " + result + "}";
    }

    @RequestMapping(path = "/api/users/count")
    public @ResponseBody
    String getUsersCount() {
        String result = "\"over 9000\"";
        RestTemplate restTemplate = new RestTemplate();
//        JSONObject[] users = restTemplate.getForObject("IDK", JSONObject[].class);
        return "{\"count\": " + result + "}";
    }

    @RequestMapping(path = "/api/users")
    public @ResponseBody
    String getUsers() {
        RestTemplate restTemplate = new RestTemplate();
//        JSONObject[] users = restTemplate.getForObject("IDK", JSONObject[].class);
        return "[{\"name\": \"string\", \"email\": \"testmail\"}]";
    }

    @RequestMapping(path = "/api/reservations")
    public @ResponseBody
    String getReservations() {
        RestTemplate restTemplate = new RestTemplate();
//        JSONObject[] users = restTemplate.getForObject("IDK", JSONObject[].class);
        return "[{\"name\": \"string\", \"user\": \"an user\", \"email\": \"testmail\"}]";
    }

    @RequestMapping(path = "/api/reservations/delete")
    public @ResponseBody
    String deleteReservation(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return "true";
//        return restTemplate.exchange("/{id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

    @RequestMapping(path = "/api/emails/add")
    public @ResponseBody
    String addEmail(@RequestBody String data) {
        HttpEntity<String> entity = prepareJsonEntity(data);
        RestTemplate restTemplate = new RestTemplate();
        return "true";
//        return restTemplate.postForObject("IDK", entity, String.class);
    }

    private HttpEntity<String> prepareJsonEntity(@RequestBody String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        return new HttpEntity<>(data, headers);
    }
}
