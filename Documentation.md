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

##Pages:

Not Found Page - This page appears when someone goes to a route that is not defined. For example: if someone tries going to picpoccket.com/signuppppppp or picpoccket.com/idk, it will display the Not Found Page.

Main Page - Main Page is the home page. It uses a navbar, hero section, image gallery, and join now section. To handle whether it is showing images sorted by Most Recent or Most Popular, there is a MainPageContent component inside the MainPage.js with a Page prop that determines the sorting. That prop is passed manually when creating the route in App.js, allowing for the use of the same component for both Most Recent and Most Popular. This is so you can change just one component (the MainPageContent component) and it applies to both / and /most-popular instead of having to change both pages when updating the format or styling etc..

Search Result Page - This page shows search results. It uses a navbar, image gallery heading component, image gallery and footer. When a user searches for something, they get moved to the search route+search parameters for sorting and filtering (ex: /search/dog?sort=most-recent&filter=all-types). These searchParams get changed when the sort or filter is changed from the drop down menu in the ImageGallerySortFilterAndSubheadingComponent component. When a user selects a sort or filter, it navigates to the current url but with the right searchParams. The GET request in the Search Result Page uses the searchParams in the URL to ask for the correct sorting/filtering of images in the NodeJS route.

Image View Page - This page shows one image that is selected from the ImageGallery. On first render, it shows an image modal, but on second render it shows the full page. It shows the image's author, a like button and download button, the image, the image's title, tags and description. When clicking the image, it scales the image and uses the cursor's position relative to the image's boundingRect to create a transform origin for the scaling, mimicing moving the image around while zoomed in so the user can zoom in on specific points. When the tags list gets long enough, arrow icons appear that you can click to scroll the tags list. The tags list runs a requestAnimationFrame, moving the tags list one full length of the tags list.

Image View Page > Image Modal - This isn't it's own page, but it's kinda like that. It is rendered on first render of Image View Page. When an image in ImageGallery is clicked, a state of the current scroll position is stored and isShowingImageSelectModal is set to true (in App.js). body overflow style is set to hidden to make body not scrollable while modal is up. Clicking the left/right arrow icons (not tags) shows the next or previous image in the ImageGallery. This is done by holding an array of image public ID's called imgTitleArrState when an ImageGallery component renders, which gets passed to the Image Modal component. When clicking the arrows, it changes the URL to have the public ID of the imgTitleArrState index either 1 behind or 1 in front of the current index. When clicking the black background or the X button of the modal, it brings you back to the previous page where the image gallery was rendered (ex: main page, search results page, etc.). This is done by storing the page in state in App.js and navigating to that page when clicked. It also automatically scrolls to the scroll position stored in state and sets body overflow style to auto to add scrollability back. When user refreshes in modal, it brings them to ImageViewPage due to isImageSelectModal being reset to false (default in App.js). When clicking the back or forward buttons for the browser, the Image View Page rerenders when the URL changes, causing a refetch of the imginfo and userInfo.

If user clicks on their own image from ImageGallery, there will be an edit button as well as a delete button in the same bar as like and DL button, allowing them to edit the image's info or delete it from right there in the modal without going to their My Pics page. When clicking delete, there will be an are you sure message like in My Pics. When clicking the edit button, the entire modal will be replaced with Modal_ImageSelectEditable which is also used in My Pics when user clicks the edit button on one of their pics. The title, description and tags will be replaced with input fields with the same styling as their respective text in the non editable modal.
