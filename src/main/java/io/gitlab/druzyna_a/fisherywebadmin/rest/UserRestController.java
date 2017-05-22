package io.gitlab.druzyna_a.fisherywebadmin.rest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Created by Damian Terlecki on 06.05.17.
 */
@RestController
public class UserRestController {

    private static final String RESERVATIONS_BASE_URL = "https://druzyna-a-crud.herokuapp.com/reservation";
    private static final String FISHERY_BASE_URL = "https://druzyna-a-crud.herokuapp.com/fishery";

    @Autowired
    private JavaMailSender mailSender;

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
    String getUsersCount() throws JSONException {
        JSONArray activeUsers = getActiveUsers();
        return "{\"count\": " + activeUsers.length() + "}";
    }

    @RequestMapping(path = "/api/users")
    public @ResponseBody
    String getUsers() throws JSONException {
        JSONArray activeUsers = getActiveUsers();
        return activeUsers.toString();
    }

    private JSONArray getActiveUsers() throws JSONException {
        RestTemplate restTemplate = new RestTemplate();
        String subscriptionsJson = restTemplate.getForObject(FISHERY_BASE_URL + "/list", String.class);
        JSONArray subscriptions = new JSONArray(subscriptionsJson);
        String  reservationsJson = restTemplate.getForObject(RESERVATIONS_BASE_URL + "/list", String.class);
        JSONArray reservations = new JSONArray(reservationsJson);
        Set<String> users = new HashSet<>();
        for (int i = 0; i < subscriptions.length(); i++) {
            JSONObject subscription = subscriptions.getJSONObject(i);
            JSONArray emails = subscription.getJSONArray("subscribers");
            for (int j = 0; j < emails.length(); j++) {
                users.add(emails.getString(j));
            }
        }
        for (int i = 0; i < reservations.length(); i++) {
            JSONObject reservation = reservations.getJSONObject(i);
            users.add(reservation.getString("userEmail"));
        }
        JSONArray results = new JSONArray();
        for (String user : users) {
            JSONObject object = new JSONObject();
            object.put("name", user.contains("@") ? user.split("@")[0] : "");
            object.put("email", user);
            results.put(object);
        }
        return results;
    }

    @RequestMapping(path = "/api/reservations")
    public @ResponseBody
    String getReservations() throws JSONException {
        RestTemplate restTemplate = new RestTemplate();
        String  reservationsJson = restTemplate.getForObject(RESERVATIONS_BASE_URL + "/list", String.class);
        JSONArray reservations = new JSONArray(reservationsJson);
        String fisheriesJson = restTemplate.getForObject(FISHERY_BASE_URL + "/list", String.class);
        JSONArray fisheries = new JSONArray(fisheriesJson);
        for (int i = 0; i < reservations.length(); i++) {
            JSONObject reservation = reservations.getJSONObject(i);
            String userEmail = reservation.getString("userEmail");
            reservation.put("email", userEmail);
            reservation.put("user", userEmail.contains("@") ? userEmail.split("@")[0] : "");
            reservation.remove("userEmail");
            for (int j = 0; j < fisheries.length(); j++) {
                JSONObject fishery = fisheries.getJSONObject(j);
                if (fishery.getInt("id") == reservation.getInt("fisheryId")) {
                    reservation.put("name", fishery.getString("name"));
                    break;
                }
            }
            if (reservation.optString("name").isEmpty()) {
                reservation.put("name", "EMPTY OR REMOVED FISHERY");
            }
        }
        return reservations.toString();
    }

    @RequestMapping(path = "/api/reservations/delete")
    public @ResponseBody
    String deleteReservation(@RequestParam int id) {
        Map<String, String> args = new HashMap<>();
        args.put("id", String.valueOf(id));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange("http://andrzej1993-001-site1.itempurl.com/Api/Users/RemoveReservation?reservationId={id}", HttpMethod.DELETE, null, String.class, args).getBody();
    }

    @RequestMapping(path = "/api/emails/add")
    public @ResponseBody
    void addEmail(@RequestBody String emailJson) throws JSONException {
        JSONObject email = new JSONObject(emailJson);
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("movierental.terlecki@gmail.com");
            messageHelper.setTo(email.getString("email"));
            messageHelper.setSubject(email.getString("title"));
            messageHelper.setText(email.getString("body"), true);
        };
        mailSender.send(messagePreparator);
    }
}
