---
layout: default
title: Upload Page
parent: Pages
nav_order: 2
---

#Upload Page

The page that allows users to upload images.

##Usage:

**Verification:**

When user goes to the upload page, it checks if user is verified or not. If they are not verified (in database) then they can't upload and a red banner shows saying they can't upload. When user becomes verified by clicking the email verification link, they are redirected to the upload page and there is a green banner showing saying they can now upload pics. This green banner only shows that first time, after they refresh there is just no banner.

**Uploading:**

User can upload by drag n drop, or by clicking Browser button. When user submits an image, the upload function checks to see if it is an accepted file type (decided within the upload function) and if it is under 10MB (cloudinary's free user file size limit). If image passes, a new FormData is created with the image's data and the uploader's name, which get sent to the server.

The server uses Multer to handle the multipart-formData. The image gets sent to the images folder inside of the server folder, then gets uploaded to cloudinary and that gets put into mongoDB. After it is uploaded, the image is deleted from the images folder in the server folder.

**File List:**

When the image is being uploaded, that image gets added to the array ImagesToUpload, which resides in the FileList component as a map which creates a list of ImageItem(s) inside of the FileList component showing the image thumbnail, title, and delete button. If user clicks the delete button on an ImageItem, that image gets removed from cloudinary, mongoDB and the front end (by removing it from ImagesToUpload array).

Uploading images with same name as each other:
upload using multer instead of in front end with unsigned upload preset so you can input the random number so the initial public_id isn't a random string

for public id, put Math.floor(100000 + Math.random() {multiplied by} 900000) at the end of the name of the image

for example "lady" turns into "lady-245609" or "lady-333400"

when clicking image in gallery > go to /image/<public_id> without the "picpocket/" part > GET request to get image with req.params.public_id as public_id

##Pipeline:

**Upload Page pipeline:**

1. User submits pic

1. image gets tested if it’s correct file type + under size limit

1. if img passes, put it in ImagesToUpload array

1. create ImagesToUpload.map with image’s info inside FileList component, creating a new ImageItem component

1. if user clicks the delete button on an ImageItem, fetch request to remove from cloudinary and mongoDB and create a new ImagesToUpload array by filtering it for every item that doesn't have the name of the image being deleted
