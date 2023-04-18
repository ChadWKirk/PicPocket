---
layout: default
title: Editor Feature
parent: Coming Up
nav_order: 4
---

# Editor Feature

This is planning for a new way to edit image information.

The goal of this feature is to provide a more intuitive way for users to edit their image information on mobile and desktop. There will also be a way for users to edit their images in some capacity by using the Cloudinary Editor widget.

## Edit In Image Modal:

When user clicks on image in image gallery that is theirs, there is an edit (grey pencil) and delete (red background white trash can) button in the modal top bar.

When user clicks edit in modal, they get redirected to Modal_imageSelectEditable which is the same modal but the divs are inputs with same styling to make it look like user is editing the actual page.

In modal editable, there will be a “pic workshop” button that brings user to different page with Cloudinary Image editor widget where they can crop, etc.

### Delete in Image Modal:

Image Gallery pipeline:

- ImageGallery is rendered
- for each image rendered, titleArr.push(element.public_id). Once rendered completely, setTitleArrState(titleArr)
- image is clicked
- isShowingModal(true)
- imgToLoadInFirstModal(image clicked info)
- imgGalleryScrollPosition(scroll position)
- prevPageForModal(page image gallery is being rendered on) - for when user clicks out of modal
- navigate to imageViewPage
- show modal over imageViewPage
- let currentImgIndex = imgTitleArrState.indexOf(imgPublic_Id)

Delete in modal feature:

When user clicks on an image from imageGallery component and it belongs to them, they can delete it by clicking the delete button.

Needs - image public id

get public id from url

User clicks button > brings up yes or no modal > no = modal go away > yes = run deleteImage from MyPicsPage and shows next image in gallery

needs to keep - scroll pos, isShowingModal, prevPageForModal

on delete, imgTitleArrState gets filtered to remove element with public id of deleted public id

### Edit in Image Modal:

Image Gallery pipeline:

- ImageGallery is rendered
- for each image rendered, titleArr.push(element.public_id). Once rendered completely, setTitleArrState(titleArr)
- image is clicked
- isShowingModal(true)
- imgToLoadInFirstModal(image clicked info)
- imgGalleryScrollPosition(scroll position)
- prevPageForModal(page image gallery is being rendered on) - for when user clicks out of modal
- navigate to imageViewPage
- show modal over imageViewPage
- let currentImgIndex = imgTitleArrState.indexOf(imgPublic_Id)

Edit in modal feature:

When user clicks on an image from imageGallery component and it belongs to them, they can edit it by clicking the edit button.

Needs - image public id, current and new title, description, tags

get public id from url

get current image info from imgInfo.x

get new image info from typing in input fields

User clicks button > changes title, description and tags div's into inputs with current info as placeholder values > cancel = change inputs back to divs with old info > submit = run onSubmit from MyPicsPage, change inputs to divs with new info, change url to have new title, change imgTitleArr[index] to be new public id

## Edit in My Pics:

In My Pics on mobile, there will be a grey pencil icon at the right side end of image title which will show modal editable.
