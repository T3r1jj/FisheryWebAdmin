package io.gitlab.druzyna_a.fisherywebadmin;

import io.gitlab.druzyna_a.totp4j.TOTP;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
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

    @Value("${io.gitlab.druzyna_a.knowledgebase.totp_interval}")
    private int totpInterval;
    @Value("${io.gitlab.druzyna_a.knowledgebase.totp_key}")
    private String totpKey;
    @Value("${io.gitlab.druzyna_a.knowledgebase.totp_token_length}")
    private int totpTokenLength;
    @Value("${io.gitlab.druzyna_a.knowledgebase.totp_hmac_algorithm}")
    private String totpHmacAlgorithm;

    @RequestMapping(value = "/api/articlesRequests", method = RequestMethod.GET)
    public @ResponseBody
    String getArticlesRequests() {
        Map<String, String> args = new HashMap<>();
        RestTemplate restTemplate = new RestTemplate();
        args.put("token", generateToken());
        try {
            return restTemplate.getForObject("https://fishery-knowledge-base.herokuapp.com/article?token={token}", String.class, args);
        } catch (HttpStatusCodeException exception) {
            return String.valueOf(exception.getStatusCode().value());
        }
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
