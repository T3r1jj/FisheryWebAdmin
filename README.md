# ![FisheryWebAdmin](src/main/resources/static/assets/favicon-32x32.png) FisheryWebAdmin 

FisheryWebAdmin is a web application written in **Java and JavaScript** (+HTML, CSS, LESS) that provides user interface for admin access to Fishery project services. The app is based on **Spring Boot + AngularJS + Material Design**.

The admin interface gives access to CRUD web service and allows to integrate-and-edit some data gathered from KnowledgeBase. The connection with the client module provides user management (reservations, e-mailing). It also displays status of the user apps.   

FisheryWebAdmin was hosted at Heroku. It requires distributed CRUD, KnowledgeBase and client modules to be up and running to provide full functionality. 

### Gallery [[more]](https://t3r1jj.github.io/FisheryProject)

### Main features
Data management:
- articles
- fisheries
- fishes
- reservations
- users

Other:
- status display
- basic statistics
- fisheries map
- showcase help
- html editor for articles
- configurable authentication (guest - preview, github/gitlab/google based)
- small size thanks to wro4j
- unprotected API hidden behind server

Integration with:
1. Client REST module
2. CRUD REST module
3. [KnowledgeBase REST module](https://github.com/T3r1jj/FisheryKnowledgeBase)
4. User web app (status check)

### Configuration
The configuration can be changed in the following files:
- application.properties - general properties and integration with distributed modules
- application.yaml - authentication and email properties
- services.js - integration with public, distributed modules