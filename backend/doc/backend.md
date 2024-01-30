# Backend Docker

This docker contains the django application which is served via daphne.
## Configuration
Configuration can be passed either via defining environment variables or by providing a volume mount containing a config file.

### Environment variables
Here are all parameters that can be configured. Note that usually it is sufficient to adapt the user config.

#### **User parameters**

- `SECRET_KEY` [Default: `-`]\
  Defines the secret key for various hashing. This is a parameter that should be secure. If you do not want to expose it via the environment, you should provide it via a volume mount.

- `URL_BACKEND` [Default: `api.smartauthoring.com`]\
  Defines the FQDN that the backend is accessible from.

- `URL_FRONTEND` [Default: `smartauthoring.com`]\
  Defines the FQDN that the backend is accessible from.

- `DEFAULT_FROM_EMAIL` [Default: `admin@smartauthoring.com`]\
  Defines the default sender address for emails.

- `MAIL_BACKEND` [Default: `FILE` (`SMTP`)]\
  Defines which backend to use. In case of `SMTP`, the following parameters have to be set:

  - `EMAIL_HOST`\
  The email server to use for sending emails.

  - `EMAIL_PORT` [Default: `25`]\
  The port to use for connecting to the server

  - `EMAIL_HOST_USER`\
  The username to use for connecting to the server.

  - `EMAIL_HOST_PASSWORD`\
  The password to use for connecting to the server.

  - `EMAIL_USE_TLS` [Default: `True`]\
  Specify if TLS should be used for connections. Must be a `python` boolean value (`True` or `False`).




- `ASSET_STORE_LOCATION` [Default: `files/data`]\
  Defines the directory where application files are stored.

- `MAIL_PATH` [Default: `files/mails`]\
  Defines where mails are stored in case `FILE` is chosen as a backend.

- `SCORM_RESOURCES` [Default: `default_files/scorm_resources`]\
  Defines where scorm templates are stored.

- `ASSET_DEFAULT_STORE_LOCATION` [Default: `default_files/data`]\
  Defines where default files are stored.

- `URL_CHATBOT_AGENT` [Default: `https://botagent.visionapp.smart-study.net`]\
  Defines the FQDN of the chat bot agent. The value must contain the used protocol (HTTPS/HTTP) and may contain a trailing port number, if necessary.


### Volume mount
It is advised to create a volume mount for all data files. The mount should target the `files/` directory inside the container.

If you want to provide your own settings file (a `json` with the same keys as described above), simply mount a directory containig this file (named `config.json`)
to `config/` inside the container.

The database folder is accessible under the `database/` folder inside the container.


