#Developer Documentation

[Repo URL](https://github.com/ChadWKirk/PicPocket.git)

##Hosting and git workflow:

Frontend is hosted on Netlify:

1. Install Netlify CLI in client folder
1. cd client > npm run build
1. netlify deploy ./build
1. netlify deploy --prod ./build

####Important:

Have domain variable in App.js to toggle between using localhost for fetch routes or heroku domain for fetch routes to make it easier to develop. Use domain = localhost when developing, but switch to domain = heroku when building.

Backend is hosted on Heroku

1. Install Heroku CLI in server folder
1. git add .
1. git commit -am "message"
1. git push heroku main

[Heroku - Deploying with Git](https://devcenter.heroku.com/articles/git)

##Routing:

1. Front End

- uses react-router-dom (npm i react-router-dom)
- Surround App in BrowserRouter in index.js
- Uses Routes and Route from rrd in App.js to decide which js file (aka page) is shown when browser is in certain route (ex. /SignUp)
- Footer is outside of routes because it's on every page

2. Back End

- Uses NodeJS and Express (npm i express)
- To retreive and/or manipulate data, uses fetch api unless AXIOS is required to use things like Multer for image upload

##App.js states:

The states in App.js are there so one page can change a state and then it will get passed to a completely different page.

For example:

User goes to UserSettingsPage > Deletes their account > sets isJustDeleted to true > gets navigated to MainPage (navigate doesn't rerender/re-initiate state so it stays true) > if isJustDeleted is true, show account deleted banner.

Idea:

If user clicks on their own image from ImageGallery, there will be an edit button as well as a delete button in the same bar as like and DL button, allowing them to edit the image's info or delete it from right there in the modal without going to their My Pics page. When clicking delete, there will be an are you sure message like in My Pics. When clicking the edit button, the entire modal will be replaced with Modal_ImageSelectEditable which is also used in My Pics when user clicks the edit button on one of their pics. The title, description and tags will be replaced with input fields with the same styling as their respective text in the non editable modal.
