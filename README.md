# Companion Application for User Support
Customers will call the help desk with issues that they encounter in the application.  Depending on the issue that the customer is experiencing, the help desk representative may need to get information about the customer’s experience and the customer’s data to be able to help them work through their issue.


## Setup
* Create new API with audience: `http://api.com/api`
* Create new SPA client, call it `Fabriship Online`
* Create new WebApp client, call it `Help Desk Application`
* Create new M2M client with `read:users` on the management API, call it `API`
* Create new rules from (keep the order)
  1. `rules/addRoleToAccessTokenClaim.js`
  1. `rules/rejectNonAdmins.js`

```bash
cp api/env.sample api/.env
# Replace with new Auth0 M2M client that has permission to read:users from the management API
cp spa/env.sample spa/.env
# Replace with new Auth0 SPA client information that you created
cp adminApp/env.sample adminApp/.env
# Replace with new Regular Web Application client information that you created for the Help Desk Application
```

## Run
```
# in 3 different terminals
cd api
npm i
npm run start
cd spa
npm i
npm run start
cd adminApp
npm i
npm run start
```

# LICENSE
MIT
