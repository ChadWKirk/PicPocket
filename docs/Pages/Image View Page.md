---
layout: default
title: Image View Page
parent: Pages
nav_order: 2
---

# Image View Page

The page that shows the image when an image is clicked on from Image Gallery component.

## Usage:

This page shows one image that is selected from the ImageGallery.

On first render, it shows an image modal, but on second render it shows the full page.

It shows the image's author, a like button and download button, the image, the image's title, tags and description.

When clicking the image, it scales the image and uses the cursor's position relative to the image's boundingRect to create a transform origin for the scaling, mimicing moving the image around while zoomed in so the user can zoom in on specific points. When the tags list gets long enough, arrow icons appear that you can click to scroll the tags list. The tags list runs a requestAnimationFrame, moving the tags list one full length of the tags list.

## Edit Feature:

When user goes to imageViewPage of image that is theirs, there is an edit and delete button in the top bar.

When user clicks the edit button, isEditable gets set to true and the divs showing image info get hidden and input forms get shown. When button is clicked again, it returns the divs and hides the input fields by setting isEditable(false).

The default values of the input fields are the image's current info. The tags are the array of tags but turned into a string with commas.

On submit, run updateImage route.

On successful submit, setIsSuccessfulEdit(!isSuccessfulEdit) to trigger a useEffect to refetch imgInfo, and navigate to new url if title is changed. This will update the image info shown in the modal. This piece of state resides in imageViewPage.

## Delete Feature:

When user clicks the delete button, a tooltip asking "do you want to delete" appears under the delete button with a YES and NO button.

On no, just make tooltip go away.

On yes, run deleteImage route which gets the public ID from the url and deletes the image from Cloudinary and mongoDB.

After deletion, user is navigated to the home page.
