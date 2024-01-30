# SmartAuthoringBackend
The Django backend for the smart authoring tool

## Checkout and project setup
Clone the repository to a directory of your choosing and make sure you have installed `python3.10`.
From here on out, `python3.10` is simply named `python3`.

Go to the directory where you cloned the repository and create and activate your `venv`:

Linux:
```bash
$ python -m venv env
$ source env/bin/activate
```

Windows:
```cmd
> python -m venv env
> .\env\Scripts\Activate
```

Next, install all dependencies:
```bash
(env) $ pip3 install -r requirements.txt
```

Create a usable default config:
```
(env) $ python create_defaultconf.py config/config.json
```

Run all necessary migrations, create a user and start the server:

wsl = Windows Subsystem Linux

```bash
(wsl) $ export URL_CHATBOT_AGENT=http://localhost:5005
(wsl) $ envsubst < ./default_files/scorm_resources/navigation.js.template > ./default_files/scorm_resources/navigation.js

(env) $ python manage.py migrate
(env) $ python manage.py createsuperuser
(env) $ python manage.py runserver 0.0.0.0:8000
```

## Deployment
Deployment is done via docker. This system needs two dockers, one for serving the backend directly, and one for serving all files:

- [backend](doc/backend.md)
- [server](doc/server.md)




