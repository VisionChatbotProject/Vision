# Backend Docker

This docker contains the server (`nginx`) that is responsible for handling all files.
## Configuration
Configuration can be passed either via defining environment variables.

### Environment variables
Here are all parameters that can be configured:

- `ASSET_STORE_LOCATION` [Default: `files/data`]\
  Defines the directory where application files are stored. The value must be the **same** as defined for the backend docker.

- `ASSET_DEFAULT_STORE_LOCATION` [Default: `default_files/data`]\
  Defines where default files are stored.
  The value must be the **same** as defined for the backend docker.

### Volume mounts
It is necessary to create a volume mount for all data files. The mount should target the `files/` directory inside the container. This mount also has to be exposed to the django docker.

