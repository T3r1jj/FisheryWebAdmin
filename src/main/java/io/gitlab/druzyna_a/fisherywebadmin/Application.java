package io.gitlab.druzyna_a.fisherywebadmin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.CompositeFilter;

import javax.servlet.Filter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Damian Terlecki
 */
@Configuration
@EnableOAuth2Client
@EnableAutoConfiguration
@ComponentScan(basePackageClasses = {
        ViewController.class,
})
public class Application extends WebSecurityConfigurerAdapter {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Autowired
    private OAuth2ClientContext oauth2ClientContext;
    @Value("${login.group}")
    private String loginGroup;
    @Value("${login.enable}")
    private boolean enableLogin;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (enableLogin) {
            http
                    .antMatcher("/**")
                    .authorizeRequests()
                    .antMatchers("/", "/login**", "/webjars/**", "/index.html", "/assets/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated()
                    .and().logout().logoutSuccessUrl("/").permitAll()
                    .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .and().addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class);
        } else {
            http
                    .antMatcher("/**")
                    .authorizeRequests()
                    .antMatchers("/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated()
                    .and().logout().logoutSuccessUrl("/").permitAll()
                    .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .and().addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class);
        }
    }

    private Filter ssoFilter() {
        CompositeFilter filter = new CompositeFilter();
        List<Filter> filters = new ArrayList<>();
        filters.add(ssoFilter(gitlab(), "/login/gitlab"));
        filters.add(ssoFilter(github(), "/login/github"));
        filters.add(ssoFilter(google(), "/login/google"));
        filter.setFilters(filters);
        return filter;
    }

    private Filter ssoFilter(ClientResources client, String path) {
        OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(path) {
            @Override
            public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
                Authentication authentication = super.attemptAuthentication(request, response);
                if (loginGroup.isEmpty()) {
                    return authentication;
                }
                OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
                Map<String, String> args = new HashMap<>();
                args.put("access_token", details.getTokenValue());
                RestTemplate restTemplate = new RestTemplate();
                try {
                    restTemplate.getForObject("https://gitlab.com/api/v4/groups/" + loginGroup + "/members?access_token={access_token}", String.class, args);
                } catch (Exception e) {
                    new SecurityContextLogoutHandler().logout(request, response, authentication);
                    throw new AccessDeniedException("The app has been set to deny access for users that are not part of Druzyna-A group on GitLab");
                }
                return authentication;
            }
        };
        OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), oauth2ClientContext);
        filter.setRestTemplate(template);
        UserInfoTokenServices tokenServices = new UserInfoTokenServices(
                client.getResource().getUserInfoUri(), client.getClient().getClientId());
        tokenServices.setRestTemplate(template);
        filter.setTokenServices(tokenServices);
        return filter;
    }

    @Bean
    public FilterRegistrationBean oauth2ClientFilterRegistration(
            OAuth2ClientContextFilter filter) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(filter);
        registration.setOrder(-100);
        return registration;
    }

    @Bean
    @ConfigurationProperties("github")
    public ClientResources github() {
        return new ClientResources();
    }

    @Bean
    @ConfigurationProperties("gitlab")
    public ClientResources gitlab() {
        return new ClientResources();
    }

    @Bean
    @ConfigurationProperties("google")
    public ClientResources google() {
        return new ClientResources();
    }

}
