# Pixel

## Motivation
This project was created for the Shopify Backend Developer Intern challenge for Fall 2021. My goal was to create an image repository where users can sign in and upload photos, as well as search for images and delete them completely off the server.

## Overview
This project was created using Node/Express for the backend and Vue for the frontend. PostgreSQL is used for the database.

This project acts as a repository where users can upload or remove images. When uploading an image, they can specify a filename and tags for the image. They have the ability to search for specific image tags to filter images, or view all of their images at once. Since each user has their own account, they are in control of their images and no other users can access them.

Only image files with extension .png, .jpg, .jpeg, and .gif can be uploaded (case sensitive). The maximum file size is 5 mb.

## Setup
This repository contains 2 folders, server (backend) and pixel (frontend). The server side requires a .env file, where you must input details such as port, access token (whatever you want it to be), and database variables. A blank .env file is available for ease of setup.

First, a PostgreSQL database must be created and 2 tables must be added to it.

Table 1:
```psql
CREATE TABLE users(user_id serial PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password TEXT NOT NULL);
```
Table 2:
```psql
CREATE TABLE images(image_id serial PRIMARY KEY, tags TEXT [], name VARCHAR(50) NOT NULL, path TEXT NOT NULL,username VARCHAR(50) NOT NULL, FOREIGN KEY(username) REFERENCES users(username));
```

The server side can be run by opening a terminal in the server directory and running:
```javascript
npm install
npm run start
```

The client side can be run by opening a terminal in the pixel directory and running:
```javascript
npm install
npm run serve
```

You should now be able to visit http://localhost:8080/ where you will be prompted to login/create an account.

You can also visit https://thepixelapp.herokuapp.com/ to access a hosted instance of the application.

## Design Choices
### Technologies
I decided to use Express for the server side as it is able to do rapid server side development. Additionally, the flexibility and ease of adding middleware is another benefit which I found helpful for this particular project.

For the front end, I decided to go with Vue since it provides very easy setup with Vuex and Vue-Router. This significantly cut down the time it took to develop the client side. Vuetify also helped create responsive componenets easily.

As for my choice of database, I decided to use the PostgreSQL due to it's large feature set and strict schema settings. Since I knew what the layout of my data was going to look like, I decided this would be the best option to store data.

### User Authentication
User authentication is done with jwt. When a user creates an account, their password gets hashed and stored into the database along with their unique username. A token is generated from a token secret (in the .env file) as well as the username of the user. This token currently does not expire and can be used indefinitely. 

### File Uploads
A logged in user can upload a new image by clicking the + in the appbar. They are required to fill out the file name and tags field, as well as provide a file. The file must be of format .png, .jpg, .jpeg, or .gif. All other files will be rejected. Additionally, the file can have a maximum size of 5 mb. This file is then stored on server and can be accessed with a valid filepath. A user can view and choose to delete their file by clicking on it in the gallary.

### Tag Search
Images are tagged when uploaded and can be searched. Currently there is no limit to the number of tags an image can have (might have to enforce a limit as next steps). In order to search for a tag, type the tag into the search bar and press enter. This will return all the images with the specified tag. In order to view all images again, search an empty string and press enter. This will display all images.

## Next Steps
In order to expand the functionality of this project a few major things come to mind.

1. I want to incorporate a machine learning algorithm that analyzes images and suggests tags to add. This should be relatively simple to include through transfer learning and can help the user organize their images better.

2. Adding a method for bulk uploads of images. This would reduce the amount of time it takes for the user to upload images in comparison to the current strategy.

3. Increasing the security of the application, where images are encypted and stored and are only available to their owner. Currently, the images can be accessed by anyone if the url is guessed correctly, which can cause problems with security.

Some other minor things I want to add include the ability to modify tags once an image is uploaded, adding better error messages on the cient side, as well as adding expiry to authentication tokens for enhanced security.
