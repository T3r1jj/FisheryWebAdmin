package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Damian Terlecki on 09.05.17.
 */
public interface CrudRestApi {

    @RequestMapping(method = RequestMethod.GET)
    String getAll();

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    String add(@RequestBody String data);

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    String update(@RequestBody String data);

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    String delete(@RequestParam int id);

    default HttpEntity<String> prepareJsonEntity(@RequestBody String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        return new HttpEntity<>(data, headers);
    }

}
