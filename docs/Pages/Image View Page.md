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
