# PicPocket

PicPocket is an image sharing website made with the MERN stack.

## Description

### This application allows users to:
- create and delete their account with a bio and profile picture
- like, share, upload and download their own images

### This application features:
- Using cloudinary as image host CDN. Useful for transformations with quality and size etc.
- Using MongoDB as database for sorting, filtering and searching to display the desired images
- Host on heroku (server) and netlify (client)
- Password hashing with bcryptjs
- Using React-Router-Dom to handle routes on the front end
- Lazy load images
- Skeleton load images. Grabs primary color, width and height from loading image to create a div with img dimensions and primary color for background to be placeholder.
- Fully responsive design
- Sticky nav bar
- Zoom into image when clicking on it
- The useage of modals
- Loading screens, button icons, and bar
- Edit image info (title, description, tags)
- Drag and drop image upload
- Multiple image upload
- Check for accepted file type when uploading
- Page Not Found page for any route that is undefined
- Send confirmation and change password emails to user using zoho mail service and nodemailer
- Google OAuth and Facebook OAuth
- Sort and Filter options for image gallery results
- Conditionally rendering elements in DOM depending on if user is logged in or not
- Useage of toast alerts to handle success or errors
- Useage of tooltips to handle empty fields (tells user to fill in field)

## Tech Used

This is a MERN stack application, meaning I used MongoDB, Express, React and NodeJS. Other services I use include Cloudinary (for image hosting), Zoho (for email service), Heroku (to host back end) and Netlify (to host front end).

### MongoDB

MongoDB is used for storing, receiving and manipulating data that resides in a database. 

Upload pipeline:

- User submits an upload > the client sends a fetch request to the upload endpoint in nodeJS > image is uploaded to cloudinary using their sdk for NodeJS > Cloudinary spits out a result object with the image's data > add some fields to it > upload to mongoDB database

MongoDB is also used for sorting, filtering and searching to display the desired images.

### Express

Express is a framework that is used in NodeJS to make it easier to set up routes and handle HTTP requests. A simple route would look like: app.get("/get-users", (req, res) => {console.log("test this route")});. You could then perform a fetch request on the front end to that route using the GET method and it would log "test this route" on the server side. This is how the client communicates with the server to access the database from MongoDB.

### React

React is a front end framework based in Javascript. It was built by several Facebook (now Meta) engineers and is the most popular front end framework in the world. Rather than manipulating the DOM directly as in Javascript, React creates a virtual DOM and it uses State to keep track of all of the individual elements within the virtual DOM. Whenever the State of anything changes, the virtual DOM rerenders therefore changing what you see in the real DOM.

React also allows you to create reuseable components, making it easier and more efficient in building the UI. These components behave sort of like regular javascript functions, except they combine javascript and html together, which is called JSX. You can pass properties to these components, like you would pass parameters to a Javascript function. This is very useful for allowing a change of one property's state to make a change to multiple components.

### NodeJS

NodeJS is a Javascript runtime that allows you to execute Javascript code outside of a browser. It runs on the V8 Javascript engine, making it very fast. NodeJS also allows you to use the NPM package manager, which gives you access to thousands of packages to help you build anything you want. Express (above) is an NPM package that makes it easier to handle HTTP requests in NodeJS.

# How To Run:

## Requirements

- Install NodeJS
- Install MongoDB
- Create Cloudinary Account (free)
### To Host:
- Create Heroku Account
- Create Netlify Account (free)

## Instructions

- 
