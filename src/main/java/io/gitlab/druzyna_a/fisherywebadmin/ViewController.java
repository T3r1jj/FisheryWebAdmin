package io.gitlab.druzyna_a.fisherywebadmin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Damian Terlecki on 02.05.17.
 */
@Controller
public class ViewController {
    @RequestMapping({
            "/articles",
            "/dashboard",
            "/fishes",
            "/fisheries",
            "/users",
            "/about"
    })
    public String index() {
        return "forward:/app.html";
    }
}
