# Project Requirements

## Database
- [ ] Any database technology – Relational or NoSQL  
- [ ] Realistic test data (large enough data set)  
- [ ] Stored objects: Views, Stored procedures, Stored functions, Triggers, Events  
- [ ] Transactions for SQL statements that must be executed together  
- [ ] Scalability – using indexes to speed up crucial queries  
- [ ] Security: Definition of user accounts and privileges for the app and for admins  

## Backend
- [ ] CRUD operations with error handling  
- [ ] REST API (following REST principles) or GraphQL  
- [ ] Logging (for example **sentry.io**)  
- [ ] Testing – unit tests, integration tests  
- [ ] Transactions for SQL statements that must be executed together  
- [ ] Security:
  - [ ] SQL Injection protection  
  - [ ] CORS (Cross-Origin Resource Sharing)  
  - [ ] HTTPS instead of HTTP  
  - [ ] Authentication – JWT (HTTP-only cookies) or Session  
  - [ ] Login and Registration APIs  
  - [ ] Password hashing  
- [ ] API documentation (**OpenAPI Specification – Swagger, ReDoc**)  

## Frontend
- [ ] Proper architecture using components  
- [ ] SPA – Single-Page Application  
- [ ] Caching (cache time, stale time, initial data), request retries (e.g. **React Query**)  
- [ ] Error handling  
- [ ] Routing – home page, error page, other pages, protected routes where needed  
- [ ] Logging service (e.g. **sentry.io**)  
- [ ] State management (props, context, global state) – proper solution  
- [ ] CSS Styles – components, styled-components, or CSS files  
- [ ] Testing – unit tests, end-to-end tests (e.g. **Cypress**)  
- [ ] Security:
  - [ ] XSS (Cross-Site Scripting) protection  
  - [ ] CSRF (Cross-Site Request Forgery) protection  
  - [ ] Session hijacking prevention  
  - [ ] Secure Login and Registration  
- [ ] Responsive design – **mobile-first approach**  
- [ ] Sitemap  
- [ ] User Experience design  
- [ ] UI prototypes (e.g. **Figma**)  

## Cloud Deployment
- [ ] Backend, frontend, and database deployed in the cloud  
- [ ] CI/CD pipeline (e.g. git → GitHub → tests → deploy to cloud)  
  - [ ] May include Docker images + push to DockerHub  
- [ ] Using a CDN (e.g. **AWS CloudFront**) for hosting static resources (images, videos, etc.)  

---

## Final Delivery (WISEflow)
- [ ] Short presentation (1 page) including:
  - [ ] Links to GitHub repository / repositories  
  - [ ] Link to deployed application  
