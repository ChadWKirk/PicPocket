---
layout: default
title: How Downloading Images Works
parent: Functions
nav_order: 3
---

# How Downloading Images Works

### Single Download:

1. Cloudinary has a URL flag (fl_attachment) that can be used to download an image when clicking the link.

Example: https://res.cloudinary.com/dtyg4ctfr/image/upload/q_100/fl_attachment/v1681070037/picpocket/6FA2BB75-6EA1-40F1-9EAE-8C12E0D9BC87-373466

2. Doesn’t actually change the window location when clicking link, just downloads the file.

### Multi Image Download:

1. In My Pics page, user can download multiple images at one time when they check off multiple images.

2. When user clicks the mass download button, massDownloadImages() runs. Creates an array of public ID’s based on images that are checked off, send that array to server.js using fetch GET request, cloudinary.utils.download_zip_url to create a zip file in cloudinary (saved) and returns a link as the result, send download link as response back to client, change window location url to download link.

3. Doesn’t actually change the window location, it just downloads the .zip.
