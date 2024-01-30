# SmartAuthoring Docker

This docker contains an Angular application that is served via an nginx server.
## Configuration
Configuration can be passed either via defining environment variables or by overriding a template config file.

### Environment variables
The following environment variables for configuring the frontend are supported:

- `PRODUCTION` [Default: `true`]\
  Defines if this is a production environment. This may affect console output or cutting-edge features. Must be a `js` boolean value (`true` or `false`)
- `API_URL` [Default: `www.smartauthoring.com`]\
  Defines a FQDN (without port) where the backend is available. eg. `https://www.smartauthoring.com`

The following environment variables for configuring the nginx server are available:

- `NGINX_PORT` [Default: `8080`]\
Specifies the port on which nginx serves the frontend.

### Volume mount
If, for some reason, you do not want to configure the frontend via environment variables, you can mount a host directory to `/config` containing a file named `config.js.template`. The file defaults to the contents located [here](TBD). And yes, you can use environment variables in there.

*Why would you want this?*\
In theory, this makes it possible to change the frontend configuration *at runtime*. If this is something you need, make sure to run the following command after making your changes:
```
docker exec -it <id> ash read_env.sh
```




