---
layout: default
title: File Shrink On Upload
parent: Coming Up
nav_order: 4
---

# File Shrink On Upload

To make due with Cloudinary's free 10MB upload limit, I will be figuring out how to shrink the files before they hit Cloudinary. I have been working with the Cloudinary support team on this.

**They have sent me this:**

Hi Chad. It's dependent on use-case really. May I ask how you're using these images? Typically we only allow increasing the upload limit for paid accounts due to the cost that is incurred by us when dealing with larger images.

If you need to bump this up by a few megabytes, I'm sure we can help, even on a free account. If it's above 20MB though then I'm afraid you would likely need a paid account.

It's not offered on the main site, but we do offer a Small plan if needs be which I believe costs $29 per month if that would be of interest.

---

Quickly expanding on what @Danny shared, you may want to also consider running an incoming transformation on some of these larger images, if you don't need to store the original in your Cloudinary account. https://cloudinary.com/documentation/transformations_on_upload#incoming_transformations

This will discard the original and only upload the transformed version to Cloudinary, which may end up being closer to what you need.

Here is a sample Node.js script, where Cloudinary will automatically calculate the height of the image based on the specified percentage and the original aspect ratio. In this case, setting scale to 50 will resize the image to 50% of its original size, while maintaining the aspect ratio.

```
const cloudinary = require('cloudinary').v2;

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

// Define incoming transformation options
const transformation = {
  scale: 50,
  width: 1000
};

// Upload file with incoming transformation using a Promise
cloudinary.uploader.upload('PATH_TO_YOUR_FILE', {
  transformation: transformation,
  folder: 'YOUR_UPLOAD_FOLDER' // optional folder parameter
}).then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
```

---

Regardless of the upload limit size, I will have to resize the files since there's no telling what someone will try to upload.
