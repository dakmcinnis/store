# Secure Store

> A demo of an online Store Model for Shopify's Summer 2021 Backend Developer Internship

Small businesses are always looking for an extra hand. They may not know how to spin up a website, keep track of their sales and profits over time or manage their inventory. To meet their needs, Secure Store has 3 key features:
1) Autonomy over stores, with a distinct separation from other businesses to empower them to build their brand
2) Simple configurations of stores, employees, responsibilities and products
3) A commitment to the security and efficiency of requests, so businesses can focus on their mission


## Overview

#### Decription

- The system supports multiple stores on one instance.
- Each store must have 1 owner, but can have any number of employees.
- A user can be an employee of any number of stores (even no store).
- An employee is added to the team by any other employee.
- Any employee can manage products and inventory.
   - Coming soon: option to require approvals from an admin employee

#### Notes

This system has been designed early with a prioritization on robustness, extensibility and authorization handling. The current features accessible to users are bare bones.


## Existing Users

TODO: COMPLETE

## Using the system

1) Setup Postman:
    - Download the collections file from: https://raw.githubusercontent.com/dakotamcinnis/store/master/Secure%20Store.postman_collection
    - Import the file into Postman

2) Each time you begin using the system, you must:
    - Generate an authentication token using the UI: https://store-shopify-technical.web.app
       - Note: Click "Sign Out" before generating a new token.
    - On all requests except for `api/users/signup`, you must provide an `Authorization` header with the value `bearer <sessionToken>`

Note: If you see the result `403: Forbidden` for a request that you should have access to, then your session token is expired. Return to the UI to generate a new one.

## Extensibility

#### Architecture

By leveraging Express, the architecture has benefitted from following a structure of root-level features having a common structure:
  - Model
  - Router
  - Controller

#### Middleware

Additionally, custom middleware for 2 key purposes:
  - Development efficiency
    - Common operations have been generalized, beyond simply utility functions
  - Runtime efficiency
    - If data is accessed in the middleware, we want to be sure we do not make duplicate requests to access the same information later on in the request cycle.
    - Data retrieved in middleware is stored for the duration of the request in `response.locals`.

This middleware includes:
  - Logging request information
  - Verifying a user is authenticated on the system
    - If successful, their user information is within `response.locals`
  - Verifying a user is authorized as an employee of a store
  - Verifying that documents along a path do or do not exist (to support proper error handling)
    - If successful, all documents that were read along the path have their data within `response.locals`

## Security Measures

#### Descriptions

**Employee Membership:**
- While the organization document does contain information about the owner, it does not contain the member ids (for security and in order to support the scaling of business). Instead, this document contains an `employeePrivateKey`. If a user's custom claims has the value `organizationId : employeePrivateKey` in their `isEmployee` map, then they gain access to the pending images of an organization.
- All requests obscure the `employeePrivateKey`. However, for debugging purposes, it can be seen on one's own GET request for their user object, only when the `debug` parameter is provided as `true`.

**Store Viewing:**
- The general public only has access to relevant information, such as the store name, store Id and support email.
- The owner and employees have access to all store data (ex: owner information) and analytics, other than the `employeePrivateKey`.

#### Technical Implementation

- Notice that any APIs (which are implemented by interacting with data in "admin" mode) do not expose undesired privileges to the incorrect users.

## Tech Stack

- Typescript
- Express.js
- Firebase
  - Hosting
  - Authentication Product (For user management)
  - Firestore Product (Database)
  - Cloud Functions (HTTPs Requests + Backend Triggers)


## Improvements

- Features to develop:
  - Managing & purchasing products
  - Analytics of inventory usage for employees
    - Option to opt-in to email notifications before inventory runs out
  - Create adminstrator role for full transparency of sales & profits over time
- Things to consider: Firebase does not allow you write WebSockets. Instead, it provides dynamic updates out-of-the-box, if clients access Firestore directly. To enable this functionality, we must:
    - Begin modifying `firestore.rules` to allow access to certain parts of the database based on user roles (ex: employee or owner)
    - Document clearly and remain consistent with what operations should be done from endpoints and what should be done directly with Firestore.
    - Migrate as much logic as possible to triggers, so that they cover modifications from endpoints, the Firebase console and the client.
  