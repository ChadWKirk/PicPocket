---
layout: default
title: Image View Modal
parent: Pages
nav_order: 2
---

# Image View Modal

The modal that appears when a user clicks on an image in the Image Gallery component. Displays the image, like button, download button, image info, and image author info.

## Usage:

This isn't it's own page, but it's kinda like that. It is rendered on first render of Image View Page.

When an image in ImageGallery is clicked, a state of the current scroll position is stored and isShowingImageSelectModal is set to true (in App.js). Body overflow style is set to hidden to make body not scrollable while modal is up.

Clicking the left/right arrow icons (not tags) shows the next or previous image in the ImageGallery. This is done by holding an array of image public ID's called imgTitleArrState when an ImageGallery component renders, which gets passed to the Image Modal component. When clicking the arrows, it changes the URL to have the public ID of the imgTitleArrState index either 1 behind or 1 in front of the current index.

When clicking the black background or the X button of the modal, it brings you back to the previous page where the image gallery was rendered (ex: main page, search results page, etc.). This is done by storing the page in state in App.js and navigating to that page when clicked. It also automatically scrolls to the scroll position stored in state and sets body overflow style to auto to add scrollability back.

When user refreshes in modal, it brings them to ImageViewPage due to isImageSelectModal being reset to false (default in App.js).

When clicking the back or forward buttons for the browser, the Image View Page rerenders when the URL changes, causing a refetch of the imginfo and userInfo.

## Edit Feature:

When user clicks on image in image gallery that is theirs, there is an edit and delete button in the modal top bar.

When user clicks the edit button in the modal, isEditable gets set to true and the divs showing image info get hidden and input forms get shown. When button is clicked again, it returns the divs and hides the input fields by setting isEditable(false).

The default values of the input fields are the image's current info. The tags are the array of tags but turned into a string with commas.

When user clicks the nav arrows on either side of the modal, isEditable(false).

On submit, run updateImage route.

On successful submit, setIsSuccessfulEdit(!isSuccessfulEdit) to trigger a useEffect to refetch imgInfo, and navigate to new url if title is changed. This will update the image info shown in the modal. This piece of state resides in imageViewPage.

For success/error toasts, there are separate css classes for them so they are placed correctly in the modal page.

## Delete Feature:

When user clicks the delete button in the modal, a tooltip asking "do you want to delete" appears under the delete button with a YES and NO button.

On no, just make tooltip go away.

On yes, run deleteImage route which gets the public ID from the url and deletes the image from Cloudinary and mongoDB.

Upon successful deletion, imgTitleArrState is changed to remove the deleted pic from it so it is no longer in the list when user goes back and forth with modal arrows.

After deletion, user is navigated to the next image in the gallery.
