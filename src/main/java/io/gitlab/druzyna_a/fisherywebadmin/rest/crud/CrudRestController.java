package io.gitlab.druzyna_a.fisherywebadmin.rest.crud;

import org.springframework.beans.factory.annotation.Value;

/**
 * Created by Damian Terlecki on 23.05.17.
 */
abstract class CrudRestController implements CrudRestApi {
    @Value("${service.crud}")
    protected String crudRootUrl;
}
