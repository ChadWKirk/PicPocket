---
title: Home
layout: home
---

#Big Picture Stuff

Repo URL - https://github.com/ChadWKirk/PicPocket

##(#header-2)Hosting and Git workflow:

####Frontend is hosted on Netlify:

1. Install Netlify CLI in client folder - [Get started with Netlify CLI](https://docs.netlify.com/cli/get-started/)

1. `cd client` > `npm run build`

1. `netlify deploy` `./build`

1. `netlify deploy --prod` `./build`

**Important:**

Have domain variable in App.js to toggle between using localhost for fetch routes or heroku domain for fetch routes to make it easier to develop. Use domain - localhost when developing, but switch to domain = heroku when building.

####Backend is hosted on Heroku:

1. Install Heroku CLI in server folder - [Heroku - Deploying with Git](https://devcenter.heroku.com/articles/git)

1. `cd server`

1. `git add .`

1. `git commit -am "message"`

1. `git push heroku main`

##Email:

Email is done by [Zoho](https://www.zoho.com/index1.html) and is connected to the https://picpoccket.com domain.

##Routing:

####Front End:

1. Uses [react-router-dom](https://reactrouter.com/en/main) `npm i react-router-dom`

1. Surround App in BrowserRouter in index.js

1. Uses Routes and Route from RRD in App.js to decide which JS file (aka page) is shown when browser is in certain route (ex. “/Signup")

1. Footer component is outside of routes because it’s on every page

####Back End:

1. Uses [NodeJS](https://nodejs.org/en/docs) and [Express](https://expressjs.com/en/api.html) `npm i express`

1. To retrieve and/or manipulate data, uses fetch API unless [Axios](https://axios-http.com/docs/intro) is required to use things like [Multer](https://www.npmjs.com/package/multer) for image upload

####App.js states:

The states in App.js are there so one page can change a state and then it will get passed to a completely different page.

For example: User goes to UserSettingsPage > Deletes their account > sets isJustDeleted to true (resides in App.js) > gets navigated to MainPage (navigate doesn't rerender/re-initiate state so it stays true) > if isJustDeleted is true, show account deleted banner.

####How Images Work:

- Uses [Cloudinary](https://cloudinary.com/) CDN to host images and also .zip files when user mass downloads in the My Pics page

[Cloudinary API Documentation](https://cloudinary.com/documentation/image_upload_api_reference)
