# YouTube Comments Viewer

This web app allows users to log in with their Google account and view all the comments they've made under YouTube videos. The app fetches the data using YouTube's API and displays it in a user-friendly format. It is hosted on GitHub Pages for easy access and demo purposes.

## Features
- **Google OAuth Login**: Login with your Google account to access your YouTube comments.
- **View YouTube Comments**: Fetch and display all comments made by the logged-in user on YouTube.
- **Responsive Design**: The app is responsive and works across various screen sizes.
- **Hosted on GitHub Pages**: View the live demo and deploy easily.

## Live Demo

You can check out the live demo of the app hosted on GitHub Pages at the following URL:

[https://shalashanka.github.io/youtube-comments/](https://shalashanka.github.io/youtube-comments/)

## Technologies Used
- **React**: For building the frontend of the app.
- **Vite**: A fast and optimized development environment for building React apps.
- **Firebase Authentication**: For handling Google OAuth login.
- **YouTube API**: To fetch comments from the user's YouTube account.

## Prerequisites

Before running this app locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://npmjs.com) (Node package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shalashanka/youtube-comments.git

2. Navigate to the project directory:

  ```bash
  cd youtube-comments
  ```

3. Install the required dependencies:

  ```bash
  npm install
  ```

## Set up Firebase

To enable Google authentication, you need to set up Firebase in your project.

Go to Firebase Console.

Create a new project (or use an existing one).

Enable Firebase Authentication (Google provider) in your Firebase console.

Copy the Firebase configuration object from the Firebase console.

Create a firebaseConfig.js file in the src/ folder of your project and paste the configuration object there.

Example:

```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
```
## Running the App Locally
Once everything is set up, you can run the app locally:

  ```bash
  npm run dev
