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
