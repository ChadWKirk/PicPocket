---
layout: default
title: My Pics Page
parent: Pages
nav_order: 2
---

# My Pics Page

The page that shows the user their uploaded pics. The user can delete, download, sort, filter and edit the image’s info here.

## Usage:

In this page there is a navbar, heading section, image gallery and footer.

### Image gallery:

#### Desktop:

The image gallery is divided into 2 parts, the image cards section and the image info editor section. The image cards each contain the image, the image info, and a checkbox. The editor displays the image’s info as well as delete, submit and download buttons when a single image is selected/checked off. There is also a Select All checkbox, delete all button and download all button at the top of the image gallery.

#### Mobile:

The width of the window is tracked in React, not CSS for the My Pics Page. When under a certain amount of pixels, a state is turned to true to render a certain view of the Image Gallery.

The image gallery turns into a flex container in column direction of cards with image thumbnail, image info and checkbox. When a single image card is selected/checked, it expands to show an editor form with submit, download and delete buttons.

**How checkboxes work:**

1. Page renders

1. fetches images uploaded by user

1. Array of images get put into ImgData state

1. For the length of ImgData array, create an array of false values signifying all checkboxes are false by default

1. Map over ImgData to create image cards with checkboxes

1. When a checked box is clicked, uncheck function runs and vice versa

1. Check/Uncheck function = create muteable array from state of checkbox array > create variable with state of checkbox being clicked using index being passed down from map > change variable to true/false depending on if checking or unchecking > change muteable array [index] to value of new variable > change state of checkbox array to muteable array
