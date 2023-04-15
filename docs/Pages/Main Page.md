---
layout: default
title: Main Page
parent: Pages
nav_order: 2
---

#Main Page

The home page

##Usage:

Main Page is the home page. It uses a navbar, hero section, image gallery, and join now section.

####Most-Recent / Most Popular:

To handle whether it is showing images sorted by Most Recent or Most Popular, there is a MainPageContent component inside the MainPage.js with a Page prop that determines the sorting. That prop is passed manually when creating the route in App.js, allowing for the use of the same component for both Most Recent and Most Popular. This is so you can change just one component (the MainPageContent component) and it applies to both / and /most-popular instead of having to change both pages when updating the format or styling etc..
