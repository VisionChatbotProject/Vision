# SmartStudyAuthoring

This is the frontend for the SmartAuthoring system. It is written in typescript and built as Angular 12+ application.

## How to get started [developers]
Please make sure that you have at least read-access to all dependant repositories. At the moment, these are:

 - [ngx-smartstudy-auth](https://github.com/Smart-Study-Graz/ngx-smartstudy-auth)

If you do not have access, please write an email to [Philipp Hafner](mailto:philipp.hafner@smart-study.at) to gain access.

## Prerequisites 
As this is an angular project, please make sure that you have installed and set up [node](https://nodejs.org/en/download/) (at least `v14`).

## Cloning the repository
This step is fairly self explanatory, simply clone the repostory to a suitable location on your computer. (for the latest version, please check out the `develop` branch)

## Installing dependencies
As we make use of internal (private) packages, you need to add `github` as a `npm` package registry.
Open a terminal and go to the folder containing the cloned repository. As you will need to provide credentials, you need to set up a `PAT` (Personal Access Token). You can do that in your github [settings](https://github.com/settings/tokens). Make sure that your `PAT` has at least permissions to read from packages (Download packages from Github Package Registry)

Create a `.npmrc` file, and add the following content:
```
registry=https://registry.yarnpkg.com/
@smart-study-graz:registry=https://npm.pkg.github.com
/:_authToken={YourGithubPat}
always-auth=true
```

Now install all dependencies:
```
yarn install
```

## Running the application
After installing all dependencies, simply run the following to start the application in developer mode:
```
ng serve
```
or if you are on windows:
```
npx ng serve
```

## Docker Support
Docker is used for deployment. For further information, see [here](doc/docker.md)
