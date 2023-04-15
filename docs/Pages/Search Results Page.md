---
layout: default
title: Search Results Page
parent: Pages
nav_order: 2
---

#Search Results Page

The page that shows when a user searches for something.

##Usage:

This page shows search results. It uses a navbar, image gallery heading component, image gallery and footer.

When a user searches for something, they get moved to the search route+search parameters for sorting and filtering (ex: /search/dog?sort=most-recent&filter=all-types). These searchParams get changed when the sort or filter is changed from the drop down menu in the ImageGallerySortFilterAndSubheadingComponent component. When a user selects a sort or filter, it navigates to the current url but with the right searchParams. The GET request in the Search Result Page uses the searchParams in the URL to ask for the correct sorting/filtering of images in the NodeJS route.
