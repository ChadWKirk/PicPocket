---
layout: default
title: How Likes Work
parent: Functions
nav_order: 3
---

#How Likes Work

1. Image gallery renders

1. If image is liked by currently logged in user, like button renders with red heart icon, else like button renders as like button with empty heart icon.

1. When user clicks like button, handleLike function runs. If image.likedBy contains currently logged in user’s username, remove that name from image.likedBy. Else, add name to image.likedBy. Image gallery rerenders and shows like button change to either red heart or empty heart. When like button renders with red heart, a css animation runs to create a red heart pulse effect.
