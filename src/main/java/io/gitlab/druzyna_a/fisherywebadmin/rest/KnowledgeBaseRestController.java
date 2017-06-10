package io.gitlab.druzyna_a.fisherywebadmin.rest;

import io.gitlab.druzyna_a.totp4j.TOTP;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by Damian Terlecki on 04.05.17.
 */
@RestController
public class KnowledgeBaseRestController {

    private static final String ARTICLE_RESOURCE = "/article";
    @Value("${service.knowledge_base}")
    protected String knowledgeBaseRootUrl;
    @Value("${io.gitlab.druzyna_a.fisheryknowledgebase.totp_interval}")
    private int totpInterval;
    @Value("${io.gitlab.druzyna_a.fisheryknowledgebase.totp_key}")
    private String totpKey;
    @Value("${io.gitlab.druzyna_a.fisheryknowledgebase.totp_token_length}")
    private int totpTokenLength;
    @Value("${io.gitlab.druzyna_a.fisheryknowledgebase.totp_hmac_algorithm}")
    private String totpHmacAlgorithm;

    @RequestMapping(value = "/api/articlesRequests", method = RequestMethod.GET)
    public @ResponseBody
    String getArticlesRequests() {
        Map<String, String> args = new HashMap<>();
        RestTemplate restTemplate = new RestTemplate();
        args.put("token", generateToken());
        return restTemplate.getForObject(knowledgeBaseRootUrl + ARTICLE_RESOURCE + "?token={token}", String.class, args);
    }

    @RequestMapping(value = "/api/articlesRequests/add", method = RequestMethod.GET)
    public @ResponseBody
    String addArticlesRequest(@RequestParam("tags") String tags, @RequestParam("tagsCount") int tagsCount, @RequestParam("quick") boolean quick) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(null, headers);
        Map<String, String> args = new HashMap<>();
        RestTemplate restTemplate = new RestTemplate();
        args.put("tags", tags);
        args.put("tagsCount", String.valueOf(tagsCount));
        args.put("quick", String.valueOf(quick));
        args.put("token", generateToken());
        restTemplate.postForObject(knowledgeBaseRootUrl + ARTICLE_RESOURCE + "/request?token={token}&tags={tags}&requiredTagsCount={tagsCount}&quick={quick}", entity, String.class, args);
        return "true";
    }

    @RequestMapping(value = "/api/scrapedArticles", method = RequestMethod.GET)
    public @ResponseBody
    String getScrapedArticles(@RequestParam("id") String id) {
        Map<String, String> args = new HashMap<>();
        RestTemplate restTemplate = new RestTemplate();
        args.put("id", id);
        args.put("token", generateToken());
        return restTemplate.getForObject(knowledgeBaseRootUrl + ARTICLE_RESOURCE + "/{id}?token={token}", String.class, args);
    }

    private String generateToken() {
        try {
            return String.valueOf(new TOTP.Builder()
                    .setInterval(totpInterval)
                    .setKey(totpKey)
                    .setT0(System.currentTimeMillis() / 1000)
                    .setTokenLength(totpTokenLength)
                    .setAlgorithm(totpHmacAlgorithm)
                    .createTOTP().generateToken());
        } catch (InvalidKeyException | NoSuchAlgorithmException ex) {
            Logger.getLogger(KnowledgeBaseRestController.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }
}
