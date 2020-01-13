const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const config = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  callbackUrl: process.env.AUTH0_CALLBACK_URL,
  baseApiUrl: process.env.BASE_API_URL
};

fs.writeFile("./src/config-variables.js", `export const CONFIG = ${JSON.stringify(config)};`, function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
