---
layout: default
title: File Shrink On Upload
parent: Coming Up
nav_order: 4
---

# File Shrink On Upload

To make due with Cloudinary's free 10MB upload limit, I will be figuring out how to shrink the files before they hit Cloudinary. I have been working with the Cloudinary support team on this.

I think I will use [browser-image-compression](https://www.npmjs.com/package/browser-image-compression). It looks promising.

It allows you to set the max MB size after copmression, which is great because I can programattically make it so each image is the max quality possible without going over 10MB.

Regardless of the upload limit size, I will have to resize the files since there's no telling what someone will try to upload.
