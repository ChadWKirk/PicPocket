# PicPocket

![GitHub last commit](https://img.shields.io/github/last-commit/ChadWKirk/PicPocket) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/ChadWKirk/PicPocket) ![GitHub all releases](https://img.shields.io/github/downloads/ChadWKirk/PicPocket/total?label=Downloads)

## PicPocket is an image sharing website made with the MERN stack.

This is a website that allows users to:

- Create accounts
- Upload images each with their own title, description and tags
- Edit their image information for each image
- Delete their images
- Search for images
- Sort and filter their search results
- Download images for free
- Like images

It also includes all of the basic functionality that users have come to expect from a website. Those features include:

- Secure password encryption
- An email verification link sent to their email after sign up or email change
- Changing their email / password
- Deleting their account
- Changing their profile picture
- Adding a bio for their profile so other users can know a little bit about them

Link to live site - [https://picpoccket.com](https://picpoccket.com)

## How This Thing Works

Developer Documentation - [https://chadwkirk.github.io/PicPocket/](https://chadwkirk.github.io/PicPocket/)

### The Quick And Dirty:

Technology Stack:

1. Client side is hosted on [Netlify](https://www.netlify.com/with/react/?utm_source=google&utm_medium=paid_search&utm_campaign=12755510784&adgroup=143221562618&utm_term=netlify%20react&utm_content=kwd-1290909035486&creative=645259053288&device=c&matchtype=e&location=9025161&gad=1&gclid=Cj0KCQjw6cKiBhD5ARIsAKXUdyZ2ZLzYqh4NXy2NO2l07HKtzoBMcJ9_GbRxP6uqMA2_r9pQn3J-pyMaAiHmEALw_wcB)
1. Server side is hosted on [Heroku](https://www.heroku.com)
1. Email is done by [Zoho](https://www.zoho.com/index1.html) (for email verification links, etc.)
1. Image hosting is done by [Cloudinary](https://cloudinary.com/)
1. Database is hosted by [MongoDB](https://www.mongodb.com/)
1. Front end is done with [React](https://react.dev/)
1. Server is done with [NodeJS](https://nodejs.org/en)

Features:

1. **Logging In/Out** is done with JSON Web Token in NodeJS and AuthContext in React
1. **Search** is done by entering a query into the search bar, submitting and getting redirected to a search URL. The ImageGallery component is rendered in the new page and sends a GET request to the search endpoint in server.js. This endpoint runs a search in MongoDB to find any image with a title field value that contains any word (separated by a space) in the search query, case insensitive using regex options in MongoDB.
1. **Likes** are done with MongoDB. Each image is uploaded with a "Likes" and a "LikedBy" field. When a user likes an image, that image's "Likes" field goes up by 1 by using a post request, and that user's username gets added to the image's "LikedBy" field so the liked button will render as already liked the next time the same user sees the image. That also makes sure that image is rendered in that user's Likes page.
1. **Uploading images** is done by sending multi-part formData in a post request to an endpoint in server.js. The server uses Multer to handle the multipart-formData. The image gets sent to the images folder inside of the server folder, then gets uploaded to cloudinary. Cloudinary returns a result containing all of the uploaded image's information which then gets sent to MonogDB along with some extra fields like "Likes", etc. After it is uploaded, the image is deleted from the images folder in the server folder.
1. **Downloading images** is done by using Cloudinary's fl_attachment URL flag inside of the image URL to be used as a download link.
1. **Password encryption** is done with BCrypt (npm package).
1. **Email verification links** and **password reset links** are created by generating JWT's and using them in URL's
1. **Deleting accounts** is done by removing the user from MongoDB
1. **Changing profile pictures** is done in the same way as uploading images (see above)
1. **Adding a bio for a profile** is done by setting the "bio" field for that user to whatever they want their bio to be.

## How To Run

This isn't an open source operation. You can't.
