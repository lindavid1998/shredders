# Shredders

Shredders is a **PERN** web application designed to help snowboarders plan trips and see which of their friends have overlapping trips. It was created as an exercise for using PostgreSQL with React/Express and to provide a fun tool for snowboarders.

The idea came about last snowboard season when I ran into some friends by chance on the mountain and thought it'd be nice if there was a way to know ahead of time which friends had overlapping trips with you!

## Table of Contents
1. [Features](#features)
2. [Demo](#demo)
3. [Usage/Examples](#usageexamples)
   - [Landing page](#landing-page)
   - [Login and signup pages](#login-and-signup-pages)
   - [Home page for authenticated user](#home-page-for-authenticated-user)
   - [Search users and add friends](#search-users-and-add-friends)
   - [Incoming friend requests](#incoming-friend-requests)
   - [Creating a trip](#creating-a-trip)
   - [Inviting friends to an existing trip](#inviting-friends-to-an-existing-trip)
   - [View RSVPs](#view-rsvps)
   - [See which friends have overlapping trips with you](#see-which-friends-have-overlapping-trips-with-you)
   - [Comment and discuss trip plans](#comment-and-discuss-trip-plans)
   - [Upload avatar](#upload-avatar)
   - [Responsive design](#responsive-design)
4. [Tech Stack](#tech-stack)
5. [Features to Add](#features-to-add)
6. [Documentation](#documentation)
7. [Obstacles](#obstacles)
   - [Issues with Deployment](#issues-with-deployment)
   - [Backend and Frontend Integration](#backend-and-frontend-integration)
   - [Database Queries](#database-queries)
   - [Frontend Behavior](#frontend-behavior)
   - [Authentication and Authorization](#authentication-and-authorization)
8. [FAQ](#faq)
9. [Acknowledgements](#acknowledgements)

## Features

- User authentication (login and sign up)
- Search users and add friends
- Create trips
- Invite friends to trips (searchable)
- View all upcoming and past trips on the home page
- View RSVPs and headcount for each trip
- See which friends have overlapping trips with you
- Add/delete comments to trip pages to discuss and plan
- Upload avatars
- Responsive design for mobile and desktop screens
- Client side routing
- Form validation (client-side and Express)

## Demo

https://shredders-client.onrender.com

**NOTE:** Render spins down a Free web service that goes 15 minutes without receiving inbound traffic. Render spins the service back up whenever it next receives a request to process.
Spinning up a service takes up to a minute, which causes a noticeable delay for incoming requests until the service is back up and running. For example, a browser page load will hang temporarily.

[Figma Design](https://www.figma.com/design/BddAvshSylaBZxLh8ZFeCQ/Shredders?node-id=0-1&m=dev&t=KhI4qMn9wtrYecOo-1)

## Usage/Examples

### Landing page

<img src="./shredders-demo/login/landing.png?raw=true" alt="Landing page" width="400">

### Login and signup pages

<img src="./shredders-demo/login/login.png?raw=true" alt="Login page" width="400">

<img src="./shredders-demo/login/create_account.png?raw=true" alt="Create account page" width="400">

### Home page for authenticated user where they can view all their upcoming and past trips

<img src="./shredders-demo/home/no_trips.png?raw=true" alt="Home page with no trips" width="400">

<img src="./shredders-demo/home/with_trips.png?raw=true" alt="Home page with trips" width="400">

### Search users and add friends

<img src="./shredders-demo/add-friends/add_1.png?raw=true" alt="Add friends step 1" width="400">

<img src="./shredders-demo/add-friends/search.png?raw=true" alt="Search users" width="400">

<img src="./shredders-demo/add-friends/add_2.png?raw=true" alt="Add friends step 2" width="400">

### Incoming friend requests will show a badge notification in the navbar 

<img src="./shredders-demo/add-friends/notification.png?raw=true" alt="Friend request notification" width="400">

<img src="./shredders-demo/add-friends/friend_request.png?raw=true" alt="Friend request" width="400">

### Creating a trip

<img src="./shredders-demo/create/create_1.png?raw=true" alt="Creating a trip step 1" width="400">

<img src="./shredders-demo/create/create_2.png?raw=true" alt="Creating a trip step 2" width="400">

<img src="./shredders-demo/create/create_4.png?raw=true" alt="Creating a trip step 3" width="400">

<img src="./shredders-demo/create/create_3.png?raw=true" alt="Creating a trip step 4" width="400">

### Inviting friends to an existing trip

<img src="./shredders-demo/invite/invite.png?raw=true" alt="Inviting friends to a trip" width="400">

### View RSVPs

<img src="./shredders-demo/overlap/overlap_1.png?raw=true" alt="Viewing RSVPs" width="400">

### See which friends have overlapping trips with you

<img src="./shredders-demo/overlap/overlap_2.png?raw=true" alt="Overlapping trips" width="400">

### Comment and discuss trip plans

<img src="./shredders-demo/comment/comment.png?raw=true" alt="Commenting on trip plans" width="400">

### Upload avatar

<img src="./shredders-demo/avatar/edit_1.png?raw=true" alt="Editing avatar step 1" width="400">

<img src="./shredders-demo/avatar/edit_2.png?raw=true" alt="Editing avatar step 2" width="400">

### Responsive design for mobile and desktop screens

<img src="./shredders-demo/mobile-design/mobile_design.png?raw=true" alt="Responsive design" width="400">

## Tech Stack

**Frontend:**
- React
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token)

**Web app hosting:**
- Render

**File storage and DB hosting:** 
- Supabase

### Why These Technologies?

**React:** 
- Standard library for reusable UI components

**Vite:** 
- Build tool optimized for React with minimal configuration needed

**Tailwind:** 
- Allows applying styles directly in the React components, reducing the need for custom classes

**React Router:**
- Client side routing to reduce server load and seamless transitions between pages

**Node/Express:** 
- Keeps coding language consistent between frontend and backend

**PostgreSQL:**
- Supports complex queries that were needed to fetch structured, related data

**JWT:** 
- Compact and efficient way to send authentication data between client and server
- Contains all relevant info in payload about authenticated user

**Render:** 
- Good free tier for hosting both client and server
- Quick to spin up applications

**Supabase:** 
- Easy to use interface and good free tier option for storage and database
- Database can be easily configured with their table/SQL editor

## Features to Add

- Add button to edit RSVP to trip
- Cancel sent friend request
- Edit comments
- Edit trip (i.e. destination, dates)

## Documentation

[Backend API Reference](./server/README.md)

Database schema

<img src="./shredders-demo/schema.png?raw=true" alt="Database schema" width="400">

## Obstacles
### Issues with Deployment
- **CORS Configuration:**
  - **Problem:** Requests from the deployed frontend weren't going through, despite working in Postman and local testing.
  - **Solution:** The CORS origin on the server was not set to allow the deployed client. Updated the server to set the origin based on an environment variable.
- **Client-Side Routing:**
  - **Problem:** Receiving 404 errors when the client was routed to any subroutes.
  - **Solution:** Redirect all routes to the `index.html` build file. Render has a feature to handle this: [Using Client-Side Routing](https://docs.render.com/deploy-create-react-app#using-client-side-routing).
- **Hero Image Not Displaying:**
  - **Problem:** Hero image was not showing up; it received an inline style of `background-image: none`.
  - **Solution:** Could not find any CSS or inline styles causing this. Got around the issue by using an `img` element instead of a `div`. Unsure about root cause.

### Backend and Frontend Integration
- **Form Submission Issue:**
  - **Problem:** Getting a `TypeError: Failed to fetch` due to page refreshing before the response could be sent back.
  - **Solution:** Disabled the default form submission behavior to prevent the page from refreshing.
- **Dropdown Options not Populating**
  - **Problem:** The invite friends dropdown on the plan trip page didn't show options at first because the component rendered before fetching data.
  - **Solution:** Used a custom `useLoad` hook, passing in the API call to ensure the component didn't render until the API call returned a response.
- **Date Inconsistency:**
  - **Problem:** The dates entered in the form were consistent with what was uploaded to the database but displayed off by 1 day on the client. This issue was not present on the local app. It was determined that while the trip dates were being stored as a date type in the SQL database, running `pool.query` on the server converts them to a JavaScript date object with a UTC timezone like `2024-04-07T00:00:00.000Z`. However, when formatting this date on the client using the `Date.getDate()` method, the day of the local timezone was returned. For example, the date `2024-04-07` would be returned from the query as `2024-04-07T00:00:00.000Z`, and `getDate()` would return 6 in local PDT time instead of 7.
  - **Solution:** Converted the query result back to a string with the `YYYY-MM-DD` date format instead of using the Date methods.

### Database Queries
- **Combining User and Friend Data:**
  - **Problem:** In the 'Add Friends' sidebar, needed a way to fetch all users and indicate if they were friends or if a friend request was pending.
  - **Solution:** Used a `CASE` clause in SQL. Left-joined the `user` table with the `friends` and `friend requests` tables, setting a status (e.g. pending) based on the joined row.

### Frontend Behavior
- **Comment Deletion:**
  - **Problem:** Deleting a comment other than the last one expanded the adjacent comment’s dropdown menu. The dropdown for any specific comment should only expand when clicked. 
  - **Solution:** This behavior was due to event propogation, where clicking a dropdown menu item triggered the dropdown icon's click handler. Fixed by disabling propogation.
- **Comment Edit Icon Not Shown:**
  - **Problem:** Edit icon for comments was not showing up after user initially logged in 
  - **Solution:** The user object keys between login response and `useAuth` hook were inconsistent. Login response would return `id` key while `useAuth` hook returned `user_id` key. Updated the backend logic for the login response to return `user_id` instead of `id`.
- **Dropdown Menu for Inviting Friends:**
  - **Problem:** Wanted the dropdown to persist while clicking the options but hide when clicking outside the dropdown. Using the `onblur` handler wouldn't work because clicking on the options counted as a blur and would hide the menu.
  - **Solution:** Created a reference to the dropdown container and a `handleBlur` callback that hides the dropdown only if the newly focused element is either `null` (non-focusable) or not a child of the dropdown container. This seems to be a common design pattern in React.

### Authentication and Authorization
- **useAuth Hook and JWT:**
  - **Problem:** Server was sending JWT token as a cookie, but cookie would not persist on the client
  - **Solution:** Modified CORS config to specify the client domain and included credentials with requests.
- **Private Routes and Refresh:**
  - **Problem:** Refreshing a private route always redirected to the login page.
  - **Solution:** This was because the `user` state variable in the `useAuth` hook was reset to null upon refresh, and it takes time for the client to call the backend and update it. Fixed by adding a `loading` state variable and used it to only render the private route once the fetch call completed.

## FAQ

#### What is the purpose of the `useAuth` hook in the client?
Provides a modular way to protect routes in the application. By wrapping the application with an authentication context, it allows us to check if the user is authenticated anywhere in the React app. If the user is not authenticated, the protected route can redirect them to the login page; otherwise, it will render the child components. The hook also returns data about the authenticated user, such as the user's name and avatar URL.

#### What is the purpose of the `useLoad` hook?
Accepts a callback and manages the `isLoading` state of asynchronous data fetching. Initializes `isLoading` to true and sets it to false once the callback completes. The state variable can then be used to display a loading spinner.

## Acknowledgements
 - Images downloaded from Unsplash
 - Icons from Font Awesome
