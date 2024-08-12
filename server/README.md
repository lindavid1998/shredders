# Shredders API Reference

## Table of Contents
1. [Authentication](#authentication)
2. [Trips](#trips)
3. [Friends](#friends)

## Authentication

### POST /auth/signup

This endpoint is used to sign up a new user.

#### Request

- email (string, required): The email of the user.
    
- password (string, required): The password for the user account.
    
- first_name (string, required): The first name of the user.
    
- last_name (string, required): The last name of the user.
    

``` json
{
    "email": "david@email.com",
    "password": "*******",
    "first_name": "David",
    "last_name": "Lin"
}
```

#### Response

**Status: 200 OK**

``` json
{
    "user": {
        "user_id": 20,
        "email": "david@email.com",
        "first_name": "David",
        "last_name": "Lin",
        "avatar_url": "example.com/image.png"
    }
}
```

**Status: 409 Conflict**

``` json
{
    "errors": [
        {
            "msg": "Email already in use"
        }
    ]
}
```

**Status: 400**

``` json
{
    "errors": [
        {
            "type": "field",
            "value": "123",
            "msg": "Password must be at least 5 characters",
            "path": "password",
            "location": "body"
        }
    ]
}
```

### POST /auth/login

This endpoint allows users to log in and obtain authentication credentials.

#### Request

- `email` (string, required): The email address of the user.
    
- `password` (string, required): The password of the user.


``` json
{
  "email": "user@example.com",
  "password": "********"
}
```

#### Response

**Status: 200 OK**

Returns JWT as a cookie
    

``` json
{
   "user": {
        "email": "david@email.com",
        "first_name": "David",
        "last_name": "Lin",
        "avatar_url": "example.com/image.png",
        "user_id": 5
    }
}
```

**Status: 401**

``` json
{
    "errors": [
        {
            "msg": "Incorrect email or password"
        }
    ]
}
```

### GET /auth/user

This endpoint is used to get the user object of the current authenticated user.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### Response

**Status: 200 OK**

``` json
{
    "user": {
        "user_id": 20,
        "first_name": "David",
        "last_name": "Lin",
        "email": "david1@email.com",
        "avatar_url": "https://example.com/image.png"
        "iat": 1723416044,
        "exp": 1723419644
    }
}
```

**Status: 403 Forbidden**

- Occurs if the user is not authenticated
    
``` json
{
    "errors": [
        {
            "msg": "not authorized, no JWT token"
        }
    ]
}
```

### POST /auth/logout

The endpoint logs the user out from the application.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### Response

**Status: 200**
     
``` json
"successfully logged out"
```

# Trips

##  GET /trips/destinations

Retrieves list of destinations mapped to their IDs

#### Request

This request does not require a request body.

#### Response

**Status: 200**

``` json
{
    "Brighton": 3,
    "Palisades": 4,
    "Bear Mountain": 2,
    "Mammoth": 1
}
```

### GET /trips/overview

This endpoint retrieves an overview of trips. Each trip includes details such as the trip ID, start date, end date, name, image URLs, and RSVP details for each trip, excluding those who have declined.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### Response

**Status: 200**

- `id` (number): The unique identifier for the trip.
    
- `start_date` (string): The start date of the trip.
    
- `end_date` (string): The end date of the trip.
    
- `name` (string): The name of the trip.
    
- `image_large_url` (string): The URL for the large image associated with the trip.
    
- `image_small_url` (string): The URL for the small image associated with the trip.
  
- `rsvps` (array): An array containing RSVP details for the trip, including user_id, avatar_url, and status for each RSVP. Excludes users who have declined the RSVP.
    

``` json
[
    {
        "id": 40,
        "start_date": "2024-12-02",
        "end_date": "2024-12-07",
        "name": "Palisades",
        "image_large_url": "https://i.imgur.com/JUS8aoW.jpg",
        "image_small_url": "https://i.imgur.com/MB5YRHx.jpg",
        "rsvps": [
            {
                "user_id": 5,
                "avatar_url": "example.com/avatar.png",
                "status": "Going"
            },
            ...
        ]
    },
    ...
]
```

### POST /trips/create

This endpoint is used to create a trip.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

- `destination_id` (Number): The ID of the destination for the trip.
    
- `start_date` (String): The start date of the trip.
    
- `end_date` (String): The end date of the trip.
    
- `added_friends` (Array): List of invited friends (Object)
    

``` json
{
    "destination_id": 1,
    "start_date": "2024-01-03",
    "end_date": "2024-01-05",
    "added_friends": [
        {
            "id": 2,
            ....
        },
        {
            "id": 3,
            ....
        }
    ]
}
 ```

#### Response

**Code: 200 OK**

``` json
{
    "trip_id": 6
}
 ```

**Code: 400 Bad request**

``` json
{
    "errors": [
        {
            "type": "field",
            "msg": "End date cannot be empty",
            "path": "end_date",
            "location": "body"
        },
        ....
    ]
}
 ```

### GET /trips/:id

This endpoint retrieves trip information, including:

- Destination
- Dates
- RSVPs 
- Comments
- List of friends on overlapping trips
    
#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### Response

Code: 200 OK

``` json
{
    "start_date": "2024-12-02",
    "end_date": "2024-12-07",
    "location": "Palisades",
    "creator_id": 5,
    "creator_first_name": "David",
    "creator_last_name": "Lin",
    "image_large_url": "https://i.imgur.com/JUS8aoW.jpg",
    "image_small_url": "https://i.imgur.com/MB5YRHx.jpg",
    "rsvps": [
        {
            "id": 130,
            "user_id": 9,
            "status": "Tentative",
            "first_name": "Jordan",
            "last_name": "Burgess",
            "avatar_url": "example.com/image.png"
        },
        ...
    ],
    "comments": [
        {
            "id": 61,
            "body": "i can!",
            "user_id": 9,
            "created_at": "2024-08-07T04:15:11.441Z",
            "first_name": "Jordan",
            "last_name": "Burgess",
            "avatar_url": "example.com/image.png"
        },
        ...
    ],
    "friends_on_overlapping_trips": [
        {
            "user_id": 8,
            "first_name": "Genevieve",
            "last_name": "Mclean",
            "avatar_url": "example.com/image.png"
        },
        ...
    ]
}

 ```

**Code: 403 Forbidden**

- If user is not authenticated
    

``` json
{
    "errors": [
        {
            "msg": "not authorized, no JWT token"
        }
    ]
}

 ```

### GET /trips/:trip_id/invite/status

This endpoint retrieves the invitation status for a specific trip.

#### Response

**Status: 200**

``` json
[
    {
        "user_id": 6,
        "full_name": "Amanda Lowery",
        "avatar_url": "example.com/image.png",
        "is_invited": true
    },
    {
        "user_id": 8,
        "full_name": "Genevieve Mclean",
        "avatar_url": "example.com/image.png",
        "is_invited": false
    },
    ...
]

 ```

### POST /trips/:trip_id/invite/:user_id

This endpoint allows the user to send an invitation for a trip with the specified trip ID to the user with the given ID.

#### **Request**

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### **Response**

**Status: 200**

- Returns a list of updated RSVPs
    

``` json
{
    "rsvps": [
        {
            "id": 130,
            "user_id": 9,
            "status": "Tentative",
            "first_name": "Jordan",
            "last_name": "Burgess",
            "avatar_url": "example.com/image.png"
        },
        ...
    ]
}

 ```

**Status: 500**

- Throws error if user has already been invited
    

``` json
"user is already invited to trip"
 ```

### POST /trips/:id/comments

This API endpoint allows the user to add a comment to a specific trip identified by the ID in the URL.

#### Request

- `body` (string, required): The content of the comment.
   
``` json
{
  "body": "this is a comment",
}
```

#### Response

Status: 200

- `id` (number): The unique identifier of the comment.
    
- `body` (string): The content of the comment.
    
- `user_id` (number): The unique identifier of the user who posted the comment.
    
- `created_at` (string): The timestamp when the comment was created.
    
- `trip_id` (number): The unique identifier of the trip to which the comment belongs.
    

``` json
{
    "id": 9,
    "body": "this is a comment",
    "user_id": 5,
    "created_at": "2024-06-24T06:13:21.268Z",
    "trip_id": 12
}

 ```

## DELETE /trips/:id/comments/:comment_id

Deletes comment from a trip

#### Response

**Status: 200**

``` json
"successfully removed comment"
 ```

**Status: 400**

``` json
{
    "errors": [
        {
            "msg": "comment does not exist"
        }
    ]
}
 ```

**Status: 400**

``` json
{
    "errors": [
        {
            "msg": "only the owner of the comment can delete"
        }
    ]
}
 ```

# Friends

### GET /friends

#### Response

**Status: 200**

``` json
[
    {
        "first_name": "Amanda",
        "last_name": "Lowery",
        "id": 6,
        "full_name": "Amanda Lowery"
    },
    ...
]
 ```

**Status: 403**

``` json
{
    "errors": [
        {
            "msg": "not authorized, no JWT token"
        }
    ]
}
 ```

### GET /friends/requests

The endpoint retrieves a list of friend requests.

#### Response

Status: 200

- `id` (number): The unique identifier of the friend request.
    
- `from_user_id` (number): The user ID of the sender of the friend request.
    
- `first_name` (string): The first name of the sender.
    
- `last_name` (string): The last name of the sender.
    
- `avatar_url` (string): The URL of the sender's avatar.
    

``` json
[
    {
        "id": 50,
        "from_user_id": 17,
        "first_name": "Eric",
        "last_name": "Chan",
        "avatar_url": "example.com/image.png"
    },
    ....
]
 ```

### POST /friends/add/:user_id

This endpoint allows the user to add a friend with the specified ID.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |
    

#### Response

**Status: 200**

- friend_request_id (integer): A unique identifier for the friend request created
    

**Status: 500**

``` json
{
    "errors": [
        {
            "msg": "friend request already exists"
        }
    ]
}
 ```

### POST /friends/accept/:friend_req_id

This endpoint is used to accept a friend request.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |
    

#### Response

**Status: 200**

``` json
OK
 ```

**Status: 500**

``` json
{
    "errors": [
        {
            "msg": "friend request does not exist"
        }
    ]
}
 ```

### POST /friends/reject/:friend_req_id

This endpoint is used to reject a friend request.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |
    

#### Response

**Status: 200**

``` json
OK
 ```

**Status: 500**

``` json
{
    "errors": [
        {
            "msg": "friend request does not exist"
        }
    ]
}
 ```

# Misc

### GET /users

This endpoint is used to retrieve a list of users and their status (relation) to the user.

#### Request

Headers

|Content-Type|Value|
|---|---|
|token| _JWT encrypted token_ |

#### Response

- user_id (integer)
    
- avatar_url (string)
    
- full_name (string)
    
- status (int): 0 for not friends, 1 for pending friend request, and 2 for friends
    
``` json
[
    {
        "user_id": 7,
        "avatar_url": "example.com/image.png",
        "full_name": "Ashton Blackwell",
        "status": 0
    },
    ...
]
 ```

### POST /avatar/upload

This endpoint allows you to upload an avatar.

#### Request

Body FormData

|Param|value|Type|
|---|---|---|
|avatar|/avatar.png|file|
    
#### Response

**Status: 200**

- Updates JWT payload to include new avatar url and returns it as a cookie
