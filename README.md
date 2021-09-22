# Auth0 Universal Login SPA Example

## Overview

This is a simple example of using a SPA as a custom Login page in [Auth0's Universal Login](https://auth0.com/docs/login/universal-login) for sign in and sign up. This isn't an example of best practices.

The React app uses [Auth0.js](https://github.com/auth0/auth0.js) and is straitforward in it's use. The key parts, taken from the Custom Login Form template are:

* [`index.html`](./public/index.html#L27-L31) sets the `window.config` object the app uses
* [`App.js`](./src/App.js#L14-L25) sets up the `params`, based on `window.config`, which is passed into the `auth0.WebAuth` constructor

## Build and Deploy

Since Universal Login will only be hosting the HTML, we need to host the static assets on a CDN, tell the build process to use the CDN's URL for these, deploy the static assets to the CDN, and finally deploy the HTML to Auth0.

### Build

To have Create React App use CDN paths for assets set the `PUBLIC_URL` environment variable to your CDN directory where you intend to deploy the files before building. e.g. 

`PUBLIC_URL=https://cdn.example.com/login npm run build`

The `build` directory will now contain the built app.

### Deploy

First, you'll deploy the static assets in the `build` directory to your CDN using your normal build process. This example uses a [GitHub Actions workflow](./.github/workflows/auth0-ul-deploy.yml#L28-L36) to deploy them to S3. 

Next, you'll deploy the HTML to Auth0 using the [Auth0 Deploy CLI](https://github.com/auth0/auth0-deploy-cli). This example uses a [GitHub Actions workflow](./.github/workflows/auth0-ul-deploy.yml#L38-L47) which runs the `deploy-cli` with a YAML config that only deploys the `build/index.html` page.
